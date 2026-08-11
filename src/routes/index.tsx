import { createFileRoute } from '@tanstack/react-router'

import { HomePage } from '@/home/HomePage'

export const Route = createFileRoute('/')({
  component: PlanningPage,
})

function PlanningPage() {
  return <HomePage />
}
