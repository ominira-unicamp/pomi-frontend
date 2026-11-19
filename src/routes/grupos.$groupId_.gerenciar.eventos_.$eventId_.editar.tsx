import { readReturnTo } from '@/lib/navigation'
import { createFileRoute } from '@tanstack/react-router'
import { GroupEventEditPage } from '@/features/groups'

export const Route = createFileRoute(
  '/grupos/$groupId_/gerenciar/eventos_/$eventId_/editar',
)({
  validateSearch: (search: Record<string, unknown>): { returnTo?: string } => ({ returnTo: readReturnTo(search.returnTo) }),
  component: () => (
    <GroupEventEditPage eventId={Number(Route.useParams().eventId)} />
  ),
})
