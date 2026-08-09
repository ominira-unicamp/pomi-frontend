import { createFileRoute } from '@tanstack/react-router'

import { CurriculumPlannerPage } from '@/planner/CurriculumPlannerPage'

export const Route = createFileRoute('/planejamentos/$planejamentoId')({
  component: PlanningRoute,
})

function PlanningRoute() {
  const { planejamentoId } = Route.useParams()
  return <CurriculumPlannerPage curriculumId={planejamentoId} />
}
