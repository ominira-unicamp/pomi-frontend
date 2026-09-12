import type { updateStudentPublicProfileInput } from './generated/app/operations.js'
import type {
  StudentFriendship as GeneratedFriendship,
  StudentPublicPerson as GeneratedPublicPerson,
  StudentPublicProfile as GeneratedPublicProfile,
} from './generated/app/domain.js'
import type { PomiSdkClient } from './generatedClient.js'

export type PublicPerson = GeneratedPublicPerson
export type PublicProfile = GeneratedPublicProfile

export type PublicProfileUpdate = Readonly<
  Pick<
    PublicProfile,
    'enabled' | 'displayName' | 'bio' | 'currentCoursesVisibility'
  >
>

export type Friendship = GeneratedFriendship

export function createStudentSocialApi(client: PomiSdkClient) {
  const getPublicProfile = (studentId: number, token: () => Promise<string>) =>
    client.app.studentPublicProfile.list(
      String(studentId),
      {},
      {
        getAccessToken: token,
      },
    )

  const updatePublicProfile = (
    studentId: number,
    body: Partial<PublicProfileUpdate>,
    token: () => Promise<string>,
  ) =>
    client.app.studentPublicProfile.update(
      String(studentId),
      body as updateStudentPublicProfileInput['body'],
      { getAccessToken: token },
    )

  const searchPeople = (
    studentId: number,
    query: string | undefined,
    token: () => Promise<string>,
  ) => {
    return client.app.studentPeople.list(
      String(studentId),
      {
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
    client.app.studentPeople.get(String(studentId), publicId, {
      getAccessToken: token,
    })

  const listFriendships = (studentId: number, token: () => Promise<string>) =>
    client.app.studentFriendships.list(
      String(studentId),
      {},
      {
        getAccessToken: token,
      },
    )

  const requestFriendship = (
    studentId: number,
    targetPublicId: string,
    token: () => Promise<string>,
  ) =>
    client.app.studentFriendships.create(
      String(studentId),
      { targetPublicId },
      {
        getAccessToken: token,
      },
    )

  const acceptFriendship = (
    studentId: number,
    id: number,
    token: () => Promise<string>,
  ) =>
    client.app.studentFriendshipsAccept.create(String(studentId), String(id), {
      getAccessToken: token,
    })

  async function removeFriendship(
    studentId: number,
    id: number,
    token: () => Promise<string>,
  ) {
    await client.app.studentFriendships.delete(String(studentId), String(id), {
      getAccessToken: token,
    })
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
