import type {
  StudentClassSchedule,
  StudentCourseAttempt,
} from '@/features/student/data/studentApi'
import type { StudentAbsence } from '@/features/student/data/studentAbsenceApi'

export type ClassOccurrence = Readonly<{
  courseAttemptId: number
  classScheduleId: number
  date: string
  courseCode: string
  courseName: string
  classCode: string
  start: string
  end: string
  roomCode: string
}>

const weekDays = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
] as const

function parseDateKey(value: string) {
  return new Date(`${value}T12:00:00.000Z`)
}

function dateKeyFromUtc(value: Date) {
  return [
    value.getUTCFullYear(),
    String(value.getUTCMonth() + 1).padStart(2, '0'),
    String(value.getUTCDate()).padStart(2, '0'),
  ].join('-')
}

export function academicDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? ''
  return `${part('year')}-${part('month')}-${part('day')}`
}

export function dayOfWeekForDate(date: string) {
  return weekDays[parseDateKey(date).getUTCDay()]
}

export function occurrenceKey(
  occurrence: Pick<
    ClassOccurrence,
    'courseAttemptId' | 'classScheduleId' | 'date'
  >,
) {
  return `${occurrence.courseAttemptId}:${occurrence.classScheduleId}:${occurrence.date}`
}

export function findOccurrenceAbsence(
  absences: ReadonlyArray<StudentAbsence>,
  occurrence: ClassOccurrence,
) {
  const key = occurrenceKey(occurrence)
  return absences.find(
    (absence) =>
      occurrenceKey({
        courseAttemptId: absence.studentCourseAttemptId,
        classScheduleId: absence.classScheduleId,
        date: absence.date,
      }) === key,
  )
}

export function occurrenceFromMeeting(
  attempt: StudentCourseAttempt,
  meeting: StudentClassSchedule,
  date: string,
): ClassOccurrence {
  return {
    courseAttemptId: attempt.id,
    classScheduleId: meeting.id,
    date,
    courseCode: attempt.course.code,
    courseName: attempt.course.name,
    classCode: meeting.classCode,
    start: meeting.start,
    end: meeting.end,
    roomCode: meeting.roomCode,
  }
}

export function occurrencesForDate(
  attempt: StudentCourseAttempt,
  meetings: ReadonlyArray<StudentClassSchedule>,
  date: string,
) {
  const dayOfWeek = dayOfWeekForDate(date)
  return meetings
    .filter(
      (meeting) =>
        meeting.classId === attempt.classId && meeting.dayOfWeek === dayOfWeek,
    )
    .map((meeting) => occurrenceFromMeeting(attempt, meeting, date))
    .sort(
      (left, right) =>
        left.start.localeCompare(right.start) ||
        left.end.localeCompare(right.end),
    )
}

export function recentClassOccurrences({
  attempt,
  meetings,
  periodStartDate,
  today,
}: {
  attempt: StudentCourseAttempt
  meetings: ReadonlyArray<StudentClassSchedule>
  periodStartDate?: string
  today: string
}) {
  const end = parseDateKey(today)
  const fallbackStart = new Date(end)
  fallbackStart.setUTCDate(fallbackStart.getUTCDate() - 180)
  const start = periodStartDate ? parseDateKey(periodStartDate) : fallbackStart
  const occurrences: Array<ClassOccurrence> = []

  for (
    const cursor = new Date(end);
    cursor >= start;
    cursor.setUTCDate(cursor.getUTCDate() - 1)
  ) {
    occurrences.push(
      ...occurrencesForDate(attempt, meetings, dateKeyFromUtc(cursor)),
    )
  }

  return occurrences
}

export function formatOccurrenceDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parseDateKey(date))
}
