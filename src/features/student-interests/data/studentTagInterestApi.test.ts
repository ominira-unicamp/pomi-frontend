import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  deleteUserInterest,
  listUserInterests,
  putUserInterest,
} from './studentTagInterestApi'

describe('student tag interest API', () => {
  const fetchMock = vi.spyOn(globalThis, 'fetch')
  const getAccessToken = vi.fn(() => Promise.resolve('token'))

  beforeEach(() => {
    fetchMock.mockReset()
    getAccessToken.mockClear()
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }))
  })

  it('lists interests privately for the current student', async () => {
    const interests = [
      { id: 8, name: 'Álgebra', categoryId: 1, parentTagId: null },
    ]
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          data: interests,
          quantity: interests.length,
          total: interests.length,
          links: { next: null },
        }),
        { status: 200 },
      ),
    )

    await expect(listUserInterests(7, getAccessToken)).resolves.toEqual(
      interests,
    )
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/users\/7\/interests(?:\?|$)/),
      expect.objectContaining({ cache: 'no-store' }),
    )
  })

  it('adds and removes an interest idempotently', async () => {
    await putUserInterest(7, 8, getAccessToken)
    await deleteUserInterest(7, 8, getAccessToken)

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      expect.stringMatching(/\/users\/7\/interests\/8$/),
      expect.objectContaining({ method: 'PUT' }),
    )
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(/\/users\/7\/interests\/8$/),
      expect.objectContaining({ method: 'DELETE' }),
    )
  })
})
