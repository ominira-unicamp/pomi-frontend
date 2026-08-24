import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type * as TodayClassesModule from '@/home/todayClasses'

import { HomePage } from '@/home/HomePage'
import { academicDateKey } from '@/student/absences/studentAbsences'

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

const {
  listClassSchedulesByStudyPeriod,
  getProfessorEvaluation,
  listPendingProfessorEvaluations,
  listStudentCourseAttempts,
  listStudentAbsences,
  createStudentAbsence,
  deleteStudentAbsence,
} = vi.hoisted(() => ({
  listClassSchedulesByStudyPeriod: vi.fn(),
  getProfessorEvaluation: vi.fn(),
  listPendingProfessorEvaluations: vi.fn(),
  listStudentCourseAttempts: vi.fn(),
  listStudentAbsences: vi.fn(),
  createStudentAbsence: vi.fn(),
  deleteStudentAbsence: vi.fn(),
}))

vi.mock('@/student/data/studentApi', () => ({
  ensureCurrentStudent: vi.fn(),
  listClassSchedulesByStudyPeriod,
  getProfessorEvaluation,
  listPendingProfessorEvaluations,
  listStudentCourseAttempts,
}))

vi.mock('@/student/data/studentAbsenceApi', () => ({
  listStudentAbsences,
  createStudentAbsence,
  deleteStudentAbsence,
}))

const attempts = [
  {
    id: 1,
    courseId: 10,
    evaluationMode: 'GRADE_AND_ATTENDANCE',
    status: 'APPROVED',
    course: { id: 10, code: 'MA111', name: 'Cálculo', credits: 6 },
  },
  {
    id: 2,
    courseId: 11,
    studyPeriodId: 20,
    classId: 40,
    evaluationMode: 'GRADE_AND_ATTENDANCE',
    status: 'ENROLLED',
    course: { id: 11, code: 'MC102', name: 'Algoritmos', credits: 6 },
    studyPeriod: { id: 20, year: 2026, yearPeriod: 'SECOND_SEMESTER' },
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
    start: '00:00',
    end: '00:01',
    roomCode: 'CB01',
  },
] as const

const { listCurricula } = vi.hoisted(() => ({
  listCurricula: vi.fn(),
}))

const { listDailyMenus } = vi.hoisted(() => ({
  listDailyMenus: vi.fn(),
}))

vi.mock('@/home/dailyMenuApi', () => ({
  listDailyMenus,
}))

vi.mock('@/planner/data/curriculumPersistenceApi', () => ({
  listCurricula,
  getCurriculum: vi.fn(() =>
    Promise.resolve({
      id: 7,
      name: 'Meu currículo',
      periods: [],
      courses: [{ courseId: 11, periodId: null }],
    }),
  ),
}))

vi.mock('@/semester-planner/data/semesterPlanningApi', () => ({
  listSemesterPlannings: vi.fn(() =>
    Promise.resolve([
      {
        id: 8,
        name: 'Próximo semestre',
        studyPeriodYear: 2027,
        studyPeriodYearPeriod: 'FIRST_SEMESTER',
        updatedAt: '2026-08-02T12:00:00.000Z',
        classes: [{ id: 2, code: 'A', courseCode: 'MC102', courseCredits: 6 }],
      },
    ]),
  ),
}))

