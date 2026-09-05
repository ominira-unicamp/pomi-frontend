import { useEffect, useState } from 'react'

import type {
  CurriculumPlannerSnapshot,
  CurriculumPlannerStaticData,
} from '@pomi/planner-domain/curriculum'
import type { PlannerDispatch } from '@/features/curriculum-planner/types'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type Dispatch = PlannerDispatch

export function CurriculumSelectionFields({
  staticData,
  snapshot,
  disabled,
  dispatch,
  className,
  showLanguage = true,
}: {
  staticData: CurriculumPlannerStaticData
  snapshot: CurriculumPlannerSnapshot
  disabled: boolean
  dispatch: Dispatch
  className?: string
  showLanguage?: boolean
}) {
  const selected = staticData.catalogPrograms.find(
    (program) => program.id === snapshot.selection.catalogProgramId,
  )
  const [catalogId, setCatalogId] = useState(selected?.catalog.id ?? '')
  useEffect(() => {
    if (selected) setCatalogId(selected.catalog.id)
  }, [selected?.catalog.id])
  const catalogs = [
    ...new Map(
      staticData.catalogPrograms.map((program) => [
        program.catalog.id,
        {
          value: program.catalog.id,
          label: `Catálogo ${program.catalog.year}`,
        },
      ]),
    ).values(),
  ].sort((left, right) => right.label.localeCompare(left.label))
  const programs = staticData.catalogPrograms
    .filter((program) => program.catalog.id === catalogId)
    .sort((left, right) => left.program.name.localeCompare(right.program.name))
  return (
    <div className={cn('grid gap-4 md:grid-cols-2 xl:grid-cols-4', className)}>
      <label className="space-y-2 text-sm font-bold">
        <span>Catálogo</span>
        <AutocompleteSelect
          ariaLabel="Catálogo"
          value={catalogId}
          disabled={disabled}
          emptyLabel="Sem catálogo"
          options={catalogs}
          placeholder="Digite o ano do catálogo"
          onValueChange={(value) => {
            setCatalogId(value)
            if (!value || selected?.catalog.id !== value) {
              void dispatch({
                type: 'selectCatalogProgram',
                catalogProgramId: null,
              })
            }
          }}
        />
      </label>
      <label className="space-y-2 text-sm font-bold">
        <span>Programa</span>
        <AutocompleteSelect
          ariaLabel="Programa"
          value={snapshot.selection.catalogProgramId ?? ''}
          disabled={disabled || !catalogId}
          emptyLabel="Sem programa"
          options={programs.map((program) => ({
            value: program.id,
            label: `${program.program.code} — ${program.program.name}`,
          }))}
          placeholder={
            catalogId ? 'Digite o programa' : 'Escolha um catálogo primeiro'
          }
          onValueChange={(value) =>
            void dispatch({
              type: 'selectCatalogProgram',
              catalogProgramId: value ? (value as never) : null,
            })
          }
        />
      </label>
      {selected?.specializations.length ? (
        <label className="space-y-2 text-sm font-bold">
          <span>Habilitação</span>
          <AutocompleteSelect
            ariaLabel="Habilitação"
            value={snapshot.selection.specializationId ?? ''}
            disabled={disabled}
            emptyLabel="Sem habilitação"
            options={selected.specializations.map((option) => ({
              value: option.id,
              label: `${option.code} — ${option.name}`,
            }))}
            placeholder="Digite a habilitação"
            onValueChange={(value) =>
              void dispatch({
                type: 'selectSpecialization',
                specializationId: value ? (value as never) : null,
              })
            }
          />
        </label>
      ) : null}
      {showLanguage && selected?.languages.length ? (
        <label className="space-y-2 text-sm font-bold">
          <span>Língua</span>
          <AutocompleteSelect
            ariaLabel="Língua"
            value={snapshot.selection.languageId ?? ''}
            disabled={disabled}
            emptyLabel="Sem língua adicional"
            options={selected.languages.map((option) => ({
              value: option.id,
              label: option.name,
            }))}
            placeholder="Digite a língua"
            onValueChange={(value) =>
              void dispatch({
                type: 'selectLanguage',
                languageId: value ? (value as never) : null,
              })
            }
          />
        </label>
      ) : null}
    </div>
  )
}

export function CurriculumSelectionPanel(
  props: Parameters<typeof CurriculumSelectionFields>[0],
) {
  return (
    <Card className="mb-7 shadow-none">
      <CardContent className="space-y-4 p-4">
        <CurriculumSelectionFields {...props} />
      </CardContent>
    </Card>
  )
}
