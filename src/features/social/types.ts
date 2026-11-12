import type { Friendship, PublicPerson } from '@/features/friends/userSocialApi'

export type RelationshipState =
  | 'SELF'
  | 'NONE'
  | 'OUTGOING_PENDING'
  | 'INCOMING_PENDING'
  | 'ACCEPTED'

export function relationshipFor(
  person: PublicPerson,
  userId: number | undefined,
  friendships: ReadonlyArray<Friendship>,
): RelationshipState {
  if (userId === undefined) return 'NONE'
  const friendship = friendships.find(
    (item) => item.friend.publicId === person.publicId,
  )
  if (!friendship) return 'NONE'
  if (friendship.status === 'ACCEPTED') return 'ACCEPTED'
  return friendship.direction === 'INCOMING'
    ? 'INCOMING_PENDING'
    : 'OUTGOING_PENDING'
}
