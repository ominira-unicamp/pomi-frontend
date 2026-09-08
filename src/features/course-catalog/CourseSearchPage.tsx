import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  const [activeFilters, setActiveFilters] = useState<Array<ActiveFilter>>(() =>
    filterOptions
      .map(({ key }) => key)
      .filter((key) => search[key] !== undefined),
  )
  useEffect(() => setQuery(search.q ?? ''), [search.q])
  useEffect(() => {
    setActiveFilters((current) => [
      ...current,
      ...filterOptions
        .map(({ key }) => key)
        .filter((key) => search[key] !== undefined && !current.includes(key)),
    ])
  }, [search.catalogYear, search.tagId, search.unitId])

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

  function addFilter(key: ActiveFilter) {
    setActiveFilters((current) =>
      current.includes(key) ? current : [...current, key],
    )
  }

  function updateFilter(key: ActiveFilter, value?: number) {
    addFilter(key)
    changeFilters({ [key]: value })
  }

  function removeFilter(key: ActiveFilter) {
    setActiveFilters((current) => current.filter((item) => item !== key))
    changeFilters({ [key]: undefined })
  }

  function submit(event: React.FormEvent) {
    event.preventDefault()
    changeFilters({ q: query.trim() || undefined })
  }

  function clearFilters() {
    setQuery('')
    setActiveFilters([])
    onSearchChange({ page: 1 })
  }

  const availableFilters = filterOptions.filter(
    ({ key }) => !activeFilters.includes(key),
  )

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
        <div className="flex gap-2">
          <Button type="submit" className="h-11">
            <Search /> Buscar
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-11"
                disabled={availableFilters.length === 0}
              >
                <Plus /> Mais filtros
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {availableFilters.map(({ key, label }) => (
                <DropdownMenuItem key={key} onSelect={() => addFilter(key)}>
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </form>

      {activeFilters.length > 0 && (
        <div className="mb-8 grid gap-4 rounded-lg border-2 border-strong-border bg-muted/40 p-4 md:grid-cols-2 xl:grid-cols-3">
          {activeFilters.map((key) => {
            const label =
              filterOptions.find((option) => option.key === key)?.label ?? key
            return (
              <div key={key} className="min-w-0">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-sm font-extrabold">{label}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    aria-label={`Remover filtro ${label}`}
                    onClick={() => removeFilter(key)}
                  >
                    <X />
                  </Button>
                </div>
                {key === 'unitId' ? (
                  <FilterSelect
                    label={label}
                    value={search.unitId}
                    placeholder="Todas as unidades"
                    options={(unitsQuery.data ?? []).map((unit) => ({
                      value: unit.id,
                      label: `${unit.code} — ${unit.name}`,
                    }))}
                    showLabel={false}
                    onChange={(value) => updateFilter(key, value)}
                  />
                ) : key === 'catalogYear' ? (
                  <FilterSelect
                    label={label}
                    value={search.catalogYear}
                    placeholder="Todos os catálogos"
                    options={[...(catalogsQuery.data ?? [])]
                      .sort((left, right) => right.year - left.year)
                      .map((catalog) => ({
                        value: catalog.year,
                        label: String(catalog.year),
                      }))}
                    showLabel={false}
                    onChange={(value) => updateFilter(key, value)}
                  />
                ) : (
                  <TagFilterSelect
                    label={label}
                    value={search.tagId}
                    options={(tagsQuery.data ?? []).map((tag) => ({
                      value: tag.id,
                      label: `${categoriesQuery.data?.find((category) => category.id === tag.categoryId)?.name ?? 'Categoria'}: ${tag.name}`,
                    }))}
                    onChange={(value) => updateFilter(key, value)}
                  />
                )}
              </div>
            )
          })}
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
