import { createFileRoute, useNavigate } from '@tanstack/react-router'

import type {
  CourseDetailsSearch,
} from '@/features/course-catalog'
import { CourseDetailsPage } from '@/features/course-catalog'

type CourseDetailsRouteSearch = CourseDetailsSearch

export const Route = createFileRoute('/disciplinas/$courseId')({
  validateSearch: (
    search: Record<string, unknown>,
  ): CourseDetailsRouteSearch => ({
    catalogYear: readPositiveInteger(search.catalogYear),
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
      }}
      onSearchChange={(nextSearch) =>
        void navigate({
        to: '/disciplinas/$courseId',
          params,
          search: nextSearch,
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
