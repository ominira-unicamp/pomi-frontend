import { createFileRoute } from '@tanstack/react-router'
import { AdminFeedbackReportsPage } from '@/features/feedback'

export const Route = createFileRoute('/admin/feedbacks')({
  component: AdminFeedbackReportsPage,
})
