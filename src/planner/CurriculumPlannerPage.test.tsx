import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type {
  CatalogProgramId,
  CourseId,
  CurriculumPlannerStaticData,
  PlannerRevision,
  PlanningPeriodId,
} from '@/lib/curriculumPlanner'
import { createInMemoryCurriculumPlanner } from '@/lib/inMemoryCurriculumPlanner'
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
    const catalog = screen.getByRole('combobox', { name: 'Catálogo' })
    expect(catalog).toBeTruthy()
    expect(screen.getByRole('combobox', { name: 'Programa' })).toBeTruthy()
    expect(
      screen.getByRole('button', { name: 'Adicionar primeiro semestre' }),
    ).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Concluídas' })).toBeTruthy()
    fireEvent.focus(catalog)
    expect(
      screen.getByRole('listbox', { name: 'Opções de Catálogo' }),
    ).toBeTruthy()
    expect(screen.getByRole('option', { name: 'Catálogo 2026' })).toBeTruthy()
  })
})
