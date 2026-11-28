import { Filter, Search } from 'lucide-react'
import { useState } from 'react'

import type { ExchangePlace } from '@/features/exchange/data/exchangeApi'
import type { ExchangeNoticeFilters } from '@/features/exchange/data/exchangeNotices'
import { StandardFilterEditor, useFilterController } from '@/components/filters'
import {
  AppliedFilters,
  FilterPropertyList,
  FilterViewHeader,
  FiltersButton,
} from '@/components/patterns/AppliedFilters'
import { ResponsiveFilterSurface } from '@/components/patterns/ResponsiveFilterSurface'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { localDateKey } from '@/features/exchange/data/exchangeNotices'
import { exchangeNoticeFilterDefinitions } from '@/features/exchange/filters/exchangeNoticeFilterDefinitions'

type ActiveFilter =
  | 'issuers'
  | 'placeIds'
  | 'registrationStart'
  | 'registrationEnd'

export function ExchangeCatalogFilters({
  filters,
  issuers,
  places,
  onChange,
}: {
  filters: ExchangeNoticeFilters
  issuers: ReadonlyArray<string>
  places: ReadonlyArray<ExchangePlace>
  onChange: (filters: ExchangeNoticeFilters) => void
}) {
  const [filterView, setFilterView] = useState<
    'results' | 'filters' | ActiveFilter
  >('results')
  const update = <TKey extends keyof ExchangeNoticeFilters>(
    key: TKey,
    value: ExchangeNoticeFilters[TKey],
  ) => onChange({ ...filters, [key]: value })
  const definitions = exchangeNoticeFilterDefinitions({ issuers, places })
  const controller = useFilterController({
    state: filters,
    definitions,
    onChange,
  })
  const removeFilter = (key: ActiveFilter) => {
    controller.clear(key)
    if (filterView === key) setFilterView('filters')
  }
  const filterContent = (
    <>
      <FilterViewHeader
        title={
          filterView === 'filters'
            ? 'Filtros'
            : `Editar ${controller.definition(filterView)?.label}`
        }
        onBack={() =>
          setFilterView(filterView === 'filters' ? 'results' : 'filters')
        }
        onClose={() => setFilterView('results')}
        closeClassName="sm:hidden"
      />
      <div className="mt-4">
        {filterView === 'filters' || filterView === 'results' ? (
          <FilterPropertyList
            items={controller.definitions.map(({ key, label }) => ({
              key: key as ActiveFilter,
              label,
              summary: controller.activeItems.find((item) => item.key === key)
                ?.summary,
            }))}
            onSelect={setFilterView}
          />
        ) : (
          controller.definition(filterView) && (
            <StandardFilterEditor
              definition={controller.definition(filterView)!}
              state={filters}
              onChange={onChange}
            />
          )
        )}
      </div>
    </>
  )

  return (
    <div className="mb-6 space-y-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
        <label className="relative">
          <span className="sr-only">Buscar editais</span>
          <Search className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground" />
          <Input
            className="pl-10"
            value={filters.search}
            placeholder="Busque por título, número ou local"
            onChange={(event) => update('search', event.target.value)}
          />
        </label>
        <ResponsiveFilterSurface
          open={filterView !== 'results'}
          onOpenChange={(open) => setFilterView(open ? 'filters' : 'results')}
          title={
            controller.activeCount === 0
              ? 'Nenhum filtro'
              : `${controller.activeCount} ${controller.activeCount === 1 ? 'filtro' : 'filtros'}`
          }
          trigger={<FiltersButton count={controller.activeCount} />}
        >
          {filterContent}
        </ResponsiveFilterSurface>
        <Button
          variant="outline"
          onClick={() => {
            update('registrationEndAfter', localDateKey(new Date()))
          }}
        >
          <Filter /> Inscrições abertas
        </Button>
        <div className="flex gap-2">
          <Select
            value={filters.sortField}
            onValueChange={(value) =>
              update('sortField', value as ExchangeNoticeFilters['sortField'])
            }
          >
            <SelectTrigger aria-label="Ordenar por">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="registrationStart">Data de início</SelectItem>
              <SelectItem value="registrationEnd">Data de fim</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            aria-label={
              filters.sortDirection === 'asc'
                ? 'Alterar para ordem decrescente'
                : 'Alterar para ordem crescente'
            }
            onClick={() =>
              update(
                'sortDirection',
                filters.sortDirection === 'asc' ? 'desc' : 'asc',
              )
            }
          >
            {filters.sortDirection === 'asc' ? 'Crescente' : 'Decrescente'}
          </Button>
        </div>
      </div>

      <AppliedFilters
        items={controller.activeItems}
        onEdit={(key) => setFilterView(key as ActiveFilter)}
        onRemove={(key) => removeFilter(key as ActiveFilter)}
        onClear={controller.clearAll}
        onAdd={() => setFilterView('filters')}
      />
    </div>
  )
}
