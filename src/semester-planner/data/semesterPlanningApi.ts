import type {
  ClassMeeting,
  SemesterClass,
  SemesterCourse,
  SemesterPlannerStaticData,
  SemesterPlanningGuide,
  StudyPeriod,
} from '@pomi/planner-domain/semester'

import { appApiRequest, dataApiRequest } from '@/api/client'
import { expectApiResponse } from '@/api/errors'
import { publicStaticDataCache } from '@/lib/publicStaticDataCache'

type ApiPage<T> = Readonly<{
  data: ReadonlyArray<T>
  _paths?: Readonly<{ next: string | null }>
}>

type ApiClass = Readonly<{
  id: number
  code: string
  courseId: number
  courseCode: string
  professors: ReadonlyArray<Readonly<{ name: string }>>
}>

type ApiMeeting = Readonly<{
  id: number
  classId: number
  dayOfWeek: ClassMeeting['dayOfWeek']
  start: string
  end: string
  roomCode: string
}>

let cachedStudyPeriods: ReadonlyArray<StudyPeriod> | undefined
let studyPeriodsLoad: Promise<ReadonlyArray<StudyPeriod>> | undefined
let studyPeriodsCacheLoaded = false
let studyPeriodsRefreshed = false
let cachedCourses: ReadonlyArray<SemesterCourse> | undefined
let coursesLoad: Promise<ReadonlyArray<SemesterCourse>> | undefined
let coursesCacheLoaded = false
let coursesRefreshed = false
const classesByStudyPeriod = new Map<number, ReadonlyArray<ApiClass>>()
const classesLoadByStudyPeriod = new Map<
  number,
  Promise<ReadonlyArray<ApiClass>>
>()
const classesCacheLoadedByStudyPeriod = new Set<number>()
const refreshedClassStudyPeriods = new Set<number>()
const meetingsByStudyPeriod = new Map<number, ReadonlyArray<ApiMeeting>>()
const meetingsLoadByStudyPeriod = new Map<
  number,
  Promise<ReadonlyArray<ApiMeeting>>
>()
const meetingsCacheLoadedByStudyPeriod = new Set<number>()
const refreshedMeetingStudyPeriods = new Set<number>()

const studyPeriodsCacheKey = 'semester-planner:study-periods'
const coursesCacheKey = 'semester-planner:courses'
const classesCachePrefix = 'semester-planner:classes:'
const meetingsCachePrefix = 'semester-planner:meetings:'
const cachedStudyPeriodLimit = 2

async function requestJson<T>(path: string): Promise<T> {
  const response = await dataApiRequest(path)
  await expectApiResponse(response)
  return response.json() as Promise<T>
}

function pagePath(path: string, page: number) {
  const url = new URL(path, 'https://data.pomi.local')
  url.searchParams.set('page', String(page))
  return `${url.pathname}${url.search}`
}

async function listAllPages<T>(path: string): Promise<ReadonlyArray<T>> {
  const data: Array<T> = []
  let pageNumber = 1
  let page = await requestJson<ApiPage<T>>(path)
  data.push(...page.data)
  while (page._paths?.next) {
    pageNumber += 1
    page = await requestJson<ApiPage<T>>(pagePath(path, pageNumber))
    data.push(...page.data)
  }
  return data
}

function refreshInBackground(operation: Promise<unknown>) {
  void operation.catch(() => undefined)
}

async function refreshStudyPeriods() {
  studyPeriodsRefreshed = true
  if (!studyPeriodsLoad) {
    studyPeriodsLoad = requestJson<ReadonlyArray<StudyPeriod>>('/study-periods')
      .then(async (studyPeriods) => {
        cachedStudyPeriods = studyPeriods
        await publicStaticDataCache.write(studyPeriodsCacheKey, studyPeriods)
        return studyPeriods
      })
      .finally(() => {
        studyPeriodsLoad = undefined
      })
  }
  return studyPeriodsLoad
}

