export type SortDirection = 'asc' | 'desc'

export type SortTerm<TField extends string = string> = Readonly<{
  field: TField
  direction: SortDirection
}>

export type SortInput<TField extends string> = readonly [
  SortTerm<TField>,
  ...Array<SortTerm<TField>>,
]

export function serializeSortInput(value: unknown) {
  if (!Array.isArray(value) || value.length === 0)
    throw new TypeError('sort must be a non-empty array')

  const fields = new Set<string>()
  return value
    .map((term) => {
      if (
        typeof term !== 'object' ||
        term === null ||
        !('field' in term) ||
        typeof term.field !== 'string' ||
        term.field.length === 0 ||
        term.field.includes(',') ||
        term.field.includes(':') ||
        !('direction' in term) ||
        (term.direction !== 'asc' && term.direction !== 'desc')
      ) {
        throw new TypeError(
          'sort terms must contain a valid field and direction',
        )
      }
      if (fields.has(term.field))
        throw new TypeError(`duplicate sort field: ${term.field}`)
      fields.add(term.field)
      return `${term.field}:${term.direction}`
    })
    .join(',')
}
