import { describe, expect, it } from 'vitest'

import {
  parseSemesterPlanning,
  resolveSemesterPlanningImport,
  serializeSemesterPlanning,
} from './semesterPlanningTransfer'
import type { SemesterPlannerStaticData } from '../semester/semesterPlanner'

const data: SemesterPlannerStaticData = {
  studyPeriods: [
    {
      id: 1,
      year: 2026,
      yearPeriod: 'FIRST_SEMESTER',
      startDate: '2026-02-01T00:00:00.000Z',
    },
  ],
  courses: [{ id: 10, code: 'MC102', name: 'Algoritmos', credits: 6 }],
  classes: [
    { id: 100, code: 'A', courseId: 10, courseCode: 'MC102', professors: [] },
  ],
  meetings: [],
}

describe('semester planning transfer', () => {
  it('resolves a portable class reference by code when its id changed', () => {
    const file = serializeSemesterPlanning(
      {
        name: 'Meu horário',
        studyPeriodId: 1,
        curriculumId: null,
        classIds: [100],
        guide: {
          mode: 'none',
          curriculum: {
            source: null,
            curriculumId: null,
            suggestionId: null,
            suggestionCatalogProgramId: null,
          },
          program: {
            catalogProgramId: null,
            specializationId: null,
            languageId: null,
          },
          manualCourseIds: [],
        },
      },
      data,
    )!
    const portable = JSON.parse(JSON.stringify(file))
    portable.semesterPlanning.classes[0].classId = 999
    const parsed = parseSemesterPlanning(portable)!
    expect(resolveSemesterPlanningImport(parsed, data)).toMatchObject({
      document: { classIds: [100] },
      issues: [],
    })
  })
})
