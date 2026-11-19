import { readReturnTo } from '@/lib/navigation'
import { createFileRoute } from '@tanstack/react-router'
import { GroupEventCreatePage } from '@/features/groups'

export const Route = createFileRoute(
  '/grupos/$groupId_/gerenciar/eventos_/novo',
)({
  validateSearch: (search: Record<string, unknown>): { returnTo?: string } => ({ returnTo: readReturnTo(search.returnTo) }),
  component: GroupEventCreatePage,
})
