import { createFileRoute } from '@tanstack/react-router'
import { GroupManagementHome } from '@/features/groups'

export const Route = createFileRoute('/grupos/$groupId_/gerenciar/')({
  component: GroupManagementHome,
})
