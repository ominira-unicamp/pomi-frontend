export type ApiTarget = 'app' | 'data'
export type AuthenticationMode = 'public' | 'required'

export type GeneratedOperationResponse = Readonly<{
  status: number | string
  success: boolean
  contents: ReadonlyArray<Readonly<{ contentType: string; schema: unknown }>>
  problemTypes: ReadonlyArray<string>
}>

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
    pathParameters?: Readonly<Record<string, string>>
  }> | null
  pagination: Readonly<{
    itemsField: string
    nextField: string
    defaultPageSize: number
    maxPageSize: number
  }> | null
}>
