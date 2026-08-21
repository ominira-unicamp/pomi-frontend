import { AlertCircle, CalendarX2, LoaderCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import type { StudentAbsenceController } from '@/student/absences/useStudentAbsences'
import type {
  StudentClassSchedule,
  StudentCourseAttempt,
} from '@/student/data/studentApi'
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
import { StudentAbsenceAction } from '@/student/absences/StudentAbsenceAction'
import {
  academicDateKey,
  findOccurrenceAbsence,
  formatOccurrenceDate,
  occurrencesForDate,
  recentClassOccurrences,
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

function OccurrenceRow({
  occurrence,
  controller,
}: {
  occurrence: ReturnType<typeof recentClassOccurrences>[number]
  controller: StudentAbsenceController
}) {
  const absence = findOccurrenceAbsence(controller.absences, occurrence)
  return (
    <li className="flex flex-col gap-3 border-b border-strong-border/30 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-extrabold capitalize">
          {formatOccurrenceDate(occurrence.date)}
        </p>
        <p className="text-sm text-muted-foreground">
          {occurrence.start} - {occurrence.end}
          {occurrence.roomCode ? ` - ${occurrence.roomCode}` : ''}
        </p>
      </div>
      <StudentAbsenceAction
        occurrence={occurrence}
        absence={absence}
        controller={controller}
      />
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
  const [visibleCount, setVisibleCount] = useState(8)
  const [manualDateOpen, setManualDateOpen] = useState(false)
  const [manualDate, setManualDate] = useState(today)
  const occurrences = useMemo(
    () =>
      recentClassOccurrences({
        attempt,
        meetings,
        periodStartDate,
        today,
      }),
    [attempt, meetings, periodStartDate, today],
  )
  const manualOccurrences = useMemo(
    () => occurrencesForDate(attempt, meetings, manualDate),
    [attempt, meetings, manualDate],
  )
  const absenceCount = controller.absences.filter(
    (absence) => absence.studentCourseAttemptId === attempt.id,
  ).length

  if (schedulesLoading || controller.isLoading)
    return (
      <div
        className="flex min-h-48 items-center justify-center gap-3"
        role="status"
      >
        <LoaderCircle className="size-5 animate-spin text-primary" />
        <span className="font-bold">Carregando aulas e faltas</span>
      </div>
    )

  if (schedulesError || controller.isError)
    return (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>Não foi possível carregar as aulas e faltas</AlertTitle>
        <AlertDescription>
          Tente abrir este painel novamente em alguns instantes.
        </AlertDescription>
      </Alert>
    )

  if (!attempt.classId || !attempt.studyPeriodId || meetings.length === 0)
    return (
      <Card className="flex min-h-40 items-center gap-3 p-5">
        <CalendarX2 className="size-6 shrink-0 text-muted-foreground" />
        <div>
          <p className="font-extrabold">Horários não disponíveis</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Informe o período e uma turma com horários cadastrados para
            controlar as faltas.
          </p>
        </div>
      </Card>
    )

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
      <div className="mb-3 flex items-center justify-between gap-3 border-b border-strong-border/30 py-3">
        <p className="text-sm font-bold">
          {absenceCount}{' '}
          {absenceCount === 1 ? 'falta registrada' : 'faltas registradas'}
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setManualDateOpen((current) => !current)}
        >
          Escolher outra data
        </Button>
      </div>

      {manualDateOpen && (
        <section className="mb-4 rounded-md border-2 border-strong-border bg-secondary/30 p-3">
          <label className="block text-sm font-bold">
            Data da aula
            <input
              type="date"
              value={manualDate}
              min={periodStartDate}
              max={today}
              onChange={(event) => setManualDate(event.target.value)}
              className="mt-1 h-10 w-full rounded-md border-2 border-strong-border bg-background px-3"
            />
          </label>
          <div className="mt-3">
            {manualOccurrences.length ? (
              <ul>
                {manualOccurrences.map((occurrence) => (
                  <OccurrenceRow
                    key={`${occurrence.classScheduleId}:${occurrence.date}`}
                    occurrence={occurrence}
                    controller={controller}
                  />
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Esta turma não possui aula cadastrada nessa data.
              </p>
            )}
          </div>
        </section>
      )}

      <h3 className="font-extrabold">Aulas recentes</h3>
      {occurrences.length ? (
        <ul className="mt-1">
          {occurrences.slice(0, visibleCount).map((occurrence) => (
            <OccurrenceRow
              key={`${occurrence.classScheduleId}:${occurrence.date}`}
              occurrence={occurrence}
              controller={controller}
            />
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          Nenhuma aula recente foi encontrada para esta turma.
        </p>
      )}
      {visibleCount < occurrences.length && (
        <Button
          className="mt-3 w-full"
          variant="outline"
          onClick={() => setVisibleCount((current) => current + 8)}
        >
          Mostrar anteriores
        </Button>
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
