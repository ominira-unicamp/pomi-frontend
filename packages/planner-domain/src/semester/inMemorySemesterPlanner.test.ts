import { describe, expect, it } from 'vitest'

import { createInMemorySemesterPlanner } from './inMemorySemesterPlanner'
import type { SemesterPlannerStaticData } from './semesterPlanner'

const data: SemesterPlannerStaticData = {
  studyPeriods: [
    { id: 1, code: '1s2026', startDate: '2026-02-01T00:00:00.000Z' },
  ],
  courses: [
    { id: 10, code: 'MC102', name: 'Algoritmos', credits: 6 },
    { id: 11, code: 'MA211', name: 'Cálculo', credits: 4 },
  ],
  classes: [
    { id: 100, code: 'A', courseId: 10, courseCode: 'MC102', professors: [] },
    { id: 101, code: 'B', courseId: 10, courseCode: 'MC102', professors: [] },
    { id: 102, code: 'A', courseId: 11, courseCode: 'MA211', professors: [] },
  ],
  meetings: [
    {
      id: 1,
      classId: 100,
      dayOfWeek: 'MONDAY',
      start: '08:00',
      end: '10:00',
      roomCode: 'CB01',
    },
    {
      id: 2,
      classId: 101,
      dayOfWeek: 'TUESDAY',
      start: '08:00',
      end: '10:00',
      roomCode: 'CB02',
    },
    {
      id: 3,
      classId: 102,
      dayOfWeek: 'MONDAY',
      start: '09:00',
      end: '11:00',
      roomCode: 'CB03',
    },
  ],
}

describe('InMemorySemesterPlanner', () => {
  it('requires explicit replacement for another class of the same course', async () => {
    const planner = createInMemorySemesterPlanner({ staticData: data })
    await planner.dispatch({ type: 'selectStudyPeriod', studyPeriodId: 1 })
    await planner.dispatch({ type: 'addClass', classId: 100 })
    const duplicate = await planner.dispatch({ type: 'addClass', classId: 101 })
    expect(duplicate).toMatchObject({
      ok: false,
      error: { code: 'courseAlreadyHasClass', currentClassId: 100 },
    })
    await planner.dispatch({ type: 'replaceClass', classId: 101 })
    expect(await planner.getSnapshot()).toMatchObject({
      ok: true,
      value: { document: { classIds: [101] } },
    })
  })

  it('reports overlap as a warning in the snapshot', async () => {
    const planner = createInMemorySemesterPlanner({ staticData: data })
    await planner.dispatch({ type: 'selectStudyPeriod', studyPeriodId: 1 })
    await planner.dispatch({ type: 'addClass', classId: 100 })
    await planner.dispatch({ type: 'addClass', classId: 102 })
    expect(await planner.getSnapshot()).toMatchObject({
      ok: true,
      value: {
        conflicts: [
          { classId: 100, conflictingClassId: 102, dayOfWeek: 'MONDAY' },
        ],
      },
    })
  })
})
