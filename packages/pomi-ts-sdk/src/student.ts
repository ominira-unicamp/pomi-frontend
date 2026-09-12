import type {
  ProfessorEvaluation as GeneratedProfessorEvaluation,
  ProfessorEvaluationEligibility as GeneratedProfessorEvaluationEligibility,
  PendingProfessorEvaluation as GeneratedPendingProfessorEvaluation,
  Student as GeneratedStudent,
  StudentHistoryImportSummary as GeneratedStudentHistoryImportSummary,
  StudentCourseAttemptTransport,
} from './generated/app/domain.js'
import type {
  createStudentCourseAttemptsInput,
  createStudentCourseHistoryInput,
  createStudentsInput,
  updateStudentClassesProfessorsEvaluationInput,
  updateStudentCourseAttemptsInput,
  updateStudentsInput,
} from './generated/app/operations.js'
import type {
  ClassSchedule as GeneratedClassSchedule,
  ClassTransport,
  StudyPeriod as GeneratedStudyPeriod,
} from './generated/data/domain.js'
import type { PomiSdkClient } from './generatedClient.js'

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
export type StudentCourseAttempt = StudentCourseAttemptTransport
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
  createStudentCourseHistoryInput['body']
>
export type StudentHistoryImportSummary =
  Readonly<GeneratedStudentHistoryImportSummary>
export type ProfessorEvaluation = GeneratedProfessorEvaluation
export type ProfessorEvaluationEligibility =
  GeneratedProfessorEvaluationEligibility
export type PendingProfessorEvaluation = GeneratedPendingProfessorEvaluation
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

type StudentProfilePatch = Readonly<Partial<updateStudentsInput['body']>>
type ProfessorEvaluationBody = Readonly<
  Pick<
    updateStudentClassesProfessorsEvaluationInput['body'],
    'wouldTakeAgain' | 'fairness' | 'clarity' | 'difficulty'
  >
>
type StudentCourseAttemptBody = Readonly<
  createStudentCourseAttemptsInput['body']
>
type PatchAttemptBody = Readonly<updateStudentCourseAttemptsInput['body']>

export function createStudentApi(client: PomiSdkClient) {
  function getCurrentStudent(getAccessToken: () => Promise<string>) {
    return client.app.me.list({}, { getAccessToken })
  }

  function registerCurrentStudent(
    name: string,
    getAccessToken: () => Promise<string>,
  ) {
    const body: createStudentsInput['body'] = { name }
    return client.app.students.create(body, { getAccessToken })
  }

  function getStudentProfile(
    studentId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.students.get(studentId, { getAccessToken })
  }

  function patchStudentProfile(
    studentId: number,
    body: StudentProfilePatch,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.students.update(
      studentId,
      body as updateStudentsInput['body'],
      { getAccessToken },
    )
  }

  function listStudyPeriods() {
    return client.data.studyPeriods.list({})
  }

  async function getCourseEvaluationForStudyPeriod(
    courseId: number,
    year: number,
  ): Promise<StudentCourseEvaluationMode | null> {
    const page = await client.data.catalogCourses.list({
      page: 1,
      pageSize: 1,
      filter: { courseId, catalogYear: year },
    })
    return (
      (page.data[0]?.evaluation as StudentCourseEvaluationMode | null) ?? null
    )
  }

  function listClassesForStudentCourseAttempt(
    courseId: number,
    studyPeriodId: number,
  ) {
    return client.data.classes.listAll({
      page: 1,
      pageSize: 100,
      filter: { courseId, studyPeriodId },
    }) as unknown as Promise<ReadonlyArray<StudentCourseAttemptClass>>
  }

  function listClassSchedulesByStudyPeriod(studyPeriodId: number) {
    return client.data.classSchedules.listAll({
      page: 1,
      pageSize: 1000,
      filter: { studyPeriod: { id: studyPeriodId } },
    }) as Promise<ReadonlyArray<StudentClassSchedule>>
  }

  function listStudentCourseAttempts(
    studentId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.courseAttempts.list(
      studentId,
      {},
      { getAccessToken },
    ) as Promise<ReadonlyArray<StudentCourseAttempt>>
  }

  function importStudentHistory(
    studentId: number,
    body: StudentHistoryImport,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.studentCourseHistory.create(
      studentId,
      body as createStudentCourseHistoryInput['body'],
      { getAccessToken },
    )
  }

  function getProfessorEvaluation(
    studentId: number,
    classId: number,
    professorId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.studentClassesProfessorsEvaluation.list(
      studentId,
      classId,
      professorId,
      {},
      { getAccessToken },
    )
  }

  function putProfessorEvaluation(
    studentId: number,
    classId: number,
    professorId: number,
    body: ProfessorEvaluationBody,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.studentClassesProfessorsEvaluation.update(
      studentId,
      classId,
      professorId,
      body,
      { getAccessToken },
    )
  }

  function listPendingProfessorEvaluations(
    studentId: number,
    period: Readonly<{
      year: number
      yearPeriod: 'FIRST_SEMESTER' | 'SECOND_SEMESTER'
    }>,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.studentProfessorEvaluationsPending.list(
      studentId,
      { filter: period },
      { getAccessToken },
    )
  }

  function createStudentCourseAttempt(
    studentId: number,
    body: StudentCourseAttemptBody,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.courseAttempts.create(studentId, body, {
      getAccessToken,
    }) as Promise<StudentCourseAttempt>
  }

  function patchStudentCourseAttempt(
    studentId: number,
    attemptId: number,
    body: PatchAttemptBody,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.courseAttempts.update(studentId, attemptId, body, {
      getAccessToken,
    }) as Promise<StudentCourseAttempt>
  }

  async function deleteStudentCourseAttempt(
    studentId: number,
    attemptId: number,
    getAccessToken: () => Promise<string>,
  ) {
    await client.app.courseAttempts.delete(studentId, attemptId, {
      getAccessToken,
    })
  }

  return {
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
  }
}
