import { createPomiSdk } from './generatedClient'
import { createCourseCatalogApi } from './courseCatalog'
import { createCurriculumPersistenceApi } from './curriculumPersistence'
import { createCurriculumPlannerApi } from './curriculumPlanner'
import { createCurriculumPrerequisitesApi } from './curriculumPrerequisites'
import { createCurriculumSuggestionsApi } from './curriculumSuggestions'
import { createDailyMenuApi } from './dailyMenu'
import { createExchangeApi } from './exchange'
import { createFeedbackApi } from './feedback'
import { createSharedPeriodPlanningApi } from './sharedPeriodPlanning'
import { createStudentAbsencesApi } from './studentAbsences'
import { createStudentInterestsApi } from './studentInterests'
import { createStudentSocialApi } from './studentSocial'
import { createStudentApi } from './student'
import { createSemesterPlanningApi } from './semesterPlanning'
import { createTagTaxonomyApi } from './tagTaxonomy'
import type { PomiSdkOptions } from './generatedClient'

export function createPomiApi(options: PomiSdkOptions) {
  const client = createPomiSdk(options)

  return {
    documentation: {
      publicDocsUrl: () => new URL('/public-docs', options.dataApiUrl).href,
    },
    courseCatalog: createCourseCatalogApi(client),
    curriculumPersistence: createCurriculumPersistenceApi(client),
    curriculumPlanner: createCurriculumPlannerApi(client),
    curriculumPrerequisites: createCurriculumPrerequisitesApi(client),
    curriculumSuggestions: createCurriculumSuggestionsApi(client),
    dailyMenu: createDailyMenuApi(client),
    exchange: createExchangeApi(client),
    feedback: createFeedbackApi(client),
    sharedPeriodPlanning: createSharedPeriodPlanningApi(client),
    studentAbsences: createStudentAbsencesApi(client),
    studentInterests: createStudentInterestsApi(client),
    student: createStudentApi(client),
    semesterPlanning: createSemesterPlanningApi(client),
    studentSocial: createStudentSocialApi(client),
    tagTaxonomy: createTagTaxonomyApi(client),
  }
}
