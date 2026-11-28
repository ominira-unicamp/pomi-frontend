import { createFileRoute, useNavigate } from '@tanstack/react-router'

import type { CourseDetailsSearch } from '@/features/course-catalog'
import { readReturnTo } from '@/lib/navigation'
import { CourseDetailsPage } from '@/features/course-catalog'

type CourseDetailsRouteSearch = CourseDetailsSearch

export const Route = createFileRoute('/disciplinas/$courseId')({
  validateSearch: (
    search: Record<string, unknown>,
  ): CourseDetailsRouteSearch => ({
    catalogYear: readPositiveInteger(search.catalogYear),
    returnTo: readReturnTo(search.returnTo),
  }),
  component: DisciplinasDetailsRoute,
})

function DisciplinasDetailsRoute() {
  const navigate = useNavigate()
  const params = Route.useParams()
  const search = Route.useSearch()
  const courseId = Number(params.courseId)
  return (
    <CourseDetailsPage
      courseId={courseId}
      search={{
        catalogYear: search.catalogYear,
        returnTo: search.returnTo,
      }}
      onSearchChange={(nextSearch) =>
        void navigate({
          to: '/disciplinas/$courseId',
          params,
          search: nextSearch,
          replace: true,
        })
      }
    />
  )
}

function readPositiveInteger(value: unknown) {
  const number = typeof value === 'string' ? Number(value) : value
  return typeof number === 'number' && Number.isInteger(number) && number > 0
    ? number
    : undefined
}
