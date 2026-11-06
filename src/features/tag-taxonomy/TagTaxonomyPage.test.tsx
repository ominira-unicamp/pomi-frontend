import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TaxonomyExplorePage, TaxonomyTagPage } from './TaxonomyPages'
import { TaxonomyManagePage } from './TaxonomyManagePage'
import type { ReactNode } from 'react'
import { ApiError } from '@/api/errors'

const mocks = vi.hoisted(() => ({
  categories: vi.fn(),
  tags: vi.fn(),
  tag: vi.fn(),
  courses: vi.fn(),
  interests: vi.fn(),
  student: vi.fn(),
  putInterest: vi.fn(),
  updateTag: vi.fn(),
  deleteTag: vi.fn(),
  getCategory: vi.fn(),
  createTag: vi.fn(),
  removeInterest: vi.fn(),
  blocker: vi.fn(),
  auth: {
    initialized: true,
    isAuthenticated: false,
    sessionSubject: 'session',
    login: vi.fn(),
    getAccessToken: vi.fn().mockResolvedValue('token'),
  },
}))
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useBlocker: mocks.blocker,
}))
vi.mock('@/auth/AuthProvider', () => ({ useOptionalAuth: () => mocks.auth }))
vi.mock('./data/tagTaxonomyApi', () => ({
  listCategories: mocks.categories,
  listTags: mocks.tags,
  getTag: mocks.tag,
  listTagCoursesPage: mocks.courses,
  createCategory: vi.fn(),
  createTag: mocks.createTag,
  getCategory: mocks.getCategory,
  updateCategory: vi.fn(),
  updateTag: mocks.updateTag,
  deleteCategory: vi.fn(),
  deleteTag: mocks.deleteTag,
}))
vi.mock('@/features/student/data/studentApi', () => ({
  getCurrentStudent: mocks.student,
}))
vi.mock('@/features/student-interests/data/studentTagInterestApi', () => ({
  listStudentTagInterests: mocks.interests,
  putStudentTagInterest: mocks.putInterest,
  deleteStudentTagInterest: mocks.removeInterest,
}))
const tags = [
  { id: 2, name: 'Álgebra', categoryId: 1, parentTagId: null },
  { id: 3, name: 'Matrizes', categoryId: 1, parentTagId: 2 },
]
function renderPage(page: ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>{page}</QueryClientProvider>,
  )
}
beforeEach(() => {
  vi.clearAllMocks()
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  mocks.auth.initialized = true
  mocks.auth.isAuthenticated = false
  mocks.categories.mockResolvedValue([{ id: 1, name: 'Matemática' }])
  mocks.tags.mockResolvedValue(tags)
  mocks.tag.mockResolvedValue(tags[0])
  mocks.courses.mockResolvedValue({
    data: [{ id: 10, code: 'MA141', name: 'Cálculo I', credits: 6 }],
    links: { next: '/next' },
  })
  mocks.student.mockResolvedValue({ studentId: 7 })
  mocks.interests.mockResolvedValue([])
  mocks.updateTag.mockResolvedValue(tags[0])
  mocks.getCategory.mockResolvedValue({ id: 1, name: 'Matemática' })
  mocks.createTag.mockResolvedValue({
    id: 4,
    name: 'Vetores',
    categoryId: 1,
    parentTagId: 2,
  })
})
describe('taxonomy journeys', () => {
  it('finds accented names and shows their hierarchy', async () => {
    renderPage(
      <TaxonomyExplorePage
        search={{ q: 'algebra' }}
        onSearchChange={vi.fn()}
      />,
    )
    expect(await screen.findByRole('link', { name: 'Álgebra' })).toBeTruthy()
    expect(screen.getByText('Matemática › Álgebra')).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'Matrizes' })).toBeNull()
  })
  it('opens matching descendants without depending on tree expansion', async () => {
    renderPage(
      <TaxonomyExplorePage search={{ q: 'matriz' }} onSearchChange={vi.fn()} />,
    )
    expect(await screen.findByRole('link', { name: 'Matrizes' })).toBeTruthy()
    expect(screen.getByText('Matemática › Álgebra › Matrizes')).toBeTruthy()
  })
  it('updates filters through the route callback', async () => {
    const change = vi.fn()
    renderPage(
      <TaxonomyExplorePage
        search={{ categoryId: 1 }}
        onSearchChange={change}
      />,
    )
    fireEvent.change(
      await screen.findByRole('textbox', { name: 'Buscar tags' }),
      { target: { value: 'matriz' } },
    )
    expect(change).toHaveBeenCalledWith({ categoryId: 1, q: 'matriz' })
  })
  it('loads only the requested course page and offers next page', async () => {
    const change = vi.fn()
    renderPage(
      <TaxonomyTagPage tagId={2} search={{ page: 2 }} onPageChange={change} />,
    )
    expect(await screen.findByText('MA141')).toBeTruthy()
    expect(mocks.courses).toHaveBeenCalledWith(2, 2)
    fireEvent.click(screen.getByRole('button', { name: 'Próxima' }))
    expect(change).toHaveBeenCalledWith(3)
    fireEvent.click(
      screen.getByRole('button', { name: 'Entrar para adicionar interesse' }),
    )
    expect(mocks.auth.login).toHaveBeenCalledWith(window.location.href)
  })
  it('does not present a failed interest read as an unselected interest', async () => {
    mocks.auth.isAuthenticated = true
    mocks.interests.mockRejectedValue(new Error('offline'))
    renderPage(<TaxonomyTagPage tagId={2} search={{}} onPageChange={vi.fn()} />)
    expect(
      await screen.findByText('Não foi possível carregar seu interesse'),
    ).toBeTruthy()
    expect(
      screen.queryByRole('button', { name: 'Adicionar interesse' }),
    ).toBeNull()
    expect(screen.getByText('MA141')).toBeTruthy()
  })
  it('requires login to organize taxonomy', async () => {
    renderPage(<TaxonomyManagePage />)
    fireEvent.click(
      await screen.findByRole('button', { name: 'Entrar para contribuir' }),
    )
    expect(mocks.auth.login).toHaveBeenCalledWith(window.location.href)
    expect(screen.queryByRole('button', { name: 'Nova tag' })).toBeNull()
  })
  it('opens a linked tag in the editor and prevents category changes with subtags', async () => {
    mocks.auth.isAuthenticated = true
    renderPage(<TaxonomyManagePage tagId={2} />)
    expect(await screen.findByDisplayValue('Álgebra')).toBeTruthy()
    expect(
      screen.getByText('Mova as subtags antes de mudar a categoria.'),
    ).toBeTruthy()
    expect(screen.getByText(/^Caminho:/)).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Excluir tag' })).toBeTruthy()
  })
  it('creates the first category when the taxonomy is empty', async () => {
    mocks.auth.isAuthenticated = true
    mocks.categories.mockResolvedValue([])
    mocks.tags.mockResolvedValue([])
    renderPage(<TaxonomyManagePage />)
    fireEvent.click(
      await screen.findByRole('button', { name: 'Criar categoria' }),
    )
    expect(await screen.findByRole('dialog')).toBeTruthy()
    expect(screen.getByRole('textbox', { name: 'Nome' })).toBeTruthy()
  })
  it('retains an edited draft when discarding is declined', async () => {
    mocks.auth.isAuthenticated = true
    renderPage(<TaxonomyManagePage tagId={2} />)
    fireEvent.change(await screen.findByDisplayValue('Álgebra'), {
      target: { value: 'Novo nome' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(
      await screen.findByRole('dialog', {
        name: 'Descartar alterações não salvas?',
      }),
    ).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Continuar aqui' }))
    expect(screen.getByDisplayValue('Novo nome')).toBeTruthy()
  })
  it('explains global deletion and only deletes after explicit confirmation', async () => {
    mocks.auth.isAuthenticated = true
    mocks.deleteTag.mockResolvedValue(undefined)
    renderPage(<TaxonomyManagePage tagId={3} />)
    await screen.findByDisplayValue('Matrizes')
    fireEvent.click(screen.getByRole('button', { name: 'Excluir tag' }))
    const dialog = await screen.findByRole('dialog', { name: 'Excluir tag?' })
    expect(dialog.textContent).toContain(
      'Interesses associados serão removidos',
    )
    expect(mocks.deleteTag).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Continuar aqui' }))
    expect(mocks.deleteTag).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Excluir tag' }))
    const confirm = await screen.findByRole('dialog', { name: 'Excluir tag?' })
    fireEvent.click(
      within(confirm).getByRole('button', { name: 'Excluir tag' }),
    )
    await screen.findByText('Item excluído.')
    expect(mocks.deleteTag).toHaveBeenCalledExactlyOnceWith(
      3,
      mocks.auth.getAccessToken,
    )
  })
  it('marks interests directly in exploration and updates the action after refresh', async () => {
    mocks.auth.isAuthenticated = true
    mocks.putInterest.mockImplementation(() => {
      mocks.interests.mockResolvedValue([tags[0]])
      return Promise.resolve()
    })
    renderPage(
      <TaxonomyExplorePage
        search={{ q: 'algebra' }}
        onSearchChange={vi.fn()}
      />,
    )
    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Adicionar interesse em Álgebra',
      }),
    )
    expect(
      await screen.findByRole('button', {
        name: 'Remover interesse em Álgebra',
      }),
    ).toBeTruthy()
    expect(mocks.putInterest).toHaveBeenCalledWith(
      7,
      2,
      mocks.auth.getAccessToken,
    )
  })
  it('hides administration links from visitors and omits single-page pagination', async () => {
    mocks.courses.mockResolvedValue({ data: [], links: { next: null } })
    renderPage(<TaxonomyTagPage tagId={2} search={{}} onPageChange={vi.fn()} />)
    expect(
      await screen.findByText(/Nenhuma disciplina associada diretamente/),
    ).toBeTruthy()
    expect(
      screen.queryByRole('navigation', { name: 'Páginas de disciplinas' }),
    ).toBeNull()
    expect(
      screen.queryByRole('link', { name: 'Editar na taxonomia' }),
    ).toBeNull()
  })
  it('prefills parent and category for contextual creation and keeps the new tag selected', async () => {
    mocks.auth.isAuthenticated = true
    renderPage(<TaxonomyManagePage />)
    fireEvent.click(
      await screen.findByRole('button', { name: 'Criar tag filha de Álgebra' }),
    )
    fireEvent.change(await screen.findByRole('textbox', { name: 'Nome' }), {
      target: { value: 'Vetores' },
    })
    expect(screen.getByText(/^Caminho:/).textContent).toContain(
      'Matemática › Álgebra › Vetores',
    )
    fireEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }))
    expect(
      await screen.findByText('Alterações salvas. A estrutura foi atualizada.'),
    ).toBeTruthy()
    expect(mocks.createTag).toHaveBeenCalledWith(
      { name: 'Vetores', categoryId: 1, parentTagId: 2 },
      mocks.auth.getAccessToken,
    )
    expect(screen.getByDisplayValue('Vetores')).toBeTruthy()
  })
  it('rejects a stale save without overwriting a concurrently renamed tag', async () => {
    mocks.auth.isAuthenticated = true
    mocks.tag.mockResolvedValue({ ...tags[0], name: 'Nome remoto' })
    renderPage(<TaxonomyManagePage tagId={2} />)
    fireEvent.change(await screen.findByDisplayValue('Álgebra'), {
      target: { value: 'Meu rascunho' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }))
    expect(
      await screen.findByText(/Esta tag foi alterada por outra pessoa/),
    ).toBeTruthy()
    expect(mocks.updateTag).not.toHaveBeenCalled()
    expect(screen.getByDisplayValue('Meu rascunho')).toBeTruthy()
  })
  it('shows an unavailable linked item while retaining navigation of the structure', async () => {
    mocks.auth.isAuthenticated = true
    renderPage(<TaxonomyManagePage tagId={999} />)
    expect(
      await screen.findByText(/O item solicitado não está mais disponível/),
    ).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Álgebra' })).toBeTruthy()
  })
  it('never displays an unselected interest while interests are loading', async () => {
    mocks.auth.isAuthenticated = true
    mocks.interests.mockImplementation(() => new Promise(() => {}))
    renderPage(
      <TaxonomyExplorePage
        search={{ q: 'algebra' }}
        onSearchChange={vi.fn()}
      />,
    )
    expect(await screen.findByText('Carregando interesse…')).toBeTruthy()
    expect(
      screen.queryByRole('button', { name: 'Adicionar interesse em Álgebra' }),
    ).toBeNull()
  })
  it('retains a registered interest after a failed removal', async () => {
    mocks.auth.isAuthenticated = true
    mocks.interests.mockResolvedValue([tags[0]])
    mocks.removeInterest.mockRejectedValue(new Error('offline'))
    renderPage(<TaxonomyTagPage tagId={2} search={{}} onPageChange={vi.fn()} />)
    fireEvent.click(
      await screen.findByRole('button', { name: 'Remover interesse' }),
    )
    expect(
      await screen.findByText(
        'Não foi possível salvar seu interesse. Tente novamente.',
      ),
    ).toBeTruthy()
    expect(
      screen
        .getByRole('button', { name: 'Remover interesse' })
        .getAttribute('aria-pressed'),
    ).toBe('true')
  })
  it('withdraws management controls after a forbidden response', async () => {
    mocks.auth.isAuthenticated = true
    mocks.updateTag.mockRejectedValue(new ApiError(403))
    renderPage(<TaxonomyManagePage tagId={2} />)
    fireEvent.change(await screen.findByDisplayValue('Álgebra'), {
      target: { value: 'Nova tag' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }))
    expect(
      await screen.findByText(/A sessão não permite alterar a taxonomia/),
    ).toBeTruthy()
    expect(
      screen.queryByRole('button', { name: 'Salvar alterações' }),
    ).toBeNull()
  })
  it('retains structure search, collapsed categories and selection after closing an editor', async () => {
    mocks.auth.isAuthenticated = true
    renderPage(<TaxonomyManagePage />)
    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Recolher categoria Matemática',
      }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Matemática' }))
    await screen.findByRole('textbox', { name: 'Nome' })
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(
      screen.getByRole('button', { name: 'Expandir categoria Matemática' }),
    ).toBeTruthy()
    expect(
      screen
        .getByRole('button', { name: 'Matemática' })
        .getAttribute('aria-pressed'),
    ).toBe('true')
  })
  it('allows contribution without a student profile while explaining the interest requirement', async () => {
    mocks.auth.isAuthenticated = true
    mocks.student.mockResolvedValue({ studentId: null })
    renderPage(
      <TaxonomyExplorePage
        search={{ q: 'algebra' }}
        onSearchChange={vi.fn()}
      />,
    )
    expect(
      await screen.findByText(
        'Cadastre seu perfil de estudante para registrar interesses.',
      ),
    ).toBeTruthy()
    expect(
      screen.getByRole('link', { name: 'Organizar taxonomia' }),
    ).toBeTruthy()
    expect(
      screen.queryByRole('button', { name: 'Adicionar interesse em Álgebra' }),
    ).toBeNull()
  })
  it('shows only available totals and never derives a total from the current course page', async () => {
    mocks.courses.mockResolvedValue({
      data: [{ id: 10, code: 'MA141', name: 'Cálculo I', credits: 6 }],
      total: 49,
      links: { next: '/next' },
    })
    renderPage(<TaxonomyTagPage tagId={2} search={{}} onPageChange={vi.fn()} />)
    expect(
      await screen.findByRole('heading', {
        name: 'Disciplinas associadas (49)',
      }),
    ).toBeTruthy()
    expect(screen.queryByRole('tab', { name: /Grupos/ })).toBeNull()
    expect(screen.queryByRole('tab', { name: /Eventos/ })).toBeNull()
  })
  it('keeps course content available when hierarchy loading fails', async () => {
    mocks.tags.mockRejectedValue(new Error('offline'))
    renderPage(<TaxonomyTagPage tagId={2} search={{}} onPageChange={vi.fn()} />)
    expect(await screen.findByText('MA141')).toBeTruthy()
    expect(
      await screen.findByRole('button', { name: 'Recarregar hierarquia' }),
    ).toBeTruthy()
    expect(screen.queryByRole('heading', { name: /^Subtags/ })).toBeNull()
  })
  it('omits an unavailable total instead of using the course page size', async () => {
    renderPage(<TaxonomyTagPage tagId={2} search={{}} onPageChange={vi.fn()} />)
    await screen.findByText('MA141')
    expect(
      screen.getByRole('heading', {
        name: 'Disciplinas associadas',
      }),
    ).toBeTruthy()
    expect(screen.queryByRole('complementary')).toBeNull()
  })
  it('expands subtags independently from opening a tag and recording interest', async () => {
    mocks.auth.isAuthenticated = true
    renderPage(<TaxonomyExplorePage search={{}} onSearchChange={vi.fn()} />)
    const collapse = await screen.findByRole('button', {
      name: 'Recolher subtags de Álgebra',
    })
    expect(collapse.getAttribute('aria-expanded')).toBe('true')
    fireEvent.click(collapse)
    expect(screen.queryByRole('link', { name: 'Matrizes' })).toBeNull()
    expect(screen.getByRole('link', { name: 'Álgebra' })).toBeTruthy()
    expect(
      await screen.findByRole(
        'button',
        { name: 'Adicionar interesse em Álgebra' },
        { timeout: 5000 },
      ),
    ).toBeTruthy()
    fireEvent.click(
      screen.getByRole('button', { name: 'Expandir subtags de Álgebra' }),
    )
    expect(screen.getByRole('link', { name: 'Matrizes' })).toBeTruthy()
    expect(screen.queryByText('Sobre as tags')).toBeNull()
    expect(screen.queryByText('Navegação rápida')).toBeNull()
  })
  it('keeps saving disabled until an existing item changes and shows one path', async () => {
    mocks.auth.isAuthenticated = true
    renderPage(<TaxonomyManagePage tagId={3} />)
    const name = await screen.findByRole('textbox', { name: 'Nome' })
    const save = screen.getByRole('button', {
      name: 'Salvar alterações',
    })
    expect(save.hasAttribute('disabled')).toBe(true)
    expect(document.activeElement).not.toBe(name)
    expect(screen.getByText(/^Caminho:/)).toBeTruthy()
    expect(screen.queryByText(/Caminho atual:/)).toBeNull()
    fireEvent.change(name, { target: { value: 'Nome revisado' } })
    expect(save.hasAttribute('disabled')).toBe(false)
    expect(screen.queryByText(/Caminho atual:/)).toBeNull()
    fireEvent.change(name, { target: { value: 'Matrizes' } })
    expect(save.hasAttribute('disabled')).toBe(true)
  })
  it('compares paths only after moving an existing tag', async () => {
    mocks.auth.isAuthenticated = true
    renderPage(<TaxonomyManagePage tagId={3} />)
    const parent = await screen.findByRole('combobox', { name: 'Tag pai' })
    fireEvent.click(parent)
    fireEvent.click(screen.getByRole('option', { name: 'Sem tag pai' }))
    expect(screen.getByText(/Novo caminho:/).textContent).toContain(
      'Matemática › Matrizes',
    )
    expect(screen.getByText(/Caminho atual:/).textContent).toContain(
      'Matemática › Álgebra › Matrizes',
    )
    expect(
      screen
        .getByRole('button', { name: 'Salvar alterações' })
        .hasAttribute('disabled'),
    ).toBe(false)
  })
  it('removes active filters without changing the selected sorting', async () => {
    const change = vi.fn()
    renderPage(
      <TaxonomyExplorePage
        search={{ q: 'algebra', categoryId: 1, order: 'desc' }}
        onSearchChange={change}
      />,
    )
    fireEvent.click(
      await screen.findByRole('button', { name: 'Limpar filtros' }),
    )
    expect(change).toHaveBeenCalledWith({ order: 'desc' })
  })
  it('uses an icon button with an accessible interest name in exploration', async () => {
    mocks.auth.isAuthenticated = true
    renderPage(
      <TaxonomyExplorePage
        search={{ q: 'algebra' }}
        onSearchChange={vi.fn()}
      />,
    )
    const button = await screen.findByRole('button', {
      name: 'Adicionar interesse em Álgebra',
    })
    expect(button.getAttribute('aria-pressed')).toBe('false')
    expect(button.textContent).toBe('')
  })
})
