import type { CurriculumPlannerState } from '@/planner/domain/curriculumPlanner'
import type { SemesterPlanningDocument } from '@/semester-planner/domain/semesterPlanner'

const storageKey = 'pomi:planning-draft-handoff:v1'

type CurriculumDraftHandoff = Readonly<{
  version: 1
  kind: 'curriculum'
  name: string
  state: CurriculumPlannerState
}>

type SemesterDraftHandoff = Readonly<{
  version: 1
  kind: 'semester'
  document: SemesterPlanningDocument
}>

export type PlanningDraftHandoff =
  | CurriculumDraftHandoff
  | SemesterDraftHandoff

function canUseSessionStorage() {
  return typeof window !== 'undefined' && Boolean(window.sessionStorage)
}

export function saveDraftHandoff(handoff: PlanningDraftHandoff) {
  if (!canUseSessionStorage()) return
  window.sessionStorage.setItem(storageKey, JSON.stringify(handoff))
}

export function loadDraftHandoff(): PlanningDraftHandoff | undefined {
  if (!canUseSessionStorage()) return undefined
  try {
    const value: unknown = JSON.parse(
      window.sessionStorage.getItem(storageKey) ?? 'null',
    )
    if (!value || typeof value !== 'object') return undefined
    const handoff = value as Partial<PlanningDraftHandoff>
    if (handoff.version !== 1 || !['curriculum', 'semester'].includes(String(handoff.kind)))
      return undefined
    if (handoff.kind === 'curriculum' && handoff.state && typeof handoff.name === 'string')
      return handoff as CurriculumDraftHandoff
    if (handoff.kind === 'semester' && handoff.document)
      return handoff as SemesterDraftHandoff
    return undefined
  } catch {
    return undefined
  }
}

export function clearDraftHandoff() {
  if (!canUseSessionStorage()) return
  window.sessionStorage.removeItem(storageKey)
}
