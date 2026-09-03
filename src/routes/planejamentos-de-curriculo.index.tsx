import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

import { CurriculumPlannerPage } from '@/planner/CurriculumPlannerPage'
import { useOptionalAuth } from '@/auth/AuthProvider'

export const Route = createFileRoute('/planejamentos-de-curriculo/')({
  component: CurriculumPlanningSelectionPage,
})

function CurriculumPlanningSelectionPage() {
  const auth = useOptionalAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (auth.initialized && !auth.isAuthenticated)
      void navigate({ to: '/planejamentos-de-curriculo/novo', replace: true })
  }, [auth.initialized, auth.isAuthenticated, navigate])

  return <CurriculumPlannerPage />
}
