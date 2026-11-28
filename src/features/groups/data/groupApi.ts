import type {
  createGroupEventInput,
  createGroupInput,
  createGroupRoleInput,
  updateGroupEventInput,
  updateGroupInput,
  updateGroupRoleInput,
  updateManagedGroupMembershipInput,
} from '@ominira/pomi-sdk/generated/app'
import { pomiSdk } from '@/api/client'

type Token = () => Promise<string>
const context = (getAccessToken: Token) => ({ getAccessToken })
const filter = (groupId: number) => ({ filter: { groupId } })

export const groupApi = {
  list: () => pomiSdk.app.groups.listAll({}),
  get: (groupId: number) => pomiSdk.app.groups.get(groupId),
  members: (groupId: number) =>
    pomiSdk.app.groupCommunity.listPublicGroupMembershipsAll(filter(groupId)),
  membersForPublicProfile: (publicId: string) =>
    pomiSdk.app.groupCommunity.listPublicGroupMembershipsAll({
      filter: { publicId },
    }),
  events: (groupId: number) =>
    pomiSdk.app.groupCommunity.listGroupEventsAll(filter(groupId)),
  listEvents: () => pomiSdk.app.groupCommunity.listGroupEventsAll({}),
  getEvent: (eventId: number) =>
    pomiSdk.app.groupCommunity.getGroupEvent(eventId),
  ownMemberships: (userId: number, token: Token) =>
    pomiSdk.app.groupCommunity.listUserGroupMembershipsAll(
      userId,
      {},
      context(token),
    ),
  managedMembers: (userId: number, groupId: number, token: Token) =>
    pomiSdk.app.groupCommunity.listManagedGroupMembershipsAll(
      userId,
      groupId,
      {},
      context(token),
    ),
  managedEvents: (userId: number, groupId: number, token: Token) =>
    pomiSdk.app.groupCommunity.listManagedGroupEventsAll(
      userId,
      groupId,
      {},
      context(token),
    ),
  roles: (userId: number, groupId: number, token: Token) =>
    pomiSdk.app.groupCommunity.listGroupRolesAll(
      userId,
      groupId,
      {},
      context(token),
    ),
  invitations: (userId: number, token: Token) =>
    pomiSdk.app.groupCommunity.listGroupInvitationsAll(
      userId,
      {},
      context(token),
    ),
  managedInvitations: (userId: number, groupId: number, token: Token) =>
    pomiSdk.app.groupCommunity.listManagedGroupInvitationsAll(
      userId,
      groupId,
      {},
      context(token),
    ),
  create: (userId: number, body: createGroupInput['body'], token: Token) =>
    pomiSdk.app.groups.create(userId, body, context(token)),
  update: (
    userId: number,
    groupId: number,
    body: updateGroupInput['body'],
    token: Token,
  ) => pomiSdk.app.groups.update(groupId, userId, body, context(token)),
  archive: (userId: number, groupId: number, token: Token) =>
    pomiSdk.app.groups.archive(groupId, userId, context(token)),
  invite: (
    userId: number,
    groupId: number,
    recipientPublicId: string,
    token: Token,
  ) =>
    pomiSdk.app.groupCommunity.createGroupInvitation(
      userId,
      groupId,
      { recipientPublicId },
      context(token),
    ),
  accept: (userId: number, invitationId: number, token: Token) =>
    pomiSdk.app.groupCommunity.acceptGroupInvitation(
      userId,
      invitationId,
      context(token),
    ),
  decline: (userId: number, invitationId: number, token: Token) =>
    pomiSdk.app.groupCommunity.declineGroupInvitation(
      userId,
      invitationId,
      context(token),
    ),
  visibility: (
    userId: number,
    membershipId: number,
    isPublic: boolean,
    token: Token,
  ) =>
    pomiSdk.app.groupCommunity.updateUserGroupMembership(
      userId,
      membershipId,
      { isPublic },
      context(token),
    ),
  updateMember: (
    userId: number,
    groupId: number,
    membershipId: number,
    body: updateManagedGroupMembershipInput['body'],
    token: Token,
  ) =>
    pomiSdk.app.groupCommunity.updateManagedGroupMembership(
      userId,
      groupId,
      membershipId,
      body,
      context(token),
    ),
  createRole: (
    userId: number,
    groupId: number,
    body: createGroupRoleInput['body'],
    token: Token,
  ) =>
    pomiSdk.app.groupCommunity.createGroupRole(
      userId,
      groupId,
      body,
      context(token),
    ),
  updateRole: (
    userId: number,
    groupId: number,
    roleId: number,
    body: updateGroupRoleInput['body'],
    token: Token,
  ) =>
    pomiSdk.app.groupCommunity.updateGroupRole(
      userId,
      groupId,
      roleId,
      body,
      context(token),
    ),
  deleteRole: (userId: number, groupId: number, roleId: number, token: Token) =>
    pomiSdk.app.groupCommunity.deleteGroupRole(
      userId,
      groupId,
      roleId,
      context(token),
    ),
  createEvent: (
    userId: number,
    groupId: number,
    body: createGroupEventInput['body'],
    token: Token,
  ) =>
    pomiSdk.app.groupCommunity.createGroupEvent(
      userId,
      groupId,
      body,
      context(token),
    ),
  updateEvent: (
    userId: number,
    groupId: number,
    eventId: number,
    body: updateGroupEventInput['body'],
    token: Token,
  ) =>
    pomiSdk.app.groupCommunity.updateGroupEvent(
      userId,
      groupId,
      eventId,
      body,
      context(token),
    ),
  publishEvent: (
    userId: number,
    groupId: number,
    eventId: number,
    token: Token,
  ) =>
    pomiSdk.app.groupCommunity.publishGroupEvent(
      userId,
      groupId,
      eventId,
      context(token),
    ),
  cancelEvent: (
    userId: number,
    groupId: number,
    eventId: number,
    token: Token,
  ) =>
    pomiSdk.app.groupCommunity.cancelGroupEvent(
      userId,
      groupId,
      eventId,
      context(token),
    ),
}
