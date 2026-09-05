import { describe, expect, it } from 'vitest'

import type {
  StudentClassSchedule,
  StudentCourseAttempt,
} from '@/features/student/data/studentApi'
import type { StudentAbsence } from '@/features/student/data/studentAbsenceApi'
import {
  academicDateKey,
  findOccurrenceAbsence,
  occurrencesForDate,
  recentClassOccurrences,
} from '@/features/student/absences/studentAbsences'

const attempt: StudentCourseAttempt = {
  id: 11,
  studentId: 1,
  courseId: 20,
  studyPeriodId: 30,
  classId: 40,
  evaluationMode: 'GRADE_AND_ATTENDANCE',
  status: 'ENROLLED',
  grade: null,
  course: {
    id: 20,
    code: 'MC102',
    name: 'Algoritmos',
    credits: 6,
    unit: { id: 3, code: 'IC' },
  },
  studyPeriod: { id: 30, year: 2026, yearPeriod: 'SECOND_SEMESTER' },
  class: { id: 40, code: 'A', professors: [] },
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  _paths: {
    self: '/student/1/course-attempts/11',
    student: '/student/1',
    course: '/courses/20',
    studyPeriod: '/study-periods/30',
    class: '/classes/40',
  },
}

const meetings: ReadonlyArray<StudentClassSchedule> = [
  {
    id: 50,
    classId: 40,
    classCode: 'A',
    courseCode: 'MC102',
    studyPeriodId: 30,
    dayOfWeek: 'THURSDAY',
    start: '08:00',
    end: '10:00',
    roomCode: 'CB01',
  },
  {
    id: 51,
    classId: 40,
    classCode: 'A',
    courseCode: 'MC102',
    studyPeriodId: 30,
    dayOfWeek: 'THURSDAY',
    start: '10:00',
    end: '12:00',
    roomCode: 'CB02',
  },
]

describe('student absence occurrences', () => {
  it('uses the academic timezone when creating the date key', () => {
    expect(academicDateKey(new Date('2026-08-20T02:00:00.000Z'))).toBe(
      '2026-08-19',
    )
  })

  it('lists only the schedules compatible with a selected date', () => {
    const occurrences = occurrencesForDate(attempt, meetings, '2026-08-20')

    expect(occurrences.map((item) => item.classScheduleId)).toEqual([50, 51])
    expect(occurrencesForDate(attempt, meetings, '2026-08-21')).toEqual([])
  })

  it('generates recent occurrences without crossing the period start', () => {
    const occurrences = recentClassOccurrences({
      attempt,
      meetings,
      periodStartDate: '2026-08-10',
      today: '2026-08-20',
    })

    expect(occurrences.map((item) => `${item.date}:${item.start}`)).toEqual([
      '2026-08-20:08:00',
      '2026-08-20:10:00',
      '2026-08-13:08:00',
      '2026-08-13:10:00',
    ])
  })

  it('matches an absence by attempt, schedule and date', () => {
    const occurrence = occurrencesForDate(attempt, meetings, '2026-08-20')[0]
    const absence = {
      id: 60,
      studentCourseAttemptId: 11,
      classScheduleId: 50,
      date: '2026-08-20',
    } as StudentAbsence

    expect(findOccurrenceAbsence([absence], occurrence)).toBe(absence)
    expect(
      findOccurrenceAbsence([{ ...absence, date: '2026-08-13' }], occurrence),
    ).toBeUndefined()
  })
})
