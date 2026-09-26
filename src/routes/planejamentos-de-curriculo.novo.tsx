import { createFileRoute } from '@tanstack/react-router'

import { CurriculumPlanCreationPage } from '@/features/curriculum-planner'

export const Route = createFileRoute('/planejamentos-de-curriculo/novo')({
  component: CurriculumPlanCreationPage,
})
