import { afterEach, describe, expect, it, vi } from 'vitest'

import { getCatalogCourseDetails } from './courseDetailsApi'

describe('courseDetailsApi', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('loads the course from the requested catalog year', async () => {
    const details = {
      id: 21,
      catalogId: 26,
      catalogYear: 2026,
      courseId: 10,
      code: 'MC202',
      name: 'Estruturas de Dados',
      credits: 6,
      coordinator: null,
      workload: {
        theoreticalHours: 4,
        practicalHours: 2,
        laboratoryHours: null,
        guidedActivityHours: null,
        distanceHours: null,
        guidedExtensionHours: null,
        practicalExtensionHours: null,
        weeks: 15,
        weeklyClassHours: 6,
        classroomHours: 90,
      },
      offeringPeriod: 'ALL_PERIODS',
      evaluation: 'GRADE_AND_ATTENDANCE',
      finalExam: true,
      minimumAttendancePercent: 75,
      syllabus: 'Ementa',
      bibliography: null,
      sourceUrl: 'https://example.com',
    } as const
    const fetchMock = vi.fn((input: string) => {
      const url = new URL(input)
      expect(url.pathname).toBe('/catalog-courses')
      expect(url.searchParams.get('courseId')).toBe('10')
      expect(url.searchParams.get('catalogYear')).toBe('2026')
      return Promise.resolve(Response.json({ data: [details] }))
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(getCatalogCourseDetails(10, 2026)).resolves.toEqual(details)
    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('returns null when the course is absent from the catalog', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(Response.json({ data: [] }))),
    )

    await expect(getCatalogCourseDetails(10, 2026)).resolves.toBeNull()
  })
})
