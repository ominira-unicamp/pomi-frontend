import { describe, expect, it } from 'vitest'

import { relationshipFor } from './types'
import type {
  Friendship,
  PublicPerson,
} from '@/features/friends/studentSocialApi'

const person: PublicPerson = {
  publicId: 'a375fdb0-45d9-4a79-8415-89fcb64157b6',
  displayName: 'Ada',
  bio: null,
  interests: [],
  currentCourses: [],
  program: null,
  specialization: null,
  entryYear: null,
}

function friendship(
  status: Friendship['status'],
  direction: Friendship['direction'],
): Friendship {
  return {
    id: 1,
    status,
    direction,
    friend: person,
    createdAt: '2026-01-01T00:00:00.000Z',
    acceptedAt: null,
  }
}

describe('social relationship state', () => {
  it('distinguishes no relation and pending directions', () => {
    expect(relationshipFor(person, 7, [])).toBe('NONE')
    expect(
      relationshipFor(person, 7, [friendship('PENDING', 'OUTGOING')]),
    ).toBe('OUTGOING_PENDING')
    expect(
      relationshipFor(person, 7, [friendship('PENDING', 'INCOMING')]),
    ).toBe('INCOMING_PENDING')
  })

  it('recognizes accepted friendships independently of profile fields', () => {
    expect(relationshipFor(person, 7, [friendship('ACCEPTED', 'NONE')])).toBe(
      'ACCEPTED',
    )
  })
})
