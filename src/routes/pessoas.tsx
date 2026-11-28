import { createFileRoute } from '@tanstack/react-router'
import { PublicPeoplePage } from '@/features/social'
import { readPeopleSearch } from '@/lib/navigation'

export const Route = createFileRoute('/pessoas')({
  validateSearch: readPeopleSearch,
  component: PeopleRoute,
})

function PeopleRoute() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  return (
    <PublicPeoplePage
      query={search.q ?? ''}
      onQueryChange={(q) =>
        void navigate({ search: { q: q || undefined }, replace: true })
      }
    />
  )
}
