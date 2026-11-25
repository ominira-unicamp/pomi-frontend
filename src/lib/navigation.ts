export type NavigationSearch = Record<string, unknown>
export type NavigationOptions = { replace?: boolean; resetScroll?: boolean }

export function readText(value: unknown) {
  return typeof value === 'string' && value.trim() ? value : undefined
}

export function readPositiveInteger(value: unknown) {
  const number = typeof value === 'string' ? Number(value) : value
  return typeof number === 'number' &&
    Number.isSafeInteger(number) &&
    number > 0
    ? number
    : undefined
}

function choice<T extends string>(value: unknown, options: ReadonlyArray<T>) {
  return options.includes(value as T) ? (value as T) : undefined
}

export type SituationSearch = {
  action?: 'profile' | 'import'
  tab?: 'history' | 'curriculum'
  studyPeriodId?: number
  curriculumTab?: 'proposal' | 'dependencies' | 'about'
  dependencyCourseId?: number
  hideCompleted?: boolean
}

export function readSituationSearch(search: NavigationSearch): SituationSearch {
  return {
    action: choice(search.action, ['profile', 'import']),
    tab: choice(search.tab, ['history', 'curriculum']),
    studyPeriodId: readPositiveInteger(search.studyPeriodId),
    curriculumTab: choice(search.curriculumTab, [
      'proposal',
      'dependencies',
      'about',
    ]),
    dependencyCourseId: readPositiveInteger(search.dependencyCourseId),
    hideCompleted:
      search.hideCompleted === true ||
      search.hideCompleted === 'true' ||
      undefined,
  }
}

export function readPeopleSearch(search: NavigationSearch) {
  return { q: readText(search.q) }
}

export type ManagedEventsSearch = {
  status?: 'DRAFT' | 'PUBLISHED' | 'CANCELLED'
}

export function readManagedEventsSearch(
  search: NavigationSearch,
): ManagedEventsSearch {
  return { status: choice(search.status, ['DRAFT', 'PUBLISHED', 'CANCELLED']) }
}

const exchangeDateKeys = [
  'registrationStartAfter',
  'registrationStartBefore',
  'registrationEndAfter',
  'registrationEndBefore',
] as const

export type ExchangeSearch = {
  search?: string
  issuers?: Array<string>
  placeIds?: Array<number>
  registrationStartAfter?: string
  registrationStartBefore?: string
  registrationEndAfter?: string
  registrationEndBefore?: string
  sortField?: 'registrationStart'
  sortDirection?: 'asc'
  page?: number
}

function readDate(value: unknown) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return undefined
  const date = new Date(value)
  return Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
    ? value
    : undefined
}

export function readExchangeSearch(search: NavigationSearch): ExchangeSearch {
  const issuers = Array.isArray(search.issuers)
    ? [
        ...new Set(
          search.issuers.flatMap((value) =>
            readText(value) ? [String(value)] : [],
          ),
        ),
      ]
    : []
  const placeIds = Array.isArray(search.placeIds)
    ? [
        ...new Set(
          search.placeIds.flatMap((value) =>
            readPositiveInteger(value) ? [readPositiveInteger(value)!] : [],
          ),
        ),
      ]
    : []
  const page = readPositiveInteger(search.page)
  return {
    search: readText(search.search),
    issuers: issuers.length ? issuers : undefined,
    placeIds: placeIds.length ? placeIds : undefined,
    ...Object.fromEntries(
      exchangeDateKeys.map((key) => [key, readDate(search[key])]),
    ),
    sortField: choice(search.sortField, ['registrationStart']),
    sortDirection: choice(search.sortDirection, ['asc']),
    page: page && page > 1 ? page : undefined,
  }
}

function readCatalogSearch(search: NavigationSearch): NavigationSearch {
  return {
    q: readText(search.q),
    ...Object.fromEntries(
      [
        'catalogId',
        'programId',
        'catalogProgramId',
        'catalogProgramVariantId',
        'dependencyCourseId',
      ].map((key) => [key, readPositiveInteger(search[key])]),
    ),
    tab: choice(search.tab, ['proposal', 'dependencies', 'about']),
  }
}

