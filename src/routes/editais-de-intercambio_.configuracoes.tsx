import { createFileRoute } from '@tanstack/react-router'

import { ExchangeNoticeSettingsPage } from '@/exchange/ExchangeNoticeSettingsPage'

export const Route = createFileRoute('/editais-de-intercambio_/configuracoes')({
  component: ExchangeNoticeSettingsPage,
})
