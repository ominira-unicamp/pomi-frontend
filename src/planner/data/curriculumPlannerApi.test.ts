import { afterEach, describe, expect, it, vi } from 'vitest'

import { createApiCurriculumPlannerStaticDataSource } from './curriculumPlannerApi'

describe('createApiCurriculumPlannerStaticDataSource', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('loads all courses and maps requirements without database ids', async () => {
    const fetchMock = vi.fn((input: string) => {
      const url = new URL(input)
      if (url.pathname === '/catalog-program') {
        return Promise.resolve(
          Response.json([
            {
              id: 1,
              title: 'Programa',
              catalogId: 2,
              catalogYear: 2026,
              programId: 3,
              programCode: 10,
              programName: 'Programa',
              base: {
                mandatory: [
                  { id: 99, type: 'specific', courseId: 7, prefix: null },
                ],
                electives: [
                  {
                    id: 55,
                    credits: 4,
                    courses: [
                      { id: 98, type: 'prefix', courseId: null, prefix: 'ab' },
                    ],
                  },
                ],
              },
              modalities: [],
              languages: [],
            },
          ]),
        )
      }
      if (url.pathname === '/courses') {
        return Promise.resolve(
          Response.json({
            data: [
              {
                id: 7,
                code: 'AB100',
                name: 'Algoritmos',
                credits: 4,
                prefix: 'AB',
              },
              { id: 8, code: 'CD100', name: 'Dados', credits: 4, prefix: 'CD' },
            ],
            _paths: { next: null },
          }),
        )
      }
      return Promise.reject(new Error(`Unexpected request: ${input}`))
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await createApiCurriculumPlannerStaticDataSource().load()
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.courses).toHaveLength(2)
    expect(new URL(fetchMock.mock.calls[1][0]).pathname).toBe('/courses')
    expect(
      result.value.catalogPrograms[0].baseBlocks.mandatory[0],
    ).not.toHaveProperty('id')
    expect(
      result.value.catalogPrograms[0].baseBlocks.electives[0].eligibleCourses,
    ).toEqual([{ type: 'prefix', prefix: 'AB' }])
  })
})
