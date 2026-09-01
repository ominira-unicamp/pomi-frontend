import { createFileRoute } from '@tanstack/react-router'

import { ExchangeNoticesPage } from '@/exchange/ExchangeNoticesPage'

export const Route = createFileRoute('/editais-de-intercambio')({
  component: ExchangeNoticesPage,
})
