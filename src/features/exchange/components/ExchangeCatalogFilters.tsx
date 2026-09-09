import { Filter, Search } from 'lucide-react'
import { useState } from 'react'

import type { ExchangePlace } from '@/features/exchange/data/exchangeApi'
import type { ExchangeNoticeFilters } from '@/features/exchange/data/exchangeNotices'
import { SearchableMultiSelect } from '@/components/patterns/SearchableMultiSelect'
import {
  AppliedFilters,
  FilterViewHeader,
  FiltersButton,
} from '@/components/patterns/AppliedFilters'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  defaultExchangeNoticeFilters,
  localDateKey,
} from '@/features/exchange/data/exchangeNotices'

type ActiveFilter =
  | 'issuers'
  | 'placeIds'
  | 'registrationStartAfter'
  | 'registrationStartBefore'
  | 'registrationEndAfter'
  | 'registrationEndBefore'

const filterOptions: ReadonlyArray<{ key: ActiveFilter; label: string }> = [
  { key: 'issuers', label: 'Órgãos emissores' },
  { key: 'placeIds', label: 'Locais' },
  { key: 'registrationStartAfter', label: 'Início a partir de' },
  { key: 'registrationStartBefore', label: 'Início até' },
  { key: 'registrationEndAfter', label: 'Fim a partir de' },
  { key: 'registrationEndBefore', label: 'Fim até' },
]

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
  const removeFilter = (key: ActiveFilter) => {
    update(key, defaultExchangeNoticeFilters[key])
    if (filterView === key) setFilterView('filters')
  }
  const activeFilters = filterOptions
    .map(({ key }) => key)
    .filter((key) =>
      Array.isArray(filters[key])
        ? filters[key].length > 0
        : Boolean(filters[key]),
    )
  const appliedFilters = activeFilters.map((key) => ({
    key,
    label: filterOptions.find((option) => option.key === key)!.label,
    summary:
      key === 'issuers'
        ? summarizeValues(filters.issuers)
        : key === 'placeIds'
          ? summarizeValues(
              filters.placeIds.map(
                (id) =>
                  places.find((place) => place.id === id)?.name ?? String(id),
              ),
            )
          : formatDate(filters[key]),
  }))

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
        <FiltersButton
          count={activeFilters.length}
          onClick={() =>
            setFilterView(filterView === 'results' ? 'filters' : 'results')
          }
        />
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
        items={appliedFilters}
        onEdit={setFilterView}
        onRemove={removeFilter}
        onClear={() => onChange(defaultExchangeNoticeFilters)}
        onAdd={() => setFilterView('filters')}
      />
      {filterView !== 'results' && (
        <div className="rounded-lg border-2 border-strong-border bg-card p-4 shadow-[4px_4px_0_var(--strong-border)]">
          <FilterViewHeader
            title={
              filterView === 'filters'
                ? 'Filtros'
                : `Editar ${filterOptions.find(({ key }) => key === filterView)?.label}`
            }
            onBack={() =>
              setFilterView(filterView === 'filters' ? 'results' : 'filters')
            }
            onClose={() => setFilterView('results')}
          />
          <div className="mt-4">
            {filterView === 'filters' ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {filterOptions.map(({ key, label }) => (
                  <Button
                    key={key}
                    variant="outline"
                    className="h-auto min-h-11 justify-between whitespace-normal text-left"
                    onClick={() => setFilterView(key)}
                  >
                    {label}
                    <span className="text-xs text-muted-foreground">
                      {appliedFilters.find((item) => item.key === key)
                        ?.summary ?? 'Não aplicado'}
                    </span>
                  </Button>
                ))}
              </div>
            ) : filterView === 'issuers' ? (
              <SearchableMultiSelect
                inline
                label="Órgãos emissores"
                options={issuers.map((issuer) => ({
                  value: issuer,
                  label: issuer,
                }))}
                selected={filters.issuers}
                onChange={(values) => update('issuers', values)}
              />
            ) : filterView === 'placeIds' ? (
              <SearchableMultiSelect
                inline
                label="Locais"
                options={places.map((place) => ({
                  value: place.id,
                  label: place.name,
                }))}
                selected={filters.placeIds}
                onChange={(values) => update('placeIds', values)}
              />
            ) : (
              <Input
                aria-label={
                  filterOptions.find(({ key }) => key === filterView)?.label
                }
                type="date"
                value={filters[filterView]}
                onChange={(event) => update(filterView, event.target.value)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function summarizeValues(values: ReadonlyArray<string>) {
  if (values.length <= 2) return values.join(', ')
  return `${values.slice(0, 2).join(', ')}, +${values.length - 2}`
}

function formatDate(value: string) {
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}
