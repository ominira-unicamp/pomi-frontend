import { describe, expect, it, vi } from 'vitest'

import { createInMemoryCurriculumPlanner } from './inMemoryCurriculumPlanner'
import type {
  CatalogProgramId,
  CourseId,
  CurriculumPlannerState,
  CurriculumPlannerStateStore,
  CurriculumPlannerStaticData,
  PlannerRevision,
} from './curriculumPlanner'

const catalogProgramId = 'catalog-program-1' as CatalogProgramId
const courseId = 'course-1' as CourseId
const initialRevision = 'revision-1' as PlannerRevision

const staticData: CurriculumPlannerStaticData = {
  catalogPrograms: [
    {
      id: catalogProgramId,
      title: 'Programa',
      catalog: { id: 'catalog-1' as never, year: 2026 },
      program: { id: 'program-1' as never, code: '1', name: 'Programa' },
      baseBlocks: {
        mandatory: [
          {
            type: 'course',
            source: { type: 'base' },
            selector: { type: 'specificCourse', courseId },
          },
        ],
        electives: [],
      },
      specializations: [],
      languages: [],
    },
  ],
  courses: [
    {
      id: courseId,
      code: 'AB100',
      name: 'Algoritmos',
      credits: 4,
      prefix: 'AB',
    },
  ],
}

const initialState: CurriculumPlannerState = {
  revision: initialRevision,
  selection: {},
  plan: { periods: [] },
  academicRecord: { completedCourses: [] },
}

function createTestStore(): CurriculumPlannerStateStore {
  let state: unknown | null = null
  return {
    read: () => Promise.resolve(state),
    write: (next) => {
      state = structuredClone(next)
      return Promise.resolve()
    },
    clear: () => {
      state = null
      return Promise.resolve()
    },
  }
}

