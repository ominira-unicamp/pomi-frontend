import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CourseSituationPage } from './CourseSituationPage'

const {
  listStudentCourseAttempts,
  listClassesForStudentCourseAttempt,
  listClassSchedulesByStudyPeriod,
  listStudyPeriods,
  listStudentAbsences,
} = vi.hoisted(() => ({
  listStudentCourseAttempts: vi.fn(),
  listClassesForStudentCourseAttempt: vi.fn(),
  listClassSchedulesByStudyPeriod: vi.fn(),
  listStudyPeriods: vi.fn(),
  listStudentAbsences: vi.fn(),
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
    load: () =>
      Promise.resolve({
        ok: true,
        value: { catalogPrograms: [], courses: [] },
      }),
  }),
}))

vi.mock('@/student/data/studentApi', () => ({
  listStudentCourseAttempts,
  listClassesForStudentCourseAttempt,
  listClassSchedulesByStudyPeriod,
  listStudyPeriods,
  createStudentCourseAttempt: vi.fn(),
  deleteStudentCourseAttempt: vi.fn(),
  patchStudentCourseAttempt: vi.fn(),
  patchStudentProfile: vi.fn(),
}))

vi.mock('@/student/data/studentAbsenceApi', () => ({
  listStudentAbsences,
  createStudentAbsence: vi.fn(),
  deleteStudentAbsence: vi.fn(),
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
    listStudyPeriods.mockResolvedValue([
      { id: 20, code: '1s2026', startDate: '2026-02-01' },
      { id: 19, code: '2s2025', startDate: '2025-08-01' },
    ])
    listClassSchedulesByStudyPeriod.mockResolvedValue([
      {
        id: 40,
        classId: 30,
        classCode: 'A',
        courseCode: 'MC102',
        studyPeriodId: 20,
        dayOfWeek: 'MONDAY',
        start: '08:00',
        end: '10:00',
        roomCode: 'CB01',
      },
    ])
    listStudentCourseAttempts.mockResolvedValue([
      {
        id: 1,
        courseId: 10,
        studyPeriodId: 20,
        classId: 30,
        status: 'ENROLLED',
        grade: null,
        course: { code: 'MC102', name: 'Algoritmos', credits: 6 },
        studyPeriod: { code: '1s2026' },
        class: {
          id: 30,
          code: 'A',
          professors: [{ id: 2, name: 'Docente' }],
        },
      },
      {
        id: 2,
        courseId: 11,
        studyPeriodId: 19,
        classId: null,
        status: 'COMPLETED',
        grade: 8,
        course: { code: 'MA111', name: 'Cálculo I', credits: 6 },
        studyPeriod: { code: '2s2025' },
        class: null,
      },
    ])
    listStudentAbsences.mockResolvedValue([])
  })

  it('starts in Cursando and separates course data from history', async () => {
    renderPage()

    expect(await screen.findByText('MC102 — Algoritmos')).toBeTruthy()
    expect(screen.getByText(/Turma A.*Docente/)).toBeTruthy()
    expect(
      await screen.findByLabelText('MC102, turma A, 08:00 às 10:00, sala CB01'),
    ).toBeTruthy()
    expect(screen.getByText('Agenda das aulas')).toBeTruthy()
    expect(screen.getByText('Disciplinas cursando')).toBeTruthy()
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

    fireEvent.click(
      screen.getByRole('button', { name: 'Adicionar disciplina' }),
    )

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

  it('opens recent classes for absence control from an enrolled course', async () => {
    renderPage()
    await screen.findByText('MC102 — Algoritmos')

    fireEvent.click(screen.getByRole('button', { name: 'Aulas e faltas' }))

    expect(await screen.findByText('Aulas recentes')).toBeTruthy()
    expect(screen.getByText('0 faltas registradas')).toBeTruthy()
    expect(screen.getAllByRole('button', { name: 'Eu faltei' }).length).toBe(8)
  })

  it('switches the schedule between enrolled study periods', async () => {
    listStudentCourseAttempts.mockResolvedValue([
      {
        id: 1,
        courseId: 10,
        studyPeriodId: 20,
        classId: 30,
        status: 'ENROLLED',
        grade: null,
        course: { id: 10, code: 'MC102', name: 'Algoritmos', credits: 6 },
        studyPeriod: { id: 20, code: '1s2026' },
        class: { id: 30, code: 'A', professors: [] },
      },
      {
        id: 2,
        courseId: 11,
        studyPeriodId: 19,
        classId: 31,
        status: 'ENROLLED',
        grade: null,
        course: { id: 11, code: 'MA111', name: 'Cálculo I', credits: 6 },
        studyPeriod: { id: 19, code: '2s2025' },
        class: { id: 31, code: 'B', professors: [] },
      },
    ])
    listClassSchedulesByStudyPeriod.mockImplementation((periodId: number) =>
      Promise.resolve(
        periodId === 20
          ? [
              {
                id: 40,
                classId: 30,
                classCode: 'A',
                courseCode: 'MC102',
                studyPeriodId: 20,
                dayOfWeek: 'MONDAY',
                start: '08:00',
                end: '10:00',
                roomCode: 'CB01',
              },
            ]
          : [
              {
                id: 41,
                classId: 31,
                classCode: 'B',
                courseCode: 'MA111',
                studyPeriodId: 19,
                dayOfWeek: 'TUESDAY',
                start: '10:00',
                end: '12:00',
                roomCode: 'PB02',
              },
            ],
      ),
    )
    renderPage()

    expect(
      await screen.findByLabelText('MC102, turma A, 08:00 às 10:00, sala CB01'),
    ).toBeTruthy()
    const periodSelect = screen.getByRole('combobox', {
      name: 'Período da agenda',
    })
    fireEvent.focus(periodSelect)
    fireEvent.click(await screen.findByRole('option', { name: '2s2025' }))

    await waitFor(() =>
      expect(listClassSchedulesByStudyPeriod).toHaveBeenCalledWith(19),
    )
    expect(
      await screen.findByLabelText('MA111, turma B, 10:00 às 12:00, sala PB02'),
    ).toBeTruthy()
    expect(screen.queryByLabelText(/MC102, turma A/)).toBeNull()
  })

  it('warns when an enrolled course has no class', async () => {
    listStudentCourseAttempts.mockResolvedValue([
      {
        id: 1,
        courseId: 10,
        studyPeriodId: 20,
        classId: null,
        status: 'ENROLLED',
        grade: null,
        course: { id: 10, code: 'MC102', name: 'Algoritmos', credits: 6 },
        studyPeriod: { id: 20, code: '1s2026' },
        class: null,
      },
    ])
    listClassSchedulesByStudyPeriod.mockResolvedValue([])
    renderPage()

    expect(await screen.findByText('Agenda parcial')).toBeTruthy()
    expect(screen.getByText(/1 disciplina ficou fora da agenda/)).toBeTruthy()
    expect(await screen.findByText('Nenhum horário disponível')).toBeTruthy()
    expect(screen.getByText('MC102 — Algoritmos')).toBeTruthy()
  })

  it('rejects grades greater than ten before submitting', async () => {
    renderPage()
    await screen.findByText('MC102 — Algoritmos')
    fireEvent.click(
      screen.getByRole('button', { name: 'Adicionar disciplina' }),
    )

    fireEvent.change(
      screen.getByRole('textbox', { name: 'Nota (quando houver)' }),
      { target: { value: '11' } },
    )

    expect(screen.getByRole('alert').textContent).toContain(
      'Informe uma nota entre 0 e 10.',
    )
    expect(
      screen.getByRole<HTMLButtonElement>('button', { name: 'Salvar' })
        .disabled,
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
