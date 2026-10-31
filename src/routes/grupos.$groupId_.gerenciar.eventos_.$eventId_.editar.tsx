import { createFileRoute } from '@tanstack/react-router'
import { GroupEventEditPage } from '@/features/groups'

export const Route = createFileRoute(
  '/grupos/$groupId_/gerenciar/eventos_/$eventId_/editar',
)({
  component: () => (
    <GroupEventEditPage eventId={Number(Route.useParams().eventId)} />
  ),
})
