import type {
  ExchangeNotice,
  ExchangeNoticeQuery,
} from '@/features/exchange/data/exchangeApi'

export type ExchangeNoticeFilters = Readonly<{
  search: string
  issuers: ReadonlyArray<string>
  placeIds: ReadonlyArray<number>
  registrationStartAfter: string
  registrationStartBefore: string
  registrationEndAfter: string
  registrationEndBefore: string
  sortField: 'registrationStart' | 'registrationEnd'
  sortDirection: 'asc' | 'desc'
}>

export const defaultExchangeNoticeFilters: ExchangeNoticeFilters = {
  search: '',
  issuers: [],
  placeIds: [],
  registrationStartAfter: '',
  registrationStartBefore: '',
  registrationEndAfter: '',
  registrationEndBefore: '',
  sortField: 'registrationEnd',
  sortDirection: 'desc',
}

export function buildExchangeNoticeQuery(
  filters: ExchangeNoticeFilters,
  search = filters.search,
): ExchangeNoticeQuery {
  const filter = {
    ...(filters.issuers.length ? { issuer: { in: [...filters.issuers] } } : {}),
    ...(filters.placeIds.length
      ? { placeId: { in: [...filters.placeIds] } }
      : {}),
    ...(filters.registrationStartAfter || filters.registrationStartBefore
      ? {
          registrationStart: {
            ...(filters.registrationStartAfter
              ? { gte: filters.registrationStartAfter }
              : {}),
            ...(filters.registrationStartBefore
              ? { lte: filters.registrationStartBefore }
              : {}),
          },
        }
      : {}),
    ...(filters.registrationEndAfter || filters.registrationEndBefore
      ? {
          registrationEnd: {
            ...(filters.registrationEndAfter
              ? { gte: filters.registrationEndAfter }
              : {}),
            ...(filters.registrationEndBefore
              ? { lte: filters.registrationEndBefore }
              : {}),
          },
        }
      : {}),
  }
  return {
    ...(search.trim() ? { q: search.trim() } : {}),
    ...(Object.keys(filter).length ? { filter } : {}),
  }
}

export function processExchangeNotices(
  notices: ReadonlyArray<ExchangeNotice>,
  filters: ExchangeNoticeFilters,
) {
  return [...notices].sort((left, right) => {
    const leftDate = left[filters.sortField]
    const rightDate = right[filters.sortField]
    if (!leftDate && !rightDate) return right.id - left.id
    if (!leftDate) return 1
    if (!rightDate) return -1
    const comparison = leftDate.localeCompare(rightDate)
    if (comparison === 0) return right.id - left.id
    return filters.sortDirection === 'asc' ? comparison : -comparison
  })
}

export function localDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
