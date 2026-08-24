import { useEffect, useState } from 'react'

import {
  scheduleDays as days,
  scheduleEndHour as endHour,
  matchesGuideClass,
  scheduleMinutes as minutes,
  scheduleStartHour as startHour,
} from '@pomi/planner-domain/semester'
import type {
  ClassMeeting,
  GuideClassContext,
  SemesterClass,
  SemesterCourse,
  SemesterPlannerCommand,
} from '@pomi/planner-domain/semester'
import type { ProfessorEvaluationSummary } from '@/semester-planner/data/semesterPlanningApi'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import { Button } from '@/components/ui/button'

export function ClassesGuidePanel({
  courses,
  classes,
  meetings,
  selectedClassIds,
  classFilterCourseId,
  classFilterStart,
  classFilterEnd,
  classFilterDays,
  onCourseFilterChange,
  onStartChange,
  onEndChange,
  onDaysChange,
  guideClassContext,
  guideClassContextKey,
  professorEvaluationSummaries,
  onDispatch,
  onPreview,
}: {
  courses: ReadonlyArray<SemesterCourse>
  classes: ReadonlyArray<SemesterClass>
  meetings: ReadonlyArray<ClassMeeting>
  selectedClassIds: ReadonlySet<number>
  classFilterCourseId: string
  classFilterStart: string
  classFilterEnd: string
  classFilterDays: ReadonlyArray<string>
  onCourseFilterChange: (value: string) => void
  onStartChange: (value: string) => void
  onEndChange: (value: string) => void
  onDaysChange: (day: string) => void
  guideClassContext: GuideClassContext
  guideClassContextKey: string
  professorEvaluationSummaries: ReadonlyMap<
    number,
    ProfessorEvaluationSummary
  >
  onDispatch: (command: SemesterPlannerCommand) => void
  onPreview: (classId: number | undefined) => void
}) {
  const [disciplineFilterOpen, setDisciplineFilterOpen] = useState(
    Boolean(classFilterCourseId),
  )
  const [timeFilterOpen, setTimeFilterOpen] = useState(false)
  const [daysFilterOpen, setDaysFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const courseById = new Map(courses.map((course) => [course.id, course]))
  const filterStart = classFilterStart ? minutes(classFilterStart) : undefined
  const filterEnd = classFilterEnd ? minutes(classFilterEnd) : undefined
  const filteredClasses = classes.filter((classItem) => {
    if (!matchesGuideClass(classItem, guideClassContext)) return false
    if (
      disciplineFilterOpen &&
      classFilterCourseId &&
      classItem.courseId !== Number(classFilterCourseId)
    )
      return false
    const classMeetings = meetings.filter(
      (meeting) => meeting.classId === classItem.id,
    )
    if (
      daysFilterOpen &&
      classFilterDays.length > 0 &&
      !classMeetings.some((meeting) =>
        classFilterDays.includes(meeting.dayOfWeek),
      )
    )
      return false
    if (
      timeFilterOpen &&
      (filterStart !== undefined || filterEnd !== undefined)
    ) {
      const start = filterStart ?? 0
      const end = filterEnd ?? 24 * 60
      if (
        !classMeetings.some(
          (meeting) =>
            minutes(meeting.start) < end && minutes(meeting.end) > start,
        )
      )
        return false
    }
    return true
  })
  const courseOptions = courses.map((course) => ({
    value: String(course.id),
    label: `${course.code} — ${course.name}`,
  }))
  const hourOptions = Array.from(
    { length: endHour - startHour + 1 },
    (_, index) => `${String(startHour + index).padStart(2, '0')}:00`,
  )
  const pageSize = 20
  const pageCount = Math.max(1, Math.ceil(filteredClasses.length / pageSize))
  const visibleClasses = filteredClasses.slice(
    (page - 1) * pageSize,
    page * pageSize,
  )

  useEffect(() => {
    setPage(1)
  }, [
    guideClassContextKey,
    classFilterCourseId,
    classFilterStart,
    classFilterEnd,
    classFilterDays,
  ])

  useEffect(() => {
    if (classFilterCourseId) setDisciplineFilterOpen(true)
  }, [classFilterCourseId])

  useEffect(() => {
    if (classFilterStart || classFilterEnd) setTimeFilterOpen(true)
  }, [classFilterStart, classFilterEnd])

  useEffect(() => {
    if (classFilterDays.length) setDaysFilterOpen(true)
  }, [classFilterDays])

  return (
    <section className="space-y-3">
      <div className="space-y-2 rounded-md border-2 border-strong-border p-3">
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={disciplineFilterOpen ? 'default' : 'outline'}
            onClick={() => setDisciplineFilterOpen((current) => !current)}
          >
            Disciplina
          </Button>
          <Button
            size="sm"
            variant={timeFilterOpen ? 'default' : 'outline'}
            onClick={() => setTimeFilterOpen((current) => !current)}
          >
            Horário
          </Button>
          <Button
            size="sm"
            variant={daysFilterOpen ? 'default' : 'outline'}
            onClick={() => setDaysFilterOpen((current) => !current)}
          >
            Dias
          </Button>
        </div>
        {disciplineFilterOpen && (
          <AutocompleteSelect
            ariaLabel="Filtrar turmas por disciplina"
            value={classFilterCourseId}
            emptyLabel="Todas as disciplinas"
            options={courseOptions}
            placeholder="Disciplina"
            onValueChange={onCourseFilterChange}
          />
        )}
        {timeFilterOpen && (
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-bold">
              A partir de
              <select
                value={classFilterStart}
                onChange={(event) => onStartChange(event.target.value)}
                className="mt-1 h-9 w-full rounded-md border-2 border-input bg-background px-2 text-sm"
              >
                <option value="">Qualquer</option>
                {hourOptions.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-bold">
              Até
              <select
                value={classFilterEnd}
                onChange={(event) => onEndChange(event.target.value)}
                className="mt-1 h-9 w-full rounded-md border-2 border-input bg-background px-2 text-sm"
              >
                <option value="">Qualquer</option>
                {hourOptions.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
        {daysFilterOpen && (
          <div className="flex flex-wrap gap-1">
            {days.map(([day, label]) => (
              <button
                key={day}
                type="button"
                className={`rounded border px-2 py-1 text-xs font-bold ${classFilterDays.includes(day) ? 'border-primary bg-primary text-primary-foreground' : 'border-strong-border'}`}
                onClick={() => onDaysChange(day)}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="text-xs font-semibold text-muted-foreground">
        {filteredClasses.length} turma{filteredClasses.length === 1 ? '' : 's'}{' '}
        encontrada{filteredClasses.length === 1 ? '' : 's'}
      </p>
      {visibleClasses.map((classItem) => {
        const course = courseById.get(classItem.courseId)
        const classMeetings = meetings.filter(
          (meeting) => meeting.classId === classItem.id,
        )
        const selected = selectedClassIds.has(classItem.id)
        const currentClass = classes.find(
          (item) =>
            item.courseId === classItem.courseId &&
            selectedClassIds.has(item.id),
        )
        return (
          <article
            key={classItem.id}
            className="space-y-2 rounded-md border-2 border-strong-border p-3"
            onMouseEnter={() => onPreview(classItem.id)}
            onMouseLeave={() => onPreview(undefined)}
            onFocus={() => onPreview(classItem.id)}
            onBlur={() => onPreview(undefined)}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-extrabold">
                  {course?.code ?? classItem.courseCode} · Turma{' '}
                  {classItem.code}
                </h3>
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
                            <p className="mt-1 text-foreground">
                              {summary.responseCount} avaliações · Voltaria{' '}
                              {summary.wouldTakeAgain.toFixed(1)} · Justiça{' '}
                              {summary.fairness.toFixed(1)} · Clareza{' '}
                              {summary.clarity.toFixed(1)} · Dificuldade{' '}
                              {summary.difficulty.toFixed(1)}
                            </p>
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
                variant={selected ? 'ghost' : 'outline'}
                onClick={() =>
                  onDispatch({
                    type: selected
                      ? 'removeClass'
                      : currentClass
                        ? 'replaceClass'
                        : 'addClass',
                    classId: classItem.id,
                  })
                }
              >
                {selected ? 'Remover' : currentClass ? 'Trocar' : 'Adicionar'}
              </Button>
            </div>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {classMeetings.map((meeting) => (
                <li key={meeting.id}>
                  {days.find(([day]) => day === meeting.dayOfWeek)?.[1]}{' '}
                  {meeting.start}–{meeting.end} · {meeting.roomCode}
                </li>
              ))}
            </ul>
          </article>
        )
      })}
      {!filteredClasses.length && (
        <p className="p-3 text-sm text-muted-foreground">
          Nenhuma turma atende aos filtros atuais.
        </p>
      )}
      {filteredClasses.length > 0 && (
        <div className="flex items-center justify-between gap-3 border-t border-strong-border pt-3">
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
