import type { StudentTagInterest } from './generated/app/domain.js'
import type { PomiRequestContext, PomiSdkClient } from './generatedClient.js'

export type StudentInterestTag = StudentTagInterest

export function createStudentInterestsApi(client: PomiSdkClient) {
  const context = (
    getAccessToken: () => Promise<string>,
  ): PomiRequestContext => ({
    getAccessToken,
  })

  function listStudentTagInterests(
    studentId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.studentTagInterests.list(
      studentId,
      {},
      context(getAccessToken),
    )
  }

  function putStudentTagInterest(
    studentId: number,
    tagId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.studentTagInterests.update(studentId, tagId, {
      ...context(getAccessToken),
    })
  }

  function deleteStudentTagInterest(
    studentId: number,
    tagId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.studentTagInterests.delete(studentId, tagId, {
      ...context(getAccessToken),
    })
  }

  return {
    listStudentTagInterests,
    putStudentTagInterest,
    deleteStudentTagInterest,
  }
}
