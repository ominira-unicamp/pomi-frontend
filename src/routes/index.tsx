import { createFileRoute } from '@tanstack/react-router'

import { CurriculumPlannerPage } from '@/planner/CurriculumPlannerPage'
import { CurriculumPlannerProvider } from '@/planner/CurriculumPlannerProvider'

export const Route = createFileRoute('/')({
  component: PlanningPage,
})

function PlanningPage() {
  return (
    <CurriculumPlannerProvider>
      <CurriculumPlannerPage showSelection />
    </CurriculumPlannerProvider>
  )
}
