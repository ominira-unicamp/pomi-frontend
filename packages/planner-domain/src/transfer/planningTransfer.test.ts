import { describe, expect, it } from 'vitest'

import {
  parsePlanning,
  resolvePlanningImport,
  serializePlanning,
} from './planningTransfer'
import type {
  CatalogProgramId,
  CourseId,
  CurriculumPlannerSnapshot,
  CurriculumPlannerStaticData,
  PlannerRevision,
  PlanningPeriodId,
} from '../curriculum/curriculumPlanner'

const catalogProgramId = '15' as CatalogProgramId
const courseId = '123' as CourseId
const staticData: CurriculumPlannerStaticData = {
  catalogPrograms: [
    {
      id: catalogProgramId,
      title: 'Ciência da Computação',
      catalog: { id: '3' as never, year: 2023 },
      program: { id: '42' as never, code: '42', name: 'Ciência da Computação' },
      baseBlocks: { mandatory: [], electives: [] },
      specializations: [],
      languages: [],
    },
  ],
  courses: [{ id: courseId, code: 'MA111', name: 'Cálculo I', credits: 6 }],
}
const snapshot = {
  revision: 'revision' as PlannerRevision,
  selection: { catalogProgramId },
  plan: {
    planningStart: { year: 2026, semester: 1 as const, semesterNumber: 3 },
    currentPeriodId: '101' as PlanningPeriodId,
    periods: [
      {
        id: '101' as PlanningPeriodId,
        items: [{ type: 'course', courseId }],
      },
    ],
  },
  academicRecord: { completedCourses: [{ courseId }] },
} satisfies CurriculumPlannerSnapshot

describe('planning transfer', () => {
  it('serializes the API-shaped v1 format without completed courses', () => {
    const file = serializePlanning(snapshot, staticData, {
      exportedAt: new Date('2026-08-09T12:00:00Z'),
      name: 'Meu planejamento',
    })
    expect(file.exportedAt).toBe('2026-08-09T12:00:00.000Z')
    expect(file.curriculum).not.toHaveProperty('completedCourses')
    expect(file.curriculum.courses).toEqual([
      {
        courseId: 123,
        periodId: 101,
        periodPosition: 1,
        code: 'MA111',
        name: 'Cálculo I',
        credits: 6,
      },
    ])
    expect(parsePlanning(file)).toEqual(file)
  })

  it('resolves codes when source ids differ', () => {
    const file = serializePlanning(snapshot, staticData)
    const targetData: CurriculumPlannerStaticData = {
      ...staticData,
      catalogPrograms: [
        { ...staticData.catalogPrograms[0], id: '99' as never },
      ],
      courses: [{ ...staticData.courses[0], id: '999' as never }],
    }
    const resolved = resolvePlanningImport(file, targetData)
    expect(resolved.data.selection.catalogProgramId).toBe('99')
    expect(resolved.data.periods[0].courses).toEqual(['999'])
    expect(resolved.data.currentPeriodPosition).toBe(1)
  })

  it('rejects unknown versions and malformed periods', () => {
    expect(
      parsePlanning({ ...serializePlanning(snapshot, staticData), version: 2 }),
    ).toBeUndefined()
    expect(
      parsePlanning({
        format: 'pomi-curriculum-planner',
        version: 1,
        exportedAt: new Date().toISOString(),
        curriculum: { selection: {}, periods: [{ position: 0 }], courses: [] },
      }),
    ).toBeUndefined()
  })
})
