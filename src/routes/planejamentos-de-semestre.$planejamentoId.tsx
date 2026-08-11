import { createFileRoute } from '@tanstack/react-router'

import { SemesterPlannerPage } from '@/semester-planner/SemesterPlannerPage'

export const Route = createFileRoute(
  '/planejamentos-de-semestre/$planejamentoId',
)({
  component: SemesterPlanningRoute,
})

function SemesterPlanningRoute() {
  const { planejamentoId } = Route.useParams()
  return <SemesterPlannerPage planningId={planejamentoId} />
}
