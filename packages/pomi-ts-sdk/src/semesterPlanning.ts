import { appApi, dataApi } from './endpoint'
import { collectPages } from './pagination'
import type { PomiClient } from './client'

export type SemesterApiStudyPeriod = Readonly<{
  id: number
  year: number
  yearPeriod: 'FIRST_SEMESTER' | 'SECOND_SEMESTER' | 'SUMMER' | 'WINTER'
  startDate: string
}>

export type SemesterApiCourse = Readonly<{
  id: number
  code: string
  name: string
  credits: number
}>

export type SemesterApiClass = Readonly<{
  id: number
  code: string
  courseId: number
  courseCode: string
  professors: ReadonlyArray<Readonly<{ id: number; name: string }>>
}>

export type SemesterApiMeeting = Readonly<{
  id: number
  classId: number
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

export type ProfessorEvaluationSummary = Readonly<{
  professor: Readonly<{ id: number; name: string }>
  responseCount: number
  wouldTakeAgain: number
  fairness: number
  clarity: number
  difficulty: number
}>

export type SemesterPlanningVisibility = 'PRIVATE' | 'FRIENDS' | 'PUBLIC'

export type SemesterPlanningGuideInput = Readonly<{
  mode: 'curriculum' | 'program' | 'none'
  curriculum: Readonly<{
    source: 'saved' | 'suggestion' | null
    curriculumId: number | null
    suggestionId: number | null
    suggestionCatalogProgramId: number | null
  }>
  program: Readonly<{
    catalogProgramId: number | null
    specializationId: number | null
    languageId: number | null
  }>
  manualCourseIds: ReadonlyArray<number>
}>

export type PersistedSemesterPlanning = Readonly<{
  id: number
  name: string
  createdAt: string
  updatedAt: string
  studyPeriodId: number
  studyPeriodYear: number
  studyPeriodYearPeriod: SemesterApiStudyPeriod['yearPeriod']
  curriculumId: number | null
  visibility: SemesterPlanningVisibility
  classes: ReadonlyArray<
    Readonly<{
      id: number
      code: string
      courseCode: string
      courseCredits: number
    }>
  >
  guide: Readonly<{
    mode: 'CURRICULUM' | 'PROGRAM' | 'NONE'
    curriculumSource: 'SAVED' | 'SUGGESTION' | null
    curriculumId: number | null
    suggestionId: number | null
    suggestionCatalogProgramId: number | null
    catalogProgramId: number | null
    specializationId: number | null
    languageId: number | null
    manualCourseIds: ReadonlyArray<number>
  }>
}>

type SemesterPlanningDocumentInput = Readonly<{
  name: string
  studyPeriodId: number
  curriculumId: number | null
  classIds: ReadonlyArray<number>
  guide: SemesterPlanningGuideInput
}>

function guideToApi(guide: SemesterPlanningGuideInput) {
  return {
    mode: guide.mode.toUpperCase() as 'CURRICULUM' | 'PROGRAM' | 'NONE',
    curriculumSource: guide.curriculum.source
      ? (guide.curriculum.source.toUpperCase() as 'SAVED' | 'SUGGESTION')
      : null,
    curriculumId: guide.curriculum.curriculumId,
    suggestionId: guide.curriculum.suggestionId,
    suggestionCatalogProgramId: guide.curriculum.suggestionCatalogProgramId,
    catalogProgramId: guide.program.catalogProgramId,
    specializationId: guide.program.specializationId,
    languageId: guide.program.languageId,
    manualCourseIds: [...new Set(guide.manualCourseIds)],
  }
}

type ApiPage<T> = Readonly<{
  data: ReadonlyArray<T>
  _paths?: Readonly<{ next: string | null }>
}>

type StudyPeriodInput = Readonly<{ studyPeriodId: number }>
type StudentInput = Readonly<{ studentId: number }>
type PlanningInput = StudentInput & Readonly<{ planId: number }>
type CreatePlanningInput = StudentInput &
  Readonly<{ document: SemesterPlanningDocumentInput }>
type PatchPlanningInput = PlanningInput &
  Readonly<{
    document: Omit<SemesterPlanningDocumentInput, 'studyPeriodId'>
  }>
type VisibilityInput = PlanningInput &
  Readonly<{ visibility: SemesterPlanningVisibility }>

const semesterDataInterface = dataApi.interface('')
const semesterAppInterface = appApi.authenticated.interface(
  '/student/:studentId/period-plannings',
)

function dataListEndpoint<TInput, TOutput>(
  path: string,
  query?: (input: TInput) => Readonly<Record<string, string | number>>,
) {
  return semesterDataInterface.get<ApiPage<TOutput>, TInput>(`/${path}`, {
    query,
  })
}

const listStudyPeriodsEndpoint =
  semesterDataInterface.get<ReadonlyArray<SemesterApiStudyPeriod>>(
    '/study-periods',
  )

const listCoursesEndpoint = dataListEndpoint<
  Record<never, never>,
  SemesterApiCourse
>('courses', () => ({ page: 1, pageSize: 1000 }))
const listClassesEndpoint = dataListEndpoint<
  StudyPeriodInput,
  SemesterApiClass
>('classes', ({ studyPeriodId }) => ({
  studyPeriodId,
  page: 1,
  pageSize: 1000,
}))
const listMeetingsEndpoint = dataListEndpoint<
  StudyPeriodInput,
  SemesterApiMeeting
>('class-schedules', ({ studyPeriodId }) => ({
  studyPeriodId,
  page: 1,
  pageSize: 1000,
}))
const listProfessorEvaluationsEndpoint = dataListEndpoint<
  Record<never, never>,
  ProfessorEvaluationSummary
>('professors/evaluation-summaries', () => ({ page: 1, pageSize: 100 }))

const listPlanningsEndpoint = semesterAppInterface.get<
  ReadonlyArray<PersistedSemesterPlanning>,
  StudentInput
>()
const getPlanningEndpoint = semesterAppInterface.get<
  PersistedSemesterPlanning,
  PlanningInput
>('/:planId')
const createPlanningEndpoint = semesterAppInterface.post<
  PersistedSemesterPlanning,
  CreatePlanningInput
>('', {
  body: ({ document }) => ({
    name: document.name,
    studyPeriodId: document.studyPeriodId,
    curriculumId: document.curriculumId,
    classes: document.classIds,
    guide: guideToApi(document.guide),
  }),
})

const patchPlanningEndpoint = semesterAppInterface.patch<
  PersistedSemesterPlanning,
  PatchPlanningInput
>('/:planId', {
  body: ({ document }) => ({
    name: document.name,
    curriculumId: document.curriculumId,
    classes: { set: document.classIds },
    guide: guideToApi(document.guide),
  }),
})

const updateVisibilityEndpoint = semesterAppInterface.patch<
  PersistedSemesterPlanning,
  VisibilityInput
>('/:planId', { body: ({ visibility }) => ({ visibility }) })

const deletePlanningEndpoint =
  semesterAppInterface.remove<PlanningInput>('/:planId')

export function createSemesterPlanningApi(client: PomiClient) {
  const api = client.bind({
    listStudyPeriods: listStudyPeriodsEndpoint,
    listCourses: listCoursesEndpoint,
    listClasses: listClassesEndpoint,
    listMeetings: listMeetingsEndpoint,
    listProfessorEvaluations: listProfessorEvaluationsEndpoint,
    listPlannings: listPlanningsEndpoint,
    getPlanning: getPlanningEndpoint,
    createPlanning: createPlanningEndpoint,
    patchPlanning: patchPlanningEndpoint,
    updateVisibility: updateVisibilityEndpoint,
    deletePlanning: deletePlanningEndpoint,
  })
  function listStudyPeriods() {
    return api.listStudyPeriods({})
  }

  function listCourses() {
    return collectPages(client, 'data', api.listCourses({}))
  }

  function listClasses(studyPeriodId: number) {
    return collectPages(client, 'data', api.listClasses({ studyPeriodId }))
  }

  function listMeetings(studyPeriodId: number) {
    return collectPages(client, 'data', api.listMeetings({ studyPeriodId }))
  }

  function listProfessorEvaluationSummaries() {
    return collectPages(client, 'data', api.listProfessorEvaluations({}))
  }

  function listSemesterPlannings(
    studentId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return api.listPlannings({ studentId }, { getAccessToken })
  }

  function getSemesterPlanning(
    studentId: number,
    planId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return api.getPlanning({ studentId, planId }, { getAccessToken })
  }

  function createSemesterPlanning(
    studentId: number,
    document: SemesterPlanningDocumentInput,
    getAccessToken: () => Promise<string>,
  ) {
    return api.createPlanning({ studentId, document }, { getAccessToken })
  }

  function patchSemesterPlanning(
    studentId: number,
    planId: number,
    document: Omit<SemesterPlanningDocumentInput, 'studyPeriodId'>,
    getAccessToken: () => Promise<string>,
  ) {
    return api.patchPlanning(
      { studentId, planId, document },
      { getAccessToken },
    )
  }

  function updateSemesterPlanningVisibility(
    studentId: number,
    planId: number,
    visibility: SemesterPlanningVisibility,
    getAccessToken: () => Promise<string>,
  ) {
    return api.updateVisibility(
      { studentId, planId, visibility },
      { getAccessToken },
    )
  }

  async function deleteSemesterPlanning(
    studentId: number,
    planId: number,
    getAccessToken: () => Promise<string>,
  ) {
    await api.deletePlanning({ studentId, planId }, { getAccessToken })
  }

  return {
    listStudyPeriods,
    listCourses,
    listClasses,
    listMeetings,
    listProfessorEvaluationSummaries,
    listSemesterPlannings,
    getSemesterPlanning,
    createSemesterPlanning,
    patchSemesterPlanning,
    updateSemesterPlanningVisibility,
    deleteSemesterPlanning,
  }
}
