export {
  PomiClient,
  createPomiClient,
  type PomiClientOptions,
  type PomiFetch,
} from './client'
export {
  ApiError,
  expectApiResponse,
  isApiError,
  isProblemType,
  throwApiError,
  type ApiProblemDetails,
  type ApiProblemField,
} from './errors'
export {
  PomiSdk,
  createPomiSdk,
  type AppOperationApi,
  type DataOperationApi,
  type PomiFetch as GeneratedPomiFetch,
  type PomiRequestContext,
  type PomiSdkClient,
  type PomiSdkOptions,
} from './generatedClient'
export * as generated from './generated'
export { collectPages as collectGeneratedPages } from './generatedPagination'
export { createPomiApi } from './api'
export type {
  ApiTarget,
  AuthenticationMode,
  EndpointDefinition,
  EndpointRequestContext,
  HttpMethod,
  QueryObject,
  QueryValue,
} from './endpoint'
export * as courseCatalog from './courseCatalog'
export * as curriculumPersistence from './curriculumPersistence'
export * as curriculumPlanner from './curriculumPlanner'
export * as curriculumPrerequisites from './curriculumPrerequisites'
export * as curriculumSuggestions from './curriculumSuggestions'
export * as dailyMenu from './dailyMenu'
export * as exchange from './exchange'
export * as feedback from './feedback'
export * as sharedPeriodPlanning from './sharedPeriodPlanning'
export * as studentAbsences from './studentAbsences'
export * as studentInterests from './studentInterests'
export * as student from './student'
export * as semesterPlanning from './semesterPlanning'
export * as studentSocial from './studentSocial'
export * as tagTaxonomy from './tagTaxonomy'
