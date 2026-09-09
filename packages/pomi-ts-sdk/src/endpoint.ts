export type ApiTarget = 'data' | 'app'
export type AuthenticationMode = 'public' | 'required'
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type InputKey<TInput> = keyof TInput & string

export type EndpointPathSegment<TInput> =
  | string
  | Readonly<{ parameter: InputKey<TInput> }>

export type EndpointPath<TInput> =
  | string
  | ReadonlyArray<EndpointPathSegment<TInput>>
  | Readonly<{ fromInput: InputKey<TInput> }>

export type QueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ReadonlyArray<string | number | boolean>

export type EndpointResponse<TOutput> =
  | Readonly<{
      kind: 'json'
      decode?: (value: unknown) => TOutput
    }>
  | Readonly<{ kind: 'empty' }>

export type EndpointDefinition<TInput, TOutput> = Readonly<{
  target: ApiTarget
  method: HttpMethod
  path: EndpointPath<TInput>
  authentication: AuthenticationMode
  query?: (input: TInput) => Readonly<Record<string, QueryValue>>
  body?: (input: TInput) => unknown
  response: EndpointResponse<TOutput>
}>

export type EndpointRegistry = Readonly<
  Record<string, EndpointDefinition<unknown, unknown>>
>

export type EndpointInput<TDefinition> =
  TDefinition extends EndpointDefinition<infer TInput, any> ? TInput : never

export type EndpointOutput<TDefinition> =
  TDefinition extends EndpointDefinition<any, infer TOutput> ? TOutput : never

export type EndpointRequestContext = Readonly<{
  getAccessToken?: () => Promise<string>
}>

export function pathParameter<TInput>(parameter: InputKey<TInput>) {
  return { parameter } as const
}

export function pathFromInput<TInput>(fromInput: InputKey<TInput>) {
  return { fromInput } as const
}

export function defineEndpoint<TInput, TOutput>(
  definition: EndpointDefinition<TInput, TOutput>,
) {
  return definition
}

type EmptyInput = Record<never, never>

type OperationOptions<TInput, TOutput> = Readonly<{
  query?: (input: TInput) => Readonly<Record<string, QueryValue>>
  body?: (input: TInput) => unknown
  decode?: (value: unknown) => TOutput
  response?: 'json' | 'empty'
}>

function joinPath(basePath: string, suffix: string) {
  const base = basePath === '/' ? '' : basePath.replace(/\/$/, '')
  const rest = suffix ? `/${suffix.replace(/^\//, '')}` : ''
  return `${base}${rest}` || '/'
}

class ApiInterface<
  TTarget extends ApiTarget,
  TAuthentication extends AuthenticationMode,
> {
  constructor(
    private readonly target: TTarget,
    private readonly authentication: TAuthentication,
    private readonly basePath: string,
  ) {}

  private operation<TInput, TOutput>(
    method: HttpMethod,
    suffix: string,
    options: OperationOptions<TInput, TOutput>,
    defaultResponse: 'json' | 'empty',
  ) {
    const responseKind = options.response ?? defaultResponse
    return defineEndpoint<TInput, TOutput>({
      target: this.target,
      method,
      path: joinPath(this.basePath, suffix),
      authentication: this.authentication,
      query: options.query,
      body: options.body,
      response:
        responseKind === 'empty'
          ? { kind: 'empty' }
          : { kind: 'json', decode: options.decode },
    })
  }

  get<TOutput, TInput = EmptyInput>(
    suffix = '',
    options: OperationOptions<TInput, TOutput> = {},
  ) {
    return this.operation<TInput, TOutput>('GET', suffix, options, 'json')
  }

  post<TOutput, TInput = EmptyInput>(
    suffix = '',
    options: OperationOptions<TInput, TOutput> = {},
  ) {
    return this.operation<TInput, TOutput>('POST', suffix, options, 'json')
  }

  put<TOutput, TInput = EmptyInput>(
    suffix = '',
    options: OperationOptions<TInput, TOutput> = {},
  ) {
    return this.operation<TInput, TOutput>('PUT', suffix, options, 'json')
  }

  patch<TOutput, TInput = EmptyInput>(
    suffix = '',
    options: OperationOptions<TInput, TOutput> = {},
  ) {
    return this.operation<TInput, TOutput>('PATCH', suffix, options, 'json')
  }

  remove<TInput = EmptyInput>(suffix = '') {
    return this.operation<TInput, void>('DELETE', suffix, {}, 'empty')
  }

  define<TDefinitions extends Record<string, EndpointDefinition<any, any>>>(
    definitions: TDefinitions,
  ) {
    return definitions
  }
}

function apiNamespace<
  TTarget extends ApiTarget,
  TAuthentication extends AuthenticationMode,
>(target: TTarget, authentication: TAuthentication) {
  return {
    interface(basePath: string) {
      return new ApiInterface(target, authentication, basePath)
    },
  }
}

export const dataApi = apiNamespace('data', 'public')
export const appApi = {
  public: apiNamespace('app', 'public'),
  authenticated: apiNamespace('app', 'required'),
}

function inputRecord<TInput>(input: TInput): Record<string, unknown> {
  if (typeof input !== 'object' || input === null) return {}
  return input as Record<string, unknown>
}

export function buildEndpointPath<TInput>(
  endpointPath: EndpointPath<TInput>,
  input: TInput,
) {
  const values = inputRecord(input)
  if (typeof endpointPath !== 'string' && 'fromInput' in endpointPath) {
    const value = values[endpointPath.fromInput]
    if (typeof value !== 'string' || value.length === 0) {
      throw new TypeError(`Missing endpoint path: ${endpointPath.fromInput}`)
    }
    return value
  }

  if (typeof endpointPath === 'string') {
    return endpointPath.replace(/:([A-Za-z][A-Za-z0-9_]*)/g, (_, parameter) => {
      const value = values[parameter]
      if (value === undefined || value === null || value === '') {
        throw new TypeError(`Missing path parameter: ${parameter}`)
      }
      return encodeURIComponent(String(value))
    })
  }

  return `/${endpointPath
    .map((segment) => {
      if (typeof segment === 'string') return segment
      const value = values[segment.parameter]
      if (value === undefined || value === null || value === '') {
        throw new TypeError(`Missing path parameter: ${segment.parameter}`)
      }
      return encodeURIComponent(String(value))
    })
    .join('/')}`
}

export function buildEndpointQuery(
  query: Readonly<Record<string, QueryValue>>,
) {
  const parameters = new URLSearchParams()
  for (const [name, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue
    if (Array.isArray(value)) {
      for (const item of value) parameters.append(name, String(item))
      continue
    }
    parameters.set(name, String(value))
  }
  return parameters.toString()
}

export function buildEndpointUrl<TInput>(
  definition: EndpointDefinition<TInput, unknown>,
  input: TInput,
) {
  const path = buildEndpointPath(definition.path, input)
  if (!definition.query) return path
  const query = buildEndpointQuery(definition.query(input))
  if (!query) return path
  return `${path}${path.includes('?') ? '&' : '?'}${query}`
}
