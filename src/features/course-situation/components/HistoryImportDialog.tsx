import { AlertCircle } from 'lucide-react'

import { labelForStatus } from '../model/model'
import type { StudentHistoryParseResult } from '@/features/student/historyImport/studentHistoryParser'
import { ActionBar } from '@/components/patterns/ActionBar'
import { DataList, DataRow } from '@/components/patterns/DataList'
import { InlineMessage } from '@/components/patterns/InlineMessage'
import { Section, SectionTitle } from '@/components/patterns/Section'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { studyPeriodLabel } from '@/features/student/data/studyPeriod'

export function HistoryImportDialog({
  value,
  importing,
  onOpenChange,
  onConfirm,
}: {
  value?: StudentHistoryParseResult
  importing: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}) {
  return (
    <Dialog open={Boolean(value)} onOpenChange={onOpenChange}>
      <DialogContent onOpenAutoFocus={(event) => event.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Confirmar importação do histórico</DialogTitle>
        </DialogHeader>
        {value && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              RA encontrado: <strong>{value.value.student.ra}</strong>
            </p>
            <InlineMessage>
              {value.value.semesters.length}{' '}
              {value.value.semesters.length === 1 ? 'semestre' : 'semestres'} e{' '}
              {value.value.semesters.reduce(
                (total, semester) => total + semester.courses.length,
                0,
              )}{' '}
              disciplinas encontradas. Disciplinas já registradas poderão ser
              atualizadas.
            </InlineMessage>
            <div className="max-h-72 space-y-4 overflow-y-auto rounded-md border-2 border-strong-border p-3">
              {value.value.semesters.map((semester) => (
                <Section
                  key={`${semester.year}:${semester.yearPeriod}`}
                  aria-labelledby={`history-import-${semester.year}-${semester.yearPeriod}`}
                >
                  <SectionTitle
                    id={`history-import-${semester.year}-${semester.yearPeriod}`}
                    className="mb-2 text-base"
                  >
                    {studyPeriodLabel(semester)}
                  </SectionTitle>
                  <DataList>
                    {semester.courses.map((course) => (
                      <DataRow
                        key={`${semester.year}:${semester.yearPeriod}:${course.code}`}
                        className="rounded-md bg-secondary/60 px-3"
                      >
                        <div>
                          <p className="font-bold">
                            {course.code} — {course.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {labelForStatus(course.status)}
                            {course.grade !== null
                              ? ` · Nota ${course.grade}`
                              : ''}
                            {course.credits !== null
                              ? ` · ${course.credits} créditos`
                              : ''}
                          </p>
                        </div>
                      </DataRow>
                    ))}
                  </DataList>
                </Section>
              ))}
            </div>
            {value.warnings.length > 0 && (
              <Alert>
                <AlertCircle />
                <AlertTitle>Atenção antes de importar</AlertTitle>
                <AlertDescription>
                  {value.warnings.length} linhas não puderam ser interpretadas e
                  não serão enviadas.
                  <ul className="mt-2 max-h-32 list-disc space-y-1 overflow-y-auto pl-5">
                    {value.warnings.map((warning, index) => (
                      <li key={`${warning.line}-${index}`}>
                        {warning.message}
                      </li>
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
              <Button disabled={importing} onClick={onConfirm}>
                {importing ? 'Salvando…' : 'Confirmar e salvar'}
              </Button>
            </ActionBar>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
