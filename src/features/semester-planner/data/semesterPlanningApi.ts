import type {
  ClassMeeting,
  SemesterClass,
  SemesterCourse,
  SemesterPlannerStaticData,
  SemesterPlanningGuide,
  StudyPeriod,
} from '@pomi/planner-domain/semester'

import { pomiApi } from '@/api/client'
import { publicStaticDataCache } from '@/lib/publicStaticDataCache'

type ApiClass = Readonly<{
  id: number
  code: string
  courseId: number
  courseCode: string
  professors: ReadonlyArray<Readonly<{ id: number; name: string }>>
}>

export type ProfessorEvaluationSummary = Readonly<{
  professor: Readonly<{ id: number; name: string }>
  responseCount: number
  wouldTakeAgain: number
  fairness: number
  clarity: number
  difficulty: number
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
let cachedProfessorEvaluationSummaries:
  | ReadonlyArray<ProfessorEvaluationSummary>
  | undefined
let professorEvaluationSummariesLoad:
  | Promise<ReadonlyArray<ProfessorEvaluationSummary>>
  | undefined
let professorEvaluationSummariesCacheLoaded = false
let professorEvaluationSummariesRefreshed = false

const studyPeriodsCacheKey = 'semester-planner:study-periods'
const coursesCacheKey = 'semester-planner:courses'
const classesCachePrefix = 'semester-planner:classes:v2:'
const meetingsCachePrefix = 'semester-planner:meetings:'
const professorEvaluationSummariesCacheKey =
  'semester-planner:professor-evaluation-summaries'
const cachedStudyPeriodLimit = 2

function refreshInBackground(operation: Promise<unknown>) {
  void operation.catch(() => undefined)
}

async function refreshStudyPeriods() {
  studyPeriodsRefreshed = true
  if (!studyPeriodsLoad) {
    studyPeriodsLoad = pomiApi.semesterPlanning
      .listStudyPeriods()
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
    coursesLoad = pomiApi.semesterPlanning
      .listCourses()
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
    loading = pomiApi.semesterPlanning
      .listClasses(studyPeriodId)
      .then(async (classes) => {
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
    loading = pomiApi.semesterPlanning
      .listMeetings(studyPeriodId)
      .then(async (meetings) => {
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

async function refreshProfessorEvaluationSummaries() {
  professorEvaluationSummariesRefreshed = true
  if (!professorEvaluationSummariesLoad) {
    professorEvaluationSummariesLoad = pomiApi.semesterPlanning
      .listProfessorEvaluationSummaries()
      .then(async (summaries) => {
        cachedProfessorEvaluationSummaries = summaries
        await publicStaticDataCache.write(
          professorEvaluationSummariesCacheKey,
          summaries,
        )
        return summaries
      })
      .finally(() => {
        professorEvaluationSummariesLoad = undefined
      })
  }
  return professorEvaluationSummariesLoad
}

export async function loadProfessorEvaluationSummaries() {
  if (cachedProfessorEvaluationSummaries) {
    if (!professorEvaluationSummariesRefreshed)
      refreshInBackground(refreshProfessorEvaluationSummaries())
    return cachedProfessorEvaluationSummaries
  }
  if (!professorEvaluationSummariesCacheLoaded) {
    professorEvaluationSummariesCacheLoaded = true
    const cached = await publicStaticDataCache.read<
      ReadonlyArray<ProfessorEvaluationSummary>
    >(professorEvaluationSummariesCacheKey)
    if (cached) {
      cachedProfessorEvaluationSummaries = cached
      if (!professorEvaluationSummariesRefreshed)
        refreshInBackground(refreshProfessorEvaluationSummaries())
      return cached
    }
  }
  return refreshProfessorEvaluationSummaries()
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
        professors: item.professors,
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
  studyPeriodYear: number
  studyPeriodYearPeriod: StudyPeriod['yearPeriod']
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

export type SemesterPlanningVisibility = 'PRIVATE' | 'FRIENDS' | 'PUBLIC'

type PlanningGuideInput = SemesterPlanningGuide

export function listSemesterPlannings(
  studentId: number,
  getAccessToken: () => Promise<string>,
) {
  return pomiApi.semesterPlanning.listSemesterPlannings(
    studentId,
    getAccessToken,
  )
}

export function getSemesterPlanning(
  studentId: number,
  planId: number,
  getAccessToken: () => Promise<string>,
) {
  return pomiApi.semesterPlanning.getSemesterPlanning(
    studentId,
    planId,
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
  return pomiApi.semesterPlanning.createSemesterPlanning(
    studentId,
    document,
    getAccessToken,
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
  return pomiApi.semesterPlanning.patchSemesterPlanning(
    studentId,
    planId,
    document,
    getAccessToken,
  )
}

export function updateSemesterPlanningVisibility(
  studentId: number,
  planId: number,
  visibility: SemesterPlanningVisibility,
  getAccessToken: () => Promise<string>,
) {
  return pomiApi.semesterPlanning.updateSemesterPlanningVisibility(
    studentId,
    planId,
    visibility,
    getAccessToken,
  )
}

export function deleteSemesterPlanning(
  studentId: number,
  planId: number,
  getAccessToken: () => Promise<string>,
) {
  return pomiApi.semesterPlanning.deleteSemesterPlanning(
    studentId,
    planId,
    getAccessToken,
  )
}
