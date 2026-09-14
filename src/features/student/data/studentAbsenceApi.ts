import type {
  DayOfWeek,
  StudentAbsence,
  YearPeriod,
  createStudentAbsencesInput,
} from '@ominira/pomi-sdk/generated/app'
import { pomiSdk } from '@/api/client'

export type StudentAbsenceDayOfWeek = DayOfWeek
export type StudyPeriodYearPeriod = YearPeriod
export type CreateStudentAbsenceInput = Readonly<
  createStudentAbsencesInput['body']
>
export type { StudentAbsence }

type GetAccessToken = () => Promise<string>

export function listStudentAbsences(
  studentId: number,
  getAccessToken: GetAccessToken,
) {
  return pomiSdk.app.studentAbsences.listAll(
    studentId,
    {},
    { getAccessToken },
  )
}

export function createStudentAbsence(
  studentId: number,
  input: CreateStudentAbsenceInput,
  getAccessToken: GetAccessToken,
) {
  return pomiSdk.app.studentAbsences.create(studentId, input, { getAccessToken })
}

export function deleteStudentAbsence(
  studentId: number,
  absenceId: number,
  getAccessToken: GetAccessToken,
) {
  return pomiSdk.app.studentAbsences.delete(studentId, absenceId, {
    getAccessToken,
  })
}
