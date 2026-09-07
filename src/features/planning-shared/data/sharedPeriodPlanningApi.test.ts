import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  copySharedPeriodPlanning,
  getPublicSharedPeriodPlanning,
  getSharedPeriodPlanningForStudent,
  listSharedPeriodPlanningsForPerson,
} from './sharedPeriodPlanningApi'

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

  it('fetches a public plan without an authorization header', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        new Response(JSON.stringify({ shareId: 'share-id' }), { status: 200 }),
      )

    await getPublicSharedPeriodPlanning('a375fdb0-45d9-4a79-8415-89fcb64157b6')

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(
        /\/shared-period-plannings\/a375fdb0-45d9-4a79-8415-89fcb64157b6$/,
      ),
      expect.objectContaining({ cache: 'no-store' }),
    )
    expect(getAccessToken).not.toHaveBeenCalled()
  })

  it('fetches a plan through the student access policy', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        new Response(JSON.stringify({ shareId: 'share-id' }), { status: 200 }),
      )

    await getSharedPeriodPlanningForStudent(
      7,
      'a375fdb0-45d9-4a79-8415-89fcb64157b6',
      getAccessToken,
    )

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(
        /\/student\/7\/shared-period-plannings\/a375fdb0-45d9-4a79-8415-89fcb64157b6$/,
      ),
      expect.objectContaining({ cache: 'no-store' }),
    )
    const requestInit = fetchMock.mock.calls[0]?.[1] as RequestInit
    expect(new Headers(requestInit.headers).get('Authorization')).toBe(
      'Bearer access-token',
    )
  })

  it('creates a private copy using only the shared period and classes', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        new Response(JSON.stringify({ id: 42 }), { status: 201 }),
      )

    await copySharedPeriodPlanning(
      7,
      {
        name: 'Horários ideais',
        studyPeriodId: 14,
        classes: [
          {
            id: 101,
            code: 'A',
            courseCode: 'MC102',
            courseCredits: 4,
            professors: [],
            classSchedules: [],
          },
        ],
      },
      getAccessToken,
    )

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/student\/7\/period-plannings$/),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          name: 'Cópia de Horários ideais',
          studyPeriodId: 14,
          classes: [101],
        }),
      }),
    )
  })
})
