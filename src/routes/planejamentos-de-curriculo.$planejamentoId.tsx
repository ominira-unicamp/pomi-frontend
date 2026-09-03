import { createFileRoute } from '@tanstack/react-router'

import { CurriculumPlannerPage } from '@/planner/CurriculumPlannerPage'
import {
  PlanningAccessGate,
  PlanningDraftGate,
} from '@/planner/components/PlanningDraftGate'

export const Route = createFileRoute(
  '/planejamentos-de-curriculo/$planejamentoId',
)({
  component: PlanningRoute,
})

function PlanningRoute() {
  const { planejamentoId } = Route.useParams()
  if (planejamentoId === 'rascunho') {
    return (
      <PlanningDraftGate kind="curriculum">
        <CurriculumPlannerPage curriculumId={planejamentoId} />
      </PlanningDraftGate>
    )
  }
  return (
    <PlanningAccessGate kind="curriculum">
      <CurriculumPlannerPage curriculumId={planejamentoId} />
    </PlanningAccessGate>
  )
}
