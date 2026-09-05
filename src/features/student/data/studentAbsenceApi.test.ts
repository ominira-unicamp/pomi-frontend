import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  createStudentAbsence,
  deleteStudentAbsence,
  listStudentAbsences,
} from '@/features/student/data/studentAbsenceApi'

const getAccessToken = vi.fn(() => Promise.resolve('access-token'))

describe('student absence API', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    getAccessToken.mockClear()
  })

  it('lists all absences for the student', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify([]), { status: 200 }))

    await expect(listStudentAbsences(7, getAccessToken)).resolves.toEqual([])
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/student/7/absences',
      expect.objectContaining({ cache: 'no-store' }),
    )
  })

  it('creates an absence with the occurrence identifiers and date', async () => {
    const absence = { id: 9, date: '2026-08-20' }
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify(absence), { status: 201 }))

    await expect(
      createStudentAbsence(
        7,
        {
          courseAttemptId: 11,
          classScheduleId: 50,
          date: '2026-08-20',
        },
        getAccessToken,
      ),
    ).resolves.toEqual(absence)
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/student/7/absences',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          courseAttemptId: 11,
          classScheduleId: 50,
          date: '2026-08-20',
        }),
      }),
    )
  })

  it('removes an absence by id', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status: 204 }))

    await deleteStudentAbsence(7, 9, getAccessToken)

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/student/7/absences/9',
      expect.objectContaining({ method: 'DELETE' }),
    )
  })
})
