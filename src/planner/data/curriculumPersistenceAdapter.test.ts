import { describe, expect, it, vi } from 'vitest'

import { persistCurriculumState } from './curriculumPersistenceAdapter'

const { createCurriculum, patchCurriculum } = vi.hoisted(() => ({
  createCurriculum: vi.fn(),
  patchCurriculum: vi.fn(),
}))

vi.mock('@/planner/data/curriculumPersistenceApi', () => ({
  createCurriculum,
  patchCurriculum,
  documentFromState: (state: {
    selection: { catalogProgramId?: string; specializationId?: string; languageId?: string }
    plan: {
      periods: ReadonlyArray<{ id: string; items: ReadonlyArray<{ courseId: string }> }>
      unallocatedCourseIds?: ReadonlyArray<string>
      planningStart?: { year: number; semester: 1 | 2; semesterNumber?: number }
      currentPeriodId?: string
    }
  }, name = 'Meu planejamento') => ({
    name,
    selection: {
      catalogProgramId: state.selection.catalogProgramId ?? null,
      specializationId: state.selection.specializationId ?? null,
      languageId: state.selection.languageId ?? null,
    },
    planningStart: state.plan.planningStart ?? null,
    currentPeriodId: state.plan.currentPeriodId ?? null,
    periods: state.plan.periods.map((period, index) => ({
      id: period.id,
      position: index + 1,
    })),
    courses: [
      ...state.plan.periods.flatMap((period) =>
        period.items.map((item) => ({
          courseId: item.courseId,
          periodId: period.id,
        })),
      ),
      ...(state.plan.unallocatedCourseIds ?? []).map((courseId) => ({
        courseId,
        periodId: null,
      })),
    ],
  }),
  patchBodyFromState: vi.fn(() => ({ periods: { upsert: [] } })),
}))

describe('persistCurriculumState', () => {
  it('creates the document before linking courses to persisted periods', async () => {
    createCurriculum.mockResolvedValue({
      id: 10,
      name: 'Meu planejamento',
      periods: [
        { id: '50', position: 1 },
        { id: '51', position: 2 },
      ],
      courses: [],
    })
    patchCurriculum.mockResolvedValue({ id: 10, name: 'Meu planejamento' })

    await persistCurriculumState({
      studentId: 1,
      state: {
        revision: 0,
        selection: {},
        plan: {
          periods: [
            { id: 'first', items: [{ courseId: '101' }] },
            { id: 'second', items: [{ courseId: '102' }] },
          ],
          unallocatedCourseIds: ['103'],
        },
        academicRecord: { completedCourseIds: [] },
      } as never,
      getAccessToken: () => Promise.resolve('token'),
    })

    expect(createCurriculum).toHaveBeenCalledTimes(1)
    expect(patchCurriculum).toHaveBeenCalledWith(
      1,
      10,
      {
        courses: {
          upsert: [
            { courseId: 101, periodId: 50 },
            { courseId: 102, periodId: 51 },
            { courseId: 103, periodId: null },
          ],
        },
      },
      expect.any(Function),
    )
  })
})
