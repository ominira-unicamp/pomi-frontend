import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { SemesterPlannerPage } from './SemesterPlannerPage'
import { ThemeProvider } from '@/components/ThemeProvider'

const mocks = vi.hoisted(() => ({
  patch: vi.fn(),
  refetch: vi.fn(),
  token: vi.fn(() => Promise.resolve('token')),
}))
const plan = {
  id: 9,
  name: 'Meu semestre',
  studyPeriodId: 1,
  curriculumId: null,
  visibility: 'PRIVATE',
  classes: [],
  guide: { mode: 'NONE', curriculum: null, program: null, manualCourseIds: [] },
}
const data = {
  courses: [],
  classes: [],
  meetings: [],
  studyPeriods: [
    {
      id: 1,
      year: 2026,
      yearPeriod: 'FIRST_SEMESTER',
      startDate: '2026-03-01',
    },
  ],
}
const query = (value: unknown) => ({
  data: value,
  isLoading: false,
  isFetching: false,
  isError: false,
  refetch: mocks.refetch,
})
vi.mock('@/auth/AuthProvider', () => ({
  useOptionalAuth: () => ({
    initialized: true,
    isAuthenticated: true,
    sessionSubject: 'account-a',
    getAccessToken: mocks.token,
  }),
}))
vi.mock('./hooks/useSemesterPlannerQueries', () => ({
  useSemesterPlannerQueries: () => ({
    userId: 7,
    query: query(data),
    studentProfileQuery: query(undefined),
    plansQuery: query([plan]),
    courseAttemptsQuery: query([]),
    professorEvaluationSummariesQuery: query([]),
    curriculaQuery: query([]),
    curriculumQuery: query(undefined),
    anonymousCurriculumDataQuery: query({ courses: [], catalogPrograms: [] }),
    anonymousSuggestionsQuery: query([]),
    planQuery: query(plan),
  }),
}))
vi.mock('./hooks/useSemesterEligibility', () => ({
  useSemesterEligibility: () => ({
    prerequisites: new Map(),
    reservations: new Map(),
    prerequisitesReady: false,
    reservationsReady: false,
    prerequisiteHint: '',
    reservationHint: '',
    acceptedCourseIds: new Set(),
    matchedClassIds: new Set(),
  }),
}))
vi.mock('./data/semesterPlanningApi', async (original) => ({
  ...(await original<object>()),
  patchSemesterPlanning: mocks.patch,
}))
afterEach(() => vi.restoreAllMocks())

it('keeps the edited name visible after a failed save and confirms it only after retry', async () => {
  mocks.patch
    .mockRejectedValueOnce(new Error('offline'))
    .mockResolvedValue({ ...plan, name: 'Nome editado' })
  vi.spyOn(window, 'prompt').mockReturnValue('Nome editado')
  const root = createRootRoute({ component: Outlet })
  const route = createRoute({
    getParentRoute: () => root,
    path: '/planejamentos-de-semestre/$planejamentoId',
    component: () => <SemesterPlannerPage planningId="9" />,
  })
  const router = createRouter({
    routeTree: root.addChildren([route]),
    history: createMemoryHistory({
      initialEntries: ['/planejamentos-de-semestre/9'],
    }),
  })
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>,
  )
  expect(
    await screen.findByRole('heading', { name: 'Meu semestre' }),
  ).toBeTruthy()
  fireEvent.keyDown(screen.getByRole('button', { name: /Ações/ }), {
    key: 'ArrowDown',
  })
  fireEvent.click(await screen.findByRole('menuitem', { name: 'Editar nome' }))
  expect(
    await screen.findByRole('heading', { name: 'Nome editado' }),
  ).toBeTruthy()
  const retry = await screen.findByRole('button', { name: 'Tentar novamente' })
  expect(screen.queryByText('Todas as alterações foram salvas.')).toBeNull()
  fireEvent.click(retry)
  expect(
    await screen.findByText('Todas as alterações foram salvas.'),
  ).toBeTruthy()
  await waitFor(() => expect(mocks.patch).toHaveBeenCalledTimes(2))
  expect(mocks.patch.mock.calls.map((call) => call[2].name)).toEqual([
    'Nome editado',
    'Nome editado',
  ])
})
