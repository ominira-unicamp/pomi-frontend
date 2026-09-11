import assert from 'node:assert/strict'
import test from 'node:test'
import { createPomiSdk } from './generatedClient.js'
import { ApiError, isProblemType } from './errors.js'

function sdkWith(
  fetcher: typeof fetch,
  getAccessToken?: () => Promise<string>,
) {
  return createPomiSdk({
    dataApiUrl: 'https://data.example.test',
    appApiUrl: 'https://app.example.test',
    fetch: fetcher,
    getAccessToken,
  })
}

test('executes a generated Data operation with structured query parameters', async () => {
  const requests: Array<{ url: string; method: string }> = []
  const sdk = sdkWith(async (input, init) => {
    requests.push({ url: String(input), method: init?.method ?? 'GET' })
    return new Response(JSON.stringify({ data: [], quantity: 0, total: 0 }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  })

  const page = await sdk.data.listCourses({
    page: 2,
    filter: { credits: { gte: 4 } },
  })

  assert.deepEqual(page, { data: [], quantity: 0, total: 0 })
  assert.equal(requests[0]?.method, 'GET')
  assert.match(
    requests[0]?.url ?? '',
    /^https:\/\/data\.example\.test\/courses\?/,
  )
  assert.match(requests[0]?.url ?? '', /filter%5Bcredits%5D%5Bgte%5D=4/)
})

test('sends App request bodies and bearer authentication for 201 responses', async () => {
  const requests: Array<{ url: string; init?: RequestInit }> = []
  const sdk = sdkWith(
    async (input, init) => {
      requests.push({ url: String(input), init })
      return new Response(JSON.stringify({ id: 1 }), {
        status: 201,
        headers: { 'content-type': 'application/json' },
      })
    },
    async () => 'token',
  )

  const result = await sdk.app.createStudentAbsences({
    sid: '7',
    body: {
      courseAttemptId: 2,
      classScheduleId: 3,
      date: '2026-08-20',
    },
  })

  assert.deepEqual(result, { id: 1 })
  assert.equal(requests[0]?.url, 'https://app.example.test/student/7/absences')
  assert.equal(requests[0]?.init?.method, 'POST')
  assert.equal(
    new Headers(requests[0]?.init?.headers).get('Authorization'),
    'Bearer token',
  )
  assert.equal(
    requests[0]?.init?.body,
    JSON.stringify({
      courseAttemptId: 2,
      classScheduleId: 3,
      date: '2026-08-20',
    }),
  )
})

test('prefers per-call authentication context over the client token', async () => {
  let authorization: string | null = null
  const sdk = sdkWith(
    async (_input, init) => {
      authorization = new Headers(init?.headers).get('Authorization')
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    },
    async () => 'client-token',
  )

  await sdk.app.listStudentFeedbackReports(
    { sid: '7' },
    { getAccessToken: async () => 'call-token' },
  )

  assert.equal(authorization, 'Bearer call-token')
})

test('returns undefined for documented 204 responses', async () => {
  const sdk = sdkWith(
    async () => new Response(null, { status: 204 }),
    async () => 'token',
  )
  const result = await sdk.app.updateMeBotGrants({
    botAuthUserId: '8',
    body: { capabilities: ['STUDENT_PROFILE_READ'] },
  })
  assert.equal(result, undefined)
})

test('rejects a missing required request body before fetching', async () => {
  let fetched = false
  const sdk = sdkWith(
    async () => {
      fetched = true
      return new Response(null, { status: 204 })
    },
    async () => 'token',
  )

  await assert.rejects(
    (sdk.app.createStudentAbsences as (input: unknown) => Promise<unknown>)({
      sid: '7',
    }),
    /requires a request body/,
  )
  assert.equal(fetched, false)
})

test('throws a typed ApiError with the problem body', async () => {
  const sdk = sdkWith(
    async () =>
      new Response(
        JSON.stringify({
          type: 'urn:pomi:problem:invalid-request',
          title: 'Dados da requisição inválidos',
          status: 400,
          detail: 'invalid',
          fields: [],
        }),
        {
          status: 400,
          headers: { 'content-type': 'application/problem+json' },
        },
      ),
  )

  await assert.rejects(sdk.data.listCourses({ page: 1 }), (error: unknown) => {
    assert.ok(error instanceof ApiError)
    assert.equal(error.status, 400)
    assert.ok(isProblemType(error, 'urn:pomi:problem:invalid-request'))
    assert.ok(error.problem)
    assert.equal(error.problem.detail, 'invalid')
    return true
  })
})

test('preserves native network and JSON decoding failures', async () => {
  const network = new Error('offline')
  await assert.rejects(
    sdkWith(async () => Promise.reject(network)).data.listCourses({ page: 1 }),
    network,
  )
  await assert.rejects(
    sdkWith(
      async () =>
        new Response('not-json', {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }),
    ).data.listCourses({ page: 1 }),
    SyntaxError,
  )
})

test('throws for missing path parameters and missing authentication', async () => {
  const sdk = sdkWith(async () => new Response('{}', { status: 200 }))
  await assert.rejects(sdk.data.getCourses({} as never), TypeError)
  await assert.rejects(
    sdk.app.listStudentAbsences({ sid: '7' }),
    /Authentication is required/,
  )
})

test('exposes expressive course operations and follows generated pagination metadata', async () => {
  const requests: string[] = []
  const sdk = sdkWith(async (input) => {
    const url = String(input)
    requests.push(url)
    const secondPage = url.includes('page=2')
    return new Response(
      JSON.stringify({
        data: [{ id: secondPage ? 2 : 1 }],
        quantity: 1,
        total: 2,
        _paths: { next: secondPage ? null : '/courses?page=2', prev: null },
      }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    )
  })

  const courses = await sdk.data.courses.listAll({
    filter: { credits: { gte: 4 } },
  })

  assert.deepEqual(courses, [{ id: 1 }, { id: 2 }])
  assert.match(requests[0] ?? '', /page=1/)
  assert.match(requests[0] ?? '', /pageSize=20/)
  assert.equal(requests[1], 'https://data.example.test/courses?page=2')
  assert.equal(sdk.data.courses.list.meta.sdk?.resource, 'courses')
})

test('maps expressive nested resources to operational requests', async () => {
  const requests: Array<{ url: string; init?: RequestInit }> = []
  const sdk = sdkWith(
    async (input, init) => {
      requests.push({ url: String(input), init })
      return new Response(JSON.stringify({ id: 8 }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    },
    async () => 'token',
  )

  await sdk.app.periodPlannings.update(7, 8, { visibility: 'PUBLIC' })
  await sdk.app.courseAttempts.update(7, 9, { grade: 8.5 })

  assert.equal(
    requests[0]?.url,
    'https://app.example.test/student/7/period-plannings/8',
  )
  assert.equal(
    requests[1]?.url,
    'https://app.example.test/student/7/course-attempts/9',
  )
  assert.equal(
    new Headers(requests[0]?.init?.headers).get('Authorization'),
    'Bearer token',
  )
  assert.ok(
    sdk.app.courseAttempts.update.problemTypes.includes(
      'urn:pomi:problem:invalid-student-course-attempt',
    ),
  )
})

test('provides the SDK-level problem guard', async () => {
  const sdk = sdkWith(
    async () =>
      new Response(
        JSON.stringify({
          type: 'urn:pomi:problem:invalid-request',
          title: 'Invalid',
          status: 400,
          detail: 'invalid',
        }),
        {
          status: 400,
          headers: { 'content-type': 'application/problem+json' },
        },
      ),
  )

  await assert.rejects(sdk.data.courses.list(), (error: unknown) =>
    sdk.errors.is(error, 'urn:pomi:problem:invalid-request'),
  )
})
