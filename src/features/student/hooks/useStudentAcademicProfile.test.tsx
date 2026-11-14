import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useStudentAcademicProfile } from './useStudentAcademicProfile'
import type { ReactNode } from 'react'
import { useCurrentUser, useUserContext } from '@/features/identity'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'

const mocks = vi.hoisted(() => ({
  auth: {
    initialized: true,
    isAuthenticated: true,
    sessionSubject: 'session-a',
    getAccessToken: vi.fn(() => Promise.resolve('token')),
  },
  getCurrentUser: vi.fn(),
  getStudentAcademicProfile: vi.fn(),
}))

vi.mock('@/auth/AuthProvider', () => ({
  useOptionalAuth: () => mocks.auth,
}))

vi.mock('@/features/identity/identityApi', () => ({
  getCurrentUser: mocks.getCurrentUser,
}))

vi.mock('@/features/student/data/studentApi', () => ({
  getStudentAcademicProfile: mocks.getStudentAcademicProfile,
}))

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
}

describe('identity hooks', () => {
  beforeEach(() => {
    mocks.auth.initialized = true
    mocks.auth.isAuthenticated = true
    mocks.auth.sessionSubject = 'session-a'
    mocks.getCurrentUser.mockReset()
    mocks.getStudentAcademicProfile.mockReset()
  })

  afterEach(() => cleanup())

  it('shares the current-user request across identity hooks', async () => {
    const currentUser = {
      principalId: 2,
      authIdentityId: 3,
      kind: 'HUMAN',
      userId: 41,
      serviceAccountId: null,
      roles: [],
      capabilities: [],
      studentId: 17,
    }
    mocks.getCurrentUser.mockResolvedValue(currentUser)

    const { result } = renderHook(
      () => [useCurrentUser(), useUserContext()] as const,
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current[0].data).toEqual(currentUser))
    expect(result.current[1].userQuery.data).toEqual(currentUser)
    expect(mocks.getCurrentUser).toHaveBeenCalledTimes(1)
  })

  it('does not request an academic profile when the user has no student', async () => {
    const currentUser = {
      principalId: 2,
      authIdentityId: 3,
      kind: 'HUMAN',
      userId: 41,
      serviceAccountId: null,
      roles: [],
      capabilities: [],
      studentId: null,
    }
    mocks.getCurrentUser.mockResolvedValue(currentUser)

    const { result } = renderHook(() => useStudentAcademicProfile(), {
      wrapper: createWrapper(),
    })

    await waitFor(() =>
      expect(result.current.userQuery.data).toEqual(currentUser),
    )
    expect(result.current.userId).toBe(41)
    expect(result.current.studentId).toBeNull()
    expect(mocks.getStudentAcademicProfile).not.toHaveBeenCalled()
  })

  it('does not request a user profile for a service account', async () => {
    const currentUser = {
      principalId: 2,
      authIdentityId: 3,
      kind: 'SERVICE',
      userId: null,
      serviceAccountId: 9,
      roles: [],
      capabilities: [],
      studentId: null,
    }
    mocks.getCurrentUser.mockResolvedValue(currentUser)

    const { result } = renderHook(() => useStudentAcademicProfile(), {
      wrapper: createWrapper(),
    })

    await waitFor(() =>
      expect(result.current.userQuery.data).toEqual(currentUser),
    )
    expect(result.current.userId).toBeNull()
    expect(mocks.getStudentAcademicProfile).not.toHaveBeenCalled()
  })

  it('loads the academic profile by userId when IDs differ', async () => {
    mocks.getCurrentUser.mockResolvedValue({
      principalId: 2,
      authIdentityId: 3,
      kind: 'HUMAN',
      userId: 41,
      serviceAccountId: null,
      roles: [],
      capabilities: [],
      studentId: 17,
    })
    mocks.getStudentAcademicProfile.mockResolvedValue({ id: 17, userId: 41 })

    const { result } = renderHook(() => useStudentAcademicProfile(), {
      wrapper: createWrapper(),
    })

    await waitFor(() =>
      expect(result.current.profileQuery.data).toEqual({ id: 17, userId: 41 }),
    )
    expect(mocks.getStudentAcademicProfile).toHaveBeenCalledWith(
      41,
      mocks.auth.getAccessToken,
    )
  })
})

it('ignores the legacy student cache when identifying a user after an upgrade', async () => {
  mocks.getCurrentUser.mockResolvedValue({
    kind: 'HUMAN',
    userId: 41,
    studentId: 17,
  })
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const legacyKey = ['private', 'session-a', 'student', 'current']
  client.setQueryData(legacyKey, { studentId: 99 })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  const { result } = renderHook(() => useUserContext(), { wrapper })
  await waitFor(() => expect(result.current.userId).toBe(41))
  expect(client.getQueryData(legacyKey)).toEqual({ studentId: 99 })
  expect(
    client.getQueryData(privateQueryKeys.currentUser('session-a')),
  ).toMatchObject({ userId: 41, studentId: 17 })
})

it('does not keep a cached academic profile after the user loses the student link', async () => {
  const current = { kind: 'HUMAN', userId: 41, studentId: 17 }
  mocks.getCurrentUser.mockResolvedValue(current)
  mocks.getStudentAcademicProfile.mockResolvedValue({ id: 17, userId: 41 })
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  const { result } = renderHook(() => useStudentAcademicProfile(), { wrapper })
  await waitFor(() =>
    expect(result.current.profileQuery.data).toEqual({ id: 17, userId: 41 }),
  )
  mocks.getCurrentUser.mockResolvedValue({ ...current, studentId: null })
  await client.invalidateQueries({
    queryKey: privateQueryKeys.currentUser('session-a'),
  })
  await waitFor(() => expect(result.current.studentId).toBeNull())
  expect(result.current.profileQuery.data).toBeUndefined()
})
