import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

import { useOptionalAuth } from '@/auth/AuthProvider'
import {
  EmptyState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { getCurrentStudent } from '@/student/data/studentApi'
import { listSemesterPlannings } from '@/semester-planner/data/semesterPlanningApi'

export function SemesterPlanningSelectionPage() {
  const auth = useOptionalAuth()
  const studentQuery = useQuery({
    queryKey: ['semester-planner', 'student', auth.isAuthenticated],
    queryFn: () => getCurrentStudent(auth.getAccessToken),
    enabled: auth.initialized && auth.isAuthenticated,
    retry: false,
  })
  const plansQuery = useQuery({
    queryKey: ['semester-planner', 'plans', studentQuery.data?.studentId],
    queryFn: () =>
      listSemesterPlannings(studentQuery.data!.studentId!, auth.getAccessToken),
    enabled: Boolean(studentQuery.data?.studentId),
    retry: false,
  })

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
            to="/planejamentos-de-semestre/$planejamentoId"
            params={{ planejamentoId: 'rascunho' }}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-bold text-primary-foreground"
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
        <div className="space-y-3">
          {plansQuery.data!.map((plan) => (
            <Link
              key={plan.id}
              to="/planejamentos-de-semestre/$planejamentoId"
              params={{ planejamentoId: String(plan.id) }}
              className="block rounded-lg border-2 border-strong-border bg-card p-4 transition-colors hover:border-primary"
            >
              <p className="font-extrabold">
                {plan.name || `Planejamento ${plan.id}`}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {plan.studyPeriodCode} · {plan.classes.length} turma
                {plan.classes.length === 1 ? '' : 's'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  )
}
