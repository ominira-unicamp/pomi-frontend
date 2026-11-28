import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SemesterPlanCreationPage } from './SemesterPlanCreationPage'
import { ApiError } from '@/api/errors'

const mocks = vi.hoisted(() => ({
  create: vi.fn().mockResolvedValue({ id: 9 }),
  navigate: vi.fn(),
  ensure: vi.fn().mockResolvedValue(1),
}))

vi.mock('@tanstack/react-router', () => ({ useNavigate: () => mocks.navigate }))
vi.mock('@/auth/AuthProvider', () => ({
  useOptionalAuth: () => ({ isAuthenticated: true, getAccessToken: vi.fn() }),
}))
vi.mock('@/features/student/hooks/useStudentAcademicProfile', () => ({
  useStudentAcademicProfile: () => ({ profileQuery: {} }),
}))
vi.mock('@/features/identity/identityApi', () => ({
  requireCurrentUserId: mocks.ensure,
}))
vi.mock('@/catalog/data/curriculumCatalogApi', () => ({
  loadCurriculumCatalog: () =>
    Promise.resolve({
      ok: true,
      value: { catalogPrograms: [] },
    }),
}))
vi.mock('@/features/semester-planner/data/semesterPlanningApi', () => ({
  loadSemesterPlannerStaticData: () =>
    Promise.resolve({
      studyPeriods: [
        {
          id: 1,
          year: 2027,
          yearPeriod: 'FIRST_SEMESTER',
          startDate: '2027-02-01',
        },
        {
          id: 2,
          year: 2026,
          yearPeriod: 'SECOND_SEMESTER',
          startDate: '2026-08-01',
        },
        {
          id: 3,
          year: 2026,
          yearPeriod: 'FIRST_SEMESTER',
          startDate: '2026-02-01',
        },
      ],
    }),
  createSemesterPlanning: mocks.create,
}))
vi.mock('@/planning-drafts/components/InitialAcademicSelectionFields', () => ({
  InitialAcademicSelectionFields: ({
    onChange,
  }: {
    onChange: (value: object) => void
  }) => (
    <>
      <button
        onClick={() =>
          onChange({
            catalogProgramId: '42',
            catalogProgramVariantId: '7',
            languageId: '',
          })
        }
      >
        Sem língua
      </button>
      <button
        onClick={() =>
          onChange({
            catalogProgramId: '42',
            catalogProgramVariantId: '7',
            languageId: '3',
          })
        }
      >
        Completo
      </button>
    </>
  ),
}))

async function openProgramGuide() {
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <SemesterPlanCreationPage />
    </QueryClientProvider>,
  )
  const period = await screen.findByRole('combobox', {
    name: 'Período letivo do planejamento',
  })
  fireEvent.focus(period)
  fireEvent.click(await screen.findByText('2027 · 1º semestre'))
  fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))
  fireEvent.click(screen.getByRole('button', { name: /^Programa/ }))
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.create.mockResolvedValue({ id: 9 })
})

describe('SemesterPlanCreationPage', () => {
  it('defaults to the latest available semester and allows choosing another', async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <SemesterPlanCreationPage />
      </QueryClientProvider>,
    )

    const period = await screen.findByRole<HTMLInputElement>('combobox', {
      name: 'Período letivo do planejamento',
    })
    await waitFor(() => expect(period.value).toBe('2027 · 1º semestre'))
    expect(
      screen.getByRole<HTMLButtonElement>('button', { name: 'Continuar' })
        .disabled,
    ).toBe(false)

    fireEvent.focus(period)
    fireEvent.click(await screen.findByText('2026 · 2º semestre'))
    expect(period.value).toBe('2026 · 2º semestre')
  })

  it('logs an explicit API rejection and preserves the review for retry', async () => {
    const error = new ApiError(422)
    mocks.create.mockRejectedValueOnce(error)
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    try {
      await openProgramGuide()
      fireEvent.click(screen.getByRole('button', { name: 'Completo' }))
      fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))
      fireEvent.click(
        screen.getByRole('button', { name: 'Criar planejamento' }),
      )
      expect((await screen.findByRole('alert')).textContent).toContain(
        'Suas escolhas foram mantidas',
      )
      expect(log).toHaveBeenCalledWith(
        '[semester-planner] create failed',
        error,
      )
      fireEvent.click(
        screen.getByRole('button', { name: 'Criar planejamento' }),
      )
      await waitFor(() =>
        expect(mocks.navigate).toHaveBeenCalledWith({
          to: '/planejamentos-de-semestre/$planejamentoId',
          params: { planejamentoId: '9' },
        }),
      )
    } finally {
      log.mockRestore()
    }
  })

  it('creates a program guide without an additional language', async () => {
    await openProgramGuide()
    fireEvent.click(screen.getByRole('button', { name: 'Sem língua' }))
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Criar planejamento' }))
    await waitFor(() =>
      expect(mocks.create).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          studyPeriodId: 1,
          guide: expect.objectContaining({
            program: {
              catalogProgramId: 42,
              catalogProgramVariantId: 7,
              languageId: null,
            },
          }),
        }),
        expect.any(Function),
      ),
    )
  })
})

it('preserves the program configuration when the initial view is none', async () => {
  await openProgramGuide()
  fireEvent.click(screen.getByRole('button', { name: 'Sem língua' }))
  fireEvent.click(screen.getByRole('button', { name: /^Nenhum/ }))
  fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))
  fireEvent.click(screen.getByRole('button', { name: 'Criar planejamento' }))
  await waitFor(() =>
    expect(mocks.create).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        guide: expect.objectContaining({
          mode: 'none',
          program: {
            catalogProgramId: 42,
            catalogProgramVariantId: 7,
            languageId: null,
          },
        }),
      }),
      expect.any(Function),
    ),
  )
})

it('does not repeat a creation whose response was lost', async () => {
  const log = vi.spyOn(console, 'error').mockImplementation(() => undefined)
  mocks.create.mockRejectedValueOnce(new Error('Connection lost'))
  try {
    await openProgramGuide()
    fireEvent.click(screen.getByRole('button', { name: 'Completo' }))
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Criar planejamento' }))
    expect((await screen.findByRole('alert')).textContent).toContain(
      'Confira seus planejamentos',
    )
    fireEvent.click(screen.getByRole('button', { name: 'Criar planejamento' }))
    await waitFor(() =>
      expect(screen.getByRole('alert').textContent).toContain(
        'criação anterior não foi confirmada',
      ),
    )
    expect(mocks.create).toHaveBeenCalledOnce()
    expect(mocks.navigate).not.toHaveBeenCalled()
  } finally {
    log.mockRestore()
  }
})
