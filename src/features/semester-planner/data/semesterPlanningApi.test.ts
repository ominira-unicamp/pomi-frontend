import { beforeEach, expect, it, vi } from 'vitest'
import { emptyGuide } from '@pomi/planner-domain/semester'
import {
  createSemesterPlanning,
  patchSemesterPlanning,
} from './semesterPlanningApi'

const sdk = vi.hoisted(() => ({ create: vi.fn(), update: vi.fn() }))
vi.mock('@/api/client', () => ({ pomiSdk: { app: { periodPlans: sdk } } }))
beforeEach(() => vi.clearAllMocks())

for (const mode of ['curriculum', 'program', 'none'] as const) {
  it(`sends both configurations when saving ${mode}`, () => {
    const guide = {
      ...emptyGuide(),
      mode,
      curriculum: {
        source: 'saved' as const,
        curriculumId: 3,
        suggestionId: null,
        suggestionCatalogProgramId: null,
      },
      program: {
        catalogProgramId: 4,
        catalogProgramVariantId: 5,
        languageId: null,
      },
      manualCourseIds: [9, 9],
    }
    const document = {
      name: 'Plano',
      studyPeriodId: 2,
      curriculumId: 3,
      classIds: [8],
      guide,
    }
    const token = () => Promise.resolve('token')
    createSemesterPlanning(7, document, token)
    patchSemesterPlanning(7, 1, document, token)
    const expected = {
      mode: mode.toUpperCase(),
      curriculum: { source: 'SAVED', saved: { curriculumId: 3 } },
      program: guide.program,
      manualCourseIds: [9],
    }
    expect(sdk.create.mock.calls[0][1].guide).toEqual(expected)
    expect(sdk.update.mock.calls[0][2].guide).toEqual(expected)
    expect(sdk.update.mock.calls[0][2].classes).toEqual({ set: [8] })
  })
}
