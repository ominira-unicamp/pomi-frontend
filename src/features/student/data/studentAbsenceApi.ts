import { pomiApi } from '@/api/client'

export type {
  CreateStudentAbsenceInput,
  StudentAbsence,
  StudentAbsenceDayOfWeek,
  StudyPeriodYearPeriod,
} from '@pomi/pomi-ts-sdk/student-absences'

export const {
  listStudentAbsences,
  createStudentAbsence,
  deleteStudentAbsence,
} = pomiApi.studentAbsences
