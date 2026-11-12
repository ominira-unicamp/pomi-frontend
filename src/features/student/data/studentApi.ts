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
  GeneratedStudentCourseAttempt,
  'studyPeriod' | 'class'
> & {
  studyPeriod: CourseAttemptStudyPeriod | null
  class: CourseAttemptClass | null
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
export type StudentHistoryImportSummary =
  Readonly<GeneratedStudentHistoryImportSummary>
export type StudentCourseAttemptClass = ClassTransport
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

export function getStudentAcademicProfile(
  userId: number,
  getAccessToken: () => Promise<string>,
) {
  return pomiSdk.app.students.get(userId, { getAccessToken })
}

export function patchStudentProfile(
  userId: number,
  body: StudentProfilePatch,
  getAccessToken: () => Promise<string>,
) {
  return pomiSdk.app.students.update(
    userId,
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
  return page.data[0]?.evaluation ?? null
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
  userId: number,
  getAccessToken: () => Promise<string>,
) {
  return pomiSdk.app.courseAttempts.listAll(
    userId,
    {},
    { getAccessToken },
  ) as unknown as Promise<ReadonlyArray<StudentCourseAttempt>>
}

export function importStudentHistory(
  userId: number,
  body: StudentHistoryImport,
  getAccessToken: () => Promise<string>,
) {
  return pomiSdk.app.studentHistory.create(
    userId,
    body as createStudentHistoryInput['body'],
    { getAccessToken },
  )
}

export function getProfessorEvaluation(
  userId: number,
  classId: number,
  professorId: number,
  getAccessToken: () => Promise<string>,
) {
  return pomiSdk.app.professorEvaluations.get(userId, classId, professorId, {
    getAccessToken,
  })
}

export function putProfessorEvaluation(
  userId: number,
  classId: number,
  professorId: number,
  body: ProfessorEvaluationBody,
  getAccessToken: () => Promise<string>,
) {
  return pomiSdk.app.professorEvaluations.update(
    userId,
    classId,
    professorId,
    body,
    { getAccessToken },
  )
}

export function listPendingProfessorEvaluations(
  userId: number,
  period: Readonly<{
    year: number
    yearPeriod: 'FIRST_SEMESTER' | 'SECOND_SEMESTER'
  }>,
  getAccessToken: () => Promise<string>,
) {
  return pomiSdk.app.professorEvaluations.listAll(
    userId,
    { filter: period },
    { getAccessToken },
  )
}

export function createStudentCourseAttempt(
  userId: number,
  body: StudentCourseAttemptBody,
  getAccessToken: () => Promise<string>,
) {
  return pomiSdk.app.courseAttempts.create(userId, body, {
    getAccessToken,
  })
}

export function patchStudentCourseAttempt(
  userId: number,
  attemptId: number,
  body: PatchAttemptBody,
  getAccessToken: () => Promise<string>,
) {
  return pomiSdk.app.courseAttempts.update(userId, attemptId, body, {
    getAccessToken,
  })
}

export async function deleteStudentCourseAttempt(
  userId: number,
  attemptId: number,
  getAccessToken: () => Promise<string>,
) {
  await pomiSdk.app.courseAttempts.delete(userId, attemptId, {
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

export async function listCompletedCourseIds(
  userId: number,
  getAccessToken: () => Promise<string>,
) {
  const attempts = await listStudentCourseAttempts(userId, getAccessToken)
  return [
    ...new Set(
      attempts
        .filter(isApprovedStudentCourseAttempt)
        .map((attempt) => String(attempt.courseId)),
    ),
  ]
}

export async function setCourseCompleted(
  userId: number,
  courseId: string,
  completed: boolean,
  getAccessToken: () => Promise<string>,
  completion?: Readonly<{ studyPeriodId?: number; grade?: number | null }>,
) {
  const attempts = await listStudentCourseAttempts(userId, getAccessToken)
  const completedAttempts = attempts.filter(
    (attempt) =>
      attempt.courseId === Number(courseId) &&
      isApprovedStudentCourseAttempt(attempt),
  )
  if (!completed) {
    const latest = completedAttempts.at(0)
    if (latest)
      await deleteStudentCourseAttempt(userId, latest.id, getAccessToken)
    return
  }
  if (completedAttempts.length) return
  await createStudentCourseAttempt(
    userId,
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
