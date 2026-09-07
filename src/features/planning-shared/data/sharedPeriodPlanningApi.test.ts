import { beforeEach, describe, expect, it, vi } from 'vitest'

import { listSharedPeriodPlanningsForPerson } from './sharedPeriodPlanningApi'

const getAccessToken = vi.fn(() => Promise.resolve('access-token'))

describe('shared period planning API', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    getAccessToken.mockClear()
  })

  it('lists plans scoped to a public profile owner', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        new Response(
          JSON.stringify({ items: [], page: 1, pageSize: 20, total: 0 }),
          { status: 200 },
        ),
      )

    await listSharedPeriodPlanningsForPerson(
      7,
      'a375fdb0-45d9-4a79-8415-89fcb64157b6',
      getAccessToken,
    )

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(
        /\/student\/7\/shared-period-plannings\?page=1&pageSize=20&ownerPublicId=a375fdb0-45d9-4a79-8415-89fcb64157b6$/,
      ),
      expect.objectContaining({ cache: 'no-store' }),
    )
  })
})
