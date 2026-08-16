import { describe, expect, it } from 'vitest'

import { expectApiResponse } from './errors'

describe('API errors', () => {
  it('preserves backend problem details and validation fields', async () => {
    const response = Response.json(
      {
        type: 'urn:pomi:problem:unprocessable-entity',
        title: 'Não foi possível concluir a ação',
        status: 422,
        detail: 'O período informado não existe.',
        fields: [
          { code: 'not-found', path: ['periodId'], message: 'Não encontrado' },
        ],
      },
      { status: 422 },
    )

    await expect(expectApiResponse(response)).rejects.toMatchObject({
      name: 'ApiError',
      status: 422,
      message: 'O período informado não existe.',
      problem: {
        type: 'urn:pomi:problem:unprocessable-entity',
        fields: [
          { code: 'not-found', path: ['periodId'], message: 'Não encontrado' },
        ],
      },
    })
  })

  it('falls back to the HTTP status for non-JSON errors', async () => {
    await expect(
      expectApiResponse(new Response('gateway failure', { status: 502 })),
    ).rejects.toMatchObject({
      name: 'ApiError',
      status: 502,
      message: 'API request failed: 502',
    })
  })
})
