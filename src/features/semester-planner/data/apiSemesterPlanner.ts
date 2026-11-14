import { patchSemesterPlanning } from './semesterPlanningApi'
import type {
  SemesterPlanner,
  SemesterPlannerCommand,
  SemesterPlannerResult,
} from '@pomi/planner-domain/semester'

export function createApiSemesterPlanner({
  planner,
  userId,
  planningId,
  getAccessToken,
  onSavingChange,
}: Readonly<{
  planner: SemesterPlanner
  userId?: number
  planningId?: number
  getAccessToken: () => Promise<string>
  onSavingChange?: (saving: boolean) => void
}>): SemesterPlanner {
  return {
    getStaticData: planner.getStaticData,
    getSnapshot: planner.getSnapshot,
    evaluateClass: planner.evaluateClass,
    async dispatch(
      command: SemesterPlannerCommand,
    ): Promise<SemesterPlannerResult> {
      const result = await planner.dispatch(command)
      if (!result.ok || !userId || !planningId) return result
      const snapshot = await planner.getSnapshot()
      if (!snapshot.ok) return snapshot
      try {
        onSavingChange?.(true)
        await patchSemesterPlanning(
          userId,
          planningId,
          snapshot.value.document,
          getAccessToken,
        )
        return result
      } catch {
        return { ok: false, error: { code: 'unavailable' } }
      } finally {
        onSavingChange?.(false)
      }
    },
  }
}
