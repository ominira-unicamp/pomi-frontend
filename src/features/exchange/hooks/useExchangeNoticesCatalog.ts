import { readExchangeSearch } from '@/lib/navigation'
import type { ExchangeSearch, NavigationOptions } from '@/lib/navigation'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'

import type { ExchangeNoticeFilters } from '@/features/exchange/data/exchangeNotices'
import {
  listExchangeNotices,
  listExchangePlaces,
} from '@/features/exchange/data/exchangeApi'
import {
  buildExchangeNoticeQuery,
  defaultExchangeNoticeFilters,
  processExchangeNotices,
} from '@/features/exchange/data/exchangeNotices'
import { publicQueryKeys } from '@/integrations/tanstack-query/queryKeys'

const pageSize = 20

export function useExchangeNoticesCatalog(
  search?: ExchangeSearch,
  onSearchChange?: (
    search: ExchangeSearch,
    options?: NavigationOptions,
  ) => void,
) {
  const [localSearch, setLocalSearch] = useState<ExchangeSearch>({})
  const currentSearch = search ?? localSearch
  const filters = useMemo<ExchangeNoticeFilters>(
    () => ({
      ...defaultExchangeNoticeFilters,
      ...Object.fromEntries(
        Object.entries(currentSearch).filter(
          ([key, value]) => key !== 'page' && value !== undefined,
        ),
      ),
    }),
    [currentSearch],
  )
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search)
  const requestedPage = currentSearch.page ?? 1
  const changeSearch = onSearchChange ?? setLocalSearch
  useEffect(() => {
    const timeout = window.setTimeout(
      () => setDebouncedSearch(filters.search),
      300,
    )
    return () => window.clearTimeout(timeout)
  }, [filters.search])
  const noticeQuery = buildExchangeNoticeQuery(filters, debouncedSearch)
  const noticesQuery = useQuery({
    queryKey: publicQueryKeys.exchangeNotices(noticeQuery),
    queryFn: () => listExchangeNotices(noticeQuery),
    retry: false,
  })
  const noticeOptionsQuery = useQuery({
    queryKey: publicQueryKeys.exchangeNotices(),
    queryFn: () => listExchangeNotices(),
    staleTime: 5 * 60_000,
    retry: false,
  })
  const placesQuery = useQuery({
    queryKey: publicQueryKeys.exchangePlaces(),
    queryFn: listExchangePlaces,
    staleTime: 5 * 60_000,
    retry: false,
  })
  const notices = noticesQuery.data ?? []
  const places = placesQuery.data ?? []
  const issuers = useMemo(
    () =>
      [
        ...new Set(
          (noticeOptionsQuery.data ?? [])
            .map((notice) => notice.issuer)
            .filter(Boolean),
        ),
      ]
        .filter((issuer): issuer is string => typeof issuer === 'string')
        .sort((left, right) => left.localeCompare(right, 'pt-BR')),
    [noticeOptionsQuery.data],
  )
  const processed = useMemo(
    () => processExchangeNotices(notices, filters),
    [filters, notices],
  )
  const totalPages = Math.max(1, Math.ceil(processed.length / pageSize))
  const page = noticesQuery.isSuccess
    ? Math.min(requestedPage, totalPages)
    : requestedPage
  const setPage = (page: number) =>
    changeSearch(readExchangeSearch({ ...currentSearch, page }))
  const visible = processed.slice((page - 1) * pageSize, page * pageSize)

  const changeFilters = (next: ExchangeNoticeFilters) => {
    const nextSearch = readExchangeSearch({ ...next, page: 1 })
    if (onSearchChange)
      onSearchChange(nextSearch, { replace: next.search !== filters.search })
    else setLocalSearch(nextSearch)
  }

  return {
    filters,
    changeFilters,
    page,
    setPage,
    notices,
    places,
    issuers,
    processed,
    totalPages,
    visible,
    noticesQuery,
  }
}
