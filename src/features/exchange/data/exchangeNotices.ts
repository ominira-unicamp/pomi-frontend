import type { ExchangeNotice } from '@/features/exchange/data/exchangeApi'

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

export function normalizeExchangeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLocaleLowerCase('pt-BR')
}

function withinRange(value: string | null, after: string, before: string) {
  if (!after && !before) return true
  if (!value) return false
  return (!after || value >= after) && (!before || value <= before)
}

export function processExchangeNotices(
  notices: ReadonlyArray<ExchangeNotice>,
  filters: ExchangeNoticeFilters,
) {
  const search = normalizeExchangeSearch(filters.search.trim())
  const filtered = notices.filter((notice) => {
    const matchesSearch = [notice.title, notice.number, notice.place?.name]
      .filter((value): value is string => Boolean(value))
      .some((value) => normalizeExchangeSearch(value).includes(search))
    if (search && !matchesSearch) return false
    if (
      filters.issuers.length > 0 &&
      (!notice.issuer || !filters.issuers.includes(notice.issuer))
    )
      return false
    if (
      filters.placeIds.length > 0 &&
      (!notice.place || !filters.placeIds.includes(notice.place.id))
    )
      return false
    return (
      withinRange(
        notice.registrationStart,
        filters.registrationStartAfter,
        filters.registrationStartBefore,
      ) &&
      withinRange(
        notice.registrationEnd,
        filters.registrationEndAfter,
        filters.registrationEndBefore,
      )
    )
  })

  return [...filtered].sort((left, right) => {
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
