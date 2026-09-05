import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  CurrentCatalogUnavailableError,
  currentCatalogYear,
  loadCurrentYearPrerequisites,
} from './curriculumPrerequisiteApi'

describe('curriculumPrerequisiteApi', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('uses the current year in America/Sao_Paulo', () => {
    expect(currentCatalogYear(new Date('2027-01-01T01:30:00.000Z'))).toBe(2026)
  })

  it('loads every page and maps alternatives', async () => {
    const fetchMock = vi.fn((input: string) => {
      const url = new URL(input)
      if (url.pathname === '/catalogs')
        return Promise.resolve(Response.json([{ id: 26, year: 2026 }]))
      if (
        url.pathname === '/catalog-courses' &&
        url.searchParams.get('page') === '1'
      )
        return Promise.resolve(
          Response.json({
            data: [
              {
                courseId: 10,
                prerequisites: {
                  any: [
                    {
                      all: [
                        {
                          code: 'MA111',
                          kind: 'FULL',
                          courseId: 11,
                          prefixId: null,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
            _paths: {
              next: '/catalog-courses?catalogId=26&page=2&pageSize=1000',
            },
          }),
        )
      if (
        url.pathname === '/catalog-courses' &&
        url.searchParams.get('page') === '2'
      )
        return Promise.resolve(
          Response.json({
            data: [
              {
                courseId: 12,
                prerequisites: {
                  any: [
                    {
                      all: [
                        {
                          code: 'AA200',
                          kind: 'SPECIAL',
                          courseId: null,
                          prefixId: null,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
            _paths: { next: null },
          }),
        )
      return Promise.reject(new Error(`Unexpected request: ${input}`))
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await loadCurrentYearPrerequisites(
      new Date('2026-08-21T12:00:00.000Z'),
    )

    expect(result.year).toBe(2026)
    expect(result.courseIds).toEqual(['10', '12'])
    expect(result.rules).toHaveLength(2)
    expect(result.rules[1].alternatives[0].allOf[0]).toEqual({
      kind: 'SPECIAL',
      target: { type: 'special', code: 'AA200' },
    })
  })

  it('does not fall back when the current catalog is unavailable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(Response.json([]))),
    )

    await expect(
      loadCurrentYearPrerequisites(new Date('2028-08-21T12:00:00.000Z')),
    ).rejects.toBeInstanceOf(CurrentCatalogUnavailableError)
  })
})
