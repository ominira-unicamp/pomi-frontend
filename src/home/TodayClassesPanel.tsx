import { AlertCircle, ArrowRight, CalendarClock, LoaderCircle } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type {
  StudentClassSchedule,
  StudentCourseAttempt,
} from '@/student/data/studentApi'
import type { TodayClassStatus } from '@/home/todayClasses'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card } from '@/components/ui/card'
import {
  currentScheduleDay,
  formatAcademicDate,
  sortTodayMeetings,
  statusForTodayMeeting,
} from '@/home/todayClasses'

type TodayClassesPanelProps = Readonly<{
  currentPeriodId: number | null
  currentPeriodCode: string
  attempts: ReadonlyArray<StudentCourseAttempt>
  meetings: ReadonlyArray<StudentClassSchedule>
  isLoading: boolean
  isError: boolean
  scheduleLoaded: boolean
  now?: Date
}>

const statusLabels: Readonly<Record<TodayClassStatus, string>> = {
  finished: 'Encerrada',
  now: 'Agora',
  next: 'Próxima',
  later: 'Mais tarde',
}

export function TodayClassesPanel({
  currentPeriodId,
  currentPeriodCode,
  attempts,
  meetings,
  isLoading,
  isError,
  scheduleLoaded,
  now = new Date(),
}: TodayClassesPanelProps) {
  const periodAttempts = attempts.filter(
    (attempt) =>
      attempt.status === 'ENROLLED' &&
      attempt.studyPeriodId === currentPeriodId,
  )
  const attemptsByClass = new Map(
    periodAttempts.flatMap((attempt) =>
      attempt.classId ? [[attempt.classId, attempt] as const] : [],
    ),
  )
  const scheduledClassIds = new Set(meetings.map((meeting) => meeting.classId))
  const incompleteAttempts = periodAttempts.filter(
    (attempt) =>
      !attempt.classId ||
      (scheduleLoaded && !scheduledClassIds.has(attempt.classId)),
  ).length
  const todayMeetings = sortTodayMeetings(
    meetings.filter(
      (meeting) => meeting.dayOfWeek === currentScheduleDay(now),
    ),
  )

  return (
    <section aria-labelledby="today-classes-title">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black tracking-[0.14em] text-primary uppercase">
            {formatAcademicDate(now)}
          </p>
          <h2 id="today-classes-title" className="mt-1 text-xl font-extrabold">
            Aulas de hoje
          </h2>
        </div>
        <Link
          to="/situacao-do-curso"
          className="pomi-focus inline-flex items-center gap-1 rounded-sm text-sm font-bold underline underline-offset-4"
        >
          Ver agenda completa <ArrowRight className="size-4" />
        </Link>
      </div>

      {periodAttempts.length === 0 ? (
        <Card className="flex items-center gap-3 p-4">
          <CalendarClock className="size-5 shrink-0 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Você não possui disciplinas cursando em {currentPeriodCode}.
          </p>
        </Card>
      ) : isLoading ? (
        <Card className="flex min-h-24 items-center justify-center gap-3 p-4" role="status">
          <LoaderCircle className="size-5 animate-spin text-primary" />
          <span className="font-bold">Carregando aulas de hoje</span>
        </Card>
      ) : isError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Não foi possível carregar as aulas de hoje</AlertTitle>
          <AlertDescription>
            Sua situação acadêmica e os demais atalhos continuam disponíveis.
          </AlertDescription>
        </Alert>
      ) : (
        <Card className="overflow-hidden">
          {todayMeetings.length === 0 ? (
            <div className="flex min-h-24 items-center gap-3 p-4">
              <CalendarClock className="size-5 shrink-0 text-muted-foreground" />
              <p className="font-bold">Você não tem aulas hoje.</p>
            </div>
          ) : (
            <ol className="divide-y divide-strong-border/30">
              {todayMeetings.map((meeting) => {
                const attempt = attemptsByClass.get(meeting.classId)
                const status = statusForTodayMeeting(meeting, todayMeetings, now)
                const professors = attempt?.class?.professors
                  .map((professor) => professor.name)
                  .join(', ')
                return (
                  <li
                    key={meeting.id}
                    className="grid gap-2 px-4 py-3 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-center sm:gap-4"
                  >
                    <div>
                      <strong className="block tabular-nums">
                        {meeting.start}–{meeting.end}
                      </strong>
                      <span className="text-xs font-bold text-primary">
                        {statusLabels[status]}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-extrabold">
                        {meeting.courseCode}
                        {attempt?.course.name ? ` — ${attempt.course.name}` : ''}
                      </p>
                      {professors && (
                        <p className="truncate text-sm text-muted-foreground">
                          {professors}
                        </p>
                      )}
                    </div>
                    <div className="text-sm sm:text-right">
                      <p className="font-bold">Turma {meeting.classCode}</p>
                      <p className="text-muted-foreground">
                        {meeting.roomCode || 'Sala não informada'}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ol>
          )}
          {incompleteAttempts > 0 && (
            <p className="border-t border-strong-border/30 px-4 py-2 text-xs text-muted-foreground">
              Agenda parcial: {incompleteAttempts}{' '}
              {incompleteAttempts === 1 ? 'disciplina não possui' : 'disciplinas não possuem'}{' '}
              turma ou horário cadastrado.
            </p>
          )}
        </Card>
      )}
    </section>
  )
}
