import { createFileRoute } from '@tanstack/react-router'
import { GroupAccessManagementPage } from '@/features/groups'

export const Route = createFileRoute('/grupos/$groupId_/gerenciar/acessos')({
  component: GroupAccessManagementPage,
})
