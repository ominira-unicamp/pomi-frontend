import { createFileRoute } from '@tanstack/react-router'

import { SemesterPlanningSelectionPage } from '@/semester-planner/SemesterPlanningSelectionPage'

export const Route = createFileRoute('/planejamentos-de-semestre/')({
  component: SemesterPlanningSelectionPage,
})
