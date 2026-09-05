import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CurriculumPlanCreationPage } from './CurriculumPlanCreationPage'
import type {
  CatalogProgramId,
  CurriculumPlannerStaticData,
} from '@pomi/planner-domain/curriculum'

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
}))

vi.mock('@/auth/AuthProvider', () => ({
  useOptionalAuth: () => ({
    initialized: true,
    isAuthenticated: false,
    profile: undefined,
    getAccessToken: vi.fn(),
  }),
}))

vi.mock('@/features/student/hooks/useStudentProfile', () => ({
  useStudentProfile: () => ({
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
  it('keeps a manually selected catalog instead of restoring the profile catalog', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <CurriculumPlanCreationPage />
      </QueryClientProvider>,
    )

    fireEvent.click(await screen.findByRole('button', { name: 'Continuar' }))
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
})
