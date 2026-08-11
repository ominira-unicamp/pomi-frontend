import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { HomePage } from '@/home/HomePage'

const login = vi.fn()
const getAccessToken = vi.fn()
const authState = {
  initialized: true,
  isAuthenticated: false,
  profile: undefined as Record<string, unknown> | undefined,
  login,
  logout: vi.fn(),
  getAccessToken,
  emailVerificationRequired: false,
}
const studentState = {
  studentId: undefined as number | undefined,
  studentQuery: { isLoading: false, isError: false },
  profileQuery: {
    data: undefined as Record<string, unknown> | undefined,
    isLoading: false,
    isError: false,
  },
}

vi.mock('@/auth/AuthProvider', () => ({
  useOptionalAuth: () => authState,
}))

vi.mock('@/student/hooks/useStudentProfile', () => ({
  useStudentProfile: () => studentState,
}))

vi.mock('@/student/data/studentApi', () => ({
  ensureCurrentStudent: vi.fn(),
  listStudentCourseAttempts: vi.fn(() => Promise.resolve([
    {
      id: 1,
      courseId: 10,
      status: 'COMPLETED',
      course: { id: 10, code: 'MA111', name: 'Cálculo', credits: 6 },
    },
    {
      id: 2,
      courseId: 11,
      status: 'ENROLLED',
      course: { id: 11, code: 'MC102', name: 'Algoritmos', credits: 6 },
    },
  ])),
}))

vi.mock('@/planner/data/curriculumPersistenceApi', () => ({
  listCurricula: vi.fn(() => Promise.resolve([
    {
      id: 7,
      name: 'Meu currículo',
      selection: {},
      updatedAt: '2026-08-01T12:00:00.000Z',
    },
  ])),
  getCurriculum: vi.fn(() => Promise.resolve({
    id: 7,
    name: 'Meu currículo',
    periods: [],
    courses: [{ courseId: 11, periodId: null }],
  })),
}))

vi.mock('@/semester-planner/data/semesterPlanningApi', () => ({
  listSemesterPlannings: vi.fn(() => Promise.resolve([
    {
      id: 8,
      name: 'Próximo semestre',
      studyPeriodCode: '1s2027',
      updatedAt: '2026-08-02T12:00:00.000Z',
      classes: [
        { id: 2, code: 'A', courseCode: 'MC102', courseCredits: 6 },
      ],
    },
  ])),
}))

vi.mock('@/planner/data/curriculumPlannerApi', () => ({
  createApiCurriculumPlannerStaticDataSource: () => ({
    load: () => Promise.resolve({
      ok: true,
      value: {
        catalogPrograms: [
          {
            id: '1',
            catalog: { id: '2', year: 2026 },
            program: { id: '3', code: '34', name: 'Computação' },
            specializations: [],
            languages: [],
          },
        ],
        courses: [{ id: '11', code: 'MC102', name: 'Algoritmos', credits: 6 }],
      },
    }),
  }),
}))

function renderHome() {
  const rootRoute = createRootRoute()
  const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: HomePage,
  })
  const router = createRouter({
    routeTree: rootRoute.addChildren([homeRoute]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

describe('HomePage', () => {
  beforeEach(() => {
    login.mockReset()
    authState.initialized = true
    authState.isAuthenticated = false
    authState.profile = undefined
    studentState.studentId = undefined
    studentState.studentQuery = { isLoading: false, isError: false }
    studentState.profileQuery = {
      data: undefined,
      isLoading: false,
      isError: false,
    }
  })

  it('guides anonymous students without presenting a marketing page', async () => {
    renderHome()

    expect(await screen.findByText('Planejar minha graduação')).toBeTruthy()
    expect(screen.getByText('Montar meu horário')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Entrar para acessar' }))
    expect(login).toHaveBeenCalledWith('/situacao-do-curso')
  })

  it('shows progress and resumes the most recently updated plan', async () => {
    authState.isAuthenticated = true
    authState.profile = { given_name: 'Ana' }
    studentState.studentId = 1
    studentState.profileQuery = {
      data: {
        catalogId: 2,
        programId: 3,
        entryYear: 2026,
        specializationId: null,
        languageId: null,
      },
      isLoading: false,
      isError: false,
    }

    renderHome()

    expect(await screen.findByText('Olá, Ana')).toBeTruthy()
    expect(
      await screen.findByText(
        'Retome o planejamento de semestre atualizado mais recentemente.',
      ),
    ).toBeTruthy()
    expect(screen.getAllByText('6', { selector: 'strong' }).length).toBeGreaterThan(0)
    expect(screen.getByText('Próximo semestre')).toBeTruthy()
  })
})
