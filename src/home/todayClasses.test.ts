import { describe, expect, it } from 'vitest'
import type { StudentClassSchedule } from '@/student/data/studentApi'

import {
  currentScheduleDay,
  currentStudyPeriodCode,
  dateFromAcademicDateKey,
  shiftAcademicDate,
  sortTodayMeetings,
  statusForTodayMeeting,
} from '@/home/todayClasses'

function meeting(id: number, start: string, end: string): StudentClassSchedule {
  return {
    id,
    classId: id,
    classCode: 'A',
    courseCode: `MC${id}`,
    studyPeriodId: 20,
    dayOfWeek: 'TUESDAY',
    start,
    end,
    roomCode: 'CB01',
  }
}

describe('today classes', () => {
  it('uses academic halves to identify the current study period', () => {
    expect(currentStudyPeriodCode(new Date('2026-06-30T15:00:00Z'))).toBe(
      '2026s1',
    )
    expect(currentStudyPeriodCode(new Date('2026-07-01T15:00:00Z'))).toBe(
      '2026s2',
    )
  })

  it('uses the academic timezone to identify the weekday', () => {
    expect(currentScheduleDay(new Date('2026-08-11T02:00:00Z'))).toBe('MONDAY')
  })

  it('moves between calendar dates without timezone shifts', () => {
    expect(shiftAcademicDate('2026-08-31', 1)).toBe('2026-09-01')
    expect(shiftAcademicDate('2026-01-01', -1)).toBe('2025-12-31')
    expect(currentScheduleDay(dateFromAcademicDateKey('2026-08-11'))).toBe(
      'TUESDAY',
    )
  })

  it('sorts meetings and identifies their state during the day', () => {
    const meetings = [
      meeting(3, '18:00', '20:00'),
      meeting(1, '08:00', '10:00'),
      meeting(2, '14:00', '16:00'),
      meeting(4, '20:00', '22:00'),
    ]
    const sorted = sortTodayMeetings(meetings)
    const now = new Date('2026-08-11T18:30:00Z')

    expect(sorted.map((item) => item.id)).toEqual([1, 2, 3, 4])
    expect(statusForTodayMeeting(sorted[0], sorted, now)).toBe('finished')
    expect(statusForTodayMeeting(sorted[1], sorted, now)).toBe('now')
    expect(statusForTodayMeeting(sorted[2], sorted, now)).toBe('next')
    expect(statusForTodayMeeting(sorted[3], sorted, now)).toBe('later')
  })
})
