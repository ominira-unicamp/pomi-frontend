import type { StudyPeriodYearPeriod } from '@/features/student/data/studyPeriod'
import type { StudentClassSchedule } from '@/features/student/data/studentApi'
import { appApiRequest } from '@/api/client'
import { expectApiResponse } from '@/api/errors'

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
  dayOfWeek: StudentClassSchedule['dayOfWeek']
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

async function requestJson<T>(
  path: string,
  getAccessToken: () => Promise<string>,
  init?: RequestInit,
): Promise<T> {
  const response = await appApiRequest(path, getAccessToken, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  await expectApiResponse(response)
  return (await response.json()) as T
}

export function listStudentAbsences(
  studentId: number,
  getAccessToken: () => Promise<string>,
) {
  return requestJson<ReadonlyArray<StudentAbsence>>(
    `/student/${studentId}/absences`,
    getAccessToken,
  )
}

export function createStudentAbsence(
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

export async function deleteStudentAbsence(
  studentId: number,
  absenceId: number,
  getAccessToken: () => Promise<string>,
) {
  const response = await appApiRequest(
    `/student/${studentId}/absences/${absenceId}`,
    getAccessToken,
    { method: 'DELETE' },
  )
  await expectApiResponse(response)
}
