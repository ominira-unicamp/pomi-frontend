import type {
  getStudentPeopleOutput,
  listStudentFriendshipsOutput,
  listStudentPublicProfileOutput,
  updateStudentPublicProfileInput,
} from './generated/app/operations.js'
import type { PomiSdkClient } from './generatedClient.js'

export type PublicPerson = Readonly<Omit<getStudentPeopleOutput, '_paths'>>
export type PublicProfile = Readonly<
  Omit<listStudentPublicProfileOutput, '_paths'>
>

export type PublicProfileUpdate = Readonly<
  Pick<
    PublicProfile,
    'enabled' | 'displayName' | 'bio' | 'currentCoursesVisibility'
  >
>

type GeneratedFriendship = listStudentFriendshipsOutput[number]
export type Friendship = Readonly<
  Omit<GeneratedFriendship, '_paths' | 'friend'> & { friend: PublicPerson }
>

export function createStudentSocialApi(client: PomiSdkClient) {
  const getPublicProfile = (studentId: number, token: () => Promise<string>) =>
    client.app.listStudentPublicProfile(
      { sid: String(studentId) },
      { getAccessToken: token },
    ) as Promise<PublicProfile>

  const updatePublicProfile = (
    studentId: number,
    body: Partial<PublicProfileUpdate>,
    token: () => Promise<string>,
  ) =>
    client.app.updateStudentPublicProfile(
      {
        sid: String(studentId),
        body: body as updateStudentPublicProfileInput['body'],
      },
      { getAccessToken: token },
    )

  const searchPeople = (
    studentId: number,
    query: string | undefined,
    token: () => Promise<string>,
  ) => {
    return client.app.listStudentPeople(
      {
        sid: String(studentId),
        page: '1',
        pageSize: '20',
        query: query?.trim() || undefined,
      },
      { getAccessToken: token },
    )
  }

  const getPerson = (
    studentId: number,
    publicId: string,
    token: () => Promise<string>,
  ) =>
    client.app.getStudentPeople(
      { sid: String(studentId), publicId },
      { getAccessToken: token },
    ) as Promise<PublicPerson>

  const listFriendships = (studentId: number, token: () => Promise<string>) =>
    client.app.listStudentFriendships(
      { sid: String(studentId) },
      { getAccessToken: token },
    ) as Promise<ReadonlyArray<Friendship>>

  const requestFriendship = (
    studentId: number,
    targetPublicId: string,
    token: () => Promise<string>,
  ) =>
    client.app.createStudentFriendships(
      { sid: String(studentId), body: { targetPublicId } },
      { getAccessToken: token },
    )

  const acceptFriendship = (
    studentId: number,
    id: number,
    token: () => Promise<string>,
  ) =>
    client.app.createStudentFriendshipsAccept(
      { sid: String(studentId), id: String(id) },
      { getAccessToken: token },
    )

  async function removeFriendship(
    studentId: number,
    id: number,
    token: () => Promise<string>,
  ) {
    await client.app.deleteStudentFriendships(
      { sid: String(studentId), id: String(id) },
      { getAccessToken: token },
    )
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
