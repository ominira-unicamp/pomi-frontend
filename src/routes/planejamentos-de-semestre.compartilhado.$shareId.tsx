import { createFileRoute } from '@tanstack/react-router'

import { SharedSemesterPlanningPage } from '@/features/planning-shared'

export const Route = createFileRoute(
  '/planejamentos-de-semestre/compartilhado/$shareId',
)({
  component: SharedSemesterPlanningRoute,
})

function SharedSemesterPlanningRoute() {
  const { shareId } = Route.useParams()
  return <SharedSemesterPlanningPage shareId={shareId} />
}
