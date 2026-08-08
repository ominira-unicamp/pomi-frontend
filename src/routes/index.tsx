import { createFileRoute } from '@tanstack/react-router'

import { CurriculumPlannerPage } from '@/planner/CurriculumPlannerPage'

export const Route = createFileRoute('/')({
  component: PlanningPage,
})

function PlanningPage() {
  return <CurriculumPlannerPage />
}
