import { describe, expect, it } from 'vitest'

import {
  insertCourseInPeriod,
  periodReference,
  periodTitle,
} from './planningPeriods'
import type {
  CourseId,
  PlanningPeriod,
  PlanningPeriodId,
} from './curriculumPlanner'

const firstPeriod = {
  id: 'first' as PlanningPeriodId,
  items: [{ type: 'course', courseId: 'course' as CourseId }],
} satisfies PlanningPeriod
const secondPeriod = {
  id: 'second' as PlanningPeriodId,
  items: [],
} satisfies PlanningPeriod

describe('planning periods', () => {
  it('computes labels from the configured curricular semester', () => {
    const start = { year: 2026, semester: 2 as const, semesterNumber: 4 }
    expect(periodTitle(0, start)).toBe('4º sem - 2s2026')
    expect(periodTitle(1, start)).toBe('5º sem - 1s2027')
    expect(
      periodReference(secondPeriod, [firstPeriod, secondPeriod], start),
    ).toBe('5º sem - 1s2027')
  })

  it('chooses add or move based on the existing plan', () => {
    expect(
      insertCourseInPeriod('course' as CourseId, secondPeriod.id, [
        firstPeriod,
        secondPeriod,
      ]),
    ).toEqual({
      type: 'moveCourseToPeriod',
      courseId: 'course',
      periodId: 'second',
    })
    expect(
      insertCourseInPeriod('new-course' as CourseId, secondPeriod.id, [
        firstPeriod,
        secondPeriod,
      ]),
    ).toEqual({
      type: 'addCourseToPeriod',
      courseId: 'new-course',
      periodId: 'second',
    })
  })
})
