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
import type * as TodayClassesModule from '@/home/todayClasses'

import { HomePage } from '@/home/HomePage'

vi.mock('@/home/todayClasses', async (importOriginal) => {
  const original = await importOriginal<typeof TodayClassesModule>()
  return {
    ...original,
    currentScheduleDay: () => 'TUESDAY',
    currentStudyPeriodCode: () => '2026s2',
  }
})

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

const { listClassSchedulesByStudyPeriod, listStudentCourseAttempts } =
  vi.hoisted(() => ({
    listClassSchedulesByStudyPeriod: vi.fn(),
    listStudentCourseAttempts: vi.fn(),
  }))

vi.mock('@/student/data/studentApi', () => ({
  ensureCurrentStudent: vi.fn(),
  listClassSchedulesByStudyPeriod,
  listStudentCourseAttempts,
}))

const attempts = [
  {
    id: 1,
    courseId: 10,
    status: 'COMPLETED',
    course: { id: 10, code: 'MA111', name: 'Cálculo', credits: 6 },
  },
  {
    id: 2,
    courseId: 11,
    studyPeriodId: 20,
    classId: 40,
    status: 'ENROLLED',
    course: { id: 11, code: 'MC102', name: 'Algoritmos', credits: 6 },
    studyPeriod: { id: 20, code: '2026s2' },
    class: {
      id: 40,
      code: 'A',
      professors: [{ id: 50, name: 'Ana Silva' }],
    },
  },
] as const

const schedules = [
      {
        id: 30,
        classId: 40,
        classCode: 'A',
        courseCode: 'MC102',
        studyPeriodId: 20,
        dayOfWeek: 'TUESDAY',
        start: '14:00',
        end: '16:00',
        roomCode: 'CB01',
      },
] as const

const { listCurricula } = vi.hoisted(() => ({
  listCurricula: vi.fn(),
}))

vi.mock('@/planner/data/curriculumPersistenceApi', () => ({
  listCurricula,
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
    listCurricula.mockResolvedValue([
      {
        id: 7,
        name: 'Meu currículo',
        isFavorite: false,
        selection: {},
        updatedAt: '2026-08-01T12:00:00.000Z',
      },
    ])
    listStudentCourseAttempts.mockReset()
    listClassSchedulesByStudyPeriod.mockReset()
    listStudentCourseAttempts.mockResolvedValue(attempts)
    listClassSchedulesByStudyPeriod.mockResolvedValue(schedules)
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
    expect(screen.getByText('Próximo semestre')).toBeTruthy()
    expect(screen.getByText('Aulas de hoje')).toBeTruthy()
    expect(screen.getByText('MC102 — Algoritmos')).toBeTruthy()
    expect(screen.getByText('Ana Silva')).toBeTruthy()
  })

  it('prioritizes the favorite curriculum on the home page', async () => {
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
    listCurricula.mockResolvedValue([
      {
        id: 7,
        name: 'Planejamento recente',
        isFavorite: false,
        selection: {},
        updatedAt: '2026-08-03T12:00:00.000Z',
      },
      {
        id: 9,
        name: 'Planejamento favorito',
        isFavorite: true,
        selection: {},
        updatedAt: '2026-08-01T12:00:00.000Z',
      },
    ])

    renderHome()

    expect(await screen.findByText('Seu planejamento favorito')).toBeTruthy()
    expect(
      screen.getByText('Retome o currículo que você escolheu como principal.'),
    ).toBeTruthy()
    expect(screen.getByRole('link', { name: /Abrir favorito/ })).toBeTruthy()
  })

  it('keeps the daily panel hidden without enrolled courses', async () => {
    authState.isAuthenticated = true
    authState.profile = { given_name: 'Ana' }
    studentState.studentId = 1
    studentState.profileQuery = {
      data: undefined,
      isLoading: false,
      isError: false,
    }
    listStudentCourseAttempts.mockResolvedValue([attempts[0]])

    renderHome()

    expect(await screen.findByText('Olá, Ana')).toBeTruthy()
    expect(screen.queryByText('Aulas de hoje')).toBeNull()
    expect(listClassSchedulesByStudyPeriod).not.toHaveBeenCalled()
  })

  it('shows an empty daily state when there are no classes today', async () => {
    authState.isAuthenticated = true
    authState.profile = { given_name: 'Ana' }
    studentState.studentId = 1
    studentState.profileQuery = {
      data: undefined,
      isLoading: false,
      isError: false,
    }
    listClassSchedulesByStudyPeriod.mockResolvedValue([])

    renderHome()

    expect(await screen.findByText('Você não tem aulas hoje.')).toBeTruthy()
    expect(screen.getByText(/Agenda parcial:/)).toBeTruthy()
  })

  it('isolates a schedule error from the rest of the home page', async () => {
    authState.isAuthenticated = true
    authState.profile = { given_name: 'Ana' }
    studentState.studentId = 1
    studentState.profileQuery = {
      data: undefined,
      isLoading: false,
      isError: false,
    }
    listClassSchedulesByStudyPeriod.mockRejectedValue(new Error('Unavailable'))

    renderHome()

    expect(
      await screen.findByText('Não foi possível carregar as aulas de hoje'),
    ).toBeTruthy()
  })
})
