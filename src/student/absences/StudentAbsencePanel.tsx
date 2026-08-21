import { AlertCircle, CalendarX2, LoaderCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import type { StudentAbsenceController } from '@/student/absences/useStudentAbsences'
import type {
  StudentClassSchedule,
  StudentCourseAttempt,
} from '@/student/data/studentApi'
import type { StudentAbsence } from '@/student/data/studentAbsenceApi'
import { ApiError } from '@/api/errors'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  academicDateKey,
  formatOccurrenceDate,
  occurrenceFromMeeting,
} from '@/student/absences/studentAbsences'
import { listClassSchedulesByStudyPeriod } from '@/student/data/studentApi'

type StudentAbsencePanelProps = Readonly<{
  open: boolean
  onOpenChange: (open: boolean) => void
  attempt: StudentCourseAttempt
  periodStartDate?: string
  controller: StudentAbsenceController
  today?: string
}>

const weekdayLabels: Record<StudentClassSchedule['dayOfWeek'], string> = {
  MONDAY: 'Segunda-feira',
  TUESDAY: 'Terça-feira',
  WEDNESDAY: 'Quarta-feira',
  THURSDAY: 'Quinta-feira',
  FRIDAY: 'Sexta-feira',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo',
}

const weekdayOffsets: Record<StudentClassSchedule['dayOfWeek'], number> = {
  MONDAY: 0,
  TUESDAY: 1,
  WEDNESDAY: 2,
  THURSDAY: 3,
  FRIDAY: 4,
  SATURDAY: 5,
  SUNDAY: 6,
}

function parseDateKey(value: string) {
  return new Date(`${value.slice(0, 10)}T12:00:00.000Z`)
}

function dateKey(value: Date) {
  return [
    value.getUTCFullYear(),
    String(value.getUTCMonth() + 1).padStart(2, '0'),
    String(value.getUTCDate()).padStart(2, '0'),
  ].join('-')
}

function addDays(value: string, days: number) {
  const date = parseDateKey(value)
  date.setUTCDate(date.getUTCDate() + days)
  return dateKey(date)
}

function weekStart(value: string) {
  const date = parseDateKey(value)
  const offset = (date.getUTCDay() + 6) % 7
  date.setUTCDate(date.getUTCDate() - offset)
  return dateKey(date)
}

function formatWeekLabel(start: string) {
  const end = addDays(start, 6)
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'UTC',
  })
  return `${formatter.format(parseDateKey(start))} a ${formatter.format(parseDateKey(end))}`
}

function availableWeeks(periodStartDate: string | undefined, today: string) {
  const fallbackStart = addDays(today, -180)
  const earliest = weekStart(periodStartDate ?? fallbackStart)
  const current = weekStart(today)
  const weeks: Array<{ value: string; label: string }> = []

  for (let cursor = current; cursor >= earliest; cursor = addDays(cursor, -7)) {
    weeks.push({ value: cursor, label: formatWeekLabel(cursor) })
  }

  return weeks
}

function durationMinutes(start: string, end: string) {
  const [startHour, startMinute] = start.split(':').map(Number)
  const [endHour, endMinute] = end.split(':').map(Number)
  return Math.max(0, endHour * 60 + endMinute - (startHour * 60 + startMinute))
}

function formatMissedHours(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  if (!minutes) return 'Nenhuma hora faltada'
  if (!remainder) return `${hours} ${hours === 1 ? 'hora' : 'horas'} faltadas`
  return `${hours}h${String(remainder).padStart(2, '0')} faltadas`
}

