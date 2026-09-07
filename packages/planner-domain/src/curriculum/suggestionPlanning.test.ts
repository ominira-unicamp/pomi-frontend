import { describe, expect, it } from 'vitest'

import { planningFromSuggestion } from './suggestionPlanning'
import type { CurriculumSuggestion } from './suggestionPlanning'

const suggestion: CurriculumSuggestion = {
  id: 'suggestion-1',
  catalogProgramId: 'program-1' as never,
  code: 'GERAL',
  name: 'Sugestão geral',
  type: 'GENERAL',
  semesters: [
    {
      semester: 1,
      electiveCredits: 0,
      courses: [
        { id: 'course-1' as never, code: 'AA001', name: 'A', credits: 2 },
      ],
    },
    {
      semester: 3,
      electiveCredits: 0,
      courses: [],
    },
    {
      semester: 5,
      electiveCredits: 0,
      courses: [
        { id: 'course-2' as never, code: 'AA002', name: 'B', credits: 2 },
      ],
    },
  ],
}

describe('planningFromSuggestion', () => {
  it('rebases every suggestion semester from the current planning start', () => {
    const result = planningFromSuggestion(suggestion, {
      year: 2027,
      semester: 2,
      semesterNumber: 4,
    })

    expect(result?.planningStart).toEqual({
      year: 2027,
      semester: 2,
      semesterNumber: 4,
    })
    expect(result?.periods).toEqual([
      { courses: ['course-1'] },
      { courses: [] },
      { courses: ['course-2'] },
    ])
  })

  it('rejects suggestions without semesters', () => {
    expect(
      planningFromSuggestion(
        { ...suggestion, semesters: [] },
        { year: 2027, semester: 1, semesterNumber: 1 },
      ),
    ).toBeUndefined()
  })
})
