import { createFileRoute } from '@tanstack/react-router'
import { GroupEventCreatePage } from '@/features/groups'

export const Route = createFileRoute(
  '/grupos/$groupId_/gerenciar/eventos_/novo',
)({
  component: GroupEventCreatePage,
})