function useDesktopLayout() {
  const [desktop, setDesktop] = useState(
    () => window.matchMedia('(min-width: 640px)').matches,
  )

  useEffect(() => {
    const media = window.matchMedia('(min-width: 640px)')
    const update = () => setDesktop(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return desktop
}

function absenceErrorMessage(error: unknown, action: 'registrar' | 'remover') {
  if (error instanceof ApiError) {
    if (error.status === 409) return 'Essa falta já está registrada.'
    if (error.status === 404)
      return action === 'remover'
        ? 'Essa falta já havia sido removida.'
        : 'A aula selecionada não foi encontrada.'
    return error.problem?.detail ?? `Não foi possível ${action} a falta.`
  }
  return `Não foi possível ${action} a falta.`
}

function AbsenceRow({
  absence,
  roomCode,
  controller,
  onError,
}: {
  absence: StudentAbsence
  roomCode?: string
  controller: StudentAbsenceController
  onError: (message: string) => void
}) {
  const occurrence = {
    courseAttemptId: absence.studentCourseAttemptId,
    classScheduleId: absence.classScheduleId,
    date: absence.date,
  }
  const pending = controller.isPending({
    ...occurrence,
    courseCode: absence.courseCode,
    courseName: '',
    classCode: absence.classCode,
    start: absence.start,
    end: absence.end,
    roomCode: roomCode ?? '',
  })

  async function remove() {
    onError('')
    try {
      await controller.removeAbsence(absence)
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        await controller.refetch()
      }
      onError(absenceErrorMessage(error, 'remover'))
    }
  }

  return (
    <li className="flex flex-col gap-3 border-b border-strong-border/30 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-extrabold capitalize">
          {formatOccurrenceDate(absence.date)}
        </p>
        <p className="text-sm text-muted-foreground">
          {absence.start} - {absence.end}
          {roomCode ? ` - ${roomCode}` : ''}
        </p>
      </div>
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => void remove()}
      >
        {pending ? <LoaderCircle className="animate-spin" /> : null}
        {pending ? 'Removendo...' : 'Desmarcar falta'}
      </Button>
    </li>
  )
}

function AbsencePanelBody({
  attempt,
  periodStartDate,
  controller,
  meetings,
  schedulesLoading,
  schedulesError,
  today,
}: {
  attempt: StudentCourseAttempt
  periodStartDate?: string
  controller: StudentAbsenceController
  meetings: ReadonlyArray<StudentClassSchedule>
  schedulesLoading: boolean
  schedulesError: boolean
  today: string
}) {
  const [formOpen, setFormOpen] = useState(false)
  const weeks = useMemo(
    () => availableWeeks(periodStartDate, today),
    [periodStartDate, today],
  )
  const [selectedWeek, setSelectedWeek] = useState('')
  const [selectedScheduleId, setSelectedScheduleId] = useState('')
  const [error, setError] = useState('')
  const absences = controller.absences
    .filter((absence) => absence.studentCourseAttemptId === attempt.id)
    .sort(
      (left, right) =>
        right.date.localeCompare(left.date) || right.id - left.id,
    )
  const meetingById = useMemo(
    () => new Map(meetings.map((meeting) => [meeting.id, meeting])),
    [meetings],
  )
  const missedMinutes = absences.reduce(
    (total, absence) => total + durationMinutes(absence.start, absence.end),
    0,
  )
  const selectedMeeting = meetings.find(
    (meeting) => String(meeting.id) === selectedScheduleId,
  )
  const selectedOccurrence =
    selectedWeek && selectedMeeting
      ? occurrenceFromMeeting(
          attempt,
          selectedMeeting,
          addDays(selectedWeek, weekdayOffsets[selectedMeeting.dayOfWeek]),
        )
      : undefined
  const scheduleOptions = meetings
    .map((meeting) => ({
      value: String(meeting.id),
      label: `${weekdayLabels[meeting.dayOfWeek]} - ${meeting.start} - ${meeting.end}${meeting.roomCode ? ` - ${meeting.roomCode}` : ''}`,
    }))
    .sort((left, right) => left.label.localeCompare(right.label, 'pt-BR'))

  function openForm() {
    setError('')
    setSelectedWeek(weeks[0]?.value ?? '')
    setSelectedScheduleId('')
    setFormOpen(true)
  }

  async function register() {
    if (!selectedOccurrence) return
    setError('')
    try {
      await controller.markAbsent(selectedOccurrence)
      setFormOpen(false)
    } catch (caught) {
      if (caught instanceof ApiError && caught.status === 409) {
        await controller.refetch()
      }
      setError(absenceErrorMessage(caught, 'registrar'))
    }
  }

  if (controller.isLoading)
    return (
      <div
        className="flex min-h-48 items-center justify-center gap-3"
        role="status"
      >
        <LoaderCircle className="size-5 animate-spin text-primary" />
        <span className="font-bold">Carregando faltas</span>
      </div>
    )

  if (controller.isError)
    return (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>Não foi possível carregar as faltas</AlertTitle>
        <AlertDescription>
          Tente abrir este painel novamente em alguns instantes.
        </AlertDescription>
      </Alert>
    )

  const canRegister = Boolean(
    attempt.classId &&
    attempt.studyPeriodId &&
    meetings.length &&
    !schedulesError,
  )

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
      <div className="mb-3 flex items-center justify-between gap-3 border-b border-strong-border/30 py-3">
        <p className="text-sm font-bold">{formatMissedHours(missedMinutes)}</p>
        <Button
          size="sm"
          variant="outline"
          disabled={!canRegister || schedulesLoading}
          onClick={openForm}
        >
          {schedulesLoading ? <LoaderCircle className="animate-spin" /> : null}
          Registrar falta
        </Button>
      </div>

      {!canRegister && !schedulesLoading && (
        <Card className="mb-4 flex items-center gap-3 p-4">
          <CalendarX2 className="size-5 shrink-0 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Horários não disponíveis para registrar uma nova falta nesta turma.
          </p>
        </Card>
      )}

      {formOpen && (
        <section className="mb-4 rounded-md border-2 border-strong-border bg-secondary/30 p-3">
          <h3 className="font-extrabold">Registrar falta</h3>
          <div className="mt-3 grid gap-3">
            <label className="grid gap-1 text-sm font-bold">
              Semana
              <AutocompleteSelect
                ariaLabel="Semana da falta"
                value={selectedWeek}
                onValueChange={(value) => setSelectedWeek(value)}
                options={weeks}
                placeholder="Escolha a semana"
              />
            </label>
            <label className="grid gap-1 text-sm font-bold">
              Aula
              <AutocompleteSelect
                ariaLabel="Aula da falta"
                value={selectedScheduleId}
                onValueChange={setSelectedScheduleId}
                options={scheduleOptions}
                placeholder="Escolha a aula"
              />
            </label>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={
                !selectedOccurrence || controller.isPending(selectedOccurrence)
              }
              onClick={() => void register()}
            >
              {selectedOccurrence &&
              controller.isPending(selectedOccurrence) ? (
                <LoaderCircle className="animate-spin" />
              ) : null}
              Registrar falta
            </Button>
          </div>
        </section>
      )}

      <h3 className="font-extrabold">Faltas registradas</h3>
      {absences.length ? (
        <ul className="mt-1">
          {absences.map((absence) => (
            <AbsenceRow
              key={absence.id}
              absence={absence}
              roomCode={meetingById.get(absence.classScheduleId)?.roomCode}
              controller={controller}
              onError={setError}
            />
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          Nenhuma falta registrada nesta disciplina.
        </p>
      )}
      {error && (
        <p className="mt-3 text-sm font-semibold text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export function StudentAbsencePanel({
  open,
  onOpenChange,
  attempt,
  periodStartDate,
  controller,
  today = academicDateKey(),
}: StudentAbsencePanelProps) {
  const desktop = useDesktopLayout()
  const schedulesQuery = useQuery({
    queryKey: [
      'course-situation',
      'class-schedules',
      String(attempt.studyPeriodId ?? ''),
    ],
    queryFn: () => listClassSchedulesByStudyPeriod(attempt.studyPeriodId!),
    enabled: open && Boolean(attempt.studyPeriodId),
    staleTime: Infinity,
  })
  const meetings = (schedulesQuery.data ?? []).filter(
    (meeting) => meeting.classId === attempt.classId,
  )
  const title = `${attempt.course.code} - ${attempt.course.name}`
  const content = (
    <AbsencePanelBody
      attempt={attempt}
      periodStartDate={periodStartDate}
      controller={controller}
      meetings={meetings}
      schedulesLoading={schedulesQuery.isLoading}
      schedulesError={schedulesQuery.isError}
      today={today}
    />
  )

  if (desktop)
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[85dvh] max-w-2xl flex-col overflow-hidden p-0">
          <DialogHeader className="border-b-2 border-strong-border p-5 pr-12">
            <DialogTitle>{title}</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Turma {attempt.class?.code ?? 'não informada'}
            </p>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[85dvh] rounded-t-xl bg-background text-foreground"
      >
        <SheetHeader className="border-b-2 border-strong-border pr-12">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            Turma {attempt.class?.code ?? 'não informada'}
          </SheetDescription>
        </SheetHeader>
        {content}
      </SheetContent>
    </Sheet>
  )
}
