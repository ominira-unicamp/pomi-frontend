import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MyGroupsPage } from './MyGroupsPage'
import { MyGroupMembershipPage } from './MyGroupMembershipPage'
import type { ReactNode } from 'react'

const mocks = vi.hoisted(() => ({
  list: vi.fn(),
  get: vi.fn(),
  ownMemberships: vi.fn(),
  invitations: vi.fn(),
  accept: vi.fn(),
  decline: vi.fn(),
  visibility: vi.fn(),
  navigate: vi.fn(),
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
  Link: ({
    children,
    to,
    params,
  }: {
    children: ReactNode
    to: string
    params?: Record<string, string>
  }) => (
    <a
      href={Object.entries(params ?? {}).reduce(
        (path, [key, value]) => path.replace(`$${key}`, value),
        to,
      )}
    >
      {children}
    </a>
  ),
  useNavigate: () => mocks.navigate,
}))
vi.mock('@/auth/AuthProvider', () => ({ useOptionalAuth: () => mocks.auth }))
vi.mock('@/features/student/hooks/useStudentProfile', () => ({
  useStudentProfile: () => mocks.student,
}))
vi.mock('./data/groupApi', () => ({ groupApi: mocks }))
function renderPage(page: ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const view = render(
    <QueryClientProvider client={client}>{page}</QueryClientProvider>,
  )
  return { ...view, client }
}

const membership = {
  id: 9,
  groupId: 42,
  studentId: 7,
  leftAt: null,
  isPublic: false,
  positions: [{ id: 2, title: 'Presidente', startedAt: null, endedAt: null }],
  roles: [],
  permissions: [],
}

