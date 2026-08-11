import { apiRequest, publicApiRequest } from '@/api/client'

export type StudentProfile = Readonly<{
  id: number
  name: string
  catalogId: number | null
  programId: number | null
  specializationId: number | null
  entryYear: number | null
  languageId: number | null
}>

export type StudentCourseAttempt = Readonly<{
  id: number
  courseId: number
  studyPeriodId: number | null
  classId: number | null
  status: 'ENROLLED' | 'COMPLETED' | 'FAILED' | 'DROPPED'
  grade: number | null
  course: Readonly<{ id: number; code: string; name: string; credits: number }>
  studyPeriod: Readonly<{ id: number; code: string }> | null
  class: Readonly<{
    id: number
    code: string
    professors: ReadonlyArray<Readonly<{ id: number; name: string }>>
  }> | null
}>

export type StudentCourseAttemptClass = Readonly<{
  id: number
  code: string
  courseId: number
  studyPeriodId: number
  professors: ReadonlyArray<Readonly<{ id: number; name: string }>>
}>

export type StudentClassSchedule = Readonly<{
  id: number
  classId: number
  classCode: string
  courseCode: string
  studyPeriodId: number
  dayOfWeek:
    | 'MONDAY'
    | 'TUESDAY'
    | 'WEDNESDAY'
    | 'THURSDAY'
    | 'FRIDAY'
    | 'SATURDAY'
    | 'SUNDAY'
  start: string
  end: string
  roomCode: string
}>

export type StudyPeriod = Readonly<{
  id: number
  code: string
  startDate: string
}>

async function requestJson<T>(
  path: string,
  getAccessToken: () => Promise<string>,
  init?: RequestInit,
): Promise<T> {
  const response = await apiRequest(path, getAccessToken, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!response.ok) throw new Error(`API request failed: ${response.status}`)
  return (await response.json()) as T
}

export function getCurrentStudent(getAccessToken: () => Promise<string>) {
  return requestJson<{ studentId: number | null }>('/me', getAccessToken)
}

export function registerCurrentStudent(
  name: string,
  getAccessToken: () => Promise<string>,
) {
  return requestJson<{ id: number; name: string }>(
    '/students',
    getAccessToken,
    {
      method: 'POST',
      body: JSON.stringify({ name }),
    },
  )
}

export async function ensureCurrentStudent(
  name: string,
  getAccessToken: () => Promise<string>,
) {
  const current = await getCurrentStudent(getAccessToken)
  if (current.studentId) return current.studentId
  const student = await registerCurrentStudent(name, getAccessToken)
  return student.id
}

export function getStudentProfile(
  studentId: number,
  getAccessToken: () => Promise<string>,
) {
  return requestJson<StudentProfile>(`/students/${studentId}`, getAccessToken)
}

export function patchStudentProfile(
  studentId: number,
  body: Partial<
    Pick<
      StudentProfile,
      | 'name'
      | 'catalogId'
      | 'programId'
      | 'specializationId'
      | 'entryYear'
      | 'languageId'
    >
  >,
  getAccessToken: () => Promise<string>,
) {
  return requestJson<StudentProfile>(`/students/${studentId}`, getAccessToken, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export async function listStudyPeriods(): Promise<ReadonlyArray<StudyPeriod>> {
  const response = await publicApiRequest('/study-periods')
  if (!response.ok) throw new Error(`API request failed: ${response.status}`)
  return (await response.json()) as ReadonlyArray<StudyPeriod>
}

async function listPublicPages<T>(initialPath: string) {
  const items: Array<T> = []
  let path: string | null = initialPath
  while (path) {
    const response = await publicApiRequest(path)
    if (!response.ok) throw new Error(`API request failed: ${response.status}`)
    const page = (await response.json()) as Readonly<{
      data: ReadonlyArray<T>
      _paths: Readonly<{ next: string | null }>
    }>
    items.push(...page.data)
    path = page._paths.next
  }
  return items
}

export async function listClassesForStudentCourseAttempt(
  courseId: number,
  studyPeriodId: number,
): Promise<ReadonlyArray<StudentCourseAttemptClass>> {
  return listPublicPages<StudentCourseAttemptClass>(
    `/classes?courseId=${courseId}&studyPeriodId=${studyPeriodId}&page=1&pageSize=100`,
  )
}

export function listClassSchedulesByStudyPeriod(studyPeriodId: number) {
  return listPublicPages<StudentClassSchedule>(
    `/class-schedules?studyPeriodId=${studyPeriodId}&page=1&pageSize=1000`,
  )
}

export function listStudentCourseAttempts(
  studentId: number,
  getAccessToken: () => Promise<string>,
) {
  return requestJson<ReadonlyArray<StudentCourseAttempt>>(
    `/student/${studentId}/course-attempts`,
    getAccessToken,
  )
}

export async function listCompletedCourseIds(
  studentId: number,
  getAccessToken: () => Promise<string>,
) {
  const attempts = await listStudentCourseAttempts(studentId, getAccessToken)
  return [
    ...new Set(
      attempts
        .filter((attempt) => attempt.status === 'COMPLETED')
        .map((attempt) => String(attempt.courseId)),
    ),
  ]
}

export function createStudentCourseAttempt(
  studentId: number,
  body: Readonly<{
    courseId: number
    studyPeriodId?: number | null
    classId?: number | null
    status: StudentCourseAttempt['status']
    grade?: number | null
  }>,
  getAccessToken: () => Promise<string>,
) {
  return requestJson<StudentCourseAttempt>(
    `/student/${studentId}/course-attempts`,
    getAccessToken,
    { method: 'POST', body: JSON.stringify(body) },
  )
}

export function patchStudentCourseAttempt(
  studentId: number,
  attemptId: number,
  body: Partial<
    Pick<StudentCourseAttempt, 'studyPeriodId' | 'classId' | 'status' | 'grade'>
  >,
  getAccessToken: () => Promise<string>,
) {
  return requestJson<StudentCourseAttempt>(
    `/student/${studentId}/course-attempts/${attemptId}`,
    getAccessToken,
    { method: 'PATCH', body: JSON.stringify(body) },
  )
}

export async function deleteStudentCourseAttempt(
  studentId: number,
  attemptId: number,
  getAccessToken: () => Promise<string>,
) {
  const response = await apiRequest(
    `/student/${studentId}/course-attempts/${attemptId}`,
    getAccessToken,
    { method: 'DELETE' },
  )
  if (!response.ok) throw new Error(`API request failed: ${response.status}`)
}

export async function setCourseCompleted(
  studentId: number,
  courseId: string,
  completed: boolean,
  getAccessToken: () => Promise<string>,
  completion?: Readonly<{ studyPeriodId?: number; grade?: number | null }>,
) {
  const attempts = await listStudentCourseAttempts(studentId, getAccessToken)
  const completedAttempts = attempts.filter(
    (attempt) =>
      attempt.courseId === Number(courseId) && attempt.status === 'COMPLETED',
  )
  if (!completed) {
    const latest = completedAttempts.at(0)
    if (latest)
      await deleteStudentCourseAttempt(studentId, latest.id, getAccessToken)
    return
  }
  if (completedAttempts.length) return
  await createStudentCourseAttempt(
    studentId,
    {
      courseId: Number(courseId),
      studyPeriodId: completion?.studyPeriodId ?? null,
      status: 'COMPLETED',
      grade: completion?.grade ?? null,
    },
    getAccessToken,
  )
}
