import { readFile, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import openapiTS, { astToString } from 'openapi-typescript'
import { Project, QuoteKind } from 'ts-morph'
import type { OpenAPI3 } from 'openapi-typescript'

type ApiTarget = 'app' | 'data'
type JsonObject = Record<string, unknown>

type OpenApiParameter = JsonObject & {
  name?: string
  in?: string
  required?: boolean
  description?: string
  schema?: unknown
  style?: string
  explode?: boolean
  'x-pomi-filters'?: unknown
}

type OpenApiResponse = JsonObject & {
  content?: Readonly<Record<string, { schema?: unknown }>>
}

type OpenApiRequestBody = JsonObject & {
  required?: boolean
  content?: Readonly<Record<string, { schema?: unknown }>>
}

type OpenApiOperation = JsonObject & {
  operationId?: string
  summary?: string
  description?: string
  deprecated?: boolean
  tags?: Array<string>
  security?: ReadonlyArray<Record<string, Array<string>>>
  parameters?: ReadonlyArray<OpenApiParameter>
  requestBody?: OpenApiRequestBody
  responses?: Readonly<Record<string, OpenApiResponse>>
}

type OpenApiDocument = OpenAPI3 & {
  paths?: Readonly<Record<string, Readonly<Record<string, unknown>>>>
  security?: ReadonlyArray<Record<string, Array<string>>>
  components?: OpenAPI3['components'] & {
    schemas?: Readonly<Record<string, JsonObject>>
  }
}

type OperationEntry = {
  target: ApiTarget
  path: string
  method: string
  operation: OpenApiOperation
  document: OpenApiDocument
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

function operationSuccessType(
  operation: OpenApiOperation,
  operationType: string,
) {
  const types = responseEntries(operation, true).flatMap(
    ([status, response]) => {
      const contents = contentTypeEntries(response)
      if (contents.length === 0) return ['void']
      return contents.map(
        ([contentType]) =>
          `${operationType}['responses'][${typeIndex(status)}]['content']${contentTypeIndex(contentType)}`,
      )
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
  }
}

function createOperationsSource(entries: Array<OperationEntry>) {
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
    typeAliases.push(
      `export type ${operationId}Input = ${inputType}`,
      `export type ${operationId}Output = ${operationSuccessType(entry.operation, operationType)}`,
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
  return `export const problemCatalog = ${JSON.stringify(catalog, null, 2)} as const

export const operationProblemTypes = ${JSON.stringify(operationProblems, null, 2)} as const

export type ProblemType = keyof typeof problemCatalog
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
  return `export * from './enums.js'
export * from './filters.js'
export * from './metadata.js'
export * from './openapi.js'
export * from './operations.js'
export * from './paths.js'
export * from './problems.js'
`
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
  for (const entry of entries) {
    const id = entry.operation.operationId
    if (!id)
      throw new Error(
        `Operation without operationId: ${entry.method} ${entry.path}`,
      )
    if (ids.has(id))
      throw new Error(`Duplicate operationId in ${target}: ${id}`)
    ids.add(id)
  }
  return { target, path, document, entries }
}

async function main() {
  const loaded = await Promise.all(
    specs.map((spec) => loadSpec(spec.target, spec.path)),
  )
  await rm(generatedDirectory, { recursive: true, force: true })
  const project = new Project({
    compilerOptions: { target: 99, module: 99, strict: true },
    manipulationSettings: {
      quoteKind: QuoteKind.Single,
      useTrailingCommas: true,
    },
  })

  for (const spec of loaded) {
    const directory = resolve(generatedDirectory, spec.target)
    const openApiAst = await openapiTS(spec.document, { alphabetize: false })
    project.createSourceFile(
      resolve(directory, 'openapi.ts'),
      removeGeneratedComments(astToString(openApiAst)),
      { overwrite: true },
    )
    project.createSourceFile(
      resolve(directory, 'operations.ts'),
      createOperationsSource(spec.entries),
      { overwrite: true },
    )
    project.createSourceFile(
      resolve(directory, 'enums.ts'),
      createEnumsSource(spec.document),
      { overwrite: true },
    )
    project.createSourceFile(
      resolve(directory, 'filters.ts'),
      createFiltersSource(spec.entries),
      { overwrite: true },
    )
    project.createSourceFile(
      resolve(directory, 'problems.ts'),
      createProblemsSource(spec.document, spec.entries),
      { overwrite: true },
    )
    project.createSourceFile(
      resolve(directory, 'metadata.ts'),
      createMetadataSource(spec.document, spec.entries),
      { overwrite: true },
    )
    project.createSourceFile(
      resolve(directory, 'paths.ts'),
      createPathsSource(spec.entries),
      { overwrite: true },
    )
    project.createSourceFile(
      resolve(directory, 'index.ts'),
      createTargetIndexSource(),
      { overwrite: true },
    )
  }

  project.createSourceFile(
    resolve(generatedDirectory, 'manifest.ts'),
    `import * as app from './app/index.js'\nimport * as data from './data/index.js'\n\nexport const sdkManifest = { app, data } as const\n`,
    { overwrite: true },
  )
  project.createSourceFile(
    resolve(generatedDirectory, 'index.ts'),
    `export * as app from './app/index.js'\nexport * as data from './data/index.js'\nexport * from './manifest.js'\n`,
    { overwrite: true },
  )

  for (const sourceFile of project.getSourceFiles()) {
    if (!sourceFile.getFilePath().endsWith('/openapi.ts'))
      sourceFile.formatText()
  }
  await project.save()
  console.log(
    loaded
      .map(
        (spec) =>
          `Generated ${spec.entries.length} ${spec.target} operations from ${spec.path}`,
      )
      .join('\n'),
  )
}

await main()
