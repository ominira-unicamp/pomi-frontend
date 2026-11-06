import { createFileRoute } from '@tanstack/react-router'

import { ExchangeNoticeSettingsPage } from '@/features/exchange'

export const Route = createFileRoute('/editais-de-intercambio_/configuracoes')({
  component: ExchangeNoticeSettingsPage,
})
