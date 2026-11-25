import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useHistoryImport } from '../hooks/useHistoryImport'
import { HistoryImportDialog } from './HistoryImportDialog'
import { LambdaHistoryImportDialog } from './LambdaHistoryImportDialog'
import type { StudentHistoryImportSummary } from '@/features/student/data/studentApi'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { listStudentCourseAttempts } from '@/features/student/data/studentApi'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'

export function HistoryImportPanel({
  userId,
  onDirtyChange,
  onSavingChange,
  onSummary,
}: {
  userId: number
  onDirtyChange?: (dirty: boolean) => void
  onSavingChange?: (saving: boolean) => void
  onSummary?: (summary: StudentHistoryImportSummary) => void
}) {
  const auth = useOptionalAuth()
  const fileInput = useRef<HTMLInputElement>(null)
  const { pending, setPending, busy, error, summary, parse, confirm } =
    useHistoryImport(userId, onSummary)
  const [lambdaOpen, setLambdaOpen] = useState(false)
  const [lambdaBusy, setLambdaBusy] = useState(false)
  const attemptsKey = privateQueryKeys.courseAttempts(
    auth.sessionSubject ?? 'unknown-session',
    userId,
  )
  const attempts = useQuery({
    queryKey: attemptsKey,
    queryFn: () => listStudentCourseAttempts(userId, auth.getAccessToken),
  })
  useEffect(() => {
    onDirtyChange?.(!!pending || lambdaOpen)
  }, [pending, lambdaOpen, onDirtyChange])
  useEffect(() => {
    onSavingChange?.(busy || lambdaBusy)
  }, [busy, lambdaBusy, onSavingChange])
  return (
    <div className="space-y-4">
      <p>
        Importe suas disciplinas e resultados. Você pode fazer isso mesmo sem
        configurar um vínculo acadêmico.
      </p>
      {attempts.isError && (
        <div role="alert">
          <p>
            Não foi possível consultar os registros existentes para comparar o
            histórico.
          </p>
          <Button onClick={() => void attempts.refetch()}>
            Tentar novamente
          </Button>
        </div>
      )}
      <input
        ref={fileInput}
        aria-label="PDF do histórico da DAC"
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ''
          if (file) void parse(file)
        }}
      />
      <div className="flex flex-wrap gap-3">
        <Button
          disabled={busy || !attempts.isSuccess}
          onClick={() => fileInput.current?.click()}
        >
          Selecionar PDF da DAC
        </Button>
        <Button
          variant="outline"
          disabled={busy || !attempts.isSuccess}
          onClick={() => setLambdaOpen(true)}
        >
          Consultar via DAC (experimental)
        </Button>
      </div>
      {busy && <p role="status">Processando histórico…</p>}
      {error && !pending && <p role="alert">{error}</p>}
      {summary && (
        <div role="status">
          <p>Histórico importado e salvo.</p>
          <p>
            {summary.created} registros criados · {summary.updated} atualizados.
          </p>
          <p>{summary.skipped} registros ignorados.</p>
          {summary.warnings.map((warning, index) => (
            <p key={index}>
              {warning.code ? `${warning.code}: ` : ''}
              {warning.message}
            </p>
          ))}
        </div>
      )}
      <HistoryImportDialog
        key={pending ? JSON.stringify(pending.value) : 'empty'}
        value={pending}
        attempts={attempts.data ?? []}
        importing={busy}
        error={error || undefined}
        onOpenChange={(open) => {
          if (!open && !busy) setPending(undefined)
        }}
        onConfirm={(value) => void confirm(value)}
      />
      <LambdaHistoryImportDialog
        open={lambdaOpen}
        onBusyChange={setLambdaBusy}
        onOpenChange={setLambdaOpen}
        onResult={(result) => {
          setPending(result)
        }}
      />
    </div>
  )
}
