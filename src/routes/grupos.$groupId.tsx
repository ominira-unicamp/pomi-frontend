import { createFileRoute } from '@tanstack/react-router'
import { GroupDetailPage } from '@/features/groups'

export const Route = createFileRoute('/grupos/$groupId')({
  component: () => {
    const { groupId } = Route.useParams()
    return <GroupDetailPage groupId={Number(groupId)} />
  },
})
