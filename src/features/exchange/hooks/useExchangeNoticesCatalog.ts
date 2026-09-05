import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

import type { ExchangeNoticeFilters } from '@/features/exchange/data/exchangeNotices'
import {
  listExchangeNotices,
  listExchangePlaces,
} from '@/features/exchange/data/exchangeApi'
import {
  defaultExchangeNoticeFilters,
  processExchangeNotices,
} from '@/features/exchange/data/exchangeNotices'
import { publicQueryKeys } from '@/integrations/tanstack-query/queryKeys'

const pageSize = 20

export function useExchangeNoticesCatalog() {
  const [filters, setFilters] = useState(defaultExchangeNoticeFilters)
  const [page, setPage] = useState(1)
  const noticesQuery = useQuery({
    queryKey: publicQueryKeys.exchangeNotices(),
    queryFn: listExchangeNotices,
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
      [...new Set(notices.map((notice) => notice.issuer).filter(Boolean))]
        .filter((issuer): issuer is string => typeof issuer === 'string')
        .sort((left, right) => left.localeCompare(right, 'pt-BR')),
    [notices],
  )
  const processed = useMemo(
    () => processExchangeNotices(notices, filters),
    [filters, notices],
  )
  const totalPages = Math.max(1, Math.ceil(processed.length / pageSize))
  const visible = processed.slice((page - 1) * pageSize, page * pageSize)

  const changeFilters = (next: ExchangeNoticeFilters) => {
    setFilters(next)
    setPage(1)
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
