import { afterEach, describe, expect, it, vi } from 'vitest'

import { getCurriculum } from './curriculumPersistenceApi'

describe('curriculum persistence API', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('maps backend selection identifiers to planner identifiers', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        id: 12,
        studentId: 3,
        name: 'Ciência da Computação',
        isFavorite: true,
        selection: {
          catalogProgramId: 42,
          specializationId: 7,
          languageId: 9,
        },
        planningStart: { year: 2026, semester: 2, semesterNumber: 5 },
        currentPeriodId: 101,
        periods: [{ id: 101, position: 1 }],
        courses: [
          {
            courseId: 300,
            periodId: 101,
            code: 'MC300',
            name: 'Disciplina',
            credits: 4,
          },
          {
            courseId: 301,
            periodId: null,
            code: 'MC301',
            name: 'Não alocada',
            credits: 4,
          },
        ],
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-02T00:00:00.000Z',
        _paths: { self: '/curriculum/12', student: '/student/3' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const document = await getCurriculum(3, 12, () => Promise.resolve('token'))

    expect(document).toMatchObject({
      id: 12,
      isFavorite: true,
      selection: {
        catalogProgramId: '42',
        specializationId: '7',
        languageId: '9',
      },
      currentPeriodId: '101',
      periods: [{ id: '101', position: 1 }],
      courses: [
        { courseId: '300', periodId: '101' },
        { courseId: '301', periodId: null },
      ],
    })
  })
})
