import type { CurriculumPlannerStaticDataSource } from '@pomi/planner-domain/curriculum'
import { createApiCurriculumPlannerStaticDataSource as createSource } from '@/features/curriculum-planner/data/curriculumPlannerApi'

const source: CurriculumPlannerStaticDataSource = createSource()

export function createCurriculumCatalogDataSource(): CurriculumPlannerStaticDataSource {
  return source
}

export function loadCurriculumCatalog() {
  return source.load()
}
