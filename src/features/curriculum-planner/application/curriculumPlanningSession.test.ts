import { expect, it, vi } from 'vitest'
import { createCurriculumPlanningSession } from './curriculumPlanningSession'
import type { CurriculumPlanner, CurriculumPlannerSnapshot } from '@pomi/planner-domain/curriculum'

it('keeps academic state unchanged when the server rejects the operation', async () => {
  const snapshot = { revision: 'original' } as CurriculumPlannerSnapshot
  const dispatch = vi.fn()
  const planner = {
    getSnapshot: () => Promise.resolve({ ok: true, value: snapshot }),
    dispatch,
  } as unknown as CurriculumPlanner
  const session = createCurriculumPlanningSession(planner)
  const confirmed = vi.fn()
  await expect(
    session.dispatch(
      { type: 'markCourseCompleted', courseId: '101' as never },
      () => Promise.reject(new Error('offline')),
      confirmed,
    ),
  ).rejects.toThrow('offline')
  expect(dispatch).not.toHaveBeenCalled()
  expect(confirmed).not.toHaveBeenCalled()
  expect(session.getState().snapshot).toBe(snapshot)
})

it('does not apply a late academic confirmation after leaving the session', async () => {
  let finish!: () => void
  const response = new Promise<void>((resolve) => {
    finish = resolve
  })
  const dispatch = vi.fn()
  const planner = {
    getSnapshot: () =>
      Promise.resolve({ ok: true, value: { revision: 'original' } }),
    dispatch,
  } as unknown as CurriculumPlanner
  const session = createCurriculumPlanningSession(planner)
  const before = vi.fn(() => response)
  const operation = session.dispatch(
    { type: 'markCourseCompleted', courseId: '101' as never },
    before,
    vi.fn(),
  )
  await vi.waitFor(() => expect(before).toHaveBeenCalledOnce())
  session.dispose()
  finish()
  expect(await operation).toBe(false)
  expect(dispatch).not.toHaveBeenCalled()
})
