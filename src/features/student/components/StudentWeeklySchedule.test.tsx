import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StudentWeeklySchedule } from './StudentWeeklySchedule'

describe('StudentWeeklySchedule', () => {
  it('shows one hour around the earliest and latest classes', () => {
    const { container } = render(
      <StudentWeeklySchedule
        meetings={[
          {
            id: 1,
            classId: 10,
            classCode: 'A',
            courseCode: 'MC102',
            studyPeriodId: 2,
            dayOfWeek: 'MONDAY',
            start: '08:00',
            end: '10:00',
            roomCode: 'CB01',
          },
          {
            id: 2,
            classId: 11,
            classCode: 'B',
            courseCode: 'MC202',
            studyPeriodId: 2,
            dayOfWeek: 'TUESDAY',
            start: '16:00',
            end: '18:00',
            roomCode: 'CB02',
          },
        ]}
      />,
    )

    expect(screen.getByText('07:00')).toBeTruthy()
    expect(screen.getByText('18:00')).toBeTruthy()
    expect(container.querySelector('[style]')?.getAttribute('style')).toBe(
      'height: 22rem;',
    )
    const meeting = container.querySelector('[title^="MC102"]')
    expect(meeting?.className).toContain('bg-secondary')
    expect(meeting?.className).not.toContain('opacity-')
  })
})
