import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GroupDetailPage } from './GroupDetailPage'
import type { ReactNode } from 'react'

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  members: vi.fn(),
  events: vi.fn(),
  ownMemberships: vi.fn(),
  auth: {
    sessionSubject: 'session-1',
    getAccessToken: vi.fn().mockResolvedValue('token'),
  },
  student: { studentId: undefined as number | undefined },
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
  return render(
    <QueryClientProvider client={client}>
      <GroupDetailPage groupId={42} />
    </QueryClientProvider>,
  )
}

describe('GroupDetailPage', () => {
  beforeEach(() => {
    mocks.student.studentId = undefined
    mocks.get.mockReset().mockResolvedValue({
      id: 42,
      name: 'Coletivo Cultural',
      description: 'Arte no campus',
      contacts: [
        { id: 1, type: 'email', label: null, value: 'grupo@example.org' },
      ],
      externalLinks: [{ id: 2, label: 'Site', url: 'https://example.org' }],
      tags: [{ id: 3, name: 'Cultura', categoryId: 1 }],
    })
    mocks.members.mockReset().mockResolvedValue([])
    mocks.events.mockReset().mockResolvedValue([
      {
        id: 20,
        groupId: 42,
        name: 'Oficina',
        description: 'Atividade aberta',
        startsAt: '2026-10-20T12:00:00Z',
        endsAt: null,
        location: 'Auditório',
        tags: [],
      },
    ])
    mocks.ownMemberships.mockReset().mockResolvedValue([])
  })

  it('shows public contacts, links, event and the correct private-member empty state', async () => {
    renderPage()
    expect(await screen.findByText('Coletivo Cultural')).toBeTruthy()
    expect(screen.getByText(/grupo@example.org/)).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Site' })).toBeTruthy()
    expect(await screen.findByRole('link', { name: 'Oficina' })).toBeTruthy()
    expect(
      await screen.findByText(/Nenhum membro com perfil público/),
    ).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Participar' })).toBeNull()
    expect(screen.queryByText('Salvar perfil')).toBeNull()
    expect(mocks.ownMemberships).not.toHaveBeenCalled()
  })

  it('offers only a link to management for an authorized member', async () => {
    mocks.student.studentId = 7
    mocks.ownMemberships.mockResolvedValue([
      {
        id: 8,
        groupId: 42,
        studentId: 7,
        leftAt: null,
        isPublic: false,
        permissions: ['EVENT_CREATE'],
        roles: [],
        positions: [],
      },
    ])
    renderPage()
    expect(
      await screen.findByRole('link', { name: 'Abrir espaço de trabalho' }),
    ).toBeTruthy()
    expect(
      screen
        .getByRole('link', { name: 'Organizar eventos' })
        .getAttribute('href'),
    ).toBe('/grupos/42/gerenciar/eventos')
    expect(
      screen.getByRole('link', { name: 'Minha participação' }),
    ).toBeTruthy()
    expect(screen.queryByText('Salvar rascunho')).toBeNull()
    expect(screen.queryByText('Mostrar meu nome e cargos')).toBeNull()
  })

  it('links a public member to an enabled profile and leaves other names unlinked', async () => {
    mocks.members.mockResolvedValue([
      {
        id: 8,
        groupId: 42,
        displayName: 'Ana',
        profilePublicId: 'a375fdb0-45d9-4a79-8415-89fcb64157b6',
        positions: [],
      },
      {
        id: 9,
        groupId: 42,
        displayName: 'Bia',
        profilePublicId: null,
        positions: [],
      },
    ])
    renderPage()
    const link = await screen.findByRole('link', { name: 'Ana' })
    expect(link.getAttribute('href')).toBe(
      '/perfis/a375fdb0-45d9-4a79-8415-89fcb64157b6',
    )
    expect(screen.getByText('Bia')).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'Bia' })).toBeNull()
  })

  it('does not offer management to a member without permissions', async () => {
    mocks.student.studentId = 7
    mocks.ownMemberships.mockResolvedValue([
      {
        id: 8,
        groupId: 42,
        studentId: 7,
        leftAt: null,
        isPublic: false,
        permissions: [],
        roles: [],
        positions: [],
      },
    ])
    renderPage()
    expect(
      await screen.findByRole('link', { name: 'Minha participação' }),
    ).toBeTruthy()
    expect(
      screen.queryByRole('link', { name: 'Abrir espaço de trabalho' }),
    ).toBeNull()
    expect(screen.queryByRole('link', { name: 'Organizar eventos' })).toBeNull()
  })
})
