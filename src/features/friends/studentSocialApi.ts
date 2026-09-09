import { pomiApi } from '@/api/client'

export type {
  Friendship,
  PublicPerson,
  PublicProfile,
  PublicProfileUpdate,
} from '@pomi/pomi-ts-sdk/student-social'

import type {
  PublicProfile,
  PublicProfileUpdate,
} from '@pomi/pomi-ts-sdk/student-social'

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

export const {
  getPublicProfile,
  updatePublicProfile,
  searchPeople,
  getPerson,
  listFriendships,
  requestFriendship,
  acceptFriendship,
  removeFriendship,
} = pomiApi.studentSocial
