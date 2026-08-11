import { createFileRoute } from '@tanstack/react-router'

import { CurriculumPlannerPage } from '@/planner/CurriculumPlannerPage'
import { CurriculumPlannerProvider } from '@/planner/CurriculumPlannerProvider'
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
        <CurriculumPlannerProvider>
          <CurriculumPlannerPage curriculumId={planejamentoId} />
        </CurriculumPlannerProvider>
      </PlanningDraftGate>
    )
  }
  return (
    <PlanningAccessGate kind="curriculum">
      <CurriculumPlannerProvider>
        <CurriculumPlannerPage curriculumId={planejamentoId} />
      </CurriculumPlannerProvider>
    </PlanningAccessGate>
  )
}
