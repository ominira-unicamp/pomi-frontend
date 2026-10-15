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
  ownMemberships: (studentId: number, token: Token) =>
    pomiSdk.app.groupCommunity.listStudentGroupMembershipsAll(
      studentId,
      {},
      context(token),
    ),
  managedMembers: (studentId: number, groupId: number, token: Token) =>
    pomiSdk.app.groupCommunity.listManagedGroupMembershipsAll(
      studentId,
      filter(groupId),
      context(token),
    ),
  managedEvents: (studentId: number, groupId: number, token: Token) =>
    pomiSdk.app.groupCommunity.listManagedGroupEventsAll(
      studentId,
      filter(groupId),
      context(token),
    ),
  roles: (studentId: number, groupId: number, token: Token) =>
    pomiSdk.app.groupCommunity.listGroupRolesAll(
      studentId,
      filter(groupId),
      context(token),
    ),
  invitations: (studentId: number, token: Token) =>
    pomiSdk.app.groupCommunity.listGroupInvitationsAll(
      studentId,
      {},
      context(token),
    ),
  managedInvitations: (studentId: number, groupId: number, token: Token) =>
    pomiSdk.app.groupCommunity.listManagedGroupInvitationsAll(
      studentId,
      filter(groupId),
      context(token),
    ),
  create: (studentId: number, body: createGroupInput['body'], token: Token) =>
    pomiSdk.app.groups.create(studentId, body, context(token)),
  update: (
    studentId: number,
    groupId: number,
    body: updateGroupInput['body'],
    token: Token,
  ) => pomiSdk.app.groups.update(groupId, studentId, body, context(token)),
  archive: (studentId: number, groupId: number, token: Token) =>
    pomiSdk.app.groups.archive(groupId, studentId, context(token)),
  invite: (
    studentId: number,
    groupId: number,
    recipientPublicId: string,
    token: Token,
  ) =>
    pomiSdk.app.groupCommunity.createGroupInvitation(
      studentId,
      { groupId, body: { recipientPublicId } },
      context(token),
    ),
  accept: (studentId: number, invitationId: number, token: Token) =>
    pomiSdk.app.groupCommunity.acceptGroupInvitation(
      studentId,
      invitationId,
      context(token),
    ),
  decline: (studentId: number, invitationId: number, token: Token) =>
    pomiSdk.app.groupCommunity.declineGroupInvitation(
      studentId,
      invitationId,
      context(token),
    ),
  visibility: (
    studentId: number,
    membershipId: number,
    isPublic: boolean,
    token: Token,
  ) =>
    pomiSdk.app.groupCommunity.updateStudentGroupMembership(
      studentId,
      membershipId,
      { isPublic },
      context(token),
    ),
  updateMember: (
    studentId: number,
    membershipId: number,
    body: updateManagedGroupMembershipInput['body'],
    token: Token,
  ) =>
    pomiSdk.app.groupCommunity.updateManagedGroupMembership(
      studentId,
      membershipId,
      body,
      context(token),
    ),
  createRole: (
    studentId: number,
    groupId: number,
    body: createGroupRoleInput['body'],
    token: Token,
  ) =>
    pomiSdk.app.groupCommunity.createGroupRole(
      studentId,
      { groupId, body },
      context(token),
    ),
  updateRole: (
    studentId: number,
    roleId: number,
    body: updateGroupRoleInput['body'],
    token: Token,
  ) =>
    pomiSdk.app.groupCommunity.updateGroupRole(
      studentId,
      roleId,
      body,
      context(token),
    ),
  deleteRole: (studentId: number, roleId: number, token: Token) =>
    pomiSdk.app.groupCommunity.deleteGroupRole(
      studentId,
      roleId,
      context(token),
    ),
  createEvent: (
    studentId: number,
    groupId: number,
    body: createGroupEventInput['body'],
    token: Token,
  ) =>
    pomiSdk.app.groupCommunity.createGroupEvent(
      studentId,
      { groupId, body },
      context(token),
    ),
  updateEvent: (
    studentId: number,
    eventId: number,
    body: updateGroupEventInput['body'],
    token: Token,
  ) =>
    pomiSdk.app.groupCommunity.updateGroupEvent(
      studentId,
      eventId,
      body,
      context(token),
    ),
  publishEvent: (studentId: number, eventId: number, token: Token) =>
    pomiSdk.app.groupCommunity.publishGroupEvent(
      studentId,
      eventId,
      context(token),
    ),
  cancelEvent: (studentId: number, eventId: number, token: Token) =>
    pomiSdk.app.groupCommunity.cancelGroupEvent(
      studentId,
      eventId,
      context(token),
    ),
}
