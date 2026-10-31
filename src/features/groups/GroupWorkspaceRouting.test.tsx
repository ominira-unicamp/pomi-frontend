import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from '@tanstack/react-router'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { routeTree } from '@/routeTree.gen'

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  ownMemberships: vi.fn(),
  managedEvents: vi.fn(),
  managedMembers: vi.fn(),
  managedInvitations: vi.fn(),
  roles: vi.fn(),
  tags: vi.fn(),
  auth: {
    initialized: true,
    isAuthenticated: true,
    sessionSubject: 'person-1',
    getAccessToken: vi.fn().mockResolvedValue('token'),
    login: vi.fn(),
  },
  student: { studentId: 7, studentQuery: { isPending: false } },
}))
vi.mock('@/components/AppShell', () => ({
  AppShell: ({ children }: { children: ReactNode }) => <>{children}</>,
}))
vi.mock('@/auth/AuthProvider', () => ({ useOptionalAuth: () => mocks.auth }))
vi.mock('@/features/student/hooks/useStudentProfile', () => ({
  useStudentProfile: () => mocks.student,
}))
vi.mock('./data/groupApi', () => ({ groupApi: mocks }))
vi.mock('@/api/client', () => ({
  pomiSdk: { app: { tags: { listAll: mocks.tags } } },
}))

function renderPath(path: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
    context: { queryClient },
  })
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return router
}

beforeEach(() => {
  mocks.get.mockReset().mockResolvedValue({
    id: 42,
    name: 'Coletivo Cultural',
    description: 'Atividades culturais',
    contacts: [],
    externalLinks: [],
    tags: [],
  })
  mocks.ownMemberships.mockReset().mockResolvedValue([])
  mocks.managedEvents.mockReset().mockResolvedValue([])
  mocks.managedMembers.mockReset().mockResolvedValue([])
  mocks.managedInvitations.mockReset().mockResolvedValue([])
  mocks.roles.mockReset().mockResolvedValue([])
  mocks.tags.mockReset().mockResolvedValue([])
})

it.each(['EVENT_CREATE', 'EVENT_EDIT', 'EVENT_PUBLISH'] as const)(
  'opens the group event list from the old management entry for %s',
  async (permission) => {
    mocks.ownMemberships.mockResolvedValue([
      { id: 8, groupId: 42, leftAt: null, permissions: [permission] },
    ])
    const router = renderPath('/grupos/42/gerenciar')
    expect(await screen.findByRole('heading', { name: 'Eventos' })).toBeTruthy()
    await waitFor(() =>
      expect(router.state.location.pathname).toBe(
        '/grupos/42/gerenciar/eventos',
      ),
    )
    expect(
      screen.getByRole('heading', { name: 'Coletivo Cultural' }),
    ).toBeTruthy()
  },
)

it('opens the people section for a member manager', async () => {
  mocks.ownMemberships.mockResolvedValue([
    { id: 8, groupId: 42, leftAt: null, permissions: ['MEMBER_MANAGE'] },
  ])
  const router = renderPath('/grupos/42/gerenciar')
  expect(
    await screen.findByRole('heading', { name: 'Pessoas e convites' }),
  ).toBeTruthy()
  await waitFor(() =>
    expect(router.state.location.pathname).toBe('/grupos/42/gerenciar/pessoas'),
  )
  expect(screen.queryByRole('link', { name: 'Eventos' })).toBeNull()
})

it.each([
  ['ROLE_MANAGE', '/grupos/42/gerenciar/acessos', 'Acessos e permissões'],
  [
    'GROUP_EDIT',
    '/grupos/42/gerenciar/perfil',
    'Perfil e informações públicas',
  ],
] as const)(
  'opens the first authorized configuration for %s',
  async (permission, destination, heading) => {
    mocks.ownMemberships.mockResolvedValue([
      { id: 8, groupId: 42, leftAt: null, permissions: [permission] },
    ])
    const router = renderPath('/grupos/42/gerenciar')
    expect(await screen.findByRole('heading', { name: heading })).toBeTruthy()
    await waitFor(() =>
      expect(router.state.location.pathname).toBe(destination),
    )
    expect(screen.queryByRole('link', { name: 'Eventos' })).toBeNull()
  },
)

it('keeps the group context on a direct event-detail URL', async () => {
  mocks.get.mockImplementation((id: number) =>
    Promise.resolve({
      id,
      name: id === 43 ? 'Centro Acadêmico' : 'Coletivo Cultural',
    }),
  )
  mocks.ownMemberships.mockResolvedValue([
    { id: 8, groupId: 42, leftAt: null, permissions: [] },
    { id: 9, groupId: 43, leftAt: null, permissions: ['EVENT_EDIT'] },
  ])
  mocks.managedEvents.mockResolvedValue([
    {
      id: 50,
      groupId: 43,
      name: 'Feira cultural',
      description: 'Encontro aberto',
      startsAt: '2099-10-20T12:00:00.000Z',
      endsAt: null,
      location: null,
      tags: [],
      status: 'DRAFT',
    },
  ])
  const router = renderPath('/grupos/43/gerenciar/eventos/50')
  expect(
    await screen.findByRole('heading', { name: 'Feira cultural' }),
  ).toBeTruthy()
  expect(screen.getByRole('heading', { name: 'Centro Acadêmico' })).toBeTruthy()
  expect(mocks.managedEvents).toHaveBeenCalledWith(
    7,
    43,
    mocks.auth.getAccessToken,
  )
  expect(router.state.location.pathname).toBe('/grupos/43/gerenciar/eventos/50')
  const nav = screen.getByRole('navigation', {
    name: 'Espaço de trabalho do grupo',
  })
  expect(nav.querySelectorAll('[aria-current="page"]')).toHaveLength(1)
  expect(nav.querySelector('[aria-current="page"]')?.textContent).toBe(
    'Eventos',
  )
})

it('keeps list, details and editing in the same group workspace', async () => {
  mocks.ownMemberships.mockResolvedValue([
    {
      id: 8,
      groupId: 42,
      leftAt: null,
      permissions: ['EVENT_EDIT'],
    },
  ])
  mocks.managedEvents.mockResolvedValue([
    {
      id: 50,
      groupId: 42,
      name: 'Feira cultural',
      description: 'Encontro aberto',
      startsAt: '2099-10-20T12:00:00.000Z',
      endsAt: null,
      location: null,
      tags: [],
      status: 'DRAFT',
    },
  ])
  const router = renderPath('/grupos/42/gerenciar/eventos')
  fireEvent.click(await screen.findByRole('link', { name: /Feira cultural/ }))
  fireEvent.click(await screen.findByRole('link', { name: 'Editar evento' }))
  expect(
    await screen.findByRole('heading', { name: 'Editar evento' }),
  ).toBeTruthy()
  fireEvent.click(screen.getByRole('link', { name: 'Cancelar edição' }))
  expect(
    await screen.findByRole('heading', { name: 'Feira cultural' }),
  ).toBeTruthy()
  fireEvent.click(screen.getByRole('link', { name: '← Eventos do grupo' }))
  await waitFor(() =>
    expect(router.state.location.pathname).toBe('/grupos/42/gerenciar/eventos'),
  )
})
