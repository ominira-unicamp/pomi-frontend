import { appApiRequest } from '@/api/client'
import { expectApiResponse } from '@/api/errors'

export type PublicPerson = Readonly<{
  publicId: string
  displayName: string
  bio: string | null
  program: Readonly<{ code: string | number; name: string }> | null
  specialization: Readonly<{ code: string | number; name: string }> | null
  entryYear: number | null
}>

export type PublicProfile = PublicPerson &
  Readonly<{
    enabled: boolean
    showProgram: boolean
    showSpecialization: boolean
    showEntryYear: boolean
  }>

export type PublicProfileUpdate = Readonly<
  Pick<
    PublicProfile,
    | 'enabled'
    | 'displayName'
    | 'bio'
    | 'showProgram'
    | 'showSpecialization'
    | 'showEntryYear'
  >
>

export function publicProfileUpdateInput(
  profile: PublicProfile,
): PublicProfileUpdate {
  const {
    enabled,
    displayName,
    bio,
    showProgram,
    showSpecialization,
    showEntryYear,
  } = profile
  return {
    enabled,
    displayName,
    bio,
    showProgram,
    showSpecialization,
    showEntryYear,
  }
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
    current.showProgram !== persisted.showProgram ||
    current.showSpecialization !== persisted.showSpecialization ||
    current.showEntryYear !== persisted.showEntryYear
  )
}

export type Friendship = Readonly<{
  id: number
  status: 'PENDING' | 'ACCEPTED'
  direction: 'INCOMING' | 'OUTGOING' | 'NONE'
  friend: PublicPerson
  createdAt: string
  acceptedAt: string | null
}>

async function requestJson<T>(
  path: string,
  token: () => Promise<string>,
  init?: RequestInit,
) {
  const response = await appApiRequest(path, token, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  await expectApiResponse(response)
  return (await response.json()) as T
}

export const getPublicProfile = (
  studentId: number,
  token: () => Promise<string>,
) => requestJson<PublicProfile>(`/student/${studentId}/public-profile`, token)

export const updatePublicProfile = (
  studentId: number,
  body: Partial<PublicProfileUpdate>,
  token: () => Promise<string>,
) =>
  requestJson<PublicProfile>(`/student/${studentId}/public-profile`, token, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })

export const searchPeople = (
  studentId: number,
  query: string,
  token: () => Promise<string>,
) =>
  requestJson<{ items: ReadonlyArray<PublicPerson>; total: number }>(
    `/student/${studentId}/people?query=${encodeURIComponent(query)}&page=1&pageSize=20`,
    token,
  )

export const listFriendships = (
  studentId: number,
  token: () => Promise<string>,
) =>
  requestJson<ReadonlyArray<Friendship>>(
    `/student/${studentId}/friendships`,
    token,
  )

export const requestFriendship = (
  studentId: number,
  targetPublicId: string,
  token: () => Promise<string>,
) =>
  requestJson<Friendship>(`/student/${studentId}/friendships`, token, {
    method: 'POST',
    body: JSON.stringify({ targetPublicId }),
  })

export const acceptFriendship = (
  studentId: number,
  id: number,
  token: () => Promise<string>,
) =>
  requestJson<Friendship>(
    `/student/${studentId}/friendships/${id}/accept`,
    token,
    { method: 'POST' },
  )

export async function removeFriendship(
  studentId: number,
  id: number,
  token: () => Promise<string>,
) {
  const response = await appApiRequest(
    `/student/${studentId}/friendships/${id}`,
    token,
    { method: 'DELETE' },
  )
  await expectApiResponse(response)
}
