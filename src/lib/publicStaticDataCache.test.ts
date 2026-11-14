import { afterEach, describe, expect, it, vi } from 'vitest'
import { createPublicStaticDataCache } from './publicStaticDataCache'

afterEach(() => vi.unstubAllGlobals())

describe('persisted public cache compatibility', () => {
  it('reuses compatible entries and discards only incompatible data', async () => {
    vi.stubGlobal('indexedDB', undefined)
    const cache = createPublicStaticDataCache()
    const periods = [
      {
        id: 4,
        year: 2026,
        yearPeriod: 'FIRST_SEMESTER',
        startDate: '2026-03-01',
      },
    ]
    await cache.write('semester-planner:study-periods', periods)
    await cache.write('semester-planner:courses', { oldShape: [] })
    await expect(cache.read('semester-planner:study-periods')).resolves.toEqual(
      periods,
    )
    await expect(
      cache.read('semester-planner:courses'),
    ).resolves.toBeUndefined()
    await expect(cache.read('semester-planner:study-periods')).resolves.toEqual(
      periods,
    )
    await cache.write('semester-planner:courses', [
      { id: 1, code: 'MC102', name: 'Algoritmos', credits: 6 },
    ])
    await expect(cache.read('semester-planner:courses')).resolves.toHaveLength(
      1,
    )
  })

  it('ignores malformed nested data instead of returning it to rendering code', async () => {
    vi.stubGlobal('indexedDB', undefined)
    const cache = createPublicStaticDataCache()
    await cache.write('semester-planner:classes:1', [
      { id: 2, code: 'A', courseId: 1, courseCode: 'MC102', professors: null },
    ])
    await expect(
      cache.read('semester-planner:classes:1'),
    ).resolves.toBeUndefined()
    await cache.write('curriculum-planner:static-data', {
      courses: [],
      catalogPrograms: [{ id: '1' }],
    })
    await expect(
      cache.read('curriculum-planner:static-data'),
    ).resolves.toBeUndefined()
  })

  it('works in memory when IndexedDB refuses to open', async () => {
    vi.stubGlobal('indexedDB', {
      open: () => {
        throw new Error('blocked')
      },
    })
    const cache = createPublicStaticDataCache()
    await cache.write('semester-planner:courses', [])
    await expect(cache.read('semester-planner:courses')).resolves.toEqual([])
  })
})
