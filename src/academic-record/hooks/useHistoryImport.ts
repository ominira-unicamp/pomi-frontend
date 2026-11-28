import { useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { StudentHistoryImport, StudentHistoryImportSummary } from '@/academic-record/data/studentApi'
import type { StudentHistoryParseResult } from '@/academic-record/historyImport/studentHistoryParser'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { importStudentHistory } from '@/academic-record/data/studentApi'
import { parseStudentHistoryPdf } from '@/academic-record/historyImport/studentHistoryParser'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'

export function useHistoryImport(
  userId: number | null | undefined,
  onSummary?: (summary: StudentHistoryImportSummary) => void,
) {
  const auth = useOptionalAuth()
  const client = useQueryClient()
  const lock = useRef(false)
  const [pending, setPending] = useState<StudentHistoryParseResult>()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string>()
  const [summary, setSummary] = useState<StudentHistoryImportSummary>()
  async function parse(file: File) {
    if (!userId || lock.current) return
    lock.current = true
    setBusy(true)
    setError(undefined)
    try {
      setPending(await parseStudentHistoryPdf(file))
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Não foi possível ler o histórico escolar.',
      )
    } finally {
      lock.current = false
      setBusy(false)
    }
  }
  async function confirm(value: StudentHistoryImport) {
    if (!userId || lock.current || !pending) return
    lock.current = true
    setBusy(true)
    setError(undefined)
    try {
      const result = await importStudentHistory(
        userId,
        value,
        auth.getAccessToken,
      )
      setPending(undefined)
      setSummary(result)
      onSummary?.(result)
      void client.invalidateQueries({
        queryKey: privateQueryKeys.courseAttempts(
          auth.sessionSubject ?? 'unknown-session',
          userId,
        ),
      })
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Não foi possível salvar o histórico escolar.',
      )
    } finally {
      lock.current = false
      setBusy(false)
    }
  }
  return { pending, setPending, busy, error, summary, parse, confirm }
}
