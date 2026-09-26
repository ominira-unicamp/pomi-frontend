import { describe, expect, it } from 'vitest'

import type { ExchangeNotice } from '@/features/exchange/data/exchangeApi'
import {
  buildExchangeNoticeQuery,
  defaultExchangeNoticeFilters,
  localDateKey,
  processExchangeNotices,
} from '@/features/exchange/data/exchangeNotices'

function notice(
  id: number,
  values: Partial<ExchangeNotice> = {},
): ExchangeNotice {
  return {
    id,
    number: `Edital ${id}`,
    issuer: 'DERI',
    title: `Título ${id}`,
    place: {
      id,
      name: `Local ${id}`,
    },
    registrationOriginalText: null,
    registrationStart: null,
    registrationEnd: null,
    files: [],
    ...values,
  }
}

describe('exchange notice processing', () => {
  it('serializes the dedicated remote search', () => {
    expect(
      buildExchangeNoticeQuery({
        ...defaultExchangeNoticeFilters,
        search: 'AFRICA',
      }),
    ).toEqual({ q: 'AFRICA' })
  })

  it('combines issuer, place and registration date filters', () => {
    expect(
      buildExchangeNoticeQuery({
        ...defaultExchangeNoticeFilters,
        issuers: ['DERI'],
        placeIds: [1],
        registrationEndAfter: '2026-09-10',
      }),
    ).toEqual({
      filter: {
        issuer: { in: ['DERI'] },
        placeId: { in: [1] },
        registrationEnd: { gte: '2026-09-10' },
      },
    })
  })

  it('keeps missing dates last in both sorting directions', () => {
    const notices = [
      notice(1, { registrationEnd: null }),
      notice(2, { registrationEnd: '2026-09-20' }),
      notice(3, { registrationEnd: '2026-09-10' }),
    ]

    expect(
      processExchangeNotices(notices, {
        ...defaultExchangeNoticeFilters,
        sortDirection: 'asc',
      }).map(({ id }) => id),
    ).toEqual([3, 2, 1])
    expect(
      processExchangeNotices(notices, {
        ...defaultExchangeNoticeFilters,
        sortDirection: 'desc',
      }).map(({ id }) => id),
    ).toEqual([2, 3, 1])
  })

  it('uses the local calendar date', () => {
    expect(localDateKey(new Date(2026, 8, 1, 23, 30))).toBe('2026-09-01')
  })
})
