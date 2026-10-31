import { createFileRoute } from '@tanstack/react-router'
import { GroupRoleCreatePage } from '@/features/groups'

export const Route = createFileRoute(
  '/grupos/$groupId_/gerenciar/acessos_/nova',
)({ component: GroupRoleCreatePage })
