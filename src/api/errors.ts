export type ApiProblemField = Readonly<{
  code: string
  path: ReadonlyArray<string>
  message: string
}>

export type ApiProblemDetails = Readonly<{
  type: string
  title: string
  status: number
  detail: string
  instance?: string
  fields?: ReadonlyArray<ApiProblemField>
}>

export class ApiError extends Error {
  readonly problem?: ApiProblemDetails

  constructor(
    readonly status: number,
    problem?: ApiProblemDetails,
  ) {
    super(problem?.detail ?? `API request failed: ${status}`)
    this.name = 'ApiError'
    this.problem = problem
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseProblem(value: unknown): ApiProblemDetails | undefined {
  if (
    !isRecord(value) ||
    typeof value.type !== 'string' ||
    typeof value.title !== 'string' ||
    typeof value.status !== 'number' ||
    typeof value.detail !== 'string'
  ) {
    return undefined
  }
  const fields = Array.isArray(value.fields)
    ? value.fields.filter(
        (field): field is ApiProblemField =>
          isRecord(field) &&
          typeof field.code === 'string' &&
          Array.isArray(field.path) &&
          field.path.every((part) => typeof part === 'string') &&
          typeof field.message === 'string',
      )
    : undefined
  return {
    type: value.type,
    title: value.title,
    status: value.status,
    detail: value.detail,
    ...(typeof value.instance === 'string' ? { instance: value.instance } : {}),
    ...(fields ? { fields } : {}),
  }
}

export async function throwApiError(response: Response): Promise<never> {
  let problem: ApiProblemDetails | undefined
  try {
    problem = parseProblem(await response.clone().json())
  } catch {
    problem = undefined
  }
  throw new ApiError(response.status, problem)
}

export async function expectApiResponse(response: Response): Promise<void> {
  if (!response.ok) await throwApiError(response)
}
