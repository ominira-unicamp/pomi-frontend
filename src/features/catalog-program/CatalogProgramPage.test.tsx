import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CatalogProgramPage } from './CatalogProgramPage'

import type {
  CatalogId,
  CatalogProgramId,
  CourseId,
  CurriculumPlannerStaticData,
  LanguageId,
  ProgramId,
  SpecializationId,
} from '@pomi/planner-domain/curriculum'
import type { ReactNode } from 'react'

const {
  getCatalogCourseDetails,
  loadCatalogPrerequisites,
  loadCurriculumCatalog,
  loadCurriculumSuggestions,
  listStudentCourseAttempts,
  useOptionalAuth,
  useStudentProfile,
} = vi.hoisted(() => ({
  getCatalogCourseDetails: vi.fn(),
  loadCatalogPrerequisites: vi.fn(),
  loadCurriculumCatalog: vi.fn(),
  loadCurriculumSuggestions: vi.fn(),
  listStudentCourseAttempts: vi.fn(),
  useOptionalAuth: vi.fn(),
  useStudentProfile: vi.fn(),
}))

vi.mock('@/catalog/data/curriculumCatalogApi', () => ({
  loadCurriculumCatalog,
}))

vi.mock('@/features/curriculum-planner/data/curriculumSuggestionApi', () => ({
  loadCurriculumSuggestions,
}))

vi.mock('@/features/curriculum-planner/data/curriculumPrerequisiteApi', () => ({
  loadCatalogPrerequisites,
}))

vi.mock('@/features/curriculum-planner/data/courseDetailsApi', () => ({
  getCatalogCourseDetails,
}))

vi.mock('@/features/student/hooks/useStudentProfile', () => ({
  useStudentProfile,
}))

vi.mock('@/features/student/data/studentApi', async () => {
  const actual = await vi.importActual('@/features/student/data/studentApi')
  return { ...actual, listStudentCourseAttempts }
})

vi.mock('@/auth/AuthProvider', () => ({
  useOptionalAuth,
}))

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router')
  return {
    ...actual,
    Link: ({ children }: { children: ReactNode }) => <a href="#">{children}</a>,
  }
})

const staticData: CurriculumPlannerStaticData = {
  catalogPrograms: [
    {
      id: '101' as CatalogProgramId,
      title: 'Música',
      catalog: { id: '1' as CatalogId, year: 2026 },
      program: { id: '22' as ProgramId, code: '22', name: 'Música' },
      baseBlocks: {
        mandatory: [
          {
            type: 'course',
            source: { type: 'base' },
            selector: { type: 'specificCourse', courseId: '1' as CourseId },
          },
        ],
        electives: [
          {
            type: 'electiveCredits',
            source: { type: 'base' },
            requiredCredits: 4,
            eligibleCourses: [
              { type: 'specificCourse', courseId: '2' as CourseId },
              { type: 'prefix', prefix: 'MU' },
            ],
          },
        ],
      },
      specializations: [
        {
          id: '7' as SpecializationId,
          code: 'CB',
          name: 'Contrabaixo',
          blocks: { mandatory: [], electives: [] },
        },
        {
          id: '8' as SpecializationId,
          code: 'CL',
          name: 'Clarineta',
          blocks: { mandatory: [], electives: [] },
        },
      ],
      languages: [
        {
          id: '9' as LanguageId,
          name: 'Inglês',
          blocks: { mandatory: [], electives: [] },
        },
      ],
    },
  ],
  courses: Array.from({ length: 12 }, (_, index) => ({
    id: String(index + 1) as CourseId,
    code: `MU${String(index + 1).padStart(3, '0')}`,
    name: `Disciplina de Música ${index + 1}`,
    credits: 4,
    prefix: 'MU',
  })),
}

const staticDataWithUnorderedPrograms: CurriculumPlannerStaticData = {
  ...staticData,
  catalogPrograms: [
    {
      ...staticData.catalogPrograms[0],
      id: '102' as CatalogProgramId,
      program: {
        id: '3' as ProgramId,
        code: '3',
        name: 'Outro programa',
      },
    },
    ...staticData.catalogPrograms,
  ],
}

const suggestions = [
  {
    id: '11',
    catalogProgramId: '101' as CatalogProgramId,
    code: 'CB',
    name: 'Contrabaixo',
    type: 'SPECIALIZATION' as const,
    specialization: {
      id: '7' as SpecializationId,
      code: 'CB',
      name: 'Contrabaixo',
    },
    semesters: [
      {
        semester: 1,
        electiveCredits: 2,
        courses: [
          {
            id: '1' as CourseId,
            code: 'MU001',
            name: 'Introdução à Música',
            credits: 4,
          },
        ],
      },
    ],
  },
  {
    id: '12',
    catalogProgramId: '101' as CatalogProgramId,
    code: 'CL',
    name: 'Clarineta',
    type: 'SPECIALIZATION' as const,
    specialization: {
      id: '8' as SpecializationId,
      code: 'CL',
      name: 'Clarineta',
    },
    semesters: [],
  },
  {
    id: '13',
    catalogProgramId: '101' as CatalogProgramId,
    code: 'GERAL',
    name: 'Geral',
    type: 'GENERAL' as const,
    semesters: [],
  },
]

