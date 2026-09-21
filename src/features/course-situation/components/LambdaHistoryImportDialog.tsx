import { useState } from 'react'

import type { StudentHistoryParseResult } from '@/features/student/historyImport/studentHistoryParser'
import {
  studentHistoryImportFormat,
  studentHistoryImportVersion,
} from '@/features/student/historyImport/studentHistoryParser'
import { ActionBar } from '@/components/patterns/ActionBar'
import { InlineMessage } from '@/components/patterns/InlineMessage'
import { ResponsiveDialog } from '@/components/patterns/ResponsiveDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const LAMBDA_URL =
  'https://n4aomvseqbz4qp35mdlhp6mpqu0njzqr.lambda-url.sa-east-1.on.aws/'

type LambdaResponse = Readonly<{
  tamanho: number
  retorno: ReadonlyArray<{
    ano: number
    periodo: string
    disciplinas: ReadonlyArray<{
      disciplina: string
      turma: string
      nota: string
      situacao: string
    }>
  }>
}>

function parseYearPeriod(
  periodo: string,
): 'FIRST_SEMESTER' | 'SECOND_SEMESTER' | null {
  const normalized = periodo.trim()
  if (normalized.startsWith('1')) return 'FIRST_SEMESTER'
  if (normalized.startsWith('2')) return 'SECOND_SEMESTER'
  return null
}

function parseSituacao(
  situacao: string,
): StudentHistoryParseResult['value']['semesters'][number]['courses'][number]['status'] | null {
  const normalized = situacao.trim()
  if (normalized.includes('Aprovado por Nota')) return 'APPROVED'
  if (
    normalized.includes('Proeficiência') ||
    normalized.includes('Proficiência')
  )
    return 'APPROVED_BY_PROFICIENCY'
  if (normalized.includes('Aprovado por Frequência'))
    return 'APPROVED_BY_ATTENDANCE'
  if (normalized.includes('Suficiente')) return 'SUFFICIENT'
  if (normalized.includes('Reprovado por Frequência'))
    return 'FAILED_BY_ATTENDANCE'
  if (normalized.includes('Desistência') || normalized.includes('Desistida'))
    return 'DROPPED'
  return null
}

function lambdaResponseToParseResult(
  data: LambdaResponse,
  username: string
): StudentHistoryParseResult {
  const semesters = data.retorno
    .map((entry) => {
      const yearPeriod = parseYearPeriod(entry.periodo)
      if (!yearPeriod) return null

      const courses = entry.disciplinas
        .map((disc) => {
          const status = parseSituacao(disc.situacao)
          if (!status) return null
          const notaNum = parseFloat(disc.nota)
          return {
            code: disc.disciplina.trim(),
            name: disc.disciplina.trim(),
            grade: isNaN(notaNum) ? null : notaNum,
            workloadHours: null,
            credits: null,
            status,
          } as const
        })
        .filter((c): c is NonNullable<typeof c> => c !== null)

      return { year: entry.ano, yearPeriod, courses } as const
    })
    .filter(
      (s): s is NonNullable<typeof s> => s !== null && s.courses.length > 0,
    )

  return {
    value: {
      format: studentHistoryImportFormat,
      version: studentHistoryImportVersion,
      student: { ra: username },
      semesters,
    },
    warnings: [],
  }
}

export function LambdaHistoryImportDialog({
  open,
  onOpenChange,
  onResult,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onResult: (result: StudentHistoryParseResult) => void
}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  function handleClose(nextOpen: boolean) {
    if (loading) return
    if (!nextOpen) {
      setError(undefined)
    }
    onOpenChange(nextOpen)
  }

  async function handleSubmit() {
    if (loading || !username.trim() || !password) return
    setLoading(true)
    setError(undefined)
    try {
      const response = await fetch(LAMBDA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      })
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }
      const data = (await response.json()) as LambdaResponse
      if (data.retorno.length === 0) {
        throw new Error('Nenhum dado encontrado para este usuário.')
      }
      const result = lambdaResponseToParseResult(data, username)
      if (result.value.semesters.length === 0) {
        throw new Error('Nenhum semestre reconhecido nos dados retornados.')
      }
      onOpenChange(false)
      setUsername('')
      setPassword('')
      onResult(result)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível buscar o histórico. Verifique os dados e tente novamente.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={handleClose}
      title="Importar via DAC"
      description="Informe seu usuário e senha da DAC para buscar automaticamente seu histórico escolar. (Utilize com cautela, funcionalidade em beta)"
    >
      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <label htmlFor="lambda-username" className="text-sm font-medium">
            Usuário (RA)
          </label>
          <Input
            id="lambda-username"
            type="text"
            placeholder="ex: 123456"
            value={username}
            disabled={loading}
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void handleSubmit()
            }}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="lambda-password" className="text-sm font-medium">
            Senha
          </label>
          <Input
            id="lambda-password"
            type="password"
            placeholder="Sua senha da DAC"
            value={password}
            disabled={loading}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void handleSubmit()
            }}
          />
        </div>
        {error && <InlineMessage variant="error">{error}</InlineMessage>}
        <ActionBar>
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => handleClose(false)}
          >
            Cancelar
          </Button>
          <Button
            disabled={loading || !username.trim() || !password}
            onClick={() => void handleSubmit()}
          >
            {loading ? 'Buscando…' : 'Buscar histórico'}
          </Button>
        </ActionBar>
      </div>
    </ResponsiveDialog>
  )
}
