import type { StudyPeriodYearPeriod } from '@/student/data/studyPeriod'
import { appApiRequest, dataApiRequest } from '@/api/client'
import { expectApiResponse } from '@/api/errors'

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
  studentId: number
  courseId: number
  studyPeriodId: number | null
  classId: number | null
  evaluationMode: StudentCourseEvaluationMode
  status: StudentCourseAttemptStatus
  grade: number | null
  createdAt: string
  updatedAt: string
  course: Readonly<{
    id: number
    code: string
    name: string
    credits: number
    unit: Readonly<{ id: number; code: string }> | null
  }>
  studyPeriod: Readonly<{
    id: number
    year: number
    yearPeriod: StudyPeriodYearPeriod
  }> | null
  class: Readonly<{
    id: number
    code: string
    professors: ReadonlyArray<Readonly<{ id: number; name: string }>>
  }> | null
  _paths: Readonly<{
    self: string
    student: string
    course: string
    studyPeriod: string | null
    class: string | null
  }>
}>

export type StudentCourseEvaluationMode =
  | 'GRADE_AND_ATTENDANCE'
  | 'ATTENDANCE'
  | 'CONCEPT'

export type StudentCourseAttemptStatus =
  | 'ENROLLED'
  | 'DROPPED'
  | 'APPROVED'
  | 'FAILED_BY_GRADE'
  | 'APPROVED_BY_ATTENDANCE'
  | 'APPROVED_BY_PROFICIENCY'
  | 'FAILED_BY_ATTENDANCE'
  | 'SUFFICIENT'
  | 'INSUFFICIENT'

export type StudentHistoryImport = Readonly<{
  format: 'pomi-student-history'
  version: 1
  student: Readonly<{ ra: string }>
  semesters: ReadonlyArray<Readonly<{
    year: number
    yearPeriod: StudyPeriodYearPeriod
    courses: ReadonlyArray<Readonly<{
      code: string
      name: string
      grade: number | null
      workloadHours: number | null
      credits: number | null
      status: Exclude<StudentCourseAttemptStatus, 'ENROLLED' | 'FAILED_BY_GRADE' | 'INSUFFICIENT'>
    }>>
  }>>
}>

export type StudentHistoryImportSummary = Readonly<{
  created: number
  updated: number
  skipped: number
  warnings: ReadonlyArray<Readonly<{
    year: number | null
    yearPeriod: string | null
    code: string | null
    message: string
  }>>
}>

export type ProfessorEvaluation = Readonly<{
  id: number
  studentId: number
  classId: number
  professorId: number
  wouldTakeAgain: number
  fairness: number
  clarity: number
  difficulty: number
  createdAt: string
  updatedAt: string
}>

export type ProfessorEvaluationEligibility = Readonly<{
  eligible: boolean
  evaluation: ProfessorEvaluation | null
}>

export type PendingProfessorEvaluation = Readonly<{
  attemptId: number
  class: Readonly<{ id: number; code: string }>
  course: Readonly<{ id: number; code: string; name: string }>
  professor: Readonly<{ id: number; name: string }>
}>

export function isApprovedStudentCourseAttempt(
  attempt: Pick<StudentCourseAttempt, 'status'>,
) {
  return [
    'APPROVED',
    'APPROVED_BY_ATTENDANCE',
    'APPROVED_BY_PROFICIENCY',
    'SUFFICIENT',
  ].includes(attempt.status)
}

export type StudentCourseAttemptClass = Readonly<{
  id: number
  code: string
  courseId: number
  studyPeriodId: number
  studyPeriodYear: number
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
  year: number
  yearPeriod: StudyPeriodYearPeriod
  startDate: string
}>

type ApiPage<T> = Readonly<{
  data: ReadonlyArray<T>
  _paths: Readonly<{ next: string | null }>
}>

type CatalogCourseEvaluation = Readonly<{
  evaluation: StudentCourseEvaluationMode | null
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
  const response = await dataApiRequest('/study-periods')
  await expectApiResponse(response)
  return (await response.json()) as ReadonlyArray<StudyPeriod>
}

async function listPublicPages<T>(initialPath: string) {
  const items: Array<T> = []
  let path: string | null = initialPath
  while (path) {
    const response = await dataApiRequest(path)
    await expectApiResponse(response)
    const page = (await response.json()) as Readonly<{
      data: ReadonlyArray<T>
      _paths: Readonly<{ next: string | null }>
    }>
    items.push(...page.data)
    path = page._paths.next
  }
  return items
}

export async function getCourseEvaluationForStudyPeriod(
  courseId: number,
  year: number,
): Promise<StudentCourseEvaluationMode | null> {
  const response = await dataApiRequest(
    `/catalog-courses?courseId=${courseId}&catalogYear=${year}&page=1&pageSize=1`,
  )
  await expectApiResponse(response)
  const page = (await response.json()) as ApiPage<CatalogCourseEvaluation>
  return page.data[0]?.evaluation ?? null
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

export function importStudentHistory(
  studentId: number,
  body: StudentHistoryImport,
  getAccessToken: () => Promise<string>,
) {
  return requestJson<StudentHistoryImportSummary>(
    `/student/${studentId}/course-history`,
    getAccessToken,
    { method: 'POST', body: JSON.stringify(body) },
  )
}

export function getProfessorEvaluation(
  studentId: number,
  classId: number,
  professorId: number,
  getAccessToken: () => Promise<string>,
) {
  return requestJson<ProfessorEvaluationEligibility>(
    `/student/${studentId}/classes/${classId}/professors/${professorId}/evaluation`,
    getAccessToken,
  )
}

export function putProfessorEvaluation(
  studentId: number,
  classId: number,
  professorId: number,
  body: Pick<
    ProfessorEvaluation,
    'wouldTakeAgain' | 'fairness' | 'clarity' | 'difficulty'
  >,
  getAccessToken: () => Promise<string>,
) {
  return requestJson<ProfessorEvaluation>(
    `/student/${studentId}/classes/${classId}/professors/${professorId}/evaluation`,
    getAccessToken,
    { method: 'PUT', body: JSON.stringify(body) },
  )
}

export function listPendingProfessorEvaluations(
  studentId: number,
  period: Readonly<{
    year: number
    yearPeriod: 'FIRST_SEMESTER' | 'SECOND_SEMESTER'
  }>,
  getAccessToken: () => Promise<string>,
) {
  return requestJson<ReadonlyArray<PendingProfessorEvaluation>>(
    `/student/${studentId}/professor-evaluations/pending?year=${period.year}&yearPeriod=${period.yearPeriod}`,
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
        .filter(isApprovedStudentCourseAttempt)
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
    evaluationMode?: StudentCourseEvaluationMode
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
    Pick<
      StudentCourseAttempt,
      'studyPeriodId' | 'classId' | 'evaluationMode' | 'status' | 'grade'
    >
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
  const response = await appApiRequest(
    `/student/${studentId}/course-attempts/${attemptId}`,
    getAccessToken,
    { method: 'DELETE' },
  )
  await expectApiResponse(response)
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
      attempt.courseId === Number(courseId) &&
      isApprovedStudentCourseAttempt(attempt),
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
      evaluationMode:
        completion?.grade == null ? 'ATTENDANCE' : 'GRADE_AND_ATTENDANCE',
      status: completion?.grade == null ? 'APPROVED_BY_ATTENDANCE' : 'APPROVED',
      grade: completion?.grade ?? null,
    },
    getAccessToken,
  )
}
