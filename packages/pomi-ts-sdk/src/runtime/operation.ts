export type ApiTarget = 'app' | 'data'
export type AuthenticationMode = 'public' | 'required'

export type GeneratedOperationResponse = Readonly<{
  status: number | string
  success: boolean
  contents: ReadonlyArray<Readonly<{ contentType: string; schema: unknown }>>
  problemTypes: ReadonlyArray<string>
}>

export type RuntimeOperationDefinition = Readonly<{
  operationId: string
  target: ApiTarget
  method: string
  path: string
  authentication: AuthenticationMode
  pathParameters: ReadonlyArray<string>
  queryParameters: ReadonlyArray<string>
  requestBody: Readonly<{
    required: boolean
    contentType: string
  }> | null
  responses: ReadonlyArray<
    Readonly<{
      status: number | string
      success: boolean
      contentTypes: ReadonlyArray<string>
    }>
  >
}>

export type RuntimeOperationTuple = readonly [
  method: string,
  path: string,
  authentication: AuthenticationMode,
  pathParameters: ReadonlyArray<string>,
  queryParameters: ReadonlyArray<string>,
  requestBody: readonly [required: boolean, contentType: string] | null,
  responses: ReadonlyArray<
    readonly [status: number | string, contentTypes: ReadonlyArray<string>]
  >,
]

export type GeneratedOperationDefinition = Readonly<{
  operationId: string
  target: ApiTarget
  method: string
  path: string
  authentication: AuthenticationMode
  tags: ReadonlyArray<string>
  summary: string | null
  description: string | null
  deprecated: boolean
  pathParameters: ReadonlyArray<string>
  queryParameters: ReadonlyArray<string>
  headerParameters: ReadonlyArray<string>
  cookieParameters: ReadonlyArray<string>
  requestBody: Readonly<{
    required: boolean
    contentType: string
    schema: unknown
  }> | null
  responses: ReadonlyArray<GeneratedOperationResponse>
  query: Readonly<{
    parameters: ReadonlyArray<unknown>
    filter: unknown
  }>
  sdk: Readonly<{
    resource: string
    action: 'list' | 'get' | 'create' | 'update' | 'delete'
    method?: string
    pathParameters?: Readonly<Record<string, string>>
  }> | null
  pagination:
    | Readonly<{
        strategy?: 'link'
        itemsField: string
        nextField: string
        pageParameter?: string
        pageSizeParameter?: string
        defaultPageSize: number
        maxPageSize: number
      }>
    | Readonly<{
        strategy: 'page-number'
        itemsField: string
        pageField: string
        pageSizeField: string
        totalField: string
        pageParameter?: string
        pageSizeParameter?: string
        defaultPageSize: number
        maxPageSize: number
      }>
    | null
}>
