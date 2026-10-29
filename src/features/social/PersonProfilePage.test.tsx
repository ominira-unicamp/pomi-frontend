import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { PersonProfilePage } from './PersonProfilePage'
import type { ReactNode } from 'react'

const publicId = 'a375fdb0-45d9-4a79-8415-89fcb64157b6'
const mocks = vi.hoisted(() => ({
  getPerson: vi.fn(),
  removeFriendship: vi.fn(),
  requestFriendship: vi.fn(),
  acceptFriendship: vi.fn(),
  getPublicProfile: vi.fn(),
  listFriendships: vi.fn(),
  listSharedPlans: vi.fn(),
  membersForPublicProfile: vi.fn(),
  listGroups: vi.fn(),
  readPrivateMedia: vi.fn(),
  auth: {
    initialized: true,
    isAuthenticated: true,
    sessionSubject: 'session-1',
    getAccessToken: vi.fn().mockResolvedValue('token'),
    login: vi.fn(),
  },
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    to,
    params,
    search,
  }: {
    children: ReactNode
    to: string
    params?: Record<string, string>
    search?: Record<string, string | number>
  }) => (
    <a
      href={
        Object.entries(params ?? {}).reduce(
          (path, [key, value]) => path.replace(`$${key}`, value),
          to,
        ) +
        (search
          ? `?${new URLSearchParams(Object.entries(search).map(([key, value]) => [key, String(value)]))}`
          : '')
      }
    >
      {children}
    </a>
  ),
}))
vi.mock('@/auth/AuthProvider', () => ({ useOptionalAuth: () => mocks.auth }))
vi.mock('@/features/media/mediaApi', () => ({
  mediaUrl: (id: string, preset: string) => `/media/${id}/${preset}`,
  readPrivateMedia: mocks.readPrivateMedia,
}))
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})
vi.mock('@/features/student/hooks/useStudentProfile', () => ({
  useStudentProfile: () => ({
    studentId: 7,
    studentQuery: { isLoading: false },
  }),
}))
vi.mock('@/features/friends/studentSocialApi', () => ({
  getPerson: mocks.getPerson,
  getPublicProfile: mocks.getPublicProfile,
  listFriendships: mocks.listFriendships,
  requestFriendship: mocks.requestFriendship,
  acceptFriendship: mocks.acceptFriendship,
  removeFriendship: mocks.removeFriendship,
}))
vi.mock('@/features/planning-shared/data/sharedPeriodPlanningApi', () => ({
  listSharedPeriodPlanningsForPerson: mocks.listSharedPlans,
}))
vi.mock('@/features/groups/data/groupApi', () => ({
  groupApi: {
    membersForPublicProfile: mocks.membersForPublicProfile,
    list: mocks.listGroups,
  },
}))

function renderPage() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>
      <PersonProfilePage publicId={publicId} />
    </QueryClientProvider>,
  )
}

