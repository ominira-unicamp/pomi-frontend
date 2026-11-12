import { describe, expect, it } from 'vitest'

import {
  buildGuideClassContext,
  guideFromApi,
  matchesGuideClass,
  matchesGuideCourse,
  numericId,
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
        {
          id: 1,
          code: 'A',
          courseId: 15112,
          courseCode: 'MC102',
          professors: [],
        },
        context,
      ),
    ).toBe(true)
  })
})

for (const mode of ['NONE', 'PROGRAM', 'CURRICULUM'] as const) {
  it(`loads both configurations with preference ${mode}`, () => {
    const guide = guideFromApi({
      mode,
      manualCourseIds: [9],
      curriculum: { source: 'SAVED', saved: { curriculumId: 3 } },
      program: {
        catalogProgramId: 4,
        catalogProgramVariantId: 5,
        languageId: null,
      },
    })
    expect(guide.mode).toBe(mode.toLowerCase())
    expect(guide.curriculum.curriculumId).toBe(3)
    expect(guide.program.catalogProgramVariantId).toBe(5)
    expect(guide.manualCourseIds).toEqual([9])
  })
}
it('does not turn an empty selection into an academic reference', () => {
  expect(numericId('')).toBeNull()
  expect(numericId('5')).toBe(5)
})
