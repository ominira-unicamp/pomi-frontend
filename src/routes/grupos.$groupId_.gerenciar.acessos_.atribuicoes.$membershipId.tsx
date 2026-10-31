import { createFileRoute } from '@tanstack/react-router'
import { GroupRoleAssignmentPage } from '@/features/groups'

export const Route = createFileRoute(
  '/grupos/$groupId_/gerenciar/acessos_/atribuicoes/$membershipId',
)({
  component: () => (
    <GroupRoleAssignmentPage
      membershipId={Number(Route.useParams().membershipId)}
    />
  ),
})
