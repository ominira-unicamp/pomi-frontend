import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { GroupAvatar, PersonAvatar } from './IdentityImages'

vi.mock('@/auth/AuthProvider', () => ({
  useOptionalAuth: () => ({ sessionSubject: null }),
}))
vi.mock('./mediaApi', () => ({
  mediaUrl: (id: string, preset: string) => `/media/${id}/${preset}`,
  readPrivateMedia: vi.fn(),
}))

describe('identity images', () => {
  it('uses a compact variant and reserves space in identity rows', () => {
    const view = render(
      <PersonAvatar name="Ana Silva" mediaId="person-image" />,
    )
    const image = view.container.querySelector('img')!
    expect(image.getAttribute('src')).toBe('/media/person-image/avatarSmall')
    expect(image.getAttribute('width')).toBe('44')
    expect(image.getAttribute('height')).toBe('44')
    expect(image.getAttribute('alt')).toBe('')
    fireEvent.error(image)
    expect(screen.getByText('AS')).toBeTruthy()
    expect(view.container.querySelector('img')).toBeNull()
  })

  it('switches the displayed asset after replacement and restores initials after removal', () => {
    const view = render(
      <GroupAvatar name="Grupo Azul" mediaId="old-image" size="large" />,
    )
    view.rerender(
      <GroupAvatar name="Grupo Azul" mediaId="new-image" size="large" />,
    )
    expect(view.container.querySelector('img')!.getAttribute('src')).toBe(
      '/media/new-image/avatarLarge',
    )
    view.rerender(<GroupAvatar name="Grupo Azul" mediaId={null} size="large" />)
    expect(view.container.querySelector('img')).toBeNull()
    expect(screen.getByText('GA')).toBeTruthy()
  })
})
