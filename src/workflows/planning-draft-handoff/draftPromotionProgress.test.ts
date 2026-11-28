import { beforeEach, expect, it } from 'vitest'
import { emptyGuide } from '@pomi/planner-domain/semester'
import { readPromotionProgress, writePromotionProgress } from './draftPromotionProgress'
import type { PlanningDraftHandoff } from '@/planning-drafts/data/planningDraftHandoff'

const draft: PlanningDraftHandoff = {
  version: 1,
  kind: 'semester',
  document: {
    name: 'Rascunho',
    studyPeriodId: 1,
    curriculumId: null,
    classIds: [],
    guide: emptyGuide(),
  },
}
beforeEach(() => window.sessionStorage.clear())
it('keeps an uncertain creation marker and scopes it to the account and exact draft', () => {
  writePromotionProgress('account-a', draft)
  expect(readPromotionProgress('account-a', draft)).toBeTruthy()
  expect(readPromotionProgress('account-b', draft)).toBeUndefined()
  expect(
    readPromotionProgress('account-a', {
      ...draft,
      document: { ...draft.document, name: 'Outro' },
    }),
  ).toBeUndefined()
})
it('recovers a known creation without submitting another POST', () => {
  writePromotionProgress('account-a', draft, undefined, 42)
  expect(readPromotionProgress('account-a', draft)?.createdId).toBe(42)
})
