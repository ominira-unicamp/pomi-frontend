import { collectPages } from './generatedPagination.js'
import type {
  createStudentCourseAttemptsInput,
  createStudentCourseHistoryInput,
  createStudentsInput,
  getStudentsOutput,
  listStudentClassesProfessorsEvaluationOutput,
  listStudentCourseAttemptsOutput,
  listStudentProfessorEvaluationsPendingOutput,
  updateStudentClassesProfessorsEvaluationInput,
  updateStudentClassesProfessorsEvaluationOutput,
  updateStudentCourseAttemptsInput,
  updateStudentsInput,
} from './generated/app/operations.js'
import type {
  listClassSchedulesOutput,
  listClassesOutput,
  listStudyPeriodsOutput,
} from './generated/data/operations.js'
import type { PomiSdkClient } from './generatedClient.js'

export type StudentProfile = Readonly<
  Pick<
    getStudentsOutput,
    | 'id'
    | 'name'
    | 'catalogId'
    | 'programId'
    | 'specializationId'
    | 'entryYear'
    | 'languageId'
  >
>
export type StudentCourseAttempt = Readonly<
  listStudentCourseAttemptsOutput[number]
>
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
export type StudentHistoryImportSummary = Readonly<
  Awaited<ReturnType<PomiSdkClient['app']['createStudentCourseHistory']>>
>
export type ProfessorEvaluation =
  Readonly<updateStudentClassesProfessorsEvaluationOutput>
export type ProfessorEvaluationEligibility =
  Readonly<listStudentClassesProfessorsEvaluationOutput>
export type PendingProfessorEvaluation = Readonly<
  listStudentProfessorEvaluationsPendingOutput[number]
>
export type StudentCourseAttemptClass = Readonly<
  listClassesOutput['data'][number]
>
export type StudentClassSchedule = Readonly<
  Pick<
    listClassSchedulesOutput['data'][number],
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
>
export type StudyPeriod = Readonly<
  Pick<
    listStudyPeriodsOutput[number],
    'id' | 'year' | 'yearPeriod' | 'startDate'
  >
>
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
    return client.app.listMe({}, { getAccessToken })
  }

  function registerCurrentStudent(
    name: string,
    getAccessToken: () => Promise<string>,
  ) {
    const body: createStudentsInput['body'] = { name }
    return client.app.createStudents({ body }, { getAccessToken })
  }

  function getStudentProfile(
    studentId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.getStudents({ id: String(studentId) }, { getAccessToken })
  }

  function patchStudentProfile(
    studentId: number,
    body: StudentProfilePatch,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.updateStudents(
      { id: String(studentId), body: body as updateStudentsInput['body'] },
      { getAccessToken },
    )
  }

  function listStudyPeriods() {
    return client.data.listStudyPeriods({})
  }

  async function getCourseEvaluationForStudyPeriod(
    courseId: number,
    year: number,
  ): Promise<StudentCourseEvaluationMode | null> {
    const page = await client.data.listCatalogCourses({
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
    return collectPages(
      client,
      'data',
      client.data.listClasses({
        page: 1,
        pageSize: 100,
        filter: { courseId, studyPeriodId },
      }),
    )
  }

  function listClassSchedulesByStudyPeriod(studyPeriodId: number) {
    return collectPages(
      client,
      'data',
      client.data.listClassSchedules({
        page: 1,
        pageSize: 1000,
        filter: { studyPeriod: { id: studyPeriodId } },
      }),
    ) as Promise<ReadonlyArray<StudentClassSchedule>>
  }

  function listStudentCourseAttempts(
    studentId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.listStudentCourseAttempts(
      { sid: String(studentId) },
      { getAccessToken },
    )
  }

  function importStudentHistory(
    studentId: number,
    body: StudentHistoryImport,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.createStudentCourseHistory(
      {
        sid: String(studentId),
        body: body as createStudentCourseHistoryInput['body'],
      },
      { getAccessToken },
    )
  }

  function getProfessorEvaluation(
    studentId: number,
    classId: number,
    professorId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.listStudentClassesProfessorsEvaluation(
      {
        sid: String(studentId),
        classId: String(classId),
        professorId: String(professorId),
      },
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
    return client.app.updateStudentClassesProfessorsEvaluation(
      {
        sid: String(studentId),
        classId: String(classId),
        professorId: String(professorId),
        body,
      },
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
    return client.app.listStudentProfessorEvaluationsPending(
      { sid: String(studentId), filter: period },
      { getAccessToken },
    )
  }

  function createStudentCourseAttempt(
    studentId: number,
    body: StudentCourseAttemptBody,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.createStudentCourseAttempts(
      { sid: String(studentId), body },
      { getAccessToken },
    )
  }

  function patchStudentCourseAttempt(
    studentId: number,
    attemptId: number,
    body: PatchAttemptBody,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.updateStudentCourseAttempts(
      { sid: String(studentId), id: String(attemptId), body },
      { getAccessToken },
    )
  }

  async function deleteStudentCourseAttempt(
    studentId: number,
    attemptId: number,
    getAccessToken: () => Promise<string>,
  ) {
    await client.app.deleteStudentCourseAttempts(
      { sid: String(studentId), id: String(attemptId) },
      { getAccessToken },
    )
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
