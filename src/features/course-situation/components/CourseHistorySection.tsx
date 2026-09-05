import { Upload } from 'lucide-react'
import { CourseAttemptRow } from './CourseAttemptRow'
import type { ChangeEvent, RefObject } from 'react'

import type { ProfessorEvaluationTarget } from '@/features/student/components/ProfessorEvaluationDialog'
import type {
  StudentCourseAttempt,
  StudentHistoryImportSummary,
} from '@/features/student/data/studentApi'
import type { CourseHistoryGroup } from '../model/model'
import { DataList } from '@/components/patterns/DataList'
import { InlineMessage } from '@/components/patterns/InlineMessage'
import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from '@/components/patterns/Section'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/PageLayout'

export function CourseHistorySection({
  groups,
  fileInputRef,
  importing,
  importError,
  importSummary,
  absenceCount,
  onFileChange,
  onNewAttempt,
  onOpenAbsences,
  onEvaluate,
  onEdit,
  onRemove,
}: {
  groups: ReadonlyArray<CourseHistoryGroup>
  fileInputRef: RefObject<HTMLInputElement | null>
  importing: boolean
  importError?: string
  importSummary?: StudentHistoryImportSummary
  absenceCount: (attemptId: number) => number
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onNewAttempt: () => void
  onOpenAbsences: (attemptId: number) => void
  onEvaluate: (target: ProfessorEvaluationTarget) => void
  onEdit: (attempt: StudentCourseAttempt) => void
  onRemove: (attemptId: number) => void
}) {
  return (
    <div className="space-y-5">
      <Section variant="bordered">
        <SectionHeader className="mb-0 sm:items-center">
          <div>
            <SectionTitle className="text-base">
              Importar histórico escolar
            </SectionTitle>
            <SectionDescription>
              Use o PDF textual emitido pela DAC. O arquivo será processado no
              navegador e não será enviado ao servidor.
            </SectionDescription>
          </div>
          <input
            ref={fileInputRef}
            className="hidden"
            type="file"
            accept="application/pdf,.pdf"
            onChange={onFileChange}
          />
          <Button
            className="shrink-0"
            disabled={importing}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload /> {importing ? 'Lendo…' : 'Escolher PDF'}
          </Button>
        </SectionHeader>
      </Section>
      {importError && (
        <InlineMessage variant="error">{importError}</InlineMessage>
      )}
      {importSummary && (
        <InlineMessage variant="success">
          <div>
            Histórico importado: {importSummary.created} criadas,{' '}
            {importSummary.updated} atualizadas e {importSummary.skipped}{' '}
            ignoradas.
            {importSummary.warnings.length > 0 && (
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {importSummary.warnings.map((warning, index) => (
                  <li key={`${warning.code ?? 'item'}-${index}`}>
                    {warning.code ? `${warning.code}: ` : ''}
                    {warning.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </InlineMessage>
      )}
      {groups.length ? (
        groups.map((group) => (
          <Section key={group.key} variant="bordered">
            <SectionTitle className="mb-3 text-base">
              {group.label}
            </SectionTitle>
            <SectionContent>
              <DataList className="space-y-2 divide-y-0">
                {group.attempts.map((attempt) => (
                  <CourseAttemptRow
                    key={attempt.id}
                    attempt={attempt}
                    absenceCount={absenceCount(attempt.id)}
                    onOpenAbsences={onOpenAbsences}
                    onEvaluate={onEvaluate}
                    onEdit={onEdit}
                    onRemove={onRemove}
                  />
                ))}
              </DataList>
            </SectionContent>
          </Section>
        ))
      ) : (
        <EmptyState
          title="Nenhuma tentativa no histórico"
          description="Registre disciplinas concluídas, reprovadas ou desistidas."
          action={{
            label: 'Registrar tentativa anterior',
            onClick: onNewAttempt,
          }}
        />
      )}
    </div>
  )
}
