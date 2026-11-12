import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  Outlet,
  RouterProvider,
  createBrowserHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { TaxonomyExplorePage, TaxonomyTagPage } from './TaxonomyPages'
import { TaxonomyManagePage } from './TaxonomyManagePage'
import {
  readTaxonomyManageSearch,
  readTaxonomySearch,
} from './data/tagTaxonomyNavigation'
import type { TagDetailsSearch } from './data/tagTaxonomyNavigation'

const mocks = vi.hoisted(() => ({
  tags: [
    {
      id: 2,
      name: 'Álgebra',
      categoryId: 1,
      parentTagId: null as number | null,
    },
    { id: 3, name: 'Matrizes', categoryId: 1, parentTagId: 2 as number | null },
  ],
  interests: [] as Array<{
    id: number
    name: string
    categoryId: number
    parentTagId: number | null
  }>,
  token: vi.fn().mockResolvedValue('token'),
}))
vi.mock('@/auth/AuthProvider', () => ({
  useOptionalAuth: () => ({
    initialized: true,
    isAuthenticated: true,
    sessionSubject: 'navigation',
    getAccessToken: mocks.token,
    login: vi.fn(),
  }),
}))
vi.mock('@/features/identity/identityApi', () => ({
  getCurrentUser: () => Promise.resolve({ userId: 7 }),
}))
vi.mock('@/features/student-interests/data/studentTagInterestApi', () => ({
  listUserInterests: () => Promise.resolve([...mocks.interests]),
  putUserInterest: (_sid: number, id: number) => {
    mocks.interests.push({ ...mocks.tags.find((item) => item.id === id)! })
    return Promise.resolve()
  },
  deleteUserInterest: (_sid: number, id: number) => {
    mocks.interests = mocks.interests.filter((item) => item.id !== id)
    return Promise.resolve()
  },
}))
vi.mock('./data/tagTaxonomyApi', () => ({
  listCategories: () => Promise.resolve([{ id: 1, name: 'Matemática' }]),
  listTags: () => Promise.resolve(mocks.tags.map((tag) => ({ ...tag }))),
  getTag: (id: number) =>
    Promise.resolve({ ...mocks.tags.find((tag) => tag.id === id)! }),
  getCategory: () => Promise.resolve({ id: 1, name: 'Matemática' }),
  listTagCoursesPage: () =>
    Promise.resolve({ data: [], links: { next: null } }),
  createCategory: vi.fn(),
  createTag: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
  deleteTag: vi.fn(),
  updateTag: (id: number, body: object) => {
    const tag = mocks.tags.find((item) => item.id === id)!
    Object.assign(tag, body)
    return Promise.resolve({ ...tag })
  },
}))

const histories: Array<ReturnType<typeof createBrowserHistory>> = []
afterEach(() => {
  for (const history of histories.splice(0)) history.destroy()
})

function renderPath(path: string) {
  const root = createRootRoute({ component: Outlet })
  const exploration = createRoute({
    getParentRoute: () => root,
    path: '/taxonomia',
    validateSearch: readTaxonomySearch,
    component: () => {
      const search = exploration.useSearch()
      const navigate = exploration.useNavigate()
      return (
        <TaxonomyExplorePage
          search={search}
          onSearchChange={(next) =>
            void navigate({ search: next, replace: true })
          }
        />
      )
    },
  })
  const detail = createRoute({
    getParentRoute: () => root,
    path: '/taxonomia/tags/$tagId',
    validateSearch: (search: Record<string, unknown>): TagDetailsSearch => ({
      ...readTaxonomySearch(search),
      page: Number(search.page) || 1,
    }),
    component: () => {
      const { tagId } = detail.useParams()
      const search = detail.useSearch()
      const navigate = detail.useNavigate()
      return (
        <TaxonomyTagPage
          key={tagId}
          tagId={Number(tagId)}
          search={search}
          onPageChange={(page) =>
            void navigate({ search: { ...search, page } })
          }
        />
      )
    },
  })
  const manage = createRoute({
    getParentRoute: () => root,
    path: '/taxonomia/organizar',
    validateSearch: readTaxonomyManageSearch,
    component: () => {
      const search = manage.useSearch()
      const navigate = manage.useNavigate()
      return (
        <TaxonomyManagePage
          search={search}
          onSearchChange={(next) => navigate({ search: next, replace: true })}
        />
      )
    },
  })
  window.history.replaceState({}, '', path)
  const history = createBrowserHistory({ window })
  histories.push(history)
  const router = createRouter({
    routeTree: root.addChildren([exploration, detail, manage]),
    history,
  })
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return { router, client }
}

