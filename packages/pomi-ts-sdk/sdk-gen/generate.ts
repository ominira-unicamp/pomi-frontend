import { mkdtemp, readFile, readdir, rename, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import openapiTS, { astToString } from 'openapi-typescript'
import { Project, QuoteKind } from 'ts-morph'
import {
  buildSdkTargetModel,
  type ApiTarget,
  type JsonObject,
  type OpenApiDocument,
  type OpenApiOperation,
  type OpenApiResponse,
  type OperationModel as OperationEntry,
  type SdkTargetModel,
} from './model.js'

type DomainRegistry = {
  models: Map<string, string>
  transportFields: Map<string, ReadonlyArray<string>>
}

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const projectDirectory = resolve(scriptDirectory, '..')
const workspaceDirectory = resolve(projectDirectory, '../../..')
const specs = [
  {
    target: 'data' as const,
    path: resolve(
      process.env.DATA_OPENAPI_PATH ??
        process.env.OPENAPI_PATH ??
        resolve(workspaceDirectory, 'openapi.json'),
    ),
  },
  {
    target: 'app' as const,
    path: resolve(
      process.env.APP_OPENAPI_PATH ??
        resolve(
          workspaceDirectory,
          'pomi-backend/packages/app/app-openapi.json',
        ),
    ),
  },
]
const generatedDirectory = resolve(projectDirectory, 'src/generated')
const checkOnly = process.argv.includes('--check')
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

function operationEntries(
  target: ApiTarget,
  document: OpenApiDocument,
): Array<OperationEntry> {
  const entries: Array<OperationEntry> = []
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

function pathParameterType(entry: OperationEntry, wireName: string) {
  const parameter = (entry.operation.parameters ?? []).find(
    (candidate) => candidate.in === 'path' && candidate.name === wireName,
  )
  const schema = isRecord(parameter?.schema) ? parameter.schema : undefined
  if (schema?.type === 'integer' || schema?.type === 'number') return 'number'
  if (schema?.type === 'boolean') return 'boolean'
  return 'string'
}

function parameterNames(operation: OpenApiOperation, location: string) {
  return (operation.parameters ?? [])
    .filter((parameter) => parameter.in === location)
    .flatMap((parameter) => (parameter.name ? [parameter.name] : []))
}

function responseEntries(operation: OpenApiOperation, success: boolean) {
  return Object.entries(operation.responses ?? {}).filter(([status]) =>
    success ? /^2\d\d$/.test(status) : !/^2\d\d$/.test(status),
  )
}

function typeIndex(value: string) {
  return /^\d+$/.test(value) ? value : JSON.stringify(value)
}

function contentTypeIndex(value: string) {
  return `[${JSON.stringify(value)}]`
}

function contentTypeEntries(response: OpenApiResponse) {
  return Object.entries(response.content ?? {})
}

function schemaNameFromRef(schema: unknown) {
  if (!isRecord(schema) || typeof schema.$ref !== 'string') return undefined
  return schema.$ref.startsWith('#/components/schemas/')
    ? schema.$ref.slice('#/components/schemas/'.length)
    : undefined
}

function schemaAtRef(document: OpenApiDocument, schema: unknown) {
  const name = schemaNameFromRef(schema)
  return name ? document.components?.schemas?.[name] : undefined
}

function pageItemSchema(document: OpenApiDocument, schema: unknown) {
  const resolved = schemaAtRef(document, schema) ?? schema
  if (!isRecord(resolved) || !isRecord(resolved.properties)) return undefined
  const data = resolved.properties.data
  const paths = resolved.properties._paths
  if (!isRecord(data) || data.type !== 'array') return undefined
  if (
    !isRecord(paths) ||
    !isRecord(paths.properties) ||
    !('next' in paths.properties)
  ) {
    return undefined
  }
  return data.items
}

function modelNameForSchema(schemaName: string) {
  return schemaName.endsWith('Entity')
    ? schemaName.slice(0, -'Entity'.length)
    : schemaName
}

function domainTypeForSchema(
  document: OpenApiDocument,
  schema: unknown,
  registry: DomainRegistry,
): string | undefined {
  const refName = schemaNameFromRef(schema)
  if (refName) {
    const model = registry.models.get(refName)
    if (model) return `import('./domain.js').${model}`
    const item = pageItemSchema(document, schema)
    const itemType = item
      ? domainTypeForSchema(document, item, registry)
      : undefined
    return itemType ? `import('./domain.js').Page<${itemType}>` : undefined
  }
  if (isRecord(schema) && schema.type === 'array') {
    const itemType = domainTypeForSchema(document, schema.items, registry)
    return itemType ? `ReadonlyArray<${itemType}>` : undefined
  }
  const item = pageItemSchema(document, schema)
  const itemType = item
    ? domainTypeForSchema(document, item, registry)
    : undefined
  return itemType ? `import('./domain.js').Page<${itemType}>` : undefined
}

function createDomainRegistry(
  _target: ApiTarget,
  document: OpenApiDocument,
): DomainRegistry {
  const models = new Map<string, string>()
  const transportFields = new Map<string, ReadonlyArray<string>>()
  const names = new Map<string, string>()
  for (const [schemaName, schema] of Object.entries(
    document.components?.schemas ?? {},
  )) {
    if (Array.isArray(schema.enum)) continue
    const schemaMetadata = schema['x-pomi-schema']
    if (
      schemaMetadata?.kind === 'input' ||
      schemaMetadata?.kind === 'problem' ||
      schemaMetadata?.kind === 'transport'
    ) {
      continue
    }
    const modelName =
      schemaMetadata?.publicName ?? modelNameForSchema(schemaName)
    const existing = names.get(modelName)
    if (existing) {
      throw new Error(
        `Component schemas ${existing} and ${schemaName} map to the same SDK model ${modelName}`,
      )
    }
    names.set(modelName, schemaName)
    models.set(schemaName, modelName)
    const fields =
      schemaMetadata?.transportFields ??
      (isRecord(schema.properties)
        ? Object.keys(schema.properties).filter((field) => field === '_paths')
        : [])
    transportFields.set(schemaName, fields)
  }
  return { models, transportFields }
}

function operationSuccessType(
  operation: OpenApiOperation,
  operationType: string,
  document: OpenApiDocument,
  registry: DomainRegistry,
) {
  const types = responseEntries(operation, true).flatMap(
    ([status, response]) => {
      const contents = contentTypeEntries(response)
      if (contents.length === 0) return ['void']
      return contents.map(([contentType, content]) => {
        const domainType = domainTypeForSchema(
          document,
          content.schema,
          registry,
        )
        return (
          domainType ??
          `${operationType}['responses'][${typeIndex(status)}]['content']${contentTypeIndex(contentType)}`
        )
      })
    },
  )
  if (types.length === 0)
    throw new Error('Operation has no successful response')
  return [...new Set(types)].join(' | ')
}

function operationProblemType(
  operation: OpenApiOperation,
  operationType: string,
) {
  const types = responseEntries(operation, false).flatMap(
    ([status, response]) =>
      contentTypeEntries(response).map(
        ([contentType]) =>
          `${operationType}['responses'][${typeIndex(status)}]['content']${contentTypeIndex(contentType)}`,
      ),
  )
  return types.length > 0 ? [...new Set(types)].join(' | ') : 'never'
}

function removeGeneratedComments(value: string) {
  return value
    .replace(/\/\*\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .concat('\n')
}

function schemaRefs(schema: unknown): Array<string> {
  if (Array.isArray(schema)) return schema.flatMap(schemaRefs)
  if (!isRecord(schema)) return []
  const own =
    typeof schema.$ref === 'string' &&
    schema.$ref.startsWith('#/components/schemas/')
      ? [schema.$ref.slice('#/components/schemas/'.length)]
      : []
  return [...own, ...Object.values(schema).flatMap(schemaRefs)]
}

function problemTypeForSchema(schema: JsonObject | undefined) {
  if (!schema || !isRecord(schema.properties)) return undefined
  const type = schema.properties.type
  if (!isRecord(type) || !Array.isArray(type.enum)) return undefined
  return type.enum.find(
    (item): item is string =>
      typeof item === 'string' && item.startsWith('urn:pomi:problem:'),
  )
}

function problemTypesForResponse(
  response: OpenApiResponse,
  document: OpenApiDocument,
) {
  const schemas = document.components?.schemas ?? {}
  return [
    ...new Set(
      contentTypeEntries(response).flatMap(([, content]) =>
        schemaRefs(content.schema).flatMap((name) => {
          const type = problemTypeForSchema(schemas[name])
          return type ? [type] : []
        }),
      ),
    ),
  ]
}

function authenticationFor(
  operation: OpenApiOperation,
  document: OpenApiDocument,
) {
  const security = operation.security ?? document.security ?? []
  return security.length > 0 ? 'required' : 'public'
}

function requestBodyMetadata(operation: OpenApiOperation) {
  if (!operation.requestBody) return null
  const contentEntries = Object.entries(operation.requestBody.content ?? {})
  if (contentEntries.length === 0) return null
  const [contentType, content] = contentEntries[0]
  return {
    required: operation.requestBody.required === true,
    contentType,
    schema: content.schema ?? null,
  }
}

function responseMetadata(
  operation: OpenApiOperation,
  document: OpenApiDocument,
) {
  return Object.entries(operation.responses ?? {}).map(
    ([status, response]) => ({
      status: /^\d+$/.test(status) ? Number(status) : status,
      success: /^2\d\d$/.test(status),
      contents: contentTypeEntries(response).map(([contentType, content]) => ({
        contentType,
        schema: content.schema ?? null,
      })),
      problemTypes: /^2\d\d$/.test(status)
        ? []
        : problemTypesForResponse(response, document),
    }),
  )
}

function queryMetadata(operation: OpenApiOperation) {
  const parameters = (operation.parameters ?? []).filter(
    (parameter) => parameter.in === 'query' && parameter.name,
  )
  const filter = parameters.find((parameter) => parameter.name === 'filter')
  return {
    parameters: parameters.map((parameter) => ({
      name: parameter.name!,
      required: parameter.required === true,
      description: parameter.description ?? null,
      style: parameter.style ?? null,
      explode: parameter.explode ?? null,
      schema: parameter.schema ?? null,
    })),
    filter: filter?.['x-pomi-filters'] ?? null,
  }
}

function operationMetadata(entry: OperationEntry) {
  const { operation } = entry
  return {
    operationId: operation.operationId,
    target: entry.target,
    method: entry.method.toUpperCase(),
    path: entry.path,
    authentication: authenticationFor(operation, entry.document),
    tags: operation.tags ?? [],
    summary: operation.summary ?? null,
    description: operation.description ?? null,
    deprecated: operation.deprecated === true,
    pathParameters: parameterNames(operation, 'path'),
    queryParameters: parameterNames(operation, 'query'),
    headerParameters: parameterNames(operation, 'header'),
    cookieParameters: parameterNames(operation, 'cookie'),
    requestBody: requestBodyMetadata(operation),
    responses: responseMetadata(operation, entry.document),
    query: queryMetadata(operation),
    sdk: operation['x-pomi-sdk'] ?? null,
    pagination: operation['x-pomi-pagination'] ?? null,
  }
}

function createDomainSource(registry: DomainRegistry) {
  const modelAliases = [...registry.models.entries()].map(
    ([schemaName, modelName]) =>
      `export type ${modelName}Transport = components['schemas']['${schemaName}']\nexport type ${modelName} = Domain<${modelName}Transport>`,
  )
  const catalogProgram = registry.models.has('CatalogProgramEntity')
    ? `export type BlockSet = Domain<CatalogProgramTransport['base']>\nexport type CourseRequirement = Domain<CatalogProgramTransport['base']['mandatory'][number]>\nexport type CatalogProgramModality = Domain<CatalogProgramTransport['modalities'][number]>\nexport type CatalogProgramLanguage = Domain<CatalogProgramTransport['languages'][number]>`
    : ''
  const definitions = Object.fromEntries(
    [...registry.models.entries()].map(([schemaName, modelName]) => [
      modelName,
      {
        schema: schemaName,
        transportFields: registry.transportFields.get(schemaName) ?? [],
      },
    ]),
  )
  return `import type { components } from './openapi.js'

export type Domain<T> = T extends null
  ? null
  : T extends ReadonlyArray<infer Item>
    ? ReadonlyArray<Domain<Item>>
    : T extends object
      ? { readonly [Key in Exclude<keyof T, '_paths'>]: Domain<T[Key]> }
      : T

export type PagePaths = {
  firstPage: string
  lastPage: string
  next: string | null
  prev: string | null
}

export type Page<T> = {
  data: ReadonlyArray<T>
  quantity: number
  total: number
  _paths: PagePaths
}

export type DomainComponentSchemaName = keyof components['schemas']
export type Component<Name extends DomainComponentSchemaName> = Domain<components['schemas'][Name]>

${modelAliases.join('\n\n')}

${catalogProgram}

export const domainModelDefinitions = ${JSON.stringify(definitions, null, 2)} as const
`
}

function createInputsSource(entries: Array<OperationEntry>) {
  const bodyEntries = entries.filter((entry) => entry.operation.requestBody)
  const imports = bodyEntries.flatMap((entry) => {
    const operationId = entry.operation.operationId!
    return [`${operationId}Input`]
  })
  const aliases = bodyEntries.flatMap((entry) => {
    const operationId = entry.operation.operationId!
    return [
      `export type ${operationId}Request = Readonly<${operationId}Input>`,
      `export type ${operationId}Body = ${operationId}Input extends { body?: infer Body } ? Readonly<Body> : never`,
    ]
  })
  return `import type { ${imports.join(', ')} } from './operations.js'

${aliases.join('\n')}
`
}

function createBindingsSource(entries: Array<OperationEntry>) {
  const operations = entries.map((entry) => entry.operation.operationId!)
  return `import type { PomiRequestContext } from '../../runtime/client.js'
import type { OperationInputs, OperationName, OperationOutputs } from './operations.js'

export type OperationApi = {
  [Name in OperationName]: (
    input: OperationInputs[Name],
    context?: PomiRequestContext,
  ) => Promise<OperationOutputs[Name]>
}

export type ExecuteOperation = <Name extends OperationName>(
  name: Name,
  input: OperationInputs[Name],
  context?: PomiRequestContext,
) => Promise<OperationOutputs[Name]>

export function bindOperations(execute: ExecuteOperation): OperationApi {
  return {
${operations
  .map(
    (operationId) =>
      `    ${operationId}: (input, context) => execute(${JSON.stringify(operationId)}, input, context),`,
  )
  .join('\n')}
  }
}
`
}

function createOperationsSource(
  entries: Array<OperationEntry>,
  document: OpenApiDocument,
  registry: DomainRegistry,
) {
  const definitions: Array<string> = []
  const typeAliases: Array<string> = []
  const inputProperties: Array<string> = []
  const outputProperties: Array<string> = []
  const problemProperties: Array<string> = []

  for (const entry of entries) {
    const operationId = entry.operation.operationId
    if (!operationId) {
      throw new Error(
        `Operation without operationId: ${entry.method} ${entry.path}`,
      )
    }
    const operationType = `operations[${JSON.stringify(operationId)}]`
    const bodyRequired = entry.operation.requestBody?.required === true
    const inputType = `OperationInput<${operationType}['parameters']['path'], ${operationType}['parameters']['query'], ${operationType}['parameters']['header'], RequestBodyOf<${operationType}>, ${bodyRequired}>`
    const outputType = operationSuccessType(
      entry.operation,
      operationType,
      document,
      registry,
    )
    typeAliases.push(
      `export type ${operationId}Input = ${inputType}`,
      `export type ${operationId}Output = ${outputType}`,
      `export type ${operationId}Problem = ${operationProblemType(entry.operation, operationType)}`,
    )
    inputProperties.push(`${operationId}: ${operationId}Input`)
    outputProperties.push(`${operationId}: ${operationId}Output`)
    problemProperties.push(`${operationId}: ${operationId}Problem`)
    definitions.push(
      `${JSON.stringify(operationId)}: ${JSON.stringify(operationMetadata(entry), null, 2)}`,
    )
  }

  return `import type { operations } from './openapi.js'
import type { GeneratedOperationDefinition } from '../../runtime/operation.js'

type ParameterRecord<T> = [NonNullable<T>] extends [never] ? {} : NonNullable<T>
type RequestBodyOf<T> = T extends { requestBody: { content: infer Content } }
  ? Content[keyof Content]
  : never
type BodyInput<Body, Required extends boolean> = [Body] extends [never]
  ? {}
  : Required extends true
    ? { body: Body }
    : { body?: Body }
type HeaderInput<Header> = [NonNullable<Header>] extends [never]
  ? {}
  : { headers?: NonNullable<Header> }
type OperationInput<Path, Query, Header, Body, BodyRequired extends boolean> =
  ParameterRecord<Path> & ParameterRecord<Query> & HeaderInput<Header> & BodyInput<Body, BodyRequired>

${typeAliases.join('\n')}

export interface OperationInputs {
${inputProperties.map((property) => `  ${property}`).join('\n')}
}

export interface OperationOutputs {
${outputProperties.map((property) => `  ${property}`).join('\n')}
}

export interface OperationProblems {
${problemProperties.map((property) => `  ${property}`).join('\n')}
}

export const operationDefinitions = {
${definitions.map((definition) => `  ${definition},`).join('\n')}
} as const satisfies Record<string, GeneratedOperationDefinition>

export type OperationName = keyof typeof operationDefinitions
`
}

function createRuntimeSource(entries: Array<OperationEntry>) {
  const definitions = Object.fromEntries(
    entries.map((entry) => {
      const metadata = operationMetadata(entry)
      return [
        entry.operation.operationId!,
        [
          metadata.method,
          metadata.path,
          metadata.authentication,
          metadata.pathParameters,
          metadata.queryParameters,
          metadata.requestBody
            ? [metadata.requestBody.required, metadata.requestBody.contentType]
            : null,
          metadata.responses
            .filter((response) => response.success)
            .map((response) => [
              response.status,
              response.contents.map((content) => content.contentType),
            ]),
        ],
      ]
    }),
  )
  return `import type { RuntimeOperationTuple } from '../../runtime/operation.js'

export const runtimeOperationDefinitions = ${JSON.stringify(definitions)} as const satisfies Record<string, RuntimeOperationTuple>
`
}

function createResourcesSource(model: SdkTargetModel) {
  const { target } = model
  const entries = [...model.operations]
  const selected = entries.filter((entry) => entry.operation['x-pomi-sdk'])
  const imports = selected.flatMap((entry) => {
    const operationId = entry.operation.operationId!
    return [`${operationId}Input`, `${operationId}Output`]
  })
  function paths(entry: OperationEntry) {
    const metadata = entry.operation['x-pomi-sdk']!
    return parameterNames(entry.operation, 'path').map((wireName) => ({
      wireName,
      publicName: metadata.pathParameters?.[wireName] ?? wireName,
    }))
  }

  function argumentsFor(entry: OperationEntry) {
    const operationId = entry.operation.operationId!
    const pathArguments = paths(entry)
    const args = pathArguments.map(
      ({ wireName, publicName }) =>
        `${publicName}: ${pathParameterType(entry, wireName)}`,
    )
    const action = entry.operation['x-pomi-sdk']!.action
    const hasNonPathParameters = (entry.operation.parameters ?? []).some(
      (parameter) => parameter.in !== 'path',
    )
    if (action === 'list' || hasNonPathParameters) {
      const omitted =
        pathArguments
          .map(({ wireName }) => JSON.stringify(wireName))
          .join(' | ') || 'never'
      const inputRequired =
        entry.operation.requestBody?.required === true ||
        (entry.operation.parameters ?? []).some(
          (parameter) => parameter.in !== 'path' && parameter.required === true,
        )
      args.push(
        `input: Omit<${operationId}Input, ${omitted}>${inputRequired ? '' : ' = {}'}`,
      )
    } else if (entry.operation.requestBody) {
      args.push(`body: ${operationId}Input['body']`)
    }
    args.push('context?: PomiRequestContext')
    return args.join(', ')
  }

  function inputFor(entry: OperationEntry, inputExpression = 'input') {
    const operationId = entry.operation.operationId!
    const pathFields = paths(entry).map(
      ({ wireName, publicName }) =>
        `${JSON.stringify(wireName)}: ${publicName}`,
    )
    const action = entry.operation['x-pomi-sdk']!.action
    const hasNonPathParameters = (entry.operation.parameters ?? []).some(
      (parameter) => parameter.in !== 'path',
    )
    const fields =
      action === 'list' || hasNonPathParameters
        ? [...pathFields, `...${inputExpression}`]
        : entry.operation.requestBody
          ? [...pathFields, 'body']
          : pathFields
    return `operationInput<${operationId}Input>({ ${fields.join(', ')} })`
  }

  const resourceSources = model.resources.map(
    ({ name: resource, operations }) => {
      const methodDeclarations = operations.map((entry) => {
        const operationId = entry.operation.operationId!
        const metadata = entry.operation['x-pomi-sdk']!
        const method = metadata.method ?? metadata.action
        const variableName = `${method}Operation`
        return `const ${variableName} = withMetadata((${argumentsFor(entry)}) => operations.${operationId}(${inputFor(entry)}, context), definitions.${operationId}, operationProblemTypes.${operationId})`
      })
      const methodNames: Array<string> = operations.map((entry) => {
        const metadata = entry.operation['x-pomi-sdk']!
        const method = metadata.method ?? metadata.action
        return `${method}: ${method}Operation`
      })
      const paginated = operations.find(
        (entry) => entry.operation['x-pomi-pagination'],
      )
      if (paginated) {
        const operationId = paginated.operation.operationId!
        const pagination = paginated.operation['x-pomi-pagination']!
        const pageParameter = pagination.pageParameter ?? 'page'
        const pageSizeParameter = pagination.pageSizeParameter ?? 'pageSize'
        const defaultedInput = `{ ...input, ${JSON.stringify(pageParameter)}: input[${JSON.stringify(pageParameter)}] ?? 1, ${JSON.stringify(pageSizeParameter)}: input[${JSON.stringify(pageSizeParameter)}] ?? ${pagination.defaultPageSize} }`
        const listAllArguments = [
          ...paths(paginated).map(({ publicName }) => publicName),
          'input',
          'context',
        ].join(', ')
        const pages =
          pagination.strategy === 'page-number'
            ? `const pages = (${argumentsFor(paginated)}) => paginateByPage<${operationId}Output>((page) => operations.${operationId}(${inputFor(paginated, `{ ...${defaultedInput}, ${JSON.stringify(pageParameter)}: page }`)}, context), ${defaultedInput}[${JSON.stringify(pageParameter)}], ${JSON.stringify(pagination.pageField)}, ${JSON.stringify(pagination.pageSizeField)}, ${JSON.stringify(pagination.totalField)})`
            : `const pages = (${argumentsFor(paginated)}) => paginateByLink<${operationId}Output>(operations.${operationId}(${inputFor(paginated, defaultedInput)}, context), ${JSON.stringify(target)}, definitions.${operationId}.authentication, ${JSON.stringify(pagination.nextField)}, requestPath, context)`
        methodDeclarations.push(
          pages,
          `const listAll = async (${argumentsFor(paginated)}) => { const items: Array<${operationId}Output[${JSON.stringify(pagination.itemsField)}][number]> = []; for await (const page of pages(${listAllArguments})) items.push(...page[${JSON.stringify(pagination.itemsField)}]); return items }`,
        )
        methodNames.push('pages', 'listAll')
      }
      return `${JSON.stringify(resource)}: (() => { ${methodDeclarations.join('\n')}\nreturn { ${methodNames.join(', ')} } })()`
    },
  )

  const hasPagination = selected.some(
    (entry) => entry.operation['x-pomi-pagination'],
  )
  const hasLinkPagination = selected.some((entry) => {
    const pagination = entry.operation['x-pomi-pagination']
    return pagination && pagination.strategy !== 'page-number'
  })
  const hasPageNumberPagination = selected.some(
    (entry) => entry.operation['x-pomi-pagination']?.strategy === 'page-number',
  )
  const paginationHelpers = hasPagination
    ? `function valueAtPath(value: unknown, path: string) {
  return path.split('.').reduce<unknown>((current, key) => typeof current === 'object' && current !== null ? (current as Record<string, unknown>)[key] : undefined, value)
}

${
  hasLinkPagination
    ? `async function* paginateByLink<Page>(firstPage: Promise<Page>, target: ${JSON.stringify(target)}, authentication: AuthenticationMode, nextField: string, requestPath: RequestPath, context?: PomiRequestContext): AsyncIterable<Page> {
  let page = await firstPage
  yield page
  let next = valueAtPath(page, nextField)
  while (typeof next === 'string' && next.length > 0) {
    page = await requestPath<Page>(target, next, authentication, context)
    yield page
    next = valueAtPath(page, nextField)
  }
}
`
    : ''
}

${
  hasPageNumberPagination
    ? `async function* paginateByPage<Page>(requestPage: (page: number) => Promise<Page>, initialPage: number, pageField: string, pageSizeField: string, totalField: string): AsyncIterable<Page> {
  let pageNumber = initialPage
  while (true) {
    const page = await requestPage(pageNumber)
    yield page
    const currentPage = valueAtPath(page, pageField)
    const pageSize = valueAtPath(page, pageSizeField)
    const total = valueAtPath(page, totalField)
    if (typeof currentPage !== 'number' || typeof pageSize !== 'number' || typeof total !== 'number' || currentPage * pageSize >= total) return
    pageNumber = currentPage + 1
  }
}
`
    : ''
}
`
    : ''

  return `import type { PomiRequestContext } from '../../runtime/client.js'
import type { AuthenticationMode } from '../../runtime/operation.js'
import { operationDefinitions as definitions } from './operations.js'
import type { ${imports.join(', ')} } from './operations.js'
import { operationProblemTypes } from './problems.js'

type OperationFunction<Input, Output> = (input: Input, context?: PomiRequestContext) => Promise<Output>
type Operations = {
${selected.map((entry) => `  ${entry.operation.operationId}: OperationFunction<${entry.operation.operationId}Input, ${entry.operation.operationId}Output>`).join('\n')}
}
type RequestPath = <T>(target: ${JSON.stringify(target)}, path: string, authentication?: AuthenticationMode, context?: PomiRequestContext) => Promise<T>

function withMetadata<FunctionType extends (...args: any[]) => unknown, Definition, Problems>(fn: FunctionType, meta: Definition, problemTypes: Problems) {
  return Object.assign(fn, { meta, problemTypes })
}

function operationInput<Input>(input: Input): Input {
  return input
}

${paginationHelpers}

export function bindResources(operations: Operations, requestPath: RequestPath) {
  ${hasLinkPagination ? '' : 'void requestPath'}
  return {
${resourceSources.map((source) => `    ${source},`).join('\n')}
  }
}

export type Resources = ReturnType<typeof bindResources>
`
}

function createFiltersSource(entries: Array<OperationEntry>) {
  const filtered = entries.filter((entry) =>
    parameterNames(entry.operation, 'query').includes('filter'),
  )
  const imports = filtered.map(
    (entry) => `${entry.operation.operationId!}Input`,
  )
  const aliases = filtered.map(
    (entry) =>
      `export type ${entry.operation.operationId!}Filter = NonNullable<${entry.operation.operationId!}Input['filter']>`,
  )
  const metadata = Object.fromEntries(
    filtered.map((entry) => [
      entry.operation.operationId!,
      queryMetadata(entry.operation).filter,
    ]),
  )
  return `${imports.length ? `import type { ${imports.join(', ')} } from './operations.js'\n\n` : ''}${aliases.join('\n')}

export const filterCapabilities = ${JSON.stringify(metadata, null, 2)} as const
`
}

function createProblemsSource(
  document: OpenApiDocument,
  entries: Array<OperationEntry>,
) {
  const schemas = document.components?.schemas ?? {}
  const catalog = Object.fromEntries(
    Object.entries(schemas).flatMap(([schemaName, schema]) => {
      const type = problemTypeForSchema(schema)
      if (!type) return []
      const properties = isRecord(schema.properties) ? schema.properties : {}
      const statusProperty = isRecord(properties.status)
        ? properties.status
        : {}
      const titleProperty = isRecord(properties.title) ? properties.title : {}
      return [
        [
          type,
          {
            schemaName,
            type,
            status: Array.isArray(statusProperty.enum)
              ? (statusProperty.enum[0] ?? null)
              : null,
            title: Array.isArray(titleProperty.enum)
              ? (titleProperty.enum[0] ?? null)
              : null,
            hasFields:
              isRecord(schema.properties) && 'fields' in schema.properties,
          },
        ],
      ]
    }),
  )
  const operationProblems = Object.fromEntries(
    entries.map((entry) => [
      entry.operation.operationId!,
      [
        ...new Set(
          responseEntries(entry.operation, false).flatMap(([, response]) =>
            problemTypesForResponse(response, document),
          ),
        ),
      ],
    ]),
  )
  const typeMap = Object.fromEntries(
    Object.entries(catalog).map(([type, value]) => [type, value.schemaName]),
  )
  return `import type { components } from './openapi.js'

export const problemCatalog = ${JSON.stringify(catalog, null, 2)} as const

export const operationProblemTypes = ${JSON.stringify(operationProblems, null, 2)} as const

export type ProblemType = keyof typeof problemCatalog
export type ProblemByType = {
${Object.entries(typeMap)
  .map(
    ([type, schemaName]) =>
      `  ${JSON.stringify(type)}: components['schemas'][${JSON.stringify(schemaName)}]`,
  )
  .join('\n')}
}
export type AnyProblem = ProblemByType[ProblemType]
export type OperationProblem<Name extends keyof typeof operationProblemTypes> =
  ProblemByType[(typeof operationProblemTypes)[Name][number] & ProblemType]
`
}

function collectEnums(document: OpenApiDocument) {
  const enums: Record<string, Array<unknown>> = {}
  function visit(value: unknown, path: Array<string>) {
    if (Array.isArray(value)) {
      for (const item of value) visit(item, path)
      return
    }
    if (!isRecord(value)) return
    if (Array.isArray(value.enum) && value.enum.length > 1) {
      enums[path.join('.')] = value.enum
    }
    for (const [key, child] of Object.entries(value)) {
      if (key === 'enum') continue
      if (key === 'properties' && isRecord(child)) {
        for (const [propertyName, property] of Object.entries(child)) {
          visit(property, [...path, propertyName])
        }
        continue
      }
      if (key === 'items') {
        visit(child, [...path.slice(0, -1), `${path.at(-1) ?? 'items'}[]`])
        continue
      }
      visit(child, [...path, key])
    }
  }
  for (const [name, schema] of Object.entries(
    document.components?.schemas ?? {},
  )) {
    visit(schema, [name])
  }
  return enums
}

function enumIdentifier(path: string) {
  const segments = path
    .split('.')
    .filter((segment) => segment !== 'oneOf')
    .map((segment) =>
      segment.replace(/\[\]$/u, 'Array').replace(/[^A-Za-z0-9]+/gu, ' '),
    )
    .flatMap((segment) => segment.split(' ').filter(Boolean))
    .map((segment) => segment[0].toUpperCase() + segment.slice(1))
  const name = segments.join('')
  if (!name) throw new Error(`Could not derive enum name from ${path}`)
  return `${name[0].toLowerCase()}${name.slice(1)}Values`
}

function createEnumsSource(document: OpenApiDocument) {
  const enums = collectEnums(document)
  const names = new Map<string, number>()
  const entries = Object.entries(enums).map(([path, values]) => {
    const baseName = enumIdentifier(path)
    const occurrence = (names.get(baseName) ?? 0) + 1
    names.set(baseName, occurrence)
    const name = occurrence === 1 ? baseName : `${baseName}${occurrence}`
    const typeName = `${name[0].toUpperCase()}${name.slice(1).replace(/Values$/u, '')}`
    return { path, values, name, typeName }
  })
  const valueNames = Object.fromEntries(
    entries.map(({ path, name }) => [path, name]),
  )
  return `${entries
    .map(
      ({ values, name, typeName }) =>
        `export const ${name} = ${JSON.stringify(values)} as const\nexport type ${typeName} = (typeof ${name})[number]`,
    )
    .join(
      '\n\n',
    )}\n\nexport const enumValueNames = ${JSON.stringify(valueNames, null, 2)} as const\n`
}

function createPathsSource(entries: Array<OperationEntry>) {
  const functions = entries.map((entry) => {
    const name = entry.operation.operationId!
    return `${JSON.stringify(name)}: (input: OperationInputs[${JSON.stringify(name)}]) => buildOperationUrl(operationDefinitions[${JSON.stringify(name)}], input as Record<string, unknown>)`
  })
  return `import { buildOperationUrl } from '../../runtime/query.js'
import { operationDefinitions, type OperationInputs } from './operations.js'

export const operationPaths = {
${functions.map((definition) => `  ${definition},`).join('\n')}
}
`
}

function createMetadataSource(
  document: OpenApiDocument,
  entries: Array<OperationEntry>,
) {
  const queryCapabilities = Object.fromEntries(
    entries.map((entry) => [
      entry.operation.operationId!,
      queryMetadata(entry.operation),
    ]),
  )
  return `export const componentSchemas = ${JSON.stringify(document.components?.schemas ?? {}, null, 2)} as const

export const enumValues = ${JSON.stringify(collectEnums(document), null, 2)} as const

export const queryCapabilities = ${JSON.stringify(queryCapabilities, null, 2)} as const

export type ComponentSchemaName = keyof typeof componentSchemas
export type EnumName = keyof typeof enumValues
`
}

function createTargetIndexSource() {
  return `export * from './bindings.js'
export * from './enums.js'
export * from './domain.js'
export * from './filters.js'
export * from './inputs.js'
export * from './metadata.js'
export * from './openapi.js'
export * from './operations.js'
export * from './paths.js'
export * from './problems.js'
export * from './resources.js'
export * from './runtime.js'
`
}

function resolvedSchema(document: OpenApiDocument, schema: unknown): unknown {
  return schemaAtRef(document, schema) ?? schema
}

function schemaHasPath(
  document: OpenApiDocument,
  schema: unknown,
  path: string,
) {
  let current: unknown = schema
  for (const part of path.split('.')) {
    current = resolvedSchema(document, current)
    if (!isRecord(current) || !isRecord(current.properties)) return false
    current = current.properties[part]
    if (!current) return false
  }
  return true
}

function successfulSchemas(entry: OperationEntry) {
  return responseEntries(entry.operation, true).flatMap(([, response]) =>
    contentTypeEntries(response).map(([, content]) => content.schema),
  )
}

function detectedPagination(entry: OperationEntry) {
  const schemas = successfulSchemas(entry)
  if (
    schemas.some(
      (schema) =>
        schemaHasPath(entry.document, schema, 'data') &&
        schemaHasPath(entry.document, schema, '_paths.next'),
    )
  ) {
    return 'link'
  }
  if (
    schemas.some(
      (schema) =>
        schemaHasPath(entry.document, schema, 'items') &&
        schemaHasPath(entry.document, schema, 'page') &&
        schemaHasPath(entry.document, schema, 'pageSize') &&
        schemaHasPath(entry.document, schema, 'total'),
    )
  ) {
    return 'page-number'
  }
  return undefined
}

function validateSdkMetadata(entry: OperationEntry) {
  const id = entry.operation.operationId!
  const sdk = entry.operation['x-pomi-sdk']
  if (!sdk) throw new Error(`Missing x-pomi-sdk in operation ${id}`)
  if (!sdk.resource || !sdk.action) {
    throw new Error(`Invalid x-pomi-sdk in operation ${id}`)
  }
  const method = sdk.method ?? sdk.action
  if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/u.test(method)) {
    throw new Error(`Invalid SDK method ${method} in operation ${id}`)
  }
  const paths = new Set(parameterNames(entry.operation, 'path'))
  const publicNames = new Set<string>()
  for (const [wireName, publicName] of Object.entries(
    sdk.pathParameters ?? {},
  )) {
    if (!paths.has(wireName)) {
      throw new Error(
        `Unknown SDK path parameter ${wireName} in operation ${id}`,
      )
    }
    if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/u.test(publicName)) {
      throw new Error(
        `Invalid public path parameter ${publicName} in operation ${id}`,
      )
    }
    if (publicNames.has(publicName)) {
      throw new Error(
        `Duplicate public path parameter ${publicName} in operation ${id}`,
      )
    }
    publicNames.add(publicName)
  }
}

function validatePaginationMetadata(entry: OperationEntry) {
  const id = entry.operation.operationId!
  const sdk = entry.operation['x-pomi-sdk']!
  const pagination = entry.operation['x-pomi-pagination']
  const detected = detectedPagination(entry)
  if (!pagination) {
    if (detected) {
      throw new Error(
        `Missing x-pomi-pagination for ${detected} operation ${id}`,
      )
    }
    return
  }
  if (sdk.action !== 'list') {
    throw new Error(`Pagination requires SDK action list in operation ${id}`)
  }
  if (
    pagination.defaultPageSize < 1 ||
    pagination.maxPageSize < pagination.defaultPageSize
  ) {
    throw new Error(`Invalid pagination limits in operation ${id}`)
  }
  const fields =
    pagination.strategy === 'page-number'
      ? [
          pagination.itemsField,
          pagination.pageField,
          pagination.pageSizeField,
          pagination.totalField,
        ]
      : [pagination.itemsField, pagination.nextField]
  const schemas = successfulSchemas(entry)
  for (const field of fields) {
    if (
      !schemas.some((schema) => schemaHasPath(entry.document, schema, field))
    ) {
      throw new Error(
        `Pagination response field ${field} does not exist in operation ${id}`,
      )
    }
  }
  const queries = new Set(parameterNames(entry.operation, 'query'))
  for (const parameter of [
    pagination.pageParameter ?? 'page',
    pagination.pageSizeParameter ?? 'pageSize',
  ]) {
    if (!queries.has(parameter)) {
      throw new Error(
        `Pagination query parameter ${parameter} does not exist in operation ${id}`,
      )
    }
  }
}

async function loadSpec(target: ApiTarget, path: string) {
  const document = JSON.parse(await readFile(path, 'utf8')) as OpenApiDocument
  if (!document.openapi.startsWith('3.')) {
    throw new Error(`Expected an OpenAPI 3 document: ${path}`)
  }
  const entries = operationEntries(target, document)
  if (entries.length === 0)
    throw new Error(`No HTTP operations found in ${path}`)
  const ids = new Set<string>()
  const resources = new Set<string>()
  for (const entry of entries) {
    const id = entry.operation.operationId
    if (!id)
      throw new Error(
        `Operation without operationId: ${entry.method} ${entry.path}`,
      )
    if (ids.has(id))
      throw new Error(`Duplicate operationId in ${target}: ${id}`)
    ids.add(id)
    validateSdkMetadata(entry)
    validatePaginationMetadata(entry)
    const sdk = entry.operation['x-pomi-sdk']!
    const resourceOperation = `${sdk.resource}.${sdk.method ?? sdk.action}`
    if (resources.has(resourceOperation)) {
      throw new Error(
        `Duplicate SDK operation in ${target}: ${resourceOperation}`,
      )
    }
    resources.add(resourceOperation)
  }
  return buildSdkTargetModel(target, path, document, entries)
}

async function directoryFiles(root: string, directory = root) {
  const files = new Map<string, string>()
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) {
      for (const [name, content] of await directoryFiles(root, path)) {
        files.set(name, content)
      }
    } else {
      files.set(path.slice(root.length + 1), await readFile(path, 'utf8'))
    }
  }
  return files
}

