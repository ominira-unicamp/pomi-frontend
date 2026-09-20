import type { OpenAPI3 } from 'openapi-typescript'

export type ApiTarget = 'app' | 'data'
export type JsonObject = Record<string, unknown>

export type SdkOperationMetadata = {
  resource: string
  action: 'list' | 'get' | 'create' | 'update' | 'delete'
  method: string
  pathParameters?: Readonly<Record<string, string>>
}

export type SdkSchemaMetadata = {
  kind:
    | 'entity'
    | 'value-object'
    | 'projection'
    | 'input'
    | 'page'
    | 'problem'
    | 'transport'
  publicName: string
  transportFields?: ReadonlyArray<string>
  identityFields?: ReadonlyArray<string>
  readOnlyFields?: ReadonlyArray<string>
  relations?: Readonly<
    Record<
      string,
      Readonly<{
        resource: string
        cardinality: 'one' | 'many'
        nullable?: boolean
      }>
    >
  >
  domainExports?: Readonly<Record<string, string>>
  generate?: boolean
}

export type PaginationMetadata = {
  defaultMode: 'page' | 'all'
  defaultPageSize: number
  maxPageSize?: number
  allowAll: boolean
}

export type SortMetadata = {
  version: 1
  fields: ReadonlyArray<string>
  default: string
}

export type OpenApiParameter = JsonObject & {
  name?: string
  in?: string
  required?: boolean
  description?: string
  schema?: unknown
  style?: string
  explode?: boolean
  'x-pomi-filters'?: unknown
  'x-pomi-sort'?: SortMetadata
}

export type OpenApiResponse = JsonObject & {
  content?: Readonly<Record<string, { schema?: unknown }>>
}

export type OpenApiRequestBody = JsonObject & {
  required?: boolean
  content?: Readonly<Record<string, { schema?: unknown }>>
}

export type OpenApiOperation = JsonObject & {
  operationId?: string
  summary?: string
  description?: string
  deprecated?: boolean
  tags?: Array<string>
  security?: ReadonlyArray<Record<string, Array<string>>>
  parameters?: ReadonlyArray<OpenApiParameter>
  requestBody?: OpenApiRequestBody
  responses?: Readonly<Record<string, OpenApiResponse>>
  'x-pomi-sdk'?: SdkOperationMetadata | false
  'x-pomi-pagination'?: PaginationMetadata
}

export type OpenApiSchema = JsonObject & {
  'x-pomi-schema'?: SdkSchemaMetadata
}

export type OpenApiDocument = OpenAPI3 & {
  paths?: Readonly<Record<string, Readonly<Record<string, unknown>>>>
  security?: ReadonlyArray<Record<string, Array<string>>>
  components?: OpenAPI3['components'] & {
    schemas?: Readonly<Record<string, OpenApiSchema>>
  }
}

export type OperationModel = {
  target: ApiTarget
  path: string
  method: string
  operation: OpenApiOperation
  document: OpenApiDocument
}

export type SdkOperationModel = OperationModel & {
  operation: OpenApiOperation & { 'x-pomi-sdk': SdkOperationMetadata }
}

export function isSdkOperation(
  operation: OperationModel,
): operation is SdkOperationModel {
  return Boolean(operation.operation['x-pomi-sdk'])
}

export type ResourceModel = {
  name: string
  operations: ReadonlyArray<SdkOperationModel>
}

export type SdkTargetModel = {
  target: ApiTarget
  sourcePath: string
  document: OpenApiDocument
  operations: ReadonlyArray<OperationModel>
  resources: ReadonlyArray<ResourceModel>
  schemas: ReadonlyArray<Readonly<{ name: string; schema: OpenApiSchema }>>
}

export function buildSdkTargetModel(
  target: ApiTarget,
  sourcePath: string,
  document: OpenApiDocument,
  operations: ReadonlyArray<OperationModel>,
): SdkTargetModel {
  const grouped = new Map<string, Array<SdkOperationModel>>()
  for (const operation of operations.filter(isSdkOperation)) {
    const resource = operation.operation['x-pomi-sdk'].resource
    grouped.set(resource, [...(grouped.get(resource) ?? []), operation])
  }
  return {
    target,
    sourcePath,
    document,
    operations,
    resources: [...grouped].map(([name, resourceOperations]) => ({
      name,
      operations: resourceOperations,
    })),
    schemas: Object.entries(document.components?.schemas ?? {}).map(
      ([name, schema]) => ({ name, schema }),
    ),
  }
}