describe('createInMemoryCurriculumPlanner', () => {
  it('derives curriculum and persists mutations', async () => {
    const source = {
      load: vi.fn().mockResolvedValue({ ok: true, value: staticData }),
    }
    const store = createTestStore()
    const ids = ['revision-2', 'period-1', 'revision-3']
    const planner = createInMemoryCurriculumPlanner({
      staticDataSource: source,
      initialState,
      store,
      generateId: () => ids.shift()!,
    })

    await planner.dispatch(
      { type: 'selectCatalogProgram', catalogProgramId },
      { expectedRevision: initialRevision },
    )
    let snapshot = await planner.getSnapshot()
    expect(snapshot.ok && snapshot.value.curriculum?.requirements).toHaveLength(
      1,
    )
    const revisionAfterSelection = snapshot.ok
      ? snapshot.value.revision
      : initialRevision

    await planner.dispatch(
      { type: 'addPlanningPeriod', position: { type: 'end' } },
      { expectedRevision: revisionAfterSelection },
    )
    snapshot = await planner.getSnapshot()
    expect(source.load).toHaveBeenCalledOnce()

    const restored = createInMemoryCurriculumPlanner({
      staticDataSource: source,
      initialState,
      store,
    })
    const restoredSnapshot = await restored.getSnapshot()
    expect(
      restoredSnapshot.ok && restoredSnapshot.value.plan.periods,
    ).toHaveLength(1)
  })

  it('does not persist invalid commands or revision no-ops', async () => {
    const write = vi.fn()
    const planner = createInMemoryCurriculumPlanner({
      staticDataSource: {
        load: () => Promise.resolve({ ok: true as const, value: staticData }),
      },
      initialState,
      store: {
        read: () => Promise.resolve(null),
        write,
        clear: () => Promise.resolve(),
      },
    })

    const result = await planner.dispatch(
      { type: 'unmarkCourseCompleted', courseId },
      { expectedRevision: initialRevision },
    )
    expect(result).toEqual({ ok: true, value: undefined })
    expect(write).not.toHaveBeenCalled()

    const conflict = await planner.dispatch(
      { type: 'setCurrentPlanningPeriod', periodId: null },
      { expectedRevision: 'stale' as PlannerRevision },
    )
    expect(conflict.ok).toBe(false)
    expect(write).not.toHaveBeenCalled()
  })

  it('persists a valid semester and year as the planning start', async () => {
    const planner = createInMemoryCurriculumPlanner({
      staticDataSource: {
        load: () => Promise.resolve({ ok: true as const, value: staticData }),
      },
      initialState,
    })

    await expect(
      planner.dispatch(
        {
          type: 'setPlanningStart',
          year: 2027,
          semester: 2,
          semesterNumber: 5,
        },
        { expectedRevision: initialRevision },
      ),
    ).resolves.toEqual({ ok: true, value: undefined })
    const snapshot = await planner.getSnapshot()
    expect(snapshot.ok && snapshot.value.plan.planningStart).toEqual({
      year: 2027,
      semester: 2,
      semesterNumber: 5,
    })
  })

  it('clears planning while preserving the curriculum selection', async () => {
    const planner = createInMemoryCurriculumPlanner({
      staticDataSource: {
        load: () => Promise.resolve({ ok: true as const, value: staticData }),
      },
      initialState: {
        ...initialState,
        selection: { catalogProgramId },
        plan: {
          planningStart: { year: 2027, semester: 1, semesterNumber: 3 },
          periods: [{ id: 'period-1' as never, items: [] }],
        },
        academicRecord: { completedCourses: [{ courseId }] },
      },
    })
    const result = await planner.dispatch(
      { type: 'clearPlanning' },
      { expectedRevision: initialRevision },
    )
    expect(result).toEqual({ ok: true, value: undefined })
    const snapshot = await planner.getSnapshot()
    expect(snapshot.ok && snapshot.value.selection).toEqual({
      catalogProgramId,
    })
    expect(snapshot.ok && snapshot.value.plan).toEqual({ periods: [] })
    expect(snapshot.ok && snapshot.value.academicRecord).toEqual({
      completedCourses: [],
    })
  })

  it('imports a portable planning document with fresh period ids', async () => {
    const planner = createInMemoryCurriculumPlanner({
      staticDataSource: {
        load: () => Promise.resolve({ ok: true as const, value: staticData }),
      },
      initialState,
      generateId: () => 'period-imported',
    })

    await expect(
      planner.dispatch(
        {
          type: 'importPlanning',
          data: {
            selection: { catalogProgramId },
            planningStart: { year: 2027, semester: 1, semesterNumber: 3 },
            periods: [{ courses: [courseId] }],
          },
        },
        { expectedRevision: initialRevision },
      ),
    ).resolves.toEqual({ ok: true, value: undefined })

    const snapshot = await planner.getSnapshot()
    expect(snapshot.ok && snapshot.value.plan).toMatchObject({
      planningStart: { year: 2027, semester: 1, semesterNumber: 3 },
      periods: [
        {
          id: 'period-imported',
          items: [{ type: 'course', courseId }],
        },
      ],
    })
  })

  it('preserves completed courses when importing a planning document', async () => {
    const planner = createInMemoryCurriculumPlanner({
      staticDataSource: {
        load: () => Promise.resolve({ ok: true as const, value: staticData }),
      },
      initialState: {
        ...initialState,
        academicRecord: { completedCourses: [{ courseId }] },
      },
      generateId: () => 'period-imported',
    })

    await expect(
      planner.dispatch(
        {
          type: 'importPlanning',
          data: {
            selection: { catalogProgramId },
            periods: [{ courses: [courseId] }],
          },
        },
        { expectedRevision: initialRevision },
      ),
    ).resolves.toEqual({ ok: true, value: undefined })

    const snapshot = await planner.getSnapshot()
    expect(
      snapshot.ok && snapshot.value.academicRecord.completedCourses,
    ).toEqual([{ courseId }])
    expect(snapshot.ok && snapshot.value.plan.periods[0]?.items).toEqual([
      { type: 'course', courseId },
    ])
  })

  it('keeps a completed course planned in one period when loading state', async () => {
    const planner = createInMemoryCurriculumPlanner({
      staticDataSource: {
        load: () => Promise.resolve({ ok: true as const, value: staticData }),
      },
      initialState: {
        ...initialState,
        plan: {
          periods: [
            { id: 'period-1' as never, items: [{ type: 'course', courseId }] },
            { id: 'period-2' as never, items: [{ type: 'course', courseId }] },
          ],
        },
        academicRecord: { completedCourses: [{ courseId }] },
      },
    })

    const snapshot = await planner.getSnapshot()
    expect(
      snapshot.ok && snapshot.value.academicRecord.completedCourses,
    ).toEqual([{ courseId }])
    expect(
      snapshot.ok &&
        snapshot.value.plan.periods.flatMap((period) => period.items),
    ).toEqual([{ type: 'course', courseId }])
  })

  it('preserves corrupt stored data and reports unexpected', async () => {
    const planner = createInMemoryCurriculumPlanner({
      staticDataSource: {
        load: () => Promise.resolve({ ok: true as const, value: staticData }),
      },
      initialState,
      store: {
        read: () => Promise.resolve({ version: 2 }),
        write: () => Promise.resolve(),
        clear: () => Promise.resolve(),
      },
    })

    await expect(planner.getSnapshot()).resolves.toEqual({
      ok: false,
      error: { code: 'unexpected', retryable: false },
    })
  })
})
