import { createFileRoute } from '@tanstack/react-router'
import { GroupRoleDetailPage } from '@/features/groups'

export const Route = createFileRoute(
  '/grupos/$groupId_/gerenciar/acessos_/$roleId',
)({
  component: () => (
    <GroupRoleDetailPage roleId={Number(Route.useParams().roleId)} />
  ),
})
