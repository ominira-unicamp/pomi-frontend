import { serializePlanning } from '@pomi/planner-domain/transfer'
import type { SemesterPlanningFileV2 } from '@pomi/planner-domain/transfer'
import type {
  CurriculumPlannerSnapshot,
  CurriculumPlannerStateStore,
  CurriculumPlannerStaticData,
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

function downloadJson(value: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(value, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function downloadPlanning(
  snapshot: CurriculumPlannerSnapshot,
  staticData: CurriculumPlannerStaticData,
  name?: string,
) {
  downloadJson(
    serializePlanning(snapshot, staticData, { name }),
    'curriculo-pomi.json',
  )
}

export function downloadSemesterPlanning(file: SemesterPlanningFileV2) {
  downloadJson(
    file,
    `pomi-planejamento-de-semestre-${file.semesterPlanning.studyPeriod.code}.json`,
  )
}
