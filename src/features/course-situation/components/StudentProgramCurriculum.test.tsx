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
  { courseId: 10, status: 'APPROVED' },
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
function selectTab(name: string) {
  fireEvent.mouseDown(screen.getByRole('tab', { name }), {
    button: 0,
    ctrlKey: false,
  })
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
  it('shows the saved catalog, program and specialization with the same three catalog views', async () => {
    renderCurriculum()
    expect(
      screen.getByRole('heading', { name: '42 — Ciência da Computação' }),
    ).toBeTruthy()
    expect(screen.getByText('Catálogo 2023')).toBeTruthy()
    expect(screen.getByText('AA — Sistemas')).toBeTruthy()
    expect(screen.queryByText('AB — Teoria')).toBeNull()
    expect(screen.getByRole('tab', { name: 'Currículo pleno' })).toBeTruthy()
    selectTab('Proposta de currículo')
    expect(await screen.findByText('1º semestre')).toBeTruthy()
    expect(mocks.suggestions).toHaveBeenCalledWith('101')
    selectTab('Árvore de dependências')
    expect(await screen.findByText('Mostrar eletivas')).toBeTruthy()
    expect(mocks.prerequisites).toHaveBeenCalledWith(2023)
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
    expect(screen.getByText('6 créditos · Catálogo 2023')).toBeTruthy()
  })
  it('uses approved attempts to mark completed disciplines', () => {
    renderCurriculum()
    const toggle = screen.getByRole('switch', {
      name: 'Mostrar disciplinas concluídas',
    })
    expect(toggle.getAttribute('aria-checked')).toBe('false')
    fireEvent.click(toggle)
    expect(toggle.getAttribute('aria-checked')).toBe('true')
    expect(screen.getByText('MC102').closest('tr')?.className).toContain(
      'line-through',
    )
    expect(screen.getByText('MC202').closest('tr')?.className).not.toContain(
      'line-through',
    )
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
