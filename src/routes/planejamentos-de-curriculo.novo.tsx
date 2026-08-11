import { createFileRoute } from '@tanstack/react-router'

import { CurriculumPlanCreationPage } from '@/planner/CurriculumPlanCreationPage'

export const Route = createFileRoute('/planejamentos-de-curriculo/novo')({
  component: CurriculumPlanCreationPage,
})
