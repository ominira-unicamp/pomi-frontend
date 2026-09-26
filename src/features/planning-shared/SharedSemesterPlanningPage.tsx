import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { CalendarDays, Copy, GraduationCap, MapPin, Users } from 'lucide-react'

import {
  copySharedPeriodPlanning,
  getPublicSharedPeriodPlanning,
  getSharedPeriodPlanningForStudent,
} from './data/sharedPeriodPlanningApi'
import type { WeeklyScheduleMeeting } from '@/features/student/components/StudentWeeklySchedule'
import { StudentWeeklySchedule } from '@/features/student/components/StudentWeeklySchedule'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  EmptyState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { useCurrentStudent } from '@/features/student/hooks/useStudentProfile'
import { studyPeriodLabel } from '@/features/student/data/studyPeriod'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'

function visibilityLabel(visibility: 'FRIENDS' | 'PUBLIC') {
  return visibility === 'PUBLIC' ? 'Público' : 'Amigos'
}

function totalCredits(
  classes: ReadonlyArray<Readonly<{ courseCredits: number }>>,
) {
  return classes.reduce(
    (total, classItem) => total + classItem.courseCredits,
    0,
  )
}

export function SharedSemesterPlanningPage({ shareId }: { shareId: string }) {
  const auth = useOptionalAuth()
  const navigate = useNavigate()
  const sessionSubject = auth.sessionSubject ?? 'anonymous-session'
  const studentQuery = useCurrentStudent()
  const studentId = studentQuery.data?.studentId

  const publicQuery = useQuery({
    queryKey: privateQueryKeys.sharedPeriodPlanning(sessionSubject, shareId),
    queryFn: () => getPublicSharedPeriodPlanning(shareId),
    enabled:
      auth.initialized &&
      (!auth.isAuthenticated ||
        studentQuery.isError ||
        studentId === undefined),
    retry: false,
  })
  const studentQueryResult = useQuery({
    queryKey: [
      ...privateQueryKeys.sharedPeriodPlanning(sessionSubject, shareId),
      'student',
      studentId ?? 'none',
    ] as const,
    queryFn: () =>
      getSharedPeriodPlanningForStudent(
        studentId!,
        shareId,
        auth.getAccessToken,
      ),
    enabled:
      auth.initialized && auth.isAuthenticated && studentId !== undefined,
    retry: false,
  })

  const planning = studentQueryResult.data ?? publicQuery.data
  const isLoading =
    !auth.initialized ||
    studentQuery.isLoading ||
    (auth.isAuthenticated && studentId !== undefined
      ? studentQueryResult.isLoading
      : publicQuery.isLoading)

  const copyMutation = useMutation({
    mutationFn: () =>
      copySharedPeriodPlanning(studentId!, planning!, auth.getAccessToken),
    onSuccess: (created) =>
      void navigate({
        to: '/planejamentos-de-semestre/$planejamentoId',
        params: { planejamentoId: String(created.id) },
      }),
  })

  if (isLoading) {
    return (
      <PageContainer size="wide">
        <LoadingState label="Carregando planejamento compartilhado" />
      </PageContainer>
    )
  }

  if (!planning) {
    return (
      <PageContainer size="wide">
        <EmptyState
          title="Planejamento não encontrado ou indisponível"
          description="Este planejamento pode ter sido removido, tornado privado ou não está disponível para você."
        />
      </PageContainer>
    )
  }

  const meetings: ReadonlyArray<WeeklyScheduleMeeting> =
    planning.classes.flatMap((classItem) =>
      classItem.classSchedules.map((schedule) => ({
        id: schedule.id,
        classId: classItem.id,
        studyPeriodId: planning.studyPeriodId,
        classCode: classItem.code,
        courseCode: classItem.courseCode,
        dayOfWeek: schedule.dayOfWeek,
        start: schedule.start,
        end: schedule.end,
        roomCode: schedule.roomCode,
      })),
    )
  const period = studyPeriodLabel({
    year: planning.studyPeriodYear,
    yearPeriod: planning.studyPeriodYearPeriod,
  })
  const credits = totalCredits(planning.classes)

  function handleCopy() {
    if (!auth.isAuthenticated) {
      void auth.login(window.location.href)
      return
    }
    if (!studentId || copyMutation.isPending) return
    copyMutation.mutate()
  }

  return (
    <PageContainer size="wide">
      <PageHeader
        compact
        eyebrow="Planejamento compartilhado"
        title={planning.name || 'Planejamento de semestre'}
        description={`${period}${planning.owner ? ` · compartilhado por ${planning.owner.displayName}` : ''}`}
        actions={
          <Button
            onClick={handleCopy}
            disabled={
              copyMutation.isPending || (auth.isAuthenticated && !studentId)
            }
          >
            <Copy />
            {copyMutation.isPending
              ? 'Copiando...'
              : 'Copiar para meus planejamentos'}
          </Button>
        }
      />

      {copyMutation.isError && (
        <p className="mb-5 rounded-lg border-2 border-destructive bg-destructive/10 p-4 text-sm font-semibold text-destructive">
          Não foi possível criar a cópia. Algumas turmas podem não estar mais
          disponíveis neste período.
        </p>
      )}

      <div className="space-y-6">
        <Card variant="flat" className="bg-card/80">
          <CardContent className="grid gap-5 p-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div className="flex items-center gap-4">
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-primary text-xl font-black text-primary-foreground">
                {planning.owner?.displayName.slice(0, 1).toUpperCase() ?? 'P'}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-black tracking-[0.14em] text-primary uppercase">
                  {planning.owner ? 'Autor' : 'Planejamento compartilhado'}
                </p>
                {planning.owner ? (
                  <Link
                    to="/perfis/$publicId"
                    params={{ publicId: planning.owner.publicId }}
                    className="pomi-focus mt-1 block truncate text-lg font-extrabold hover:text-primary"
                  >
                    {planning.owner.displayName}
                  </Link>
                ) : (
                  <p className="mt-1 text-lg font-extrabold">
                    Estudante do POMI
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-sm font-bold">
              <span className="inline-flex items-center gap-1.5 rounded-md border-2 border-border bg-muted px-3 py-2">
                <Users className="size-4" />{' '}
                {visibilityLabel(planning.visibility)}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border-2 border-border bg-muted px-3 py-2">
                <CalendarDays className="size-4" /> {period}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border-2 border-border bg-muted px-3 py-2">
                <GraduationCap className="size-4" /> {credits} crédito
                {credits === 1 ? '' : 's'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card variant="flat" className="bg-card/80">
          <CardHeader>
            <CardTitle>Agenda das aulas</CardTitle>
            <CardDescription>
              Horários das turmas selecionadas neste planejamento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {meetings.length > 0 ? (
              <StudentWeeklySchedule meetings={meetings} tone="subtle" />
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum horário cadastrado para as turmas deste planejamento.
              </p>
            )}
          </CardContent>
        </Card>

        <Card variant="flat" className="bg-card/80">
          <CardHeader>
            <CardTitle>Turmas selecionadas</CardTitle>
            <CardDescription>
              {planning.classes.length} disciplina
              {planning.classes.length === 1 ? '' : 's'} neste planejamento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {planning.classes.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma turma foi selecionada.
              </p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {planning.classes.map((classItem) => (
                  <article
                    key={classItem.id}
                    className="rounded-lg border-2 border-border bg-background p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-extrabold">
                          {classItem.courseCode} · Turma {classItem.code}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {classItem.courseCredits} crédito
                          {classItem.courseCredits === 1 ? '' : 's'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                      <p className="font-semibold text-foreground">
                        {classItem.professors.length > 0
                          ? classItem.professors
                              .map((professor) => professor.name)
                              .join(', ')
                          : 'Professor não informado'}
                      </p>
                      {classItem.classSchedules.length > 0 ? (
                        classItem.classSchedules.map((schedule) => (
                          <p
                            key={schedule.id}
                            className="flex items-center gap-2"
                          >
                            <MapPin className="size-4 shrink-0" />
                            {schedule.dayOfWeek.toLowerCase()} {schedule.start}–
                            {schedule.end} · {schedule.roomCode}
                          </p>
                        ))
                      ) : (
                        <p>Sem horário cadastrado</p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
