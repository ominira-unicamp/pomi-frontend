import { describe, expect, it } from 'vitest'

import { calculateElectiveCreditsBalances } from './electiveCredits'
import type { Course, CourseId, CurriculumBlocks } from './curriculumPlanner'

const course = (
  id: string,
  code: string,
  credits: number,
  prefix?: string,
): Course => ({
  id: id as CourseId,
  code,
  name: code,
  credits,
  prefix,
})

describe('calculateElectiveCreditsBalances', () => {
  it('allocates each course to only one elective block', () => {
    const blocks: CurriculumBlocks = {
      mandatory: [],
      electives: [
        {
          type: 'electiveCredits',
          source: { type: 'base' },
          requiredCredits: 4,
          eligibleCourses: [{ type: 'anyCourse' }],
        },
        {
          type: 'electiveCredits',
          source: { type: 'base' },
          requiredCredits: 10,
          eligibleCourses: [{ type: 'prefix', prefix: 'MC' }],
        },
      ],
    }
    const balances = calculateElectiveCreditsBalances(
      [
        course('mc1', 'MC101', 4, 'MC'),
        course('mc2', 'MC102', 6, 'MC'),
        course('la1', 'LA111', 2, 'LA'),
        course('la1', 'LA111', 2, 'LA'),
      ],
      blocks,
    )

    expect(balances).toMatchObject([
      {
        eligibleCourseIds: ['mc1', 'mc2'],
        earnedCredits: 10,
        requiredCredits: 10,
        remainingCredits: 0,
      },
      {
        eligibleCourseIds: ['la1'],
        earnedCredits: 2,
        requiredCredits: 4,
        remainingCredits: 2,
      },
    ])
  })

  it('does not use a mandatory course to satisfy elective credits', () => {
    const blocks: CurriculumBlocks = {
      mandatory: [
        {
          type: 'course',
          source: { type: 'base' },
          selector: { type: 'specificCourse', courseId: 'mc1' as CourseId },
        },
      ],
      electives: [
        {
          type: 'electiveCredits',
          source: { type: 'base' },
          requiredCredits: 10,
          eligibleCourses: [{ type: 'prefix', prefix: 'MC' }],
        },
      ],
    }

    const balances = calculateElectiveCreditsBalances(
      [course('mc1', 'MC101', 4, 'MC'), course('mc2', 'MC102', 6, 'MC')],
      blocks,
    )

    expect(balances).toMatchObject([
      {
        eligibleCourseIds: ['mc2'],
        earnedCredits: 6,
        remainingCredits: 4,
      },
    ])
  })
})
