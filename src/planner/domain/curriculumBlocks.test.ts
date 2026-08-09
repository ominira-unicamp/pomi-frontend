import { describe, expect, it } from 'vitest'

import type {
  CatalogProgramId,
  CourseId,
  CurriculumPlannerSnapshot,
  CurriculumPlannerStaticData,
  PlannerRevision,
  PlanningPeriodId,
} from '@/planner/domain/curriculumPlanner'
import { buildCurriculumGroups } from '@/planner/domain/curriculumBlocks'

const course = (id: string, code: string, prefix: string) => ({
  id: id as CourseId,
  code,
  name: code,
  credits: 4,
  prefix,
})

const staticData: CurriculumPlannerStaticData = {
  courses: [
    course('1', 'AB100', 'AB'),
    course('2', 'AB200', 'AB'),
    course('3', 'CD100', 'CD'),
  ],
  catalogPrograms: [
    {
      id: 'program' as CatalogProgramId,
      title: 'Programa',
      catalog: { id: 'catalog' as never, year: 2026 },
      program: { id: 'course-program' as never, code: '1', name: 'Programa' },
      baseBlocks: {
        mandatory: [
          {
            type: 'course',
            source: { type: 'base' },
            selector: { type: 'specificCourse', courseId: '1' as CourseId },
          },
        ],
        electives: [
          {
            type: 'electiveCredits',
            source: { type: 'base' },
            requiredCredits: 4,
            eligibleCourses: [{ type: 'prefix', prefix: 'AB' }],
          },
        ],
      },
      specializations: [
        {
          id: 'specialization' as never,
          code: 'S',
          name: 'Sistemas',
          blocks: {
            mandatory: [
              {
                type: 'course',
                source: {
                  type: 'specialization',
                  specializationId: 'specialization' as never,
                },
                selector: { type: 'specificCourse', courseId: '3' as CourseId },
              },
            ],
            electives: [],
          },
        },
      ],
      languages: [],
    },
  ],
}

const snapshot: CurriculumPlannerSnapshot = {
  revision: 'revision' as PlannerRevision,
  selection: {
    catalogProgramId: 'program' as CatalogProgramId,
    specializationId: 'specialization' as never,
  },
  plan: {
    periods: [
      {
        id: 'period' as PlanningPeriodId,
        items: [{ type: 'course', courseId: '2' as CourseId }],
      },
    ],
  },
  academicRecord: { completedCourses: [{ courseId: '1' as CourseId }] },
}

describe('buildCurriculumGroups', () => {
  it('builds base and selected habilitation while hiding completed and planned courses', () => {
    const groups = buildCurriculumGroups(staticData, snapshot)

    expect(groups.map((group) => group.title)).toEqual([
      'Base',
      'Habilitação · S — Sistemas',
    ])
    expect(groups[0].mandatory?.courses).toEqual([])
    expect(groups[0].electives[0].selectorLabels).toEqual(['AB'])
    expect(groups[0].electives[0].courses).toEqual([])
    expect(groups[1].mandatory?.courses[0].course.code).toBe('CD100')
  })
})
