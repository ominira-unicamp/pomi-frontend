import { createFileRoute } from '@tanstack/react-router'
import { GroupPeopleManagementPage } from '@/features/groups'

export const Route = createFileRoute('/grupos/$groupId_/gerenciar/pessoas')({
  component: GroupPeopleManagementPage,
})
