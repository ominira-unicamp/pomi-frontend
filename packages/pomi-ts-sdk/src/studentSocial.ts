import { appApi } from './endpoint'
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

type StudentInput = Readonly<{ studentId: number }>
type ProfileUpdateInput = StudentInput &
  Readonly<{ body: Partial<PublicProfileUpdate> }>
type SearchPeopleInput = StudentInput & Readonly<{ query?: string }>
type PersonInput = StudentInput & Readonly<{ publicId: string }>
type FriendshipRequestInput = StudentInput &
  Readonly<{ targetPublicId: string }>
type FriendshipInput = StudentInput & Readonly<{ id: number }>

const socialInterface = appApi.authenticated.interface('/student/:studentId')
const socialEndpoints = socialInterface.define({
  getPublicProfile: socialInterface.get<PublicProfile>('/public-profile'),
  updatePublicProfile: socialInterface.patch<PublicProfile, ProfileUpdateInput>(
    '/public-profile',
    { body: ({ body }) => body },
  ),
  searchPeople: socialInterface.get<
    { items: ReadonlyArray<PublicPerson>; total: number },
    SearchPeopleInput
  >('/people', {
    query: ({ query }) => ({
      page: 1,
      pageSize: 20,
      query: query?.trim() || undefined,
    }),
  }),
  getPerson: socialInterface.get<PublicPerson, PersonInput>(
    '/people/:publicId',
  ),
  listFriendships:
    socialInterface.get<ReadonlyArray<Friendship>>('/friendships'),
  requestFriendship: socialInterface.post<Friendship, FriendshipRequestInput>(
    '/friendships',
    { body: ({ targetPublicId }) => ({ targetPublicId }) },
  ),
  acceptFriendship: socialInterface.post<Friendship, FriendshipInput>(
    '/friendships/:id/accept',
  ),
  removeFriendship: socialInterface.remove<FriendshipInput>('/friendships/:id'),
})

export function createStudentSocialApi(client: PomiClient) {
  const api = client.bind(socialEndpoints)

  const getPublicProfile = (studentId: number, token: () => Promise<string>) =>
    api.getPublicProfile({ studentId }, { getAccessToken: token })

  const updatePublicProfile = (
    studentId: number,
    body: Partial<PublicProfileUpdate>,
    token: () => Promise<string>,
  ) => api.updatePublicProfile({ studentId, body }, { getAccessToken: token })

  const searchPeople = (
    studentId: number,
    query: string | undefined,
    token: () => Promise<string>,
  ) => {
    return api.searchPeople({ studentId, query }, { getAccessToken: token })
  }

  const getPerson = (
    studentId: number,
    publicId: string,
    token: () => Promise<string>,
  ) => api.getPerson({ studentId, publicId }, { getAccessToken: token })

  const listFriendships = (studentId: number, token: () => Promise<string>) =>
    api.listFriendships({ studentId }, { getAccessToken: token })

  const requestFriendship = (
    studentId: number,
    targetPublicId: string,
    token: () => Promise<string>,
  ) =>
    api.requestFriendship(
      { studentId, targetPublicId },
      { getAccessToken: token },
    )

  const acceptFriendship = (
    studentId: number,
    id: number,
    token: () => Promise<string>,
  ) => api.acceptFriendship({ studentId, id }, { getAccessToken: token })

  async function removeFriendship(
    studentId: number,
    id: number,
    token: () => Promise<string>,
  ) {
    await api.removeFriendship({ studentId, id }, { getAccessToken: token })
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
