import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  buildInitialState,
  CurriculumPlanCreationPage,
} from './CurriculumPlanCreationPage'
import type { ReactNode } from 'react'
import type {
  CatalogProgramId,
  CurriculumPlannerStaticData,
} from '@pomi/planner-domain/curriculum'

const authState = vi.hoisted(() => ({
  initialized: true,
  isAuthenticated: true,
  profile: undefined,
  sessionSubject: 'test-session',
  getAccessToken: vi.fn(),
}))
const suggestionLoader = vi.hoisted(() =>
  vi.fn(() => Promise.resolve([] as never[])),
)

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: ReactNode }) => <a href="/">{children}</a>,
  useNavigate: () => vi.fn(),
}))

vi.mock('@/auth/AuthProvider', () => ({
  useOptionalAuth: () => authState,
}))

vi.mock('@/features/student/data/studentApi', () => ({
  ensureCurrentStudent: vi.fn(),
  getCurrentStudent: vi.fn(() => Promise.resolve({ studentId: 1 })),
  isApprovedStudentCourseAttempt: (attempt: { status: string }) =>
    attempt.status === 'APPROVED',
  listStudentCourseAttempts: vi.fn(() =>
    Promise.resolve([
      {
        courseId: 101,
        status: 'APPROVED',
        studyPeriod: { year: 2023, yearPeriod: 'FIRST_SEMESTER' },
      },
    ] as never),
  ),
}))

vi.mock('@/features/student/hooks/useStudentProfile', () => ({
  useStudentProfile: () => ({
    studentId: 1,
    profileQuery: {
      data: {
        catalogId: 1,
        programId: 1,
        specializationId: null,
        languageId: null,
      },
    },
  }),
}))

vi.mock('@/catalog/data/curriculumCatalogApi', () => ({
  loadCurriculumCatalog: () => Promise.resolve({ ok: true, value: staticData }),
}))

vi.mock('@/features/curriculum-planner/data/curriculumSuggestionApi', () => ({
  loadCurriculumSuggestions: suggestionLoader,
}))

const staticData: CurriculumPlannerStaticData = {
  courses: [],
  catalogPrograms: [
    {
      id: 'program-2026' as CatalogProgramId,
      title: 'Programa 2026',
      catalog: { id: '1' as never, year: 2026 },
      program: { id: '1' as never, code: '10', name: 'Programa' },
      baseBlocks: { mandatory: [], electives: [] },
      specializations: [],
      languages: [],
    },
    {
      id: 'program-2025' as CatalogProgramId,
      title: 'Programa 2025',
      catalog: { id: '2' as never, year: 2025 },
      program: { id: '1' as never, code: '10', name: 'Programa' },
      baseBlocks: { mandatory: [], electives: [] },
      specializations: [],
      languages: [],
    },
  ],
}

describe('CurriculumPlanCreationPage', () => {
  beforeEach(() => {
    suggestionLoader.mockReset()
    suggestionLoader.mockResolvedValue([] as never[])
  })

  it('shows the academic base before identification', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <CurriculumPlanCreationPage />
      </QueryClientProvider>,
    )

    expect(await screen.findByText('Base acadêmica')).toBeTruthy()
    expect(screen.queryByText('Identificação e início')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))
    expect(await screen.findByText('Identificação e início')).toBeTruthy()
    expect(
      (
        screen
          .getAllByRole('spinbutton')
          .find(
            (input) => input.getAttribute('max') === '9999',
          ) as HTMLInputElement
      ).value,
    ).toBe('2026')
  })

  it('keeps a manually selected catalog instead of restoring the profile catalog', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <CurriculumPlanCreationPage />
      </QueryClientProvider>,
    )

    const catalog = await screen.findByRole('combobox', {
      name: 'Catálogo inicial',
    })
    expect((catalog as HTMLInputElement).value).toBe('Catálogo 2026')

    fireEvent.focus(catalog)
    fireEvent.click(await screen.findByText('Catálogo 2025'))

    await waitFor(() =>
      expect((catalog as HTMLInputElement).value).toBe('Catálogo 2025'),
    )
  })

  it('offers the student history as a starting point', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <CurriculumPlanCreationPage />
      </QueryClientProvider>,
    )

    const history = await screen.findByRole('button', {
      name: /Histórico do aluno/,
    })
    await waitFor(() => expect(history.getAttribute('disabled')).toBeNull())
    expect(
      screen.getByText(
        'Usa as disciplinas do histórico escolar do aluno como já concluídas no planejamento.',
      ),
    ).toBeTruthy()
    fireEvent.click(history)
    expect(suggestionLoader).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))
    expect(
      (
        screen
          .getAllByRole('spinbutton')
          .find(
            (input) => input.getAttribute('max') === '9999',
          ) as HTMLInputElement
      ).value,
    ).toBe('2023')
    expect(
      (
        screen.getByRole('combobox', {
          name: 'Período inicial',
        }) as HTMLInputElement
      ).value,
    ).toBe('1º semestre')
    fireEvent.click(await screen.findByRole('button', { name: 'Continuar' }))

    expect(await screen.findByText('Histórico escolar do aluno')).toBeTruthy()
  })

  it('places approved history courses into the initial planning periods', () => {
    const state = buildInitialState({
      year: 2023,
      semester: 1,
      semesterNumber: 1,
      selection: {
        catalogId: '1',
        programId: '1',
        catalogProgramId: 'program-2026',
        specializationId: '',
        languageId: '',
      },
      completedCourseIds: ['101' as never],
      historyAttempts: [
        {
          courseId: 101,
          status: 'APPROVED',
          studyPeriod: {
            year: 2023,
            yearPeriod: 'FIRST_SEMESTER',
          },
        },
        {
          courseId: 102,
          status: 'ENROLLED',
          studyPeriod: {
            year: 2023,
            yearPeriod: 'FIRST_SEMESTER',
          },
        },
      ] as never,
    })

    expect(state.plan.periods).toHaveLength(1)
    expect(state.plan.periods[0]?.items).toEqual([
      { type: 'course', courseId: '101' },
      { type: 'course', courseId: '102' },
    ])
    expect(state.academicRecord.completedCourses).toEqual([{ courseId: '101' }])
  })

  it('keeps empty calendar semesters when importing history', () => {
    const state = buildInitialState({
      year: 2026,
      semester: 1,
      semesterNumber: 1,
      selection: {
        catalogId: '1',
        programId: '1',
        catalogProgramId: 'program-2026',
        specializationId: '',
        languageId: '',
      },
      completedCourseIds: ['101' as never],
      historyAttempts: [
        {
          courseId: 101,
          status: 'APPROVED',
          studyPeriod: {
            year: 2026,
            yearPeriod: 'SECOND_SEMESTER',
          },
        },
      ] as never,
    })

    expect(state.plan.periods).toHaveLength(2)
    expect(state.plan.periods[0]?.items).toEqual([])
    expect(state.plan.periods[1]?.items).toEqual([
      { type: 'course', courseId: '101' },
    ])
  })

  it('explains what is missing when a suggestion cannot continue', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <CurriculumPlanCreationPage />
      </QueryClientProvider>,
    )

    fireEvent.click(
      await screen.findByRole('button', { name: /Sugestão curricular/ }),
    )

    expect(
      screen.queryByRole('combobox', { name: 'Sugestão inicial' }),
    ).toBeNull()
    expect(
      await screen.findByText(
        'Não há sugestões curriculares disponíveis para o programa selecionado.',
      ),
    ).toBeTruthy()
    expect(
      screen
        .getByRole('button', { name: 'Continuar' })
        .getAttribute('disabled'),
    ).not.toBeNull()
  })
})
