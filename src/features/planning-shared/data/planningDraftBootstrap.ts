import type { CurriculumPlannerState } from '@pomi/planner-domain/curriculum'
import type { SemesterPlanningDocument } from '@pomi/planner-domain/semester'

export const curriculumDraftBootstrapKey = [
  'curriculum-planner',
  'draft-bootstrap',
] as const

export const semesterDraftBootstrapKey = [
  'semester-planner',
  'draft-bootstrap',
] as const

export type CurriculumDraftBootstrap = Readonly<{
  name: string
  state: CurriculumPlannerState
}>

export type SemesterDraftBootstrap = SemesterPlanningDocument
