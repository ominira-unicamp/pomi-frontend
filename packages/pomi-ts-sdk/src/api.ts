import { createPomiClient } from './client'
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
import type { PomiClientOptions } from './client'

export function createPomiApi(options: PomiClientOptions) {
  const client = createPomiClient(options)

  return {
    documentation: {
      publicDocsUrl: () => client.dataApiUrlFor('/public-docs'),
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
