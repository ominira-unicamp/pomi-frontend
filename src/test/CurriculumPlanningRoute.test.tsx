import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useState } from 'react'
import type { CurriculumDraftBootstrap } from '@/features/planning-shared/data/planningDraftBootstrap'
import type { ComponentType, ReactNode } from 'react'
import { Route } from '@/routes/planejamentos-de-curriculo'
import { curriculumDraftBootstrapKey } from '@/features/planning-shared/data/planningDraftBootstrap'
import { buildInitialState } from '@/features/curriculum-planner/CurriculumPlanCreationPage'

const routeState = vi.hoisted(() => ({
  pathname: '/planejamentos-de-curriculo/novo',
  planejamentoId: undefined as string | undefined,
}))

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (options: object) => ({ options }),
  useParams: () => ({ planejamentoId: routeState.planejamentoId }),
  useRouterState: () => routeState.pathname,
  useNavigate: () => vi.fn(),
  Outlet: () => null,
}))

vi.mock('@/features/curriculum-planner', async () => {
  const { useQueryClient } = await import('@tanstack/react-query')
  return {
    CurriculumPlannerProvider: ({ children }: { children: ReactNode }) => {
      const queryClient = useQueryClient()
      const [bootstrap] = useState(() =>
        queryClient.getQueryData<CurriculumDraftBootstrap>(
          curriculumDraftBootstrapKey,
        ),
      )
      return (
        <>
          <output>
            {bootstrap?.state.plan.periods
              .flatMap((period) => period.items)
              .map((item) => item.courseId)
              .join(',') || 'vazio'}
          </output>
          {children}
        </>
      )
    },
  }
})

const Layout = Route.options.component as ComponentType

describe('curriculum planning route', () => {
  it('loads a newly created suggestion draft when leaving the creation page', () => {
    const client = new QueryClient()
    routeState.pathname = '/planejamentos-de-curriculo/novo'
    routeState.planejamentoId = undefined
    const view = render(
      <QueryClientProvider client={client}>
        <Layout />
      </QueryClientProvider>,
    )
    expect(screen.getByText('vazio')).toBeTruthy()
    const state = buildInitialState({
      year: 2027,
      semester: 1,
      semesterNumber: 1,
      selection: {
        catalogId: '1',
        programId: '42',
        catalogProgramId: '2',
        catalogProgramVariantId: '3',
        languageId: '',
      },
      suggestion: {
        id: '4',
        catalogProgramId: '2' as never,
        catalogProgramVariantId: '3' as never,
        programName: 'Computação',
        specialization: null,
        semesters: [
          {
            semester: 1,
            electiveCredits: 0,
            courses: [
              {
                id: '101' as never,
                code: 'MC102',
                name: 'Algoritmos',
                credits: 6,
              },
            ],
          },
        ],
      },
      completedCourseIds: [],
      historyAttempts: [],
    })
    client.setQueryData(curriculumDraftBootstrapKey, {
      name: 'Sugestão',
      state,
    })
    routeState.pathname = '/planejamentos-de-curriculo/rascunho'
    routeState.planejamentoId = 'rascunho'
    view.rerender(
      <QueryClientProvider client={client}>
        <Layout />
      </QueryClientProvider>,
    )
    expect(screen.getByText('101')).toBeTruthy()
    expect(screen.queryByText('vazio')).toBeNull()
  })
})
