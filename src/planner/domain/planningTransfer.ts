import type {
  CurriculumPlannerImport,
  CurriculumPlannerSnapshot,
} from './curriculumPlanner'

export const planningFileFormat = 'pomi-curriculum-planner'
export const planningFileVersion = 2

type PlanningFile = Readonly<{
  format: typeof planningFileFormat
  version: typeof planningFileVersion
  exportedAt: string
  data: CurriculumPlannerImport
}>

export function serializePlanning(
  snapshot: CurriculumPlannerSnapshot,
  exportedAt = new Date(),
): PlanningFile {
  return {
    format: planningFileFormat,
    version: planningFileVersion,
    exportedAt: exportedAt.toISOString(),
    data: {
      selection: snapshot.selection,
      planningStart: snapshot.plan.planningStart,
      periods: snapshot.plan.periods.map((period) => ({
        courses: period.items.map((item) => item.courseId),
      })),
      completedCourses: snapshot.academicRecord.completedCourses.map(
        (completed) => completed.courseId,
      ),
    },
  }
}

function isStringArray(value: unknown): value is ReadonlyArray<string> {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

export function parsePlanning(
  value: unknown,
): CurriculumPlannerImport | undefined {
  if (
    !value ||
    typeof value !== 'object' ||
    !('format' in value) ||
    !('version' in value) ||
    !('data' in value) ||
    value.format !== planningFileFormat ||
    value.version !== planningFileVersion ||
    !value.data ||
    typeof value.data !== 'object'
  )
    return undefined
  const data = value.data as Record<string, unknown>
  if (
    !data.selection ||
    typeof data.selection !== 'object' ||
    !Array.isArray(data.periods) ||
    !isStringArray(data.completedCourses) ||
    !data.periods.every((period) => {
      if (!period || typeof period !== 'object') return false
      const periodData = period as Record<string, unknown>
      return (
        isStringArray(periodData.courses) &&
        (periodData.completedCourses === undefined ||
          isStringArray(periodData.completedCourses))
      )
    })
  )
    return undefined
  return data as CurriculumPlannerImport
}

export function downloadPlanning(snapshot: CurriculumPlannerSnapshot) {
  const blob = new Blob(
    [JSON.stringify(serializePlanning(snapshot), null, 2)],
    {
      type: 'application/json',
    },
  )
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'catalogo-planejamento.json'
  link.click()
  URL.revokeObjectURL(url)
}
