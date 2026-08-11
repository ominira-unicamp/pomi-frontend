import { createFileRoute } from '@tanstack/react-router'

import { SemesterPlanCreationPage } from '@/semester-planner/SemesterPlanCreationPage'

export const Route = createFileRoute('/planejamentos-de-semestre/novo')({
  component: SemesterPlanCreationPage,
})
