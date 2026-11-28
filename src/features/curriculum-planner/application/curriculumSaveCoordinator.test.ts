import { afterEach, expect, it, vi } from 'vitest'
import { createCurriculumSaveCoordinator } from './curriculumSaveCoordinator'
import type { CurriculumPlannerSnapshot } from '@pomi/planner-domain/curriculum'

const snapshot = (revision: string) =>
  ({ revision }) as CurriculumPlannerSnapshot
afterEach(() => vi.useRealTimers())
it('debounces edits and retains the latest snapshot after failure', async () => {
  vi.useFakeTimers()
  const persist = vi
    .fn()
    .mockRejectedValueOnce(new Error('offline'))
    .mockResolvedValue(undefined)
  const coordinator = createCurriculumSaveCoordinator(persist)
  coordinator.schedule(snapshot('a'))
  coordinator.schedule(snapshot('b'))
  await vi.advanceTimersByTimeAsync(500)
  expect(persist).toHaveBeenCalledTimes(1)
  expect(persist.mock.calls[0][0].revision).toBe('b')
  expect(coordinator.getStatus()).toBe('error')
  coordinator.schedule(snapshot('c'))
  await vi.advanceTimersByTimeAsync(1000)
  expect(persist).toHaveBeenCalledTimes(1)
  expect(await coordinator.flush()).toBe(true)
  expect(persist.mock.calls[1][0].revision).toBe('c')
  expect(coordinator.getStatus()).toBe('idle')
})
it('cancels scheduled writes when leaving the session', async () => {
  vi.useFakeTimers()
  const persist = vi.fn()
  const coordinator = createCurriculumSaveCoordinator(persist)
  coordinator.schedule(snapshot('a'))
  coordinator.dispose()
  await vi.runAllTimersAsync()
  expect(persist).not.toHaveBeenCalled()
  expect(await coordinator.flush()).toBe(false)
})
