import { createFileRoute } from '@tanstack/react-router'
import { GroupProfileManagementPage } from '@/features/groups'

export const Route = createFileRoute('/grupos/$groupId_/gerenciar/perfil')({
  component: GroupProfileManagementPage,
})
