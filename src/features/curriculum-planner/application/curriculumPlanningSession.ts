import type { CurriculumPlanner, CurriculumPlannerCommand, CurriculumPlannerSnapshot, PlannerError } from '@pomi/planner-domain/curriculum'

export class PlannerResultError extends Error {
  constructor(readonly plannerError: PlannerError) {
    super(plannerError.code)
  }
}
export async function unwrapPlannerResult<T>(
  operation: Promise<
    { ok: true; value: T } | { ok: false; error: PlannerError }
  >,
) {
  const result = await operation
  if (!result.ok) throw new PlannerResultError(result.error)
  return result.value
}
export function createCurriculumPlanningSession(planner: CurriculumPlanner) {
  let active = true
  const isActive = () => active
  let queue = Promise.resolve()
  let state: {
    snapshot?: CurriculumPlannerSnapshot
    error?: PlannerError
    loading: boolean
  } = { loading: true }
  const listeners = new Set<() => void>()
  function publish(next: typeof state) {
    if (isActive()) {
      state = next
      listeners.forEach((listener) => listener())
    }
  }
  async function refresh() {
    const result = await planner.getSnapshot()
    if (result.ok) publish({ snapshot: result.value, loading: false })
    else publish({ error: result.error, loading: false })
  }
  const initialized = refresh()
  return {
    dispatch(
      command: CurriculumPlannerCommand,
      before: () => Promise<void>,
      after: (snapshot: CurriculumPlannerSnapshot) => void,
    ) {
      const operation = queue.then(async () => {
        await initialized
        if (!isActive()) return false
        const snapshot = await unwrapPlannerResult(planner.getSnapshot())
        await before()
        if (!isActive()) return false
        await unwrapPlannerResult(
          planner.dispatch(command, { expectedRevision: snapshot.revision }),
        )
        const next = await unwrapPlannerResult(planner.getSnapshot())
        if (!isActive()) return false
        publish({ snapshot: next, loading: false })
        after(next)
        return true
      })
      queue = operation.then(
        () => undefined,
        () => undefined,
      )
      return operation
    },
    getState: () => state,
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    refresh,
    async settled() {
      await queue
    },
    activate() {
      active = true
    },
    dispose() {
      active = false
      listeners.clear()
    },
  }
}
