import { createFileRoute } from '@tanstack/react-router'
import { readReturnTo } from '@/lib/navigation'
import { GroupEventDetailPage } from '@/features/groups'

export const Route = createFileRoute(
  '/grupos/$groupId_/gerenciar/eventos_/$eventId',
)({
  validateSearch: (search: Record<string, unknown>): { returnTo?: string } => ({ returnTo: readReturnTo(search.returnTo) }),
  component: () => (
    <GroupEventDetailPage eventId={Number(Route.useParams().eventId)} />
  ),
})