describe('personal group participation', () => {
  beforeEach(() => {
    mocks.auth.isAuthenticated = true
    mocks.student.studentId = 7
    mocks.list
      .mockReset()
      .mockResolvedValue([{ id: 42, name: 'Coletivo Cultural' }])
    mocks.get
      .mockReset()
      .mockResolvedValue({ id: 42, name: 'Coletivo Cultural' })
    mocks.ownMemberships.mockReset().mockResolvedValue([])
    mocks.invitations.mockReset().mockResolvedValue([])
    mocks.accept.mockReset().mockResolvedValue(membership)
    mocks.decline.mockReset().mockResolvedValue(undefined)
    mocks.visibility
      .mockReset()
      .mockResolvedValue({ ...membership, isPublic: true })
    mocks.navigate.mockReset()
  })
  it('lets an invited person inspect the group and reach their membership after accepting', async () => {
    mocks.invitations.mockResolvedValue([
      {
        id: 3,
        groupId: 42,
        status: 'PENDING',
        expiresAt: '2099-10-20T12:00:00Z',
      },
    ])
    renderPage(<MyGroupsPage />)
    expect(
      await screen.findByRole(
        'link',
        { name: 'Conhecer grupo' },
        { timeout: 5000 },
      ),
    ).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Aceitar convite' }))
    await waitFor(() =>
      expect(mocks.accept).toHaveBeenCalledWith(
        7,
        3,
        mocks.auth.getAccessToken,
      ),
    )
    await waitFor(() =>
      expect(mocks.navigate).toHaveBeenCalledWith({
        to: '/meus-grupos/$groupId',
        params: { groupId: '42' },
      }),
    )
  })
  it('shows an expired invitation in history without an accept action', async () => {
    mocks.invitations.mockResolvedValue([
      {
        id: 3,
        groupId: 42,
        status: 'PENDING',
        expiresAt: '2020-01-01T00:00:00Z',
      },
    ])
    renderPage(<MyGroupsPage />)
    expect(await screen.findByText(/Convite expirado/)).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Aceitar convite' })).toBeNull()
  })
  it('removes a declined invitation from pending actions', async () => {
    mocks.invitations
      .mockResolvedValueOnce([
        {
          id: 3,
          groupId: 42,
          status: 'PENDING',
          expiresAt: '2099-10-20T12:00:00Z',
        },
      ])
      .mockResolvedValue([])
    renderPage(<MyGroupsPage />)
    fireEvent.click(await screen.findByRole('button', { name: 'Recusar' }))
    await waitFor(() =>
      expect(mocks.decline).toHaveBeenCalledWith(
        7,
        3,
        mocks.auth.getAccessToken,
      ),
    )
    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: /Convites para responder/ }),
      ).toBeNull(),
    )
  })
  it('keeps a long invitation list secondary to active groups', async () => {
    mocks.ownMemberships.mockResolvedValue([membership])
    mocks.invitations.mockResolvedValue(
      [3, 4, 5].map((id) => ({
        id,
        groupId: 42,
        status: 'PENDING',
        expiresAt: '2099-10-20T12:00:00Z',
      })),
    )
    renderPage(<MyGroupsPage />)
    expect(
      await screen.findByRole('heading', { name: 'Meus grupos ativos' }),
    ).toBeTruthy()
    const expand = await screen.findByRole('button', {
      name: 'Ver 3 convites',
    })
    expect(screen.queryByRole('button', { name: 'Aceitar convite' })).toBeNull()
    fireEvent.click(expand)
    expect(
      screen.getAllByRole('button', { name: 'Aceitar convite' }),
    ).toHaveLength(3)
  })
  it('shows a discovery path when the person has no group or invitation', async () => {
    renderPage(<MyGroupsPage />)
    expect(
      await screen.findByText('Você ainda não participa de um grupo'),
    ).toBeTruthy()
    expect(screen.queryByText('Você não tem convites pendentes.')).toBeNull()
    expect(
      screen.getAllByRole('link', { name: 'Explorar grupos' }).length,
    ).toBeGreaterThan(0)
  })
  it('keeps participation links usable when group names fail to load', async () => {
    mocks.list.mockRejectedValue(new Error('Falha de rede'))
    mocks.ownMemberships.mockResolvedValue([membership])
    renderPage(<MyGroupsPage />)
    expect(
      await screen.findByText('Não foi possível carregar os nomes dos grupos.'),
    ).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Ver grupo' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeTruthy()
  })
  it('offers a direct event workspace link for each authorized group', async () => {
    mocks.list.mockResolvedValue([
      { id: 42, name: 'Coletivo Cultural' },
      { id: 43, name: 'Centro Acadêmico' },
    ])
    mocks.ownMemberships.mockResolvedValue([
      { ...membership, id: 9, groupId: 42, permissions: ['EVENT_CREATE'] },
      { ...membership, id: 10, groupId: 43, permissions: ['EVENT_PUBLISH'] },
    ])
    renderPage(<MyGroupsPage />)
    const links = await screen.findAllByRole('link', {
      name: 'Organizar eventos',
    })
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/grupos/42/gerenciar/eventos',
      '/grupos/43/gerenciar/eventos',
    ])
    expect(screen.getAllByRole('link', { name: 'Ver grupo' })).toHaveLength(2)
    expect(
      screen.getAllByRole('link', { name: 'Minha participação' }),
    ).toHaveLength(2)
    expect(screen.queryByText('Você não tem convites pendentes.')).toBeNull()
    expect(screen.queryByRole('navigation', { name: 'Comunidade' })).toBeNull()
  })
  it('routes member managers to people and keeps ordinary members in their own area', async () => {
    mocks.ownMemberships.mockResolvedValue([
      { ...membership, id: 9, groupId: 42, permissions: ['MEMBER_MANAGE'] },
      { ...membership, id: 10, groupId: 43, permissions: [] },
    ])
    mocks.list.mockResolvedValue([
      { id: 42, name: 'Coletivo Cultural' },
      { id: 43, name: 'Centro Acadêmico' },
    ])
    renderPage(<MyGroupsPage />)
    expect(
      (
        await screen.findByRole('link', { name: 'Abrir espaço de trabalho' })
      ).getAttribute('href'),
    ).toBe('/grupos/42/gerenciar/pessoas')
    expect(screen.queryByRole('link', { name: 'Organizar eventos' })).toBeNull()
  })
  it('changes only the own visibility and does not offer management without permission', async () => {
    mocks.ownMemberships.mockResolvedValue([membership])
    renderPage(<MyGroupMembershipPage groupId={42} />)
    const checkbox = await screen.findByRole('checkbox', {
      name: 'Mostrar meu nome e cargos',
    })
    expect(checkbox.getAttribute('aria-checked')).toBe('false')
    fireEvent.click(checkbox)
    await waitFor(() =>
      expect(mocks.visibility).toHaveBeenCalledWith(
        7,
        9,
        true,
        mocks.auth.getAccessToken,
      ),
    )
    expect(screen.queryByRole('link', { name: 'Gerenciar grupo' })).toBeNull()
    expect(screen.getByText('Presidente')).toBeTruthy()
  })
  it('invalidates public membership views when hiding its own participation', async () => {
    mocks.ownMemberships.mockResolvedValue([{ ...membership, isPublic: true }])
    const { client } = renderPage(<MyGroupMembershipPage groupId={42} />)
    const invalidate = vi.spyOn(client, 'invalidateQueries')
    fireEvent.click(
      await screen.findByRole('checkbox', {
        name: 'Mostrar meu nome e cargos',
      }),
    )
    await waitFor(() =>
      expect(mocks.visibility).toHaveBeenCalledWith(
        7,
        9,
        false,
        mocks.auth.getAccessToken,
      ),
    )
    await waitFor(() =>
      expect(invalidate).toHaveBeenCalledWith({
        queryKey: ['public', 'group-memberships'],
      }),
    )
  })
})