const courseDetails = {
  id: 201,
  catalogId: 1,
  catalogYear: 2026,
  courseId: 1,
  code: 'MU001',
  name: 'Disciplina de Música 1',
  credits: 4,
  coordinator: { id: 1, name: 'Coordenação de Música' },
  workload: {
    theoreticalHours: 4,
    practicalHours: null,
    laboratoryHours: null,
    guidedActivityHours: null,
    distanceHours: null,
    guidedExtensionHours: null,
    practicalExtensionHours: null,
    weeks: 15,
    weeklyClassHours: 4,
    classroomHours: 60,
  },
  offeringPeriod: 'ALL_PERIODS' as const,
  evaluation: 'GRADE_AND_ATTENDANCE',
  finalExam: true,
  minimumAttendancePercent: 75,
  syllabus: 'Ementa da disciplina',
  bibliography: null,
  sourceUrl: 'https://example.com/mu001',
  prerequisites: {
    any: [
      {
        all: [
          {
            code: 'MU000',
            kind: 'FULL' as const,
            courseId: 0,
          },
        ],
      },
    ],
  },
}

type TestSearch = Readonly<{
  catalogId?: number
  programId?: number
  catalogProgramId?: number
  specializationId?: number
  dependencyCourseId?: number
  tab: 'full' | 'proposal' | 'dependencies'
}>

function renderPage(
  search: TestSearch = {
    catalogId: 1,
    programId: 22,
    catalogProgramId: 101,
    specializationId: 7,
    tab: 'full' as const,
  },
) {
  const onSearchChange = vi.fn()
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  render(
    <QueryClientProvider client={queryClient}>
      <CatalogProgramPage search={search} onSearchChange={onSearchChange} />
    </QueryClientProvider>,
  )
  return onSearchChange
}

