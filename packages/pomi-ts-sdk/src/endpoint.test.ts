import { describe, expect, it, vi } from 'vitest'

import { appApi, dataApi } from './endpoint'
import { createPomiClient } from './client'
import { createPomiApi } from './api'

describe('declarative endpoint interfaces', () => {
  it('binds a data endpoint with path and query serialization', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ data: [] }))
    const client = createPomiClient({
      dataApiUrl: 'https://data.pomi.test',
      appApiUrl: 'https://app.pomi.test',
      fetch: fetchMock,
    })
    type Input = Readonly<{
      courseCode: string
      page: number
      active: boolean
      tags: ReadonlyArray<number>
    }>
    const courses = dataApi.interface('/courses/:courseCode')
    const api = client.bind(
      courses.define({
        list: courses.get<{ data: [] }, Input>('', {
          query: ({ page, active, tags }) => ({ page, active, tags }),
        }),
      }),
    )

    await api.list({
      courseCode: 'MC 102',
      page: 0,
      active: false,
      tags: [2, 5],
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://data.pomi.test/courses/MC%20102?page=0&active=false&tags=2&tags=5',
      {},
    )
  })

  it('translates the legacy course facade query to the current filter contract', async () => {
    const fetchMock = vi.fn().mockImplementation(() =>
      Response.json({
        data: [],
        quantity: 0,
        total: 0,
        _paths: { next: null, prev: null },
      }),
    )
    const api = createPomiApi({
      dataApiUrl: 'https://data.pomi.test',
      appApiUrl: 'https://app.pomi.test',
      fetch: fetchMock,
    })

    await api.courseCatalog.listCourses({
      q: 'MC 102',
      unitId: 4,
      catalogYear: 2025,
      tagId: 9,
      page: 1,
      pageSize: 20,
    })

    const url = new URL(fetchMock.mock.calls[0]?.[0] as string)
    expect(url.searchParams.get('page')).toBe('1')
    expect(url.searchParams.get('pageSize')).toBe('20')
    expect(url.searchParams.get('filter[code]')).toBe('MC 102')
    expect(url.searchParams.get('filter[unit][id]')).toBe('4')
    expect(url.searchParams.get('filter[catalogYear]')).toBe('2025')
    expect(url.searchParams.get('filter[tagId]')).toBe('9')
    expect(url.searchParams.has('q')).toBe(false)
  })

  it('translates legacy date range and nested schedule queries', async () => {
    const fetchMock = vi.fn().mockImplementation(() =>
      Response.json({
        data: [],
        quantity: 0,
        total: 0,
        _paths: { next: null, prev: null },
      }),
    )
    const api = createPomiApi({
      dataApiUrl: 'https://data.pomi.test',
      appApiUrl: 'https://app.pomi.test',
      fetch: fetchMock,
    })

    await api.dailyMenu.listDailyMenus({
      startDate: '2026-01-01',
      endDate: '2026-01-31',
    })
    await api.courseCatalog.listCourseSchedules(10, 20)

    const dailyMenuUrl = new URL(fetchMock.mock.calls[0]?.[0] as string)
    expect(dailyMenuUrl.searchParams.get('filter[date][gte]')).toBe(
      '2026-01-01',
    )
    expect(dailyMenuUrl.searchParams.get('filter[date][lte]')).toBe(
      '2026-01-31',
    )

    const schedulesUrl = new URL(fetchMock.mock.calls[1]?.[0] as string)
    expect(schedulesUrl.searchParams.get('page')).toBe('1')
    expect(schedulesUrl.searchParams.get('pageSize')).toBe('100')
    expect(schedulesUrl.searchParams.get('filter[course][id]')).toBe('10')
    expect(schedulesUrl.searchParams.get('filter[studyPeriod][id]')).toBe(
      '20',
    )
  })

  it('applies authentication and serializes JSON bodies', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ id: 4 }))
    const getAccessToken = vi.fn().mockResolvedValue('access-token')
    const client = createPomiClient({
      dataApiUrl: 'https://data.pomi.test',
      appApiUrl: 'https://app.pomi.test',
      fetch: fetchMock,
    })
    type Input = Readonly<{ studentId: number; name: string }>
    const students = appApi.authenticated.interface('/students/:studentId')
    const api = client.bind(
      students.define({
        update: students.patch<{ id: number }, Input>('', {
          body: ({ name }) => ({ name }),
        }),
      }),
    )

    await expect(
      api.update({ studentId: 7, name: 'Ada' }, { getAccessToken }),
    ).resolves.toEqual({ id: 4 })

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://app.pomi.test/students/7')
    expect(init).toMatchObject({
      method: 'PATCH',
      body: JSON.stringify({ name: 'Ada' }),
      cache: 'no-store',
    })
    expect(new Headers(init.headers).get('Authorization')).toBe(
      'Bearer access-token',
    )
    expect(new Headers(init.headers).get('Content-Type')).toBe(
      'application/json',
    )
  })

  it('returns undefined for bound remove operations', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 204 }))
    const client = createPomiClient({
      dataApiUrl: 'https://data.pomi.test',
      appApiUrl: 'https://app.pomi.test',
      getAccessToken: () => Promise.resolve('token'),
      fetch: fetchMock,
    })
    type Input = Readonly<{ studentId: number; absenceId: number }>
    const absences = appApi.authenticated.interface(
      '/student/:studentId/absences',
    )
    const api = client.bind(
      absences.define({
        remove: absences.remove<Input>('/:absenceId'),
      }),
    )

    await expect(api.remove({ studentId: 7, absenceId: 9 })).resolves.toBe(
      undefined,
    )
    expect(fetchMock).toHaveBeenCalledWith(
      'https://app.pomi.test/student/7/absences/9',
      expect.objectContaining({ method: 'DELETE' }),
    )
  })
})
