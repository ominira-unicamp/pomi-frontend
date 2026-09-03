import { describe, expect, it } from 'vitest'

import {
  parseStudentHistoryText,
  studentHistoryImportFormat,
} from '@/student/historyImport/studentHistoryParser'

describe('student history parser', () => {
  it('parses DAC semester rows and preserves course codes', () => {
    const result = parseStudentHistoryText(`
Nome
Caio Lima Albuquerque
Registro Acadêmico
288808
1º Semestre de 2024 - 28/02/2024 até 06/07/2024
Código   Nome da Disciplina   Média   CH   Crd   Situação
F 128   Física Geral I   9,0   60   4   Aprovado por Nota e Frequência
LA122   Inglês Instrumental I   ---   90   4   Aprovado - Proficiência
MC050   Monitoria   ---   120   8   Suficiente
`)

    expect(result.value).toMatchObject({
      format: studentHistoryImportFormat,
      version: 1,
      student: { ra: '288808' },
      semesters: [
        {
          year: 2024,
          yearPeriod: 'FIRST_SEMESTER',
          courses: [
            {
              code: 'F 128',
              name: 'Física Geral I',
              grade: 9,
              workloadHours: 60,
              credits: 4,
              status: 'APPROVED',
            },
            {
              code: 'LA122',
              status: 'SUFFICIENT',
              grade: null,
            },
            {
              code: 'MC050',
              status: 'SUFFICIENT',
              grade: null,
            },
          ],
        },
      ],
    })
  })
})
