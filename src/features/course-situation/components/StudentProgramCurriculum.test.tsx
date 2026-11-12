import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { StudentProgramCurriculum } from './StudentProgramCurriculum'
import type {
  CatalogId,
  CatalogProgramId,
  CatalogProgramVariantId,
  CourseId,
  CurriculumPlannerStaticData,
  ProgramId,
} from '@pomi/planner-domain/curriculum'
import type {
  StudentCourseAttempt,
  StudentProfile,
} from '@/features/student/data/studentApi'
import type { ReactNode } from 'react'

const mocks = vi.hoisted(() => ({
  suggestions: vi.fn(),
  prerequisites: vi.fn(),
  details: vi.fn(),
}))
vi.mock('@/features/curriculum-planner/data/curriculumSuggestionApi', () => ({
  loadCurriculumSuggestions: mocks.suggestions,
}))
vi.mock('@/features/curriculum-planner/data/curriculumPrerequisiteApi', () => ({
  loadCatalogPrerequisites: mocks.prerequisites,
}))
vi.mock('@/features/curriculum-planner/data/courseDetailsApi', () => ({
  getCatalogCourseDetails: mocks.details,
}))
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}))

const data: CurriculumPlannerStaticData = {
  catalogPrograms: [
    {
      id: '101' as CatalogProgramId,
      title: 'Computação 2023',
      catalog: { id: '1' as CatalogId, year: 2023 },
      program: {
        id: '42' as ProgramId,
        code: '42',
        name: 'Ciência da Computação',
      },
      baseBlocks: {
        mandatory: [
          {
            type: 'course',
            source: { type: 'base' },
            selector: { type: 'specificCourse', courseId: '10' as CourseId },
          },
        ],
        electives: [],
      },
      variants: [
        {
          id: '7' as CatalogProgramVariantId,
          specializationId: 70,
          code: 'AA',
          name: 'Sistemas',
          blocks: {
            mandatory: [
              {
                type: 'course',
                source: {
                  type: 'variant',
                  catalogProgramVariantId: '7' as CatalogProgramVariantId,
                },
                selector: {
                  type: 'specificCourse',
                  courseId: '11' as CourseId,
                },
              },
            ],
            electives: [],
          },
        },
        {
          id: '8' as CatalogProgramVariantId,
          specializationId: 80,
          code: 'AB',
          name: 'Teoria',
          blocks: { mandatory: [], electives: [] },
        },
      ],
      languages: [],
    },
  ],
  courses: [
    {
      id: '10' as CourseId,
      code: 'MC102',
      name: 'Algoritmos',
      credits: 6,
      prefix: 'MC',
    },
    {
      id: '11' as CourseId,
      code: 'MC202',
      name: 'Estruturas de dados',
      credits: 4,
      prefix: 'MC',
    },
  ],
}
const profile: StudentProfile = {
  id: 1,
  name: 'Estudante',
  catalogId: 1,
  programId: 42,
  specializationId: 70,
  entryYear: 2023,
  languageId: null,
}
const attempts = [
  { id: 1, courseId: 10, status: 'APPROVED', studyPeriod: null },
] as Array<StudentCourseAttempt>
function renderCurriculum(
  selected: StudentProfile | undefined = profile,
  overrides: Partial<Parameters<typeof StudentProgramCurriculum>[0]> = {},
) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const props = {
    profile: selected,
    data,
    isLoading: false,
    isError: false,
    onRetry: vi.fn(),
    attempts,
    attemptsLoading: false,
    ...overrides,
  }
  const wrap = (next: typeof props) => (
    <QueryClientProvider client={client}>
      <StudentProgramCurriculum {...next} />
    </QueryClientProvider>
  )
  const view = render(wrap(props))
  return {
    ...view,
    props,
    update: (next: Partial<typeof props>) =>
      view.rerender(wrap({ ...props, ...next })),
  }
}
beforeEach(() => {
  vi.clearAllMocks()
  mocks.details.mockResolvedValue(null)
  mocks.prerequisites.mockResolvedValue({
    rules: [
      {
        courseId: '11',
        alternatives: [
          {
            key: 'MC102',
            allOf: [
              {
                target: { type: 'course', courseId: '10', fulfillment: 'FULL' },
              },
            ],
          },
        ],
      },
    ],
  })
  mocks.suggestions.mockResolvedValue([
    {
      id: '1',
      catalogProgramId: '101',
      catalogProgramVariantId: '7',
      programName: 'Ciência da Computação',
      specialization: { id: 70, code: 'AA', name: 'Sistemas' },
      semesters: [
        { semester: 1, electiveCredits: 0, courses: [data.courses[0]] },
      ],
    },
  ])
})
describe('saved program curriculum', () => {
  it('shows the same curriculum views and block tables as the catalog', async () => {
    renderCurriculum()
    expect(
      screen.queryByText(/disciplinas obrigatórias identificadas/),
    ).toBeNull()
    expect(screen.getByRole('tab', { name: 'Currículo pleno' })).toBeTruthy()
    expect(screen.getByText('AA — Sistemas')).toBeTruthy()
    expect(screen.queryByText('AB — Teoria')).toBeNull()
    expect(screen.getByText('Núcleo comum ao curso')).toBeTruthy()
    fireEvent.mouseDown(
      screen.getByRole('tab', { name: 'Proposta de currículo' }),
    )
    expect(await screen.findByText('1º semestre')).toBeTruthy()
    fireEvent.mouseDown(
      screen.getByRole('tab', { name: 'Árvore de dependências' }),
    )
    expect(
      await screen.findByText(
        'Visualize as relações entre as disciplinas deste currículo.',
      ),
    ).toBeTruthy()
  })
  it('opens academic details using the selected historical catalog', async () => {
    renderCurriculum()
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Ver informações de MC102',
      }),
    )
    expect(
      await screen.findByRole('dialog', { name: 'MC102 — Algoritmos' }),
    ).toBeTruthy()
    await waitFor(() => expect(mocks.details).toHaveBeenCalledWith(10, 2023))
    expect(document.activeElement?.textContent).toBe('MC102 — Algoritmos')
    expect(screen.getByText('6 créditos · Catálogo 2023')).toBeTruthy()
  })
  it('marks approved courses in the shared catalog table', () => {
    renderCurriculum()
    expect(screen.getByText('MC102').closest('tr')?.className).toContain(
      'line-through',
    )
    expect(screen.getByText('MC202').closest('tr')?.className).not.toContain(
      'line-through',
    )
  })
  it('hides and restores completed courses in the integralization tables', () => {
    renderCurriculum()
    fireEvent.click(
      screen.getByRole('switch', {
        name: 'Mostrar disciplinas concluídas',
      }),
    )
    expect(screen.queryByText('MC102')).toBeNull()
    expect(screen.getByText('MC202')).toBeTruthy()
    fireEvent.click(
      screen.getByRole('switch', {
        name: 'Mostrar disciplinas concluídas',
      }),
    )
    expect(screen.getByText('MC102')).toBeTruthy()
  })
  it('keeps enrolled courses after hiding their completed prerequisites in the dependency tree', async () => {
    renderCurriculum(profile, {
      attempts: [
        ...attempts,
        {
          id: 2,
          courseId: 11,
          status: 'ENROLLED',
          studyPeriod: null,
        } as StudentCourseAttempt,
      ],
    })
    fireEvent.mouseDown(
      screen.getByRole('tab', { name: 'Árvore de dependências' }),
    )
    const tree = await screen.findByRole('region', {
      name: 'Árvore de dependências',
    })
    expect(tree.textContent).toContain('MC102')
    expect(tree.textContent).toContain('MC202')

    fireEvent.click(
      screen.getByRole('switch', {
        name: 'Mostrar disciplinas concluídas',
      }),
    )

    expect(tree.textContent).not.toContain('MC102')
    expect(tree.textContent).toContain('MC202')
    fireEvent.click(
      screen.getByRole('switch', { name: 'Mostrar disciplinas concluídas' }),
    )
    expect(tree.textContent).toContain('MC102')
    expect(tree.textContent).toContain('MC202')
    expect(
      screen.queryByRole('button', { name: 'Ocultar concluídas' }),
    ).toBeNull()
  })
  it('does not present a failed personal request as an empty history and keeps the original available', () => {
    const retry = vi.fn()
    renderCurriculum(profile, {
      attempts: [],
      attemptsError: true,
      onRetryAttempts: retry,
    })
    expect(
      screen.getByText('Não foi possível consultar sua trajetória'),
    ).toBeTruthy()
    expect(screen.queryByText(/Nenhuma tentativa registrada/)).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect(retry).toHaveBeenCalledOnce()
    expect(screen.getByText('Núcleo comum ao curso')).toBeTruthy()
  })
  it('explains repeated attempts in the academic detail and offers the existing history flow', async () => {
    const onOpenHistory = vi.fn()
    renderCurriculum(profile, {
      onOpenHistory,
      attempts: [
        { id: 1, courseId: 10, status: 'FAILED_BY_GRADE', studyPeriod: null },
        { id: 2, courseId: 10, status: 'ENROLLED', studyPeriod: null },
      ] as Array<StudentCourseAttempt>,
    })
    fireEvent.click(
      screen.getByRole('button', { name: 'Ver informações de MC102' }),
    )
    expect(await screen.findByRole('dialog')).toBeTruthy()
    expect(screen.getByText('Seus registros nesta disciplina')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Consultar histórico' }))
    expect(onOpenHistory).toHaveBeenCalledOnce()
    expect(onOpenHistory).toHaveBeenCalledOnce()
  })
  it('keeps loading separate from empty history and allows original consultation', () => {
    const view = renderCurriculum(profile, {
      attempts: [],
      attemptsLoading: true,
    })
    expect(screen.getByText('Carregando registros da trajetória')).toBeTruthy()
    expect(screen.queryByText(/Nenhuma tentativa registrada/)).toBeNull()
    expect(screen.getByText('Núcleo comum ao curso')).toBeTruthy()
    view.update({ attemptsLoading: false })
    expect(screen.getByText(/Nenhuma tentativa registrada/)).toBeTruthy()
  })
  it('keeps withdrawals and failures unapproved while recognizing proficiency in the same discipline', async () => {
    renderCurriculum(profile, {
      attempts: [
        { id: 1, courseId: 10, status: 'DROPPED', studyPeriod: null },
        {
          id: 2,
          courseId: 10,
          status: 'FAILED_BY_ATTENDANCE',
          studyPeriod: null,
        },
        {
          id: 3,
          courseId: 11,
          status: 'APPROVED_BY_PROFICIENCY',
          studyPeriod: null,
        },
      ] as Array<StudentCourseAttempt>,
    })
    expect(
      screen.queryByText(/disciplinas obrigatórias identificadas/),
    ).toBeNull()
    expect(screen.getByText('MC102').closest('tr')?.className).not.toContain(
      'line-through',
    )
    expect(screen.getByText('MC202').closest('tr')?.className).toContain(
      'line-through',
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'Ver informações de MC102' }),
    )
    expect(await screen.findByText('Desistida')).toBeTruthy()
    expect(screen.getByText('Reprovada por frequência')).toBeTruthy()
  })
  it('does not silently replace a missing saved catalog with another one', () => {
    renderCurriculum({ ...profile, catalogId: 999 })
    expect(
      screen.getByText('Programa não disponível neste catálogo'),
    ).toBeTruthy()
    expect(mocks.suggestions).not.toHaveBeenCalled()
  })
  it('prompts for a program and handles loading and retry without losing the profile form', () => {
    const view = renderCurriculum({ ...profile, programId: null })
    expect(screen.getByText('Escolha seu programa')).toBeTruthy()
    view.update({ isLoading: true })
    expect(screen.getByText('Carregando informações do programa')).toBeTruthy()
    view.update({ isError: true })
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect(view.props.onRetry).toHaveBeenCalledOnce()
  })
  it('keeps the common curriculum visible without a specialization and rejects invalid saved specializations', () => {
    const view = renderCurriculum({ ...profile, specializationId: null })
    expect(screen.getByText('Núcleo comum ao curso')).toBeTruthy()
    expect(
      screen.getByText(/Selecione uma modalidade em Curso e ingresso/),
    ).toBeTruthy()
    view.update({ profile: { ...profile, specializationId: 999 } })
    expect(screen.getByText('Confira a modalidade do programa')).toBeTruthy()
  })
})
