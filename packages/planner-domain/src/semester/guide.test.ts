import { describe, expect, it } from 'vitest'

import {
  buildGuideClassContext,
  matchesGuideClass,
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
})
