import type { OwnGroupMembership } from '@ominira/pomi-sdk/generated/app'

type Permission = OwnGroupMembership['permissions'][number]

export function canOrganizeEvents(permissions: ReadonlyArray<Permission>) {
  return permissions.some((permission) =>
    ['EVENT_CREATE', 'EVENT_EDIT', 'EVENT_PUBLISH'].includes(permission),
  )
}

export function groupWorkspaceDestination(
  permissions: ReadonlyArray<Permission>,
) {
  if (canOrganizeEvents(permissions))
    return '/grupos/$groupId/gerenciar/eventos' as const
  if (
    permissions.includes('MEMBER_MANAGE') ||
    permissions.includes('ROLE_MANAGE')
  )
    return permissions.includes('MEMBER_MANAGE')
      ? ('/grupos/$groupId/gerenciar/pessoas' as const)
      : ('/grupos/$groupId/gerenciar/acessos' as const)
  return '/grupos/$groupId/gerenciar/perfil' as const
}
