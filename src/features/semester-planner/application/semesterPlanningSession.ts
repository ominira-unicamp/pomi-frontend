import { createInMemorySemesterPlanner } from '@pomi/planner-domain/semester'
import type {
  SemesterPlanner,
  SemesterPlannerCommand,
  SemesterPlannerSnapshot,
  SemesterPlannerStaticData,
  SemesterPlanningDocument,
} from '@pomi/planner-domain/semester'

export type SemesterSaveStatus = 'clean' | 'dirty' | 'saving' | 'error'
export type SemesterSessionState = Readonly<{
  snapshot?: SemesterPlannerSnapshot
  confirmed: SemesterPlanningDocument
  saveStatus: SemesterSaveStatus
}>

export function createSemesterPlanningSession({
  data,
  document,
  save,
  onConfirmed,
}: {
  onConfirmed?: () => void
  data: SemesterPlannerStaticData
  document: SemesterPlanningDocument
  save?: (
    document: SemesterPlanningDocument,
  ) => Promise<SemesterPlanningDocument>
}) {
  let planner = createInMemorySemesterPlanner({
    staticData: data,
    initialDocument: document,
  })
  let state: SemesterSessionState = { confirmed: document, saveStatus: 'clean' }
  let active = true
  const isActive = () => active
  let sequence = 0
  let confirmedSequence = 0
  let commands = Promise.resolve()
  let saving: Promise<boolean> | undefined
  const listeners = new Set<() => void>()
  function publish(next: SemesterSessionState) {
    if (!isActive()) return
    state = next
    listeners.forEach((listener) => listener())
  }
  async function persist(): Promise<boolean> {
    if (!isActive()) return false
    if (!save) return true
    if (saving) return saving
    saving = (async () => {
      while (isActive() && confirmedSequence < sequence && state.snapshot) {
        const sentSequence = sequence
        const sent = state.snapshot.document
        publish({ ...state, saveStatus: 'saving' })
        try {
          const confirmed = await save(sent)
          if (!isActive()) return false
          confirmedSequence = sentSequence
          onConfirmed?.()
          publish({
            ...state,
            confirmed,
            saveStatus: confirmedSequence === sequence ? 'clean' : 'dirty',
          })
        } catch {
          publish({ ...state, saveStatus: 'error' })
          return false
        }
      }
      return isActive()
    })().finally(() => {
      saving = undefined
    })
    return saving
  }
  const initialize = planner.getSnapshot().then((result) => {
    if (result.ok && !state.snapshot)
      publish({ ...state, snapshot: result.value })
  })
  const dispatch: SemesterPlanner['dispatch'] = (
    command: SemesterPlannerCommand,
  ) => {
    const operation = commands.then(async () => {
      await initialize
      if (!isActive())
        return { ok: false, error: { code: 'unavailable' } } as const
      const result = await planner.dispatch(command)
      if (!result.ok || !isActive()) return result
      const snapshot = await planner.getSnapshot()
      if (!snapshot.ok) return snapshot
      sequence += 1
      const failed = state.saveStatus === 'error'
      publish({
        ...state,
        snapshot: snapshot.value,
        saveStatus: save ? (failed ? 'error' : 'dirty') : 'clean',
      })
      if (save && !failed) void persist()
      return result
    })
    commands = operation.then(
      () => undefined,
      () => undefined,
    )
    return operation
  }
  return {
    dispatch,
    updateData(nextData: SemesterPlannerStaticData) {
      const operation = commands.then(async () => {
        await initialize
        if (!isActive()) return
        planner = createInMemorySemesterPlanner({
          staticData: nextData,
          initialDocument: state.snapshot?.document ?? document,
        })
        const next = await planner.getSnapshot()
        if (next.ok) publish({ ...state, snapshot: next.value })
      })
      commands = operation.then(
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
    async flush() {
      await commands
      return persist()
    },
    dispose() {
      active = false
      listeners.clear()
    },
    activate() {
      active = true
    },
    hasPending: () => Boolean(save) && confirmedSequence < sequence,
  }
}
