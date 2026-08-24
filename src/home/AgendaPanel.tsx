import { useQuery } from '@tanstack/react-query'
import {
  AlertCircle,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Utensils,
} from 'lucide-react'
import { useState } from 'react'

import type {
  StudentClassSchedule,
  StudentCourseAttempt,
} from '@/student/data/studentApi'
import type { StudentAbsence } from '@/student/data/studentAbsenceApi'
import type { ClassOccurrence } from '@/student/absences/studentAbsences'
import type { StudentAbsenceController } from '@/student/absences/useStudentAbsences'
import type { DailyMeal } from '@/home/dailyMenuApi'
import type { TodayClassStatus } from '@/home/todayClasses'
import { ApiError } from '@/api/errors'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StudentAbsenceAction } from '@/student/absences/StudentAbsenceAction'
import {
  academicDateKey,
  findOccurrenceAbsence,
  occurrenceFromMeeting,
} from '@/student/absences/studentAbsences'
import { listDailyMenus } from '@/home/dailyMenuApi'
import {
  currentScheduleDay,
  dateFromAcademicDateKey,
  formatAcademicDate,
  shiftAcademicDate,
  sortTodayMeetings,
  statusForTodayMeeting,
} from '@/home/todayClasses'

type AgendaPanelProps = Readonly<{
  currentPeriodId: number | null
  currentPeriodCode: string
  attempts: ReadonlyArray<StudentCourseAttempt>
  meetings: ReadonlyArray<StudentClassSchedule>
  isLoading: boolean
  isError: boolean
  scheduleLoaded: boolean
  absenceController: StudentAbsenceController
  now?: Date
}>

type AgendaClassStatus = TodayClassStatus | 'scheduled'

const statusLabels: Readonly<Record<AgendaClassStatus, string>> = {
  finished: 'Encerrada',
  now: 'Agora',
  next: 'Próxima',
  later: 'Mais tarde',
  scheduled: 'Agendada',
}

const mealSlots: ReadonlyArray<
  readonly [DailyMeal['period'], DailyMeal['diet'], string]
> = [
  ['LUNCH', 'TRADITIONAL', 'Almoço'],
  ['LUNCH', 'VEGAN', 'Almoço'],
  ['DINNER', 'TRADITIONAL', 'Jantar'],
  ['DINNER', 'VEGAN', 'Jantar'],
]

function classStatus(
  selectedDate: string,
  today: string,
  meeting: StudentClassSchedule,
  meetings: ReadonlyArray<StudentClassSchedule>,
  now: Date,
): AgendaClassStatus {
  if (selectedDate < today) return 'finished'
  if (selectedDate > today) return 'scheduled'
  return statusForTodayMeeting(meeting, meetings, now)
}

