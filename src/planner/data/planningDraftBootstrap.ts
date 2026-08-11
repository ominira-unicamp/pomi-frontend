import type { CurriculumPlannerState } from '@/planner/domain/curriculumPlanner'
import type { SemesterPlanningDocument } from '@/semester-planner/domain/semesterPlanner'

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
