import { createFileRoute } from '@tanstack/react-router'

import { CurriculumPlannerPage } from '@/planner/CurriculumPlannerPage'
import { CurriculumPlannerProvider } from '@/planner/CurriculumPlannerProvider'

export const Route = createFileRoute('/planejamentos-de-curriculo/')({
  component: CurriculumPlanningSelectionPage,
})

function CurriculumPlanningSelectionPage() {
  return (
    <CurriculumPlannerProvider>
      <CurriculumPlannerPage showSelection />
    </CurriculumPlannerProvider>
  )
}
