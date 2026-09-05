import { afterEach, describe, expect, it, vi } from 'vitest'

import { listClassSchedulesByStudyPeriod } from './studentApi'

describe('listClassSchedulesByStudyPeriod', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('loads every page for the selected study period', async () => {
    const firstMeeting = {
      id: 1,
      classId: 10,
      classCode: 'A',
      courseCode: 'MC102',
      studyPeriodId: 20,
      dayOfWeek: 'MONDAY',
      start: '08:00',
      end: '10:00',
      roomCode: 'CB01',
    }
    const secondMeeting = { ...firstMeeting, id: 2, dayOfWeek: 'WEDNESDAY' }
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: [firstMeeting],
            _paths: { next: '/class-schedules?page=2' },
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ data: [secondMeeting], _paths: { next: null } }),
          { status: 200 },
        ),
      )
    vi.stubGlobal('fetch', fetchMock)

    const meetings = await listClassSchedulesByStudyPeriod(20)

    expect(meetings).toEqual([firstMeeting, secondMeeting])
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain('studyPeriodId=20')
    expect(String(fetchMock.mock.calls[1]?.[0])).toContain(
      '/class-schedules?page=2',
    )
  })
})
