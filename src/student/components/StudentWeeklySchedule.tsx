import {
  scheduleCourseColor,
  scheduleDays,
  scheduleEndHour,
  scheduleMinutes,
  scheduleStartHour,
} from '@pomi/planner-domain/semester'
import type { StudentClassSchedule } from '@/student/data/studentApi'

type StudentWeeklyScheduleProps = Readonly<{
  meetings: ReadonlyArray<StudentClassSchedule>
}>

const rowCount = scheduleEndHour - scheduleStartHour

export function StudentWeeklySchedule({
  meetings,
}: StudentWeeklyScheduleProps) {
  const visibleMeetings = meetings.flatMap((meeting) => {
    const dayIndex = scheduleDays.findIndex(
      ([day]) => day === meeting.dayOfWeek,
    )
    if (dayIndex < 0) return []
    const top =
      ((scheduleMinutes(meeting.start) - scheduleStartHour * 60) /
        (rowCount * 60)) *
      100
    const height =
      ((scheduleMinutes(meeting.end) - scheduleMinutes(meeting.start)) /
        (rowCount * 60)) *
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
        <div className="relative grid h-[32rem] grid-cols-[3.5rem_repeat(6,minmax(6.5rem,1fr))]">
          <div
            className="grid bg-card"
            style={{ gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: rowCount }, (_, index) => (
              <div
                key={index}
                className="border-b border-strong-border/40 pr-2 pt-1 text-right text-xs text-muted-foreground"
              >
                {String(scheduleStartHour + index).padStart(2, '0')}:00
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
              className={`absolute z-10 overflow-hidden rounded border-2 p-1 text-left text-[11px] font-bold shadow-sm ${scheduleCourseColor(meeting.courseCode)}`}
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
            {String(scheduleEndHour).padStart(2, '0')}:00
          </div>
          {scheduleDays.map(([day]) => (
            <div key={day} className="border-l border-strong-border/30" />
          ))}
        </div>
      </div>
    </div>
  )
}
