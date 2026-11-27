import { describe, expect, it } from 'vitest'
import {
  evaluateSemesterPrerequisites,
  evaluateSemesterReservations,
} from './semesterEligibility'
import type {
  CourseId,
  CoursePrerequisiteRule,
  PrerequisiteItem,
} from '@pomi/planner-domain/curriculum'
import type { StudentCourseAttempt } from '@/features/student/data/studentApi'

const period = {
  id: 3,
  year: 2027,
  yearPeriod: 'FIRST_SEMESTER' as const,
  startDate: '2027-03-01',
}
const labels = new Map([
  [1, 'MC102'],
  [2, 'MA111'],
])
const course = (
  id: number,
  fulfillment: 'FULL' | 'PARTIAL' = 'FULL',
): PrerequisiteItem => ({
  target: { type: 'course', courseId: String(id) as CourseId, fulfillment },
})
const rules = (...groups: Array<Array<PrerequisiteItem>>): CoursePrerequisiteRule => ({
  courseId: '3' as CourseId,
  alternatives: groups.map((allOf, i) => ({ key: String(i), allOf })),
})
const attempt = (
  patch: Partial<StudentCourseAttempt> = {},
): StudentCourseAttempt =>
  ({
    id: 1,
    courseId: 1,
    status: 'APPROVED',
    grade: 7,
    evaluationMode: 'GRADE_AND_ATTENDANCE',
    studyPeriod: { id: 2, year: 2026, yearPeriod: 'SECOND_SEMESTER' },
    ...patch,
  }) as StudentCourseAttempt
function evaluate(
  rule = rules([course(1)]),
  attempts: Array<StudentCourseAttempt> | undefined = [attempt()],
) {
  return evaluateSemesterPrerequisites({
    rule,
    found: true,
    attempts,
    period,
    courseLabels: labels,
  })
}

describe('semester prerequisites', () => {
  it('requires all items in one alternative but accepts any satisfied alternative', () => {
    expect(evaluate(rules([course(1), course(2)])).status).toBe('pending')
    expect(evaluate(rules([course(1), course(2)], [course(1)])).status).toBe(
      'satisfied',
    )
  })
  it('distinguishes a course without requirements from one missing in the catalog', () => {
    expect(evaluate(rules()).label).toBe('Sem pré-requisitos')
    expect(
      evaluateSemesterPrerequisites({
        found: false,
        attempts: [],
        period,
        courseLabels: labels,
      }).status,
    ).toBe('unknown')
  })
  it.each([
    'APPROVED',
    'APPROVED_BY_ATTENDANCE',
    'APPROVED_BY_PROFICIENCY',
    'SUFFICIENT',
  ] as const)('accepts confirmed %s', (status) => {
    expect(evaluate(undefined, [attempt({ status, grade: null })]).status).toBe(
      'satisfied',
    )
  })
  it.each([2.9, 3, 4])(
    'evaluates partial requirement with final grade %s',
    (grade) => {
      expect(
        evaluate(rules([course(1, 'PARTIAL')]), [
          attempt({ status: 'FAILED_BY_GRADE', grade }),
        ]).status,
      ).toBe(grade >= 3 ? 'satisfied' : 'pending')
      expect(
        evaluate(rules([course(1)]), [
          attempt({ status: 'FAILED_BY_GRADE', grade }),
        ]).status,
      ).toBe('pending')
    },
  )
  it('never accepts attendance failure or enrolled courses', () => {
    for (const status of [
      'FAILED_BY_ATTENDANCE',
      'ENROLLED',
      'DROPPED',
    ] as const)
      expect(
        evaluate(rules([course(1, 'PARTIAL')]), [attempt({ status, grade: 4 })])
          .status,
      ).toBe('pending')
  })
  it('preserves uncertainty when grade, history, or period is missing', () => {
    expect(
      evaluate(rules([course(1, 'PARTIAL')]), [
        attempt({ status: 'FAILED_BY_GRADE', grade: null }),
      ]).status,
    ).toBe('unknown')
    expect(evaluate(undefined, [attempt({ studyPeriod: null })]).status).toBe(
      'unknown',
    )
    expect(
      evaluateSemesterPrerequisites({
        rule: rules([course(1)]),
        found: true,
        period,
        courseLabels: labels,
      }).status,
    ).toBe('unknown')
  })
  it('requires an earlier period and accepts a valid attempt despite later failures', () => {
    expect(
      evaluate(undefined, [
        attempt({
          studyPeriod: { id: 3, year: 2027, yearPeriod: 'FIRST_SEMESTER' },
        }),
      ]).status,
    ).toBe('pending')
    expect(
      evaluate(undefined, [
        attempt({
          studyPeriod: { id: 4, year: 2028, yearPeriod: 'FIRST_SEMESTER' },
        }),
      ]).status,
    ).toBe('pending')
    expect(
      evaluate(undefined, [
        attempt({ status: 'FAILED_BY_ATTENDANCE' }),
        attempt(),
      ]).status,
    ).toBe('satisfied')
  })
  it('keeps special and unresolved requirements explicit', () => {
    expect(
      evaluate(
        rules([
          {
            target: {
              type: 'special',
              requirementType: 'AUTHORIZATION',
              value: 0,
            },
          },
        ]),
      ).status,
    ).toBe('authorization')
    expect(
      evaluate(
        rules([
          {
            target: {
              type: 'special',
              requirementType: 'PROGRESSION_COEFFICIENT',
              value: 70,
            },
          },
        ]),
      ).status,
    ).toBe('unknown')
    expect(
      evaluate(
        rules([{ target: { type: 'unresolvedCourse', fulfillment: 'FULL' } }]),
      ).status,
    ).toBe('unknown')
  })
  it('does not let a known failing alternative hide an unresolved alternative', () => {
    expect(
      evaluate(
        rules(
          [course(2)],
          [{ target: { type: 'unresolvedCourse', fulfillment: 'FULL' } }],
        ),
      ).status,
    ).toBe('unknown')
  })
})

describe('semester reservations', () => {
  const programs = [{ id: 10, code: 34, name: 'Computação' }]
  it('compares Program IDs rather than codes or catalog program IDs', () => {
    expect(evaluateSemesterReservations(programs, 10).status).toBe('matched')
    expect(evaluateSemesterReservations(programs, 34).status).toBe('mismatch')
  })
  it('distinguishes empty, unavailable and missing academic profile', () => {
    expect(evaluateSemesterReservations([], 10).status).toBe('empty')
    expect(evaluateSemesterReservations(undefined, 10).status).toBe('unknown')
    expect(evaluateSemesterReservations(programs, null).label).toContain(
      'Defina seu curso',
    )
  })
})
