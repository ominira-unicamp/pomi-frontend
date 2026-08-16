import { afterEach, describe, expect, it, vi } from 'vitest'
import { appApiRequest, dataApiRequest } from './client'

describe('API clients', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renews and sends the bearer token without persisting it', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    vi.stubGlobal('fetch', fetchMock)
    const getAccessToken = vi.fn().mockResolvedValue('access-token')

    await appApiRequest('/students', getAccessToken)

    expect(getAccessToken).toHaveBeenCalledOnce()
    const [, init] = fetchMock.mock.calls[0]
    expect(new Headers(init.headers).get('Authorization')).toBe(
      'Bearer access-token',
    )
    expect(new URL(fetchMock.mock.calls[0][0]).origin).toBe('http://localhost:3001')
  })

  it('supports public API reads without requesting or sending a token', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json([]))
    vi.stubGlobal('fetch', fetchMock)

    await dataApiRequest('/courses')

    const [, init] = fetchMock.mock.calls[0]
    expect(new Headers(init?.headers).has('Authorization')).toBe(false)
    expect(new URL(fetchMock.mock.calls[0][0]).origin).toBe('http://localhost:3000')
  })
})
