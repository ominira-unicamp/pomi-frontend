import {
  Outlet,
  createFileRoute,
  useParams,
  useRouterState,
} from '@tanstack/react-router'

import { CurriculumPlannerProvider } from '@/planner/CurriculumPlannerProvider'

export const Route = createFileRoute('/planejamentos-de-curriculo')({
  component: CurriculumPlanningLayout,
})

function CurriculumPlanningLayout() {
  const params = useParams({ strict: false })
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const routeShowsSelection = /^\/planejamentos-de-curriculo\/?$/.test(pathname)

  return (
    <CurriculumPlannerProvider
      routeCurriculumId={params.planejamentoId}
      routeShowsSelection={routeShowsSelection}
    >
      <Outlet />
    </CurriculumPlannerProvider>
  )
}
