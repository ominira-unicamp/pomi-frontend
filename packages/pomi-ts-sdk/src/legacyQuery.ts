import {
  operationDefinitions as appOperationDefinitions,
} from './generated/app/operations.js'
import {
  operationDefinitions as dataOperationDefinitions,
} from './generated/data/operations.js'
import type {
  ApiTarget,
  EndpointDefinition,
  QueryObject,
  QueryValue,
} from './endpoint'

type FilterPath = ReadonlyArray<string>
type FilterField = Readonly<{ path: FilterPath }>
type GeneratedOperation = Readonly<{
  target: ApiTarget
  method: string
  path: string
  query: Readonly<{
    parameters: ReadonlyArray<Readonly<{ name: string }>>
    filter: Readonly<{ fields: ReadonlyArray<FilterField> }> | null
  }>
}>

const legacyFilterAliases: Readonly<
  Record<string, Readonly<Partial<Record<string, FilterPath>>>>
> = {
  'data:/courses': {
    q: ['code'],
    unitId: ['unit', 'id'],
    catalogYear: ['catalogYear'],
    tagId: ['tagId'],
  },
  'data:/catalog-courses': {
    courseId: ['courseId'],
    catalogId: ['catalogId'],
  },
  'data:/classes': {
    courseId: ['courseId'],
    studyPeriodId: ['studyPeriodId'],
  },
  'data:/class-schedules': {
    courseId: ['course', 'id'],
    studyPeriodId: ['studyPeriod', 'id'],
  },
  'data:/curriculum-suggestions': {
    catalogProgramId: ['catalogProgramId'],
  },
  'data:/catalogs': {
    year: ['year'],
  },
  'data:/daily-menus': {
    startDate: ['date', 'gte'],
    endDate: ['date', 'lte'],
  },
  'app:/student/{}/professor-evaluations/pending': {
    year: ['year'],
    yearPeriod: ['yearPeriod'],
  },
  'app:/student/{}/shared-period-plannings': {
    ownerPublicId: ['ownerPublicId'],
  },
}

function normalizePath(path: string) {
  return path
    .replace(/:[^/]+/g, '{}')
    .replace(/\{[^}]+\}/g, '{}')
}

function generatedOperationFor(
  definition: EndpointDefinition<unknown, unknown>,
): GeneratedOperation | undefined {
  if (typeof definition.path !== 'string') return undefined
  const definitions = (
    definition.target === 'data'
      ? Object.values(dataOperationDefinitions)
      : Object.values(appOperationDefinitions)
  ) as ReadonlyArray<GeneratedOperation>
  const path = normalizePath(definition.path)
  return definitions.find(
    (candidate) =>
      candidate.method === definition.method &&
      normalizePath(candidate.path) === path,
  )
}

function setFilterValue(
  filter: Record<string, QueryValue>,
  path: FilterPath,
  value: QueryValue,
) {
  const [head, ...tail] = path
  if (!head) return
  if (tail.length === 0) {
    filter[head] = value
    return
  }
  const child = filter[head]
  const nested: Record<string, QueryValue> = isQueryObject(child)
    ? { ...child }
    : {}
  setFilterValue(nested, tail, value)
  filter[head] = nested
}

function isQueryObject(value: QueryValue): value is QueryObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function translateLegacyQuery(
  definition: EndpointDefinition<unknown, unknown>,
  query: Readonly<Record<string, QueryValue>>,
): Readonly<Record<string, QueryValue>> {
  const generated = generatedOperationFor(definition)
  if (!generated?.query.filter) return query

  const directParameters = new Set(
    generated.query.parameters.map((parameter) => parameter.name),
  )
  const filterFields = new Set(
    generated.query.filter.fields.map((field) => field.path.join('.')),
  )
  const aliases =
    legacyFilterAliases[
      `${definition.target}:${normalizePath(generated.path)}`
    ] ?? {}
  const result: Record<string, QueryValue> = {}
  const filter: Record<string, QueryValue> = {}

  for (const [name, value] of Object.entries(query)) {
    if (directParameters.has(name)) {
      result[name] = value
      continue
    }
    const path = aliases[name] ?? (filterFields.has(name) ? [name] : undefined)
    if (!path) {
      result[name] = value
      continue
    }
    setFilterValue(filter, path, value)
  }

  if (Object.keys(filter).length > 0) result.filter = filter
  return result
}
