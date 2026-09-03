import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'
import pdfWorkerUrl from 'pdfjs-dist/legacy/build/pdf.worker.mjs?url'

export const studentHistoryImportFormat = 'pomi-student-history'
export const studentHistoryImportVersion = 1

export type StudentHistoryImportCourse = Readonly<{
  code: string
  name: string
  grade: number | null
  workloadHours: number | null
  credits: number | null
  status:
    | 'APPROVED'
    | 'APPROVED_BY_ATTENDANCE'
    | 'DROPPED'
    | 'FAILED_BY_ATTENDANCE'
    | 'SUFFICIENT'
}>

export type StudentHistoryImportSemester = Readonly<{
  year: number
  yearPeriod: 'FIRST_SEMESTER' | 'SECOND_SEMESTER' | 'SUMMER' | 'WINTER'
  courses: ReadonlyArray<StudentHistoryImportCourse>
}>

export type StudentHistoryImport = Readonly<{
  format: typeof studentHistoryImportFormat
  version: typeof studentHistoryImportVersion
  student: Readonly<{ ra: string }>
  semesters: ReadonlyArray<StudentHistoryImportSemester>
}>

export type StudentHistoryParseWarning = Readonly<{
  page: number | null
  line: string
  message: string
}>

export type StudentHistoryParseResult = Readonly<{
  value: StudentHistoryImport
  warnings: ReadonlyArray<StudentHistoryParseWarning>
}>

const semesterPattern = /^(1|2)º Semestre de (\d{4})\b/
const raPattern = /Registro Acadêmico[\s\S]{0,120}?\b(\d{6})\b/
const codePattern = /^[A-Z]{1,3}(?:\s+\d{3,4}|\d{3,4})$/
const rowPattern = new RegExp(
  `^\\s*([A-Z]{1,3}(?:\\s+\\d{3,4}|\\d{3,4}))\\s+(.*?)\\s{2,}((?:\\d+[,.]\\d+)|---)\\s{2,}(\\d+|-)\\s{2,}(\\d+|-)\\s{2,}(.+?)\\s*$`,
)

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

function parseNumber(value: string) {
  if (value === '---' || value === '-') return null
  return Number(value.replace(',', '.'))
}

function statusFor(value: string) {
  const status = value.replace(/ﬁ/g, 'fi').replace(/\s+/g, ' ').trim()
  if (status.includes('Aprovado por Nota')) return 'APPROVED' as const
  if (status.includes('Aprovado por Frequência'))
    return 'APPROVED_BY_ATTENDANCE' as const
  if (status.includes('Aprovado - Proficiência')) return 'SUFFICIENT' as const
  if (status.includes('Suficiente')) return 'SUFFICIENT' as const
  if (status.includes('Reprovado por Frequência'))
    return 'FAILED_BY_ATTENDANCE' as const
  if (status.includes('Desistência')) return 'DROPPED' as const
  return undefined
}

