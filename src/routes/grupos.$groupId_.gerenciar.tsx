import { createFileRoute } from '@tanstack/react-router'
import { GroupManagementLayout } from '@/features/groups'

export const Route = createFileRoute('/grupos/$groupId_/gerenciar')({
  component: () => {
    const { groupId } = Route.useParams()
    return <GroupManagementLayout groupId={Number(groupId)} />
  },
})
