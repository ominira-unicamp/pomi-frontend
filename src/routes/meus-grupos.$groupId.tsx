import { createFileRoute } from '@tanstack/react-router'
import { MyGroupMembershipPage } from '@/features/groups'

export const Route = createFileRoute('/meus-grupos/$groupId')({
  component: () => {
    const { groupId } = Route.useParams()
    return <MyGroupMembershipPage groupId={Number(groupId)} />
  },
})
