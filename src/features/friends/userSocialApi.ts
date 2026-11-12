import type {
  UserFriendship,
  UserProfile,
  UserPublicPerson,
  updateUserProfileInput,
} from '@ominira/pomi-sdk/generated/app'
import { pomiSdk } from '@/api/client'

export type PublicPerson = UserPublicPerson
export type PublicProfile = UserProfile
export type Friendship = UserFriendship
export type PublicProfileUpdate = Readonly<updateUserProfileInput['body']>

type GetAccessToken = () => Promise<string>

export function publicProfileUpdateInput(
  profile: PublicProfile,
): PublicProfileUpdate {
  const { enabled, displayName, bio, currentCoursesVisibility } = profile
  return { enabled, displayName, bio, currentCoursesVisibility }
}

export function hasPublicProfileChanges(
  profile: PublicProfile | undefined,
  persistedProfile: PublicProfile | undefined,
) {
  if (!profile || !persistedProfile) return false
  const current = publicProfileUpdateInput(profile)
  const persisted = publicProfileUpdateInput(persistedProfile)
  return (
    current.enabled !== persisted.enabled ||
    current.displayName !== persisted.displayName ||
    current.bio !== persisted.bio ||
    current.currentCoursesVisibility !== persisted.currentCoursesVisibility
  )
}

export const getPublicProfile = (
  userId: number,
  getAccessToken: GetAccessToken,
) => pomiSdk.app.userSocial.getProfile(userId, { getAccessToken })
export const updatePublicProfile = (
  userId: number,
  body: Partial<PublicProfileUpdate>,
  getAccessToken: GetAccessToken,
) => pomiSdk.app.userSocial.updateProfile(userId, body, { getAccessToken })
export const searchPeople = (
  userId: number,
  query: string | undefined,
  getAccessToken: GetAccessToken,
) =>
  pomiSdk.app.userPeople
    .list(
      userId,
      { page: 1, pageSize: 20, query: query?.trim() || undefined },
      { getAccessToken },
    )
    .then((page) => ({ items: page.data, total: page.total }))
export const getPerson = (
  userId: number,
  publicId: string,
  getAccessToken: GetAccessToken,
) => pomiSdk.app.userSocial.getPerson(userId, publicId, { getAccessToken })
export const listFriendships = (
  userId: number,
  getAccessToken: GetAccessToken,
) => pomiSdk.app.userSocial.listAll(userId, {}, { getAccessToken })
export const requestFriendship = (
  userId: number,
  targetPublicId: string,
  getAccessToken: GetAccessToken,
) =>
  pomiSdk.app.userSocial.createFriendship(
    userId,
    { targetPublicId },
    { getAccessToken },
  )
export const acceptFriendship = (
  userId: number,
  id: number,
  getAccessToken: GetAccessToken,
) => pomiSdk.app.userSocial.acceptFriendship(userId, id, { getAccessToken })
export const removeFriendship = async (
  userId: number,
  id: number,
  getAccessToken: GetAccessToken,
) => {
  await pomiSdk.app.userSocial.removeFriendship(userId, id, {
    getAccessToken,
  })
}
