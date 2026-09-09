import { pomiApi } from '@/api/client'

export type {
  PendingProfessorEvaluation,
  ProfessorEvaluation,
  ProfessorEvaluationEligibility,
  StudentClassSchedule,
  StudentCourseAttempt,
  StudentCourseAttemptClass,
  StudentCourseAttemptStatus,
  StudentCourseEvaluationMode,
  StudentHistoryImport,
  StudentHistoryImportSummary,
  StudentProfile,
  StudyPeriod,
} from '@ominira/pomi-sdk/student'

import type { StudentCourseAttempt } from '@ominira/pomi-sdk/student'

export const {
  getCurrentStudent,
  registerCurrentStudent,
  getStudentProfile,
  patchStudentProfile,
  listStudyPeriods,
  getCourseEvaluationForStudyPeriod,
  listClassesForStudentCourseAttempt,
  listClassSchedulesByStudyPeriod,
  listStudentCourseAttempts,
  importStudentHistory,
  getProfessorEvaluation,
  putProfessorEvaluation,
  listPendingProfessorEvaluations,
  createStudentCourseAttempt,
  patchStudentCourseAttempt,
  deleteStudentCourseAttempt,
} = pomiApi.student

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
