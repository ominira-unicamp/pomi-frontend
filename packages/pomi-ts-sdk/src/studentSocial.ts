import { expectApiResponse } from './errors'
import type { PomiClient } from './client'

export type PublicPerson = Readonly<{
  publicId: string
  displayName: string
  bio: string | null
  interests: ReadonlyArray<Readonly<{ id: number; name: string }>>
  currentCourses: ReadonlyArray<
    Readonly<{
      courseCode: string
      courseName: string
      classCode: string | null
      schedules: ReadonlyArray<
        Readonly<{
          id: number
          dayOfWeek:
            | 'MONDAY'
            | 'TUESDAY'
            | 'WEDNESDAY'
            | 'THURSDAY'
            | 'FRIDAY'
            | 'SATURDAY'
            | 'SUNDAY'
          start: string
          end: string
          roomCode: string
        }>
      >
    }>
  >
  program: Readonly<{ code: string | number; name: string }> | null
  specialization: Readonly<{ code: string | number; name: string }> | null
  entryYear: number | null
}>

export type PublicProfile = PublicPerson &
  Readonly<{
    enabled: boolean
    currentCoursesVisibility: 'PRIVATE' | 'FRIENDS' | 'PUBLIC'
  }>

export type PublicProfileUpdate = Readonly<
  Pick<
    PublicProfile,
    'enabled' | 'displayName' | 'bio' | 'currentCoursesVisibility'
  >
>

export type Friendship = Readonly<{
  id: number
  status: 'PENDING' | 'ACCEPTED'
  direction: 'INCOMING' | 'OUTGOING' | 'NONE'
  friend: PublicPerson
  createdAt: string
  acceptedAt: string | null
}>

export function createStudentSocialApi(client: PomiClient) {
  async function requestJson<T>(
    path: string,
    token: () => Promise<string>,
    init?: RequestInit,
  ) {
    const response = await client.appApiRequest(path, token, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    })
    await expectApiResponse(response)
    return (await response.json()) as T
  }

  const getPublicProfile = (studentId: number, token: () => Promise<string>) =>
    requestJson<PublicProfile>(`/student/${studentId}/public-profile`, token)

  const updatePublicProfile = (
    studentId: number,
    body: Partial<PublicProfileUpdate>,
    token: () => Promise<string>,
  ) =>
    requestJson<PublicProfile>(`/student/${studentId}/public-profile`, token, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })

  const searchPeople = (
    studentId: number,
    query: string | undefined,
    token: () => Promise<string>,
  ) => {
    const params = new URLSearchParams({ page: '1', pageSize: '20' })
    if (query?.trim()) params.set('query', query.trim())
    return requestJson<{ items: ReadonlyArray<PublicPerson>; total: number }>(
      `/student/${studentId}/people?${params.toString()}`,
      token,
    )
  }

  const getPerson = (
    studentId: number,
    publicId: string,
    token: () => Promise<string>,
  ) =>
    requestJson<PublicPerson>(
      `/student/${studentId}/people/${encodeURIComponent(publicId)}`,
      token,
    )

  const listFriendships = (studentId: number, token: () => Promise<string>) =>
    requestJson<ReadonlyArray<Friendship>>(
      `/student/${studentId}/friendships`,
      token,
    )

  const requestFriendship = (
    studentId: number,
    targetPublicId: string,
    token: () => Promise<string>,
  ) =>
    requestJson<Friendship>(`/student/${studentId}/friendships`, token, {
      method: 'POST',
      body: JSON.stringify({ targetPublicId }),
    })

  const acceptFriendship = (
    studentId: number,
    id: number,
    token: () => Promise<string>,
  ) =>
    requestJson<Friendship>(
      `/student/${studentId}/friendships/${id}/accept`,
      token,
      { method: 'POST' },
    )

  async function removeFriendship(
    studentId: number,
    id: number,
    token: () => Promise<string>,
  ) {
    const response = await client.appApiRequest(
      `/student/${studentId}/friendships/${id}`,
      token,
      { method: 'DELETE' },
    )
    await expectApiResponse(response)
  }

  return {
    getPublicProfile,
    updatePublicProfile,
    searchPeople,
    getPerson,
    listFriendships,
    requestFriendship,
    acceptFriendship,
    removeFriendship,
  }
}
