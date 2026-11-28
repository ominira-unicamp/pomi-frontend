import { createFileRoute } from '@tanstack/react-router'
import { ExchangeNoticesPage } from '@/features/exchange'
import { readExchangeSearch } from '@/lib/navigation'

export const Route = createFileRoute('/editais-de-intercambio')({
  validateSearch: readExchangeSearch,
  component: ExchangeRoute,
})

function ExchangeRoute() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  return (
    <ExchangeNoticesPage
      search={search}
      onSearchChange={(next, options) =>
        void navigate({ search: next, ...options })
      }
    />
  )
}
