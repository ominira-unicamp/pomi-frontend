import { createFileRoute } from '@tanstack/react-router'

import { ExchangeNoticesPage } from '@/features/exchange'

export const Route = createFileRoute('/editais-de-intercambio')({
  component: ExchangeNoticesPage,
})
