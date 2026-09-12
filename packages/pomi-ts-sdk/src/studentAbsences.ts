import type { StudentAbsence } from './generated/app/domain.js'
import type {
  StudentAbsenceDayOfWeek,
  StudentAbsenceStudyPeriodYearPeriod,
} from './generated/app/enums.js'
import type { createStudentAbsencesInput } from './generated/app/operations.js'
import type { PomiRequestContext, PomiSdkClient } from './generatedClient.js'

export type { StudentAbsence }
export type StudyPeriodYearPeriod = StudentAbsenceStudyPeriodYearPeriod
export type { StudentAbsenceDayOfWeek }
export type CreateStudentAbsenceInput = Readonly<
  createStudentAbsencesInput['body']
>

type StudentInput = Readonly<{ studentId: number }>
export function createStudentAbsencesApi(client: PomiSdkClient) {
  function listStudentAbsences(
    { studentId }: StudentInput,
    context: PomiRequestContext,
  ) {
    return client.app.studentAbsences.list(studentId, {}, context)
  }
  function createStudentAbsence(
    { studentId, input }: StudentInput & { input: CreateStudentAbsenceInput },
    requestContext: PomiRequestContext,
  ) {
    return client.app.studentAbsences.create(studentId, input, requestContext)
  }
  async function deleteStudentAbsence(
    { studentId, absenceId }: StudentInput & { absenceId: number },
    requestContext: PomiRequestContext,
  ) {
    await client.app.studentAbsences.delete(
      studentId,
      absenceId,
      requestContext,
    )
  }
  return { listStudentAbsences, createStudentAbsence, deleteStudentAbsence }
}
