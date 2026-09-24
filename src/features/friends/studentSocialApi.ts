import type {
  StudentFriendship,
  StudentPublicPerson,
  StudentPublicProfile,
  updateStudentPublicProfileInput,
} from '@ominira/pomi-sdk/generated/app'
import { pomiSdk } from '@/api/client'

export type PublicPerson = StudentPublicPerson
export type PublicProfile = StudentPublicProfile
export type Friendship = StudentFriendship
export type PublicProfileUpdate = Readonly<
  updateStudentPublicProfileInput['body']
>

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
  studentId: number,
  getAccessToken: GetAccessToken,
) => pomiSdk.app.studentSocial.getProfile(studentId, { getAccessToken })
export const updatePublicProfile = (
  studentId: number,
  body: Partial<PublicProfileUpdate>,
  getAccessToken: GetAccessToken,
) => pomiSdk.app.studentSocial.updateProfile(studentId, body, { getAccessToken })
export const searchPeople = (
  studentId: number,
  query: string | undefined,
  getAccessToken: GetAccessToken,
) =>
  pomiSdk.app.studentPeople
    .list(
      studentId,
      { page: 1, pageSize: 20, query: query?.trim() || undefined },
      { getAccessToken },
    )
    .then((page) => ({ items: page.data, total: page.total }))
export const getPerson = (
  studentId: number,
  publicId: string,
  getAccessToken: GetAccessToken,
) => pomiSdk.app.studentSocial.getPerson(studentId, publicId, { getAccessToken })
export const listFriendships = (
  studentId: number,
  getAccessToken: GetAccessToken,
) => pomiSdk.app.studentSocial.listAll(studentId, {}, { getAccessToken })
export const requestFriendship = (
  studentId: number,
  targetPublicId: string,
  getAccessToken: GetAccessToken,
) =>
  pomiSdk.app.studentSocial.createFriendship(
    studentId,
    { targetPublicId },
    { getAccessToken },
  )
export const acceptFriendship = (
  studentId: number,
  id: number,
  getAccessToken: GetAccessToken,
) => pomiSdk.app.studentSocial.acceptFriendship(studentId, id, { getAccessToken })
export const removeFriendship = async (
  studentId: number,
  id: number,
  getAccessToken: GetAccessToken,
) => {
  await pomiSdk.app.studentSocial.removeFriendship(studentId, id, {
    getAccessToken,
  })
}
