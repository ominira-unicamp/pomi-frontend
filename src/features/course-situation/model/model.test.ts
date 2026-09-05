import { describe, expect, it } from 'vitest'

import { groupCourseHistory, parseGrade } from './model'
import type { StudentCourseAttempt } from '@/features/student/data/studentApi'
import type { StudyPeriodYearPeriod } from '@/features/student/data/studyPeriod'

function attempt(
  id: number,
  year: number | null,
  yearPeriod?: StudyPeriodYearPeriod,
): StudentCourseAttempt {
  return {
    id,
    studentId: 1,
    courseId: id,
    studyPeriodId: year === null ? null : id,
    classId: null,
    evaluationMode: 'GRADE_AND_ATTENDANCE',
    status: 'APPROVED',
    grade: 8,
    createdAt: '',
    updatedAt: '',
    course: {
      id,
      code: `MC${id}`,
      name: `Disciplina ${id}`,
      credits: 4,
      unit: null,
    },
    studyPeriod: year === null ? null : { id, year, yearPeriod: yearPeriod! },
    class: null,
    _paths: {
      self: '',
      student: '',
      course: '',
      studyPeriod: null,
      class: null,
    },
  }
}

describe('course situation model', () => {
  it('groups history from newest to oldest and leaves unknown periods last', () => {
    const groups = groupCourseHistory([
      attempt(1, 2025, 'SECOND_SEMESTER'),
      attempt(2, null),
      attempt(3, 2026, 'FIRST_SEMESTER'),
      attempt(4, 2025, 'SECOND_SEMESTER'),
    ])

    expect(groups.map((group) => group.label)).toEqual([
      '2026s1',
      '2025s2',
      'Período não informado',
    ])
    expect(groups[1].attempts).toHaveLength(2)
  })

  it('normalizes decimal grades and validates the supported range', () => {
    expect(parseGrade('8,5')).toEqual({ numeric: 8.5, error: undefined })
    expect(parseGrade('11').error).toBe('Informe uma nota entre 0 e 10.')
  })
})
