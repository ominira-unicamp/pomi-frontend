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
let cachedCourses: ReadonlyArray<SemesterCourse> | undefined
let coursesLoad: Promise<ReadonlyArray<SemesterCourse>> | undefined
const classesByStudyPeriod = new Map<number, ReadonlyArray<ApiClass>>()
const classesLoadByStudyPeriod = new Map<
  number,
  Promise<ReadonlyArray<ApiClass>>
>()
const meetingsByStudyPeriod = new Map<number, ReadonlyArray<ApiMeeting>>()
const meetingsLoadByStudyPeriod = new Map<
  number,
  Promise<ReadonlyArray<ApiMeeting>>
>()

async function requestJson<T>(path: string): Promise<T> {
  const response = await dataApiRequest(path)
  await expectApiResponse(response)
  return response.json() as Promise<T>
}

async function listAllPages<T>(path: string): Promise<ReadonlyArray<T>> {
  const data: Array<T> = []
  let page = await requestJson<ApiPage<T>>(path)
  data.push(...page.data)
  while (page._paths?.next) {
    page = await requestJson<ApiPage<T>>(page._paths.next)
    data.push(...page.data)
  }
  return data
}

async function loadCachedStudyPeriods() {
  if (cachedStudyPeriods) return cachedStudyPeriods
  if (!studyPeriodsLoad) {
    studyPeriodsLoad = requestJson<ReadonlyArray<StudyPeriod>>('/study-periods')
  }
  try {
    cachedStudyPeriods = await studyPeriodsLoad
    return cachedStudyPeriods
  } finally {
    studyPeriodsLoad = undefined
  }
}

async function loadCachedCourses() {
  if (cachedCourses) return cachedCourses
  if (!coursesLoad) {
    coursesLoad = requestJson<ApiPage<SemesterCourse>>('/courses').then(
      (page) => page.data,
    )
  }
  try {
    cachedCourses = await coursesLoad
    return cachedCourses
  } finally {
    coursesLoad = undefined
  }
}

async function loadCachedClasses(studyPeriodId: number) {
  const cached = classesByStudyPeriod.get(studyPeriodId)
  if (cached) return cached
  let loading = classesLoadByStudyPeriod.get(studyPeriodId)
  if (!loading) {
    loading = listAllPages<ApiClass>(
      `/classes?studyPeriodId=${studyPeriodId}&page=1&pageSize=1000`,
    )
    classesLoadByStudyPeriod.set(studyPeriodId, loading)
  }
  try {
    const classes = await loading
    classesByStudyPeriod.set(studyPeriodId, classes)
    return classes
  } finally {
    classesLoadByStudyPeriod.delete(studyPeriodId)
  }
}

async function loadCachedMeetings(studyPeriodId: number) {
  const cached = meetingsByStudyPeriod.get(studyPeriodId)
  if (cached) return cached
  let loading = meetingsLoadByStudyPeriod.get(studyPeriodId)
  if (!loading) {
    loading = listAllPages<ApiMeeting>(
      `/class-schedules?studyPeriodId=${studyPeriodId}&page=1&pageSize=1000`,
    )
    meetingsLoadByStudyPeriod.set(studyPeriodId, loading)
  }
  try {
    const meetings = await loading
    meetingsByStudyPeriod.set(studyPeriodId, meetings)
    return meetings
  } finally {
    meetingsLoadByStudyPeriod.delete(studyPeriodId)
  }
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
