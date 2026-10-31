import { createFileRoute } from '@tanstack/react-router'

import { CourseSituationPage } from '@/features/course-situation'

export const Route = createFileRoute('/situacao-do-curso')({
  component: CourseSituationPage,
})
