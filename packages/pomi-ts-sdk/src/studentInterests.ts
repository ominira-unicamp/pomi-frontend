import type { listStudentTagInterestsOutput } from './generated/app/operations.js'
import type { PomiRequestContext, PomiSdkClient } from './generatedClient.js'

export type StudentInterestTag = Readonly<listStudentTagInterestsOutput[number]>

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
    return client.app.listStudentTagInterests(
      { sid: String(studentId) },
      context(getAccessToken),
    )
  }

  function putStudentTagInterest(
    studentId: number,
    tagId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.updateStudentTagInterests(
      { sid: String(studentId), tagId: String(tagId) },
      { ...context(getAccessToken), allowUndocumentedSuccess: true },
    )
  }

  function deleteStudentTagInterest(
    studentId: number,
    tagId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.deleteStudentTagInterests(
      { sid: String(studentId), tagId: String(tagId) },
      context(getAccessToken),
    )
  }

  return {
    listStudentTagInterests,
    putStudentTagInterest,
    deleteStudentTagInterest,
  }
}