async function generatedDifferences(stagedDirectory: string) {
  const expected = await directoryFiles(stagedDirectory)
  let actual: Map<string, string>
  try {
    actual = await directoryFiles(generatedDirectory)
  } catch (error) {
    if (isRecord(error) && error.code === 'ENOENT') return [...expected.keys()]
    throw error
  }
  return [...new Set([...expected.keys(), ...actual.keys()])].filter(
    (name) => expected.get(name) !== actual.get(name),
  )
}

async function validateGeneratedSources(stagedDirectory: string) {
  const files = await directoryFiles(stagedDirectory)
  for (const [name, content] of files) {
    if (
      (name.endsWith('/resources.ts') || name.endsWith('/bindings.ts')) &&
      content.includes('as unknown as')
    ) {
      throw new Error(`Unsafe generated type assertion in ${name}`)
    }
  }
}

async function installGenerated(stagedDirectory: string) {
  const backupDirectory = `${generatedDirectory}.previous`
  await rm(backupDirectory, { recursive: true, force: true })
  let hasBackup = false
  try {
    await rename(generatedDirectory, backupDirectory)
    hasBackup = true
  } catch (error) {
    if (!isRecord(error) || error.code !== 'ENOENT') throw error
  }
  try {
    await rename(stagedDirectory, generatedDirectory)
  } catch (error) {
    if (hasBackup) await rename(backupDirectory, generatedDirectory)
    throw error
  }
  if (hasBackup) await rm(backupDirectory, { recursive: true, force: true })
}

