import { describe, expect, it } from 'vitest'
import { eventPeriod } from './eventTiming'

const now = Date.parse('2026-11-12T15:00:00Z')

describe('event timing', () => {
  it.each([
    { startsAt: null, endsAt: null, expected: 'undated' },
    { startsAt: '2026-11-13T15:00:00Z', endsAt: null, expected: 'upcoming' },
    {
      startsAt: '2026-11-12T15:00:00Z',
      endsAt: '2026-11-12T16:00:00Z',
      expected: 'ongoing',
    },
    {
      startsAt: '2026-11-11T15:00:00Z',
      endsAt: '2026-11-13T15:00:00Z',
      expected: 'ongoing',
    },
    {
      startsAt: '2026-11-11T15:00:00Z',
      endsAt: '2026-11-12T15:00:00Z',
      expected: 'past',
    },
    { startsAt: '2026-11-11T15:00:00Z', endsAt: null, expected: 'past' },
    { startsAt: null, endsAt: '2026-11-13T15:00:00Z', expected: 'undated' },
  ])(
    'classifies $startsAt / $endsAt as $expected',
    ({ startsAt, endsAt, expected }) => {
      expect(eventPeriod({ startsAt, endsAt }, now)).toBe(expected)
    },
  )
})
