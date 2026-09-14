import type {
  ClassTransport,
  ClassSchedule as GeneratedClassSchedule,
  StudyPeriod as GeneratedStudyPeriod,
} from '@ominira/pomi-sdk/generated/data'
import type {
  CourseAttemptClass,
  CourseAttemptStudyPeriod,
  PendingProfessorEvaluation as GeneratedPendingProfessorEvaluation,
  ProfessorEvaluation as GeneratedProfessorEvaluation,
  ProfessorEvaluationEligibility as GeneratedProfessorEvaluationEligibility,
  Student as GeneratedStudent,
  StudentCourseAttempt as GeneratedStudentCourseAttempt,
  StudentHistoryImportSummary as GeneratedStudentHistoryImportSummary,
  createStudentCourseAttemptsInput,
  createStudentHistoryInput,
  updateProfessorEvaluationInput,
  updateStudentCourseAttemptsInput,
  updateStudentsInput,
} from '@ominira/pomi-sdk/generated/app'
import { pomiSdk } from '@/api/client'

type WithoutPaths<T> = T extends ReadonlyArray<infer Item>
  ? ReadonlyArray<WithoutPaths<Item>>
  : T extends object
    ? {
        readonly [Key in keyof T as Key extends '_paths'
          ? never
          : Key]: WithoutPaths<T[Key]>
      }
    : T

export type StudentProfile = Pick<
  GeneratedStudent,
  | 'id'
  | 'name'
  | 'catalogId'
  | 'programId'
  | 'specializationId'
  | 'entryYear'
  | 'languageId'
>
export type StudentCourseAttempt = Omit<
  WithoutPaths<GeneratedStudentCourseAttempt>,
  'studyPeriod' | 'class'
> & {
  studyPeriod: WithoutPaths<CourseAttemptStudyPeriod> | null
  class: WithoutPaths<CourseAttemptClass> | null
  _paths: Readonly<{
    self: string
    student: string
    course: string
    studyPeriod: string | null
    class: string | null
  }>
}
export type StudentCourseEvaluationMode = StudentCourseAttempt['evaluationMode']
export type StudentCourseAttemptStatus = StudentCourseAttempt['status']
type DeepReadonly<T> = T extends (...args: Array<never>) => unknown
  ? T
  : T extends ReadonlyArray<unknown>
    ? ReadonlyArray<DeepReadonly<T[number]>>
    : T extends object
      ? { readonly [Key in keyof T]: DeepReadonly<T[Key]> }
      : T
export type StudentHistoryImport = DeepReadonly<
  createStudentHistoryInput['body']
>
export type StudentHistoryImportSummary = Readonly<GeneratedStudentHistoryImportSummary>
export type StudentCourseAttemptClass = WithoutPaths<ClassTransport>
export type StudentClassSchedule = Pick<
  GeneratedClassSchedule,
  | 'id'
  | 'classId'
  | 'classCode'
  | 'courseCode'
  | 'studyPeriodId'
  | 'dayOfWeek'
  | 'start'
  | 'end'
  | 'roomCode'
>
export type StudyPeriod = GeneratedStudyPeriod
export type StudyPeriodYearPeriod = StudyPeriod['yearPeriod']
export type {
  GeneratedPendingProfessorEvaluation as PendingProfessorEvaluation,
  GeneratedProfessorEvaluation as ProfessorEvaluation,
  GeneratedProfessorEvaluationEligibility as ProfessorEvaluationEligibility,
}

type StudentProfilePatch = Readonly<Partial<updateStudentsInput['body']>>
type ProfessorEvaluationBody = Readonly<
  Pick<
    updateProfessorEvaluationInput['body'],
    'wouldTakeAgain' | 'fairness' | 'clarity' | 'difficulty'
  >
>
type StudentCourseAttemptBody = Readonly<
  createStudentCourseAttemptsInput['body']
>
type PatchAttemptBody = Readonly<updateStudentCourseAttemptsInput['body']>

export function getCurrentStudent(getAccessToken: () => Promise<string>) {
  return pomiSdk.app.currentUser.get({ getAccessToken })
}

