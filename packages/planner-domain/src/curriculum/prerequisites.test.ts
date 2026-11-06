import { describe, expect, it } from 'vitest'

import {
  evaluatePrerequisites,
  prerequisiteAlternativeKey,
  specialRequirementCode,
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
    target: {
      type: 'course',
      courseId: '1' as CourseId,
      fulfillment: 'FULL',
    },
  },
  {
    target: {
      type: 'course',
      courseId: '3' as CourseId,
      fulfillment: 'FULL',
    },
  },
])
const secondAlternative = alternative([
  {
    target: {
      type: 'course',
      courseId: '2' as CourseId,
      fulfillment: 'FULL',
    },
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

  it('reports a prerequisite that is absent from the catalog', () => {
    const result = evaluatePrerequisites({
      snapshot,
      courses,
      rules: [rule],
      preferredAlternatives: new Map([['4' as CourseId, firstAlternative.key]]),
      catalogCourseIds: new Set(['3' as CourseId]),
    })

    expect(
      result.courses.get('4' as CourseId)?.alternatives[0].items[0].status,
    ).toBe('notInCatalog')
    expect(result.courses.get('4' as CourseId)?.issues).toContain(
      'notInCatalog',
    )
  })

  it('keeps unresolved historical requirements unevaluable', () => {
    const unresolvedRule: CoursePrerequisiteRule = {
      courseId: '4' as CourseId,
      alternatives: [
        alternative([
          {
            target: { type: 'unresolvedCourse', fulfillment: 'PARTIAL' },
          },
        ]),
      ],
    }
    const result = evaluatePrerequisites({
      snapshot,
      courses,
      rules: [unresolvedRule],
    })
    const item = result.courses.get('4' as CourseId)?.alternatives[0].items[0]

    expect(item?.matchedCourseId).toBeUndefined()
    expect(item?.status).toBe('unknown')
  })

  it('limits evaluation to courses that are currently relevant to the screen', () => {
    const ignoredRule: CoursePrerequisiteRule = {
      courseId: '3' as CourseId,
      alternatives: [secondAlternative],
    }
    const result = evaluatePrerequisites({
      snapshot,
      courses,
      rules: [rule, ignoredRule],
      courseIds: new Set(['4' as CourseId]),
    })

    expect(result.courses.has('4' as CourseId)).toBe(true)
    expect(result.courses.has('3' as CourseId)).toBe(false)
  })
})

describe('specialRequirementCode', () => {
  it('reconstructs the source code for special requirements', () => {
    expect(specialRequirementCode('AUTHORIZATION', 0)).toBe('AA200')
    expect(specialRequirementCode('PROGRESSION_COEFFICIENT', 30)).toBe('AA430')
  })
})