function cleanName(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

function isNoise(value: string) {
  return (
    !value ||
    value === 'Código Nome da Disciplina Média CH Crd Situação' ||
    value.startsWith('Prof ') ||
    value.startsWith('Profa ') ||
    value.startsWith('Professor ') ||
    value.startsWith('Observações') ||
    value.startsWith('Nas disciplinas') ||
    value.startsWith('Este documento') ||
    value.startsWith('CÓDIGO DE AUTENTICIDADE') ||
    value.startsWith('Verifique a autenticidade') ||
    value.startsWith('UNICAMP -') ||
    value.startsWith('Reconhecida pelo') ||
    value.startsWith('Recredenciada pela') ||
    value.startsWith('DAC -') ||
    value.startsWith('Emissão:')
  )
}

function previousName(lines: ReadonlyArray<string>, index: number) {
  const names: string[] = []
  for (let cursor = index - 1; cursor >= 0 && names.length < 3; cursor -= 1) {
    const line = cleanName(lines[cursor] ?? '')
    if (!line || isNoise(line)) continue
    if (semesterPattern.test(line) || codePattern.test(line)) break
    if (/^(?:\d+º|Código|Nome|Média|CH|Crd|Situação)/.test(line)) break
    names.unshift(line)
  }
  return cleanName(names.join(' '))
}

function parseText(text: string): StudentHistoryParseResult {
  const lines = text.split(/\r?\n/)
  const raMatch = text.match(raPattern)
  if (!raMatch) throw new Error('Não foi possível encontrar o RA no histórico.')

  const warnings: StudentHistoryParseWarning[] = []
  const semesters: StudentHistoryImportSemester[] = []
  let current: {
    year: number
    yearPeriod: StudentHistoryImportSemester['yearPeriod']
    courses: StudentHistoryImportCourse[]
  } | null = null

  lines.forEach((line, index) => {
    const cleanLine = line.trim()
    const semesterMatch = cleanLine.match(semesterPattern)
    if (semesterMatch) {
      if (current) semesters.push(current)
      current = {
        year: Number(semesterMatch[2]),
        yearPeriod:
          semesterMatch[1] === '1' ? 'FIRST_SEMESTER' : 'SECOND_SEMESTER',
        courses: [],
      }
      return
    }
    if (!current || isNoise(cleanName(line))) return

    const rowMatch = cleanLine.match(rowPattern)
    if (!rowMatch) return
    const status = statusFor(rowMatch[6] ?? '')
    const name = cleanName(rowMatch[2] ?? '') || previousName(lines, index)
    if (!status || !name) {
      warnings.push({
        page: null,
        line,
        message: 'Linha de disciplina não reconhecida.',
      })
      return
    }
    current.courses.push({
      code: rowMatch[1] ?? '',
      name,
      grade: parseNumber(rowMatch[3] ?? '-'),
      workloadHours: parseNumber(rowMatch[4] ?? '-'),
      credits: parseNumber(rowMatch[5] ?? '-'),
      status,
    })
  })
  if (current) semesters.push(current)
  if (!semesters.length)
    throw new Error('Nenhum semestre foi encontrado no histórico.')
  if (!semesters.some((semester) => semester.courses.length))
    throw new Error('Nenhuma disciplina foi encontrada no histórico.')

  return {
    value: {
      format: studentHistoryImportFormat,
      version: studentHistoryImportVersion,
      student: { ra: raMatch[1] ?? '' },
      semesters,
    },
    warnings,
  }
}

export function parseStudentHistoryText(text: string) {
  return parseText(text)
}

export async function parseStudentHistoryPdf(file: File) {
  if (file.type !== 'application/pdf')
    throw new Error('Selecione um arquivo PDF.')
  const document = await pdfjs.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
  }).promise
  const pages: string[] = []
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber)
    const content = await page.getTextContent()
    const lines = new Map<
      number,
      Array<{ x: number; width: number; str: string }>
    >()
    for (const item of content.items) {
      if (!('str' in item) || !('transform' in item)) continue
      const positioned = item as typeof item & {
        str: string
        transform: number[]
        width?: number
      }
      const y = Math.round(positioned.transform[5] ?? 0)
      const line = lines.get(y) ?? []
      line.push({
        x: positioned.transform[4] ?? 0,
        width: positioned.width ?? 0,
        str: positioned.str,
      })
      lines.set(y, line)
    }
    pages.push(
      [...lines.entries()]
        .sort(([left], [right]) => right - left)
        .map(([, items]) => {
          const ordered = items.sort((left, right) => left.x - right.x)
          return ordered.reduce((line, item, index) => {
            if (index === 0) return item.str
            const previous = ordered[index - 1]!
            const gap = item.x - (previous.x + previous.width)
            return `${line}${gap > 12 ? '   ' : ' '}${item.str}`
          }, '')
        })
        .join('\n'),
    )
  }
  return parseText(pages.join('\n'))
}
