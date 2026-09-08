import type {
  CurriculumPlannerStateStore,
} from '@pomi/planner-domain/curriculum'

export function createLocalStorageCurriculumPlannerStateStore({
  key,
  storage = window.localStorage,
}: Readonly<{
  key: string
  storage?: Storage
}>): CurriculumPlannerStateStore {
  return {
    read() {
      const raw = storage.getItem(key)
      return Promise.resolve(raw === null ? null : JSON.parse(raw))
    },
    write(state) {
      storage.setItem(key, JSON.stringify(state))
      return Promise.resolve()
    },
    clear() {
      storage.removeItem(key)
      return Promise.resolve()
    },
  }
}
