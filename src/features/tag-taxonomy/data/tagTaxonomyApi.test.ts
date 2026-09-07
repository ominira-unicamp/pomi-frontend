import { afterEach, describe, expect, it, vi } from 'vitest'

import { createTag, deleteCategory, listRelatedCourses } from './tagTaxonomyApi'

describe('tag taxonomy API', () => {
  afterEach(() => vi.restoreAllMocks())

  it('creates a tag with the authenticated app API', async () => {
    const tag = { id: 8, name: 'Álgebra', categoryId: 1, parentTagId: null }
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify(tag), { status: 201 }))
    const getAccessToken = vi.fn(() => Promise.resolve('token'))

    await expect(
      createTag(
        { name: 'Álgebra', categoryId: 1, parentTagId: null },
        getAccessToken,
      ),
    ).resolves.toEqual(tag)

    const request = fetchMock.mock.calls[0]?.[1] as RequestInit
    expect(String(fetchMock.mock.calls[0]?.[0])).toMatch(/\/tags$/)
    expect(request.method).toBe('POST')
    expect(new Headers(request.headers).get('Authorization')).toBe(
      'Bearer token',
    )
    expect(request.body).toBe(
      JSON.stringify({ name: 'Álgebra', categoryId: 1, parentTagId: null }),
    )
  })

  it('loads related courses across pages', async () => {
    const first = { id: 10, code: 'MA141', name: 'Cálculo I', credits: 6 }
    const second = { id: 11, code: 'MA142', name: 'Cálculo II', credits: 6 }
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: [first],
            _paths: { next: '/tags/8/courses?page=2&pageSize=100' },
          }),
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ data: [second], _paths: { next: null } }),
        ),
      )

    await expect(listRelatedCourses(8)).resolves.toEqual([first, second])
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('deletes a category with the authenticated app API', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status: 204 }))
    const getAccessToken = vi.fn(() => Promise.resolve('token'))

    await deleteCategory(3, getAccessToken)

    const request = fetchMock.mock.calls[0]?.[1] as RequestInit
    expect(String(fetchMock.mock.calls[0]?.[0])).toMatch(/\/categories\/3$/)
    expect(request.method).toBe('DELETE')
    expect(new Headers(request.headers).get('Authorization')).toBe(
      'Bearer token',
    )
  })
})
