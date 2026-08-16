import type {
  CurriculumPlannerState,
  PlanningPeriodId,
} from '@pomi/planner-domain/curriculum'
import { appApiRequest } from '@/api/client'
import { expectApiResponse } from '@/api/errors'

type CurriculumApiEntity = Readonly<{
  id: number
  studentId: number
  name: string
  isFavorite: boolean
  selection: Readonly<{
    catalogProgramId: number | null
    catalogSpecializationId: number | null
    catalogLanguageId: number | null
  }>
  planningStart: CurriculumDocument['planningStart']
  currentPeriodId: number | null
  periods: ReadonlyArray<{ id: number; position: number }>
  courses: ReadonlyArray<{
    courseId: number
    periodId: number | null
    code: string
    name: string
    credits: number
  }>
  createdAt: string
  updatedAt: string
}>

type CurriculumSummaryApiEntity = Readonly<{
  id: number
  name: string
  isFavorite: boolean
  selection: CurriculumApiEntity['selection']
  createdAt: string
  updatedAt: string
}>

export type CurriculumDocument = Readonly<{
  id?: number
  name: string
  isFavorite: boolean
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

export type CurriculumSummary = Readonly<{
  id: number
  name: string
  isFavorite: boolean
  selection: Readonly<{
    catalogProgramId: number | null
    catalogSpecializationId: number | null
    catalogLanguageId: number | null
  }>
  createdAt?: string
  updatedAt?: string
}>

async function requestJson<T>(
  path: string,
  getAccessToken: () => Promise<string>,
  init?: RequestInit,
): Promise<T> {
  const response = await appApiRequest(path, getAccessToken, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  await expectApiResponse(response)
  return (await response.json()) as T
}

function documentFromApi(entity: CurriculumApiEntity): CurriculumDocument {
  return {
    id: entity.id,
    name: entity.name,
    isFavorite: entity.isFavorite,
    selection: {
      catalogProgramId: toStringOrNull(entity.selection.catalogProgramId),
      specializationId: toStringOrNull(
        entity.selection.catalogSpecializationId,
      ),
      languageId: toStringOrNull(entity.selection.catalogLanguageId),
    },
    planningStart: entity.planningStart,
    currentPeriodId: toStringOrNull(entity.currentPeriodId),
    periods: entity.periods.map((period) => ({
      id: String(period.id),
      position: period.position,
    })),
    courses: entity.courses.map((course) => ({
      courseId: String(course.courseId),
      periodId: toStringOrNull(course.periodId),
    })),
  }
}

export async function listCurricula(
  studentId: number,
  getAccessToken: () => Promise<string>,
) {
  const summaries = await requestJson<ReadonlyArray<CurriculumSummaryApiEntity>>(
    `/student/${studentId}/curricula`,
    getAccessToken,
  )
  return summaries
    .map((summary) => ({
      id: summary.id,
      name:
        typeof summary.name === 'string' && summary.name.trim()
          ? summary.name
          : 'Currículo sem nome',
      isFavorite: summary.isFavorite === true,
      selection: {
        catalogProgramId:
          typeof summary.selection.catalogProgramId === 'number'
            ? summary.selection.catalogProgramId
            : null,
        catalogSpecializationId:
          typeof summary.selection.catalogSpecializationId === 'number'
            ? summary.selection.catalogSpecializationId
            : null,
        catalogLanguageId:
          typeof summary.selection.catalogLanguageId === 'number'
            ? summary.selection.catalogLanguageId
            : null,
      },
      createdAt:
        typeof summary.createdAt === 'string' ? summary.createdAt : undefined,
      updatedAt:
        typeof summary.updatedAt === 'string' ? summary.updatedAt : undefined,
    }))
}

export async function getCurriculum(
  studentId: number,
  curriculumId: number,
  getAccessToken: () => Promise<string>,
) {
  const entity = await requestJson<CurriculumApiEntity>(
    `/student/${studentId}/curricula/${curriculumId}`,
    getAccessToken,
  )
  return documentFromApi(entity)
}

export async function createCurriculum(
  studentId: number,
  document: CurriculumDocument,
  getAccessToken: () => Promise<string>,
) {
  const entity = await requestJson<CurriculumApiEntity>(
    `/student/${studentId}/curricula`,
    getAccessToken,
    { method: 'POST', body: JSON.stringify(toCreateBody(document)) },
  )
  return documentFromApi(entity)
}

export async function patchCurriculum(
  studentId: number,
  curriculumId: number,
  body: Record<string, unknown>,
  getAccessToken: () => Promise<string>,
) {
  const entity = await requestJson<CurriculumApiEntity>(
    `/student/${studentId}/curricula/${curriculumId}`,
    getAccessToken,
    { method: 'PATCH', body: JSON.stringify(body) },
  )
  return documentFromApi(entity)
}

export async function deleteCurriculum(
  studentId: number,
  curriculumId: number,
  getAccessToken: () => Promise<string>,
) {
  const response = await appApiRequest(
    `/student/${studentId}/curricula/${curriculumId}`,
    getAccessToken,
    { method: 'DELETE' },
  )
  await expectApiResponse(response)
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

function toStringOrNull(value: number | null | undefined) {
  return value === null || value === undefined ? null : String(value)
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
    isFavorite: false,
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
