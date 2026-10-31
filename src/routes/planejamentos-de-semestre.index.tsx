import { createFileRoute } from '@tanstack/react-router'

import { SemesterPlanningSelectionPage } from '@/features/semester-planner'

export const Route = createFileRoute('/planejamentos-de-semestre/')({
  component: SemesterPlanningSelectionPage,
})
