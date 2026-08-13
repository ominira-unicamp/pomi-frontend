import { describe, expect, it } from 'vitest'

import { buildPlannerViewModel } from './viewModel'
import type {
  CourseId,
  CurriculumPlannerSnapshot,
  CurriculumPlannerStaticData,
  PlannerRevision,
  PlanningPeriodId,
} from '@pomi/planner-domain/curriculum'

const staticData = {
  courses: [
    {
      id: 'planned' as CourseId,
      code: 'MC102',
      name: 'Algoritmos',
      credits: 6,
    },
    { id: 'completed' as CourseId, code: 'MA111', name: 'Cálculo', credits: 6 },
  ],
  catalogPrograms: [],
} satisfies CurriculumPlannerStaticData

const snapshot = {
  revision: 'revision' as PlannerRevision,
  selection: {},
  plan: {
    currentPeriodId: 'period' as PlanningPeriodId,
    periods: [
      {
        id: 'period' as PlanningPeriodId,
        items: [{ type: 'course', courseId: 'planned' as CourseId }],
      },
    ],
  },
  academicRecord: {
    completedCourses: [
      { courseId: 'planned' as CourseId },
      { courseId: 'completed' as CourseId },
    ],
  },
} satisfies CurriculumPlannerSnapshot

describe('buildPlannerViewModel', () => {
  it('indexes courses once and displays planned completed courses only in their semester', () => {
    const view = buildPlannerViewModel(staticData, snapshot)
    expect(view.semesters[0]).toMatchObject({ credits: 6, current: true })
    expect(view.semesters[0]?.courses[0]).toMatchObject({ completed: true })
    expect(view.completedCourses.map((course) => course.id)).toEqual([
      'completed',
    ])
    expect(view.completedCredits).toBe(6)
    expect(view.courseOptions).toEqual([
      { value: 'planned', label: 'MC102 — Algoritmos (06 créditos)' },
      { value: 'completed', label: 'MA111 — Cálculo (06 créditos)' },
    ])
  })
})