describe('CatalogProgramPage', () => {
  beforeEach(() => {
    loadCurriculumCatalog.mockResolvedValue({ ok: true, value: staticData })
    loadCurriculumSuggestions.mockResolvedValue(suggestions)
    loadCatalogPrerequisites.mockResolvedValue({
      catalogId: 1,
      year: 2026,
      courseIds: ['1', '2'],
      rules: [
        {
          courseId: '2',
          alternatives: [
            {
              key: 'MU001',
              allOf: [
                {
                  kind: 'FULL',
                  target: {
                    type: 'course',
                    courseId: '1',
                    code: 'MU001',
                  },
                },
              ],
            },
          ],
        },
      ],
    })
    getCatalogCourseDetails.mockReset()
    getCatalogCourseDetails.mockResolvedValue(courseDetails)
    listStudentCourseAttempts.mockResolvedValue([])
    useOptionalAuth.mockReturnValue({
      isAuthenticated: false,
      sessionSubject: undefined,
      getAccessToken: vi.fn(),
    })
    useStudentProfile.mockReturnValue({ profileQuery: { data: undefined } })
  })

  it('renders the full curriculum with language options and selected specialization', async () => {
    renderPage()

    expect(await screen.findByText('Núcleo comum ao curso')).toBeTruthy()
    expect(screen.getByText('Opções por língua')).toBeTruthy()
    expect(screen.getByText('Inglês')).toBeTruthy()
    expect(screen.getByText('CB — Contrabaixo')).toBeTruthy()
    expect(screen.getByText('MU001')).toBeTruthy()
    expect(
      screen.getByRole('button', {
        name: 'Reportar dado incorreto do catálogo',
      }),
    ).toBeTruthy()
    expect(
      screen.getByText('Obtenha 4 créditos dentre as opções abaixo.'),
    ).toBeTruthy()
  })

  it('filters specialization proposals by the selected specialization', async () => {
    renderPage({
      catalogId: 1,
      catalogProgramId: 101,
      specializationId: 7,
      tab: 'proposal',
    })

    expect(
      await screen.findByRole('heading', { name: 'CB — Contrabaixo' }),
    ).toBeTruthy()
    expect(screen.queryByText('CL — Clarineta')).toBeNull()
    expect(screen.getByText('1º semestre')).toBeTruthy()
    expect(screen.getByText('2 créditos eletivos')).toBeTruthy()
  })

  it('selects the latest catalog when choosing a program', async () => {
    const onSearchChange = renderPage({ tab: 'full' })
    const program = await screen.findByRole('combobox', { name: 'Programa' })

    fireEvent.focus(program)
    fireEvent.click(await screen.findByRole('option', { name: '22 — Música' }))

    expect(onSearchChange).toHaveBeenCalledWith({
      catalogId: 1,
      programId: 22,
      catalogProgramId: 101,
      specializationId: undefined,
      tab: 'full',
    })
  })

  it('fills the selection from the authenticated student profile', async () => {
    useStudentProfile.mockReturnValue({
      profileQuery: {
        data: {
          catalogId: 1,
          programId: 22,
          specializationId: 7,
        },
      },
    })
    const onSearchChange = renderPage({ tab: 'full' })

    await waitFor(() => {
      expect(onSearchChange).toHaveBeenCalledWith({
        catalogId: 1,
        programId: 22,
        catalogProgramId: 101,
        specializationId: 7,
        tab: 'full',
      })
    })
  })

  it('orders programs numerically by program code', async () => {
    loadCurriculumCatalog.mockResolvedValue({
      ok: true,
      value: staticDataWithUnorderedPrograms,
    })
    renderPage({ tab: 'full' })
    const program = await screen.findByRole('combobox', { name: 'Programa' })

    fireEvent.focus(program)

    expect(
      screen.getAllByRole('option').map((option) => option.textContent),
    ).toEqual(['3 — Outro programa', '22 — Música'])
  })

  it('keeps the scroll position when changing curriculum tabs', async () => {
    const onSearchChange = renderPage()

    fireEvent.mouseDown(
      await screen.findByRole('tab', { name: 'Proposta de currículo' }),
    )

    expect(onSearchChange).toHaveBeenCalledWith(
      {
        catalogId: 1,
        programId: 22,
        catalogProgramId: 101,
        specializationId: 7,
        tab: 'proposal',
      },
      { resetScroll: false },
    )
  })

  it('opens the dependency tab from a connected course row', async () => {
    const onSearchChange = renderPage()

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Ver MU001 na árvore de dependências',
      }),
    )

    expect(onSearchChange).toHaveBeenCalledWith(
      {
        catalogId: 1,
        programId: 22,
        catalogProgramId: 101,
        specializationId: 7,
        tab: 'dependencies',
        dependencyCourseId: 1,
      },
      { resetScroll: false },
    )
    expect(
      screen.queryByRole('button', {
        name: 'Ver MU003 na árvore de dependências',
      }),
    ).toBeNull()
  })

  it('focuses a linked elective when opening its dependency tree', async () => {
    renderPage({
      catalogId: 1,
      programId: 22,
      catalogProgramId: 101,
      specializationId: 7,
      dependencyCourseId: 2,
      tab: 'dependencies',
    })

    expect(
      (
        await screen.findByRole('button', {
          name: 'Remover árvore de MU002',
        })
      ).getAttribute('aria-pressed'),
    ).toBe('true')
    expect(
      screen
        .getByRole('switch', { name: 'Mostrar eletivas' })
        .getAttribute('aria-checked'),
    ).toBe('true')
  })

  it('shows only connected courses and adds only explicit electives', async () => {
    renderPage({
      catalogId: 1,
      programId: 22,
      catalogProgramId: 101,
      specializationId: 7,
      tab: 'dependencies',
    })

    const tree = await screen.findByRole('region', {
      name: 'Árvore de dependências',
    })
    expect(tree.textContent).not.toContain('MU001')
    expect(tree.textContent).not.toContain('MU002')
    expect(tree.textContent).not.toContain('MU003')

    fireEvent.click(screen.getByRole('switch', { name: 'Mostrar eletivas' }))

    expect(tree.textContent).toContain('MU001')
    expect(tree.textContent).toContain('MU002')
    expect(tree.textContent).not.toContain('MU003')
    expect(loadCatalogPrerequisites).toHaveBeenCalledWith(2026)
  })

  it('hides completed courses in the dependency tree', async () => {
    useOptionalAuth.mockReturnValue({
      isAuthenticated: true,
      sessionSubject: 'student-session',
      getAccessToken: vi.fn(),
    })
    useStudentProfile.mockReturnValue({
      studentId: 7,
      profileQuery: { data: undefined },
    })
    listStudentCourseAttempts.mockResolvedValue([
      { courseId: 1, status: 'APPROVED' },
    ])
    renderPage({
      catalogId: 1,
      programId: 22,
      catalogProgramId: 101,
      specializationId: 7,
      tab: 'dependencies',
    })

    const tree = await screen.findByRole('region', {
      name: 'Árvore de dependências',
    })
    fireEvent.click(screen.getByRole('switch', { name: 'Mostrar eletivas' }))
    expect(tree.textContent).toContain('MU001')

    fireEvent.click(screen.getByRole('button', { name: 'Ocultar concluídas' }))

    expect(tree.textContent).not.toContain('MU001')
    expect(
      screen.getByRole('button', { name: 'Mostrar concluídas' }),
    ).toBeTruthy()
  })

  it('expands prefix requirements with local pagination', async () => {
    renderPage()

    fireEvent.click(
      await screen.findByRole('button', { name: 'Expandir MU---' }),
    )

    expect(screen.getByText('MU010')).toBeTruthy()
    expect(screen.queryByText('MU011')).toBeNull()
    expect(
      screen.getByRole('navigation', {
        name: 'Paginação das disciplinas do prefixo MU',
      }),
    ).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Próxima' }))

    expect(screen.getByText('MU011')).toBeTruthy()
    expect(screen.getByText('MU012')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Recolher MU---' })).toBeTruthy()
  })

  it('preserves the program when selecting the catalog', async () => {
    const onSearchChange = renderPage()
    const catalog = await screen.findByRole('combobox', { name: 'Catálogo' })

    fireEvent.focus(catalog)
    fireEvent.click(
      await screen.findByRole('option', { name: 'Catálogo 2026' }),
    )

    expect(onSearchChange).toHaveBeenCalledWith({
      catalogId: 1,
      programId: 22,
      catalogProgramId: 101,
      specializationId: undefined,
      tab: 'full',
    })
  })

  it('opens course details from the full curriculum without navigating', async () => {
    renderPage()

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Ver informações de MU001',
      }),
    )
    expect(
      await screen.findByRole('dialog', {
        name: 'MU001 — Disciplina de Música 1',
      }),
    ).toBeTruthy()
    expect(await screen.findByText('Ementa da disciplina')).toBeTruthy()
    expect(await screen.findByText('MU000')).toBeTruthy()
    expect(screen.queryByText('Informações acadêmicas')).toBeNull()
    expect(screen.getByRole('button', { name: 'Fechar menu' })).toBeTruthy()
    expect(
      screen.getByRole('button', { name: 'Reportar dado incorreto' }),
    ).toBeTruthy()
    expect(getCatalogCourseDetails).toHaveBeenCalledWith(
      1,
      new Date().getFullYear(),
    )
  })

  it('links prerequisite courses to their full discipline page', async () => {
    renderPage()

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Ver informações de MU001',
      }),
    )

    expect(await screen.findByRole('link', { name: 'MU000' })).toBeTruthy()
  })

  it('marks the authenticated student’s approved courses as completed', async () => {
    useOptionalAuth.mockReturnValue({
      isAuthenticated: true,
      sessionSubject: 'student-session',
      getAccessToken: vi.fn(),
    })
    useStudentProfile.mockReturnValue({
      studentId: 7,
      profileQuery: { data: undefined },
    })
    listStudentCourseAttempts.mockResolvedValue([
      { courseId: 1, status: 'APPROVED' },
    ])
    renderPage()

    fireEvent.click(
      await screen.findByRole('switch', {
        name: 'Mostrar disciplinas concluídas',
      }),
    )

    expect(screen.getByText('MU001').closest('tr')?.className).toContain(
      'line-through',
    )
    expect(
      screen
        .getByRole('switch', { name: 'Mostrar disciplinas concluídas' })
        .getAttribute('aria-checked'),
    ).toBe('true')
  })

  it('opens course details from the curriculum proposal', async () => {
    renderPage({
      catalogId: 1,
      catalogProgramId: 101,
      specializationId: 7,
      tab: 'proposal',
    })

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Ver informações de MU001',
      }),
    )

    expect(
      await screen.findByRole('dialog', {
        name: 'MU001 — Introdução à Música',
      }),
    ).toBeTruthy()
  })

  it('opens course details from a prefix course', async () => {
    renderPage()

    fireEvent.click(
      await screen.findByRole('button', { name: 'Expandir MU---' }),
    )
    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Ver informações de MU010',
      }),
    )

    expect(
      await screen.findByRole('dialog', {
        name: 'MU010 — Disciplina de Música 10',
      }),
    ).toBeTruthy()
    expect(getCatalogCourseDetails).toHaveBeenCalledWith(10, 2026)
  })

  it('keeps basic course information when catalog details are unavailable', async () => {
    getCatalogCourseDetails.mockResolvedValue(null)
    renderPage()

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Ver informações de MU001',
      }),
    )

    expect(
      await screen.findByText(
        'Esta disciplina não possui informações acadêmicas no catálogo de 2026.',
      ),
    ).toBeTruthy()
    expect(screen.getByText('4 créditos · Catálogo 2026')).toBeTruthy()
  })
})
