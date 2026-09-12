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
      String(studentId),
      {},
      context(getAccessToken),
    )
  }

  function putStudentTagInterest(
    studentId: number,
    tagId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.studentTagInterests.update(
      String(studentId),
      String(tagId),
      { ...context(getAccessToken), allowUndocumentedSuccess: true },
    )
  }

  function deleteStudentTagInterest(
    studentId: number,
    tagId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.studentTagInterests.delete(
      String(studentId),
      String(tagId),
      { ...context(getAccessToken), allowUndocumentedSuccess: true },
    )
  }

  return {
    listStudentTagInterests,
    putStudentTagInterest,
    deleteStudentTagInterest,
  }
}
