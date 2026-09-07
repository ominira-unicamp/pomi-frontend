import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  deleteStudentTagInterest,
  listStudentTagInterests,
  putStudentTagInterest,
} from './studentTagInterestApi'

describe('student tag interest API', () => {
  const fetchMock = vi.spyOn(globalThis, 'fetch')
  const getAccessToken = vi.fn(() => Promise.resolve('token'))

  beforeEach(() => {
    fetchMock.mockReset()
    getAccessToken.mockClear()
    fetchMock.mockResolvedValue(new Response('[]', { status: 200 }))
  })

  it('lists interests privately for the current student', async () => {
    const interests = [
      { id: 8, name: 'Álgebra', categoryId: 1, parentTagId: null },
    ]
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(interests), { status: 200 }),
    )

    await expect(listStudentTagInterests(7, getAccessToken)).resolves.toEqual(
      interests,
    )
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/student/7/tag-interests',
      expect.objectContaining({ cache: 'no-store' }),
    )
  })

  it('adds and removes an interest idempotently', async () => {
    await putStudentTagInterest(7, 8, getAccessToken)
    await deleteStudentTagInterest(7, 8, getAccessToken)

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'http://localhost:3001/student/7/tag-interests/8',
      expect.objectContaining({ method: 'PUT' }),
    )
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'http://localhost:3001/student/7/tag-interests/8',
      expect.objectContaining({ method: 'DELETE' }),
    )
  })
})
