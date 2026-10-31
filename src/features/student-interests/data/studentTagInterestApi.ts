import type { StudentTagInterest } from '@ominira/pomi-sdk/generated/app'
import { pomiSdk } from '@/api/client'

export type StudentInterestTag = StudentTagInterest

type GetAccessToken = () => Promise<string>

export function listStudentTagInterests(
  studentId: number,
  getAccessToken: GetAccessToken,
) {
  return pomiSdk.app.studentTagInterests.listAll(
    studentId,
    {},
    { getAccessToken },
  )
}

export function putStudentTagInterest(
  studentId: number,
  tagId: number,
  getAccessToken: GetAccessToken,
) {
  return pomiSdk.app.studentTagInterests.update(studentId, tagId, {
    getAccessToken,
  })
}

export function deleteStudentTagInterest(
  studentId: number,
  tagId: number,
  getAccessToken: GetAccessToken,
) {
  return pomiSdk.app.studentTagInterests.delete(studentId, tagId, {
    getAccessToken,
  })
}
