import { describe, expect, it } from 'vitest'

import type { ExchangeNotice } from '@/features/exchange/data/exchangeApi'
import {
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
      _paths: { notices: `/exchange-notices?placeId=${id}` },
    },
    registrationOriginalText: null,
    registrationStart: null,
    registrationEnd: null,
    files: [],
    _paths: { self: `/exchange-notices/${id}` },
    ...values,
  }
}

describe('exchange notice processing', () => {
  it('searches title, number and place without accents or case differences', () => {
    const notices = [
      notice(1, { title: 'Intercâmbio na África' }),
      notice(2, { title: 'Programa europeu' }),
    ]

    expect(
      processExchangeNotices(notices, {
        ...defaultExchangeNoticeFilters,
        search: 'AFRICA',
      }).map(({ id }) => id),
    ).toEqual([1])
  })

  it('combines issuer, place and registration date filters', () => {
    const notices = [
      notice(1, {
        registrationStart: '2026-09-01',
        registrationEnd: '2026-09-20',
      }),
      notice(2, {
        issuer: 'Outra unidade',
        registrationStart: '2026-09-05',
        registrationEnd: '2026-09-25',
      }),
    ]

    expect(
      processExchangeNotices(notices, {
        ...defaultExchangeNoticeFilters,
        issuers: ['DERI'],
        placeIds: [1],
        registrationEndAfter: '2026-09-10',
      }).map(({ id }) => id),
    ).toEqual([1])
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
