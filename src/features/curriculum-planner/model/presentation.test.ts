import { describe, expect, it } from 'vitest'

import {
  curriculumPlannerErrorText,
  curriculumPlanningName,
  curriculumUpdatedAtLabel,
} from '@/features/curriculum-planner/model/presentation'

describe('curriculum planner presentation', () => {
  it('provides stable fallbacks for names and dates', () => {
    expect(curriculumPlanningName('  ', 12)).toBe('Planejamento 12')
    expect(curriculumPlanningName(undefined)).toBe('Planejamento sem nome')
    expect(curriculumUpdatedAtLabel('invalid')).toBe('Sem data de atualização')
  })

  it('translates planner errors', () => {
    expect(curriculumPlannerErrorText('duplicateCourse')).toBe(
      'Essa disciplina já está planejada em outro semestre.',
    )
  })
})
