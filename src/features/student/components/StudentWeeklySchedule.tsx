import { scheduleDays, scheduleMinutes } from '@pomi/planner-domain/semester'

export type WeeklyScheduleMeeting = Readonly<{
  id: number
  classId?: number
  studyPeriodId?: number
  classCode: string
  courseCode: string
  dayOfWeek:
    | 'MONDAY'
    | 'TUESDAY'
    | 'WEDNESDAY'
    | 'THURSDAY'
    | 'FRIDAY'
    | 'SATURDAY'
    | 'SUNDAY'
  start: string
  end: string
  roomCode: string
}>

type StudentWeeklyScheduleProps = Readonly<{
  meetings: ReadonlyArray<WeeklyScheduleMeeting>
  tone?: 'default' | 'subtle'
  onOpenMeeting?: (meeting: WeeklyScheduleMeeting) => void
}>

const hourHeightRem = 2

function formatScheduleTime(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  return `${String(hours).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
}

export function scheduleCourseColor(code: string) {
  const colors = [
    'border-schedule-1 bg-schedule-1 text-schedule-foreground',
    'border-schedule-2 bg-schedule-2 text-schedule-foreground',
    'border-schedule-3 bg-schedule-3 text-schedule-foreground',
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
  tone = 'default',
  onOpenMeeting,
}: StudentWeeklyScheduleProps) {
  const days = [
    ...scheduleDays,
    ...(meetings.some((meeting) => meeting.dayOfWeek === 'SUNDAY')
      ? [['SUNDAY', 'Dom'] as const]
      : []),
  ]
  const columns = `3.5rem repeat(${days.length}, minmax(6.5rem, 1fr))`
  const border = tone === 'subtle' ? 'border-border' : 'border-strong-border'
  const fadedBorder =
    tone === 'subtle' ? 'border-border/60' : 'border-strong-border/40'
  const lightBorder =
    tone === 'subtle' ? 'border-border/50' : 'border-strong-border/30'
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
    const dayIndex = days.findIndex(([day]) => day === meeting.dayOfWeek)
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
    <>
      <div className="space-y-4 md:hidden" aria-label="Agenda semanal por dia">
        {([...scheduleDays, ['SUNDAY', 'Domingo']] as const).map(
          ([day, label]) => {
            const entries = meetings
              .filter((meeting) => meeting.dayOfWeek === day)
              .sort((left, right) => left.start.localeCompare(right.start))
            if (!entries.length) return null
            return (
              <section key={day}>
                <h3 className="mb-2 text-sm font-extrabold">{label}</h3>
                <div className="divide-y divide-border">
                  {entries.map((meeting) => (
                    <button
                      type="button"
                      disabled={!onOpenMeeting}
                      onClick={() => onOpenMeeting?.(meeting)}
                      key={meeting.id}
                      className="pomi-focus flex w-full gap-3 py-3 text-left"
                    >
                      <span
                        aria-hidden
                        className={`mt-1 size-3 shrink-0 rounded-sm border-2 ${scheduleCourseColor(meeting.courseCode)}`}
                      />
                      <div>
                        <p className="font-bold">
                          {meeting.courseCode} · Turma {meeting.classCode}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {meeting.start}–{meeting.end} ·{' '}
                          {meeting.roomCode || 'Sala não informada'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )
          },
        )}
      </div>
      <div
        className={`hidden overflow-x-auto rounded-lg border-2 bg-card md:block ${border}`}
      >
        <div className="min-w-[46rem]">
          <div className="grid" style={{ gridTemplateColumns: columns }}>
            <div className={`border-b ${border}`} />
            {days.map(([, label]) => (
              <div
                key={label}
                className={`border-b border-l py-1 text-center text-sm font-extrabold ${border}`}
              >
                {label}
              </div>
            ))}
          </div>
          <div
            className="relative grid"
            style={{
              height: `${rowCount * hourHeightRem}rem`,
              gridTemplateColumns: columns,
            }}
          >
            <div
              className="grid bg-card"
              style={{
                gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: rowCount }, (_, index) => (
                <div
                  key={index}
                  className={`border-b pr-2 pt-1 text-right text-xs text-muted-foreground ${fadedBorder}`}
                >
                  {formatScheduleTime(visibleStart + index * 60)}
                </div>
              ))}
            </div>
            {days.map(([day]) => (
              <div
                key={day}
                className={`grid border-l ${fadedBorder}`}
                style={{
                  gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: rowCount }, (_, index) => (
                  <div key={index} className={`border-b ${lightBorder}`} />
                ))}
              </div>
            ))}
            {visibleMeetings.map(({ meeting, dayIndex, top, height }) => (
              <button
                key={meeting.id}
                aria-label={`${meeting.courseCode}, turma ${meeting.classCode}, ${meeting.start} às ${meeting.end}, sala ${meeting.roomCode}`}
                onClick={() => onOpenMeeting?.(meeting)}
                type="button"
                disabled={!onOpenMeeting}
                className={`pomi-focus absolute z-10 overflow-hidden rounded-md border-2 p-1.5 text-left text-[11px] font-bold shadow-sm ${scheduleCourseColor(meeting.courseCode)}`}
                style={{
                  left: `calc(3.5rem + ${dayIndex} * (100% - 3.5rem) / ${days.length} + 3px)`,
                  width: `calc((100% - 3.5rem) / ${days.length} - 6px)`,
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
              </button>
            ))}
          </div>
          <div className="grid" style={{ gridTemplateColumns: columns }}>
            <div className="pr-2 text-right text-xs text-muted-foreground">
              {formatScheduleTime(visibleEnd)}
            </div>
            {days.map(([day]) => (
              <div key={day} className={`border-l ${lightBorder}`} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
