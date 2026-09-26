import { describe, expect, it } from 'vitest'

import {
  buildGuideClassContext,
  matchesGuideClass,
  matchesGuideCourse,
  selectorLabel,
} from './guide'

describe('semester planning guide', () => {
  it('matches manual courses and elective prefixes in the program guide', () => {
    const context = buildGuideClassContext(
      'program',
      [],
      [
        {
          blocks: {
            mandatory: [],
            electives: [
              {
                type: 'electiveCredits',
                source: { type: 'base' },
                requiredCredits: 4,
                eligibleCourses: [{ type: 'prefix', prefix: 'MC' }],
              },
            ],
          },
        },
      ],
      [10],
    )

    expect(
      matchesGuideClass(
        { id: 1, code: 'A', courseId: 10, courseCode: 'AA001', professors: [] },
        context,
      ),
    ).toBe(true)
    expect(
      matchesGuideClass(
        { id: 2, code: 'B', courseId: 11, courseCode: 'MC102', professors: [] },
        context,
      ),
    ).toBe(true)
    expect(
      matchesGuideClass(
        { id: 3, code: 'C', courseId: 12, courseCode: 'MA111', professors: [] },
        context,
      ),
    ).toBe(false)
  })

  it('labels selectors without exposing eligible course expansions', () => {
    expect(selectorLabel({ type: 'prefix', prefix: 'MC' })).toBe('MC---')
  })

  it('matches eligible courses even when their current-period classes are absent', () => {
    const context = buildGuideClassContext(
      'program',
      [],
      [
        {
          blocks: {
            mandatory: [],
            electives: [],
          },
        },
      ],
      [102],
    )

    expect(matchesGuideCourse({ id: 102, code: 'MC102' }, context)).toBe(true)
    expect(matchesGuideCourse({ id: 103, code: 'MC103' }, context)).toBe(false)
  })

  it('matches a specific eligible course by code when identifiers differ', () => {
    const context = buildGuideClassContext(
      'program',
      [],
      [
        {
          blocks: {
            mandatory: [
              {
                type: 'course',
                source: { type: 'base' },
                selector: {
                  type: 'specificCourse',
                  courseId: '7' as never,
                },
              },
            ],
            electives: [],
          },
        },
      ],
      [],
      new Map([[7, { id: 7, code: 'MC102', name: 'Algoritmos', credits: 4 }]]),
    )

    expect(
      matchesGuideClass(
        { id: 1, code: 'A', courseId: 15112, courseCode: 'MC102', professors: [] },
        context,
      ),
    ).toBe(true)
  })
})
