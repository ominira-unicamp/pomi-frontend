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
