import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { GroupsPage } from '@/features/groups'

export const Route = createFileRoute('/grupos/')({
  validateSearch: (search: Record<string, unknown>): { q?: string } => ({
    q: typeof search.q === 'string' && search.q.trim() ? search.q : undefined,
  }),
  component: GroupsIndexRoute,
})

function GroupsIndexRoute() {
  const navigate = useNavigate()
  const { q } = Route.useSearch()
  return (
    <GroupsPage
      query={q ?? ''}
      onQueryChange={(value) =>
        void navigate({
          to: '/grupos',
          search: { q: value || undefined },
          replace: true,
        })
      }
    />
  )
}
