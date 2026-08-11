import { createFileRoute } from '@tanstack/react-router'

import { CourseSituationPage } from '@/student/CourseSituationPage'

export const Route = createFileRoute('/situacao-do-curso')({
  component: CourseSituationPage,
})
