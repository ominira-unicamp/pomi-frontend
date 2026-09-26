import { createFileRoute, useNavigate } from '@tanstack/react-router'

import type { CourseSearch } from '@/features/course-catalog'
import { CourseSearchPage } from '@/features/course-catalog'

export const Route = createFileRoute('/disciplinas/')({
  validateSearch: (search: Record<string, unknown>): CourseSearch => ({
    q: readText(search.q),
    unitId: readPositiveInteger(search.unitId),
    catalogYear: readPositiveInteger(search.catalogYear),
    tagId: readPositiveInteger(search.tagId),
    page: readPositiveInteger(search.page) ?? 1,
  }),
  component: DisciplinasIndexRoute,
})

function DisciplinasIndexRoute() {
  const navigate = useNavigate()
  const search = Route.useSearch()
  return (
    <CourseSearchPage
      search={search}
      onSearchChange={(nextSearch) =>
        void navigate({ to: '/disciplinas', search: nextSearch })
      }
    />
  )
}

function readText(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function readPositiveInteger(value: unknown) {
  const number = typeof value === 'string' ? Number(value) : value
  return typeof number === 'number' && Number.isInteger(number) && number > 0
    ? number
    : undefined
}
