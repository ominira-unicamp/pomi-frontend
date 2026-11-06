import { describe, expect, it } from 'vitest'

import { commandForCourseDrop } from './dnd'
import type {
  Course,
  CourseId,
  PlanningPeriodId,
} from '@pomi/planner-domain/curriculum'
import type { PlannerDragData } from './components/CourseCard'

const course = {
  id: 'course' as CourseId,
  code: 'MC102',
  name: 'Algoritmos',
  credits: 6,
} satisfies Course

describe('commandForCourseDrop', () => {
  it('adds an unplanned course and moves a planned course', () => {
    const unplanned = {
      type: 'course',
      course,
      completed: false,
    } satisfies PlannerDragData
    expect(commandForCourseDrop(unplanned, 'period:second')).toEqual({
      type: 'addCourseToPeriod',
      courseId: course.id,
      periodId: 'second',
    })
    expect(
      commandForCourseDrop(
        { ...unplanned, currentPeriodId: 'first' as PlanningPeriodId },
        'period:second',
      ),
    ).toEqual({
      type: 'moveCourseToPeriod',
      courseId: course.id,
      periodId: 'second',
    })
  })

  it('ignores drops that do not change the planning state', () => {
    const data = {
      type: 'course',
      course,
      completed: false,
      currentPeriodId: 'first' as PlanningPeriodId,
    } satisfies PlannerDragData
    expect(commandForCourseDrop(data, 'completed')).toBeUndefined()
    expect(commandForCourseDrop(data, 'period:first')).toBeUndefined()
    expect(
      commandForCourseDrop({ ...data, completed: true }, 'completed'),
    ).toBeUndefined()
  })

  it('ignores drops back into a curriculum block', () => {
    expect(
      commandForCourseDrop(
        {
          type: 'course',
          course,
          completed: false,
        },
        'curriculum-block:base:mandatory',
      ),
    ).toBeUndefined()
  })
})
