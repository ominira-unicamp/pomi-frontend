import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  listCourses,
  listRelatedCourses,
  putCourseTag,
} from './courseCatalogApi'

describe('course catalog API', () => {
  afterEach(() => vi.restoreAllMocks())

  it('serializes the public course search filters', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          data: [],
          quantity: 0,
          total: 0,
          _paths: { next: null, prev: null },
        }),
        { status: 200 },
      ),
    )

    await listCourses({
      q: 'Cálculo',
      unitId: 3,
      catalogYear: 2026,
      tagId: 8,
      page: 2,
      pageSize: 20,
    })

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(
        /\/courses\?page=2&pageSize=20&q=C%C3%A1lculo&unitId=3&catalogYear=2026&tagId=8$/,
      ),
      {},
    )
  })

  it('loads related courses across every tag page', async () => {
    const first = { id: 10, code: 'MA142', name: 'Cálculo II', credits: 6 }
    const second = { id: 11, code: 'MA143', name: 'Cálculo III', credits: 6 }
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: [first],
            _paths: { next: '/tags/8/courses?page=2&pageSize=100' },
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: [second], _paths: { next: null } }), {
          status: 200,
        }),
      )

    await expect(listRelatedCourses(8)).resolves.toEqual([first, second])
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('associates a tag through the authenticated app API', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status: 204 }))
    const getAccessToken = vi.fn(() => Promise.resolve('token'))

    await putCourseTag(4, 8, getAccessToken)

    const request = fetchMock.mock.calls[0]?.[1] as RequestInit
    expect(String(fetchMock.mock.calls[0]?.[0])).toMatch(
      /\/courses\/4\/tags\/8$/,
    )
    expect(request.method).toBe('PUT')
    expect(new Headers(request.headers).get('Authorization')).toBe(
      'Bearer token',
    )
  })
})
