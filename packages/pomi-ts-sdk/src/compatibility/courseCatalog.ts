import type { listCoursesInput } from '../generated/data/operations.js'

export type LegacyListCoursesInput = Readonly<{
  q?: string
  unitId?: number
  catalogYear?: number
  tagId?: number
  page: number
  pageSize?: number
}>

const filterAliases = {
  q: 'code',
  unitId: 'unit.id',
  catalogYear: 'catalogYear',
  tagId: 'tagId',
} as const

type CourseFilter = NonNullable<listCoursesInput['filter']>

function assignFilter(
  filter: CourseFilter,
  path: (typeof filterAliases)[keyof typeof filterAliases],
  value: string | number,
) {
  if (path === 'unit.id') {
    filter.unit = { id: value as number }
    return
  }
  if (path === 'code') filter.code = value as string
  if (path === 'catalogYear') filter.catalogYear = value as number
  if (path === 'tagId') filter.tagId = value as number
}

export function legacyListCoursesInput(
  input: LegacyListCoursesInput,
): listCoursesInput {
  const filter: CourseFilter = {}
  for (const [name, path] of Object.entries(filterAliases) as Array<
    [
      keyof typeof filterAliases,
      (typeof filterAliases)[keyof typeof filterAliases],
    ]
  >) {
    const value = input[name]
    if (value) assignFilter(filter, path, value)
  }
  return {
    page: input.page,
    pageSize: input.pageSize ?? 20,
    filter,
  }
}
