import { describe, expect, it } from 'vitest'

import { parsePlanning, serializePlanning } from './planningTransfer'
import type {
  CatalogProgramId,
  CourseId,
  CurriculumPlannerSnapshot,
  PlannerRevision,
  PlanningPeriodId,
} from './curriculumPlanner'

const snapshot = {
  revision: 'revision' as PlannerRevision,
  selection: { catalogProgramId: 'program' as CatalogProgramId },
  plan: {
    planningStart: { year: 2026, semester: 1 as const, semesterNumber: 3 },
    periods: [
      {
        id: 'period' as PlanningPeriodId,
        items: [{ type: 'course', courseId: 'planned' as CourseId }],
      },
    ],
  },
  academicRecord: {
    completedCourses: [{ courseId: 'completed' as CourseId }],
  },
} satisfies CurriculumPlannerSnapshot

describe('planning transfer', () => {
  it('serializes and parses the versioned planning format', () => {
    const file = serializePlanning(snapshot, new Date('2026-08-09T12:00:00Z'))
    expect(file.exportedAt).toBe('2026-08-09T12:00:00.000Z')
    expect(parsePlanning(file)).toEqual(file.data)
  })

  it('rejects unknown versions and malformed periods', () => {
    expect(
      parsePlanning({
        ...serializePlanning(snapshot),
        version: 3,
      }),
    ).toBeUndefined()
    expect(
      parsePlanning({
        format: 'pomi-curriculum-planner',
        version: 2,
        data: {
          selection: {},
          periods: [{ courses: [1] }],
          completedCourses: [],
        },
      }),
    ).toBeUndefined()
  })
})
