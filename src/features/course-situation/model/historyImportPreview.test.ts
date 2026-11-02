import { describe, expect, it } from 'vitest'
import {
  historyImportPreview,
  selectedHistoryImport,
} from './historyImportPreview'
import type { StudentCourseAttempt } from '@/features/student/data/studentApi'
import type { StudentHistoryImport } from '@/features/student/historyImport/studentHistoryParser'

const value = {
  format: 'pomi-student-history',
  version: 1,
  student: { ra: '123456' },
  semesters: [
    {
      year: 2026,
      yearPeriod: 'FIRST_SEMESTER',
      courses: [
        {
          code: 'MC102',
          name: 'Algoritmos',
          credits: 6,
          grade: 8,
          status: 'APPROVED',
        },
      ],
    },
  ],
} as StudentHistoryImport
const attempt = {
  id: 1,
  course: { code: 'MC102' },
  status: 'APPROVED',
  grade: 8,
  studyPeriod: { year: 2026, yearPeriod: 'FIRST_SEMESTER' },
  class: null,
} as StudentCourseAttempt

describe('history import preview', () => {
  it('distinguishes new records from identical records and explicit updates', () => {
    expect(historyImportPreview(value, [])[0].kind).toBe('new')
    expect(historyImportPreview(value, [attempt])[0].kind).toBe('unchanged')
    expect(
      historyImportPreview(value, [{ ...attempt, grade: 7 }])[0].kind,
    ).toBe('conflict')
  })
  it('matches the course and period rather than another attempt of the same course', () => {
    expect(
      historyImportPreview(value, [
        {
          ...attempt,
          studyPeriod: { id: 2, year: 2025, yearPeriod: 'FIRST_SEMESTER' },
        },
      ])[0].kind,
    ).toBe('new')
  })
  it('requires manual review when several existing attempts match and rejects repeated input', () => {
    expect(
      historyImportPreview(value, [attempt, { ...attempt, id: 2 }])[0].kind,
    ).toBe('ambiguous')
    const repeated = {
      ...value,
      semesters: [value.semesters[0], value.semesters[0]],
    }
    expect(
      historyImportPreview(repeated, []).map((entry) => entry.kind),
    ).toEqual(['new', 'duplicate'])
    expect(
      selectedHistoryImport(repeated, new Set(['2026:FIRST_SEMESTER:MC102']))
        .semesters,
    ).toHaveLength(1)
  })
  it('sends only selected records and omits empty periods', () => {
    expect(selectedHistoryImport(value, new Set()).semesters).toEqual([])
    expect(
      selectedHistoryImport(value, new Set(['2026:FIRST_SEMESTER:MC102'])),
    ).toEqual(value)
  })
})
