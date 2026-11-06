import { createFileRoute } from '@tanstack/react-router'
import type { TagDetailsSearch } from '@/features/tag-taxonomy'
import { TaxonomyTagPage, readTaxonomySearch } from '@/features/tag-taxonomy'

export const Route = createFileRoute('/taxonomia/tags/$tagId')({
  validateSearch: (search: Record<string, unknown>): TagDetailsSearch => {
    const page = Number(search.page)
    return {
      ...readTaxonomySearch(search),
      page: Number.isSafeInteger(page) && page > 0 ? page : 1,
    }
  },
  component: TagRoute,
})

function TagRoute() {
  const { tagId } = Route.useParams()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  return (
    <TaxonomyTagPage
      key={tagId}
      tagId={Number(tagId)}
      search={search}
      onPageChange={(page) => void navigate({ search: { ...search, page } })}
    />
  )
}
