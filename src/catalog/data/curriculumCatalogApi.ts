import type { CurriculumPlannerStaticDataSource } from '@/planner/domain/curriculumPlanner'
import { createApiCurriculumPlannerStaticDataSource as createSource } from '@/planner/data/curriculumPlannerApi'

const source: CurriculumPlannerStaticDataSource = createSource()

export function createCurriculumCatalogDataSource(): CurriculumPlannerStaticDataSource {
  return source
}

export function loadCurriculumCatalog() {
  return source.load()
}
