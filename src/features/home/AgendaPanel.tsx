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
} from '@/features/student/data/studentApi'
import type { StudentAbsence } from '@/features/student/data/studentAbsenceApi'
import type { ClassOccurrence } from '@/features/student/absences/studentAbsences'
import type { StudentAbsenceController } from '@/features/student/absences/useStudentAbsences'
import type { DailyMeal } from '@/features/home/dailyMenuApi'
import type { TodayClassStatus } from '@/features/home/todayClasses'
import { ApiError } from '@/api/errors'
import { ResponsiveDialog } from '@/components/patterns/ResponsiveDialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StudentAbsenceAction } from '@/features/student/absences/StudentAbsenceAction'
import {
  academicDateKey,
  findOccurrenceAbsence,
  occurrenceFromMeeting,
} from '@/features/student/absences/studentAbsences'
import { listDailyMenus } from '@/features/home/dailyMenuApi'
import { publicQueryKeys } from '@/integrations/tanstack-query/queryKeys'
import {
  currentScheduleDay,
  dateFromAcademicDateKey,
  formatAcademicDate,
  shiftAcademicDate,
  sortTodayMeetings,
  statusForTodayMeeting,
} from '@/features/home/todayClasses'

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
  ['LUNCH', 'VEGAN', 'Almoço vegano'],
  ['DINNER', 'TRADITIONAL', 'Jantar'],
  ['DINNER', 'VEGAN', 'Jantar vegano'],
]

function mealTitle(meal: DailyMeal) {
  return (
    mealSlots.find(
      ([period, diet]) => period === meal.period && diet === meal.diet,
    )?.[2] ?? 'Refeição'
  )
}

function distinctNotes(notes: ReadonlyArray<string>) {
  return [...new Set(notes.map((note) => note.trim()).filter(Boolean))]
}

function commonNotes(meals: ReadonlyArray<DailyMeal>) {
  if (meals.length === 0) return []
  return distinctNotes(meals[0].serviceNotes).filter((note) =>
    meals.every((meal) => distinctNotes(meal.serviceNotes).includes(note)),
  )
}

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
  const [selectedMeal, setSelectedMeal] = useState<DailyMeal>()
  const menuQuery = useQuery({
    queryKey: publicQueryKeys.dailyMenus(date),
    queryFn: () => listDailyMenus(date),
    staleTime: 1000 * 60 * 5,
  })
  const menu = menuQuery.data?.find((item) => item.date === date)
  const meals = menu?.meals.filter((meal) => meal.status === 'AVAILABLE') ?? []
  const sharedNotes = commonNotes(meals)
  const selectedMealTitle = selectedMeal ? mealTitle(selectedMeal) : 'Refeição'
  const details = selectedMeal && (
    <div className="space-y-5 text-sm">
      <div>
        <h4 className="font-extrabold">Prato principal</h4>
        <p className="mt-1 text-muted-foreground">
          {selectedMeal.mainDish ?? 'Prato principal não informado'}
        </p>
      </div>
      {selectedMeal.items.length > 0 && (
        <div>
          <h4 className="font-extrabold">Itens</h4>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-muted-foreground">
            {selectedMeal.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {selectedMeal.serviceNotes.length > 0 && (
        <div>
          <h4 className="font-extrabold">Avisos</h4>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-muted-foreground">
            {distinctNotes(selectedMeal.serviceNotes).map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      )}
      {selectedMeal.observations.length > 0 && (
        <div>
          <h4 className="font-extrabold">Observações</h4>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-muted-foreground">
            {selectedMeal.observations.map((observation) => (
              <li key={observation}>{observation}</li>
            ))}
          </ul>
        </div>
      )}
      {selectedMeal.items.length === 0 &&
        selectedMeal.serviceNotes.length === 0 &&
        selectedMeal.observations.length === 0 && (
          <p className="text-muted-foreground">Nenhuma informação adicional.</p>
        )}
    </div>
  )
  const closeDetails = (open: boolean) => {
    if (!open) setSelectedMeal(undefined)
  }

  return (
    <section aria-label="Refeições">
      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 border-b border-strong-border/30 p-3 sm:px-4">
          <Utensils className="size-5 text-primary" />
          <h3 className="font-extrabold">Cardápio</h3>
        </div>
        {menuQuery.isLoading ? (
          <div className="flex min-h-24 items-center justify-center gap-2 p-4 text-sm text-muted-foreground">
            <LoaderCircle className="size-4 animate-spin" />
            Carregando cardápio
          </div>
        ) : menuQuery.isError ? (
          <p className="p-4 text-sm text-muted-foreground">
            Não foi possível carregar o cardápio.
          </p>
        ) : meals.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">
            Cardápio não disponível para esta data.
          </p>
        ) : (
          <>
            <div className="grid md:grid-cols-2">
              {mealSlots.map(([period, diet, title]) => {
                const meal = meals.find(
                  (item) => item.period === period && item.diet === diet,
                )
                const specificNotes = meal
                  ? distinctNotes(meal.serviceNotes).filter(
                      (note) => !sharedNotes.includes(note),
                    )
                  : []

                return meal ? (
                  <button
                    key={`${period}-${diet}`}
                    type="button"
                    aria-label={`Ver detalhes de ${title}`}
                    onClick={() => setSelectedMeal(meal)}
                    className="pomi-focus group min-h-20 border-b border-strong-border/30 p-3 text-left transition-colors hover:bg-secondary/30 md:odd:border-r"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-xs font-black tracking-[0.12em] text-primary uppercase">
                        {title}
                      </h4>
                      <ChevronRight className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="mt-1 text-sm font-bold">
                      {meal.mainDish ?? 'Prato principal não informado'}
                    </p>
                    {specificNotes.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-black tracking-[0.12em] text-primary uppercase">
                          Avisos
                        </p>
                        <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                          {specificNotes.map((note) => (
                            <li key={note}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </button>
                ) : (
                  <div
                    key={`${period}-${diet}`}
                    className="min-h-20 border-b border-strong-border/30 p-3 md:odd:border-r"
                  >
                    <h4 className="text-xs font-black tracking-[0.12em] text-primary uppercase">
                      {title}
                    </h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Refeição não disponível para esta data.
                    </p>
                  </div>
                )
              })}
            </div>
            {sharedNotes.length > 0 && (
              <div className="bg-secondary/20 p-3 sm:px-4">
                <h4 className="font-extrabold">Avisos gerais</h4>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                  {sharedNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </Card>
      <ResponsiveDialog
        open={Boolean(selectedMeal)}
        onOpenChange={closeDetails}
        title={selectedMealTitle}
        description="Detalhes do cardápio selecionado."
        sheetContentClassName="max-h-[85dvh]"
      >
        {details}
      </ResponsiveDialog>
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
