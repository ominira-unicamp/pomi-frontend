import { useSemesterPlanner } from './useSemesterPlanner'
import { SemesterPlannerWorkspace } from './SemesterPlannerWorkspace'

export function SemesterPlannerPage({
  planningId = 'rascunho',
}: {
  planningId?: string
}) {
  const controller = useSemesterPlanner({ planningId })
  return <SemesterPlannerWorkspace controller={controller} />
}
