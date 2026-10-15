import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PersonProfilePage } from './PersonProfilePage'
import type { ReactNode } from 'react'

const publicId = 'a375fdb0-45d9-4a79-8415-89fcb64157b6'
const mocks = vi.hoisted(() => ({
  getPerson: vi.fn(),
  getPublicProfile: vi.fn(),
  listFriendships: vi.fn(),
  listSharedPlans: vi.fn(),
  membersForPublicProfile: vi.fn(),
  listGroups: vi.fn(),
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
  useStudentProfile: () => ({
    studentId: 7,
    studentQuery: { isLoading: false },
  }),
}))
vi.mock('@/features/friends/studentSocialApi', () => ({
  getPerson: mocks.getPerson,
  getPublicProfile: mocks.getPublicProfile,
  listFriendships: mocks.listFriendships,
  requestFriendship: vi.fn(),
  acceptFriendship: vi.fn(),
  removeFriendship: vi.fn(),
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
    mocks.getPublicProfile.mockReset()
    mocks.listFriendships.mockReset().mockResolvedValue([])
    mocks.listSharedPlans.mockReset().mockResolvedValue({ items: [] })
    mocks.membersForPublicProfile
      .mockReset()
      .mockResolvedValue([
        { id: 10, groupId: 42, profilePublicId: publicId, positions: [] },
      ])
    mocks.listGroups.mockReset().mockResolvedValue([
      { id: 42, name: 'Coletivo Cultural', description: 'Arte' },
      { id: 43, name: 'Outro grupo', description: null },
    ])
  })

  it('lists only publicly visible memberships with links to their groups', async () => {
    renderPage()
    const link = await screen.findByRole('link', { name: /Coletivo Cultural/ })
    expect(link.getAttribute('href')).toBe('/grupos/42')
    expect(screen.queryByRole('link', { name: /Outro grupo/ })).toBeNull()
    expect(mocks.membersForPublicProfile).toHaveBeenCalledWith(publicId)
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
    mocks.getPerson.mockRejectedValue(new Error('not found'))
    mocks.getPublicProfile.mockResolvedValue({
      publicId,
      displayName: 'Ana',
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
    expect(screen.queryByText('Grupos de que participa')).toBeNull()
    expect(mocks.membersForPublicProfile).not.toHaveBeenCalled()
  })
})