export function registerCurrentStudent(
  name: string,
  getAccessToken: () => Promise<string>,
) {
  return pomiSdk.app.students.create({ name }, { getAccessToken })
}

export function getStudentProfile(
  studentId: number,
  getAccessToken: () => Promise<string>,
) {
  return pomiSdk.app.students.get(studentId, { getAccessToken })
}

export function patchStudentProfile(
  studentId: number,
  body: StudentProfilePatch,
  getAccessToken: () => Promise<string>,
) {
  return pomiSdk.app.students.update(
    studentId,
    body as updateStudentsInput['body'],
    { getAccessToken },
  )
}

export function listStudyPeriods() {
  return pomiSdk.data.studyPeriods.listAll({})
}

export async function getCourseEvaluationForStudyPeriod(
  courseId: number,
  year: number,
): Promise<StudentCourseEvaluationMode | null> {
  const page = await pomiSdk.data.catalogCourses.list({
    page: 1,
    pageSize: 1,
    filter: { courseId, catalogYear: year },
  })
  return (page.data[0]?.evaluation as StudentCourseEvaluationMode | null) ?? null
}

export function listClassesForStudentCourseAttempt(
  courseId: number,
  studyPeriodId: number,
) {
  return pomiSdk.data.classes.listAll({
    page: 1,
    pageSize: 100,
    filter: { courseId, studyPeriodId },
  }) as unknown as Promise<ReadonlyArray<StudentCourseAttemptClass>>
}

export function listClassSchedulesByStudyPeriod(studyPeriodId: number) {
  return pomiSdk.data.classSchedules.listAll({
    page: 1,
    pageSize: 1000,
    filter: { studyPeriod: { id: studyPeriodId } },
  }) as Promise<ReadonlyArray<StudentClassSchedule>>
}

export function listStudentCourseAttempts(
  studentId: number,
  getAccessToken: () => Promise<string>,
) {
  return pomiSdk.app.courseAttempts.listAll(
    studentId,
    {},
    { getAccessToken },
  ) as unknown as Promise<ReadonlyArray<StudentCourseAttempt>>
}

export function importStudentHistory(
  studentId: number,
  body: StudentHistoryImport,
  getAccessToken: () => Promise<string>,
) {
  return pomiSdk.app.studentHistory.create(
    studentId,
    body as createStudentHistoryInput['body'],
    { getAccessToken },
  )
}

export function getProfessorEvaluation(
  studentId: number,
  classId: number,
  professorId: number,
  getAccessToken: () => Promise<string>,
) {
  return pomiSdk.app.professorEvaluations.get(
    studentId,
    classId,
    professorId,
    { getAccessToken },
  )
}

export function putProfessorEvaluation(
  studentId: number,
  classId: number,
  professorId: number,
  body: ProfessorEvaluationBody,
  getAccessToken: () => Promise<string>,
) {
  return pomiSdk.app.professorEvaluations.update(
    studentId,
    classId,
    professorId,
    body,
    { getAccessToken },
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
  return pomiSdk.app.professorEvaluations.listAll(
    studentId,
    { filter: period },
    { getAccessToken },
  )
}

export function createStudentCourseAttempt(
  studentId: number,
  body: StudentCourseAttemptBody,
  getAccessToken: () => Promise<string>,
) {
  return pomiSdk.app.courseAttempts.create(studentId, body, {
    getAccessToken,
  })
}

export function patchStudentCourseAttempt(
  studentId: number,
  attemptId: number,
  body: PatchAttemptBody,
  getAccessToken: () => Promise<string>,
) {
  return pomiSdk.app.courseAttempts.update(studentId, attemptId, body, {
    getAccessToken,
  })
}

export async function deleteStudentCourseAttempt(
  studentId: number,
  attemptId: number,
  getAccessToken: () => Promise<string>,
) {
  await pomiSdk.app.courseAttempts.delete(studentId, attemptId, {
    getAccessToken,
  })
}

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

export async function ensureCurrentStudent(
  name: string,
  getAccessToken: () => Promise<string>,
) {
  const current = await getCurrentStudent(getAccessToken)
  if (current.studentId) return current.studentId
  const student = await registerCurrentStudent(name, getAccessToken)
  return student.id
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
