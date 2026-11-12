import type { CurriculumPlannerState } from '@pomi/planner-domain/curriculum'
import type { SemesterPlanningDocument } from '@pomi/planner-domain/semester'

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isId(value: unknown) {
  return value === null || (typeof value === 'number' && Number.isFinite(value))
}

export function isCurriculumDraft(
  value: unknown,
): value is CurriculumPlannerState {
  if (
    !isRecord(value) ||
    typeof value.revision !== 'string' ||
    !isRecord(value.selection) ||
    !isRecord(value.plan) ||
    !Array.isArray(value.plan.periods) ||
    !isRecord(value.academicRecord) ||
    !Array.isArray(value.academicRecord.completedCourses)
  )
    return false
  if (
    !Object.values(value.selection).every(
      (item) => item === undefined || typeof item === 'string',
    )
  )
    return false
  if (
    value.plan.unallocatedCourseIds !== undefined &&
    (!Array.isArray(value.plan.unallocatedCourseIds) ||
      !value.plan.unallocatedCourseIds.every((id) => typeof id === 'string'))
  )
    return false
  if (
    value.plan.currentPeriodId !== undefined &&
    typeof value.plan.currentPeriodId !== 'string'
  )
    return false
  if (value.plan.planningStart !== undefined) {
    const start = value.plan.planningStart
    if (
      !isRecord(start) ||
      typeof start.year !== 'number' ||
      !Number.isInteger(start.year) ||
      start.year < 1900 ||
      start.year > 9999 ||
      (start.semester !== 1 && start.semester !== 2) ||
      (start.semesterNumber !== undefined &&
        (typeof start.semesterNumber !== 'number' ||
          !Number.isInteger(start.semesterNumber) ||
          start.semesterNumber < 1))
    )
      return false
  }
  return (
    value.plan.periods.every(
      (period) =>
        isRecord(period) &&
        typeof period.id === 'string' &&
        Array.isArray(period.items) &&
        period.items.every(
          (item) =>
            isRecord(item) &&
            item.type === 'course' &&
            typeof item.courseId === 'string',
        ),
    ) &&
    value.academicRecord.completedCourses.every(
      (course) => isRecord(course) && typeof course.courseId === 'string',
    )
  )
}

export function isSemesterDraft(
  value: unknown,
): value is SemesterPlanningDocument {
  if (
    !isRecord(value) ||
    typeof value.name !== 'string' ||
    !isId(value.studyPeriodId) ||
    !isId(value.curriculumId) ||
    !Array.isArray(value.classIds) ||
    !value.classIds.every(
      (id) => typeof id === 'number' && Number.isFinite(id),
    ) ||
    !isRecord(value.guide)
  )
    return false
  const guide = value.guide
  if (
    !['curriculum', 'program', 'none'].includes(String(guide.mode)) ||
    !isRecord(guide.curriculum) ||
    !isRecord(guide.program) ||
    !Array.isArray(guide.manualCourseIds) ||
    !guide.manualCourseIds.every(
      (id) => typeof id === 'number' && Number.isFinite(id),
    )
  )
    return false
  return (
    [null, 'saved', 'suggestion'].includes(
      guide.curriculum.source as null | string,
    ) &&
    ['curriculumId', 'suggestionId', 'suggestionCatalogProgramId'].every(
      (key) => isId((guide.curriculum as Record<string, unknown>)[key]),
    ) &&
    ['catalogProgramId', 'catalogProgramVariantId', 'languageId'].every((key) =>
      isId((guide.program as Record<string, unknown>)[key]),
    )
  )
}
