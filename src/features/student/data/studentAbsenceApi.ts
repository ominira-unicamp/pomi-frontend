import type { CreateStudentAbsenceInput } from '@pomi/pomi-ts-sdk/student-absences'
import { pomiApi } from '@/api/client'

export type {
  CreateStudentAbsenceInput,
  StudentAbsence,
  StudentAbsenceDayOfWeek,
  StudyPeriodYearPeriod,
} from '@pomi/pomi-ts-sdk/student-absences'

type GetAccessToken = () => Promise<string>

export function listStudentAbsences(
  studentId: number,
  getAccessToken: GetAccessToken,
) {
  return pomiApi.studentAbsences.listStudentAbsences(
    { studentId },
    { getAccessToken },
  )
}

export function createStudentAbsence(
  studentId: number,
  input: CreateStudentAbsenceInput,
  getAccessToken: GetAccessToken,
) {
  return pomiApi.studentAbsences.createStudentAbsence(
    { studentId, input },
    { getAccessToken },
  )
}

export function deleteStudentAbsence(
  studentId: number,
  absenceId: number,
  getAccessToken: GetAccessToken,
) {
  return pomiApi.studentAbsences.deleteStudentAbsence(
    { studentId, absenceId },
    { getAccessToken },
  )
}
