import type {
  CurriculumPlannerState,
  PlanningPeriodId,
} from '@/planner/domain/curriculumPlanner'
import { apiRequest } from '@/api/client'
import {
  createStudentCourseAttempt,
  deleteStudentCourseAttempt,
  listStudentCourseAttempts,
} from '@/student/data/studentApi'

export {
  createStudentCourseAttempt,
  deleteStudentCourseAttempt,
  getCurrentStudent,
  getStudentProfile,
  listStudentCourseAttempts,
  listStudyPeriods,
  patchStudentCourseAttempt,
  patchStudentProfile,
  registerCurrentStudent,
} from '@/student/data/studentApi'
export type {
  StudentCourseAttempt,
  StudentProfile,
  StudyPeriod,
} from '@/student/data/studentApi'

export type CurriculumDocument = Readonly<{
  id?: number
  name: string
  selection: {
    catalogProgramId: string | null
    specializationId: string | null
    languageId: string | null
  }
  planningStart: {
    year: number
    semester: 1 | 2
    semesterNumber: number
  } | null
  currentPeriodId: string | null
  periods: ReadonlyArray<{ id: string; position: number }>
  courses: ReadonlyArray<{ courseId: string; periodId: string | null }>
}>

export type CurriculumSummary = Readonly<{ id: number; name: string }>

async function requestJson<T>(
  path: string,
  getAccessToken: () => Promise<string>,
  init?: RequestInit,
): Promise<T> {
  const response = await apiRequest(path, getAccessToken, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!response.ok) throw new Error(`API request failed: ${response.status}`)
  return (await response.json()) as T
}

export async function listCurricula(
  studentId: number,
  getAccessToken: () => Promise<string>,
) {
  const summaries = await requestJson<
    ReadonlyArray<Partial<CurriculumSummary>>
  >(`/student/${studentId}/curricula`, getAccessToken)
  return summaries
    .filter((summary) => Number.isInteger(summary.id))
    .map((summary) => ({
      id: summary.id!,
      name:
        typeof summary.name === 'string' && summary.name.trim()
          ? summary.name
          : `Planejamento ${summary.id!}`,
    }))
}

export async function getCurriculum(
  studentId: number,
  curriculumId: number,
  getAccessToken: () => Promise<string>,
) {
  return requestJson<CurriculumDocument>(
    `/student/${studentId}/curricula/${curriculumId}`,
    getAccessToken,
  )
}

export async function createCurriculum(
  studentId: number,
  document: CurriculumDocument,
  getAccessToken: () => Promise<string>,
) {
  return requestJson<CurriculumDocument>(
    `/student/${studentId}/curricula`,
    getAccessToken,
    { method: 'POST', body: JSON.stringify(toCreateBody(document)) },
  )
}

export async function patchCurriculum(
  studentId: number,
  curriculumId: number,
  body: Record<string, unknown>,
  getAccessToken: () => Promise<string>,
) {
  return requestJson<CurriculumDocument>(
    `/student/${studentId}/curricula/${curriculumId}`,
    getAccessToken,
    { method: 'PATCH', body: JSON.stringify(body) },
  )
}

export async function deleteCurriculum(
  studentId: number,
  curriculumId: number,
  getAccessToken: () => Promise<string>,
) {
  const response = await apiRequest(
    `/student/${studentId}/curricula/${curriculumId}`,
    getAccessToken,
    { method: 'DELETE' },
  )
  if (!response.ok) throw new Error(`API request failed: ${response.status}`)
}

export async function listCompletedCourses(
  studentId: number,
  getAccessToken: () => Promise<string>,
) {
  const attempts = await listStudentCourseAttempts(studentId, getAccessToken)
  return [
    ...new Set(
      attempts
        .filter((attempt) => attempt.status === 'COMPLETED')
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
      attempt.courseId === Number(courseId) && attempt.status === 'COMPLETED',
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
      status: 'COMPLETED',
      grade: completion?.grade ?? null,
    },
    getAccessToken,
  )
}

function toCreateBody(document: CurriculumDocument) {
  return {
    name: document.name,
    selection: {
      catalogProgramId: toNumberOrNull(document.selection.catalogProgramId),
      catalogSpecializationId: toNumberOrNull(
        document.selection.specializationId,
      ),
      catalogLanguageId: toNumberOrNull(document.selection.languageId),
    },
    planningStart: document.planningStart,
    currentPeriodId: toNumberOrNull(document.currentPeriodId),
    periods: document.periods.map((period) => ({ position: period.position })),
    courses: document.courses.map((course) => ({
      courseId: Number(course.courseId),
      periodId: toNumberOrNull(course.periodId),
    })),
  }
}

function toNumberOrNull(value: string | null | undefined) {
  if (value === null || value === undefined) return null
  const number = Number(value)
  return Number.isInteger(number) ? number : null
}

