import { createFileRoute } from '@tanstack/react-router'

import { FeedbackReportsPage } from '@/features/feedback'

export const Route = createFileRoute('/minhas-solicitacoes')({
  component: FeedbackReportsPage,
})