export function DailyMealsPanel({ date }: { date: string }) {
  const menuQuery = useQuery({
    queryKey: ['daily-menus', date],
    queryFn: () => listDailyMenus(date),
    staleTime: 1000 * 60 * 5,
  })
  const menu = menuQuery.data?.find((item) => item.date === date)
  const meals = menu?.meals.filter((meal) => meal.status === 'AVAILABLE') ?? []

  return (
    <section className="grid gap-4 sm:grid-cols-2" aria-label="Refeições">
      {mealSlots.map(([period, diet, title]) => {
        const meal = meals.find(
          (item) => item.period === period && item.diet === diet,
        )

        return (
          <Card
            key={`${period}-${diet}`}
            className="p-4"
            aria-labelledby={`agenda-${period}-${diet}`}
          >
            <div className="flex items-center gap-2">
              <Utensils className="size-5 text-primary" />
              <h3 id={`agenda-${period}-${diet}`} className="font-extrabold">
                {title}
              </h3>
            </div>
            {menuQuery.isLoading ? (
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <LoaderCircle className="size-4 animate-spin" />
                Carregando cardápio
              </div>
            ) : menuQuery.isError ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Não foi possível carregar o cardápio.
              </p>
            ) : !meal ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Cardápio não disponível para esta data.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs font-black tracking-[0.12em] text-primary uppercase">
                    Prato principal
                  </p>
                  <p className="mt-1 text-sm font-bold">
                    {meal.mainDish ?? 'Prato principal não informado'}
                  </p>
                </div>
                {meal.serviceNotes.length > 0 && (
                  <div>
                    <p className="text-xs font-black tracking-[0.12em] text-primary uppercase">
                      Avisos
                    </p>
                    <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                      {meal.serviceNotes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <details className="border-t border-strong-border/30 pt-3">
                  <summary className="cursor-pointer text-sm font-bold text-primary">
                    Ver cardápio completo
                  </summary>
                  {meal.items.length > 0 || meal.observations.length > 0 ? (
                    <div className="mt-3 space-y-3 text-sm">
                      {meal.items.length > 0 && (
                        <div>
                          <p className="font-bold">Itens</p>
                          <ul className="mt-1 list-disc space-y-1 pl-4 text-muted-foreground">
                            {meal.items.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {meal.observations.length > 0 && (
                        <div>
                          <p className="font-bold">Observações</p>
                          <ul className="mt-1 list-disc space-y-1 pl-4 text-muted-foreground">
                            {meal.observations.map((observation) => (
                              <li key={observation}>{observation}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Nenhuma informação adicional.
                    </p>
                  )}
                </details>
              </div>
            )}
          </Card>
        )
      })}
    </section>
  )
}

export function AgendaPanel({
  currentPeriodId,
  currentPeriodCode,
  attempts,
  meetings,
  isLoading,
  isError,
  scheduleLoaded,
  absenceController,
  now = new Date(),
}: AgendaPanelProps) {
  const today = academicDateKey(now)
  const [selectedDate, setSelectedDate] = useState(today)
  const [lastRegistered, setLastRegistered] = useState<{
    absence: StudentAbsence
    occurrence: ClassOccurrence
  }>()
  const [noticeError, setNoticeError] = useState<string>()
  const selectedDateValue = dateFromAcademicDateKey(selectedDate)
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
  const agendaMeetings = sortTodayMeetings(
    meetings.filter(
      (meeting) => meeting.dayOfWeek === currentScheduleDay(selectedDateValue),
    ),
  )

  function changeDate(days: number) {
    setSelectedDate((date) => shiftAcademicDate(date, days))
    setLastRegistered(undefined)
    setNoticeError(undefined)
  }

  function resetToToday() {
    setSelectedDate(today)
    setLastRegistered(undefined)
    setNoticeError(undefined)
  }

  return (
    <section aria-labelledby="agenda-title">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black tracking-[0.14em] text-primary uppercase">
            {formatAcademicDate(selectedDateValue)}
          </p>
          <h2 id="agenda-title" className="mt-1 text-xl font-extrabold">
            Agenda
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            aria-label="Dia anterior"
            onClick={() => changeDate(-1)}
          >
            <ChevronLeft />
          </Button>
          {selectedDate !== today && (
            <Button size="sm" variant="outline" onClick={resetToToday}>
              Hoje
            </Button>
          )}
          <Button
            size="icon"
            variant="outline"
            aria-label="Próximo dia"
            onClick={() => changeDate(1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Card className="overflow-hidden">
          {isLoading ? (
            <div
              className="flex min-h-24 items-center justify-center gap-3 p-4"
              role="status"
            >
              <LoaderCircle className="size-5 animate-spin text-primary" />
              <span className="font-bold">Carregando aulas</span>
            </div>
          ) : isError ? (
            <Alert variant="destructive" className="m-4">
              <AlertCircle />
              <AlertTitle>Não foi possível carregar as aulas</AlertTitle>
              <AlertDescription>
                As demais informações da Agenda continuam disponíveis.
              </AlertDescription>
            </Alert>
          ) : periodAttempts.length === 0 ? (
            <div className="flex min-h-24 items-center gap-3 p-4">
              <CalendarClock className="size-5 shrink-0 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Você não possui disciplinas cursando em {currentPeriodCode}.
              </p>
            </div>
          ) : agendaMeetings.length === 0 ? (
            <div className="flex min-h-24 items-center gap-3 p-4">
              <CalendarClock className="size-5 shrink-0 text-muted-foreground" />
              <p className="font-bold">Você não tem aulas nesta data.</p>
            </div>
          ) : (
            <ol className="divide-y divide-strong-border/30">
              {agendaMeetings.map((meeting) => {
                const attempt = attemptsByClass.get(meeting.classId)
                const status = classStatus(
                  selectedDate,
                  today,
                  meeting,
                  agendaMeetings,
                  now,
                )
                const occurrence = attempt
                  ? occurrenceFromMeeting(attempt, meeting, selectedDate)
                  : undefined
                const absence = occurrence
                  ? findOccurrenceAbsence(
                      absenceController.absences,
                      occurrence,
                    )
                  : undefined
                const professors = attempt?.class?.professors
                  .map((professor) => professor.name)
                  .join(', ')
                return (
                  <li
                    key={meeting.id}
                    className="grid gap-2 px-4 py-3 sm:grid-cols-[7rem_minmax(0,1fr)_auto_auto] sm:items-center sm:gap-4"
                  >
                    <div>
                      <strong className="block tabular-nums">
                        {meeting.start}-{meeting.end}
                      </strong>
                      <span className="text-xs font-bold text-primary">
                        {statusLabels[status]}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-extrabold">
                        {meeting.courseCode}
                        {attempt?.course.name
                          ? ` - ${attempt.course.name}`
                          : ''}
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
                    {occurrence && (
                      <StudentAbsenceAction
                        occurrence={occurrence}
                        absence={absence}
                        controller={absenceController}
                        disabled={
                          absenceController.isLoading ||
                          absenceController.isError
                        }
                        onRegistered={(created, registeredOccurrence) => {
                          setNoticeError(undefined)
                          setLastRegistered({
                            absence: created,
                            occurrence: registeredOccurrence,
                          })
                        }}
                        onRemoved={() => {
                          setNoticeError(undefined)
                          setLastRegistered(undefined)
                        }}
                      />
                    )}
                  </li>
                )
              })}
            </ol>
          )}
          {incompleteAttempts > 0 && (
            <p className="border-t border-strong-border/30 px-4 py-2 text-xs text-muted-foreground">
              Agenda parcial: {incompleteAttempts}{' '}
              {incompleteAttempts === 1
                ? 'disciplina não possui'
                : 'disciplinas não possuem'}{' '}
              turma ou horário cadastrado.
            </p>
          )}
          {absenceController.isError && (
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-strong-border/30 px-4 py-3 text-sm">
              <p className="text-muted-foreground">
                Não foi possível carregar o controle de faltas.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => void absenceController.refetch()}
              >
                Tentar novamente
              </Button>
            </div>
          )}
          {lastRegistered && (
            <div
              className="flex flex-wrap items-center justify-between gap-2 border-t border-strong-border/30 bg-secondary/30 px-4 py-3 text-sm"
              aria-live="polite"
            >
              <p className="font-bold">
                Falta registrada em {lastRegistered.occurrence.courseCode}.
              </p>
              <Button
                size="sm"
                variant="outline"
                disabled={absenceController.isPending(
                  lastRegistered.occurrence,
                )}
                onClick={async () => {
                  try {
                    await absenceController.removeAbsence(
                      lastRegistered.absence,
                    )
                    setNoticeError(undefined)
                    setLastRegistered(undefined)
                  } catch (caught) {
                    if (caught instanceof ApiError && caught.status === 404) {
                      await absenceController.refetch()
                      setLastRegistered(undefined)
                      setNoticeError(undefined)
                      return
                    }
                    setNoticeError('Não foi possível desfazer a falta.')
                  }
                }}
              >
                Desfazer
              </Button>
              {noticeError && (
                <p
                  className="w-full text-xs font-semibold text-destructive"
                  role="alert"
                >
                  {noticeError}
                </p>
              )}
            </div>
          )}
        </Card>
        <DailyMealsPanel date={selectedDate} />
      </div>
    </section>
  )
}
