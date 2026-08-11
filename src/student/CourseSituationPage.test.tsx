import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CourseSituationPage } from './CourseSituationPage'

const { listStudentCourseAttempts } = vi.hoisted(() => ({
  listStudentCourseAttempts: vi.fn(),
}))
const login = vi.fn()
const authState = {
  initialized: true,
  isAuthenticated: true,
  getAccessToken: vi.fn(),
  login,
}

vi.mock('@/auth/AuthProvider', () => ({
  useOptionalAuth: () => authState,
}))

vi.mock('@/student/hooks/useStudentProfile', () => ({
  useStudentProfile: () => ({
    studentId: 1,
    profileQuery: { isLoading: false, data: { name: 'Estudante' } },
  }),
}))

vi.mock('@/catalog/data/curriculumCatalogApi', () => ({
  createCurriculumCatalogDataSource: () => ({
    load: () => Promise.resolve({ ok: true, value: { catalogPrograms: [], courses: [] } }),
  }),
}))

vi.mock('@/student/data/studentApi', () => ({
  listStudentCourseAttempts,
  listStudyPeriods: () => Promise.resolve([]),
  createStudentCourseAttempt: vi.fn(),
  deleteStudentCourseAttempt: vi.fn(),
  patchStudentCourseAttempt: vi.fn(),
  patchStudentProfile: vi.fn(),
}))

vi.mock('@/student/components/CourseProfilePanel', () => ({
  CourseProfilePanel: () => <div>Curso e ingresso</div>,
}))

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <CourseSituationPage />
    </QueryClientProvider>,
  )
}

describe('CourseSituationPage', () => {
  beforeEach(() => {
    authState.isAuthenticated = true
    login.mockReset()
    listStudentCourseAttempts.mockResolvedValue([
      {
        id: 1,
        courseId: 10,
        studyPeriodId: 20,
        status: 'ENROLLED',
        grade: null,
        course: { code: 'MC102', name: 'Algoritmos', credits: 6 },
        studyPeriod: { code: '1s2026' },
      },
      {
        id: 2,
        courseId: 11,
        studyPeriodId: 19,
        status: 'COMPLETED',
        grade: 8,
        course: { code: 'MA111', name: 'Cálculo I', credits: 6 },
        studyPeriod: { code: '2s2025' },
      },
    ])
  })

  it('starts in Cursando and separates course data from history', async () => {
    renderPage()

    expect(await screen.findByText('MC102 — Algoritmos')).toBeTruthy()
    expect(screen.queryByText('Curso e ingresso')).toBeNull()

    fireEvent.mouseDown(screen.getByRole('tab', { name: /Curso/ }), {
      button: 0,
      ctrlKey: false,
    })
    expect(await screen.findByText('Curso e ingresso')).toBeTruthy()
    expect(screen.queryByText('MC102 — Algoritmos')).toBeNull()

    fireEvent.mouseDown(screen.getByRole('tab', { name: /Histórico/ }), {
      button: 0,
      ctrlKey: false,
    })
    expect(await screen.findByText('2s2025')).toBeTruthy()
    expect(screen.getByText('MA111 — Cálculo I')).toBeTruthy()
  })

  it('requires an explicit situation from the global add action', async () => {
    renderPage()
    await screen.findByText('MC102 — Algoritmos')

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar disciplina' }))

    expect(screen.getByRole('dialog')).toBeTruthy()
    expect(
      screen.getByRole<HTMLInputElement>('combobox', { name: 'Situação' })
        .value,
    ).toBe('')
    expect(
      screen.getByRole<HTMLButtonElement>('button', { name: 'Salvar' })
        .disabled,
    ).toBe(true)
  })

  it('rejects grades greater than ten before submitting', async () => {
    renderPage()
    await screen.findByText('MC102 — Algoritmos')
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar disciplina' }))

    fireEvent.change(
      screen.getByRole('textbox', { name: 'Nota (quando houver)' }),
      { target: { value: '11' } },
    )

    expect(screen.getByRole('alert').textContent).toContain(
      'Informe uma nota entre 0 e 10.',
    )
    expect(
      screen.getByRole<HTMLButtonElement>('button', { name: 'Salvar' }).disabled,
    ).toBe(true)
  })

  it('explains the account requirement when the student is not logged in', async () => {
    authState.isAuthenticated = false
    renderPage()

    expect(
      await screen.findByText('Guarde sua trajetória em um só lugar'),
    ).toBeTruthy()
    fireEvent.click(
      screen.getByRole('button', { name: 'Entrar para acompanhar meu curso' }),
    )
    expect(login).toHaveBeenCalledWith('/situacao-do-curso')
  })
})
