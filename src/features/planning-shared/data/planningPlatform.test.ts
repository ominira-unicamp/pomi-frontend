import { beforeEach, describe, expect, it } from 'vitest'

import { createLocalStorageCurriculumPlannerStateStore } from './planningPlatform'
import type {
  CurriculumPlannerStoredStateV1,
  PlannerRevision,
} from '@pomi/planner-domain/curriculum'

describe('createLocalStorageCurriculumPlannerStateStore', () => {
  beforeEach(() => window.localStorage.clear())

  it('persists, reads and clears planner state in browser storage', async () => {
    const store = createLocalStorageCurriculumPlannerStateStore({
      key: 'planner-test',
    })
    const state: CurriculumPlannerStoredStateV1 = {
      version: 1,
      state: {
        revision: '3' as PlannerRevision,
        selection: {},
        plan: { periods: [] },
        academicRecord: { completedCourses: [] },
      },
    }

    await store.write(state)

    await expect(store.read()).resolves.toEqual(state)

    await store.clear()

    await expect(store.read()).resolves.toBeNull()
  })
})

it('preserves a corrupted persisted draft and reports recovery failure', async () => {
  const raw = '{broken'
  window.localStorage.setItem('legacy-draft', raw)
  window.localStorage.setItem('pomi-theme', 'dark')
  const store = createLocalStorageCurriculumPlannerStateStore({
    key: 'legacy-draft',
  })
  await expect(store.read()).rejects.toThrow('preservados')
  expect(window.localStorage.getItem('legacy-draft')).toBe(raw)
  expect(window.localStorage.getItem('pomi-theme')).toBe('dark')
})

it('rejects an incompatible persisted draft without rewriting it', async () => {
  const raw = JSON.stringify({ version: 2, state: {} })
  window.localStorage.setItem('legacy-draft', raw)
  const store = createLocalStorageCurriculumPlannerStateStore({
    key: 'legacy-draft',
  })
  await expect(store.read()).rejects.toThrow('preservados')
  expect(window.localStorage.getItem('legacy-draft')).toBe(raw)
})
