import { createFileRoute } from '@tanstack/react-router'
import {
  TaxonomyManagePage,
  readTaxonomyManageSearch,
} from '@/features/tag-taxonomy'

export const Route = createFileRoute('/taxonomia/organizar')({
  validateSearch: readTaxonomyManageSearch,
  component: ManageRoute,
})
function ManageRoute() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  return (
    <TaxonomyManagePage
      search={search}
      onSearchChange={(next) => navigate({ search: next, replace: true })}
    />
  )
}
