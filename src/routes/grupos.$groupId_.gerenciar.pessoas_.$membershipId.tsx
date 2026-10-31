import { createFileRoute } from '@tanstack/react-router'
import { GroupMemberDetailPage } from '@/features/groups'

export const Route = createFileRoute(
  '/grupos/$groupId_/gerenciar/pessoas_/$membershipId',
)({
  component: () => (
    <GroupMemberDetailPage
      membershipId={Number(Route.useParams().membershipId)}
    />
  ),
})
