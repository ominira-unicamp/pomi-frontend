import { afterEach, describe, expect, it, vi } from 'vitest'
import { pomiApi } from './client'

describe('API SDK adapter', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renews and sends the bearer token through an SDK operation', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(Response.json({ studentId: null }))
    vi.stubGlobal('fetch', fetchMock)
    const getAccessToken = vi.fn().mockResolvedValue('access-token')

    await pomiApi.student.getCurrentStudent(getAccessToken)

    expect(getAccessToken).toHaveBeenCalledOnce()
    const [, init] = fetchMock.mock.calls[0]
    expect(new Headers(init.headers).get('Authorization')).toBe(
      'Bearer access-token',
    )
    expect(new URL(fetchMock.mock.calls[0][0]).pathname).toBe('/me')
  })

  it('uses the SDK operation for public data reads', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        data: [],
        quantity: 0,
        total: 0,
        _paths: { next: null, prev: null },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await pomiApi.courseCatalog.listCourses({ page: 1 })

    const [, init] = fetchMock.mock.calls[0]
    expect(new Headers(init?.headers).has('Authorization')).toBe(false)
    expect(new URL(fetchMock.mock.calls[0][0]).pathname).toBe('/courses')
  })
})
