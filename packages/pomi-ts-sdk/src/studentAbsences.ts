import type {
  createStudentAbsencesInput,
  listStudentAbsencesOutput,
} from './generated/app/operations.js'
import type { PomiRequestContext, PomiSdkClient } from './generatedClient.js'

export type StudentAbsence = Readonly<listStudentAbsencesOutput[number]>
export type StudyPeriodYearPeriod = StudentAbsence['studyPeriodYearPeriod']
export type StudentAbsenceDayOfWeek = StudentAbsence['dayOfWeek']
export type CreateStudentAbsenceInput = Readonly<
  createStudentAbsencesInput['body']
>

type StudentInput = Readonly<{ studentId: number }>
export function createStudentAbsencesApi(client: PomiSdkClient) {
  function listStudentAbsences(
    { studentId }: StudentInput,
    context: PomiRequestContext,
  ) {
    return client.app.listStudentAbsences({ sid: String(studentId) }, context)
  }
  function createStudentAbsence(
    { studentId, input }: StudentInput & { input: CreateStudentAbsenceInput },
    requestContext: PomiRequestContext,
  ) {
    return client.app.createStudentAbsences(
      { sid: String(studentId), body: input },
      requestContext,
    )
  }
  async function deleteStudentAbsence(
    { studentId, absenceId }: StudentInput & { absenceId: number },
    requestContext: PomiRequestContext,
  ) {
    await client.app.deleteStudentAbsences(
      { sid: String(studentId), id: String(absenceId) },
      requestContext,
    )
  }
  return { listStudentAbsences, createStudentAbsence, deleteStudentAbsence }
}
