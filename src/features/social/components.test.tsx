import { render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'

import { PersonSummary } from './components'
import type { PublicPerson } from '@/features/friends/studentSocialApi'

vi.mock('@/auth/AuthProvider', () => ({
  useOptionalAuth: () => ({ sessionSubject: null }),
}))

it('keeps a person identifiable when the directory supplies or hides their avatar', () => {
  const person = {
    publicId: 'person',
    displayName: 'Ana Silva',
    avatarMediaId: 'person-avatar',
    bio: null,
    program: null,
    specialization: null,
    entryYear: null,
  } as PublicPerson
  const view = render(<PersonSummary person={person} />)
  expect(
    view.container.querySelector(
      'img[src$="/media/person-avatar/avatarSmall"]',
    ),
  ).toBeTruthy()
  view.rerender(<PersonSummary person={{ ...person, avatarMediaId: null }} />)
  expect(view.container.querySelector('img')).toBeNull()
  expect(screen.getByText('Ana Silva')).toBeTruthy()
})