export function documentFromState(
  state: CurriculumPlannerState,
  name = 'Meu planejamento',
): CurriculumDocument {
  const periods = state.plan.periods.map((period, index) => ({
    id: period.id,
    position: index + 1,
  }))
  const courses = [
    ...state.plan.periods.flatMap((period) =>
      period.items.map((item) => ({
        courseId: item.courseId,
        periodId: period.id,
      })),
    ),
    ...(state.plan.unallocatedCourseIds ?? []).map((courseId) => ({
      courseId,
      periodId: null,
    })),
  ]
  return {
    name,
    selection: {
      catalogProgramId: state.selection.catalogProgramId ?? null,
      specializationId: state.selection.specializationId ?? null,
      languageId: state.selection.languageId ?? null,
    },
    planningStart: state.plan.planningStart
      ? {
          year: state.plan.planningStart.year,
          semester: state.plan.planningStart.semester,
          semesterNumber: state.plan.planningStart.semesterNumber ?? 1,
        }
      : null,
    currentPeriodId: state.plan.currentPeriodId ?? null,
    periods,
    courses,
  }
}

export function stateFromDocument(
  document: CurriculumDocument,
  completedCourseIds: ReadonlyArray<string> = [],
): CurriculumPlannerState {
  const periods = Array.isArray(document.periods) ? document.periods : []
  const courses = Array.isArray(document.courses) ? document.courses : []
  const selection = (document as Partial<CurriculumDocument>).selection ?? {
    catalogProgramId: null,
    specializationId: null,
    languageId: null,
  }
  const periodIds = new Set(periods.map((period) => String(period.id)))
  const coursesByPeriod = new Map<string, Array<string>>()
  for (const course of courses) {
    if (course.periodId === null) continue
    const periodId = String(course.periodId)
    if (!periodIds.has(periodId)) continue
    const periodCourses = coursesByPeriod.get(periodId) ?? []
    periodCourses.push(String(course.courseId))
    coursesByPeriod.set(periodId, periodCourses)
  }
  const unallocatedCourseIds = courses
    .filter((course) => course.periodId === null)
    .map((course) => String(course.courseId))
  return {
    revision: crypto.randomUUID() as CurriculumPlannerState['revision'],
    selection: {
      ...(selection.catalogProgramId !== null
        ? { catalogProgramId: String(selection.catalogProgramId) as never }
        : {}),
      ...(selection.specializationId !== null
        ? { specializationId: String(selection.specializationId) as never }
        : {}),
      ...(selection.languageId !== null
        ? { languageId: String(selection.languageId) as never }
        : {}),
    },
    plan: {
      planningStart: document.planningStart ?? undefined,
      currentPeriodId:
        document.currentPeriodId !== null
          ? (String(document.currentPeriodId) as PlanningPeriodId)
          : undefined,
      periods: periods
        .slice()
        .sort((left, right) => left.position - right.position)
        .map((period) => ({
          id: String(period.id) as PlanningPeriodId,
          items: (coursesByPeriod.get(String(period.id)) ?? []).map(
            (courseId) => ({
              type: 'course' as const,
              courseId: courseId as never,
            }),
          ),
        })),
      unallocatedCourseIds: unallocatedCourseIds as never,
    },
    academicRecord: {
      completedCourses: completedCourseIds.map((courseId) => ({
        courseId: courseId as never,
      })),
    },
  }
}

export function patchBodyFromState(
  previous: CurriculumDocument | undefined,
  state: CurriculumPlannerState,
) {
  const next = documentFromState(state, previous?.name)
  const previousPeriods = previous?.periods ?? []
  const previousById = new Map(
    previousPeriods.map((period) => [String(period.id), period]),
  )
  const nextIds = new Set(next.periods.map((period) => period.id))
  const update = next.periods
    .filter((period) => previousById.has(period.id))
    .map((period) => ({ id: Number(period.id), position: period.position }))
    .filter((period) => Number.isInteger(period.id))
  const add = next.periods
    .filter((period) => !previousById.has(period.id))
    .map((period) => ({ position: period.position }))
  const remove = previousPeriods
    .filter((period) => !nextIds.has(String(period.id)))
    .map((period) => Number(period.id))
    .filter(Number.isInteger)
  const nextCourseIds = new Set(
    next.courses.map((course) => String(course.courseId)),
  )
  const previousCourseIds = (previous?.courses ?? [])
    .map((course) => Number(course.courseId))
    .filter((courseId) => Number.isInteger(courseId))
  const courseRemove = previousCourseIds.filter(
    (courseId) => !nextCourseIds.has(String(courseId)),
  )
  return {
    name: next.name,
    selection: {
      catalogProgramId: toNumberOrNull(next.selection.catalogProgramId),
      catalogSpecializationId: toNumberOrNull(next.selection.specializationId),
      catalogLanguageId: toNumberOrNull(next.selection.languageId),
    },
    planningStart: next.planningStart,
    currentPeriodId: toNumberOrNull(next.currentPeriodId),
    periods: { add, update, remove },
    courses: {
      upsert: next.courses.map((course) => ({
        courseId: Number(course.courseId),
        periodId: toNumberOrNull(course.periodId),
      })),
      ...(courseRemove.length ? { remove: courseRemove } : {}),
    },
  }
}
