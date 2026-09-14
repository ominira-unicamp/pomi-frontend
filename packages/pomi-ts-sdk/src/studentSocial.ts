import type { updateStudentPublicProfileInput } from './generated/app/operations.js'
import type {
  StudentFriendship as GeneratedFriendship,
  StudentPublicPerson as GeneratedPublicPerson,
  StudentPublicProfile as GeneratedPublicProfile,
} from './generated/app/domain.js'
import type { PomiSdkClient } from './generatedClient.js'

type WithoutPaths<T> = T extends ReadonlyArray<infer Item>
  ? ReadonlyArray<WithoutPaths<Item>>
  : T extends object
    ? {
        readonly [Key in keyof T as Key extends '_paths'
          ? never
          : Key]: WithoutPaths<T[Key]>
      }
    : T

export type PublicPerson = WithoutPaths<GeneratedPublicPerson>
export type PublicProfile = WithoutPaths<GeneratedPublicProfile>

export type PublicProfileUpdate = Readonly<
  updateStudentPublicProfileInput['body']
>

export type Friendship = WithoutPaths<GeneratedFriendship>

export function createStudentSocialApi(client: PomiSdkClient) {
  const getPublicProfile = (studentId: number, token: () => Promise<string>) =>
    client.app.studentSocial.getProfile(
      studentId,
      {
        getAccessToken: token,
      },
    )

  const updatePublicProfile = (
    studentId: number,
    body: Partial<PublicProfileUpdate>,
    token: () => Promise<string>,
  ) =>
    client.app.studentSocial.updateProfile(studentId, body, {
      getAccessToken: token,
    })

  const searchPeople = (
    studentId: number,
    query: string | undefined,
    token: () => Promise<string>,
  ) => {
    return client.app.studentPeople.list(
      studentId,
      {
        page: 1,
        pageSize: 20,
        query: query?.trim() || undefined,
      },
      { getAccessToken: token },
    ).then((page) => ({
      items: page.data,
      total: page.total,
    }))
  }

  const getPerson = (
    studentId: number,
    publicId: string,
    token: () => Promise<string>,
  ) =>
    client.app.studentSocial.getPerson(studentId, publicId, {
      getAccessToken: token,
    })

  const listFriendships = (studentId: number, token: () => Promise<string>) =>
    client.app.studentSocial.listAll(
      studentId,
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
    client.app.studentSocial.createFriendship(
      studentId,
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
    client.app.studentSocial.acceptFriendship(studentId, id, {
      getAccessToken: token,
    })

  async function removeFriendship(
    studentId: number,
    id: number,
    token: () => Promise<string>,
  ) {
    await client.app.studentSocial.removeFriendship(studentId, id, {
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
