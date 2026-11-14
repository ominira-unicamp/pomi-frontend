import { isCurriculumDraft, isRecord, isSemesterDraft } from './draftValidation'
import type { CurriculumPlannerState } from '@pomi/planner-domain/curriculum'
import type { SemesterPlanningDocument } from '@pomi/planner-domain/semester'

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

export type PlanningDraftHandoff = CurriculumDraftHandoff | SemesterDraftHandoff

export type DraftHandoffRead =
  | { status: 'ready'; handoff: PlanningDraftHandoff }
  | { status: 'missing' | 'invalid' | 'unavailable' }

export function saveDraftHandoff(handoff: PlanningDraftHandoff) {
  if (typeof window === 'undefined')
    throw new Error('Armazenamento indisponível.')
  window.sessionStorage.setItem(storageKey, JSON.stringify(handoff))
}

export function readDraftHandoff(): DraftHandoffRead {
  let raw: string | null
  try {
    if (typeof window === 'undefined') return { status: 'unavailable' }
    raw = window.sessionStorage.getItem(storageKey)
  } catch {
    return { status: 'unavailable' }
  }
  if (raw === null) return { status: 'missing' }
  try {
    const value: unknown = JSON.parse(raw)
    if (!isRecord(value) || value.version !== 1) return { status: 'invalid' }
    if (
      value.kind === 'curriculum' &&
      typeof value.name === 'string' &&
      isCurriculumDraft(value.state)
    )
      return {
        status: 'ready',
        handoff: {
          version: 1,
          kind: 'curriculum',
          name: value.name,
          state: value.state,
        },
      }
    if (value.kind === 'semester' && isSemesterDraft(value.document))
      return {
        status: 'ready',
        handoff: { version: 1, kind: 'semester', document: value.document },
      }
    return { status: 'invalid' }
  } catch {
    return { status: 'invalid' }
  }
}

export function loadDraftHandoff(): PlanningDraftHandoff | undefined {
  const result = readDraftHandoff()
  return result.status === 'ready' ? result.handoff : undefined
}

export function clearDraftHandoff() {
  try {
    if (typeof window !== 'undefined')
      window.sessionStorage.removeItem(storageKey)
  } catch {}
}