describe('public person groups', () => {
  beforeEach(() => {
    mocks.getPerson.mockReset().mockResolvedValue({
      publicId,
      displayName: 'Ana',
      bio: null,
      interests: [],
      currentCourses: [],
      program: null,
      specialization: null,
      entryYear: null,
    })
    mocks.getPublicProfile
      .mockReset()
      .mockResolvedValue({ publicId: 'self', enabled: true })
    mocks.removeFriendship.mockReset().mockResolvedValue(undefined)
    mocks.listFriendships.mockReset().mockResolvedValue([])
    mocks.listSharedPlans.mockReset().mockResolvedValue({ items: [] })
    mocks.membersForPublicProfile
      .mockReset()
      .mockResolvedValue([
        { id: 10, groupId: 42, profilePublicId: publicId, positions: [] },
      ])
    mocks.listGroups.mockReset().mockResolvedValue([
      {
        id: 42,
        name: 'Coletivo Cultural',
        description: 'Arte',
        avatarMediaId: 'group-avatar',
      },
      { id: 43, name: 'Outro grupo', description: null },
    ])
  })

  it('unifies identity and academic information without a student card', async () => {
    mocks.getPerson.mockResolvedValue({
      publicId,
      displayName: 'Ana',
      bio: 'Olá, comunidade',
      interests: [{ id: 1, name: 'Música' }],
      currentCourses: [],
      program: { name: 'Computação' },
      specialization: null,
      entryYear: 2024,
    })
    renderPage()
    const name = await screen.findByRole('heading', { level: 1, name: 'Ana' })
    expect(name.closest('header')?.textContent).toContain(
      'Computação · Ingresso em 2024',
    )
    expect(name.closest('header')?.textContent).toContain('Olá, comunidade')
    expect(screen.queryByText('Estudante')).toBeNull()
    expect(
      screen.getByRole('link', { name: 'Música' }).getAttribute('href'),
    ).toBe('/disciplinas?tagId=1&page=1')
    expect(
      await screen.findByText('Não há horários compartilhados disponíveis.'),
    ).toBeTruthy()
  })

  it('identifies an enabled own profile and offers editing without friendship actions', async () => {
    mocks.getPublicProfile.mockResolvedValue({ publicId, enabled: true })
    renderPage()
    expect(
      await screen.findByRole('link', { name: 'Editar perfil' }),
    ).toBeTruthy()
    expect(
      screen.queryByRole('button', { name: /Adicionar aos amigos/ }),
    ).toBeNull()
  })

  it('requires confirmation before removing an accepted friendship', async () => {
    mocks.listFriendships.mockResolvedValue([
      {
        id: 9,
        status: 'ACCEPTED',
        direction: 'OUTGOING',
        friend: { publicId },
      },
    ])
    renderPage()
    const button = await screen.findByRole('button', { name: /Amigos/ })
    expect(screen.queryByText('Remover amizade')).toBeNull()
    button.focus()
    fireEvent.keyDown(button, { key: 'ArrowDown', code: 'ArrowDown' })
    fireEvent.click(
      await screen.findByRole('menuitem', { name: 'Remover amizade' }),
    )
    expect(await screen.findByRole('dialog')).toBeTruthy()
    expect(mocks.removeFriendship).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    button.focus()
    fireEvent.keyDown(button, { key: 'ArrowDown', code: 'ArrowDown' })
    fireEvent.click(
      await screen.findByRole('menuitem', { name: 'Remover amizade' }),
    )
    fireEvent.click(
      await screen.findByRole('button', { name: 'Remover amizade' }),
    )
    await waitFor(() =>
      expect(mocks.removeFriendship).toHaveBeenCalledWith(
        7,
        9,
        mocks.auth.getAccessToken,
      ),
    )
  })

  it.each(['INCOMING', 'OUTGOING'])(
    'shows the supported %s pending friendship state',
    async (direction) => {
      mocks.listFriendships.mockResolvedValue([
        { id: 9, status: 'PENDING', direction, friend: { publicId } },
      ])
      renderPage()
      if (direction === 'INCOMING')
        expect(
          await screen.findByRole('button', { name: 'Aceitar amizade' }),
        ).toBeTruthy()
      else expect(await screen.findByText('Solicitação enviada')).toBeTruthy()
      expect(
        screen.queryByRole('button', { name: /Adicionar aos amigos/ }),
      ).toBeNull()
      expect(screen.queryByText('Remover amizade')).toBeNull()
    },
  )

  it('distinguishes unavailable shared plans from an empty collection', async () => {
    mocks.listSharedPlans.mockRejectedValue(new Error('unavailable'))
    renderPage()
    expect(
      await screen.findByText(
        'Não foi possível carregar os planejamentos compartilhados.',
      ),
    ).toBeTruthy()
    expect(screen.queryByText('Nenhum planejamento compartilhado.')).toBeNull()
  })

  it('lists only publicly visible memberships with links to their groups', async () => {
    renderPage()
    const link = await screen.findByRole('link', { name: /Coletivo Cultural/ })
    expect(link.getAttribute('href')).toBe('/grupos/42')
    expect(link.querySelector('img')?.getAttribute('src')).toContain(
      '/media/group-avatar/avatarSmall',
    )
    expect(screen.queryByRole('link', { name: /Outro grupo/ })).toBeNull()
    expect(mocks.membersForPublicProfile).toHaveBeenCalledWith(publicId)
  })

  it('shows only public positions and their own dates, never management roles', async () => {
    mocks.membersForPublicProfile.mockResolvedValue([
      {
        id: 10,
        groupId: 42,
        joinedAt: '2023-02-01T00:00:00Z',
        positions: [
          {
            id: 1,
            title: 'Coordenação de eventos',
            startedAt: '2024-03-01T00:00:00Z',
            endedAt: null,
          },
          {
            id: 2,
            title: 'Comunicação',
            startedAt: '2023-02-01T00:00:00Z',
            endedAt: '2024-02-01T00:00:00Z',
          },
        ],
        roles: [{ name: 'Administrador' }],
        permissions: ['GROUP_EDIT'],
      },
    ])
    renderPage()
    const link = await screen.findByRole('link', { name: /Coletivo Cultural/ })
    expect(link.textContent).toContain(
      'Coordenação de eventos · desde mar. de 2024',
    )
    expect(link.textContent).toContain(
      'Comunicação · fev. de 2023 – fev. de 2024',
    )
    expect(link.textContent).not.toContain('Administrador')
    expect(link.textContent).not.toContain('GROUP_EDIT')
    expect(link.querySelector('img')?.getAttribute('width')).toBe('40')
  })

  it('uses the confirmed membership date when no public position exists', async () => {
    mocks.membersForPublicProfile.mockResolvedValue([
      { id: 10, groupId: 42, joinedAt: '2025-01-01T00:00:00Z', positions: [] },
    ])
    renderPage()
    expect(
      (await screen.findByRole('link', { name: /Coletivo Cultural/ }))
        .textContent,
    ).toContain('Desde jan. de 2025')
  })

  it('does not invent membership metadata when none is available', async () => {
    renderPage()
    const link = await screen.findByRole('link', { name: /Coletivo Cultural/ })
    expect(link.textContent).toBe('Coletivo Cultural')
    expect(link.querySelectorAll('p').length).toBe(1)
  })

  it('shows an empty state without loading the group catalog when no membership is public', async () => {
    mocks.membersForPublicProfile.mockResolvedValue([])
    renderPage()
    expect(
      await screen.findByText('Nenhum grupo com participação pública.'),
    ).toBeTruthy()
    expect(mocks.listGroups).not.toHaveBeenCalled()
  })

  it('does not query groups for an unavailable public profile', async () => {
    mocks.getPerson.mockRejectedValue(new Error('not found'))
    mocks.getPublicProfile.mockResolvedValue({
      publicId: '50c80130-a647-421d-9676-a71d2c796681',
      enabled: false,
    })
    renderPage()
    expect(await screen.findByText('Perfil não encontrado')).toBeTruthy()
    await waitFor(() => expect(mocks.getPublicProfile).toHaveBeenCalled())
    expect(mocks.membersForPublicProfile).not.toHaveBeenCalled()
  })

  it('does not expose the group section on a disabled own profile', async () => {
    vi.stubGlobal(
      'URL',
      class extends URL {
        static createObjectURL = vi.fn().mockReturnValue('blob:private-self')
        static revokeObjectURL = vi.fn()
      },
    )
    mocks.readPrivateMedia.mockResolvedValue(new Blob(['image']))
    mocks.getPerson.mockRejectedValue(new Error('not found'))
    mocks.getPublicProfile.mockResolvedValue({
      publicId,
      displayName: 'Ana',
      avatarMediaId: 'private-self',
      bio: null,
      enabled: false,
      interests: [],
      currentCourses: [],
      program: null,
      specialization: null,
      entryYear: null,
    })
    renderPage()
    expect(await screen.findByText('Seu perfil')).toBeTruthy()
    await waitFor(() =>
      expect(
        document.querySelector('img[src="blob:private-self"]'),
      ).toBeTruthy(),
    )
    expect(screen.queryByText('Grupos de que participa')).toBeNull()
    expect(mocks.membersForPublicProfile).not.toHaveBeenCalled()
  })
})
