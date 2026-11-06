import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import { GroupManagementLayout } from './GroupManagementLayout'
import type { ReactNode } from 'react'

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  ownMemberships: vi.fn(),
  auth: {
    initialized: true,
    isAuthenticated: true,
    sessionSubject: 'person-1',
    getAccessToken: vi.fn().mockResolvedValue('token'),
    login: vi.fn(),
  },
  student: { studentId: 7, studentQuery: { isPending: false } },
}))
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  Outlet: () => <div>Conteúdo da gestão</div>,
  useRouterState: () => '/grupos/42/gerenciar',
}))
vi.mock('@/auth/AuthProvider', () => ({ useOptionalAuth: () => mocks.auth }))
vi.mock('@/features/student/hooks/useStudentProfile', () => ({
  useStudentProfile: () => mocks.student,
}))
vi.mock('./data/groupApi', () => ({ groupApi: mocks }))
function renderPage() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const view = render(
    <QueryClientProvider client={client}>
      <GroupManagementLayout groupId={42} />
    </QueryClientProvider>,
  )
  return { ...view, client }
}

beforeEach(() => {
  mocks.get.mockReset().mockResolvedValue({ id: 42, name: 'Coletivo Cultural' })
  mocks.ownMemberships.mockReset().mockResolvedValue([])
})

it('rejects direct access to group management without a permitted membership', async () => {
  renderPage()
  expect(await screen.findByText('Acesso insuficiente')).toBeTruthy()
  expect(screen.queryByText('Conteúdo da gestão')).toBeNull()
})

it('shows only authorized management tasks and a way back to the public profile', async () => {
  mocks.ownMemberships.mockResolvedValue([
    { id: 8, groupId: 42, leftAt: null, permissions: ['EVENT_CREATE'] },
  ])
  renderPage()
  expect(await screen.findByText('Conteúdo da gestão')).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Eventos' })).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Perfil público' })).toBeTruthy()
  expect(screen.queryByRole('link', { name: 'Acessos' })).toBeNull()
  expect(screen.queryByRole('link', { name: 'Pessoas e convites' })).toBeNull()
})

it('removes the workspace when permissions are revoked during the session', async () => {
  mocks.ownMemberships.mockResolvedValue([
    { id: 8, groupId: 42, leftAt: null, permissions: ['EVENT_EDIT'] },
  ])
  const { client } = renderPage()
  expect(await screen.findByText('Conteúdo da gestão')).toBeTruthy()
  mocks.ownMemberships.mockResolvedValue([
    { id: 8, groupId: 42, leftAt: null, permissions: [] },
  ])
  await client.invalidateQueries({
    queryKey: ['private', mocks.auth.sessionSubject, 'groups', 'memberships'],
  })
  await waitFor(() =>
    expect(screen.getByText('Acesso insuficiente')).toBeTruthy(),
  )
  expect(screen.queryByText('Conteúdo da gestão')).toBeNull()
})
