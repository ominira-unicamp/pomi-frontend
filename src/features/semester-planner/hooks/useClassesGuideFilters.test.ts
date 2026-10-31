import { describe, expect, it } from 'vitest'
import { filterClassesGuide } from './useClassesGuideFilters'
import type { ClassesGuideFilters } from './useClassesGuideFilters'
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
const emptyFilters: ClassesGuideFilters = {
  timePeriods: [],
  search: '',
  courseId: '',
  start: '',
  end: '',
  days: [],
  withoutConflict: false,
  withoutCompleted: false,
  withoutIncluded: false,
  withoutUnavailable: false,
}

function filter(changes: Partial<ClassesGuideFilters>) {
  return filterClassesGuide({
    filters: { ...emptyFilters, ...changes },
    courses,
    classes,
    meetings,
    selectedClassIds: new Set([10]),
    guideClassContext: { courseIds: new Set([1, 2]), prefixes: [] },
  })
}

describe('filterClassesGuide', () => {
  it('searches normalized course and professor data', () => {
    expect(filter({ search: 'joao avila' }).map((item) => item.id)).toEqual([
      10,
    ])
    expect(filter({ search: 'calculo' }).map((item) => item.id)).toEqual([20])
  })

  it('combines course, time and conflict filters', () => {
    expect(
      filter({ courseId: '2', start: '10:00', end: '14:00' }).map(
        (item) => item.id,
      ),
    ).toEqual([20])
    expect(filter({ withoutConflict: true }).map((item) => item.id)).toEqual([
      10,
    ])
  })

  it('accepts any selected time period', () => {
    const eveningClass = { ...classes[1], id: 30, code: 'C' }
    const eveningMeetings = [
      ...meetings,
      {
        ...meetings[1],
        id: 3,
        classId: eveningClass.id,
        start: '19:00',
        end: '21:00',
      },
    ]
    const guideClassContext = { courseIds: new Set([1, 2]), prefixes: [] }
    expect(
      filterClassesGuide({
        filters: { ...emptyFilters, timePeriods: ['evening'] },
        courses,
        classes: [...classes, eveningClass],
        meetings: eveningMeetings,
        selectedClassIds: new Set([10]),
        guideClassContext,
      }).map((item) => item.id),
    ).toEqual([30])
    expect(
      filterClassesGuide({
        filters: { ...emptyFilters, timePeriods: ['morning', 'evening'] },
        courses,
        classes: [...classes, eveningClass],
        meetings: eveningMeetings,
        selectedClassIds: new Set([10]),
        guideClassContext,
      }).map((item) => item.id),
    ).toEqual([10, 20, 30])
  })

  it('can hide classes from completed disciplines', () => {
    expect(
      filterClassesGuide({
        filters: { ...emptyFilters, withoutCompleted: true },
        courses,
        classes,
        meetings,
        selectedClassIds: new Set([10]),
        completedCourseIds: new Set([1]),
        guideClassContext: { courseIds: new Set([1, 2]), prefixes: [] },
      }).map((item) => item.id),
    ).toEqual([20])
  })

  it('can hide classes from disciplines already included in the plan', () => {
    expect(
      filterClassesGuide({
        filters: { ...emptyFilters, withoutIncluded: true },
        courses,
        classes,
        meetings,
        selectedClassIds: new Set([10]),
        guideClassContext: { courseIds: new Set([1, 2]), prefixes: [] },
      }).map((item) => item.id),
    ).toEqual([20])
  })
})
