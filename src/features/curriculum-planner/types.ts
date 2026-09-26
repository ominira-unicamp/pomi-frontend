import type { CurriculumPlannerCommand } from '@pomi/planner-domain/curriculum'

export type PlannerDispatch = (
  command: CurriculumPlannerCommand,
) => Promise<boolean>