vi.mock('@/planner/data/curriculumPlannerApi', () => ({
  createApiCurriculumPlannerStaticDataSource: () => ({
    load: () =>
      Promise.resolve({
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
          courses: [
            { id: '11', code: 'MC102', name: 'Algoritmos', credits: 6 },
          ],
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
    listDailyMenus.mockReset()
    listStudentCourseAttempts.mockResolvedValue(attempts)
    listPendingProfessorEvaluations.mockResolvedValue([])
    getProfessorEvaluation.mockResolvedValue({ eligible: true, evaluation: null })
    listClassSchedulesByStudyPeriod.mockResolvedValue(schedules)
    listStudentAbsences.mockResolvedValue([])
    listDailyMenus.mockResolvedValue([])
    createStudentAbsence.mockImplementation(
      (_studentId: number, input: Record<string, unknown>) =>
        Promise.resolve({
          id: 90,
          ...input,
          courseCode: 'MC102',
          classCode: 'A',
        }),
    )
    deleteStudentAbsence.mockResolvedValue(undefined)
  })

  it('guides anonymous students without presenting a marketing page', async () => {
    listDailyMenus.mockResolvedValue([
      {
        id: 1,
        date: academicDateKey(),
        meals: [
          {
            id: 2,
            period: 'LUNCH',
            diet: 'TRADITIONAL',
            status: 'AVAILABLE',
            mainDish: 'Arroz com feijão',
            serviceNotes: [],
            items: [],
            observations: [],
          },
        ],
      },
    ])

    renderHome()

    expect(await screen.findByText('Planejar minha graduação')).toBeTruthy()
    expect(screen.getByText('Montar meu horário')).toBeTruthy()
    expect(await screen.findByText('Cardápio de hoje')).toBeTruthy()
    expect(await screen.findByText('Arroz com feijão')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Entrar para acessar' }))
    expect(login).toHaveBeenCalledWith('/situacao-do-curso')
  })

  it('shows the authenticated home without the next-step panel', async () => {
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
    expect(screen.queryByText('Próximo passo')).toBeNull()
  })

  it('invites the student to evaluate a professor pending from the previous semester', async () => {
    authState.isAuthenticated = true
    authState.profile = { given_name: 'Ana' }
    studentState.studentId = 1
    listPendingProfessorEvaluations.mockResolvedValue([
      {
        attemptId: 1,
        class: { id: 30, code: 'A' },
        course: { id: 10, code: 'MA111', name: 'Cálculo' },
        professor: { id: 50, name: 'Ana Silva' },
      },
    ])

    renderHome()

    expect(await screen.findByText('Avalie seus professores')).toBeTruthy()
    expect(listPendingProfessorEvaluations).toHaveBeenCalledWith(
      1,
      { year: 2026, yearPeriod: 'FIRST_SEMESTER' },
      getAccessToken,
    )
  })

  it('registers an absence directly from a finished class today', async () => {
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

    fireEvent.click(await screen.findByRole('button', { name: 'Eu faltei' }))

    await waitFor(() =>
      expect(createStudentAbsence).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          courseAttemptId: 2,
          classScheduleId: 30,
        }),
        getAccessToken,
      ),
    )
    expect(await screen.findByText('Falta registrada em MC102.')).toBeTruthy()
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

    expect(await screen.findByText('Olá, Ana')).toBeTruthy()
    expect(screen.queryByText('Próximo passo')).toBeNull()
  })

  it('keeps the agenda visible without enrolled courses', async () => {
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
    expect(await screen.findByText('Agenda')).toBeTruthy()
    expect(
      screen.getByText('Você não possui disciplinas cursando em 2026s2.'),
    ).toBeTruthy()
    expect(
      await screen.findAllByText('Cardápio não disponível para esta data.'),
    ).toHaveLength(4)
    expect(listClassSchedulesByStudyPeriod).not.toHaveBeenCalled()
  })

  it('shows an empty agenda state when there are no classes on the selected date', async () => {
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

    expect(
      await screen.findByText('Você não tem aulas nesta data.'),
    ).toBeTruthy()
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
      await screen.findByText('Não foi possível carregar as aulas'),
    ).toBeTruthy()
  })

  it('shows the main dishes from the daily menu and changes dates', async () => {
    authState.isAuthenticated = true
    authState.profile = { given_name: 'Ana' }
    studentState.studentId = 1
    listDailyMenus.mockResolvedValue([
      {
        id: 1,
        date: academicDateKey(),
        meals: [
          {
            id: 2,
            period: 'LUNCH',
            diet: 'TRADITIONAL',
            status: 'AVAILABLE',
            mainDish: 'Arroz com feijão',
            serviceNotes: ['Servido no RU'],
            items: ['Arroz', 'Feijão'],
            observations: ['Contém glúten'],
          },
          {
            id: 3,
            period: 'LUNCH',
            diet: 'VEGAN',
            status: 'AVAILABLE',
            mainDish: 'Abóbora assada',
            serviceNotes: [],
            items: [],
            observations: [],
          },
        ],
      },
    ])

    renderHome()

    expect(await screen.findAllByText('Almoço')).toHaveLength(2)
    expect(await screen.findAllByText('Jantar')).toHaveLength(2)
    expect(await screen.findByText('Arroz com feijão')).toBeTruthy()
    expect(await screen.findByText('Abóbora assada')).toBeTruthy()
    expect(await screen.findByText('Servido no RU')).toBeTruthy()
    const summary = screen.getAllByText('Ver cardápio completo')[0]
    const details = summary.closest('details')
    if (!details) throw new Error('Details do cardápio não encontrado.')
    expect(details.open).toBe(false)
    fireEvent.click(summary)
    expect(details.open).toBe(true)
    expect(await screen.findByText('Contém glúten')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Dia anterior' }))
    await waitFor(() => expect(listDailyMenus).toHaveBeenCalledTimes(2))
    expect(screen.getByRole('button', { name: 'Hoje' })).toBeTruthy()
  })
})
