import { expectApiResponse } from './errors'
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

async function requestJson<T>(
  client: PomiClient,
  path: string,
  getAccessToken: () => Promise<string>,
  init: RequestInit = {},
): Promise<T> {
  const response = await client.appApiRequest(path, getAccessToken, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
  })
  await expectApiResponse(response)
  return response.json() as Promise<T>
}

type ApiPage<T> = Readonly<{
  data: ReadonlyArray<T>
  _paths?: Readonly<{ next: string | null }>
}>

async function listAllPages<T>(client: PomiClient, initialPath: string) {
  const data: Array<T> = []
  let page = 1
  const path = initialPath
  let result = await getDataJson<ApiPage<T>>(client, path)
  data.push(...result.data)
  while (result._paths?.next) {
    page += 1
    const url = new URL(path, 'https://data.pomi.local')
    url.searchParams.set('page', String(page))
    result = await getDataJson<ApiPage<T>>(
      client,
      `${url.pathname}${url.search}`,
    )
    data.push(...result.data)
  }
  return data
}

async function getDataJson<T>(client: PomiClient, path: string): Promise<T> {
  const response = await client.dataApiRequest(path)
  await expectApiResponse(response)
  return response.json() as Promise<T>
}

export function createSemesterPlanningApi(client: PomiClient) {
  function listStudyPeriods() {
    return getDataJson<ReadonlyArray<SemesterApiStudyPeriod>>(
      client,
      '/study-periods',
    )
  }

  function listCourses() {
    return listAllPages<SemesterApiCourse>(
      client,
      '/courses?page=1&pageSize=1000',
    )
  }

  function listClasses(studyPeriodId: number) {
    return listAllPages<SemesterApiClass>(
      client,
      `/classes?studyPeriodId=${studyPeriodId}&page=1&pageSize=1000`,
    )
  }

  function listMeetings(studyPeriodId: number) {
    return listAllPages<SemesterApiMeeting>(
      client,
      `/class-schedules?studyPeriodId=${studyPeriodId}&page=1&pageSize=1000`,
    )
  }

  function listProfessorEvaluationSummaries() {
    return listAllPages<ProfessorEvaluationSummary>(
      client,
      '/professors/evaluation-summaries?page=1&pageSize=100',
    )
  }

  function listSemesterPlannings(
    studentId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return requestJson<ReadonlyArray<PersistedSemesterPlanning>>(
      client,
      `/student/${studentId}/period-plannings`,
      getAccessToken,
    )
  }

  function getSemesterPlanning(
    studentId: number,
    planId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return requestJson<PersistedSemesterPlanning>(
      client,
      `/student/${studentId}/period-plannings/${planId}`,
      getAccessToken,
    )
  }

  function createSemesterPlanning(
    studentId: number,
    document: SemesterPlanningDocumentInput,
    getAccessToken: () => Promise<string>,
  ) {
    return requestJson<PersistedSemesterPlanning>(
      client,
      `/student/${studentId}/period-plannings`,
      getAccessToken,
      {
        method: 'POST',
        body: JSON.stringify({
          name: document.name,
          studyPeriodId: document.studyPeriodId,
          curriculumId: document.curriculumId,
          classes: document.classIds,
          guide: guideToApi(document.guide),
        }),
      },
    )
  }

  function patchSemesterPlanning(
    studentId: number,
    planId: number,
    document: Omit<SemesterPlanningDocumentInput, 'studyPeriodId'>,
    getAccessToken: () => Promise<string>,
  ) {
    return requestJson<PersistedSemesterPlanning>(
      client,
      `/student/${studentId}/period-plannings/${planId}`,
      getAccessToken,
      {
        method: 'PATCH',
        body: JSON.stringify({
          name: document.name,
          curriculumId: document.curriculumId,
          classes: { set: document.classIds },
          guide: guideToApi(document.guide),
        }),
      },
    )
  }

  function updateSemesterPlanningVisibility(
    studentId: number,
    planId: number,
    visibility: SemesterPlanningVisibility,
    getAccessToken: () => Promise<string>,
  ) {
    return requestJson<PersistedSemesterPlanning>(
      client,
      `/student/${studentId}/period-plannings/${planId}`,
      getAccessToken,
      { method: 'PATCH', body: JSON.stringify({ visibility }) },
    )
  }

  async function deleteSemesterPlanning(
    studentId: number,
    planId: number,
    getAccessToken: () => Promise<string>,
  ) {
    const response = await client.appApiRequest(
      `/student/${studentId}/period-plannings/${planId}`,
      getAccessToken,
      { method: 'DELETE' },
    )
    await expectApiResponse(response)
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
