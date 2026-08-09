import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type {
  CatalogProgramId,
  CourseId,
  CurriculumPlannerStaticData,
  PlannerRevision,
  PlanningPeriodId,
} from '@/planner/domain/curriculumPlanner'
import { createInMemoryCurriculumPlanner } from '@/planner/domain/inMemoryCurriculumPlanner'
import { CurriculumPlannerPage } from '@/planner/CurriculumPlannerPage'
import { CurriculumPlannerProvider } from '@/planner/CurriculumPlannerProvider'

const staticData: CurriculumPlannerStaticData = {
  courses: [
    {
      id: 'course' as CourseId,
      code: 'CE738',
      name: 'Redes',
      credits: 4,
      prefix: 'CE',
    },
  ],
  catalogPrograms: [
    {
      id: 'program' as CatalogProgramId,
      title: 'Computação',
      catalog: { id: 'catalog' as never, year: 2026 },
      program: {
        id: 'program-id' as never,
        code: '34',
        name: 'Ciência da Computação',
      },
      baseBlocks: {
        mandatory: [
          {
            type: 'course',
            source: { type: 'base' },
            selector: {
              type: 'specificCourse',
              courseId: 'course' as CourseId,
            },
          },
        ],
        electives: [],
      },
      specializations: [],
      languages: [],
    },
  ],
}

