import { afterEach, describe, expect, it, vi } from 'vitest'
import { requireCurrentUserId } from './identityApi'

afterEach(() => vi.unstubAllGlobals())

describe('user admission', () => {
  it('uses the user ID without creating an academic profile', async () => {
    const fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          principalId: 2,
          authIdentityId: 3,
          kind: 'HUMAN',
          userId: 41,
          studentId: null,
          serviceAccountId: null,
          roles: [],
          capabilities: [],
        }),
        { status: 200 },
      ),
    )
    vi.stubGlobal('fetch', fetch)
    await expect(
      requireCurrentUserId(() => Promise.resolve('token')),
    ).resolves.toBe(41)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/me$/),
      expect.objectContaining({ cache: 'no-store' }),
    )
  })

  it('never substitutes the academic ID for the user ID', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            kind: 'HUMAN',
            userId: 41,
            studentId: 17,
          }),
          { status: 200 },
        ),
      ),
    )
    await expect(
      requireCurrentUserId(() => Promise.resolve('token')),
    ).resolves.toBe(41)
  })

  it('rejects service identities without creating a student', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(
        new Response(
          JSON.stringify({ kind: 'SERVICE', userId: null, studentId: null }),
          { status: 200 },
        ),
      )
    vi.stubGlobal('fetch', fetch)
    await expect(
      requireCurrentUserId(() => Promise.resolve('token')),
    ).rejects.toThrow('conta de usuário')
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})
