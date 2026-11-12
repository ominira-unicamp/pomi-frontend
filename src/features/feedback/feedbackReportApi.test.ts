import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  listAdminFeedbackReports,
  listUserFeedbackReports,
  submitAnonymousFeedbackReport,
  submitUserFeedbackReport,
  updateAdminFeedbackReport,
} from '@/features/feedback/feedbackReportApi'

const input = {
  kind: 'BUG' as const,
  target: { type: 'GENERAL' as const },
  title: 'Falha na página inicial',
  description: 'A página inicial não carrega depois de entrar no POMI.',
}

describe('feedbackReportApi', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('sends anonymous feedback through the public endpoint', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        Response.json(
          { createdAt: '2026-09-01T12:00:00.000Z' },
          { status: 201 },
        ),
      )
    vi.stubGlobal('fetch', fetchMock)

    await expect(submitAnonymousFeedbackReport(input)).resolves.toEqual({
      createdAt: '2026-09-01T12:00:00.000Z',
    })
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/feedback-reports'),
      expect.objectContaining({ method: 'POST', body: JSON.stringify(input) }),
    )
  })

  it('sends identified feedback to the student path with a bearer token', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        Response.json(
          { createdAt: '2026-09-01T12:00:00.000Z' },
          { status: 201 },
        ),
      )
    vi.stubGlobal('fetch', fetchMock)
    const getAccessToken = vi.fn().mockResolvedValue('access-token')

    await submitUserFeedbackReport(7, input, getAccessToken)

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/users/7/feedback-reports'),
      expect.objectContaining({ method: 'POST', body: JSON.stringify(input) }),
    )
    const [, init] = fetchMock.mock.calls[0]
    expect(new Headers(init.headers).get('Authorization')).toBe(
      'Bearer access-token',
    )
  })

  it('lists the authenticated student feedback reports', async () => {
    const reports = [
      {
        id: 3,
        kind: 'BUG',
        target: { type: 'GENERAL' },
        title: 'Falha na página inicial',
        description: 'A página inicial não carrega depois de entrar no POMI.',
        sourcePath: '/',
        status: 'OPEN',
        adminMessage: null,
        reporterUserId: 7,
        createdAt: '2026-09-01T12:00:00.000Z',
        updatedAt: '2026-09-01T12:00:00.000Z',
      },
    ] as const
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        data: reports,
        quantity: reports.length,
        total: reports.length,
        links: { next: null },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)
    const getAccessToken = vi.fn().mockResolvedValue('access-token')

    await expect(listUserFeedbackReports(7, getAccessToken)).resolves.toEqual(
      reports,
    )
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/users/7/feedback-reports'),
      expect.objectContaining({ cache: 'no-store' }),
    )
  })
})

describe('administrative feedback SDK adapters', () => {
  afterEach(() => vi.unstubAllGlobals())
  it('reads all feedback through the admin endpoint with authentication', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        data: [],
        quantity: 0,
        total: 0,
        links: { next: null },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)
    await expect(
      listAdminFeedbackReports(() => Promise.resolve('admin-token')),
    ).resolves.toEqual([])
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toContain('/admin/feedback-reports')
    expect(new Headers(init.headers).get('Authorization')).toBe(
      'Bearer admin-token',
    )
    expect(init.cache).toBe('no-store')
  })
  it('patches only the requested fields', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(Response.json({ id: 4, status: 'CLOSED' }))
    vi.stubGlobal('fetch', fetchMock)
    await updateAdminFeedbackReport(4, { status: 'CLOSED' }, () =>
      Promise.resolve('admin-token'),
    )
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/admin/feedback-reports/4'),
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ status: 'CLOSED' }),
      }),
    )
  })
})
