import { createFileRoute } from '@tanstack/react-router'
import { CourseSituationPage } from '@/features/course-situation'
import { readSituationSearch } from '@/lib/navigation'

export const Route = createFileRoute('/situacao-do-curso')({
  validateSearch: readSituationSearch,
  component: SituationRoute,
})

function SituationRoute() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  return (
    <CourseSituationPage
      search={search}
      onSearchChange={(next, options) =>
        void navigate({ search: next, ...options })
      }
    />
  )
}
