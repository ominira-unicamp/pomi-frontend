import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { MediaImage } from './MediaImage'

const mocks = vi.hoisted(() => ({
  readPrivateMedia: vi.fn(),
  sessionSubject: 'person-1',
  getAccessToken: vi.fn().mockResolvedValue('token'),
}))

vi.mock('./mediaApi', () => ({
  mediaUrl: (id: string, preset: string) => `/media/${id}/${preset}`,
  readPrivateMedia: mocks.readPrivateMedia,
}))
vi.mock('@/auth/AuthProvider', () => ({
  useOptionalAuth: () => ({
    sessionSubject: mocks.sessionSubject,
    getAccessToken: mocks.getAccessToken,
  }),
}))

afterEach(() => {
  mocks.sessionSubject = 'person-1'
  mocks.readPrivateMedia.mockReset()
  vi.unstubAllGlobals()
})

describe('private media image', () => {
  it('recovers a private image after a revoked Blob URL fails during visibility changes', async () => {
    const create = vi
      .fn()
      .mockReturnValueOnce('blob:private-one')
      .mockReturnValueOnce('blob:private-two')
    vi.stubGlobal(
      'URL',
      class extends URL {
        static createObjectURL = create
        static revokeObjectURL = vi.fn()
      },
    )
    mocks.readPrivateMedia.mockResolvedValue(new Blob(['image']))

    const image = (access: 'private' | 'public') => (
      <MediaImage
        mediaId="image-one"
        preset="avatarSmall"
        access={access}
        alt="Avatar"
        fallback={<span>Sem imagem</span>}
      />
    )
    const view = render(image('private'))
    await waitFor(() =>
      expect(
        screen.getByRole('img', { name: 'Avatar' }).getAttribute('src'),
      ).toBe('blob:private-one'),
    )

    fireEvent.error(screen.getByRole('img', { name: 'Avatar' }))
    expect(screen.getByText('Sem imagem')).toBeTruthy()
    view.rerender(image('public'))
    view.rerender(image('private'))

    await waitFor(() =>
      expect(
        screen.getByRole('img', { name: 'Avatar' }).getAttribute('src'),
      ).toBe('blob:private-two'),
    )
    view.unmount()
  })

  it('revokes the old Blob URL and hides it immediately when the session changes', async () => {
    const create = vi.fn().mockReturnValue('blob:private-one')
    const revoke = vi.fn()
    vi.stubGlobal(
      'URL',
      class extends URL {
        static createObjectURL = create
        static revokeObjectURL = revoke
      },
    )
    mocks.readPrivateMedia
      .mockResolvedValueOnce(new Blob(['first']))
      .mockImplementationOnce(() => new Promise(() => {}))

    const image = () => (
      <MediaImage
        mediaId="image-one"
        preset="avatarSmall"
        access="private"
        alt="Avatar"
        fallback={<span>Sem imagem</span>}
      />
    )
    const view = render(image())
    await waitFor(() =>
      expect(
        screen.getByRole('img', { name: 'Avatar' }).getAttribute('src'),
      ).toBe('blob:private-one'),
    )

    act(() => {
      mocks.sessionSubject = 'person-2'
      view.rerender(image())
    })

    expect(screen.queryByRole('img', { name: 'Avatar' })).toBeNull()
    expect(screen.getByText('Sem imagem')).toBeTruthy()
    expect(revoke).toHaveBeenCalledWith('blob:private-one')
    expect(mocks.readPrivateMedia).toHaveBeenCalledTimes(2)
    expect(mocks.readPrivateMedia.mock.calls[0]?.[3].aborted).toBe(true)
  })
})
