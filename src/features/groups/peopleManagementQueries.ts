import { useQuery } from '@tanstack/react-query'
import type { ManagedGroupInvitation } from '@ominira/pomi-sdk/generated/app'
import { groupApi } from '@/features/groups/data/groupApi'
import { useGroupManagement } from '@/features/groups/GroupManagementLayout'
import { ApiError } from '@/api/errors'
import { useOptionalAuth } from '@/auth/AuthProvider'

export const peoplePath = '/grupos/$groupId/gerenciar/pessoas'

export function inviteConflict(error: unknown) {
  if (!(error instanceof ApiError) || error.status !== 409) return undefined
  if (error.problem?.detail === 'Já existe convite pendente.')
    return 'Já existe um convite pendente para essa pessoa neste grupo.'
  if (error.problem?.detail === 'A pessoa já é membro.')
    return 'Essa pessoa já faz parte do grupo.'
  return undefined
}

export function useManagedMembers() {
  const { group, own, userId } = useGroupManagement()
  const auth = useOptionalAuth()
  const allowed =
    own.permissions.includes('MEMBER_MANAGE') ||
    own.permissions.includes('ROLE_MANAGE')
  const query = useQuery({
    queryKey: [
      'private',
      auth.sessionSubject,
      'user',
      userId,
      'groups',
      group.id,
      'members',
    ],
    queryFn: () =>
      groupApi.managedMembers(userId, group.id, auth.getAccessToken),
    enabled: allowed,
    retry: false,
  })
  return { query, allowed }
}

export function useManagedInvitations() {
  const { group, own, userId } = useGroupManagement()
  const auth = useOptionalAuth()
  return useQuery({
    queryKey: [
      'private',
      auth.sessionSubject,
      'user',
      userId,
      'groups',
      group.id,
      'invitations',
    ],
    queryFn: () =>
      groupApi.managedInvitations(userId, group.id, auth.getAccessToken),
    enabled: own.permissions.includes('MEMBER_MANAGE'),
    refetchOnMount: 'always',
    retry: false,
  })
}

export function invitationStatus(invitation: ManagedGroupInvitation) {
  if (invitation.status === 'PENDING') return 'Pendente'
  return {
    ACCEPTED: 'Aceito',
    DECLINED: 'Recusado',
    CANCELLED: 'Cancelado',
    EXPIRED: 'Expirado',
  }[invitation.status]
}

export function hasPendingInvitation(invitation: ManagedGroupInvitation) {
  return (
    invitation.status === 'PENDING' &&
    new Date(invitation.expiresAt).getTime() > Date.now()
  )
}
