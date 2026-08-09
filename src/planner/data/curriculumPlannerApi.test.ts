import { afterEach, describe, expect, it, vi } from 'vitest'

import { createApiCurriculumPlannerStaticDataSource } from './curriculumPlannerApi'

describe('createApiCurriculumPlannerStaticDataSource', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('loads every courses page and maps requirements without database ids', async () => {
    const fetchMock = vi.fn((input: URL) => {
      if (input.pathname === '/catalog-program') {
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
      if (input.searchParams.get('page') === '1') {
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
            ],
            _paths: { next: '/courses?page=2&pageSize=1000' },
          }),
        )
      }
      return Promise.resolve(
        Response.json({
          data: [
            { id: 8, code: 'CD100', name: 'Dados', credits: 4, prefix: 'CD' },
          ],
          _paths: { next: null },
        }),
      )
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await createApiCurriculumPlannerStaticDataSource().load()
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.courses).toHaveLength(2)
    expect(fetchMock.mock.calls[1][0].searchParams.get('pageSize')).toBe('1000')
    expect(
      result.value.catalogPrograms[0].baseBlocks.mandatory[0],
    ).not.toHaveProperty('id')
    expect(
      result.value.catalogPrograms[0].baseBlocks.electives[0].eligibleCourses,
    ).toEqual([{ type: 'prefix', prefix: 'AB' }])
  })
})
