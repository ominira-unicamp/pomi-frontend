import { useState } from 'react'
import { ChevronDown, Globe, Upload } from 'lucide-react'
import { labelForStatus } from '../model/model'
import { CourseAttemptRow } from './CourseAttemptRow'
import type { ChangeEvent, RefObject } from 'react'
import type { ProfessorEvaluationTarget } from '@/features/student/components/ProfessorEvaluationDialog'
import type {
  StudentCourseAttempt,
  StudentHistoryImportSummary,
} from '@/features/student/data/studentApi'
import type { CourseHistoryGroup } from '../model/model'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/patterns/Field'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
  onLambdaImport,
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
  onLambdaImport: () => void
}) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [expanded, setExpanded] = useState<ReadonlySet<string>>()
  const normalize = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
  const filtering = Boolean(search.trim() || status !== 'all')
  const filteredGroups = groups
    .map((group) => ({
      ...group,
      attempts: group.attempts.filter(
        (attempt) =>
          (status === 'all' || attempt.status === status) &&
          normalize(`${attempt.course.code} ${attempt.course.name}`).includes(
            normalize(search.trim()),
          ),
      ),
    }))
    .filter((group) => group.attempts.length)
  const total = groups.reduce((sum, group) => sum + group.attempts.length, 0)
  const results = filteredGroups.reduce(
    (sum, group) => sum + group.attempts.length,
    0,
  )
  const statuses = [
    ...new Set(
      groups.flatMap((group) =>
        group.attempts.map((attempt) => attempt.status),
      ),
    ),
  ]
  const allExpanded = groups.every((group) =>
    (expanded ?? new Set(groups[0] ? [groups[0].key] : [])).has(group.key),
  )
  return (
    <div className="space-y-5">
      <SectionHeader className="sm:items-center">
        <div>
          <SectionTitle>Histórico acadêmico</SectionTitle>
          <SectionDescription>
            {total} tentativas registradas
            {filtering ? ` · ${results} encontradas` : ''}
          </SectionDescription>
        </div>
        <input
          ref={fileInputRef}
          className="hidden"
          type="file"
          accept="application/pdf,.pdf"
          onChange={onFileChange}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" disabled={importing}>
              <Upload />
              {importing ? 'Lendo…' : 'Importar histórico'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => fileInputRef.current?.click()}>
              <Upload />
              Importar PDF da DAC
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onLambdaImport}>
              <Globe />
              Buscar via DAC (experimental)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SectionHeader>
      {groups.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <Field className="flex-1">
            <FieldLabel htmlFor="history-search">Buscar disciplina</FieldLabel>
            <Input
              id="history-search"
              placeholder="Código ou nome"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </Field>
          <Field className="sm:w-64">
            <FieldLabel>Resultado acadêmico</FieldLabel>
            <AutocompleteSelect
              ariaLabel="Resultado acadêmico"
              value={status}
              options={[
                { value: 'all', label: 'Todos os resultados' },
                ...statuses.map((value) => ({
                  value,
                  label: labelForStatus(value),
                })),
              ]}
              onValueChange={setStatus}
            />
          </Field>
          <Button
            variant="outline"
            disabled={filtering}
            onClick={() =>
              setExpanded(
                new Set(allExpanded ? [] : groups.map((group) => group.key)),
              )
            }
          >
            {allExpanded ? 'Recolher todos' : 'Expandir todos'}
          </Button>
        </div>
      )}
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
      {filteredGroups.length ? (
        filteredGroups.map((group) => {
          const open =
            filtering ||
            (expanded ?? new Set(groups[0] ? [groups[0].key] : [])).has(
              group.key,
            )
          return (
            <Section key={group.key} variant="bordered">
              <button
                className="pomi-focus flex w-full items-center justify-between gap-3 text-left font-extrabold"
                aria-expanded={open}
                disabled={filtering}
                aria-controls={`history-period-${group.key}`}
                onClick={() =>
                  setExpanded((current) => {
                    const next = new Set(
                      current ?? (groups[0] ? [groups[0].key] : []),
                    )
                    if (next.has(group.key)) next.delete(group.key)
                    else next.add(group.key)
                    return next
                  })
                }
              >
                <span>
                  {group.label}{' '}
                  <span className="ml-2 text-sm font-medium text-muted-foreground">
                    {group.attempts.length}{' '}
                    {group.attempts.length === 1 ? 'tentativa' : 'tentativas'}
                  </span>
                </span>
                <ChevronDown
                  className={`size-5 shrink-0 ${open ? 'rotate-180' : ''}`}
                />
              </button>
              {open && (
                <SectionContent
                  id={`history-period-${group.key}`}
                  className="mt-3"
                >
                  <DataList>
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
              )}
            </Section>
          )
        })
      ) : groups.length ? (
        <EmptyState
          title="Nenhuma tentativa encontrada"
          description="Tente outro código, nome ou resultado acadêmico."
          action={{
            label: 'Limpar busca e filtros',
            onClick: () => {
              setSearch('')
              setStatus('all')
            },
          }}
        />
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