async function loadCachedStudyPeriods() {
  if (cachedStudyPeriods) {
    if (!studyPeriodsRefreshed) refreshInBackground(refreshStudyPeriods())
    return cachedStudyPeriods
  }
  if (!studyPeriodsCacheLoaded) {
    studyPeriodsCacheLoaded = true
    const cached =
      await publicStaticDataCache.read<ReadonlyArray<StudyPeriod>>(
        studyPeriodsCacheKey,
      )
    if (cached) {
      cachedStudyPeriods = cached
      if (!studyPeriodsRefreshed) refreshInBackground(refreshStudyPeriods())
      return cached
    }
  }
  return refreshStudyPeriods()
}

async function refreshCourses() {
  coursesRefreshed = true
  if (!coursesLoad) {
    coursesLoad = listAllPages<SemesterCourse>('/courses?page=1&pageSize=1000')
      .then(async (courses) => {
        cachedCourses = courses
        await publicStaticDataCache.write(coursesCacheKey, courses)
        return courses
      })
      .finally(() => {
        coursesLoad = undefined
      })
  }
  return coursesLoad
}

async function loadCachedCourses() {
  if (cachedCourses) {
    if (!coursesRefreshed) refreshInBackground(refreshCourses())
    return cachedCourses
  }
  if (!coursesCacheLoaded) {
    coursesCacheLoaded = true
    const cached =
      await publicStaticDataCache.read<ReadonlyArray<SemesterCourse>>(
        coursesCacheKey,
      )
    if (cached) {
      cachedCourses = cached
      if (!coursesRefreshed) refreshInBackground(refreshCourses())
      return cached
    }
  }
  return refreshCourses()
}

async function refreshClasses(studyPeriodId: number) {
  refreshedClassStudyPeriods.add(studyPeriodId)
  let loading = classesLoadByStudyPeriod.get(studyPeriodId)
  if (!loading) {
    loading = listAllPages<ApiClass>(
      `/classes?studyPeriodId=${studyPeriodId}&page=1&pageSize=1000`,
    ).then(async (classes) => {
      classesByStudyPeriod.set(studyPeriodId, classes)
      await publicStaticDataCache.write(
        `${classesCachePrefix}${studyPeriodId}`,
        classes,
      )
      await publicStaticDataCache.prune(
        classesCachePrefix,
        cachedStudyPeriodLimit,
      )
      return classes
    })
    classesLoadByStudyPeriod.set(studyPeriodId, loading)
  }
  try {
    return await loading
  } finally {
    classesLoadByStudyPeriod.delete(studyPeriodId)
  }
}

async function loadCachedClasses(studyPeriodId: number) {
  const cached = classesByStudyPeriod.get(studyPeriodId)
  if (cached) {
    if (!refreshedClassStudyPeriods.has(studyPeriodId))
      refreshInBackground(refreshClasses(studyPeriodId))
    return cached
  }
  if (!classesCacheLoadedByStudyPeriod.has(studyPeriodId)) {
    classesCacheLoadedByStudyPeriod.add(studyPeriodId)
    const persisted = await publicStaticDataCache.read<ReadonlyArray<ApiClass>>(
      `${classesCachePrefix}${studyPeriodId}`,
    )
    if (persisted) {
      classesByStudyPeriod.set(studyPeriodId, persisted)
      if (!refreshedClassStudyPeriods.has(studyPeriodId))
        refreshInBackground(refreshClasses(studyPeriodId))
      return persisted
    }
  }
  return refreshClasses(studyPeriodId)
}

async function refreshMeetings(studyPeriodId: number) {
  refreshedMeetingStudyPeriods.add(studyPeriodId)
  let loading = meetingsLoadByStudyPeriod.get(studyPeriodId)
  if (!loading) {
    loading = listAllPages<ApiMeeting>(
      `/class-schedules?studyPeriodId=${studyPeriodId}&page=1&pageSize=1000`,
    ).then(async (meetings) => {
      meetingsByStudyPeriod.set(studyPeriodId, meetings)
      await publicStaticDataCache.write(
        `${meetingsCachePrefix}${studyPeriodId}`,
        meetings,
      )
      await publicStaticDataCache.prune(
        meetingsCachePrefix,
        cachedStudyPeriodLimit,
      )
      return meetings
    })
    meetingsLoadByStudyPeriod.set(studyPeriodId, loading)
  }
  try {
    return await loading
  } finally {
    meetingsLoadByStudyPeriod.delete(studyPeriodId)
  }
}

