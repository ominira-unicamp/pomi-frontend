import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, expect, it, vi } from 'vitest'
import { useSemesterEligibility } from './useSemesterEligibility'
import type { ReactNode } from 'react'

const sdk = vi.hoisted(() => ({ catalog: vi.fn(), courses: vi.fn() }))
vi.mock('@/api/client', () => ({
  pomiSdk: {
    data: {
      catalogs: { get: sdk.catalog },
      catalogCourses: { listAll: sdk.courses },
    },
  },
}))
beforeEach(() => {
  vi.clearAllMocks()
  sdk.catalog.mockImplementation((id: number) =>
    Promise.resolve({ id, year: 2018 }),
  )
  sdk.courses.mockResolvedValue([{ courseId: 1, prerequisites: { any: [] } }])
})
const data = {
  courses: [{ id: 1, code: 'MC102', name: 'Algoritmos', credits: 6 }],
  studyPeriods: [
    {
      id: 2,
      year: 2027,
      yearPeriod: 'FIRST_SEMESTER' as const,
      startDate: '2027-03-01',
    },
  ],
  meetings: [],
  classes: [
    {
      id: 10,
      code: 'A',
      courseId: 1,
      courseCode: 'MC102',
      professors: [],
      reservationPrograms: [{ id: 20, code: 34, name: 'Computação' }],
    },
  ],
}
function setup() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
}
it('loads the academic catalog ID, not the planning year, and reacts to profile changes', async () => {
  const { result, rerender } = renderHook(
    ({ catalogId, programId }) =>
      useSemesterEligibility({
        data,
        catalogId,
        programId,
        attempts: [],
        studyPeriodId: 2,
      }),
    { wrapper: setup(), initialProps: { catalogId: 5, programId: 20 } },
  )
  await waitFor(() => expect(result.current.prerequisitesReady).toBe(true))
  expect(sdk.catalog).toHaveBeenCalledWith(5)
  expect(sdk.courses).toHaveBeenCalledWith({
    page: 1,
    pageSize: 1000,
    filter: { catalogId: 5 },
  })
  expect(result.current.prerequisiteHint).toContain('2018')
  expect(result.current.matchedClassIds.has(10)).toBe(true)
  rerender({ catalogId: 6, programId: 30 })
  await waitFor(() => expect(sdk.catalog).toHaveBeenCalledWith(6))
  expect(result.current.matchedClassIds.has(10)).toBe(false)
})
it('does not substitute a catalog for a missing profile or enable the history filter', () => {
  const { result } = renderHook(
    () => useSemesterEligibility({ data, studyPeriodId: 2 }),
    { wrapper: setup() },
  )
  expect(sdk.catalog).not.toHaveBeenCalled()
  expect(result.current.prerequisitesReady).toBe(false)
  expect(result.current.reservationsReady).toBe(false)
  expect(result.current.prerequisiteHint).toContain('Defina o catálogo')
})
it('preserves catalog and history failures as unavailable context', async () => {
  sdk.catalog.mockRejectedValue(new Error('Unavailable'))
  const { result } = renderHook(
    () => useSemesterEligibility({ data, catalogId: 5, studyPeriodId: 2 }),
    { wrapper: setup() },
  )
  await waitFor(() =>
    expect(result.current.prerequisiteHint).toContain(
      'Não foi possível carregar',
    ),
  )
  expect(result.current.prerequisitesReady).toBe(false)
  expect(result.current.prerequisites.get(1)?.status).toBe('unknown')
})
