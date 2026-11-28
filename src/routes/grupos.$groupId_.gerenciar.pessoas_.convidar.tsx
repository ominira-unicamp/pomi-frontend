import { createFileRoute } from '@tanstack/react-router'
import { GroupInvitePage } from '@/features/groups'

export const Route = createFileRoute(
  '/grupos/$groupId_/gerenciar/pessoas_/convidar',
)({ component: GroupInvitePage })
