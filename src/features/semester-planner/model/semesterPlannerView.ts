import { scheduleDays, scheduleMinutes } from '@pomi/planner-domain/semester'
import type {
  ClassMeeting,
  ScheduleConflict,
  SemesterClass,
  SemesterCourse,
} from '@pomi/planner-domain/semester'

export type SemesterPlannerSummary = Readonly<{
  disciplines: number
  credits: number
  weeklyMinutes: number
  conflicts: number
}>

export type DetailedScheduleConflict = Readonly<{
  key: string
  classItem: SemesterClass
  conflictingClass: SemesterClass
  dayOfWeek: ClassMeeting['dayOfWeek']
  dayLabel: string
  start: string
  end: string
}>

export type CourseClassAvailability = Readonly<{
  matching: number
  total: number
}>

export function buildCourseClassAvailability({
  classes,
  matchingClasses,
}: {
  classes: ReadonlyArray<SemesterClass>
  matchingClasses: ReadonlyArray<SemesterClass>
}): ReadonlyMap<number, CourseClassAvailability> {
  const totals = countClassesByCourse(classes)
  const matches = countClassesByCourse(matchingClasses)
  return new Map(
    [...totals].map(([courseId, total]) => [
      courseId,
      { matching: matches.get(courseId) ?? 0, total },
    ]),
  )
}

export function buildSemesterPlannerSummary({
  selectedClasses,
  coursesById,
  meetings,
  conflicts,
}: {
  selectedClasses: ReadonlyArray<SemesterClass>
  coursesById: ReadonlyMap<number, SemesterCourse>
  meetings: ReadonlyArray<ClassMeeting>
  conflicts: ReadonlyArray<ScheduleConflict>
}): SemesterPlannerSummary {
  const selectedIds = new Set(selectedClasses.map((classItem) => classItem.id))
  const courseIds = new Set(
    selectedClasses.map((classItem) => classItem.courseId),
  )
  return {
    disciplines: courseIds.size,
    credits: [...courseIds].reduce(
      (total, courseId) => total + (coursesById.get(courseId)?.credits ?? 0),
      0,
    ),
    weeklyMinutes: meetings
      .filter((meeting) => selectedIds.has(meeting.classId))
      .reduce(
        (total, meeting) =>
          total + scheduleMinutes(meeting.end) - scheduleMinutes(meeting.start),
        0,
      ),
    conflicts: conflicts.length,
  }
}

export function buildDetailedScheduleConflicts({
  conflicts,
  classesById,
  meetings,
}: {
  conflicts: ReadonlyArray<ScheduleConflict>
  classesById: ReadonlyMap<number, SemesterClass>
  meetings: ReadonlyArray<ClassMeeting>
}): ReadonlyArray<DetailedScheduleConflict> {
  const details: Array<DetailedScheduleConflict> = []
  for (const conflict of conflicts) {
    const classItem = classesById.get(conflict.classId)
    const conflictingClass = classesById.get(conflict.conflictingClassId)
    if (!classItem || !conflictingClass) continue
    const classMeetings = meetings.filter(
      (meeting) =>
        meeting.classId === classItem.id &&
        meeting.dayOfWeek === conflict.dayOfWeek,
    )
    const conflictingMeetings = meetings.filter(
      (meeting) =>
        meeting.classId === conflictingClass.id &&
        meeting.dayOfWeek === conflict.dayOfWeek,
    )
    for (const meeting of classMeetings) {
      for (const conflictingMeeting of conflictingMeetings) {
        const startMinutes = Math.max(
          scheduleMinutes(meeting.start),
          scheduleMinutes(conflictingMeeting.start),
        )
        const endMinutes = Math.min(
          scheduleMinutes(meeting.end),
          scheduleMinutes(conflictingMeeting.end),
        )
        if (startMinutes >= endMinutes) continue
        const start = toTime(startMinutes)
        const end = toTime(endMinutes)
        details.push({
          key: `${classItem.id}-${conflictingClass.id}-${conflict.dayOfWeek}-${start}-${end}`,
          classItem,
          conflictingClass,
          dayOfWeek: conflict.dayOfWeek,
          dayLabel:
            scheduleDays.find(([day]) => day === conflict.dayOfWeek)?.[1] ??
            conflict.dayOfWeek,
          start,
          end,
        })
      }
    }
  }
  return details
}

export function classConflictsWithSelection({
  classItem,
  selectedClasses,
  meetings,
}: {
  classItem: SemesterClass
  selectedClasses: ReadonlyArray<SemesterClass>
  meetings: ReadonlyArray<ClassMeeting>
}) {
  const candidateMeetings = meetings.filter(
    (meeting) => meeting.classId === classItem.id,
  )
  const selectedIds = new Set(
    selectedClasses
      .filter((selected) => selected.courseId !== classItem.courseId)
      .map((selected) => selected.id),
  )
  return meetings.some(
    (selectedMeeting) =>
      selectedIds.has(selectedMeeting.classId) &&
      candidateMeetings.some(
        (candidateMeeting) =>
          candidateMeeting.dayOfWeek === selectedMeeting.dayOfWeek &&
          scheduleMinutes(candidateMeeting.start) <
            scheduleMinutes(selectedMeeting.end) &&
          scheduleMinutes(selectedMeeting.start) <
            scheduleMinutes(candidateMeeting.end),
      ),
  )
}

export function matchesClassSearch({
  query,
  classItem,
  course,
}: {
  query: string
  classItem: SemesterClass
  course?: SemesterCourse
}) {
  const normalizedQuery = normalizeSearch(query)
  if (!normalizedQuery) return true
  return normalizeSearch(
    [
      course?.code ?? classItem.courseCode,
      course?.name,
      classItem.code,
      ...classItem.professors.map((professor) => professor.name),
    ].join(' '),
  ).includes(normalizedQuery)
}

function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim()
}

function countClassesByCourse(classes: ReadonlyArray<SemesterClass>) {
  return classes.reduce(
    (counts, classItem) =>
      counts.set(classItem.courseId, (counts.get(classItem.courseId) ?? 0) + 1),
    new Map<number, number>(),
  )
}

function toTime(value: number) {
  return `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`
}
