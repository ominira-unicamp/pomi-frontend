import type { CurriculumDocument } from '@/features/curriculum-planner/data/curriculumPersistenceApi'
import type { PlanningDraftHandoff } from '@/planning-drafts/data/planningDraftHandoff'
import { isRecord } from '@/planning-drafts/data/draftValidation'

const key = 'pomi:planning-draft-handoff:progress:v1'
type Progress = {
  subject: string
  fingerprint: string
  document?: CurriculumDocument
  createdId?: number
}
export function readPromotionProgress(
  subject: string,
  handoff: PlanningDraftHandoff,
): Progress | undefined {
  const raw = window.sessionStorage.getItem(key)
  if (!raw) return undefined
  const value: unknown = JSON.parse(raw)
  if (
    !isRecord(value) ||
    value.subject !== subject ||
    value.fingerprint !== JSON.stringify(handoff)
  )
    return undefined
  if (
    value.document !== undefined &&
    (!isRecord(value.document) ||
      typeof value.document.id !== 'number' ||
      !Array.isArray(value.document.periods) ||
      !Array.isArray(value.document.courses))
  )
    throw new Error(
      'O progresso do rascunho não pôde ser recuperado. Os dados foram preservados.',
    )
  return value as Progress
}
export function writePromotionProgress(
  subject: string,
  handoff: PlanningDraftHandoff,
  document?: CurriculumDocument,
  createdId?: number,
) {
  window.sessionStorage.setItem(
    key,
    JSON.stringify({
      subject,
      fingerprint: JSON.stringify(handoff),
      document,
      createdId,
    } satisfies Progress),
  )
}
export function clearPromotionProgress() {
  window.sessionStorage.removeItem(key)
}
