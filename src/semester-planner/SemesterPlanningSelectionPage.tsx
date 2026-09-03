import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  GraduationCap,
  Plus,
} from 'lucide-react'

import type { PersistedSemesterPlanning } from '@/semester-planner/data/semesterPlanningApi'
import { studyPeriodLabel } from '@/student/data/studyPeriod'
import { useOptionalAuth } from '@/auth/AuthProvider'
import {
  EmptyState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { Card } from '@/components/ui/card'
import { getCurrentStudent } from '@/student/data/studentApi'
import { listSemesterPlannings } from '@/semester-planner/data/semesterPlanningApi'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'

function totalCredits(plan: PersistedSemesterPlanning) {
  return plan.classes.reduce(
    (total, classItem) => total + classItem.courseCredits,
    0,
  )
}

export function SemesterPlanningSelectionPage() {
  const auth = useOptionalAuth()
  const sessionSubject = auth.sessionSubject ?? 'unknown-session'
  const navigate = useNavigate()
  const studentQuery = useQuery({
    queryKey: privateQueryKeys.currentStudent(sessionSubject),
    queryFn: () => getCurrentStudent(auth.getAccessToken),
    enabled: auth.initialized && auth.isAuthenticated,
    retry: false,
  })
  const plansQuery = useQuery({
    queryKey: privateQueryKeys.semesterPlannings(
      sessionSubject,
      studentQuery.data?.studentId,
    ),
    queryFn: () =>
      listSemesterPlannings(studentQuery.data!.studentId!, auth.getAccessToken),
    enabled: Boolean(studentQuery.data?.studentId),
    retry: false,
  })

  useEffect(() => {
    if (auth.initialized && !auth.isAuthenticated)
      void navigate({ to: '/planejamentos-de-semestre/novo', replace: true })
  }, [auth.initialized, auth.isAuthenticated, navigate])

  if (!auth.initialized || (auth.isAuthenticated && plansQuery.isLoading)) {
    return (
      <PageContainer>
        <LoadingState label="Carregando planejamentos" />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Planejamento acadêmico"
        title="Planejamentos de semestre"
        description="Monte alternativas de horário para cada período letivo."
        actions={
          <Link
            to="/planejamentos-de-semestre/novo"
            className="pomi-focus inline-flex h-10 items-center gap-2 rounded-md border-2 border-primary bg-primary px-4 text-sm font-bold text-primary-foreground shadow-[3px_3px_0_var(--strong-border)] transition-[transform,box-shadow] hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_5px_0_var(--strong-border)]"
          >
            <Plus className="size-4" />
            Novo planejamento
          </Link>
        }
      />
      {!auth.isAuthenticated && (
        <EmptyState
          title="Comece um rascunho"
          description="Você pode montar e exportar um horário sem entrar. Para salvar alternativas, entre na sua conta."
        />
      )}
      {auth.isAuthenticated && plansQuery.data?.length === 0 && (
        <EmptyState
          title="Nenhum planejamento salvo"
          description="Crie uma alternativa para escolher turmas e montar seu horário."
        />
      )}
      {auth.isAuthenticated && (plansQuery.data?.length ?? 0) > 0 && (
        <section aria-labelledby="semester-plans-title">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 id="semester-plans-title" className="text-xl font-extrabold">
                Suas alternativas
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Compare turmas e horários para decidir o próximo período.
              </p>
            </div>
            <span className="shrink-0 text-sm font-bold text-muted-foreground">
              {plansQuery.data!.length} salva
              {plansQuery.data!.length === 1 ? '' : 's'}
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {plansQuery.data!.map((plan) => (
              <Link
                key={plan.id}
                to="/planejamentos-de-semestre/$planejamentoId"
                params={{ planejamentoId: String(plan.id) }}
                className="pomi-focus block"
              >
                <Card className="min-h-44 overflow-hidden p-5 transition-colors hover:border-primary">
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-md bg-secondary text-secondary-foreground">
                      <CalendarDays className="size-5" />
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-primary">
                      Abrir <ArrowRight className="size-4" />
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-extrabold">
                    {plan.name || `Planejamento ${plan.id}`}
                  </h3>
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-strong-border/30 pt-4 text-xs font-semibold text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <BookOpen className="size-3.5" />
                      {studyPeriodLabel({
                        year: plan.studyPeriodYear,
                        yearPeriod: plan.studyPeriodYearPeriod,
                      })}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-right">
                      <GraduationCap className="size-3.5" />
                      {totalCredits(plan)} crédito
                      {totalCredits(plan) === 1 ? '' : 's'}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {plan.classes.map((classItem) => (
                      <span
                        key={classItem.id}
                        className="rounded-sm border border-strong-border/40 bg-muted px-2 py-1 text-xs font-bold"
                      >
                        {classItem.courseCode} · {classItem.code}
                      </span>
                    ))}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </PageContainer>
  )
}
