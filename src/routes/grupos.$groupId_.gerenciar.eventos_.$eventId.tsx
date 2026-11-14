import { createFileRoute } from '@tanstack/react-router'
import { GroupEventDetailPage } from '@/features/groups'

export const Route = createFileRoute(
  '/grupos/$groupId_/gerenciar/eventos_/$eventId',
)({
  component: () => (
    <GroupEventDetailPage eventId={Number(Route.useParams().eventId)} />
  ),
})
