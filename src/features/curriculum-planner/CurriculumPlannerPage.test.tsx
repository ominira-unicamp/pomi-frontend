import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { createInMemoryCurriculumPlanner } from '@pomi/planner-domain/curriculum'
import type {
  CatalogProgramId,
  CourseId,
  CurriculumPlannerSnapshot,
  CurriculumPlannerStaticData,
  PlannerRevision,
  PlanningPeriodId,
} from '@pomi/planner-domain/curriculum'
import type { ReactNode } from 'react'
import { CurriculumPlannerPage } from '@/features/curriculum-planner/CurriculumPlannerPage'
import { CurriculumSelectionFields } from '@/features/curriculum-planner/components/CurriculumSelection'
import {
  CurriculumPlannerProvider,
  useCurriculumPlanner,
} from '@/features/curriculum-planner/CurriculumPlannerProvider'

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal()
  return Object.assign({}, actual, {
    Link: ({
      children,
      'aria-label': ariaLabel,
    }: {
      children: ReactNode
      'aria-label'?: string
    }) => (
      <a href="#" aria-label={ariaLabel}>
        {children}
      </a>
    ),
    useNavigate: () => vi.fn(),
  })
})

const staticData: CurriculumPlannerStaticData = {
  courses: [
    {
      id: 'course' as CourseId,
      code: 'CE738',
      name: 'Redes',
      credits: 4,
      prefix: 'CE',
    },
    {
      id: 'second-course' as CourseId,
      code: 'CE739',
      name: 'Sistemas',
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
        electives: [
          {
            type: 'electiveCredits',
            source: { type: 'base' },
            requiredCredits: 4,
            eligibleCourses: [
              { type: 'specificCourse', courseId: 'second-course' as CourseId },
              { type: 'prefix', prefix: 'CE' },
            ],
          },
        ],
      },
      specializations: [],
      languages: [],
    },
  ],
}

function ConcurrentDispatchProbe() {
  const planner = useCurriculumPlanner()
  const plannedCount = planner.snapshot?.plan.periods[0]?.items.length ?? 0
  return (
    <>
      <button
        type="button"
        onClick={() => {
          void Promise.all([
            planner.dispatch({
              type: 'addCourseToPeriod',
              courseId: 'course' as CourseId,
              periodId: 'period-1' as PlanningPeriodId,
            }),
            planner.dispatch({
              type: 'addCourseToPeriod',
              courseId: 'second-course' as CourseId,
              periodId: 'period-1' as PlanningPeriodId,
            }),
          ])
        }}
      >
        Disparar ações simultâneas
      </button>
      <output>{plannedCount}</output>
    </>
  )
}

