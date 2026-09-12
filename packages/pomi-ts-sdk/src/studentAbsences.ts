import type { StudentAbsenceTransport } from './generated/app/domain.js'
import type { createStudentAbsencesInput } from './generated/app/operations.js'
import type { PomiRequestContext, PomiSdkClient } from './generatedClient.js'

export type StudentAbsence = StudentAbsenceTransport
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
    return client.app.studentAbsences.list(
      String(studentId),
      {},
      context,
    ) as Promise<ReadonlyArray<StudentAbsence>>
  }
  function createStudentAbsence(
    { studentId, input }: StudentInput & { input: CreateStudentAbsenceInput },
    requestContext: PomiRequestContext,
  ) {
    return client.app.studentAbsences.create(
      String(studentId),
      input,
      requestContext,
    ) as Promise<StudentAbsence>
  }
  async function deleteStudentAbsence(
    { studentId, absenceId }: StudentInput & { absenceId: number },
    requestContext: PomiRequestContext,
  ) {
    await client.app.studentAbsences.delete(
      String(studentId),
      String(absenceId),
      requestContext,
    )
  }
  return { listStudentAbsences, createStudentAbsence, deleteStudentAbsence }
}
