import { readFile } from 'node:fs/promises'
import { buildSdkTargetModel } from './model.js'
import type {
  ApiTarget,
  JsonObject,
  OpenApiDocument,
  OpenApiOperation,
  OperationModel,
} from './model.js'

const httpMethods = new Set([
  'get',
  'post',
  'put',
  'patch',
  'delete',
  'head',
  'options',
  'trace',
])

function isRecord(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parameterNames(operation: OpenApiOperation, location: string) {
  return (operation.parameters ?? [])
    .filter((parameter) => parameter.in === location)
    .flatMap((parameter) => (parameter.name ? [parameter.name] : []))
}

function operationEntries(target: ApiTarget, document: OpenApiDocument) {
  const entries: Array<OperationModel> = []
  for (const [path, item] of Object.entries(document.paths ?? {})) {
    for (const [method, value] of Object.entries(item)) {
      if (!httpMethods.has(method) || !isRecord(value)) continue
      entries.push({
        target,
        path,
        method,
        operation: value as OpenApiOperation,
        document,
      })
    }
  }
  return entries.sort((left, right) =>
    (left.operation.operationId ?? '').localeCompare(
      right.operation.operationId ?? '',
    ),
  )
}

function resolvedSchema(document: OpenApiDocument, schema: unknown): unknown {
  if (!isRecord(schema) || typeof schema.$ref !== 'string') return schema
  const prefix = '#/components/schemas/'
  return schema.$ref.startsWith(prefix)
    ? document.components?.schemas?.[schema.$ref.slice(prefix.length)]
    : schema
}

function schemaHasPath(
  document: OpenApiDocument,
  schema: unknown,
  path: string,
) {
  let current = resolvedSchema(document, schema)
  for (const part of path.split('.')) {
    current = resolvedSchema(document, current)
    if (!isRecord(current) || !isRecord(current.properties)) return false
    current = current.properties[part]
  }
  return current !== undefined
}

function successfulSchemas(entry: OperationModel) {
  return Object.entries(entry.operation.responses ?? {})
    .filter(([status]) => /^2\d\d$/.test(status))
    .flatMap(([, response]) =>
      Object.values(response.content ?? {}).map((content) => content.schema),
    )
}

function validateSort(entry: OperationModel) {
  const id = entry.operation.operationId!
  const parameters = (entry.operation.parameters ?? []).filter(
    (parameter) => parameter.in === 'query' && parameter.name === 'sort',
  )
  if (parameters.length === 0) return
  if (parameters.length !== 1)
    throw new Error(`Operation ${id} must declare exactly one sort parameter`)
  const parameter = parameters[0]
  const metadata = parameter['x-pomi-sort'] as unknown
  if (!isRecord(metadata) || metadata.version !== 1)
    throw new Error(
      `Sort parameter in operation ${id} requires supported x-pomi-sort metadata`,
    )
  if (!isRecord(parameter.schema) || parameter.schema.type !== 'string')
    throw new Error(
      `Sort parameter in operation ${id} must use a string wire schema`,
    )
  if (!Array.isArray(metadata.fields) || metadata.fields.length === 0)
    throw new Error(`Sort metadata in operation ${id} must declare fields`)
  const fields = new Set<string>()
  for (const field of metadata.fields) {
    if (
      typeof field !== 'string' ||
      !/^[A-Za-z_$][A-Za-z0-9_$]*(?:\.[A-Za-z_$][A-Za-z0-9_$]*)*$/u.test(
        field,
      ) ||
      fields.has(field)
    ) {
      throw new Error(`Invalid or duplicate sort field in operation ${id}`)
    }
    fields.add(field)
  }
  if (typeof metadata.default !== 'string' || metadata.default.length === 0)
    throw new Error(`Sort metadata in operation ${id} must declare a default`)
  const defaultFields = new Set<string>()
  for (const term of metadata.default.split(',')) {
    const parts = term.split(':')
    const [field, direction] = parts
    if (
      parts.length !== 2 ||
      !field ||
      !fields.has(field) ||
      (direction !== 'asc' && direction !== 'desc') ||
      defaultFields.has(field)
    ) {
      throw new Error(`Invalid default sort in operation ${id}`)
    }
    defaultFields.add(field)
  }
}

function validateOperation(entry: OperationModel) {
  const id = entry.operation.operationId!
  const sdk = entry.operation['x-pomi-sdk']
  if (sdk === false) {
    if (entry.operation.deprecated !== true)
      throw new Error(
        `Only deprecated operation ${id} may opt out of SDK generation`,
      )
    return
  }
  if (!sdk)
    throw new Error(`Missing or incomplete x-pomi-sdk in operation ${id}`)
  validateSort(entry)
  for (const identifier of [sdk.resource, sdk.method]) {
    if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/u.test(identifier))
      throw new Error(`Invalid SDK identifier ${identifier} in operation ${id}`)
  }
  const paths = parameterNames(entry.operation, 'path')
  const mappings = Object.entries(sdk.pathParameters ?? {})
  if (
    paths.length !== mappings.length ||
    paths.some((path) => !mappings.some(([wire]) => wire === path))
  )
    throw new Error(`Operation ${id} must map every path parameter`)
  const publicNames = new Set<string>()
  for (const [wireName, publicName] of mappings) {
    if (
      !paths.includes(wireName) ||
      !/^[A-Za-z_$][A-Za-z0-9_$]*$/u.test(publicName) ||
      publicNames.has(publicName)
    )
      throw new Error(`Invalid path parameter mapping in operation ${id}`)
    publicNames.add(publicName)
  }
  const pagination = entry.operation['x-pomi-pagination']
  if (!pagination) return
  if (sdk.action !== 'list')
    throw new Error(`Pagination requires list action in operation ${id}`)
  if (
    pagination.defaultPageSize < 1 ||
    (pagination.maxPageSize !== undefined &&
      pagination.maxPageSize < pagination.defaultPageSize)
  )
    throw new Error(`Invalid pagination limits in operation ${id}`)
  if (pagination.defaultMode === 'all' && !pagination.allowAll)
    throw new Error(
      `Pagination default all requires allowAll in operation ${id}`,
    )
  const queries = parameterNames(entry.operation, 'query')
  if (!queries.includes('page') || !queries.includes('pageSize'))
    throw new Error(`Paginated operation ${id} must expose page and pageSize`)
  for (const field of ['data', 'quantity', 'total', 'links.next']) {
    if (
      !successfulSchemas(entry).some((schema) =>
        schemaHasPath(entry.document, schema, field),
      )
    )
      throw new Error(
        `Pagination response field ${field} does not exist in operation ${id}`,
      )
  }
}

