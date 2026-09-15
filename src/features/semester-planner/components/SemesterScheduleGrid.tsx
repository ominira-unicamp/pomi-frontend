import {
  scheduleDays as days,
  scheduleEndHour as endHour,
  scheduleRowCount as gridRowCount,
  scheduleMinutes as minutes,
  scheduleStartHour as startHour,
} from '@pomi/planner-domain/semester'
import type {
  ClassMeeting,
  GridSelection,
  SemesterClass,
  SemesterCourse,
} from '@pomi/planner-domain/semester'
import type { PointerEvent as ReactPointerEvent, RefObject } from 'react'

type ScheduleGridSelection = Readonly<{
  ref: RefObject<HTMLDivElement | null>
  activeSelection?: GridSelection
  highlightedDayIndexes: ReadonlyArray<number>
  isDragging: boolean
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void
  onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void
  onPointerUp: (event: ReactPointerEvent<HTMLDivElement>) => void
  onPointerCancel: (event: ReactPointerEvent<HTMLDivElement>) => void
}>

export function SemesterScheduleGrid({
  selectedClasses,
  meetings,
  coursesById,
  conflictingClassIds,
  previewClass,
  selection,
  isClassSelectionEnabled,
  onSelectedClassClick,
}: {
  selectedClasses: ReadonlyArray<SemesterClass>
  meetings: ReadonlyArray<ClassMeeting>
  coursesById: ReadonlyMap<number, SemesterCourse>
  conflictingClassIds: ReadonlySet<number>
  previewClass?: SemesterClass
  selection: ScheduleGridSelection
  isClassSelectionEnabled: boolean
  onSelectedClassClick: (classId: number) => void
}) {
  const meetingsByClassId = new Map<number, ReadonlyArray<ClassMeeting>>()
  for (const meeting of meetings) {
    meetingsByClassId.set(meeting.classId, [
      ...(meetingsByClassId.get(meeting.classId) ?? []),
      meeting,
    ])
  }

  return (
    <section className="h-[32rem] overflow-auto rounded-lg border-2 border-strong-border bg-card lg:h-full lg:overflow-hidden">
      <div className="flex h-full min-w-[46rem] flex-col">
        <div className="grid shrink-0 grid-cols-[3.5rem_repeat(6,minmax(6.5rem,1fr))]">
          <div className="sticky left-0 z-20 border-b border-strong-border bg-card" />
          {days.map(([, label]) => (
            <div
              key={label}
              className="border-b border-l border-strong-border py-1 text-center text-sm font-extrabold"
            >
              {label}
            </div>
          ))}
        </div>
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="relative grid min-h-0 flex-1 grid-cols-[3.5rem_repeat(6,minmax(6.5rem,1fr))]">
            <div
              className="relative sticky left-0 z-10 grid bg-card"
              style={{
                gridTemplateRows: `repeat(${endHour - startHour}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: endHour - startHour }, (_, index) => (
                <div
                  key={index}
                  className="border-b border-strong-border/40 pr-2 pt-1 text-right text-xs text-muted-foreground"
                >
                  {String(startHour + index).padStart(2, '0')}:00
                </div>
              ))}
            </div>
            {days.map(([day]) => (
              <div
                key={day}
                className="grid border-l border-strong-border/50"
                style={{
                  gridTemplateRows: `repeat(${endHour - startHour}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: endHour - startHour }, (_, index) => (
                  <div
                    key={index}
                    className="border-b border-strong-border/30"
                  />
                ))}
              </div>
            ))}
            {isClassSelectionEnabled && (
              <div
                ref={selection.ref}
                className={`absolute inset-y-0 left-[3.5rem] right-0 z-[1] touch-none select-none ${selection.isDragging ? 'cursor-crosshair' : ''}`}
                onPointerDown={selection.onPointerDown}
                onPointerMove={selection.onPointerMove}
                onPointerUp={selection.onPointerUp}
                onPointerCancel={selection.onPointerCancel}
              >
                {selection.activeSelection &&
                  selection.highlightedDayIndexes.map((dayIndex) => (
                    <div
                      key={dayIndex}
                      className="pointer-events-none absolute rounded border border-primary/35 bg-primary/5"
                      style={{
                        left: `${(dayIndex / days.length) * 100}%`,
                        width: `${(1 / days.length) * 100}%`,
                        top: `${(selection.activeSelection.startRow / gridRowCount) * 100}%`,
                        height: `${((selection.activeSelection.endRow - selection.activeSelection.startRow) / gridRowCount) * 100}%`,
                      }}
                    />
                  ))}
              </div>
            )}
            {selectedClasses.flatMap((classItem) =>
              (meetingsByClassId.get(classItem.id) ?? []).map((meeting) => (
                <ScheduleClassBlock
                  key={meeting.id}
                  classItem={classItem}
                  meeting={meeting}
                  course={coursesById.get(classItem.courseId)}
                  hasConflict={conflictingClassIds.has(classItem.id)}
                  onClick={() => onSelectedClassClick(classItem.id)}
                />
              )),
            )}
            {previewClass &&
              (meetingsByClassId.get(previewClass.id) ?? []).map((meeting) => (
                <ScheduleClassBlock
                  key={`preview-${meeting.id}`}
                  classItem={previewClass}
                  meeting={meeting}
                  preview
                />
              ))}
          </div>
          <div className="grid shrink-0 grid-cols-[3.5rem_repeat(6,minmax(6.5rem,1fr))]">
            <div className="border-b border-strong-border/40 pr-2 text-right text-xs text-muted-foreground">
              {String(endHour).padStart(2, '0')}:00
            </div>
            {days.map(([day]) => (
              <div key={day} className="border-b border-l border-strong-border/30" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ScheduleClassBlock({
  classItem,
  meeting,
  course,
  hasConflict = false,
  preview = false,
  onClick,
}: {
  classItem: SemesterClass
  meeting: ClassMeeting
  course?: SemesterCourse
  hasConflict?: boolean
  preview?: boolean
  onClick?: () => void
}) {
  const dayIndex = days.findIndex(([day]) => day === meeting.dayOfWeek)
  const top =
    ((minutes(meeting.start) - startHour * 60) /
      ((endHour - startHour) * 60)) *
    100
  const height =
    ((minutes(meeting.end) - minutes(meeting.start)) /
      ((endHour - startHour) * 60)) *
    100
  const className = `absolute overflow-hidden rounded border-2 border-primary bg-primary/10 p-1 text-left text-[11px] font-bold ${preview ? 'pointer-events-none z-20 border-dashed opacity-45' : `z-10 shadow-sm ${hasConflict ? 'ring-2 ring-destructive' : ''}`}`
  const style = {
    left: `calc(3.5rem + ${dayIndex} * (100% - 3.5rem) / 6 + 3px)`,
    width: 'calc((100% - 3.5rem) / 6 - 6px)',
    top: `${top}%`,
    height: `${height}%`,
  }

  if (preview) {
    return (
      <div className={className} style={style}>
        {classItem.courseCode} · {classItem.code}
      </div>
    )
  }

  return (
    <button
      className={className}
      style={style}
      title={`${course?.name ?? classItem.courseCode} — Turma ${classItem.code}`}
      onClick={onClick}
    >
      <span className="block truncate">
        {classItem.courseCode} · {classItem.code}
      </span>
      <span className="block truncate font-medium">{meeting.roomCode}</span>
    </button>
  )
}
