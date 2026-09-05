import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  listStudentFeedbackReports,
  submitAnonymousFeedbackReport,
  submitStudentFeedbackReport,
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

    await submitStudentFeedbackReport(7, input, getAccessToken)

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/student/7/feedback-reports'),
      expect.objectContaining({ method: 'POST', body: JSON.stringify(input) }),
    )
    const [, init] = fetchMock.mock.calls[0]
    expect(new Headers(init.headers).get('Authorization')).toBe(
      'Bearer access-token',
    )
  })

  it('lists the authenticated student feedback reports', async () => {
    const reports = [{
      id: 3,
      kind: 'BUG',
      target: { type: 'GENERAL' },
      title: 'Falha na página inicial',
      description: 'A página inicial não carrega depois de entrar no POMI.',
      sourcePath: '/',
      status: 'OPEN',
      adminMessage: null,
      reporterStudentId: 7,
      createdAt: '2026-09-01T12:00:00.000Z',
      updatedAt: '2026-09-01T12:00:00.000Z',
    }] as const
    const fetchMock = vi.fn().mockResolvedValue(Response.json(reports))
    vi.stubGlobal('fetch', fetchMock)
    const getAccessToken = vi.fn().mockResolvedValue('access-token')

    await expect(listStudentFeedbackReports(7, getAccessToken)).resolves.toEqual(reports)
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/student/7/feedback-reports'),
      expect.objectContaining({ cache: 'no-store' }),
    )
  })
})
