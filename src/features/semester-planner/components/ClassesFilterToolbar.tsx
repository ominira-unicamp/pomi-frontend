import { useState } from 'react'
import { Search } from 'lucide-react'
import type {
  GuideClassContext,
  SemesterCourse,
} from '@pomi/planner-domain/semester'

import type { ClassesGuideFilters } from '@/features/semester-planner/hooks/useClassesGuideFilters'
import { StandardFilterEditor, useFilterController } from '@/components/filters'
import {
  AppliedFilters,
  FilterPropertyList,
  FilterViewHeader,
  FiltersButton,
} from '@/components/patterns/AppliedFilters'
import { ResponsiveFilterSurface } from '@/components/patterns/ResponsiveFilterSurface'
import { Button } from '@/components/ui/button'
import {
  classesGuideFilterDefinitions,
  toggleTimePeriod,
} from '@/features/semester-planner/filters/classesGuideFilterDefinitions'

type FilterKey =
  | 'discipline'
  | 'time'
  | 'days'
  | 'withoutConflict'
  | 'withoutCompleted'
  | 'withoutIncluded'
  | 'withoutUnavailable'

export function ClassesFilterToolbar({
  mode,
  filters,
  courses,
  guideClassContext,
  onChange,
}: {
  mode: 'disciplines' | 'classes'
  filters: ClassesGuideFilters
  courses: ReadonlyArray<SemesterCourse>
  guideClassContext: GuideClassContext
  onChange: (changes: Partial<ClassesGuideFilters>) => void
}) {
  const [filterView, setFilterView] = useState<
    'results' | 'filters' | FilterKey
  >('results')
  const definitions = classesGuideFilterDefinitions({
    mode,
    courses,
    guideClassContext,
  })
  const controller = useFilterController({
    state: filters,
    definitions,
    onChange: (next) => onChange(next),
  })
  const filterKeys = controller.definitions.map(({ key }) => key as FilterKey)

  function clearFilter(key: FilterKey) {
    controller.clear(key)
    if (filterView === key) setFilterView('filters')
  }

  const filterContent = (
    <>
      <FilterViewHeader
        title={
          filterView === 'filters' || filterView === 'results'
            ? `Filtros de ${mode === 'classes' ? 'turmas' : 'disciplinas'}`
            : `Editar ${controller.definition(filterView)?.label.toLocaleLowerCase('pt-BR') ?? 'filtro'}`
        }
        onBack={() =>
          setFilterView(filterView === 'filters' ? 'results' : 'filters')
        }
        onClose={() => setFilterView('results')}
        closeClassName="sm:hidden"
      />
      {filterView === 'filters' || filterView === 'results' ? (
        <div className="mt-3">
          <FilterPropertyList
            items={filterKeys.map((key) => ({
              key,
              label: controller.definition(key)?.label ?? key,
              summary: controller.activeItems.find((item) => item.key === key)
                ?.summary,
            }))}
            onSelect={setFilterView}
          />
        </div>
      ) : (
        <div className="mt-3">
          {controller.definition(filterView) && (
            <StandardFilterEditor
              definition={controller.definition(filterView)!}
              state={filters}
              onChange={(next) => onChange(next)}
            />
          )}
        </div>
      )}
    </>
  )

  return (
    <section className="mb-3 space-y-2 rounded-lg border-2 border-strong-border bg-card p-2.5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 lg:flex">
        <label className="relative block min-w-0 flex-1">
          <span className="sr-only">
            Buscar {mode === 'classes' ? 'turmas' : 'disciplinas'}
          </span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={filters.search}
            placeholder="Buscar disciplina, turma ou professor"
            className="h-10 w-full rounded-md border-2 border-input bg-background pr-3 pl-9 text-sm"
            onChange={(event) => onChange({ search: event.target.value })}
          />
        </label>
        <ResponsiveFilterSurface
          open={filterView !== 'results'}
          onOpenChange={(open) => setFilterView(open ? 'filters' : 'results')}
          title={
            controller.activeCount === 0
              ? 'Nenhum filtro'
              : `${controller.activeCount} filtros`
          }
          trigger={<FiltersButton count={controller.activeCount} />}
        >
          {filterContent}
        </ResponsiveFilterSurface>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-extrabold text-muted-foreground">
          Turno
        </span>
        <div className="flex shrink-0 overflow-hidden rounded-md border-2 border-strong-border">
          <QuickFilter
            active={filters.timePeriods.includes('morning')}
            label="Manhã"
            segmented
            onClick={() => onChange(toggleTimePeriod(filters, 'morning'))}
          />
          <QuickFilter
            active={filters.timePeriods.includes('afternoon')}
            label="Tarde"
            segmented
            onClick={() => onChange(toggleTimePeriod(filters, 'afternoon'))}
          />
          <QuickFilter
            active={filters.timePeriods.includes('evening')}
            label="Noite"
            segmented
            onClick={() => onChange(toggleTimePeriod(filters, 'evening'))}
          />
        </div>
        <QuickFilter
          active={filters.withoutConflict}
          label="Sem conflitos"
          onClick={() =>
            onChange({ withoutConflict: !filters.withoutConflict })
          }
        />
        <QuickFilter
          active={filters.withoutCompleted}
          label="Só pendentes"
          onClick={() =>
            onChange({ withoutCompleted: !filters.withoutCompleted })
          }
        />
        <QuickFilter
          active={filters.withoutIncluded}
          label="Ocultar adicionadas"
          onClick={() =>
            onChange({ withoutIncluded: !filters.withoutIncluded })
          }
        />
        {mode === 'disciplines' && (
          <QuickFilter
            active={filters.withoutUnavailable}
            label="Ocultar sem turmas"
            onClick={() =>
              onChange({ withoutUnavailable: !filters.withoutUnavailable })
            }
          />
        )}
      </div>
      {controller.activeItems.length > 0 && (
        <AppliedFilters
          className="flex-nowrap overflow-x-auto pb-1 [&>div]:min-h-8 [&>div]:shrink-0 [&>div]:shadow-none"
          items={controller.activeItems}
          onEdit={(key) => setFilterView(key as FilterKey)}
          onRemove={(key) => clearFilter(key as FilterKey)}
          onClear={controller.clearAll}
        />
      )}
    </section>
  )
}

function QuickFilter({
  active,
  label,
  segmented = false,
  onClick,
}: {
  active: boolean
  label: string
  segmented?: boolean
  onClick: () => void
}) {
  return (
    <Button
      className={
        segmented
          ? 'shrink-0 rounded-none border-0 border-r-2 border-strong-border shadow-none last:border-r-0 hover:translate-x-0 hover:translate-y-0 hover:shadow-none'
          : 'shrink-0'
      }
      size="sm"
      variant={active ? 'default' : 'outline'}
      onClick={onClick}
    >
      {label}
    </Button>
  )
}