function validateSchemas(document: OpenApiDocument) {
  const publicNames = new Set<string>()
  for (const [name, schema] of Object.entries(
    document.components?.schemas ?? {},
  )) {
    const metadata = schema['x-pomi-schema']
    if (!metadata?.kind || !metadata.publicName)
      throw new Error(`Missing x-pomi-schema in ${name}`)
    if (metadata.generate !== false && publicNames.has(metadata.publicName))
      throw new Error(`Duplicate public schema name ${metadata.publicName}`)
    if (metadata.generate !== false) publicNames.add(metadata.publicName)
    const properties = isRecord(schema.properties) ? schema.properties : {}
    const fields = [
      ...(metadata.transportFields ?? []),
      ...(metadata.identityFields ?? []),
      ...(metadata.readOnlyFields ?? []),
      ...Object.keys(metadata.relations ?? {}),
    ]
    for (const field of fields)
      if (!(field in properties))
        throw new Error(
          `Schema ${name} metadata references missing field ${field}`,
        )
  }
}

export async function loadSpec(target: ApiTarget, sourcePath: string) {
  const document = JSON.parse(
    await readFile(sourcePath, 'utf8'),
  ) as OpenApiDocument
  if (!document.openapi.startsWith('3.'))
    throw new Error(`Expected an OpenAPI 3 document: ${sourcePath}`)
  const entries = operationEntries(target, document)
  if (entries.length === 0)
    throw new Error(`No HTTP operations found in ${sourcePath}`)
  const ids = new Set<string>()
  const methods = new Set<string>()
  for (const entry of entries) {
    const id = entry.operation.operationId
    if (!id)
      throw new Error(
        `Operation without operationId: ${entry.method} ${entry.path}`,
      )
    if (ids.has(id))
      throw new Error(`Duplicate operationId in ${target}: ${id}`)
    ids.add(id)
    validateOperation(entry)
    const sdk = entry.operation['x-pomi-sdk']
    if (!sdk) continue
    const key = `${sdk.resource}.${sdk.method}`
    if (methods.has(key))
      throw new Error(`Duplicate SDK operation in ${target}: ${key}`)
    methods.add(key)
  }
  validateSchemas(document)
  return buildSdkTargetModel(target, sourcePath, document, entries)
}
