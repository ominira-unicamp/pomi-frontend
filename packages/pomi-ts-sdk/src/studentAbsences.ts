import { expectApiResponse } from './errors'
import type { PomiClient } from './client'

export type StudyPeriodYearPeriod =
  | 'SUMMER'
  | 'FIRST_SEMESTER'
  | 'WINTER'
  | 'SECOND_SEMESTER'
export type StudentAbsenceDayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY'

export type StudentAbsence = Readonly<{
  id: number
  studentCourseAttemptId: number
  classScheduleId: number
  date: string
  createdAt: string
  updatedAt: string
  studyPeriodId: number
  studyPeriodYear: number
  studyPeriodYearPeriod: StudyPeriodYearPeriod
  courseId: number
  courseCode: string
  classId: number
  classCode: string
  dayOfWeek: StudentAbsenceDayOfWeek
  start: string
  end: string
  _paths: Readonly<{
    self: string
    courseAttempt: string
    classSchedule: string
    class: string
    course: string
    studyPeriod: string
  }>
}>

export type CreateStudentAbsenceInput = Readonly<{
  courseAttemptId: number
  classScheduleId: number
  date: string
}>

export function createStudentAbsencesApi(client: PomiClient) {
  async function requestJson<T>(
    path: string,
    getAccessToken: () => Promise<string>,
    init?: RequestInit,
  ): Promise<T> {
    const response = await client.appApiRequest(path, getAccessToken, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    })
    await expectApiResponse(response)
    return (await response.json()) as T
  }

  function listStudentAbsences(
    studentId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return requestJson<ReadonlyArray<StudentAbsence>>(
      `/student/${studentId}/absences`,
      getAccessToken,
    )
  }

  function createStudentAbsence(
    studentId: number,
    input: CreateStudentAbsenceInput,
    getAccessToken: () => Promise<string>,
  ) {
    return requestJson<StudentAbsence>(
      `/student/${studentId}/absences`,
      getAccessToken,
      { method: 'POST', body: JSON.stringify(input) },
    )
  }

  async function deleteStudentAbsence(
    studentId: number,
    absenceId: number,
    getAccessToken: () => Promise<string>,
  ) {
    const response = await client.appApiRequest(
      `/student/${studentId}/absences/${absenceId}`,
      getAccessToken,
      { method: 'DELETE' },
    )
    await expectApiResponse(response)
  }

  return { listStudentAbsences, createStudentAbsence, deleteStudentAbsence }
}
