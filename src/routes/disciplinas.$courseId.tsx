import { createFileRoute, useNavigate } from '@tanstack/react-router'

import type {
  CourseDetailsSearch,
  CourseSearch,
} from '@/features/course-catalog'
import { CourseDetailsPage } from '@/features/course-catalog'

type CourseDetailsRouteSearch = CourseDetailsSearch &
  Omit<CourseSearch, 'page'> & { page: number }

export const Route = createFileRoute('/disciplinas/$courseId')({
  validateSearch: (
    search: Record<string, unknown>,
  ): CourseDetailsRouteSearch => ({
    q: readText(search.q),
    unitId: readPositiveInteger(search.unitId),
    tagId: readPositiveInteger(search.tagId),
    page: readPositiveInteger(search.page) ?? 1,
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
          search: { ...search, ...nextSearch },
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

function readText(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}
