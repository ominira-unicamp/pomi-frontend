import { createFileRoute } from '@tanstack/react-router'
import {
  TaxonomyExplorePage,
  readTaxonomySearch,
} from '@/features/tag-taxonomy'

export const Route = createFileRoute('/taxonomia/')({
  validateSearch: readTaxonomySearch,
  component: ExploreRoute,
})

function ExploreRoute() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  return (
    <TaxonomyExplorePage
      search={search}
      onSearchChange={(next) => void navigate({ search: next, replace: true })}
    />
  )
}
