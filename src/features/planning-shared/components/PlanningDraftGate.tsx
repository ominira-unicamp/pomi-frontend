import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import type { CurriculumDraftBootstrap, SemesterDraftBootstrap } from '@/features/planning-shared/data/planningDraftBootstrap'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { ErrorState, LoadingState, PageContainer } from '@/components/PageLayout'
import { persistCurriculumState } from '@/features/curriculum-planner/data/curriculumPersistenceAdapter'
import {
  clearDraftHandoff,
  loadDraftHandoff,
} from '@/features/planning-shared/data/planningDraftHandoff'
import {
  curriculumDraftBootstrapKey,
  semesterDraftBootstrapKey,
} from '@/features/planning-shared/data/planningDraftBootstrap'
import { createSemesterPlanning } from '@/features/semester-planner/data/semesterPlanningApi'
import { ensureCurrentStudent } from '@/features/student/data/studentApi'

type DraftKind = 'curriculum' | 'semester'

function creationPath(kind: DraftKind) {
  return kind === 'curriculum'
    ? '/planejamentos-de-curriculo/novo'
    : '/planejamentos-de-semestre/novo'
}

export function PlanningDraftGate({
  kind,
  children,
}: {
  kind: DraftKind
  children: ReactNode
}) {
  const auth = useOptionalAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [anonymousBootstrap] = useState(() =>
    kind === 'curriculum'
      ? queryClient.getQueryData<CurriculumDraftBootstrap>(
          curriculumDraftBootstrapKey,
        )
      : queryClient.getQueryData<SemesterDraftBootstrap>(
          semesterDraftBootstrapKey,
        ),
  )
  const [promotionError, setPromotionError] = useState<string>()
  const [attempt, setAttempt] = useState(0)
  const promotionStarted = useRef(false)

  useEffect(() => {
    if (!auth.initialized) return

    if (!auth.isAuthenticated) {
      if (!anonymousBootstrap)
        void navigate({ to: creationPath(kind), replace: true })
      return
    }

    const handoff = loadDraftHandoff()
    if (!handoff || handoff.kind !== kind || promotionStarted.current) {
      if (!promotionStarted.current)
        void navigate({ to: creationPath(kind), replace: true })
      return
    }

    promotionStarted.current = true
    setPromotionError(undefined)
    void (async () => {
      try {
        const studentId = await ensureCurrentStudent(
          String(
            auth.profile?.name ?? auth.profile?.preferred_username ?? 'Estudante',
          ),
          auth.getAccessToken,
        )
        if (handoff.kind === 'curriculum') {
          const created = await persistCurriculumState({
            studentId,
            state: handoff.state,
            name: handoff.name,
            getAccessToken: auth.getAccessToken,
          })
          clearDraftHandoff()
          await navigate({
            to: '/planejamentos-de-curriculo/$planejamentoId',
            params: { planejamentoId: String(created.id) },
            replace: true,
          })
          return
        }
        if (!handoff.document.studyPeriodId)
          throw new Error('missing-study-period')
        const created = await createSemesterPlanning(
          studentId,
          {
            ...handoff.document,
            studyPeriodId: handoff.document.studyPeriodId,
          },
          auth.getAccessToken,
        )
        clearDraftHandoff()
        await navigate({
          to: '/planejamentos-de-semestre/$planejamentoId',
          params: { planejamentoId: String(created.id) },
          replace: true,
        })
      } catch {
        setPromotionError('Não foi possível salvar o rascunho. Tente novamente.')
      }
    })()
  }, [anonymousBootstrap, attempt, auth, kind, navigate])

  if (!auth.initialized || (auth.isAuthenticated && !promotionError)) {
    return (
      <PageContainer>
        <LoadingState label="Preparando o planejamento" />
      </PageContainer>
    )
  }

  if (promotionError) {
    return (
      <PageContainer>
        <ErrorState
          title="Não foi possível salvar o rascunho"
          description={promotionError}
          action={{
            label: 'Tentar novamente',
            onClick: () => {
              promotionStarted.current = false
              setAttempt((current) => current + 1)
            },
          }}
        />
      </PageContainer>
    )
  }

  if (!anonymousBootstrap) return null
  return <>{children}</>
}

export function PlanningAccessGate({
  kind,
  children,
}: {
  kind: DraftKind
  children: ReactNode
}) {
  const auth = useOptionalAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (auth.initialized && !auth.isAuthenticated)
      void navigate({ to: creationPath(kind), replace: true })
  }, [auth.initialized, auth.isAuthenticated, kind, navigate])

  if (!auth.initialized || !auth.isAuthenticated) {
    return (
      <PageContainer>
        <LoadingState label="Preparando o planejamento" />
      </PageContainer>
    )
  }

  return <>{children}</>
}
