import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  buildExchangeSubscriptionPatch,
  getExchangeNoticeSubscription,
  listExchangeNotices,
  patchExchangeNoticeSubscription,
} from '@/features/exchange/data/exchangeApi'

describe('exchange API', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('loads notices from the public data API without authentication', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json([]))
    vi.stubGlobal('fetch', fetchMock)

    await listExchangeNotices()

    expect(fetchMock).toHaveBeenCalledOnce()
    expect(new URL(fetchMock.mock.calls[0][0]).pathname).toBe(
      '/exchange-notices',
    )
    expect(
      new Headers(fetchMock.mock.calls[0][1]?.headers).has('Authorization'),
    ).toBe(false)
  })

  it('loads and patches preferences using the student and bearer token', async () => {
    const subscription = { studentId: 7, enabled: true, placeIds: [2] }
    const fetchMock = vi
      .fn()
      .mockImplementation(() => Promise.resolve(Response.json(subscription)))
    vi.stubGlobal('fetch', fetchMock)
    const getAccessToken = vi.fn().mockResolvedValue('token')

    await getExchangeNoticeSubscription(7, getAccessToken)
    await patchExchangeNoticeSubscription(7, { enabled: false }, getAccessToken)

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(new URL(fetchMock.mock.calls[0][0]).pathname).toBe(
      '/student/7/exchange-notice-subscription',
    )
    const [, patchInit] = fetchMock.mock.calls[1]
    expect(patchInit.method).toBe('PATCH')
    expect(patchInit.body).toBe(JSON.stringify({ enabled: false }))
    expect(new Headers(patchInit.headers).get('Authorization')).toBe(
      'Bearer token',
    )
  })

  it('builds a patch with only fields that actually changed', () => {
    expect(
      buildExchangeSubscriptionPatch(
        { enabled: true, placeIds: [3, 2] },
        { enabled: true, placeIds: [2, 3] },
      ),
    ).toBeUndefined()
    expect(
      buildExchangeSubscriptionPatch(
        { enabled: false, placeIds: [] },
        { enabled: true, placeIds: [] },
      ),
    ).toEqual({ enabled: false })
    expect(
      buildExchangeSubscriptionPatch(
        { enabled: true, placeIds: [] },
        { enabled: true, placeIds: [2] },
      ),
    ).toEqual({ placeIds: [] })
  })
})
