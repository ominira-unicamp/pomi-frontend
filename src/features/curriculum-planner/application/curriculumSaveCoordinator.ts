import type { CurriculumPlannerSnapshot } from '@pomi/planner-domain/curriculum'

export type CurriculumSaveStatus = 'idle' | 'pending' | 'saving' | 'error'

export function createCurriculumSaveCoordinator(
  persist: (snapshot: CurriculumPlannerSnapshot) => Promise<void>,
) {
  let active = true
  const isActive = () => active
  let pending: CurriculumPlannerSnapshot | undefined
  let status: CurriculumSaveStatus = 'idle'
  let timer: ReturnType<typeof setTimeout> | undefined
  let writing: Promise<boolean> | undefined
  const listeners = new Set<() => void>()
  function update(next: CurriculumSaveStatus) {
    if (!isActive()) return
    status = next
    listeners.forEach((listener) => listener())
  }
  async function flush(): Promise<boolean> {
    if (timer) clearTimeout(timer)
    if (!isActive()) return false
    if (writing) return writing
    writing = (async () => {
      while (isActive() && pending) {
        const sent = pending
        pending = undefined
        update('saving')
        try {
          await persist(sent)
          if (!isActive()) return false
        } catch {
          pending ??= sent
          update('error')
          return false
        }
      }
      update('idle')
      return isActive()
    })().finally(() => {
      writing = undefined
    })
    return writing
  }
  return {
    schedule(snapshot: CurriculumPlannerSnapshot) {
      if (!isActive()) return
      pending = snapshot
      if (status === 'error') return
      update('pending')
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        void flush()
      }, 500)
    },
    flush,
    getStatus: () => status,
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    activate() {
      active = true
    },
    dispose() {
      active = false
      if (timer) clearTimeout(timer)
      pending = undefined
      listeners.clear()
    },
  }
}
