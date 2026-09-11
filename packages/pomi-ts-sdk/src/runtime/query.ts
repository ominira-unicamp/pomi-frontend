import type { GeneratedOperationDefinition } from './operation.js'

type QueryRecord = Readonly<Record<string, unknown>>

function appendValue(
  parameters: URLSearchParams,
  name: string,
  value: unknown,
) {
  if (value === undefined || value === null) return
  if (Array.isArray(value)) {
    for (const item of value) appendValue(parameters, name, item)
    return
  }
  if (typeof value === 'object') {
    for (const [key, nestedValue] of Object.entries(value as QueryRecord)) {
      appendValue(parameters, `${name}[${key}]`, nestedValue)
    }
    return
  }
  parameters.append(name, String(value))
}

export function buildQuery(
  input: QueryRecord,
  queryParameters: ReadonlyArray<string>,
) {
  const parameters = new URLSearchParams()
  const orderedParameters = [...queryParameters].sort((left, right) => {
    const priority = (name: string) =>
      name === 'page' ? 0 : name === 'pageSize' ? 1 : 2
    return priority(left) - priority(right)
  })
  for (const name of orderedParameters)
    appendValue(parameters, name, input[name])
  return parameters.toString()
}

export function buildPath(
  template: string,
  input: QueryRecord,
  pathParameters: ReadonlyArray<string>,
) {
  return template.replace(/\{([^}]+)\}/g, (_, name: string) => {
    if (!pathParameters.includes(name)) {
      throw new TypeError(`Undeclared path parameter: ${name}`)
    }
    const value = input[name]
    if (value === undefined || value === null || value === '') {
      throw new TypeError(`Missing path parameter: ${name}`)
    }
    return encodeURIComponent(String(value))
  })
}

export function buildOperationUrl(
  definition: Pick<
    GeneratedOperationDefinition,
    'path' | 'pathParameters' | 'queryParameters'
  >,
  input: QueryRecord,
) {
  const path = buildPath(definition.path, input, definition.pathParameters)
  const query = buildQuery(input, definition.queryParameters)
  return query ? `${path}?${query}` : path
}
