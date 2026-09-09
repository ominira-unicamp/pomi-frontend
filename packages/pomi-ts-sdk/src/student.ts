import { appApi, dataApi } from './endpoint'
import { collectPages } from './pagination'
import type { PomiClient } from './client'

export type StudyPeriodYearPeriod =
  | 'SUMMER'
  | 'FIRST_SEMESTER'
  | 'WINTER'
  | 'SECOND_SEMESTER'

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
  semesters: ReadonlyArray<
    Readonly<{
      year: number
      yearPeriod: StudyPeriodYearPeriod
      courses: ReadonlyArray<
        Readonly<{
          code: string
          name: string
          grade: number | null
          workloadHours: number | null
          credits: number | null
          status: Exclude<
            StudentCourseAttemptStatus,
            'ENROLLED' | 'FAILED_BY_GRADE' | 'INSUFFICIENT'
          >
        }>
      >
    }>
  >
}>

export type StudentHistoryImportSummary = Readonly<{
  created: number
  updated: number
  skipped: number
  warnings: ReadonlyArray<
    Readonly<{
      year: number | null
      yearPeriod: string | null
      code: string | null
      message: string
    }>
  >
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

type StudentInput = Readonly<{ studentId: number }>
type RegisterStudentInput = Readonly<{ name: string }>
type StudentProfilePatch = Partial<
  Pick<
    StudentProfile,
    | 'name'
    | 'catalogId'
    | 'programId'
    | 'specializationId'
    | 'entryYear'
    | 'languageId'
  >
>
type PatchProfileInput = StudentInput & Readonly<{ body: StudentProfilePatch }>
type CourseYearInput = Readonly<{ courseId: number; year: number }>
type CoursePeriodInput = Readonly<{ courseId: number; studyPeriodId: number }>
type StudyPeriodInput = Readonly<{ studyPeriodId: number }>
type HistoryInput = StudentInput & Readonly<{ body: StudentHistoryImport }>
type ProfessorEvaluationInput = StudentInput &
  Readonly<{ classId: number; professorId: number }>
type ProfessorEvaluationBody = Pick<
  ProfessorEvaluation,
  'wouldTakeAgain' | 'fairness' | 'clarity' | 'difficulty'
>
type PutProfessorEvaluationInput = ProfessorEvaluationInput &
  Readonly<{ body: ProfessorEvaluationBody }>
type PendingEvaluationInput = StudentInput &
  Readonly<{
    period: Readonly<{
      year: number
      yearPeriod: 'FIRST_SEMESTER' | 'SECOND_SEMESTER'
    }>
  }>
type StudentCourseAttemptBody = Readonly<{
  courseId: number
  studyPeriodId?: number | null
  classId?: number | null
  evaluationMode?: StudentCourseEvaluationMode
  status: StudentCourseAttempt['status']
  grade?: number | null
}>
type CreateAttemptInput = StudentInput &
  Readonly<{ body: StudentCourseAttemptBody }>
type AttemptInput = StudentInput & Readonly<{ attemptId: number }>
type PatchAttemptInput = AttemptInput &
  Readonly<{
    body: Partial<
      Pick<
        StudentCourseAttempt,
        'studyPeriodId' | 'classId' | 'evaluationMode' | 'status' | 'grade'
      >
    >
  }>

const studentApp = appApi.authenticated.interface('')
const studentData = dataApi.interface('')
const studentResource = appApi.authenticated.interface('/student/:studentId')
const studentEndpointDefinitions = {
  getCurrentStudent: studentApp.get<{ studentId: number | null }>('/me'),
  registerStudent: studentApp.post<
    { id: number; name: string },
    RegisterStudentInput
  >('/students', { body: ({ name }) => ({ name }) }),
  getStudentProfile: studentApp.get<StudentProfile, StudentInput>(
    '/students/:studentId',
  ),
  patchStudentProfile: studentApp.patch<StudentProfile, PatchProfileInput>(
    '/students/:studentId',
    { body: ({ body }) => body },
  ),
  listStudyPeriods:
    studentData.get<ReadonlyArray<StudyPeriod>>('/study-periods'),
  getCourseEvaluation: studentData.get<
    ApiPage<CatalogCourseEvaluation>,
    CourseYearInput
  >('/catalog-courses', {
    query: ({ courseId, year }) => ({
      courseId,
      catalogYear: year,
      page: 1,
      pageSize: 1,
    }),
  }),
  listClasses: studentData.get<
    ApiPage<StudentCourseAttemptClass>,
    CoursePeriodInput
  >('/classes', {
    query: ({ courseId, studyPeriodId }) => ({
      courseId,
      studyPeriodId,
      page: 1,
      pageSize: 100,
    }),
  }),
  listSchedules: studentData.get<
    ApiPage<StudentClassSchedule>,
    StudyPeriodInput
  >('/class-schedules', {
    query: ({ studyPeriodId }) => ({ studyPeriodId, page: 1, pageSize: 1000 }),
  }),
  listAttempts:
    studentResource.get<ReadonlyArray<StudentCourseAttempt>>(
      '/course-attempts',
    ),
  importHistory: studentResource.post<
    StudentHistoryImportSummary,
    HistoryInput
  >('/course-history', { body: ({ body }) => body }),
  getProfessorEvaluation: studentResource.get<
    ProfessorEvaluationEligibility,
    ProfessorEvaluationInput
  >('/classes/:classId/professors/:professorId/evaluation'),
  putProfessorEvaluation: studentResource.put<
    ProfessorEvaluation,
    PutProfessorEvaluationInput
  >('/classes/:classId/professors/:professorId/evaluation', {
    body: ({ body }) => body,
  }),
  listPendingEvaluations: studentResource.get<
    ReadonlyArray<PendingProfessorEvaluation>,
    PendingEvaluationInput
  >('/professor-evaluations/pending', {
    query: ({ period }) => ({
      year: period.year,
      yearPeriod: period.yearPeriod,
    }),
  }),
  createAttempt: studentResource.post<StudentCourseAttempt, CreateAttemptInput>(
    '/course-attempts',
    { body: ({ body }) => body },
  ),
  patchAttempt: studentResource.patch<StudentCourseAttempt, PatchAttemptInput>(
    '/course-attempts/:attemptId',
    { body: ({ body }) => body },
  ),
  deleteAttempt: studentResource.remove<AttemptInput>(
    '/course-attempts/:attemptId',
  ),
}

export function createStudentApi(client: PomiClient) {
  const api = client.bind(studentEndpointDefinitions)

  function getCurrentStudent(getAccessToken: () => Promise<string>) {
    return api.getCurrentStudent({}, { getAccessToken })
  }

  function registerCurrentStudent(
    name: string,
    getAccessToken: () => Promise<string>,
  ) {
    return api.registerStudent({ name }, { getAccessToken })
  }

  function getStudentProfile(
    studentId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return api.getStudentProfile({ studentId }, { getAccessToken })
  }

  function patchStudentProfile(
    studentId: number,
    body: StudentProfilePatch,
    getAccessToken: () => Promise<string>,
  ) {
    return api.patchStudentProfile({ studentId, body }, { getAccessToken })
  }

  function listStudyPeriods(): Promise<ReadonlyArray<StudyPeriod>> {
    return api.listStudyPeriods({})
  }

  async function getCourseEvaluationForStudyPeriod(
    courseId: number,
    year: number,
  ): Promise<StudentCourseEvaluationMode | null> {
    const page = await api.getCourseEvaluation({
      courseId,
      year,
    })
    return page.data[0]?.evaluation ?? null
  }

  async function listClassesForStudentCourseAttempt(
    courseId: number,
    studyPeriodId: number,
  ): Promise<ReadonlyArray<StudentCourseAttemptClass>> {
    return collectPages(
      client,
      'data',
      api.listClasses({ courseId, studyPeriodId }),
    )
  }

  function listClassSchedulesByStudyPeriod(studyPeriodId: number) {
    return collectPages(client, 'data', api.listSchedules({ studyPeriodId }))
  }

  function listStudentCourseAttempts(
    studentId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return api.listAttempts({ studentId }, { getAccessToken })
  }
  function importStudentHistory(
    studentId: number,
    body: StudentHistoryImport,
    getAccessToken: () => Promise<string>,
  ) {
    return api.importHistory({ studentId, body }, { getAccessToken })
  }

  function getProfessorEvaluation(
    studentId: number,
    classId: number,
    professorId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return api.getProfessorEvaluation(
      { studentId, classId, professorId },
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
    return api.putProfessorEvaluation(
      { studentId, classId, professorId, body },
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
    return api.listPendingEvaluations({ studentId, period }, { getAccessToken })
  }

  function createStudentCourseAttempt(
    studentId: number,
    body: StudentCourseAttemptBody,
    getAccessToken: () => Promise<string>,
  ) {
    return api.createAttempt({ studentId, body }, { getAccessToken })
  }

  function patchStudentCourseAttempt(
    studentId: number,
    attemptId: number,
    body: PatchAttemptInput['body'],
    getAccessToken: () => Promise<string>,
  ) {
    return api.patchAttempt({ studentId, attemptId, body }, { getAccessToken })
  }

  async function deleteStudentCourseAttempt(
    studentId: number,
    attemptId: number,
    getAccessToken: () => Promise<string>,
  ) {
    await api.deleteAttempt({ studentId, attemptId }, { getAccessToken })
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
