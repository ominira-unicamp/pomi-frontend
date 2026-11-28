import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApiCurriculumPlannerStaticDataSource } from '@/catalog/data/curriculumPlannerApi'

describe('createApiCurriculumPlannerStaticDataSource', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('loads all courses and maps requirements without database ids', async () => {
    const fetchMock = vi.fn((input: string) => {
      const url = new URL(input)
      if (url.pathname === '/catalog-program') {
        return Promise.resolve(
          Response.json({
            data: [
              {
                id: 1,
                title: 'Programa',
                catalogId: 2,
                catalogYear: 2026,
                programId: 3,
                programCode: 10,
                programName: 'Programa',
                shift: 'NIGHT',
                creditLimitType: 'FIXED',
                creditLimitFixedCredits: 30,
                professionalPracticeDescription: 'Atuação profissional.',
                base: {
                  mandatory: [
                    {
                      id: 99,
                      type: 'specific',
                      specific: {
                        courseId: 7,
                        courseCode: 'AB100',
                        courseName: 'Algoritmos',
                        catalogCourseId: null,
                      },
                    },
                  ],
                  electives: [
                    {
                      id: 55,
                      credits: 4,
                      courses: [
                        {
                          id: 98,
                          type: 'prefix',
                          prefix: { value: 'ab' },
                        },
                      ],
                    },
                  ],
                },
                variants: [
                  {
                    id: 12,
                    type: 'SPECIALIZATION',
                    curriculumSuggestionId: null,
                    specialization: { specializationId: 20 },
                    integralizationCredits: 243,
                    integralizationSupervisedHours: 3645,
                    integralizationExtensionHours: 0,
                    integralizationSemesters: 10,
                    integralizationMaximumSemesters: 16,
                    professionalDescription: 'Perfil profissional.',
                    recognitionDescription: 'Portaria de reconhecimento.',
                    code: 'ESP',
                    name: 'Especialização',
                    blocks: { mandatory: [], electives: [] },
                  },
                ],
                languages: [],
              },
            ],
            links: { next: null },
          }),
        )
      }
      if (url.pathname === '/courses' && url.searchParams.get('page') === '2') {
        return Promise.resolve(
          Response.json({
            data: [
              {
                id: 9,
                code: 'EF100',
                name: 'Estruturas Formais',
                credits: 4,
                prefix: 'EF',
              },
            ],
            quantity: 1,
            total: 1,
            links: { next: null },
          }),
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
            quantity: 2,
            total: 3,
            links: { next: '/courses?page=2&pageSize=100' },
          }),
        )
      }
      return Promise.reject(new Error(`Unexpected request: ${input}`))
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await createApiCurriculumPlannerStaticDataSource().load()
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.catalogPrograms[0].information).toMatchObject({
      shift: 'NIGHT',
      creditLimitType: 'FIXED',
      creditLimitFixedCredits: 30,
      professionalPracticeDescription: 'Atuação profissional.',
      creditLimitThresholdCredits: null,
    })
    expect(result.value.catalogPrograms[0].variants[0].information).toEqual({
      integralizationCredits: 243,
      integralizationSupervisedHours: 3645,
      integralizationExtensionHours: 0,
      integralizationSemesters: 10,
      integralizationMaximumSemesters: 16,
      professionalDescription: 'Perfil profissional.',
      recognitionDescription: 'Portaria de reconhecimento.',
    })
    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(result.value.courses).toHaveLength(3)
    expect(new URL(fetchMock.mock.calls[1][0]).pathname).toBe('/courses')
    expect(new URL(fetchMock.mock.calls[2][0]).search).toBe(
      '?page=2&pageSize=100',
    )
    expect(
      result.value.catalogPrograms[0].baseBlocks.mandatory[0],
    ).not.toHaveProperty('id')
    expect(
      result.value.catalogPrograms[0].baseBlocks.electives[0].eligibleCourses,
    ).toEqual([{ type: 'prefix', prefix: 'AB' }])
    expect(result.value.catalogPrograms[0].variants[0]?.specializationId).toBe(
      20,
    )
  })
})
