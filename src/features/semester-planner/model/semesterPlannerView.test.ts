import { describe, expect, it } from 'vitest'

import {
  buildCourseClassAvailability,
  buildDetailedScheduleConflicts,
  buildSemesterPlannerSummary,
  classConflictsWithSelection,
  matchesClassSearch,
} from './semesterPlannerView'
import type {
  ClassMeeting,
  SemesterClass,
  SemesterCourse,
} from '@pomi/planner-domain/semester'

const courses: ReadonlyArray<SemesterCourse> = [
  { id: 1, code: 'MC102', name: 'Algoritmos', credits: 6 },
  { id: 2, code: 'MA111', name: 'Cálculo', credits: 6 },
]
const classes: ReadonlyArray<SemesterClass> = [
  {
    id: 10,
    courseId: 1,
    courseCode: 'MC102',
    code: 'A',
    professors: [{ id: 1, name: 'João Ávila' }],
  },
  {
    id: 20,
    courseId: 2,
    courseCode: 'MA111',
    code: 'B',
    professors: [],
  },
]
const meetings: ReadonlyArray<ClassMeeting> = [
  {
    id: 1,
    classId: 10,
    dayOfWeek: 'MONDAY',
    start: '10:00',
    end: '12:00',
    roomCode: 'PB01',
  },
  {
    id: 2,
    classId: 20,
    dayOfWeek: 'MONDAY',
    start: '11:00',
    end: '13:00',
    roomCode: 'PB02',
  },
]

describe('semester planner view', () => {
  it('aggregates total and matching classes by discipline', () => {
    expect(
      buildCourseClassAvailability({
        classes,
        matchingClasses: [classes[0]],
      }),
    ).toEqual(
      new Map([
        [1, { matching: 1, total: 1 }],
        [2, { matching: 0, total: 1 }],
      ]),
    )
  })

  it('summarizes selected disciplines, credits, hours and conflicts', () => {
    expect(
      buildSemesterPlannerSummary({
        selectedClasses: classes,
        coursesById: new Map(courses.map((course) => [course.id, course])),
        meetings,
        conflicts: [
          { classId: 10, conflictingClassId: 20, dayOfWeek: 'MONDAY' },
        ],
      }),
    ).toEqual({ disciplines: 2, credits: 12, weeklyMinutes: 240, conflicts: 1 })
  })

  it('describes the exact overlap between conflicting meetings', () => {
    expect(
      buildDetailedScheduleConflicts({
        conflicts: [
          { classId: 10, conflictingClassId: 20, dayOfWeek: 'MONDAY' },
        ],
        classesById: new Map(
          classes.map((classItem) => [classItem.id, classItem]),
        ),
        meetings,
      }),
    ).toMatchObject([{ dayLabel: 'Seg', start: '11:00', end: '12:00' }])
  })

  it('matches classes by normalized professor and course terms', () => {
    expect(
      matchesClassSearch({
        query: 'joao avila',
        classItem: classes[0],
        course: courses[0],
      }),
    ).toBe(true)
    expect(
      matchesClassSearch({
        query: 'calculo',
        classItem: classes[1],
        course: courses[1],
      }),
    ).toBe(true)
  })

  it('detects prospective conflicts while ignoring the replaced course', () => {
    expect(
      classConflictsWithSelection({
        classItem: classes[1],
        selectedClasses: [classes[0]],
        meetings,
      }),
    ).toBe(true)
    expect(
      classConflictsWithSelection({
        classItem: classes[0],
        selectedClasses: [classes[0]],
        meetings,
      }),
    ).toBe(false)
  })
})
