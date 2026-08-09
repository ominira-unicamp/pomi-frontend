import type { CurriculumPlannerCommand } from './domain/curriculumPlanner'

export type PlannerDispatch = (
  command: CurriculumPlannerCommand,
) => Promise<boolean>