describe('CurriculumPlannerPage', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('renders compact curriculum cards and vertical semesters without authentication', async () => {
    const planner = createInMemoryCurriculumPlanner({
      staticDataSource: {
        load: () => Promise.resolve({ ok: true, value: staticData }),
      },
      initialState: {
        revision: 'revision' as PlannerRevision,
        selection: { catalogProgramId: 'program' as CatalogProgramId },
        plan: {
          planningStart: { year: 2026, semester: 1, semesterNumber: 5 },
          currentPeriodId: 'period-1' as PlanningPeriodId,
          periods: [
            {
              id: 'period-1' as PlanningPeriodId,
              items: [],
            },
            {
              id: 'period-2' as PlanningPeriodId,
              items: [],
            },
          ],
        },
        academicRecord: { completedCourses: [] },
      },
    })
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <CurriculumPlannerProvider planner={planner}>
          <CurriculumPlannerPage />
        </CurriculumPlannerProvider>
      </QueryClientProvider>,
    )

    expect(
      await screen.findByRole('heading', { name: 'Blocos da grade' }),
    ).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Base' })).toBeTruthy()
    const semesterHeadings = screen
      .getAllByRole('heading', { level: 3 })
      .filter((heading) => heading.textContent.includes('sem -'))
    expect(semesterHeadings.map((heading) => heading.textContent)).toEqual([
      '5º sem - 1s2026',
      '6º sem - 2s2026',
    ])
    const courseCard = screen.getByRole('button', {
      name: /CE738, Redes, 4 créditos/,
    })
    expect(courseCard.textContent).toBe('CE738(04)')
    expect(
      screen.getByRole('button', { name: 'Início: 5º sem - 1s2026' }),
    ).toBeTruthy()
    expect(
      screen.queryByRole('button', { name: /Recolher.*semestre/i }),
    ).toBeNull()
    const addCourseButtons = screen.getAllByRole('button', {
      name: /Adicionar disciplina a /,
    })
    expect(addCourseButtons).toHaveLength(2)
    fireEvent.click(addCourseButtons[0])
    expect(
      await screen.findByRole('combobox', {
        name: 'Disciplina para 5º sem - 1s2026',
      }),
    ).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    fireEvent.pointerDown(
      screen.getByRole('button', { name: 'Ações de 5º sem - 1s2026' }),
      { button: 0, ctrlKey: false },
    )
    fireEvent.click(
      await screen.findByRole('menuitem', { name: 'Desmarcar como atual' }),
    )
    await waitFor(() => expect(screen.queryByText('Atual')).toBeNull())
    fireEvent.pointerDown(courseCard, { button: 0, ctrlKey: false })
    fireEvent.click(
      await screen.findByRole('menuitem', { name: 'Marcar como concluída' }),
    )
    await waitFor(() =>
      expect(
        screen.queryByRole('button', {
          name: /CE738, Redes, 4 créditos, não planejada/,
        }),
      ).toBeNull(),
    )
  })

  it('allows planning before choosing a catalog and program', async () => {
    const planner = createInMemoryCurriculumPlanner({
      staticDataSource: {
        load: () => Promise.resolve({ ok: true, value: staticData }),
      },
      initialState: {
        revision: 'revision' as PlannerRevision,
        selection: {},
        plan: { periods: [] },
        academicRecord: { completedCourses: [] },
      },
    })
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <CurriculumPlannerProvider planner={planner}>
          <CurriculumPlannerPage />
        </CurriculumPlannerProvider>
      </QueryClientProvider>,
    )

    expect(
      await screen.findByRole('heading', { name: 'Semestres' }),
    ).toBeTruthy()
    expect(screen.queryByRole('combobox', { name: 'Língua' })).toBeNull()
    expect(
      screen.queryByRole('spinbutton', { name: 'Número do semestre inicial' }),
    ).toBeNull()
    const catalog = screen.getByRole('combobox', {
      name: 'Catálogo da sugestão',
    })
    expect(catalog).toBeTruthy()
    expect(
      screen.getByRole('combobox', { name: 'Programa da sugestão' }),
    ).toBeTruthy()
    expect(
      screen.getByRole('button', { name: 'Adicionar primeiro semestre' }),
    ).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Não alocadas' })).toBeTruthy()
    fireEvent.focus(catalog)
    expect(
      screen.getByRole('listbox', { name: 'Opções de Catálogo da sugestão' }),
    ).toBeTruthy()
    expect(screen.getByRole('option', { name: 'Catálogo 2026' })).toBeTruthy()
    fireEvent.click(
      screen.getByRole('button', { name: 'Planejar manualmente' }),
    )
    expect(screen.getByRole('combobox', { name: 'Catálogo' })).toBeTruthy()
    expect(screen.getByRole('combobox', { name: 'Programa' })).toBeTruthy()
    expect(
      screen.queryByRole('heading', { name: 'Comece por uma sugestão' }),
    ).toBeNull()
    expect(
      window.localStorage.getItem(
        'pomi.curriculum-planner.suggestion-onboarding-dismissed',
      ),
    ).toBe('true')
  })

  it('uses a public curriculum suggestion as the first interaction', async () => {
    const suggestionStaticData: CurriculumPlannerStaticData = {
      ...staticData,
      catalogPrograms: staticData.catalogPrograms.map((program) => ({
        ...program,
        id: '1' as CatalogProgramId,
      })),
    }
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        Response.json([
          {
            id: 1,
            catalogProgramId: 1,
            code: 'GERAL',
            name: 'Sugestão geral',
            type: 'GENERAL',
            specialization: null,
            semesters: [
              { semester: 1, electiveCredits: 0, courses: [] },
              { semester: 2, electiveCredits: 0, courses: [] },
            ],
          },
        ]),
      ),
    )
    const planner = createInMemoryCurriculumPlanner({
      staticDataSource: {
        load: () => Promise.resolve({ ok: true, value: suggestionStaticData }),
      },
      initialState: {
        revision: 'revision' as PlannerRevision,
        selection: { catalogProgramId: '1' as CatalogProgramId },
        plan: { periods: [] },
        academicRecord: { completedCourses: [] },
      },
      generateId: (() => {
        const ids = ['period-1', 'period-2', 'revision-2']
        return () => ids.shift()!
      })(),
    })
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    render(
      <QueryClientProvider client={queryClient}>
        <CurriculumPlannerProvider planner={planner}>
          <CurriculumPlannerPage />
        </CurriculumPlannerProvider>
      </QueryClientProvider>,
    )

    expect(
      await screen.findByRole('heading', { name: 'Comece por uma sugestão' }),
    ).toBeTruthy()
    const suggestion = screen.getByRole('combobox', {
      name: 'Sugestão curricular',
    })
    expect((suggestion as HTMLInputElement).disabled).toBe(true)
    const createButton = screen.getByRole('button', {
      name: 'Criar planejamento',
    })
    await waitFor(() =>
      expect((createButton as HTMLButtonElement).disabled).toBe(false),
    )
    fireEvent.click(createButton)

    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: 'Comece por uma sugestão' }),
      ).toBeNull(),
    )
    expect(
      screen
        .getAllByRole('heading', { level: 3 })
        .filter((heading) => heading.textContent.includes('sem -')),
    ).toHaveLength(2)
  })
})
