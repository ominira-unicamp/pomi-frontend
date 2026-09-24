import { mkdtemp, readFile, readdir, rename, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import openapiTS, { astToString } from 'openapi-typescript'
import { Project, QuoteKind } from 'ts-morph'
import { loadSpec as loadValidatedSpec } from './loadSpec.js'
import { isSdkOperation } from './model.js'
import type {
  ApiTarget,
  JsonObject,
  OpenApiDocument,
  OpenApiOperation,
  OpenApiResponse,
  OpenApiSchema,
  OperationModel as OperationEntry,
  SdkOperationModel,
  SdkTargetModel,
} from './model.js'

type DomainRegistry = {
  models: Map<string, string>
  transportFields: Map<string, ReadonlyArray<string>>
  metadata: Map<string, NonNullable<OpenApiSchema['x-pomi-schema']>>
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

function isRecord(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
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
  const links = schemaAtRef(document, resolved.properties.links) ?? resolved.properties.links
  if (!isRecord(data) || data.type !== 'array') return undefined
  if (
    !isRecord(links) ||
    !isRecord(links.properties) ||
    !('next' in links.properties)
  ) {
    return undefined
  }
  return data.items
}

function domainTypeForSchema(
  document: OpenApiDocument,
  schema: unknown,
  registry: DomainRegistry,
): string | undefined {
  const refName = schemaNameFromRef(schema)
  if (refName) {
    const item = pageItemSchema(document, schema)
    const itemType = item
      ? domainTypeForSchema(document, item, registry)
      : undefined
    if (itemType) return `import('./domain.js').Page<${itemType}>`
    const model = registry.models.get(refName)
    return model ? `import('./domain.js').${model}` : undefined
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
  const metadata = new Map<
    string,
    NonNullable<OpenApiSchema['x-pomi-schema']>
  >()
  const names = new Map<string, string>()
  for (const [schemaName, schema] of Object.entries(
    document.components?.schemas ?? {},
  )) {
    const schemaMetadata = schema['x-pomi-schema']
    if (!schemaMetadata)
      throw new Error(`Missing x-pomi-schema in ${schemaName}`)
    metadata.set(schemaName, schemaMetadata)
    if (Array.isArray(schema.enum) || schemaMetadata.generate === false)
      continue
    if (
      schemaMetadata.kind === 'input' ||
      schemaMetadata.kind === 'problem' ||
      schemaMetadata.kind === 'transport'
    ) {
      continue
    }
    const modelName = schemaMetadata.publicName
    const existing = names.get(modelName)
    if (existing) {
      throw new Error(
        `Component schemas ${existing} and ${schemaName} map to the same SDK model ${modelName}`,
      )
    }
    names.set(modelName, schemaName)
    models.set(schemaName, modelName)
    const fields = schemaMetadata.transportFields ?? []
    transportFields.set(schemaName, fields)
  }
  return { models, transportFields, metadata }
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

function operationSortMetadata(operation: OpenApiOperation) {
  return (operation.parameters ?? []).find(
    (parameter) => parameter.in === 'query' && parameter.name === 'sort',
  )?.['x-pomi-sort']
}

function queryMetadata(operation: OpenApiOperation) {
  const parameters = (operation.parameters ?? []).filter(
    (parameter) => parameter.in === 'query' && parameter.name,
  )
  const filter = parameters.find((parameter) => parameter.name === 'filter')
  const sortMetadata = operationSortMetadata(operation)
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
    ...(sortMetadata ? { sort: sortMetadata } : {}),
  }
}

function sortFieldType(operation: OpenApiOperation) {
  const metadata = operationSortMetadata(operation)
  return metadata
    ? metadata.fields.map((field) => JSON.stringify(field)).join(' | ')
    : undefined
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
    ([schemaName, modelName]) => {
      const fields = registry.transportFields.get(schemaName) ?? []
      const source =
        fields.length > 0
          ? `Omit<${modelName}Transport, ${fields.map((field) => JSON.stringify(field)).join(' | ')}>`
          : `${modelName}Transport`
      return `export type ${modelName}Transport = components['schemas']['${schemaName}']\nexport type ${modelName} = Domain<${source}>`
    },
  )
  const pathType = (root: string, path: string) =>
    path
      .split('.')
      .filter(Boolean)
      .reduce((type, field) => `${type}[${JSON.stringify(field)}]`, root)
  const domainExports = [...registry.models.entries()].flatMap(
    ([schemaName, modelName]) =>
      Object.entries(
        registry.metadata.get(schemaName)?.domainExports ?? {},
      ).map(
        ([name, path]) =>
          `export type ${name} = Domain<${pathType(`${modelName}Transport`, path)}>`,
      ),
  )
  const definitions = Object.fromEntries(
    [...registry.models.entries()].map(([schemaName, modelName]) => [
      modelName,
      {
        schema: schemaName,
        transportFields: registry.transportFields.get(schemaName) ?? [],
        identityFields: registry.metadata.get(schemaName)?.identityFields ?? [],
        readOnlyFields: registry.metadata.get(schemaName)?.readOnlyFields ?? [],
        relations: registry.metadata.get(schemaName)?.relations ?? {},
      },
    ]),
  )
  return `import type { components } from './openapi.js'

export type Domain<T> = T extends null
  ? null
  : T extends ReadonlyArray<infer Item>
    ? ReadonlyArray<Domain<Item>>
    : T extends object
      ? { readonly [Key in keyof T]: Domain<T[Key]> }
      : T

export type PaginationLinks = {
  self: string
  first: string
  last: string
  next: string | null
  previous: string | null
}

export type Page<T> = {
  data: ReadonlyArray<T>
  quantity: number
  total: number
  links: PaginationLinks
}

export type DomainComponentSchemaName = keyof components['schemas']
export type Component<Name extends DomainComponentSchemaName> = Domain<components['schemas'][Name]>

${modelAliases.join('\n\n')}

${domainExports.join('\n')}

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
  const hasSorting = entries.some(
    (entry) => operationSortMetadata(entry.operation) !== undefined,
  )
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
    const fields = sortFieldType(entry.operation)
    const queryType = fields
      ? `SortQuery<${operationType}['parameters']['query'], ${fields}>`
      : `${operationType}['parameters']['query']`
    const inputType = `OperationInput<${operationType}['parameters']['path'], ${queryType}, ${operationType}['parameters']['header'], RequestBodyOf<${operationType}>, ${bodyRequired}>`
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

  return `${hasSorting ? `import type { SortInput } from '../../runtime/sorting.js'\n` : ''}import type { operations } from './openapi.js'
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
${
  hasSorting
    ? `type SortQuery<Query, SortField extends string> = ParameterRecord<Query> extends infer Parameters
  ? Parameters extends { sort: unknown }
    ? Omit<Parameters, 'sort'> & { sort: SortInput<SortField> }
    : Omit<Parameters, 'sort'> & { sort?: SortInput<SortField> }
    : never
`
    : ''
}type OperationInput<Path, Query, Header, Body, BodyRequired extends boolean> =
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
  const selected = entries.filter(isSdkOperation)
  const imports = selected.flatMap((entry) => {
    const operationId = entry.operation.operationId!
    return [`${operationId}Input`, `${operationId}Output`]
  })
  function paths(entry: SdkOperationModel) {
    const metadata = entry.operation['x-pomi-sdk']
    return parameterNames(entry.operation, 'path').map((wireName) => ({
      wireName,
      publicName: metadata.pathParameters?.[wireName] ?? wireName,
    }))
  }

  function argumentsFor(entry: SdkOperationModel) {
    const operationId = entry.operation.operationId!
    const pathArguments = paths(entry)
    const args = pathArguments.map(
      ({ wireName, publicName }) =>
        `${publicName}: ${pathParameterType(entry, wireName)}`,
    )
    const action = entry.operation['x-pomi-sdk'].action
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

  function inputFor(entry: SdkOperationModel, inputExpression = 'input') {
    const operationId = entry.operation.operationId!
    const pathFields = paths(entry).map(
      ({ wireName, publicName }) =>
        `${JSON.stringify(wireName)}: ${publicName}`,
    )
    const action = entry.operation['x-pomi-sdk'].action
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
        const metadata = entry.operation['x-pomi-sdk']
        const method = metadata.method
        const variableName = `${method}Operation`
        return `const ${variableName} = withMetadata((${argumentsFor(entry)}) => operations.${operationId}(${inputFor(entry)}, context), definitions.${operationId}, operationProblemTypes.${operationId})`
      })
      const methodNames: Array<string> = operations.map((entry) => {
        const metadata = entry.operation['x-pomi-sdk']
        const method = metadata.method
        return `${method}: ${method}Operation`
      })
      const paginated = operations.filter(
        (entry) => entry.operation['x-pomi-pagination'],
      )
      for (const paginatedEntry of paginated) {
        const operationId = paginatedEntry.operation.operationId!
        const pagination = paginatedEntry.operation['x-pomi-pagination']!
        const method = paginatedEntry.operation['x-pomi-sdk'].method
        const pagesName = paginated.length === 1 ? 'pages' : `${method}Pages`
        const listAllName = paginated.length === 1 ? 'listAll' : `${method}All`
        const defaultedInput =
          pagination.defaultMode === 'all'
            ? `{ ...input, pageSize: input.pageSize ?? 'all' }`
            : `{ ...input, page: input.page ?? 1, pageSize: input.pageSize ?? ${pagination.defaultPageSize} }`
        const listAllArguments = [
          ...paths(paginatedEntry).map(({ publicName }) => publicName),
          'input',
          'context',
        ].join(', ')
        const pages = `const ${pagesName} = (${argumentsFor(paginatedEntry)}) => paginateByLink<${operationId}Output>(operations.${operationId}(${inputFor(paginatedEntry, defaultedInput)}, context), ${JSON.stringify(target)}, definitions.${operationId}.authentication, requestPath, context)`
        methodDeclarations.push(
          pages,
          `const ${listAllName} = async (${argumentsFor(paginatedEntry)}) => { const items: Array<${operationId}Output['data'][number]> = []; for await (const page of ${pagesName}(${listAllArguments})) items.push(...page.data); return items }`,
        )
        methodNames.push(pagesName, listAllName)
      }
      return `${JSON.stringify(resource)}: (() => { ${methodDeclarations.join('\n')}\nreturn { ${methodNames.join(', ')} } })()`
    },
  )

  const hasPagination = selected.some(
    (entry) => entry.operation['x-pomi-pagination'],
  )
  const paginationHelpers = hasPagination
    ? `async function* paginateByLink<Page extends { links: { next: string | null } }>(firstPage: Promise<Page>, target: ${JSON.stringify(target)}, authentication: AuthenticationMode, requestPath: RequestPath, context?: PomiRequestContext): AsyncIterable<Page> {
  let page = await firstPage
  yield page
  let next = page.links.next
  while (typeof next === 'string' && next.length > 0) {
    page = await requestPath<Page>(target, next, authentication, context)
    yield page
    next = page.links.next
  }
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
  ${hasPagination ? '' : 'void requestPath'}
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

function createSortingSource(entries: Array<OperationEntry>) {
  const sorted = entries.filter(
    (entry) => operationSortMetadata(entry.operation) !== undefined,
  )
  const imports = sorted.map((entry) => `${entry.operation.operationId!}Input`)
  const aliases = sorted.map(
    (entry) =>
      `export type ${entry.operation.operationId!}Sort = NonNullable<${entry.operation.operationId!}Input['sort']>`,
  )
  const metadata = Object.fromEntries(
    sorted.map((entry) => [
      entry.operation.operationId!,
      operationSortMetadata(entry.operation),
    ]),
  )
  return `export type { SortDirection, SortInput, SortTerm } from '../../runtime/sorting.js'
${imports.length ? `import type { ${imports.join(', ')} } from './operations.js'\n\n` : ''}${aliases.join('\n')}

export const sortCapabilities = ${JSON.stringify(metadata, null, 2)} as const
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
export * from './sorting.js'
`
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
    specs.map((spec) => loadValidatedSpec(spec.target, spec.path)),
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
      const operations = spec.operations.filter(isSdkOperation)
      const openApiAst = await openapiTS(spec.document, { alphabetize: false })
      project.createSourceFile(
        resolve(directory, 'openapi.ts'),
        removeGeneratedComments(astToString(openApiAst)),
        { overwrite: true },
      )
      project.createSourceFile(
        resolve(directory, 'operations.ts'),
        createOperationsSource([...operations], spec.document, registry),
        { overwrite: true },
      )
      project.createSourceFile(
        resolve(directory, 'domain.ts'),
        createDomainSource(registry),
        { overwrite: true },
      )
      project.createSourceFile(
        resolve(directory, 'inputs.ts'),
        createInputsSource([...operations]),
        { overwrite: true },
      )
      project.createSourceFile(
        resolve(directory, 'bindings.ts'),
        createBindingsSource([...operations]),
        { overwrite: true },
      )
      project.createSourceFile(
        resolve(directory, 'enums.ts'),
        createEnumsSource(spec.document),
        { overwrite: true },
      )
      project.createSourceFile(
        resolve(directory, 'filters.ts'),
        createFiltersSource([...operations]),
        { overwrite: true },
      )
      project.createSourceFile(
        resolve(directory, 'sorting.ts'),
        createSortingSource([...operations]),
        { overwrite: true },
      )
      project.createSourceFile(
        resolve(directory, 'problems.ts'),
        createProblemsSource(spec.document, [...operations]),
        { overwrite: true },
      )
      project.createSourceFile(
        resolve(directory, 'metadata.ts'),
        createMetadataSource(spec.document, [...spec.operations]),
        { overwrite: true },
      )
      project.createSourceFile(
        resolve(directory, 'paths.ts'),
        createPathsSource([...operations]),
        { overwrite: true },
      )
      project.createSourceFile(
        resolve(directory, 'resources.ts'),
        createResourcesSource(spec),
        { overwrite: true },
      )
      project.createSourceFile(
        resolve(directory, 'runtime.ts'),
        createRuntimeSource([...operations]),
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
