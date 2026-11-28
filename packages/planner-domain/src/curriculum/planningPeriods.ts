import type {
  Course,
  CurriculumPlannerCommand,
  CurriculumPlannerSnapshot,
  PlanningPeriod,
  PlanningPeriodId,
} from './curriculumPlanner'

export function orderedPeriods(plan: CurriculumPlannerSnapshot['plan']) {
  return plan.periods
}

export function periodTitle(
  index: number,
  start: CurriculumPlannerSnapshot['plan']['planningStart'],
) {
  if (!start) return `${index + 1}º sem`
  const offset = start.semester - 1 + index
  return `${(start.semesterNumber ?? 1) + index}º sem - ${(offset % 2) + 1}s${start.year + Math.floor(offset / 2)}`
}

export function periodReference(
  period: PlanningPeriod,
  periods: ReadonlyArray<PlanningPeriod>,
  start: CurriculumPlannerSnapshot['plan']['planningStart'],
) {
  const index = periods.findIndex((candidate) => candidate.id === period.id)
  return periodTitle(index === -1 ? 0 : index, start)
}

export function insertCourseInPeriod(
  courseId: Course['id'],
  periodId: PlanningPeriodId,
  periods: ReadonlyArray<PlanningPeriod>,
): CurriculumPlannerCommand {
  const sourcePeriod = periods.find((period) =>
    period.items.some((item) => item.courseId === courseId),
  )
  return sourcePeriod
    ? { type: 'moveCourseToPeriod', courseId, periodId }
    : { type: 'addCourseToPeriod', courseId, periodId }
}
