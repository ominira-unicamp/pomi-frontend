import { ChevronLeft, ChevronRight, Plus, Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import type { Course, CourseId } from '@pomi/planner-domain/curriculum'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { cn } from '@/lib/utils'

type CourseFilter = 'prefix' | 'credits'

const pageSize = 5

const filterOptions: ReadonlyArray<
  Readonly<{ key: CourseFilter; label: string }>
> = [
  { key: 'prefix', label: 'Prefixo' },
  { key: 'credits', label: 'Créditos' },
]

export function CourseSearchDialog({
  open,
  onOpenChange,
  courses,
  excludedCourseIds,
  initialPrefix,
  title = 'Adicionar disciplina',
  description,
  searchLabel,
  disabled,
  onAdd,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  courses: ReadonlyArray<Course>
  excludedCourseIds: ReadonlySet<CourseId>
  initialPrefix?: string
  title?: string
  description: string
  searchLabel: string
  disabled: boolean
  onAdd: (courseId: CourseId) => Promise<boolean>
}) {
  const normalizedInitialPrefix = initialPrefix?.trim().toUpperCase()
  const [query, setQuery] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState<CourseId>()
  const [prefix, setPrefix] = useState<string>()
  const [credits, setCredits] = useState<number>()
  const [activeFilters, setActiveFilters] = useState<Array<CourseFilter>>([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (!open) return
    setQuery('')
    setSelectedCourseId(undefined)
    setPrefix(normalizedInitialPrefix)
    setCredits(undefined)
    setActiveFilters(normalizedInitialPrefix ? ['prefix'] : [])
    setPage(1)
  }, [normalizedInitialPrefix, open])

  const prefixes = useMemo(
    () =>
      [...new Set(courses.map(coursePrefix))].sort((left, right) =>
        left.localeCompare(right),
      ),
    [courses],
  )
  const creditValues = useMemo(
    () =>
      [...new Set(courses.map((course) => course.credits))].sort(
        (a, b) => a - b,
      ),
    [courses],
  )
  const normalizedQuery = normalizeSearch(query)
  const filteredCourses = useMemo(
    () =>
      courses
        .filter(
          (course) => !prefix || course.code.toUpperCase().startsWith(prefix),
        )
        .filter((course) => credits === undefined || course.credits === credits)
        .filter((course) => {
          if (!normalizedQuery) return true
          return normalizeSearch(`${course.code} ${course.name}`).includes(
            normalizedQuery,
          )
        })
        .sort((left, right) => left.code.localeCompare(right.code, 'pt-BR')),
    [courses, credits, excludedCourseIds, normalizedQuery, prefix],
  )
  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / pageSize))
  const visibleCourses = filteredCourses.slice(
    (page - 1) * pageSize,
    page * pageSize,
  )
  const bodyRowCount = Math.max(visibleCourses.length, 1)
  const placeholderRowCount = Math.max(0, pageSize - bodyRowCount)
  const availableFilters = filterOptions.filter(
    ({ key }) => !activeFilters.includes(key),
  )

  useEffect(() => {
    setPage(1)
    setSelectedCourseId(undefined)
  }, [credits, normalizedQuery, prefix])

  function addFilter(filter: CourseFilter) {
    setActiveFilters((current) =>
      current.includes(filter) ? current : [...current, filter],
    )
  }

  function removeFilter(filter: CourseFilter) {
    setActiveFilters((current) => current.filter((item) => item !== filter))
    if (filter === 'prefix') setPrefix(undefined)
    if (filter === 'credits') setCredits(undefined)
  }

  async function submit() {
    if (!selectedCourseId) return
    if (excludedCourseIds.has(selectedCourseId)) return
    if (await onAdd(selectedCourseId)) onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
            <label className="relative block">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                role="combobox"
                aria-label={searchLabel}
                aria-expanded={visibleCourses.length > 0}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Código ou nome da disciplina"
                className="pl-9"
              />
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
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
          {activeFilters.length > 0 && (
            <div className="grid gap-3 rounded-md border-2 border-border bg-muted/30 p-3 sm:grid-cols-2">
              {activeFilters.map((filter) => (
                <div key={filter} className="min-w-0">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-sm font-extrabold">
                      {filter === 'prefix' ? 'Prefixo' : 'Créditos'}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      aria-label={`Remover filtro ${filter === 'prefix' ? 'Prefixo' : 'Créditos'}`}
                      onClick={() => removeFilter(filter)}
                    >
                      <X />
                    </Button>
                  </div>
                  {filter === 'prefix' ? (
                    <Select
                      value={prefix ?? 'all'}
                      onValueChange={(value) =>
                        setPrefix(value === 'all' ? undefined : value)
                      }
                    >
                      <SelectTrigger aria-label="Filtrar por prefixo">
                        <SelectValue placeholder="Todos os prefixos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os prefixos</SelectItem>
                        {prefixes.map((value) => (
                          <SelectItem key={value} value={value}>
                            {value}---
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Select
                      value={credits === undefined ? 'all' : String(credits)}
                      onValueChange={(value) =>
                        setCredits(value === 'all' ? undefined : Number(value))
                      }
                    >
                      <SelectTrigger aria-label="Filtrar por créditos">
                        <SelectValue placeholder="Todos os créditos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os créditos</SelectItem>
                        {creditValues.map((value) => (
                          <SelectItem key={value} value={String(value)}>
                            {value} créditos
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="overflow-x-auto rounded-md border-2 border-border">
            <table className="w-full table-fixed border-collapse text-left text-sm">
              <colgroup>
                <col className="w-24 sm:w-36" />
                <col className="w-20 sm:w-28" />
                <col />
              </colgroup>
              <thead className="bg-muted/60 text-xs font-black tracking-[0.08em] uppercase">
                <tr>
                  <th className="border-b-2 border-border px-3 py-2">Código</th>
                  <th className="border-b-2 border-border px-3 py-2">
                    Créditos
                  </th>
                  <th className="border-b-2 border-border px-3 py-2">Nome</th>
                </tr>
              </thead>
              <tbody>
                {visibleCourses.map((course) => {
                  const unavailable = excludedCourseIds.has(course.id)
                  return (
                    <tr
                      key={course.id}
                      role="button"
                      tabIndex={unavailable ? -1 : 0}
                      aria-label={`Selecionar ${course.code}, ${course.name}${unavailable ? ', já adicionada ao planejamento' : ''}`}
                      aria-disabled={unavailable}
                      aria-selected={selectedCourseId === course.id}
                      className={cn(
                        'h-10 border-b border-border last:border-b-0',
                        unavailable
                          ? 'cursor-not-allowed text-muted-foreground opacity-60'
                          : 'cursor-pointer hover:bg-muted/40',
                        selectedCourseId === course.id && 'bg-primary/10',
                      )}
                      onClick={() => {
                        if (!unavailable) setSelectedCourseId(course.id)
                      }}
                      onKeyDown={(event) => {
                        if (
                          !unavailable &&
                          (event.key === 'Enter' || event.key === ' ')
                        ) {
                          event.preventDefault()
                          setSelectedCourseId(course.id)
                        }
                      }}
                    >
                      <td className="px-3 py-2 font-mono font-black text-primary">
                        {course.code}
                      </td>
                      <td className="px-3 py-2 font-semibold">
                        {course.credits}
                      </td>
                      <td className="px-3 py-2 font-semibold">
                        {course.name}
                        {unavailable && (
                          <span className="ml-2 text-xs font-bold text-muted-foreground">
                            Já adicionada
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {visibleCourses.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="h-10 px-4 text-center text-muted-foreground"
                    >
                      Nenhuma disciplina disponível com estes filtros.
                    </td>
                  </tr>
                )}
                {Array.from({ length: placeholderRowCount }, (_, index) => (
                  <tr key={`placeholder:${index}`} aria-hidden="true">
                    <td colSpan={3} className="h-10 p-0" />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <nav
            className="flex items-center justify-center gap-3"
            aria-label="Paginação das disciplinas"
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              <ChevronLeft /> Anterior
            </Button>
            <span className="text-sm font-bold">
              {page} / {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Próxima <ChevronRight />
            </Button>
          </nav>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={
              disabled ||
              !selectedCourseId ||
              excludedCourseIds.has(selectedCourseId)
            }
            onClick={() => void submit()}
          >
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function coursePrefix(course: Course) {
  return (course.prefix ?? course.code.match(/^[A-Za-z]+/)?.[0] ?? '')
    .trim()
    .toUpperCase()
}

function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase()
}
