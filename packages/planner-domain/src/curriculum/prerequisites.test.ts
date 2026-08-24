import { describe, expect, it } from 'vitest'

import {
  evaluatePrerequisites,
  prerequisiteAlternativeKey,
} from './prerequisites'
import type {
  Course,
  CourseId,
  CurriculumPlannerSnapshot,
  PlannerRevision,
  PlanningPeriodId,
} from './curriculumPlanner'
import type { CoursePrerequisiteRule, PrerequisiteItem } from './prerequisites'

const course = (id: string, code: string): Course => ({
  id: id as CourseId,
  code,
  name: code,
  credits: 4,
  prefix: code.slice(0, 2),
})

const courses = [
  course('1', 'MA111'),
  course('2', 'MA141'),
  course('3', 'MC102'),
  course('4', 'MA211'),
]

const snapshot: CurriculumPlannerSnapshot = {
  revision: 'revision' as PlannerRevision,
  selection: {},
  plan: {
    periods: [
      {
        id: 'first' as PlanningPeriodId,
        items: [{ type: 'course', courseId: '1' as CourseId }],
      },
      {
        id: 'second' as PlanningPeriodId,
        items: [
          { type: 'course', courseId: '3' as CourseId },
          { type: 'course', courseId: '4' as CourseId },
        ],
      },
    ],
  },
  academicRecord: { completedCourses: [{ courseId: '2' as CourseId }] },
}

function alternative(allOf: ReadonlyArray<PrerequisiteItem>) {
  return { key: prerequisiteAlternativeKey(allOf), allOf }
}

const firstAlternative = alternative([
  {
    kind: 'FULL',
    target: { type: 'course', courseId: '1' as CourseId, code: 'MA111' },
  },
  {
    kind: 'FULL',
    target: { type: 'course', courseId: '3' as CourseId, code: 'MC102' },
  },
])
const secondAlternative = alternative([
  {
    kind: 'FULL',
    target: { type: 'course', courseId: '2' as CourseId, code: 'MA141' },
  },
])
const rule: CoursePrerequisiteRule = {
  courseId: '4' as CourseId,
  alternatives: [firstAlternative, secondAlternative],
}

describe('evaluatePrerequisites', () => {
  it('selects the best ordered alternative automatically', () => {
    const result = evaluatePrerequisites({ snapshot, courses, rules: [rule] })
    const evaluation = result.courses.get('4' as CourseId)

    expect(evaluation?.automaticAlternativeKey).toBe(secondAlternative.key)
    expect(evaluation?.selectedAlternativeKey).toBe(secondAlternative.key)
    expect(evaluation?.issues).toEqual([])
    expect(result.links).toEqual([
      {
        prerequisiteCourseId: '2',
        dependentCourseId: '4',
        status: 'completed',
      },
    ])
  })

  it('uses a visual preference and reports same-period ordering', () => {
    const result = evaluatePrerequisites({
      snapshot,
      courses,
      rules: [rule],
      preferredAlternatives: new Map([['4' as CourseId, firstAlternative.key]]),
    })

    expect(result.courses.get('4' as CourseId)?.selectedAlternativeKey).toBe(
      firstAlternative.key,
    )
    expect(result.courses.get('4' as CourseId)?.issues).toEqual([])
    expect(result.links).toEqual([
      {
        prerequisiteCourseId: '1',
        dependentCourseId: '4',
        status: 'plannedBefore',
      },
      {
        prerequisiteCourseId: '3',
        dependentCourseId: '4',
        status: 'samePeriod',
      },
    ])
  })

  it('reports missing and inverted prerequisites on the selected alternative', () => {
    const invertedSnapshot: CurriculumPlannerSnapshot = {
      ...snapshot,
      plan: {
        periods: [
          {
            id: 'first' as PlanningPeriodId,
            items: [{ type: 'course', courseId: '4' as CourseId }],
          },
          {
            id: 'second' as PlanningPeriodId,
            items: [{ type: 'course', courseId: '1' as CourseId }],
          },
        ],
      },
      academicRecord: { completedCourses: [] },
    }
    const result = evaluatePrerequisites({
      snapshot: invertedSnapshot,
      courses,
      rules: [rule],
      preferredAlternatives: new Map([['4' as CourseId, firstAlternative.key]]),
    })

    expect(result.courses.get('4' as CourseId)?.issues).toEqual([
      'missing',
      'inverted',
    ])
    expect(result.links).toContainEqual({
      prerequisiteCourseId: '1',
      dependentCourseId: '4',
      status: 'plannedAfter',
    })
  })

  it('reports an unallocated prerequisite as missing from the ordered plan', () => {
    const unallocatedSnapshot: CurriculumPlannerSnapshot = {
      ...snapshot,
      plan: {
        ...snapshot.plan,
        unallocatedCourseIds: ['1' as CourseId],
        periods: snapshot.plan.periods.map((period) => ({
          ...period,
          items: period.items.filter((item) => item.courseId !== '1'),
        })),
      },
      academicRecord: { completedCourses: [] },
    }
    const result = evaluatePrerequisites({
      snapshot: unallocatedSnapshot,
      courses,
      rules: [rule],
      preferredAlternatives: new Map([['4' as CourseId, firstAlternative.key]]),
    })

    expect(result.courses.get('4' as CourseId)?.issues).toContain('missing')
  })

  it('resolves a prefix to a completed course first', () => {
    const prefixRule: CoursePrerequisiteRule = {
      courseId: '4' as CourseId,
      alternatives: [
        alternative([
          {
            kind: 'PARTIAL',
            target: { type: 'prefix', prefix: 'MA' },
          },
        ]),
      ],
    }
    const result = evaluatePrerequisites({
      snapshot,
      courses,
      rules: [prefixRule],
    })
    const item = result.courses.get('4' as CourseId)?.alternatives[0].items[0]

    expect(item?.matchedCourseId).toBe('2')
    expect(item?.status).toBe('completed')
  })
})
