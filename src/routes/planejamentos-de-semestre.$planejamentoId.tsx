import { createFileRoute } from '@tanstack/react-router'

import { SemesterPlannerPage } from '@/features/semester-planner'
import {
  PlanningAccessGate,
  PlanningDraftGate,
} from '@/features/planning-shared'

export const Route = createFileRoute(
  '/planejamentos-de-semestre/$planejamentoId',
)({
  component: SemesterPlanningRoute,
})

function SemesterPlanningRoute() {
  const { planejamentoId } = Route.useParams()
  if (planejamentoId === 'rascunho') {
    return (
      <PlanningDraftGate kind="semester">
        <SemesterPlannerPage planningId={planejamentoId} />
      </PlanningDraftGate>
    )
  }
  return (
    <PlanningAccessGate kind="semester">
      <SemesterPlannerPage planningId={planejamentoId} />
    </PlanningAccessGate>
  )
}
