import { isCurriculumDraft, isRecord } from './draftValidation'
import type { CurriculumPlannerStateStore } from '@pomi/planner-domain/curriculum'

export function createLocalStorageCurriculumPlannerStateStore({
  key,
  storage,
}: Readonly<{
  key: string
  storage?: Storage
}>): CurriculumPlannerStateStore {
  return {
    async read() {
      const raw = (storage ?? window.localStorage).getItem(key)
      if (raw === null) return Promise.resolve(null)
      let value: unknown
      try {
        value = JSON.parse(raw)
      } catch {
        throw new Error(
          'Não foi possível recuperar o rascunho. Os dados originais foram preservados.',
        )
      }
      if (
        !isRecord(value) ||
        value.version !== 1 ||
        !isCurriculumDraft(value.state)
      )
        throw new Error(
          'Este formato de rascunho não pôde ser recuperado. Os dados originais foram preservados.',
        )
      return Promise.resolve(value)
    },
    write(state) {
      ;(storage ?? window.localStorage).setItem(key, JSON.stringify(state))
      return Promise.resolve()
    },
    clear() {
      ;(storage ?? window.localStorage).removeItem(key)
      return Promise.resolve()
    },
  }
}