beforeEach(() => {
  mocks.tags = [
    { id: 2, name: 'Álgebra', categoryId: 1, parentTagId: null },
    { id: 3, name: 'Matrizes', categoryId: 1, parentTagId: 2 },
  ]
  mocks.interests = []
  vi.clearAllMocks()
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
})

it('preserves exploration context through interest, detail, editing and return', async () => {
  const { router } = renderPath('/taxonomia?q=algebra&categoryId=1&order=desc')
  fireEvent.click(
    await screen.findByRole(
      'button',
      {
        name: 'Adicionar interesse em Álgebra',
      },
      { timeout: 5000 },
    ),
  )
  await screen.findByRole('button', { name: 'Remover interesse em Álgebra' })
  fireEvent.click(screen.getByRole('link', { name: 'Álgebra' }))
  await screen.findByRole('heading', { name: 'Álgebra' })
  expect(
    await screen.findByRole('button', {
      name: 'Remover interesse',
    }),
  ).toBeTruthy()
  fireEvent.click(screen.getByRole('link', { name: 'Editar na taxonomia' }))
  fireEvent.change(await screen.findByDisplayValue('Álgebra'), {
    target: { value: 'Álgebra revisada' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }))
  await screen.findByText('Alterações salvas. A estrutura foi atualizada.')
  expect(router.state.location.search).toMatchObject({
    tagId: 2,
    returnTo: { q: 'algebra', categoryId: 1, order: 'desc' },
  })
  fireEvent.click(
    screen.getByRole('link', { name: 'Ver detalhe de Álgebra revisada' }),
  )
  await screen.findByRole('heading', { name: 'Álgebra revisada' })
  fireEvent.click(screen.getByRole('link', { name: 'Voltar à exploração' }))
  expect(await screen.findByDisplayValue('algebra')).toBeTruthy()
  expect(router.state.location.search).toMatchObject({
    q: 'algebra',
    categoryId: 1,
    order: 'desc',
  })
}, 15_000)

it('confirms a dirty selection change once and keeps the URL when discard is declined', async () => {
  const { router } = renderPath('/taxonomia/organizar?tagId=2&q=mat')
  fireEvent.change(await screen.findByDisplayValue('Álgebra'), {
    target: { value: 'Rascunho' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Matrizes' }))
  expect(
    await screen.findByRole('dialog', {
      name: 'Descartar alterações não salvas?',
    }),
  ).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Continuar aqui' }))
  expect(screen.getByDisplayValue('Rascunho')).toBeTruthy()
  expect(router.state.location.search).toMatchObject({ tagId: 2, q: 'mat' })
  fireEvent.click(screen.getByRole('button', { name: 'Matrizes' }))
  fireEvent.click(
    await screen.findByRole('button', { name: 'Descartar alterações' }),
  )
  await screen.findByDisplayValue('Matrizes')
  await waitFor(() =>
    expect(router.state.location.search).toMatchObject({ tagId: 3, q: 'mat' }),
  )
})

it('guards browser navigation with an unsaved draft', async () => {
  const { router } = renderPath('/taxonomia/organizar?tagId=2')
  fireEvent.change(await screen.findByDisplayValue('Álgebra'), {
    target: { value: 'Rascunho' },
  })
  fireEvent.click(screen.getByRole('link', { name: 'Explorar tags' }))
  expect(
    await screen.findByRole('dialog', {
      name: 'Descartar alterações não salvas?',
    }),
  ).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Continuar aqui' }))
  expect(router.state.location.pathname).toBe('/taxonomia/organizar')
  expect(screen.getByDisplayValue('Rascunho')).toBeTruthy()
  fireEvent.click(screen.getByRole('link', { name: 'Explorar tags' }))
  fireEvent.click(
    await screen.findByRole('button', { name: 'Descartar alterações' }),
  )
  await waitFor(() => expect(router.state.location.pathname).toBe('/taxonomia'))
})
