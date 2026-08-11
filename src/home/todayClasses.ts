import type { StudentClassSchedule } from '@/student/data/studentApi'

export const academicTimeZone = 'America/Sao_Paulo'

type ScheduleDay = StudentClassSchedule['dayOfWeek']

export type TodayClassStatus = 'finished' | 'now' | 'next' | 'later'

function dateParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: academicTimeZone,
    year: 'numeric',
    month: 'numeric',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(date)
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ''
  return {
    year: Number(value('year')),
    month: Number(value('month')),
    weekday: value('weekday').toUpperCase() as ScheduleDay,
    minutes: Number(value('hour')) * 60 + Number(value('minute')),
  }
}

export function currentStudyPeriodCode(date = new Date()) {
  const { year, month } = dateParts(date)
  return `${month <= 6 ? 1 : 2}s${year}`
}

export function currentScheduleDay(date = new Date()) {
  return dateParts(date).weekday
}

export function academicMinutesNow(date = new Date()) {
  return dateParts(date).minutes
}

export function formatAcademicDate(date = new Date()) {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: academicTimeZone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)
}

function scheduleMinutes(value: string) {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

export function sortTodayMeetings(
  meetings: ReadonlyArray<StudentClassSchedule>,
) {
  return [...meetings].sort(
    (left, right) =>
      scheduleMinutes(left.start) - scheduleMinutes(right.start) ||
      scheduleMinutes(left.end) - scheduleMinutes(right.end) ||
      left.courseCode.localeCompare(right.courseCode),
  )
}

export function statusForTodayMeeting(
  meeting: StudentClassSchedule,
  meetings: ReadonlyArray<StudentClassSchedule>,
  date = new Date(),
): TodayClassStatus {
  const now = academicMinutesNow(date)
  const start = scheduleMinutes(meeting.start)
  const end = scheduleMinutes(meeting.end)
  if (end <= now) return 'finished'
  if (start <= now) return 'now'
  const nextStart = Math.min(
    ...meetings
      .map((item) => scheduleMinutes(item.start))
      .filter((itemStart) => itemStart > now),
  )
  return start === nextStart ? 'next' : 'later'
}
