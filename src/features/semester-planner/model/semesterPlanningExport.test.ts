import { describe, expect, it } from 'vitest'
import type { SemesterPlanningExportData } from '@/features/semester-planner/model/semesterPlanningExport'
import { buildSemesterPlanningExport } from '@/features/semester-planner/model/semesterPlanningExport'

export const exportFixture: SemesterPlanningExportData = {
  name: 'Meu semestre',
  period: {
    id: 1,
    year: 2027,
    yearPeriod: 'FIRST_SEMESTER',
    startDate: '2027-03-01',
  },
  courses: [
    { id: 1, code: 'MC102', name: 'Algoritmos e programação', credits: 6 },
    { id: 2, code: 'MA111', name: 'Cálculo', credits: 4 },
    { id: 3, code: 'F101', name: 'Física', credits: 4 },
  ],
  classes: [1, 2, 3].map((id) => ({
    id,
    courseId: id,
    courseCode: ['MC102', 'MA111', 'F101'][id - 1],
    code: 'A',
    professors: [],
  })),
  meetings: [
    {
      id: 1,
      classId: 1,
      dayOfWeek: 'MONDAY',
      start: '08:30',
      end: '10:00',
      roomCode: 'PB01',
    },
    {
      id: 2,
      classId: 2,
      dayOfWeek: 'MONDAY',
      start: '09:00',
      end: '10:30',
      roomCode: 'PB02',
    },
  ],
}

describe('semester planning export', () => {
  it('uses only selected classes, rounds the hours and preserves classes without schedules', () => {
    const model = buildSemesterPlanningExport({
      ...exportFixture,
      meetings: [
        ...exportFixture.meetings,
        {
          ...exportFixture.meetings[0],
          id: 99,
          classId: 99,
          start: '07:00',
          end: '23:00',
        },
      ],
    })
    expect([model.startHour, model.endHour]).toEqual([8, 11])
    expect(model.credits).toBe(14)
    expect(model.entries[2].meetings).toEqual([])
    expect(model.blocks).toHaveLength(2)
  })
  it('separates simultaneous meetings into lanes and lists each conflict once', () => {
    const model = buildSemesterPlanningExport({
      ...exportFixture,
      meetings: [
        ...exportFixture.meetings,
        {
          ...exportFixture.meetings[0],
          id: 3,
          classId: 3,
          start: '09:30',
          end: '10:00',
        },
      ],
    })
    expect(
      model.blocks.map((block) => [block.lane, block.lanes, block.hasConflict]),
    ).toEqual([
      [0, 3, true],
      [1, 3, true],
      [2, 3, true],
    ])
    expect(model.conflicts).toHaveLength(3)
  })
  it('reuses lanes for touching intervals and starts a new group after a gap', () => {
    const model = buildSemesterPlanningExport({
      ...exportFixture,
      meetings: [
        exportFixture.meetings[0],
        { ...exportFixture.meetings[1], start: '10:00', end: '11:00' },
        {
          ...exportFixture.meetings[0],
          id: 3,
          classId: 3,
          start: '12:00',
          end: '13:00',
        },
      ],
    })
    expect(
      model.blocks.every((block) => block.lanes === 1 && !block.hasConflict),
    ).toBe(true)
    expect(model.conflicts).toEqual([])
  })
  it('keeps Saturday and includes Sunday when data contains it', () => {
    const model = buildSemesterPlanningExport({
      ...exportFixture,
      meetings: [
        {
          ...exportFixture.meetings[0],
          dayOfWeek: 'SATURDAY',
          start: '22:00',
          end: '23:00',
        },
        { ...exportFixture.meetings[1], dayOfWeek: 'SUNDAY' },
      ],
    })
    expect(model.days.map(([day]) => day)).toContain('SUNDAY')
    expect(model.blocks[0].dayIndex).toBe(5)
    expect(model.endHour).toBe(23)
  })
  it('does not report meetings of the same class as a conflict', () => {
    const model = buildSemesterPlanningExport({
      ...exportFixture,
      meetings: [
        exportFixture.meetings[0],
        { ...exportFixture.meetings[0], id: 99 },
      ],
    })
    expect(model.conflicts).toEqual([])
    expect(model.blocks.every((block) => !block.hasConflict)).toBe(true)
  })
  it('does not invent scheduled blocks when no meetings are registered', () => {
    const model = buildSemesterPlanningExport({
      ...exportFixture,
      meetings: [],
    })
    expect(model.blocks).toEqual([])
    expect(model.entries.every((item) => !item.meetings.length)).toBe(true)
  })
})