function readTaxonomySearch(search: NavigationSearch): NavigationSearch {
  return {
    q: readText(search.q),
    categoryId: readPositiveInteger(search.categoryId),
    interests:
      search.interests === true || search.interests === 'true' || undefined,
    order: choice(search.order, ['asc', 'desc']),
    page: readPositiveInteger(search.page),
  }
}

function originSearch(
  pathname: string,
  search: NavigationSearch,
): NavigationSearch | undefined {
  if (pathname === '/disciplinas')
    return {
      q: readText(search.q),
      unitId: readPositiveInteger(search.unitId),
      catalogYear: readPositiveInteger(search.catalogYear),
      tagId: readPositiveInteger(search.tagId),
      page: readPositiveInteger(search.page),
    }
  if (/^\/cursos(?:\/[1-9]\d*)?$/.test(pathname))
    return readCatalogSearch(search)
  if (pathname === '/situacao-do-curso') return readSituationSearch(search)
  if (pathname === '/pessoas') return readPeopleSearch(search)
  if (pathname === '/eventos')
    return { period: choice(search.period, ['past', 'undated']) }
  if (/^\/grupos\/[1-9]\d*\/gerenciar\/eventos$/.test(pathname))
    return readManagedEventsSearch(search)
  if (/^\/grupos\/[1-9]\d*$/.test(pathname)) return {}
  if (/^\/planejamentos-de-curriculo\/(?:[1-9]\d*|rascunho)$/.test(pathname))
    return {}
  if (/^\/taxonomia(?:\/tags\/[1-9]\d*)?$/.test(pathname))
    return readTaxonomySearch(search)
  if (pathname === '/editais-de-intercambio') return readExchangeSearch(search)
  return undefined
}

export function parseNavigationSearch(
  params: URLSearchParams,
): NavigationSearch {
  return Object.fromEntries(
    [...params].map(([key, value]) => {
      try {
        return [key, JSON.parse(value)]
      } catch {
        return [key, value]
      }
    }),
  )
}

export function navigationHref(pathname: string, search: NavigationSearch) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(search)) {
    if (value === undefined || value === null) continue
    let encoded = typeof value === 'string' ? value : JSON.stringify(value)
    if (typeof value === 'string') {
      try {
        JSON.parse(value)
        encoded = JSON.stringify(value)
      } catch {}
    }
    params.set(key, encoded)
  }
  return pathname + (params.size ? `?${params}` : '')
}

export function readReturnTo(value: unknown, currentPathname?: string) {
  if (
    typeof value !== 'string' ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    /[\\\x00-\x1f]/.test(value)
  )
    return undefined
  try {
    const url = new URL(value, 'https://pomi.invalid')
    const pathname = url.pathname.replace(/\/$/, '') || '/'
    if (
      url.origin !== 'https://pomi.invalid' ||
      pathname === currentPathname?.replace(/\/$/, '')
    )
      return undefined
    const search = originSearch(
      pathname,
      parseNavigationSearch(url.searchParams),
    )
    return search ? navigationHref(pathname, search) : undefined
  } catch {
    return undefined
  }
}

export function returnLabel(returnTo: string) {
  const pathname = returnTo.split('?')[0]
  if (pathname.startsWith('/planejamentos-de-curriculo/'))
    return 'Voltar ao planejamento'
  if (pathname.startsWith('/cursos')) return 'Voltar ao currículo oficial'
  if (pathname === '/situacao-do-curso') return 'Voltar à situação do curso'
  if (pathname.startsWith('/taxonomia')) return 'Voltar à tag e aos resultados'
  if (pathname.includes('/gerenciar/eventos'))
    return 'Voltar aos eventos do grupo'
  if (pathname.startsWith('/grupos/')) return 'Voltar ao grupo'
  return 'Voltar aos resultados'
}

export function isContextualDestination(to: unknown) {
  return (
    typeof to === 'string' &&
    (to === '/disciplinas/$courseId' ||
      to === '/perfis/$publicId' ||
      to === '/eventos/$eventId' ||
      to === '/editais-de-intercambio/configuracoes' ||
      /^\/grupos\/\$groupId\/gerenciar\/eventos\/(?:\$eventId(?:\/editar)?|novo)$/.test(
        to,
      ))
  )
}
