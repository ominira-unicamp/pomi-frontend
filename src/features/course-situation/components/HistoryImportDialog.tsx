import { useState } from 'react'
import { AlertCircle } from 'lucide-react'

import {
  historyImportPreview,
  selectedHistoryImport,
} from '../model/historyImportPreview'
import { labelForStatus } from '../model/model'
import type { StudentCourseAttempt } from '@/features/student/data/studentApi'
import type {
  StudentHistoryImport,
  StudentHistoryParseResult,
} from '@/features/student/historyImport/studentHistoryParser'
import { Checkbox } from '@/components/ui/checkbox'
import { ActionBar } from '@/components/patterns/ActionBar'
import { DataList, DataRow } from '@/components/patterns/DataList'
import { InlineMessage } from '@/components/patterns/InlineMessage'
import { ResponsiveDialog } from '@/components/patterns/ResponsiveDialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { studyPeriodLabel } from '@/features/student/data/studyPeriod'

export function HistoryImportDialog({
  value,
  importing,
  onOpenChange,
  onConfirm,
  attempts,
  error,
}: {
  value?: StudentHistoryParseResult
  importing: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (value: StudentHistoryImport) => void
  attempts: ReadonlyArray<StudentCourseAttempt>
  error?: string
}) {
  const [selection, setSelection] = useState<ReadonlySet<string>>()
  const entries = value ? historyImportPreview(value.value, attempts) : []
  const selected =
    selection ??
    new Set(
      entries.filter((entry) => entry.kind === 'new').map((entry) => entry.key),
    )
  const labels = {
    new: 'Nova tentativa',
    unchanged: 'Já registrada — não será enviada',
    conflict: 'Divergência — escolha se deseja atualizar',
    ambiguous: 'Várias tentativas neste período — revise manualmente',
    duplicate: 'Repetida no arquivo — não será enviada',
  }
  return (
    <ResponsiveDialog
      open={Boolean(value)}
      onOpenChange={onOpenChange}
      title="Confirmar importação do histórico"
      onOpenAutoFocus={(event) => event.preventDefault()}
    >
      {value && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            RA encontrado: <strong>{value.value.student.ra}</strong>
          </p>
          <InlineMessage>
            {entries.filter((entry) => entry.kind === 'new').length} novas
            tentativas,{' '}
            {entries.filter((entry) => entry.kind === 'unchanged').length} já
            registradas e{' '}
            {entries.filter((entry) => entry.kind === 'conflict').length}{' '}
            divergências. Novas tentativas são selecionadas inicialmente.
            Atualizar uma divergência substitui situação, nota e, quando
            informada, turma da tentativa existente. Os demais registros
            permanecem como estão.
          </InlineMessage>
          <div className="max-h-80 overflow-y-auto rounded-md border-2 border-strong-border p-3">
            <DataList>
              {entries.map((entry, index) => (
                <DataRow key={`${entry.key}-${index}`}>
                  <div className="flex min-w-0 items-start gap-3">
                    <Checkbox
                      aria-label={`Importar ${entry.course.code}, ${studyPeriodLabel(entry.semester)}`}
                      checked={
                        entry.kind !== 'duplicate' && selected.has(entry.key)
                      }
                      disabled={
                        importing || !['new', 'conflict'].includes(entry.kind)
                      }
                      onCheckedChange={(checked) =>
                        setSelection((current) => {
                          const next = new Set(current ?? selected)
                          if (checked) next.add(entry.key)
                          else next.delete(entry.key)
                          return next
                        })
                      }
                    />
                    <div className="min-w-0">
                      <p className="font-bold">
                        {entry.course.code} — {entry.course.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {studyPeriodLabel(entry.semester)} ·{' '}
                        {labelForStatus(entry.course.status)}
                        {entry.course.grade !== null
                          ? ` · Nota ${entry.course.grade}`
                          : ''}
                      </p>
                      <p className="text-sm">{labels[entry.kind]}</p>
                      {entry.kind === 'conflict' && (
                        <p className="text-sm text-muted-foreground">
                          Registro atual:{' '}
                          {labelForStatus(entry.existing[0].status)}
                          {entry.existing[0].grade !== null
                            ? ` · Nota ${entry.existing[0].grade}`
                            : ''}
                          {entry.existing[0].class
                            ? ` · Turma ${entry.existing[0].class.code}`
                            : ''}
                        </p>
                      )}
                    </div>
                  </div>
                </DataRow>
              ))}
            </DataList>
          </div>
          {error && <InlineMessage variant="error">{error}</InlineMessage>}
          {value.warnings.length > 0 && (
            <Alert>
              <AlertCircle />
              <AlertTitle>Atenção antes de importar</AlertTitle>
              <AlertDescription>
                {value.warnings.length} linhas não puderam ser interpretadas e
                não serão enviadas.
                <ul className="mt-2 max-h-32 list-disc space-y-1 overflow-y-auto pl-5">
                  {value.warnings.map((warning, index) => (
                    <li key={`${warning.line}-${index}`}>{warning.message}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          <ActionBar>
            <Button
              variant="outline"
              disabled={importing}
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              disabled={importing || !selected.size}
              onClick={() =>
                onConfirm(selectedHistoryImport(value.value, selected))
              }
            >
              {importing ? 'Salvando…' : 'Confirmar e salvar'}
            </Button>
          </ActionBar>
        </div>
      )}
    </ResponsiveDialog>
  )
}
