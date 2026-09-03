import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  LogIn,
  MessageSquareHeart,
} from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'
import type { PersistedSemesterPlanning } from '@/semester-planner/data/semesterPlanningApi'
import type { ProfessorEvaluationTarget } from '@/student/components/ProfessorEvaluationDialog'

import { useOptionalAuth } from '@/auth/AuthProvider'
import {
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { AsyncSection } from '@/components/AsyncSection'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { listCurricula } from '@/planner/data/curriculumPersistenceApi'
import { listSemesterPlannings } from '@/semester-planner/data/semesterPlanningApi'
import {
  ensureCurrentStudent,
  listClassSchedulesByStudyPeriod,
  listPendingProfessorEvaluations,
  listStudentCourseAttempts,
} from '@/student/data/studentApi'
import { useStudentProfile } from '@/student/hooks/useStudentProfile'
import { cn } from '@/lib/utils'
import { AgendaPanel, DailyMealsPanel } from '@/home/AgendaPanel'
import { currentStudyPeriodCode } from '@/home/todayClasses'
import {
  previousSemester,
  studyPeriodFromCode,
  studyPeriodLabel,
} from '@/student/data/studyPeriod'
import { ProfessorEvaluationDialog } from '@/student/components/ProfessorEvaluationDialog'
import { useStudentAbsences } from '@/student/absences/useStudentAbsences'
import { academicDateKey } from '@/student/absences/studentAbsences'
import {
  privateQueryKeys,
  publicQueryKeys,
} from '@/integrations/tanstack-query/queryKeys'

function accountName(profile: ReturnType<typeof useOptionalAuth>['profile']) {
  return String(
    profile?.name ||
      profile?.preferred_username ||
      profile?.email ||
      'Aluno POMI',
  )
}

function firstName(profile: ReturnType<typeof useOptionalAuth>['profile']) {
  const name = String(profile?.given_name || accountName(profile)).trim()
  return name.split(/\s+/)[0]
}

function ObjectiveCard({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode
  title: string
  description: string
  action: ReactNode
}) {
  return (
    <Card className="flex min-h-56 flex-col p-5">
      <span className="grid size-10 place-items-center rounded-md bg-secondary text-secondary-foreground">
        {icon}
      </span>
      <h3 className="mt-4 text-lg font-extrabold">{title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-5">{action}</div>
    </Card>
  )
}

function linkClass(secondary = false) {
  return cn(
    buttonVariants({ variant: secondary ? 'outline' : 'default' }),
    'w-full sm:w-auto',
  )
}

function AnonymousHome() {
  const auth = useOptionalAuth()
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Vida acadêmica"
        title="O que você quer organizar?"
        description="Use os planejadores como rascunho ou entre para manter seus dados salvos."
        actions={
          <button
            className={buttonVariants({ variant: 'outline' })}
            onClick={() => void auth.login('/')}
          >
            <LogIn /> Entrar
          </button>
        }
      />
      <section aria-labelledby="objectives-title">
        <h2 id="objectives-title" className="sr-only">
          Ações disponíveis
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <ObjectiveCard
            icon={<BookOpen className="size-5" />}
            title="Planejar minha graduação"
            description="Distribua disciplinas pelos semestres e acompanhe os blocos do currículo."
            action={
              <Link
                to="/planejamentos-de-curriculo/novo"
                className={linkClass()}
              >
                Criar rascunho <ArrowRight />
              </Link>
            }
          />
          <ObjectiveCard
            icon={<CalendarDays className="size-5" />}
            title="Montar meu horário"
            description="Compare turmas e organize os horários de um período letivo."
            action={
              <Link
                to="/planejamentos-de-semestre/novo"
                className={linkClass()}
              >
                Criar rascunho <ArrowRight />
              </Link>
            }
          />
          <ObjectiveCard
            icon={<GraduationCap className="size-5" />}
            title="Acompanhar meu curso"
            description="Registre disciplinas cursando, conclusões e tentativas anteriores."
            action={
              <button
                className={linkClass(true)}
                onClick={() => void auth.login('/situacao-do-curso')}
              >
                <LogIn /> Entrar para acessar
              </button>
            }
          />
        </div>
      </section>
      <section className="mt-8" aria-labelledby="daily-menu-title">
        <h2 id="daily-menu-title" className="mb-4 text-xl font-extrabold">
          Cardápio de hoje
        </h2>
        <DailyMealsPanel date={academicDateKey()} />
      </section>
    </PageContainer>
  )
}

function RecentSemesterPlan({ plan }: { plan: PersistedSemesterPlanning }) {
  const credits = plan.classes.reduce(
    (total, classItem) => total + classItem.courseCredits,
    0,
  )
  return (
    <Link
      to="/planejamentos-de-semestre/$planejamentoId"
      params={{ planejamentoId: String(plan.id) }}
      className="pomi-focus block"
    >
      <Card className="h-full p-5 transition-colors hover:border-primary">
        <div className="flex items-start justify-between gap-4">
          <CalendarDays className="size-5 text-primary" />
          <span className="inline-flex items-center gap-1 text-sm font-bold text-primary">
            Abrir <ArrowRight />
          </span>
        </div>
        <h3 className="mt-4 font-extrabold">
          {plan.name || `Horário ${plan.id}`}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {studyPeriodLabel({
            year: plan.studyPeriodYear,
            yearPeriod: plan.studyPeriodYearPeriod,
          })}{' '}
          · {plan.classes.length} turma
          {plan.classes.length === 1 ? '' : 's'} · {credits} créditos
        </p>
      </Card>
    </Link>
  )
}

function AuthenticatedHome() {
  const auth = useOptionalAuth()
  const sessionSubject = auth.sessionSubject ?? 'unknown-session'
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [situationError, setSituationError] = useState(false)
  const [evaluationTarget, setEvaluationTarget] =
    useState<ProfessorEvaluationTarget>()
  const { studentId, studentQuery } = useStudentProfile()
  const attemptsQuery = useQuery({
    queryKey: privateQueryKeys.courseAttempts(sessionSubject, studentId),
    queryFn: () => listStudentCourseAttempts(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId),
    retry: false,
  })
  const curriculaQuery = useQuery({
    queryKey: privateQueryKeys.curricula(sessionSubject, studentId),
    queryFn: () => listCurricula(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId),
    retry: false,
  })
  const semesterPlansQuery = useQuery({
    queryKey: privateQueryKeys.semesterPlannings(sessionSubject, studentId),
    queryFn: () => listSemesterPlannings(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId),
    retry: false,
  })
  const featuredCurriculum =
    curriculaQuery.data?.find((curriculum) => curriculum.isFavorite) ??
    curriculaQuery.data?.[0]
  const attempts = attemptsQuery.data ?? []
  const enrolledAttempts = attempts.filter(
    (attempt) => attempt.status === 'ENROLLED',
  )
  const absenceController = useStudentAbsences(
    studentId ?? undefined,
    auth.getAccessToken,
    enrolledAttempts.length > 0,
  )
  const academicPeriod = studyPeriodFromCode(currentStudyPeriodCode())
  const priorSemester = academicPeriod ? previousSemester(academicPeriod) : null
  const pendingEvaluationsQuery = useQuery({
    queryKey: privateQueryKeys.pendingProfessorEvaluations(
      sessionSubject,
      studentId,
      priorSemester?.year,
      priorSemester?.yearPeriod,
    ),
    queryFn: () =>
      listPendingProfessorEvaluations(
        studentId!,
        priorSemester as NonNullable<typeof priorSemester>,
        auth.getAccessToken,
      ),
    enabled: Boolean(studentId && priorSemester),
    retry: false,
  })
  const currentPeriodAttempt = enrolledAttempts.find(
    (attempt) =>
      academicPeriod !== null &&
      attempt.studyPeriod !== null &&
      attempt.studyPeriod.year === academicPeriod.year &&
      attempt.studyPeriod.yearPeriod === academicPeriod.yearPeriod,
  )
  const currentPeriodId = currentPeriodAttempt?.studyPeriodId ?? null
  const studyPeriodCode = academicPeriod ? studyPeriodLabel(academicPeriod) : ''
  const todayScheduleQuery = useQuery({
    queryKey: publicQueryKeys.classSchedules(currentPeriodId),
    queryFn: () => listClassSchedulesByStudyPeriod(currentPeriodId!),
    enabled: Boolean(currentPeriodId),
    staleTime: Infinity,
  })
  const currentClassIds = new Set(
    enrolledAttempts.flatMap((attempt) =>
      attempt.studyPeriodId === currentPeriodId && attempt.classId
        ? [attempt.classId]
        : [],
    ),
  )
  const currentMeetings = (todayScheduleQuery.data ?? []).filter((meeting) =>
    currentClassIds.has(meeting.classId),
  )
  const latestSemesterPlan = semesterPlansQuery.data?.[0]
  const pendingEvaluation = pendingEvaluationsQuery.data?.[0]
  async function openSituation() {
    setSituationError(false)
    try {
      if (!studentId) {
        await ensureCurrentStudent(
          accountName(auth.profile),
          auth.getAccessToken,
        )
        await queryClient.invalidateQueries({
          queryKey: privateQueryKeys.currentStudent(sessionSubject),
        })
      }
      await navigate({ to: '/situacao-do-curso' })
    } catch {
      setSituationError(true)
    }
  }

  if (studentQuery.isPending) {
    return (
      <PageContainer>
        <LoadingState label="Identificando seu perfil acadêmico" />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Vida acadêmica"
        title={`Olá, ${firstName(auth.profile)}`}
        description="Acesse seus dados e continue seus planejamentos."
      />
      <div className="space-y-8">
        {pendingEvaluation && (
          <Card className="border-primary bg-primary/5 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
                  <MessageSquareHeart className="size-5" />
                </span>
                <div>
                  <h2 className="font-extrabold">Avalie seus professores</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Sua experiência ajuda outros alunos a escolher turmas.
                  </p>
                </div>
              </div>
              <button
                className={linkClass()}
                onClick={() =>
                  setEvaluationTarget({
                    classId: pendingEvaluation.class.id,
                    classCode: pendingEvaluation.class.code,
                    courseCode: pendingEvaluation.course.code,
                    courseName: pendingEvaluation.course.name,
                    professorId: pendingEvaluation.professor.id,
                    professorName: pendingEvaluation.professor.name,
                  })
                }
              >
                Avaliar agora <ArrowRight />
              </button>
            </div>
          </Card>
        )}
        {situationError && (
          <Alert variant="destructive">
            <AlertTitle>Parte do resumo não está disponível</AlertTitle>
            <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
              Os atalhos continuam disponíveis. Tente carregar novamente os
              dados que falharam.
              <button
                className={buttonVariants({ variant: 'outline', size: 'sm' })}
                onClick={() => {
                  setSituationError(false)
                  void queryClient.invalidateQueries({
                    queryKey: privateQueryKeys.currentStudent(sessionSubject),
                  })
                }}
              >
                Tentar novamente
              </button>
            </AlertDescription>
          </Alert>
        )}

        <AsyncSection
          isPending={attemptsQuery.isPending}
          isError={attemptsQuery.isError}
          isRefreshing={attemptsQuery.isFetching && !attemptsQuery.isPending}
          loadingLabel="Carregando agenda"
          errorTitle="Não foi possível carregar sua agenda"
          errorDescription="Os demais recursos da página continuam disponíveis."
          onRetry={() => void attemptsQuery.refetch()}
        >
          <AgendaPanel
            currentPeriodId={currentPeriodId}
            currentPeriodCode={studyPeriodCode}
            attempts={enrolledAttempts}
            meetings={currentMeetings}
            isLoading={todayScheduleQuery.isLoading}
            isError={todayScheduleQuery.isError}
            scheduleLoaded={todayScheduleQuery.isSuccess}
            absenceController={absenceController}
          />
        </AsyncSection>

        <section aria-labelledby="objectives-title">
          <h2 id="objectives-title" className="mb-4 text-xl font-extrabold">
            O que você quer organizar?
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <ObjectiveCard
              icon={<GraduationCap className="size-5" />}
              title="Situação do curso"
              description="Atualize curso, disciplinas cursando e seu histórico."
              action={
                <button
                  className={linkClass(true)}
                  onClick={() => void openSituation()}
                >
                  Abrir situação <ArrowRight />
                </button>
              }
            />
            <ObjectiveCard
              icon={<BookOpen className="size-5" />}
              title="Planejamento de currículo"
              description="Organize sua trajetória e acompanhe os blocos da grade."
              action={
                <Link
                  to="/planejamentos-de-curriculo"
                  className={linkClass(true)}
                >
                  Ver currículos <ArrowRight />
                </Link>
              }
            />
            <ObjectiveCard
              icon={<CalendarDays className="size-5" />}
              title="Planejamento de semestre"
              description="Escolha turmas e monte alternativas de horário."
              action={
                <Link
                  to="/planejamentos-de-semestre"
                  className={linkClass(true)}
                >
                  Ver horários <ArrowRight />
                </Link>
              }
            />
          </div>
        </section>

        {(curriculaQuery.isPending ||
          semesterPlansQuery.isPending ||
          curriculaQuery.isError ||
          semesterPlansQuery.isError ||
          featuredCurriculum ||
          latestSemesterPlan) && (
          <section aria-labelledby="recent-title">
            <div className="mb-4 flex items-end justify-between gap-4">
              <h2 id="recent-title" className="text-xl font-extrabold">
                Retomar planejamentos
              </h2>
              <CheckCircle2 className="size-5 text-muted-foreground" />
            </div>
            <AsyncSection
              isPending={
                curriculaQuery.isPending || semesterPlansQuery.isPending
              }
              isError={curriculaQuery.isError || semesterPlansQuery.isError}
              isRefreshing={
                (curriculaQuery.isFetching && !curriculaQuery.isPending) ||
                (semesterPlansQuery.isFetching && !semesterPlansQuery.isPending)
              }
              loadingLabel="Carregando planejamentos recentes"
              errorTitle="Parte dos planejamentos não está disponível"
              errorDescription="Tente carregar novamente seus planejamentos salvos."
              onRetry={() => {
                void curriculaQuery.refetch()
                void semesterPlansQuery.refetch()
              }}
            >
              <div className="grid gap-4 md:grid-cols-2">
                {featuredCurriculum && (
                  <Link
                    to="/planejamentos-de-curriculo/$planejamentoId"
                    params={{ planejamentoId: String(featuredCurriculum.id) }}
                    className="pomi-focus block"
                  >
                    <Card className="h-full p-5 transition-colors hover:border-primary">
                      <div className="flex items-start justify-between gap-4">
                        <BookOpen className="size-5 text-primary" />
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-primary">
                          Abrir <ArrowRight />
                        </span>
                      </div>
                      <h3 className="mt-4 font-extrabold">
                        {featuredCurriculum.name}
                        {featuredCurriculum.isFavorite ? ' · Favorito' : ''}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Planejamento de currículo
                      </p>
                    </Card>
                  </Link>
                )}
                {latestSemesterPlan && (
                  <RecentSemesterPlan plan={latestSemesterPlan} />
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-sm font-bold">
                <Link
                  to="/planejamentos-de-curriculo"
                  className="pomi-focus rounded-sm underline underline-offset-4"
                >
                  Ver todos os currículos
                </Link>
                <Link
                  to="/planejamentos-de-semestre"
                  className="pomi-focus rounded-sm underline underline-offset-4"
                >
                  Ver todos os horários
                </Link>
              </div>
            </AsyncSection>
          </section>
        )}
        <ProfessorEvaluationDialog
          open={Boolean(evaluationTarget)}
          onOpenChange={(open) => {
            if (!open) setEvaluationTarget(undefined)
          }}
          studentId={studentId ?? undefined}
          target={evaluationTarget}
          onSaved={() =>
            void queryClient.invalidateQueries({
              queryKey: privateQueryKeys.pendingProfessorEvaluations(
                sessionSubject,
                studentId,
                priorSemester?.year,
                priorSemester?.yearPeriod,
              ),
            })
          }
        />
      </div>
    </PageContainer>
  )
}

export function HomePage() {
  const auth = useOptionalAuth()
  if (!auth.initialized) {
    return (
      <PageContainer>
        <LoadingState label="Inicializando sua sessão" />
      </PageContainer>
    )
  }
  return auth.isAuthenticated ? <AuthenticatedHome /> : <AnonymousHome />
}
