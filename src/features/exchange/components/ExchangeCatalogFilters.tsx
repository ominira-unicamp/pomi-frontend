import { Filter, Plus, Search, X } from 'lucide-react'
import { useState } from 'react'

import type { ExchangePlace } from '@/features/exchange/data/exchangeApi'
import type { ExchangeNoticeFilters } from '@/features/exchange/data/exchangeNotices'
import { SearchableMultiSelect } from '@/components/patterns/SearchableMultiSelect'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  const [activeFilters, setActiveFilters] = useState<Array<ActiveFilter>>([])
  const update = <TKey extends keyof ExchangeNoticeFilters>(
    key: TKey,
    value: ExchangeNoticeFilters[TKey],
  ) => onChange({ ...filters, [key]: value })
  const addFilter = (key: ActiveFilter) =>
    setActiveFilters((current) =>
      current.includes(key) ? current : [...current, key],
    )
  const removeFilter = (key: ActiveFilter) => {
    setActiveFilters((current) => current.filter((item) => item !== key))
    update(key, defaultExchangeNoticeFilters[key])
  }
  const availableFilters = filterOptions.filter(
    ({ key }) => !activeFilters.includes(key),
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" disabled={availableFilters.length === 0}>
              <Plus /> Mais filtros
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {availableFilters.map(({ key, label }) => (
              <DropdownMenuItem key={key} onSelect={() => addFilter(key)}>
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="outline"
          onClick={() => {
            addFilter('registrationEndAfter')
            update('registrationEndAfter', localDateKey(new Date()))
          }}
        >
          <Filter /> Inscrições abertas
        </Button>
        <div className="flex gap-2">
          <Select
            value={filters.sortField}
            onValueChange={(value) =>
              update(
                'sortField',
                value as ExchangeNoticeFilters['sortField'],
              )
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

      {activeFilters.length > 0 && (
        <div className="grid gap-4 rounded-lg border-2 border-strong-border bg-muted/40 p-4 md:grid-cols-2 xl:grid-cols-3">
          {activeFilters.map((key) => {
            const label = filterOptions.find(
              (option) => option.key === key,
            )!.label
            return (
              <div key={key} className="min-w-0">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-sm font-extrabold">{label}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    aria-label={`Remover filtro ${label}`}
                    onClick={() => removeFilter(key)}
                  >
                    <X />
                  </Button>
                </div>
                {key === 'issuers' ? (
                  <SearchableMultiSelect
                    label={label}
                    options={issuers.map((issuer) => ({
                      value: issuer,
                      label: issuer,
                    }))}
                    selected={filters.issuers}
                    onChange={(values) => update('issuers', values)}
                  />
                ) : key === 'placeIds' ? (
                  <SearchableMultiSelect
                    label={label}
                    options={places.map((place) => ({
                      value: place.id,
                      label: place.name,
                    }))}
                    selected={filters.placeIds}
                    onChange={(values) => update('placeIds', values)}
                  />
                ) : (
                  <Input
                    aria-label={label}
                    type="date"
                    value={filters[key]}
                    onChange={(event) => update(key, event.target.value)}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
