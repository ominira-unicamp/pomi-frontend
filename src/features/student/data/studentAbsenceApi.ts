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
  createStudentAbsencesInput['body'] & { courseAttemptId: number }
>
export type { StudentAbsence }

type GetAccessToken = () => Promise<string>

export function listStudentAbsences(
  userId: number,
  getAccessToken: GetAccessToken,
) {
  return pomiSdk.app.studentAbsences.listAll(userId, {}, { getAccessToken })
}

export function createStudentAbsence(
  userId: number,
  input: CreateStudentAbsenceInput,
  getAccessToken: GetAccessToken,
) {
  return pomiSdk.app.studentAbsences.create(
    userId,
    input.courseAttemptId,
    { classScheduleId: input.classScheduleId, date: input.date },
    { getAccessToken },
  )
}

export function deleteStudentAbsence(
  userId: number,
  attemptId: number,
  absenceId: number,
  getAccessToken: GetAccessToken,
) {
  return pomiSdk.app.studentAbsences.delete(userId, attemptId, absenceId, {
    getAccessToken,
  })
}
