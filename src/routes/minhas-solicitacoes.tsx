import { createFileRoute } from '@tanstack/react-router'

import { FeedbackReportsPage } from '@/feedback/FeedbackReportsPage'

export const Route = createFileRoute('/minhas-solicitacoes')({
  component: FeedbackReportsPage,
})
