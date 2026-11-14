import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SemesterPlanCreationPage } from './SemesterPlanCreationPage'

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
      studyPeriods: [{ id: 1, year: 2027, yearPeriod: 'FIRST_SEMESTER' }],
    }),
  createSemesterPlanning: mocks.create,
}))
vi.mock(
  '@/features/planning-shared/components/InitialAcademicSelectionFields',
  () => ({
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
  }),
)

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

describe('SemesterPlanCreationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.create.mockResolvedValue({ id: 9 })
  })

  it('logs a creation failure and preserves the review for retry', async () => {
    const error = new Error('Creation failed')
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