async function loadCachedMeetings(studyPeriodId: number) {
  const cached = meetingsByStudyPeriod.get(studyPeriodId)
  if (cached) {
    if (!refreshedMeetingStudyPeriods.has(studyPeriodId))
      refreshInBackground(refreshMeetings(studyPeriodId))
    return cached
  }
  if (!meetingsCacheLoadedByStudyPeriod.has(studyPeriodId)) {
    meetingsCacheLoadedByStudyPeriod.add(studyPeriodId)
    const persisted = await publicStaticDataCache.read<
      ReadonlyArray<ApiMeeting>
    >(`${meetingsCachePrefix}${studyPeriodId}`)
    if (persisted) {
      meetingsByStudyPeriod.set(studyPeriodId, persisted)
      if (!refreshedMeetingStudyPeriods.has(studyPeriodId))
        refreshInBackground(refreshMeetings(studyPeriodId))
      return persisted
    }
  }
  return refreshMeetings(studyPeriodId)
}

export async function loadSemesterPlannerStaticData(
  studyPeriodId?: number,
): Promise<SemesterPlannerStaticData> {
  const [studyPeriods, courses, classes, meetings] = await Promise.all([
    loadCachedStudyPeriods(),
    loadCachedCourses(),
    studyPeriodId ? loadCachedClasses(studyPeriodId) : Promise.resolve([]),
    studyPeriodId ? loadCachedMeetings(studyPeriodId) : Promise.resolve([]),
  ])
  return {
    studyPeriods,
    courses,
    classes: classes.map(
      (item): SemesterClass => ({
        id: item.id,
        code: item.code,
        courseId: item.courseId,
        courseCode: item.courseCode,
        professors: item.professors.map((professor) => professor.name),
      }),
    ),
    meetings,
  }
}

export type PersistedSemesterPlanning = Readonly<{
  id: number
  name: string
  createdAt: string
  updatedAt: string
  studyPeriodId: number
  studyPeriodCode: string
  curriculumId: number | null
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

type PlanningGuideInput = SemesterPlanningGuide

function guideToApi(guide: PlanningGuideInput) {
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

async function authenticatedJson<T>(
  path: string,
  getAccessToken: () => Promise<string>,
  init: RequestInit = {},
): Promise<T> {
  const response = await appApiRequest(path, getAccessToken, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
  })
  await expectApiResponse(response)
  return response.json() as Promise<T>
}

export function listSemesterPlannings(
  studentId: number,
  getAccessToken: () => Promise<string>,
) {
  return authenticatedJson<ReadonlyArray<PersistedSemesterPlanning>>(
    `/student/${studentId}/period-plannings`,
    getAccessToken,
  )
}

export function createSemesterPlanning(
  studentId: number,
  document: Readonly<{
    name: string
    studyPeriodId: number
    curriculumId: number | null
    classIds: ReadonlyArray<number>
    guide: PlanningGuideInput
  }>,
  getAccessToken: () => Promise<string>,
) {
  return authenticatedJson<PersistedSemesterPlanning>(
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

export function patchSemesterPlanning(
  studentId: number,
  planId: number,
  document: Readonly<{
    name: string
    curriculumId: number | null
    classIds: ReadonlyArray<number>
    guide: PlanningGuideInput
  }>,
  getAccessToken: () => Promise<string>,
) {
  return authenticatedJson<PersistedSemesterPlanning>(
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

export async function deleteSemesterPlanning(
  studentId: number,
  planId: number,
  getAccessToken: () => Promise<string>,
) {
  const response = await appApiRequest(
    `/student/${studentId}/period-plannings/${planId}`,
    getAccessToken,
    { method: 'DELETE' },
  )
  await expectApiResponse(response)
}
