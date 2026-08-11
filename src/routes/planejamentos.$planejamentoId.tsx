import { createFileRoute } from '@tanstack/react-router'

import { CurriculumPlannerPage } from '@/planner/CurriculumPlannerPage'
import { CurriculumPlannerProvider } from '@/planner/CurriculumPlannerProvider'

export const Route = createFileRoute('/planejamentos/$planejamentoId')({
  component: PlanningRoute,
})

function PlanningRoute() {
  const { planejamentoId } = Route.useParams()
  return (
    <CurriculumPlannerProvider>
      <CurriculumPlannerPage curriculumId={planejamentoId} />
    </CurriculumPlannerProvider>
  )
}
