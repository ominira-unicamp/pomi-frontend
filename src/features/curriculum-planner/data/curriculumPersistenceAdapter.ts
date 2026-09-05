import type { CurriculumPlannerState } from '@pomi/planner-domain/curriculum'
import type { CurriculumDocument } from '@/features/curriculum-planner/data/curriculumPersistenceApi'
import {
  createCurriculum,
  documentFromState,
  patchBodyFromState,
  patchCurriculum,
} from '@/features/curriculum-planner/data/curriculumPersistenceApi'

function coursesForDocument(
  document: CurriculumDocument,
  persisted: CurriculumDocument,
) {
  const periodIdByPosition = new Map(
    persisted.periods.map((period) => [period.position, Number(period.id)]),
  )
  return document.courses.map((course) => {
    const period = document.periods.find((item) => item.id === course.periodId)
    return {
      courseId: Number(course.courseId),
      periodId: period ? (periodIdByPosition.get(period.position) ?? null) : null,
    }
  })
}

function withPersistedPeriodIds(
  state: CurriculumPlannerState,
  periodIds: ReadonlyMap<string, number> | undefined,
): CurriculumPlannerState {
  if (!periodIds?.size) return state
  const persistedId = (periodId: string) =>
    String(periodIds.get(periodId) ?? periodId)
  return {
    ...state,
    plan: {
      ...state.plan,
      currentPeriodId: state.plan.currentPeriodId
        ? (persistedId(state.plan.currentPeriodId) as never)
        : undefined,
      periods: state.plan.periods.map((period) => ({
        ...period,
        id: persistedId(period.id) as never,
      })),
    },
  }
}

export async function persistCurriculumState({
  studentId,
  current,
  state,
  periodIds,
  name,
  getAccessToken,
}: {
  studentId: number
  current?: CurriculumDocument
  state: CurriculumPlannerState
  periodIds?: ReadonlyMap<string, number>
  name?: string
  getAccessToken: () => Promise<string>
}): Promise<CurriculumDocument> {
  if (!current) {
    const draft = documentFromState(state, name)
    const created = await createCurriculum(studentId, draft, getAccessToken)
    return patchCurriculum(
      studentId,
      created.id!,
      { courses: { upsert: coursesForDocument(draft, created) } },
      getAccessToken,
    )
  }
  const persistedState = withPersistedPeriodIds(state, periodIds)
  const updated = await patchCurriculum(
    studentId,
    current.id!,
    patchBodyFromState(current, persistedState),
    getAccessToken,
  )
  const document = documentFromState(persistedState, current.name)
  return patchCurriculum(
    studentId,
    updated.id!,
    { courses: { upsert: coursesForDocument(document, updated) } },
    getAccessToken,
  )
}
