import { createFileRoute } from '@tanstack/react-router'
import { readReturnTo } from '@/lib/navigation'

import { ExchangeNoticeSettingsPage } from '@/features/exchange'

export const Route = createFileRoute('/editais-de-intercambio_/configuracoes')({
  validateSearch: (search: Record<string, unknown>): { returnTo?: string } => ({ returnTo: readReturnTo(search.returnTo) }),
  component: ExchangeNoticeSettingsPage,
})
