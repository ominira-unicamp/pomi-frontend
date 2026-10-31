import { useState } from 'react'
import {
  matchesGuideClass,
  scheduleMinutes as minutes,
} from '@pomi/planner-domain/semester'
import type {
  ClassMeeting,
  GuideClassContext,
  SemesterClass,
  SemesterCourse,
} from '@pomi/planner-domain/semester'

import {
  classConflictsWithSelection,
  matchesClassSearch,
} from '@/features/semester-planner/model/semesterPlannerView'

export type ClassesGuideFilters = Readonly<{
  timePeriods: ReadonlyArray<TimePeriod>
  search: string
  courseId: string
  start: string
  end: string
  days: ReadonlyArray<string>
  withoutConflict: boolean
  withoutCompleted: boolean
  withoutIncluded: boolean
  withoutUnavailable: boolean
}>

export type TimePeriod = 'morning' | 'afternoon' | 'evening'

export const timePeriodRanges: Readonly<
  Record<TimePeriod, readonly [string, string]>
> = {
  morning: ['07:00', '12:00'],
  afternoon: ['12:00', '18:00'],
  evening: ['18:00', '23:00'],
}

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

export function useClassesGuideFilters() {
  const [filters, setFilters] = useState<ClassesGuideFilters>(emptyFilters)

  function updateFilters(changes: Partial<ClassesGuideFilters>) {
    setFilters((current) => ({ ...current, ...changes }))
  }

  function toggleDay(day: string) {
    setFilters((current) => ({
      ...current,
      days: current.days.includes(day)
        ? current.days.filter((item) => item !== day)
        : [...current.days, day],
    }))
  }

  function clearFilters() {
    setFilters((current) => ({ ...emptyFilters, search: current.search }))
  }

  return { filters, updateFilters, toggleDay, clearFilters }
}

export function filterClassesGuide({
  filters,
  courses,
  classes,
  meetings,
  selectedClassIds,
  completedCourseIds = new Set(),
  guideClassContext,
}: {
  filters: ClassesGuideFilters
  courses: ReadonlyArray<SemesterCourse>
  classes: ReadonlyArray<SemesterClass>
  meetings: ReadonlyArray<ClassMeeting>
  selectedClassIds: ReadonlySet<number>
  completedCourseIds?: ReadonlySet<number>
  guideClassContext: GuideClassContext
}) {
  const courseById = new Map(courses.map((course) => [course.id, course]))
  const selectedClasses = classes.filter((classItem) =>
    selectedClassIds.has(classItem.id),
  )
  const selectedCourseIds = new Set(
    selectedClasses.map((classItem) => classItem.courseId),
  )
  const filterStart = filters.start ? minutes(filters.start) : undefined
  const filterEnd = filters.end ? minutes(filters.end) : undefined
  const periodRanges = filters.timePeriods.map((period) => {
    const [start, end] = timePeriodRanges[period]
    return [minutes(start), minutes(end)] as const
  })
  return classes.filter((classItem) => {
    if (!matchesGuideClass(classItem, guideClassContext)) return false
    if (
      !matchesClassSearch({
        query: filters.search,
        classItem,
        course: courseById.get(classItem.courseId),
      })
    )
      return false
    if (filters.courseId && classItem.courseId !== Number(filters.courseId))
      return false
    if (filters.withoutCompleted && completedCourseIds.has(classItem.courseId))
      return false
    const classMeetings = meetings.filter(
      (meeting) => meeting.classId === classItem.id,
    )
    if (filters.withoutIncluded && selectedCourseIds.has(classItem.courseId))
      return false
    if (
      filters.days.length > 0 &&
      !classMeetings.some((meeting) => filters.days.includes(meeting.dayOfWeek))
    )
      return false
    if (
      periodRanges.length > 0 ||
      filterStart !== undefined ||
      filterEnd !== undefined
    ) {
      const start = filterStart ?? 0
      const end = filterEnd ?? 24 * 60
      const ranges = periodRanges.length > 0 ? periodRanges : [[start, end]]
      if (
        !classMeetings.some((meeting) =>
          ranges.some(
            ([rangeStart, rangeEnd]) =>
              minutes(meeting.start) < rangeEnd &&
              minutes(meeting.end) > rangeStart,
          ),
        )
      )
        return false
    }
    return !(
      filters.withoutConflict &&
      classConflictsWithSelection({ classItem, selectedClasses, meetings })
    )
  })
}
