import { createFileRoute } from '@tanstack/react-router'

import { CurriculumPlannerPage } from '@/features/curriculum-planner'
import {
  PlanningAccessGate,
  PlanningDraftGate,
} from '@/features/planning-shared'

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
