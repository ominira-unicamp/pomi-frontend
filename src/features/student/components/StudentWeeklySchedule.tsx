import { scheduleDays, scheduleMinutes } from '@pomi/planner-domain/semester'
import type { StudentClassSchedule } from '@/features/student/data/studentApi'

type StudentWeeklyScheduleProps = Readonly<{
  meetings: ReadonlyArray<StudentClassSchedule>
}>

const hourHeightRem = 2

function formatScheduleTime(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  return `${String(hours).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
}

function opaqueScheduleCourseColor(code: string) {
  const colors = [
    'border-primary bg-primary text-primary-foreground',
    'border-destructive bg-destructive text-destructive-foreground',
    'border-sidebar bg-sidebar text-sidebar-foreground',
    'border-secondary bg-secondary text-secondary-foreground',
  ]
  return (
    colors[
      [...code].reduce((total, char) => total + char.charCodeAt(0), 0) %
        colors.length
    ] ?? colors[0]
  )
}

export function StudentWeeklySchedule({
  meetings,
}: StudentWeeklyScheduleProps) {
  const earliestStart = meetings.length
    ? Math.min(...meetings.map((meeting) => scheduleMinutes(meeting.start)))
    : 7 * 60
  const latestEnd = meetings.length
    ? Math.max(...meetings.map((meeting) => scheduleMinutes(meeting.end)))
    : 23 * 60
  const visibleStart = Math.max(0, earliestStart - 60)
  const visibleEnd = Math.min(24 * 60, latestEnd)
  const visibleDuration = Math.max(60, visibleEnd - visibleStart)
  const rowCount = Math.ceil(visibleDuration / 60)
  const visibleMeetings = meetings.flatMap((meeting) => {
    const dayIndex = scheduleDays.findIndex(
      ([day]) => day === meeting.dayOfWeek,
    )
    if (dayIndex < 0) return []
    const top =
      ((scheduleMinutes(meeting.start) - visibleStart) / visibleDuration) * 100
    const height =
      ((scheduleMinutes(meeting.end) - scheduleMinutes(meeting.start)) /
        visibleDuration) *
      100
    return [{ meeting, dayIndex, top, height }]
  })

  return (
    <div className="overflow-x-auto rounded-lg border-2 border-strong-border bg-card">
      <div className="min-w-[46rem]">
        <div className="grid grid-cols-[3.5rem_repeat(6,minmax(6.5rem,1fr))]">
          <div className="border-b border-strong-border" />
          {scheduleDays.map(([, label]) => (
            <div
              key={label}
              className="border-b border-l border-strong-border py-1 text-center text-sm font-extrabold"
            >
              {label}
            </div>
          ))}
        </div>
        <div
          className="relative grid grid-cols-[3.5rem_repeat(6,minmax(6.5rem,1fr))]"
          style={{ height: `${rowCount * hourHeightRem}rem` }}
        >
          <div
            className="grid bg-card"
            style={{ gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: rowCount }, (_, index) => (
              <div
                key={index}
                className="border-b border-strong-border/40 pr-2 pt-1 text-right text-xs text-muted-foreground"
              >
                {formatScheduleTime(visibleStart + index * 60)}
              </div>
            ))}
          </div>
          {scheduleDays.map(([day]) => (
            <div
              key={day}
              className="grid border-l border-strong-border/50"
              style={{
                gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: rowCount }, (_, index) => (
                <div key={index} className="border-b border-strong-border/30" />
              ))}
            </div>
          ))}
          {visibleMeetings.map(({ meeting, dayIndex, top, height }) => (
            <div
              key={meeting.id}
              aria-label={`${meeting.courseCode}, turma ${meeting.classCode}, ${meeting.start} às ${meeting.end}, sala ${meeting.roomCode}`}
              className={`absolute z-10 overflow-hidden rounded border-2 p-1 text-left text-[11px] font-bold shadow-sm ${opaqueScheduleCourseColor(meeting.courseCode)}`}
              style={{
                left: `calc(3.5rem + ${dayIndex} * (100% - 3.5rem) / 6 + 3px)`,
                width: 'calc((100% - 3.5rem) / 6 - 6px)',
                top: `${top}%`,
                height: `${height}%`,
              }}
              title={`${meeting.courseCode} · Turma ${meeting.classCode} · ${meeting.start}–${meeting.end} · ${meeting.roomCode}`}
            >
              <span className="block truncate">
                {meeting.courseCode} · {meeting.classCode}
              </span>
              <span className="block truncate font-medium">
                {meeting.roomCode}
              </span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[3.5rem_repeat(6,minmax(6.5rem,1fr))]">
          <div className="pr-2 text-right text-xs text-muted-foreground">
            {formatScheduleTime(visibleEnd)}
          </div>
          {scheduleDays.map(([day]) => (
            <div key={day} className="border-l border-strong-border/30" />
          ))}
        </div>
      </div>
    </div>
  )
}
