import { createFileRoute } from '@tanstack/react-router'

import { SemesterPlanCreationPage } from '@/features/semester-planner'

export const Route = createFileRoute('/planejamentos-de-semestre/novo')({
  component: SemesterPlanCreationPage,
})