describe('CurriculumPlannerPage', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('adds multiple courses to the same semester', async () => {
    const planner = createInMemoryCurriculumPlanner({
      staticDataSource: {
        load: () => Promise.resolve({ ok: true, value: staticData }),
      },
      initialState: {
        revision: 'revision' as PlannerRevision,
        selection: {},
        plan: {
          periods: [{ id: 'period-1' as PlanningPeriodId, items: [] }],
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

    await screen.findByRole('heading', { name: 'Semestres' })
    for (const course of ['CE738', 'CE739']) {
      fireEvent.click(
        screen.getByRole('button', {
          name: 'Adicionar disciplina a 1º sem',
        }),
      )
      const input = await screen.findByRole('combobox', {
        name: 'Disciplina para 1º sem',
      })
      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: course } })
      fireEvent.click(await screen.findByText(new RegExp(`^${course}`)))
      fireEvent.click(screen.getByRole('button', { name: 'Adicionar' }))
      await waitFor(() =>
        expect(
          screen.queryByRole('dialog', { name: 'Adicionar disciplina' }),
        ).toBeNull(),
      )
    }

    await waitFor(() =>
      expect(
        screen.getAllByRole('button', { name: /planejada em/ }),
      ).toHaveLength(2),
    )
  })

  it('selects courses with Shift and places them in a semester', async () => {
    const planner = createInMemoryCurriculumPlanner({
      staticDataSource: {
        load: () => Promise.resolve({ ok: true, value: staticData }),
      },
      initialState: {
        revision: 'revision' as PlannerRevision,
        selection: { catalogProgramId: 'program' as CatalogProgramId },
        plan: {
          periods: [
            { id: 'period-1' as PlanningPeriodId, items: [] },
            { id: 'period-2' as PlanningPeriodId, items: [] },
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

    const blocks = await screen.findByRole('region', {
      name: 'Blocos da grade',
    })
    fireEvent.click(
      within(blocks).getByRole('button', { name: /CE738, Redes/ }),
      { shiftKey: true },
    )
    fireEvent.click(
      within(blocks).getByRole('button', { name: /CE739, Sistemas/ }),
      { shiftKey: true },
    )

    expect(screen.getByText(/2 disciplinas selecionadas/)).toBeTruthy()
    expect(screen.queryByRole('dialog')).toBeNull()
    fireEvent.click(screen.getByRole('heading', { name: '2º sem' }))

    await waitFor(() =>
      expect(screen.queryByText(/disciplinas selecionadas/)).toBeNull(),
    )
    const snapshot = await planner.getSnapshot()
    expect(snapshot.ok && snapshot.value.plan.periods[0]?.items).toEqual([])
    expect(snapshot.ok && snapshot.value.plan.periods[1]?.items).toEqual([
      { type: 'course', courseId: 'course' },
      { type: 'course', courseId: 'second-course' },
    ])
  })

  it('allows selecting a completed course from a semester', async () => {
    const planner = createInMemoryCurriculumPlanner({
      staticDataSource: {
        load: () => Promise.resolve({ ok: true, value: staticData }),
      },
      initialState: {
        revision: 'revision' as PlannerRevision,
        selection: { catalogProgramId: 'program' as CatalogProgramId },
        plan: {
          periods: [
            {
              id: 'period-1' as PlanningPeriodId,
              items: [{ type: 'course', courseId: 'course' as CourseId }],
            },
            { id: 'period-2' as PlanningPeriodId, items: [] },
          ],
        },
        academicRecord: {
          completedCourses: [{ courseId: 'course' as CourseId }],
        },
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

    const semesters = await screen.findByRole('region', {
      name: 'Planejamento por semestre',
    })
    fireEvent.click(
      within(semesters).getByRole('button', { name: /CE738, Redes/ }),
      { shiftKey: true },
    )
    expect(screen.getByText(/1 disciplina selecionada/)).toBeTruthy()
    fireEvent.click(screen.getByRole('heading', { name: '2º sem' }))

    await waitFor(() =>
      expect(screen.queryByText(/disciplina selecionada/)).toBeNull(),
    )
    const snapshot = await planner.getSnapshot()
    expect(snapshot.ok && snapshot.value.plan.periods[0]?.items).toEqual([])
    expect(snapshot.ok && snapshot.value.plan.periods[1]?.items).toEqual([
      { type: 'course', courseId: 'course' },
    ])
    expect(
      snapshot.ok && snapshot.value.academicRecord.completedCourses,
    ).toEqual([{ courseId: 'course' }])
  })

  it('selects courses by normal click when selection mode is active', async () => {
    const planner = createInMemoryCurriculumPlanner({
      staticDataSource: {
        load: () => Promise.resolve({ ok: true, value: staticData }),
      },
      initialState: {
        revision: 'revision' as PlannerRevision,
        selection: { catalogProgramId: 'program' as CatalogProgramId },
        plan: {
          periods: [
            { id: 'period-1' as PlanningPeriodId, items: [] },
            { id: 'period-2' as PlanningPeriodId, items: [] },
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

    const blocks = await screen.findByRole('region', {
      name: 'Blocos da grade',
    })
    fireEvent.click(
      screen.getByRole('button', { name: 'Selecionar disciplinas' }),
    )
    fireEvent.click(
      within(blocks).getByRole('button', { name: /CE738, Redes/ }),
    )
    fireEvent.click(
      within(blocks).getByRole('button', { name: /CE739, Sistemas/ }),
    )

    expect(screen.getByText(/2 disciplinas selecionadas/)).toBeTruthy()
    expect(screen.queryByRole('dialog')).toBeNull()
    fireEvent.click(screen.getByRole('heading', { name: '2º sem' }))

    await waitFor(() =>
      expect(screen.queryByText(/disciplinas selecionadas/)).toBeNull(),
    )
    const snapshot = await planner.getSnapshot()
    expect(snapshot.ok && snapshot.value.plan.periods[1]?.items).toEqual([
      { type: 'course', courseId: 'course' },
      { type: 'course', courseId: 'second-course' },
    ])
  })

  it('places selected courses in unallocated', async () => {
    const planner = createInMemoryCurriculumPlanner({
      staticDataSource: {
        load: () => Promise.resolve({ ok: true, value: staticData }),
      },
      initialState: {
        revision: 'revision' as PlannerRevision,
        selection: { catalogProgramId: 'program' as CatalogProgramId },
        plan: {
          periods: [
            {
              id: 'period-1' as PlanningPeriodId,
              items: [{ type: 'course', courseId: 'course' as CourseId }],
            },
            {
              id: 'period-2' as PlanningPeriodId,
              items: [
                { type: 'course', courseId: 'second-course' as CourseId },
              ],
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

    const semesters = await screen.findByRole('region', {
      name: 'Planejamento por semestre',
    })
    fireEvent.click(
      within(semesters).getByRole('button', { name: /CE738, Redes/ }),
      { shiftKey: true },
    )
    fireEvent.click(
      within(semesters).getByRole('button', { name: /CE739, Sistemas/ }),
      { shiftKey: true },
    )
    fireEvent.click(
      within(semesters).getByRole('heading', { name: 'Não alocadas' }),
    )

    await waitFor(() =>
      expect(screen.queryByText(/disciplinas selecionadas/)).toBeNull(),
    )
    const snapshot = await planner.getSnapshot()
    expect(snapshot.ok && snapshot.value.plan.periods[0]?.items).toEqual([])
    expect(snapshot.ok && snapshot.value.plan.periods[1]?.items).toEqual([])
    expect(snapshot.ok && snapshot.value.plan.unallocatedCourseIds).toEqual([
      'course',
      'second-course',
    ])
  })

  it('serializes simultaneous planning actions', async () => {
    const planner = createInMemoryCurriculumPlanner({
      staticDataSource: {
        load: () => Promise.resolve({ ok: true, value: staticData }),
      },
      initialState: {
        revision: 'revision' as PlannerRevision,
        selection: {},
        plan: {
          periods: [{ id: 'period-1' as PlanningPeriodId, items: [] }],
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
          <ConcurrentDispatchProbe />
        </CurriculumPlannerProvider>
      </QueryClientProvider>,
    )

    const output = await screen.findByRole('status')
    expect(output.textContent).toBe('0')
    fireEvent.click(
      screen.getByRole('button', { name: 'Disparar ações simultâneas' }),
    )
    await waitFor(() => expect(output.textContent).toBe('2'))
  })

  it('preserves compatible options when changing the catalog', async () => {
    const selectedProgram = staticData.catalogPrograms[0]
    const selectionStaticData: CurriculumPlannerStaticData = {
      ...staticData,
      catalogPrograms: [
        {
          ...selectedProgram,
          id: 'program-2026' as CatalogProgramId,
          catalog: { id: 'catalog-2026' as never, year: 2026 },
          program: { ...selectedProgram.program, id: 'program-id' as never },
          specializations: [
            {
              id: 'specialization' as never,
              code: 'ESP',
              name: 'Especial',
              blocks: { mandatory: [], electives: [] },
            },
          ],
          languages: [
            {
              id: 'language' as never,
              name: 'Inglês',
              blocks: { mandatory: [], electives: [] },
            },
          ],
        },
        {
          ...selectedProgram,
          id: 'program-2025' as CatalogProgramId,
          catalog: { id: 'catalog-2025' as never, year: 2025 },
          program: { ...selectedProgram.program, id: 'program-id' as never },
          specializations: [
            {
              id: 'specialization' as never,
              code: 'ESP',
              name: 'Especial',
              blocks: { mandatory: [], electives: [] },
            },
          ],
          languages: [
            {
              id: 'language' as never,
              name: 'Inglês',
              blocks: { mandatory: [], electives: [] },
            },
          ],
        },
      ],
    }
    const snapshot: CurriculumPlannerSnapshot = {
      revision: 'revision' as PlannerRevision,
      selection: {
        catalogProgramId: 'program-2026' as CatalogProgramId,
        specializationId: 'specialization' as never,
        languageId: 'language' as never,
      },
      plan: { periods: [] },
      academicRecord: { completedCourses: [] },
    }
    const dispatch = vi.fn().mockResolvedValue(true)

    render(
      <CurriculumSelectionFields
        staticData={selectionStaticData}
        snapshot={snapshot}
        disabled={false}
        dispatch={dispatch}
      />,
    )

    const catalog = screen.getByRole('combobox', { name: 'Catálogo' })
    fireEvent.focus(catalog)
    fireEvent.click(
      await screen.findByRole('option', { name: 'Catálogo 2025' }),
    )

    await waitFor(() => expect(dispatch).toHaveBeenCalledTimes(3))
    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: 'selectCatalogProgram',
      catalogProgramId: 'program-2025',
    })
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: 'selectSpecialization',
      specializationId: 'specialization',
    })
    expect(dispatch).toHaveBeenNthCalledWith(3, {
      type: 'selectLanguage',
      languageId: 'language',
    })
  })

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
    fireEvent.click(
      screen.getByRole('button', { name: /CE739, Sistemas, 4 créditos/ }),
    )
    expect(await screen.findByText('Local no planejamento')).toBeTruthy()
    const locationSelect = screen.getByRole('combobox', {
      name: 'Local de CE739 no planejamento',
    })
    expect(locationSelect).toBeTruthy()
    fireEvent.focus(locationSelect)
    expect(
      await screen.findByRole('option', { name: '5º sem - 1s2026' }),
    ).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /Fechar/ }))
    const semesterHeadings = screen
      .getAllByRole('heading', { level: 3 })
      .filter((heading) => heading.textContent.includes('sem -'))
    expect(semesterHeadings.map((heading) => heading.textContent)).toEqual([
      '5º sem - 1s2026',
      '6º sem - 2s2026',
    ])
    const planningBoard = screen.getByRole('region', {
      name: 'Planejamento por semestre',
    })
    expect(
      within(planningBoard)
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual(['Não alocadas', '5º sem - 1s2026', '6º sem - 2s2026'])
    const courseCard = screen.getByRole('button', {
      name: /CE738, Redes, 4 créditos/,
    })
    expect(courseCard.textContent).toBe('CE738(04)')
    expect(
      screen.getByRole('button', { name: 'Início: 5º sem - 1s2026' }),
    ).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Recolher' })).toBeNull()
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
    await waitFor(() =>
      expect(
        screen.queryByRole('dialog', { name: 'Adicionar disciplina' }),
      ).toBeNull(),
    )
    fireEvent.pointerDown(
      screen.getByRole('button', { name: 'Ações de 5º sem - 1s2026' }),
      { button: 0, ctrlKey: false },
    )
    expect(
      screen.queryByRole('menuitem', {
        name: 'Marcar disciplinas como concluídas',
      }),
    ).toBeNull()
    fireEvent.click(
      await screen.findByRole('menuitem', { name: 'Desmarcar como atual' }),
    )
    await waitFor(() => expect(screen.queryByText('Atual')).toBeNull())
    fireEvent.click(courseCard)
    expect(await screen.findByText('Conclusão')).toBeTruthy()
    expect(
      screen.queryByRole('button', { name: 'Marcar como concluída' }),
    ).toBeNull()
    expect(screen.queryByRole('button', { name: 'Desmarcar' })).toBeNull()
  })

  it('switches the base to a table and searches courses from a prefix', async () => {
    const planner = createInMemoryCurriculumPlanner({
      staticDataSource: {
        load: () => Promise.resolve({ ok: true, value: staticData }),
      },
      initialState: {
        revision: 'revision' as PlannerRevision,
        selection: { catalogProgramId: 'program' as CatalogProgramId },
        plan: {
          periods: [
            {
              id: 'period-1' as PlanningPeriodId,
              items: [{ type: 'course', courseId: 'course' as CourseId }],
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

    const blocks = await screen.findByRole('region', {
      name: 'Blocos da grade',
    })
    fireEvent.click(within(blocks).getByRole('button', { name: 'CE---' }))
    let dialog = await screen.findByRole('dialog', {
      name: 'Adicionar disciplina CE---',
    })
    expect(within(dialog).getByText('CE738')).toBeTruthy()
    expect(
      (
        within(dialog).getByRole('button', {
          name: /Selecionar CE738, Redes/,
        }) as HTMLTableRowElement
      ).getAttribute('aria-disabled'),
    ).toBe('true')
    expect(within(dialog).getByText('CE739')).toBeTruthy()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Cancelar' }))

    fireEvent.click(within(blocks).getByRole('button', { name: 'Tabela' }))
    expect(within(blocks).getByText('Disciplinas obrigatórias')).toBeTruthy()
    expect(within(blocks).getByText('Disciplinas eletivas I')).toBeTruthy()
    expect(
      within(blocks).queryByRole('button', {
        name: 'Ver informações de CE738',
      }),
    ).toBeNull()
    expect(
      within(blocks).getByRole('link', { name: 'Abrir disciplina CE739' }),
    ).toBeTruthy()
    fireEvent.click(
      within(blocks).getByRole('button', {
        name: 'Buscar disciplinas para CE---',
      }),
    )
    dialog = await screen.findByRole('dialog', {
      name: 'Adicionar disciplina CE---',
    })
    fireEvent.click(
      within(dialog).getByRole('button', {
        name: 'Selecionar CE739, Sistemas',
      }),
    )
    fireEvent.click(within(dialog).getByRole('button', { name: 'Adicionar' }))
    await waitFor(() =>
      expect(
        screen.queryByRole('dialog', {
          name: 'Adicionar disciplina CE---',
        }),
      ).toBeNull(),
    )
    expect(
      screen.getByRole('button', {
        name: /CE739, Sistemas, 4 créditos, não planejada/,
      }),
    ).toBeTruthy()
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
    const planningBoard = screen.getByRole('region', {
      name: 'Planejamento por semestre',
    })
    expect(
      within(planningBoard).getByRole('heading', {
        name: 'Nenhum semestre criado',
      }),
    ).toBeTruthy()
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

  it('does not show the suggestion onboarding for a history-based plan', async () => {
    const planner = createInMemoryCurriculumPlanner({
      staticDataSource: {
        load: () => Promise.resolve({ ok: true, value: staticData }),
      },
      initialState: {
        revision: 'revision' as PlannerRevision,
        selection: { catalogProgramId: 'program' as CatalogProgramId },
        plan: { periods: [] },
        academicRecord: {
          completedCourses: [{ courseId: 'course' as CourseId }],
        },
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

    await screen.findByRole('heading', { name: 'Semestres' })
    expect(
      screen.queryByRole('heading', { name: 'Comece por uma sugestão' }),
    ).toBeNull()
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
