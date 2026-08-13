import type { CurriculumPlannerState } from '@pomi/planner-domain/curriculum'
import type { CurriculumDocument } from '@/planner/data/curriculumPersistenceApi'
import {
  createCurriculum,
  documentFromState,
  patchBodyFromState,
  patchCurriculum,
} from '@/planner/data/curriculumPersistenceApi'

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

export async function persistCurriculumState({
  studentId,
  current,
  state,
  name,
  getAccessToken,
}: {
  studentId: number
  current?: CurriculumDocument
  state: CurriculumPlannerState
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
  const updated = await patchCurriculum(
    studentId,
    current.id!,
    patchBodyFromState(current, state),
    getAccessToken,
  )
  const document = documentFromState(state, current.name)
  return patchCurriculum(
    studentId,
    updated.id!,
    { courses: { upsert: coursesForDocument(document, updated) } },
    getAccessToken,
  )
}
