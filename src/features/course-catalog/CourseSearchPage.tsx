import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { BookOpen, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useEffect, useState } from 'react'

import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import {
  AppliedFilters,
  FilterViewHeader,
  FiltersButton,
} from '@/components/patterns/AppliedFilters'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  listCatalogs,
  listCategories,
  listCourses,
  listTags,
  listUnits,
} from '@/features/course-catalog/data/courseCatalogApi'

export type CourseSearch = Readonly<{
  q?: string
  unitId?: number
  catalogYear?: number
  tagId?: number
  page: number
}>

type ActiveFilter = 'unitId' | 'catalogYear' | 'tagId'

const filterOptions: ReadonlyArray<
  Readonly<{ key: ActiveFilter; label: string }>
> = [
  { key: 'unitId', label: 'Unidade' },
  { key: 'catalogYear', label: 'Catálogo' },
  { key: 'tagId', label: 'Tag' },
]

export function CourseSearchPage({
  search,
  onSearchChange,
}: {
  search: CourseSearch
  onSearchChange: (search: CourseSearch) => void
}) {
  const [query, setQuery] = useState(search.q ?? '')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [editingFilter, setEditingFilter] = useState<ActiveFilter>()
  useEffect(() => setQuery(search.q ?? ''), [search.q])

  const unitsQuery = useQuery({
    queryKey: ['public', 'course-catalog', 'units'],
    queryFn: listUnits,
    staleTime: 30 * 60 * 1000,
  })
  const catalogsQuery = useQuery({
    queryKey: ['public', 'course-catalog', 'catalogs'],
    queryFn: listCatalogs,
    staleTime: 30 * 60 * 1000,
  })
  const categoriesQuery = useQuery({
    queryKey: ['public', 'course-catalog', 'categories'],
    queryFn: listCategories,
    staleTime: 30 * 60 * 1000,
  })
  const tagsQuery = useQuery({
    queryKey: ['public', 'course-catalog', 'tags'],
    queryFn: listTags,
    staleTime: 30 * 60 * 1000,
  })
  const coursesQuery = useQuery({
    queryKey: ['public', 'course-catalog', 'search', search],
    queryFn: () => listCourses(search),
  })
  const totalPages = Math.max(
    1,
    Math.ceil((coursesQuery.data?.total ?? 0) / 20),
  )

  function changeFilters(change: Partial<CourseSearch>) {
    onSearchChange({ ...search, ...change, page: 1 })
  }

  useEffect(() => {
    const normalizedQuery = query.trim() || undefined
    if (normalizedQuery === search.q) return

    const timeout = window.setTimeout(() => {
      onSearchChange({ ...search, q: normalizedQuery, page: 1 })
    }, 300)
    return () => window.clearTimeout(timeout)
  }, [onSearchChange, query, search])

  function updateFilter(key: ActiveFilter, value?: number) {
    changeFilters({ [key]: value })
  }

  function removeFilter(key: ActiveFilter) {
    changeFilters({ [key]: undefined })
    if (editingFilter === key) setEditingFilter(undefined)
  }

  function submit(event: React.FormEvent) {
    event.preventDefault()
    changeFilters({ q: query.trim() || undefined })
  }

  function clearFilters() {
    setQuery('')
    setEditingFilter(undefined)
    setFiltersOpen(false)
    onSearchChange({ page: 1 })
  }

  const activeFilters = filterOptions
    .map(({ key }) => key)
    .filter((key) => search[key] !== undefined)
  const availableFilters = filterOptions.filter(
    ({ key }) => !activeFilters.includes(key),
  )
  const appliedFilters = activeFilters.map((key) => ({
    key,
    label: filterOptions.find((option) => option.key === key)?.label ?? key,
    summary:
      key === 'unitId'
        ? ((unitsQuery.data ?? []).find((unit) => unit.id === search.unitId)
            ?.code ?? String(search.unitId))
        : key === 'catalogYear'
          ? String(search.catalogYear)
          : ((tagsQuery.data ?? []).find((tag) => tag.id === search.tagId)
              ?.name ?? String(search.tagId)),
  }))

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Catálogo acadêmico"
        title="Buscar disciplinas"
        description="Encontre ementas, pré-requisitos, turmas, horários e disciplinas relacionadas."
      />
      <form
        onSubmit={submit}
        className="mb-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]"
      >
        <label className="sr-only" htmlFor="course-search">
          Código ou nome da disciplina
        </label>
        <Input
          id="course-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Código ou nome, por exemplo MA141 ou Cálculo"
          className="h-11"
        />
        <div className="grid grid-cols-2 gap-2 lg:flex">
          <Button type="submit" className="h-11">
            <Search /> Buscar
          </Button>
          <FiltersButton
            count={activeFilters.length}
            onClick={() => {
              setFiltersOpen((current) => !current)
              setEditingFilter(undefined)
            }}
          />
        </div>
      </form>

      <AppliedFilters
        items={appliedFilters}
        className="mb-4"
        onEdit={(key) => {
          setFiltersOpen(true)
          setEditingFilter(key)
        }}
        onRemove={removeFilter}
        onClear={clearFilters}
        onAdd={() => {
          setFiltersOpen(true)
          setEditingFilter(undefined)
        }}
      />
      {filtersOpen && (
        <div className="mb-8 rounded-lg border-2 border-strong-border bg-card p-4 shadow-[4px_4px_0_var(--strong-border)]">
          <FilterViewHeader
            title={
              editingFilter
                ? `Editar ${filterOptions.find(({ key }) => key === editingFilter)?.label}`
                : 'Filtros'
            }
            onBack={() =>
              editingFilter
                ? setEditingFilter(undefined)
                : setFiltersOpen(false)
            }
            onClose={() => {
              setEditingFilter(undefined)
              setFiltersOpen(false)
            }}
          />
          <div className="mt-4">
            {!editingFilter ? (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ...activeFilters,
                  ...availableFilters.map(({ key }) => key),
                ].map((key) => {
                  const option = filterOptions.find((item) => item.key === key)!
                  const applied = appliedFilters.find(
                    (item) => item.key === key,
                  )
                  return (
                    <Button
                      key={key}
                      variant="outline"
                      className="h-auto min-h-11 justify-between whitespace-normal text-left"
                      onClick={() => setEditingFilter(key)}
                    >
                      {option.label}
                      <span className="text-xs text-muted-foreground">
                        {applied?.summary ?? 'Não aplicado'}
                      </span>
                    </Button>
                  )
                })}
              </div>
            ) : editingFilter === 'unitId' ? (
              <FilterSelect
                label="Unidade"
                value={search.unitId}
                placeholder="Todas as unidades"
                options={(unitsQuery.data ?? []).map((unit) => ({
                  value: unit.id,
                  label: `${unit.code} — ${unit.name}`,
                }))}
                onChange={(value) => updateFilter('unitId', value)}
              />
            ) : editingFilter === 'catalogYear' ? (
              <FilterSelect
                label="Catálogo"
                value={search.catalogYear}
                placeholder="Todos os catálogos"
                options={[...(catalogsQuery.data ?? [])]
                  .sort((a, b) => b.year - a.year)
                  .map((catalog) => ({
                    value: catalog.year,
                    label: String(catalog.year),
                  }))}
                onChange={(value) => updateFilter('catalogYear', value)}
              />
            ) : (
              <TagFilterSelect
                label="Tag"
                value={search.tagId}
                options={(tagsQuery.data ?? []).map((tag) => ({
                  value: tag.id,
                  label: `${categoriesQuery.data?.find((category) => category.id === tag.categoryId)?.name ?? 'Categoria'}: ${tag.name}`,
                }))}
                onChange={(value) => updateFilter('tagId', value)}
              />
            )}
          </div>
        </div>
      )}

      {coursesQuery.isLoading ? (
        <LoadingState label="Buscando disciplinas" />
      ) : coursesQuery.isError ? (
        <ErrorState
          title="Não foi possível buscar as disciplinas"
          description="Verifique sua conexão e tente novamente."
          action={{
            label: 'Tentar novamente',
            onClick: () => void coursesQuery.refetch(),
          }}
        />
      ) : !coursesQuery.data ? (
        <LoadingState label="Preparando resultados" />
      ) : coursesQuery.data.data.length === 0 ? (
        <EmptyState
          title="Nenhuma disciplina encontrada"
          description="Altere a busca ou remova alguns filtros."
          action={{ label: 'Limpar filtros', onClick: clearFilters }}
        />
      ) : (
        <section aria-live="polite" aria-label="Resultados da busca">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm">
            <strong>
              {coursesQuery.data.total === 1
                ? '1 disciplina encontrada'
                : `${coursesQuery.data.total} disciplinas encontradas`}
            </strong>
            <span className="text-muted-foreground">
              Página {search.page} de {totalPages}
            </span>
          </div>
          <div className="space-y-3">
            {coursesQuery.data.data.map((course) => (
              <Link
                key={course.id}
                to="/disciplinas/$courseId"
                params={{ courseId: String(course.id) }}
                search={{}}
                className="pomi-focus block rounded-lg"
              >
                <Card
                  variant="interactive"
                  className="flex items-center gap-4 p-4 sm:px-5"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-sm bg-primary text-primary-foreground">
                    <BookOpen className="size-4" />
                  </span>
                  <p className="w-20 shrink-0 font-mono text-sm font-black text-primary">
                    {course.code}
                  </p>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate font-extrabold">{course.name}</h2>
                    <p className="mt-1 text-xs text-muted-foreground sm:hidden">
                      {course.unitCode ?? 'Unidade não informada'} ·{' '}
                      {course.credits} créditos
                    </p>
                  </div>
                  <div className="hidden shrink-0 text-right text-sm text-muted-foreground sm:block">
                    <p>{course.unitCode ?? 'Unidade não informada'}</p>
                    <p>{course.credits} créditos</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          {totalPages > 1 && (
            <nav
              className="mt-8 flex items-center justify-center gap-3"
              aria-label="Paginação das disciplinas"
            >
              <Button
                variant="outline"
                disabled={search.page <= 1}
                onClick={() =>
                  onSearchChange({ ...search, page: search.page - 1 })
                }
              >
                <ChevronLeft /> Anterior
              </Button>
              <span className="text-sm font-bold">
                {search.page} / {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={search.page >= totalPages}
                onClick={() =>
                  onSearchChange({ ...search, page: search.page + 1 })
                }
              >
                Próxima <ChevronRight />
              </Button>
            </nav>
          )}
        </section>
      )}
    </PageContainer>
  )
}

function TagFilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value?: number
  options: ReadonlyArray<Readonly<{ value: number; label: string }>>
  onChange: (value?: number) => void
}) {
  return (
    <AutocompleteSelect
      ariaLabel={label}
      value={value === undefined ? '' : String(value)}
      options={options.map((option) => ({
        value: String(option.value),
        label: option.label,
      }))}
      placeholder="Buscar tag"
      emptyLabel="Todas as tags"
      onValueChange={(nextValue) =>
        onChange(nextValue === '' ? undefined : Number(nextValue))
      }
    />
  )
}

function FilterSelect({
  label,
  value,
  placeholder,
  options,
  showLabel,
  onChange,
}: {
  label: string
  value?: number
  placeholder: string
  options: ReadonlyArray<Readonly<{ value: number; label: string }>>
  showLabel?: boolean
  onChange: (value?: number) => void
}) {
  return (
    <label className="space-y-2 text-sm font-bold">
      {showLabel !== false && <span>{label}</span>}
      <Select
        value={value === undefined ? 'all' : String(value)}
        onValueChange={(nextValue) =>
          onChange(nextValue === 'all' ? undefined : Number(nextValue))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{placeholder}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={String(option.value)}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  )
}
