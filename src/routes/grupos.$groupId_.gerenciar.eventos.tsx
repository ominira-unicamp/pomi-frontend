import { createFileRoute } from '@tanstack/react-router'
import { GroupEventsManagementPage } from '@/features/groups'
import { readManagedEventsSearch } from '@/lib/navigation'

export const Route = createFileRoute('/grupos/$groupId_/gerenciar/eventos')({
  validateSearch: readManagedEventsSearch,
  component: ManagedEventsRoute,
})

function ManagedEventsRoute() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  return (
    <GroupEventsManagementPage
      search={search}
      onSearchChange={(next) => void navigate({ search: next })}
    />
  )
}
