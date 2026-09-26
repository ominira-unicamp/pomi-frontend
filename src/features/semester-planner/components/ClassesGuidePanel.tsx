import { useEffect, useState } from 'react'
import { scheduleDays as days } from '@pomi/planner-domain/semester'
import type {
  ClassMeeting,
  SemesterClass,
  SemesterCourse,
  SemesterPlannerCommand,
} from '@pomi/planner-domain/semester'

import type { ProfessorEvaluationSummary } from '@/features/semester-planner/data/semesterPlanningApi'
import { classConflictsWithSelection } from '@/features/semester-planner/model/semesterPlannerView'
import { Button } from '@/components/ui/button'

export function ClassesGuidePanel({
  courses,
  classes,
  allClasses,
  meetings,
  selectedClassIds,
  professorEvaluationSummaries,
  onDispatch,
  onPreview,
  onSelectedClassClick,
}: {
  courses: ReadonlyArray<SemesterCourse>
  classes: ReadonlyArray<SemesterClass>
  allClasses: ReadonlyArray<SemesterClass>
  meetings: ReadonlyArray<ClassMeeting>
  selectedClassIds: ReadonlySet<number>
  professorEvaluationSummaries: ReadonlyMap<number, ProfessorEvaluationSummary>
  onDispatch: (command: SemesterPlannerCommand) => void
  onPreview: (classId: number | undefined) => void
  onSelectedClassClick?: (classId: number) => void
}) {
  const [page, setPage] = useState(1)
  const courseById = new Map(courses.map((course) => [course.id, course]))
  const selectedClasses = allClasses.filter((classItem) =>
    selectedClassIds.has(classItem.id),
  )
  const pageSize = 20
  const pageCount = Math.max(1, Math.ceil(classes.length / pageSize))
  const visibleClasses = classes.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => setPage(1), [classes])

  return (
    <section className="-mx-3 divide-y divide-border">
      {visibleClasses.map((classItem) => {
        const course = courseById.get(classItem.courseId)
        const classMeetings = meetings.filter(
          (meeting) => meeting.classId === classItem.id,
        )
        const meetingGroups = groupMeetings(classMeetings)
        const selected = selectedClassIds.has(classItem.id)
        const currentClass = allClasses.find(
          (item) =>
            item.courseId === classItem.courseId &&
            selectedClassIds.has(item.id),
        )
        const hasConflict = classConflictsWithSelection({
          classItem,
          selectedClasses,
          meetings,
        })
        return (
          <article
            key={classItem.id}
            className={`space-y-2 px-3 py-3 hover:bg-muted/40 ${hasConflict ? 'border-l-4 border-chart-4 bg-chart-4/5' : selected ? 'border-l-4 border-primary bg-primary/5' : ''}`}
            onMouseEnter={() => onPreview(classItem.id)}
            onMouseLeave={() => onPreview(undefined)}
            onFocus={() => onPreview(classItem.id)}
            onBlur={() => onPreview(undefined)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm font-extrabold">
                  {course?.code ?? classItem.courseCode} · Turma{' '}
                  {classItem.code}
                </h3>
                {course && (
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {course.name} · {course.credits} créditos
                  </p>
                )}
                {classItem.professors.length ? (
                  <div className="mt-1 space-y-2">
                    {classItem.professors.map((professor) => {
                      const summary = professorEvaluationSummaries.get(
                        professor.id,
                      )
                      return (
                        <div key={professor.id} className="text-xs">
                          <p className="text-muted-foreground">
                            {professor.name}
                          </p>
                          {summary && (
                            <details className="mt-1 text-foreground">
                              <summary className="cursor-pointer">
                                {summary.responseCount} avaliações · Voltaria{' '}
                                {summary.wouldTakeAgain.toFixed(1)}
                              </summary>
                              <p className="mt-1 text-muted-foreground">
                                Justiça {summary.fairness.toFixed(1)} · Clareza{' '}
                                {summary.clarity.toFixed(1)} · Dificuldade{' '}
                                {summary.difficulty.toFixed(1)}
                              </p>
                            </details>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Professor não informado
                  </p>
                )}
              </div>
              <Button
                size="sm"
                variant={
                  selected ? 'ghost' : currentClass ? 'outline' : 'default'
                }
                onClick={() => {
                  if (selected) {
                    onSelectedClassClick?.(classItem.id)
                    return
                  }
                  onDispatch({
                    type: currentClass ? 'replaceClass' : 'addClass',
                    classId: classItem.id,
                  })
                }}
              >
                {selected
                  ? 'Selecionada'
                  : currentClass
                    ? 'Trocar turma'
                    : 'Adicionar'}
              </Button>
            </div>
            {hasConflict && !selected && (
              <p className="text-xs font-bold text-chart-4">
                Conflita com uma turma selecionada
              </p>
            )}
            <ul className="space-y-0.5 text-xs text-muted-foreground">
              {meetingGroups.map((meeting) => (
                <li key={meeting.key}>
                  {meeting.dayLabel} {meeting.start}–{meeting.end}
                  {meeting.rooms.length > 0
                    ? ` · ${meeting.rooms.join(', ')}`
                    : ''}
                </li>
              ))}
            </ul>
          </article>
        )
      })}
      {!classes.length && (
        <p className="p-3 text-sm text-muted-foreground">
          Nenhuma turma atende aos filtros atuais.
        </p>
      )}
      {pageCount > 1 && (
        <div className="flex items-center justify-between gap-3 px-3 pt-3">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Anterior
          </Button>
          <span className="text-xs font-semibold text-muted-foreground">
            Página {page} de {pageCount}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={page === pageCount}
            onClick={() =>
              setPage((current) => Math.min(pageCount, current + 1))
            }
          >
            Próxima
          </Button>
        </div>
      )}
    </section>
  )
}

function groupMeetings(meetings: ReadonlyArray<ClassMeeting>) {
  const groups = new Map<
    string,
    {
      key: string
      dayLabel: string
      start: string
      end: string
      rooms: Array<string>
    }
  >()
  for (const meeting of meetings) {
    const key = `${meeting.dayOfWeek}-${meeting.start}-${meeting.end}`
    const existing = groups.get(key)
    if (existing) {
      if (meeting.roomCode && !existing.rooms.includes(meeting.roomCode))
        existing.rooms.push(meeting.roomCode)
      continue
    }
    groups.set(key, {
      key,
      dayLabel:
        days.find(([day]) => day === meeting.dayOfWeek)?.[1] ??
        meeting.dayOfWeek,
      start: meeting.start,
      end: meeting.end,
      rooms: meeting.roomCode ? [meeting.roomCode] : [],
    })
  }
  return [...groups.values()]
}
