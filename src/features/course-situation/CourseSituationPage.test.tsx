import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CourseSituationPage } from './CourseSituationPage'
import type { ReactNode } from 'react'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}))

const {
  listStudentCourseAttempts,
  listClassesForStudentCourseAttempt,
  listClassSchedulesByStudyPeriod,
  listStudyPeriods,
  deleteStudentCourseAttempt,
  getCourseEvaluationForStudyPeriod,
  getProfessorEvaluation,
  listStudentAbsences,
} = vi.hoisted(() => ({
  listStudentCourseAttempts: vi.fn(),
  listClassesForStudentCourseAttempt: vi.fn(),
  listClassSchedulesByStudyPeriod: vi.fn(),
  listStudyPeriods: vi.fn(),
  deleteStudentCourseAttempt: vi.fn(),
  getCourseEvaluationForStudyPeriod: vi.fn(),
  getProfessorEvaluation: vi.fn(),
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

const academicState = vi.hoisted(() => ({ studentId: 17 as number | null }))

vi.mock('@/features/student/hooks/useStudentAcademicProfile', () => ({
  useStudentAcademicProfile: () => ({
    userId: 1,
    studentId: academicState.studentId,
    userQuery: { isPending: false, isError: false, refetch: vi.fn() },
    profileQuery: {
      isLoading: false,
      isPending: academicState.studentId === null,
      data: academicState.studentId ? { name: 'Estudante' } : undefined,
    },
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

vi.mock('@/features/student/data/studentApi', () => ({
  listStudentCourseAttempts,
  listClassesForStudentCourseAttempt,
  listClassSchedulesByStudyPeriod,
  listStudyPeriods,
  getCourseEvaluationForStudyPeriod,
  getProfessorEvaluation,
  createStudentCourseAttempt: vi.fn(),
  deleteStudentCourseAttempt,
  patchStudentCourseAttempt: vi.fn(),
  patchStudentProfile: vi.fn(),
  putProfessorEvaluation: vi.fn(),
}))

vi.mock('@/features/student/data/studentAbsenceApi', () => ({
  listStudentAbsences,
  createStudentAbsence: vi.fn(),
  deleteStudentAbsence: vi.fn(),
}))

vi.mock('@/features/student/components/CourseProfilePanel', () => ({
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
    academicState.studentId = 17
    authState.isAuthenticated = true
    login.mockReset()
    listClassesForStudentCourseAttempt.mockResolvedValue([])
    getCourseEvaluationForStudyPeriod.mockResolvedValue('GRADE_AND_ATTENDANCE')
    getProfessorEvaluation.mockResolvedValue({
      eligible: true,
      evaluation: null,
    })
    listStudyPeriods.mockResolvedValue([
      {
        id: 20,
        year: 2026,
        yearPeriod: 'FIRST_SEMESTER',
        startDate: '2026-02-01T00:00:00.000Z',
      },
      {
        id: 19,
        year: 2025,
        yearPeriod: 'SECOND_SEMESTER',
        startDate: '2025-08-01T00:00:00.000Z',
      },
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
        evaluationMode: 'GRADE_AND_ATTENDANCE',
        status: 'ENROLLED',
        grade: null,
        course: { code: 'MC102', name: 'Algoritmos', credits: 6 },
        studyPeriod: { id: 20, year: 2026, yearPeriod: 'FIRST_SEMESTER' },
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
        evaluationMode: 'GRADE_AND_ATTENDANCE',
        status: 'APPROVED',
        grade: 8,
        course: { code: 'MA111', name: 'Cálculo I', credits: 6 },
        studyPeriod: { id: 19, year: 2025, yearPeriod: 'SECOND_SEMESTER' },
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

    expect(screen.queryByRole('tab', { name: 'Curso' })).toBeNull()
    fireEvent.click(
      screen.getByRole('button', { name: 'Editar vínculo acadêmico' }),
    )
    expect(await screen.findByText('Curso e ingresso')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }))

    fireEvent.mouseDown(screen.getByRole('tab', { name: /Histórico/ }), {
      button: 0,
      ctrlKey: false,
    })
    expect(await screen.findByText('2025 · 2º semestre')).toBeTruthy()
    expect(screen.getByText('MA111 — Cálculo I')).toBeTruthy()
  })

  it('opens the curriculum in a dedicated tab and keeps academic profile editing available', async () => {
    renderPage()
    const curriculumTab = await screen.findByRole('tab', {
      name: 'Integralização',
    })
    expect(
      screen.queryByRole('tabpanel', { name: 'Integralização' }),
    ).toBeNull()
    expect(screen.queryByText('Consultar currículo do programa')).toBeNull()
    fireEvent.mouseDown(curriculumTab, { button: 0, ctrlKey: false })
    expect(
      await screen.findByRole('tabpanel', { name: 'Integralização' }),
    ).toBeTruthy()
    expect(await screen.findByText('Escolha seu programa')).toBeTruthy()
    expect(
      screen.getByRole('button', { name: 'Editar vínculo acadêmico' }),
    ).toBeTruthy()
    expect(
      screen.queryByRole('button', {
        name: 'Adicionar tentativa ao histórico',
      }),
    ).toBeNull()
    fireEvent.mouseDown(screen.getByRole('tab', { name: /Histórico/ }), {
      button: 0,
      ctrlKey: false,
    })
    expect(await screen.findByText('MA111 — Cálculo I')).toBeTruthy()
    expect(
      screen.queryByRole('tabpanel', { name: 'Integralização' }),
    ).toBeNull()
  })

  it('orders historical semesters from the most recent to the oldest', async () => {
    listStudentCourseAttempts.mockResolvedValue([
      {
        id: 2,
        courseId: 11,
        studyPeriodId: 19,
        classId: null,
        evaluationMode: 'GRADE_AND_ATTENDANCE',
        status: 'APPROVED',
        grade: 8,
        course: { code: 'MA111', name: 'Cálculo I', credits: 6 },
        studyPeriod: { id: 19, year: 2025, yearPeriod: 'SECOND_SEMESTER' },
        class: null,
      },
      {
        id: 3,
        courseId: 12,
        studyPeriodId: 20,
        classId: null,
        evaluationMode: 'GRADE_AND_ATTENDANCE',
        status: 'FAILED_BY_GRADE',
        grade: 4,
        course: { code: 'MC202', name: 'Estruturas', credits: 6 },
        studyPeriod: { id: 20, year: 2026, yearPeriod: 'FIRST_SEMESTER' },
        class: null,
      },
    ])
    renderPage()

    fireEvent.mouseDown(await screen.findByRole('tab', { name: /Histórico/ }), {
      button: 0,
      ctrlKey: false,
    })

    const newest = await screen.findByText('2026 · 1º semestre')
    const oldest = screen.getByText('2025 · 2º semestre')
    expect(
      newest.compareDocumentPosition(oldest) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('requires an explicit evaluation mode and result from the global add action', async () => {
    renderPage()
    await screen.findByText('MC102 — Algoritmos')

    fireEvent.click(
      screen.getByRole('button', { name: 'Adicionar disciplina cursando' }),
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog.className).toContain('bottom-0')
    expect(dialog.className).toContain('slide-in-from-bottom')
    expect(
      screen.getByRole<HTMLInputElement>('combobox', {
        name: 'Modalidade de avaliação',
      }).value,
    ).toBe('')
    expect(
      screen.getByRole<HTMLButtonElement>('button', { name: 'Salvar' })
        .disabled,
    ).toBe(true)
  })

  it('opens an existing attempt without focusing a selector', async () => {
    renderPage()
    await screen.findByText('MC102 — Algoritmos')

    fireEvent.pointerDown(
      screen.getAllByRole('button', { name: /Ações de/ })[0],
      { button: 0, ctrlKey: false },
    )
    fireEvent.click(await screen.findByRole('menuitem', { name: 'Editar' }))

    expect(await screen.findByText('Editar tentativa')).toBeTruthy()
    expect(document.activeElement).not.toBe(
      screen.getByRole('combobox', { name: 'Modalidade de avaliação' }),
    )
  })

  it('requires confirmation before removing an attempt', async () => {
    renderPage()
    await screen.findByText('MC102 — Algoritmos')

    fireEvent.pointerDown(
      screen.getAllByRole('button', { name: /Ações de/ })[0],
      { button: 0, ctrlKey: false },
    )
    fireEvent.click(await screen.findByRole('menuitem', { name: 'Remover' }))

    expect(await screen.findByRole('dialog')).toBeTruthy()
    expect(screen.getByText(/A tentativa de MC102 — Algoritmos/)).toBeTruthy()
    expect(deleteStudentCourseAttempt).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Remover disciplina' }))

    await waitFor(() =>
      expect(deleteStudentCourseAttempt).toHaveBeenCalledWith(
        1,
        1,
        authState.getAccessToken,
      ),
    )
    expect(await screen.findByText('Tentativa removida.')).toBeTruthy()
  })

  it('offers an evaluation for a professor from a completed class', async () => {
    listStudentCourseAttempts.mockResolvedValue([
      {
        id: 2,
        courseId: 11,
        studyPeriodId: 19,
        classId: 31,
        evaluationMode: 'GRADE_AND_ATTENDANCE',
        status: 'APPROVED',
        grade: 8,
        course: { code: 'MA111', name: 'Cálculo I', credits: 6 },
        studyPeriod: { id: 19, year: 2025, yearPeriod: 'SECOND_SEMESTER' },
        class: { id: 31, code: 'A', professors: [{ id: 3, name: 'Docente' }] },
      },
    ])
    renderPage()

    fireEvent.mouseDown(await screen.findByRole('tab', { name: /Histórico/ }), {
      button: 0,
      ctrlKey: false,
    })
    fireEvent.click(
      await screen.findByRole('button', { name: 'Avaliar Docente' }),
    )

    expect(await screen.findByRole('dialog')).toBeTruthy()
    expect(getProfessorEvaluation).toHaveBeenCalledWith(
      1,
      31,
      3,
      authState.getAccessToken,
    )
  })

  it('fixes the evaluation mode from the selected study period after the class', async () => {
    renderPage()
    await screen.findByText('MC102 — Algoritmos')

    fireEvent.pointerDown(
      screen.getAllByRole('button', { name: /Ações de/ })[0],
      { button: 0, ctrlKey: false },
    )
    fireEvent.click(await screen.findByRole('menuitem', { name: 'Editar' }))

    const period = await screen.findByRole('combobox', {
      name: 'Período letivo',
    })
    const classSelect = screen.getByRole('combobox', {
      name: 'Turma (opcional)',
    })
    const evaluationMode = screen.getByRole<HTMLInputElement>('combobox', {
      name: 'Modalidade de avaliação',
    })
    const result = screen.getByRole('combobox', {
      name: 'Resultado da tentativa',
    })

    expect(
      period.compareDocumentPosition(classSelect) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(
      classSelect.compareDocumentPosition(evaluationMode) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(
      evaluationMode.compareDocumentPosition(result) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    await waitFor(() => expect(evaluationMode.value).toBe('Nota e frequência'))
    expect(evaluationMode.disabled).toBe(true)
    expect(getCourseEvaluationForStudyPeriod).toHaveBeenCalledWith(10, 2026)
  })

  it('opens registered absences for an enrolled course', async () => {
    listStudentAbsences.mockResolvedValue([
      {
        id: 3,
        studentCourseAttemptId: 1,
        classScheduleId: 40,
        date: '2026-08-17',
        createdAt: '2026-08-17T12:00:00.000Z',
        updatedAt: '2026-08-17T12:00:00.000Z',
        studyPeriodId: 20,
        studyPeriodYear: 2026,
        studyPeriodYearPeriod: 'FIRST_SEMESTER',
        courseId: 10,
        courseCode: 'MC102',
        classId: 30,
        classCode: 'A',
        dayOfWeek: 'MONDAY',
        start: '08:00',
        end: '10:00',
      },
    ])
    renderPage()
    await screen.findByText('MC102 — Algoritmos')

    fireEvent.click(screen.getByRole('button', { name: 'Aulas e faltas' }))

    expect(await screen.findByText('Faltas registradas')).toBeTruthy()
    expect(screen.getByText('2 horas faltadas')).toBeTruthy()
    expect(screen.getByText('segunda-feira, 17/08/2026')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Desmarcar falta' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Registrar falta' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Registrar falta' }))
    expect(
      screen.getByRole('combobox', { name: 'Semana da falta' }),
    ).toBeTruthy()
    expect(screen.getByRole('combobox', { name: 'Aula da falta' })).toBeTruthy()
  })

  it('switches the schedule between enrolled study periods', async () => {
    listStudentCourseAttempts.mockResolvedValue([
      {
        id: 1,
        courseId: 10,
        studyPeriodId: 20,
        classId: 30,
        evaluationMode: 'GRADE_AND_ATTENDANCE',
        status: 'ENROLLED',
        grade: null,
        course: { id: 10, code: 'MC102', name: 'Algoritmos', credits: 6 },
        studyPeriod: { id: 20, year: 2026, yearPeriod: 'FIRST_SEMESTER' },
        class: { id: 30, code: 'A', professors: [] },
      },
      {
        id: 2,
        courseId: 11,
        studyPeriodId: 19,
        classId: 31,
        evaluationMode: 'GRADE_AND_ATTENDANCE',
        status: 'ENROLLED',
        grade: null,
        course: { id: 11, code: 'MA111', name: 'Cálculo I', credits: 6 },
        studyPeriod: { id: 19, year: 2025, yearPeriod: 'SECOND_SEMESTER' },
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
    fireEvent.click(
      await screen.findByRole('option', { name: '2025 · 2º semestre' }),
    )

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
        evaluationMode: 'GRADE_AND_ATTENDANCE',
        status: 'ENROLLED',
        grade: null,
        course: { id: 10, code: 'MC102', name: 'Algoritmos', credits: 6 },
        studyPeriod: { id: 20, year: 2026, yearPeriod: 'FIRST_SEMESTER' },
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
      screen.getByRole('button', { name: 'Adicionar disciplina cursando' }),
    )

    const evaluationMode = screen.getByRole('combobox', {
      name: 'Modalidade de avaliação',
    })
    fireEvent.focus(evaluationMode)
    fireEvent.click(
      await screen.findByRole('option', { name: 'Nota e frequência' }),
    )
    const result = screen.getByRole('combobox', {
      name: 'Resultado da tentativa',
    })
    fireEvent.focus(result)
    fireEvent.click(await screen.findByRole('option', { name: 'Aprovada' }))

    fireEvent.change(
      screen.getByRole('textbox', { name: 'Nota final (opcional)' }),
      {
        target: { value: '11' },
      },
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

it('loads attempts without an academic profile and keeps academic editing disabled', async () => {
  authState.isAuthenticated = true
  listStudentCourseAttempts.mockResolvedValue([])
  academicState.studentId = null
  renderPage()
  expect(
    await screen.findByRole('button', {
      name: 'Adicionar disciplina cursando',
    }),
  ).toBeTruthy()
  expect(await screen.findByText('Sem vínculo acadêmico')).toBeTruthy()
  expect(
    screen.getByRole<HTMLButtonElement>('button', {
      name: 'Editar vínculo acadêmico',
    }).disabled,
  ).toBe(true)
  expect(listStudentCourseAttempts).toHaveBeenCalledWith(
    1,
    authState.getAccessToken,
  )
})