function repeatedEnumSetCount(document: OpenApiDocument) {
  const counts = new Map<string, number>()
  for (const values of Object.values(collectEnums(document))) {
    const key = JSON.stringify(values)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return [...counts.values()].filter((count) => count > 1).length
}

function generationReport(model: SdkTargetModel) {
  const pagination = model.operations.filter(
    (entry) => entry.operation['x-pomi-pagination'],
  ).length
  const classifiedSchemas = model.schemas.filter(
    ({ schema }) => schema['x-pomi-schema'],
  ).length
  return `${model.target}: ${model.operations.length} operations, ${model.resources.length} resources, ${pagination} paginated, ${model.schemas.length} schemas, ${classifiedSchemas} classified schemas, ${Object.keys(collectEnums(model.document)).length} enums, ${repeatedEnumSetCount(model.document)} repeated enum sets`
}

async function main() {
  const loaded = await Promise.all(
    specs.map((spec) => loadSpec(spec.target, spec.path)),
  )
  const stagedDirectory = await mkdtemp(resolve(projectDirectory, '.sdk-gen-'))
  const project = new Project({
    compilerOptions: { target: 99, module: 99, strict: true },
    manipulationSettings: {
      quoteKind: QuoteKind.Single,
      useTrailingCommas: true,
    },
  })

  try {
    for (const spec of loaded) {
      const directory = resolve(stagedDirectory, spec.target)
      const registry = createDomainRegistry(spec.target, spec.document)
      const openApiAst = await openapiTS(spec.document, { alphabetize: false })
      project.createSourceFile(
        resolve(directory, 'openapi.ts'),
        removeGeneratedComments(astToString(openApiAst)),
        { overwrite: true },
      )
      project.createSourceFile(
        resolve(directory, 'operations.ts'),
        createOperationsSource([...spec.operations], spec.document, registry),
        { overwrite: true },
      )
      project.createSourceFile(
        resolve(directory, 'domain.ts'),
        createDomainSource(registry),
        { overwrite: true },
      )
      project.createSourceFile(
        resolve(directory, 'inputs.ts'),
        createInputsSource([...spec.operations]),
        { overwrite: true },
      )
      project.createSourceFile(
        resolve(directory, 'bindings.ts'),
        createBindingsSource([...spec.operations]),
        { overwrite: true },
      )
      project.createSourceFile(
        resolve(directory, 'enums.ts'),
        createEnumsSource(spec.document),
        { overwrite: true },
      )
      project.createSourceFile(
        resolve(directory, 'filters.ts'),
        createFiltersSource([...spec.operations]),
        { overwrite: true },
      )
      project.createSourceFile(
        resolve(directory, 'problems.ts'),
        createProblemsSource(spec.document, [...spec.operations]),
        { overwrite: true },
      )
      project.createSourceFile(
        resolve(directory, 'metadata.ts'),
        createMetadataSource(spec.document, [...spec.operations]),
        { overwrite: true },
      )
      project.createSourceFile(
        resolve(directory, 'paths.ts'),
        createPathsSource([...spec.operations]),
        { overwrite: true },
      )
      project.createSourceFile(
        resolve(directory, 'resources.ts'),
        createResourcesSource(spec),
        { overwrite: true },
      )
      project.createSourceFile(
        resolve(directory, 'runtime.ts'),
        createRuntimeSource([...spec.operations]),
        { overwrite: true },
      )
      project.createSourceFile(
        resolve(directory, 'index.ts'),
        createTargetIndexSource(),
        { overwrite: true },
      )
    }

    project.createSourceFile(
      resolve(stagedDirectory, 'manifest.ts'),
      `import * as app from './app/index.js'\nimport * as data from './data/index.js'\n\nexport const sdkManifest = { app, data } as const\n`,
      { overwrite: true },
    )
    project.createSourceFile(
      resolve(stagedDirectory, 'index.ts'),
      `export * as app from './app/index.js'\nexport * as data from './data/index.js'\nexport * from './manifest.js'\n`,
      { overwrite: true },
    )

    for (const sourceFile of project.getSourceFiles()) {
      if (!sourceFile.getFilePath().endsWith('/openapi.ts'))
        sourceFile.formatText()
    }
    await project.save()
    await validateGeneratedSources(stagedDirectory)
    if (checkOnly) {
      const differences = await generatedDifferences(stagedDirectory)
      if (differences.length > 0) {
        throw new Error(
          `Generated SDK is outdated:\n${differences.map((file) => `- ${file}`).join('\n')}`,
        )
      }
    } else {
      await installGenerated(stagedDirectory)
    }
    console.log(loaded.map(generationReport).join('\n'))
    console.log(
      checkOnly ? 'Generated SDK is up to date' : 'Generated SDK updated',
    )
  } finally {
    await rm(stagedDirectory, { recursive: true, force: true })
  }
}

await main()
