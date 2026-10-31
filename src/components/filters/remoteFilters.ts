import type { FilterOperator } from './filterTypes'

type FilterCapabilities = Readonly<{
  fields: ReadonlyArray<
    Readonly<{ path: ReadonlyArray<string>; operators: ReadonlyArray<string> }>
  >
}>

export function remoteOperators(
  capabilities: FilterCapabilities,
  path: string,
): ReadonlyArray<FilterOperator> {
  const field = capabilities.fields.find(
    (candidate) => candidate.path.join('.') === path,
  )
  if (!field) throw new Error(`Missing remote filter capability: ${path}`)
  return field.operators as ReadonlyArray<FilterOperator>
}
