import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, waitFor } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'

import { AccountAvatar } from './AccountAvatar'
import { invalidateIdentityImages } from './invalidateMedia'

const mocks = vi.hoisted(() => ({
  subject: 'session-one',
  studentId: 7,
  getPublicProfile: vi.fn(),
  readPrivateMedia: vi.fn(),
  getAccessToken: vi.fn().mockResolvedValue('token'),
}))
vi.mock('@/auth/AuthProvider', () => ({
  useOptionalAuth: () => ({
    sessionSubject: mocks.subject,
    isAuthenticated: true,
    getAccessToken: mocks.getAccessToken,
  }),
}))
vi.mock('@/features/student/hooks/useStudentProfile', () => ({
  useCurrentStudent: () => ({ data: { studentId: mocks.studentId } }),
}))
vi.mock('@/features/friends/studentSocialApi', () => ({
  getPublicProfile: mocks.getPublicProfile,
}))
vi.mock('./mediaApi', () => ({
  readPrivateMedia: mocks.readPrivateMedia,
  mediaUrl: vi.fn(),
}))
afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
  mocks.subject = 'session-one'
  mocks.studentId = 7
})

it('refreshes the account image after mutation and never reuses a private image across accounts', async () => {
  const create = vi
    .fn()
    .mockReturnValueOnce('blob:first')
    .mockReturnValueOnce('blob:second')
  const revoke = vi.fn()
  vi.stubGlobal(
    'URL',
    class extends URL {
      static createObjectURL = create
      static revokeObjectURL = revoke
    },
  )
  mocks.getPublicProfile
    .mockResolvedValueOnce({ avatarMediaId: 'image-one' })
    .mockResolvedValueOnce({ avatarMediaId: 'image-two' })
    .mockResolvedValueOnce({ avatarMediaId: null })
  mocks.readPrivateMedia.mockResolvedValue(new Blob(['image']))
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const content = () => (
    <QueryClientProvider client={client}>
      <AccountAvatar name="Ana Silva" />
    </QueryClientProvider>
  )
  const view = render(content())
  await waitFor(() =>
    expect(view.container.querySelector('img')?.getAttribute('src')).toBe(
      'blob:first',
    ),
  )
  await invalidateIdentityImages(client)
  await waitFor(() =>
    expect(view.container.querySelector('img')?.getAttribute('src')).toBe(
      'blob:second',
    ),
  )
  expect(revoke).toHaveBeenCalledWith('blob:first')
  mocks.subject = 'session-two'
  mocks.studentId = 8
  view.rerender(content())
  expect(view.container.querySelector('img')).toBeNull()
  await waitFor(() =>
    expect(mocks.getPublicProfile).toHaveBeenCalledWith(
      8,
      mocks.getAccessToken,
    ),
  )
  expect(revoke).toHaveBeenCalledWith('blob:second')
  view.unmount()
})
