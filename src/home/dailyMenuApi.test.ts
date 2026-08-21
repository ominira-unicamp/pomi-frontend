import { describe, expect, it, vi } from 'vitest'

import { listDailyMenus } from '@/home/dailyMenuApi'

describe('daily menu API', () => {
  it('loads menus for the requested date range', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify([]), { status: 200 }))

    await expect(listDailyMenus('2026-08-21')).resolves.toEqual([])

    const [request] = fetchMock.mock.calls[0] as [string]
    const url = new URL(request)
    expect(url.pathname).toBe('/daily-menus')
    expect(url.searchParams.get('startDate')).toBe('2026-08-21')
    expect(url.searchParams.get('endDate')).toBe('2026-08-21')
  })
})
