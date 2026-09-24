import type { SortInput } from '../../runtime/sorting.js'
import type { operations } from './openapi.js'
import type { GeneratedOperationDefinition } from '../../runtime/operation.js'

type ParameterRecord<T> = [NonNullable<T>] extends [never] ? {} : NonNullable<T>
type RequestBodyOf<T> = T extends { requestBody: { content: infer Content } }
    ? Content[keyof Content]
    : never
type BodyInput<Body, Required extends boolean> = [Body] extends [never]
    ? {}
    : Required extends true
    ? { body: Body }
    : { body?: Body }
type HeaderInput<Header> = [NonNullable<Header>] extends [never]
    ? {}
    : { headers?: NonNullable<Header> }
type SortQuery<Query, SortField extends string> = ParameterRecord<Query> extends infer Parameters
    ? Parameters extends { sort: unknown }
    ? Omit<Parameters, 'sort'> & { sort: SortInput<SortField> }
    : Omit<Parameters, 'sort'> & { sort?: SortInput<SortField> }
    : never
type OperationInput<Path, Query, Header, Body, BodyRequired extends boolean> =
    ParameterRecord<Path> & ParameterRecord<Query> & HeaderInput<Header> & BodyInput<Body, BodyRequired>

export type acceptStudentFriendshipInput = OperationInput<operations["acceptStudentFriendship"]['parameters']['path'], operations["acceptStudentFriendship"]['parameters']['query'], operations["acceptStudentFriendship"]['parameters']['header'], RequestBodyOf<operations["acceptStudentFriendship"]>, false>
export type acceptStudentFriendshipOutput = import('./domain.js').StudentFriendship
export type acceptStudentFriendshipProblem = operations["acceptStudentFriendship"]['responses'][400]['content']["application/problem+json"] | operations["acceptStudentFriendship"]['responses'][404]['content']["application/problem+json"] | operations["acceptStudentFriendship"]['responses'][409]['content']["application/problem+json"] | operations["acceptStudentFriendship"]['responses'][500]['content']["application/problem+json"]
export type addCourseTagInput = OperationInput<operations["addCourseTag"]['parameters']['path'], operations["addCourseTag"]['parameters']['query'], operations["addCourseTag"]['parameters']['header'], RequestBodyOf<operations["addCourseTag"]>, false>
export type addCourseTagOutput = void
export type addCourseTagProblem = operations["addCourseTag"]['responses'][400]['content']["application/problem+json"] | operations["addCourseTag"]['responses'][422]['content']["application/problem+json"] | operations["addCourseTag"]['responses'][500]['content']["application/problem+json"]
export type createAuthUserInput = OperationInput<operations["createAuthUser"]['parameters']['path'], operations["createAuthUser"]['parameters']['query'], operations["createAuthUser"]['parameters']['header'], RequestBodyOf<operations["createAuthUser"]>, true>
export type createAuthUserOutput = import('./domain.js').AuthUser
export type createAuthUserProblem = operations["createAuthUser"]['responses'][400]['content']["application/problem+json"] | operations["createAuthUser"]['responses'][500]['content']["application/problem+json"]
export type createCategoryInput = OperationInput<operations["createCategory"]['parameters']['path'], operations["createCategory"]['parameters']['query'], operations["createCategory"]['parameters']['header'], RequestBodyOf<operations["createCategory"]>, true>
export type createCategoryOutput = import('./domain.js').Category
export type createCategoryProblem = operations["createCategory"]['responses'][400]['content']["application/problem+json"] | operations["createCategory"]['responses'][409]['content']["application/problem+json"] | operations["createCategory"]['responses'][500]['content']["application/problem+json"]
export type createFeedbackReportInput = OperationInput<operations["createFeedbackReport"]['parameters']['path'], operations["createFeedbackReport"]['parameters']['query'], operations["createFeedbackReport"]['parameters']['header'], RequestBodyOf<operations["createFeedbackReport"]>, true>
export type createFeedbackReportOutput = import('./domain.js').FeedbackReportAccepted
export type createFeedbackReportProblem = operations["createFeedbackReport"]['responses'][400]['content']["application/problem+json"] | operations["createFeedbackReport"]['responses'][404]['content']["application/problem+json"] | operations["createFeedbackReport"]['responses'][422]['content']["application/problem+json"] | operations["createFeedbackReport"]['responses'][429]['content']["application/problem+json"] | operations["createFeedbackReport"]['responses'][500]['content']["application/problem+json"]
export type createStudentAbsencesInput = OperationInput<operations["createStudentAbsences"]['parameters']['path'], operations["createStudentAbsences"]['parameters']['query'], operations["createStudentAbsences"]['parameters']['header'], RequestBodyOf<operations["createStudentAbsences"]>, true>
export type createStudentAbsencesOutput = import('./domain.js').StudentAbsence
export type createStudentAbsencesProblem = operations["createStudentAbsences"]['responses'][400]['content']["application/problem+json"] | operations["createStudentAbsences"]['responses'][409]['content']["application/problem+json"] | operations["createStudentAbsences"]['responses'][422]['content']["application/problem+json"] | operations["createStudentAbsences"]['responses'][500]['content']["application/problem+json"]
export type createStudentCourseAttemptsInput = OperationInput<operations["createStudentCourseAttempts"]['parameters']['path'], operations["createStudentCourseAttempts"]['parameters']['query'], operations["createStudentCourseAttempts"]['parameters']['header'], RequestBodyOf<operations["createStudentCourseAttempts"]>, true>
export type createStudentCourseAttemptsOutput = import('./domain.js').StudentCourseAttempt
export type createStudentCourseAttemptsProblem = operations["createStudentCourseAttempts"]['responses'][400]['content']["application/problem+json"] | operations["createStudentCourseAttempts"]['responses'][409]['content']["application/problem+json"] | operations["createStudentCourseAttempts"]['responses'][422]['content']["application/problem+json"] | operations["createStudentCourseAttempts"]['responses'][500]['content']["application/problem+json"]
export type createStudentCurriculaInput = OperationInput<operations["createStudentCurricula"]['parameters']['path'], operations["createStudentCurricula"]['parameters']['query'], operations["createStudentCurricula"]['parameters']['header'], RequestBodyOf<operations["createStudentCurricula"]>, true>
export type createStudentCurriculaOutput = import('./domain.js').Curriculum
export type createStudentCurriculaProblem = operations["createStudentCurricula"]['responses'][400]['content']["application/problem+json"] | operations["createStudentCurricula"]['responses'][422]['content']["application/problem+json"] | operations["createStudentCurricula"]['responses'][500]['content']["application/problem+json"]
export type createStudentFeedbackReportInput = OperationInput<operations["createStudentFeedbackReport"]['parameters']['path'], operations["createStudentFeedbackReport"]['parameters']['query'], operations["createStudentFeedbackReport"]['parameters']['header'], RequestBodyOf<operations["createStudentFeedbackReport"]>, true>
export type createStudentFeedbackReportOutput = import('./domain.js').FeedbackReportAccepted
export type createStudentFeedbackReportProblem = operations["createStudentFeedbackReport"]['responses'][400]['content']["application/problem+json"] | operations["createStudentFeedbackReport"]['responses'][404]['content']["application/problem+json"] | operations["createStudentFeedbackReport"]['responses'][422]['content']["application/problem+json"] | operations["createStudentFeedbackReport"]['responses'][500]['content']["application/problem+json"]
export type createStudentFriendshipInput = OperationInput<operations["createStudentFriendship"]['parameters']['path'], operations["createStudentFriendship"]['parameters']['query'], operations["createStudentFriendship"]['parameters']['header'], RequestBodyOf<operations["createStudentFriendship"]>, true>
export type createStudentFriendshipOutput = import('./domain.js').StudentFriendship
export type createStudentFriendshipProblem = operations["createStudentFriendship"]['responses'][400]['content']["application/problem+json"] | operations["createStudentFriendship"]['responses'][404]['content']["application/problem+json"] | operations["createStudentFriendship"]['responses'][409]['content']["application/problem+json"] | operations["createStudentFriendship"]['responses'][500]['content']["application/problem+json"]
export type createStudentHistoryInput = OperationInput<operations["createStudentHistory"]['parameters']['path'], operations["createStudentHistory"]['parameters']['query'], operations["createStudentHistory"]['parameters']['header'], RequestBodyOf<operations["createStudentHistory"]>, true>
export type createStudentHistoryOutput = import('./domain.js').StudentHistoryImportSummary
export type createStudentHistoryProblem = operations["createStudentHistory"]['responses'][400]['content']["application/problem+json"] | operations["createStudentHistory"]['responses'][404]['content']["application/problem+json"] | operations["createStudentHistory"]['responses'][422]['content']["application/problem+json"] | operations["createStudentHistory"]['responses'][500]['content']["application/problem+json"]
export type createStudentPeriodPlanningsInput = OperationInput<operations["createStudentPeriodPlannings"]['parameters']['path'], operations["createStudentPeriodPlannings"]['parameters']['query'], operations["createStudentPeriodPlannings"]['parameters']['header'], RequestBodyOf<operations["createStudentPeriodPlannings"]>, true>
export type createStudentPeriodPlanningsOutput = import('./domain.js').PeriodPlanning
export type createStudentPeriodPlanningsProblem = operations["createStudentPeriodPlannings"]['responses'][400]['content']["application/problem+json"] | operations["createStudentPeriodPlannings"]['responses'][422]['content']["application/problem+json"] | operations["createStudentPeriodPlannings"]['responses'][500]['content']["application/problem+json"]
export type createStudentsInput = OperationInput<operations["createStudents"]['parameters']['path'], operations["createStudents"]['parameters']['query'], operations["createStudents"]['parameters']['header'], RequestBodyOf<operations["createStudents"]>, true>
export type createStudentsOutput = import('./domain.js').Student
export type createStudentsProblem = operations["createStudents"]['responses'][400]['content']["application/problem+json"] | operations["createStudents"]['responses'][409]['content']["application/problem+json"] | operations["createStudents"]['responses'][422]['content']["application/problem+json"] | operations["createStudents"]['responses'][500]['content']["application/problem+json"]
export type createTagInput = OperationInput<operations["createTag"]['parameters']['path'], operations["createTag"]['parameters']['query'], operations["createTag"]['parameters']['header'], RequestBodyOf<operations["createTag"]>, true>
export type createTagOutput = import('./domain.js').Tag
export type createTagProblem = operations["createTag"]['responses'][400]['content']["application/problem+json"] | operations["createTag"]['responses'][409]['content']["application/problem+json"] | operations["createTag"]['responses'][422]['content']["application/problem+json"] | operations["createTag"]['responses'][500]['content']["application/problem+json"]
export type deleteCategoryInput = OperationInput<operations["deleteCategory"]['parameters']['path'], operations["deleteCategory"]['parameters']['query'], operations["deleteCategory"]['parameters']['header'], RequestBodyOf<operations["deleteCategory"]>, false>
export type deleteCategoryOutput = void
export type deleteCategoryProblem = operations["deleteCategory"]['responses'][400]['content']["application/problem+json"] | operations["deleteCategory"]['responses'][404]['content']["application/problem+json"] | operations["deleteCategory"]['responses'][409]['content']["application/problem+json"] | operations["deleteCategory"]['responses'][500]['content']["application/problem+json"]
export type deleteStudentAbsencesInput = OperationInput<operations["deleteStudentAbsences"]['parameters']['path'], operations["deleteStudentAbsences"]['parameters']['query'], operations["deleteStudentAbsences"]['parameters']['header'], RequestBodyOf<operations["deleteStudentAbsences"]>, false>
export type deleteStudentAbsencesOutput = void
export type deleteStudentAbsencesProblem = operations["deleteStudentAbsences"]['responses'][400]['content']["application/problem+json"] | operations["deleteStudentAbsences"]['responses'][404]['content']["application/problem+json"] | operations["deleteStudentAbsences"]['responses'][500]['content']["application/problem+json"]
export type deleteStudentCourseAttemptsInput = OperationInput<operations["deleteStudentCourseAttempts"]['parameters']['path'], operations["deleteStudentCourseAttempts"]['parameters']['query'], operations["deleteStudentCourseAttempts"]['parameters']['header'], RequestBodyOf<operations["deleteStudentCourseAttempts"]>, false>
export type deleteStudentCourseAttemptsOutput = void
export type deleteStudentCourseAttemptsProblem = operations["deleteStudentCourseAttempts"]['responses'][400]['content']["application/problem+json"] | operations["deleteStudentCourseAttempts"]['responses'][404]['content']["application/problem+json"] | operations["deleteStudentCourseAttempts"]['responses'][500]['content']["application/problem+json"]
export type deleteStudentCurriculaInput = OperationInput<operations["deleteStudentCurricula"]['parameters']['path'], operations["deleteStudentCurricula"]['parameters']['query'], operations["deleteStudentCurricula"]['parameters']['header'], RequestBodyOf<operations["deleteStudentCurricula"]>, false>
export type deleteStudentCurriculaOutput = void
export type deleteStudentCurriculaProblem = operations["deleteStudentCurricula"]['responses'][400]['content']["application/problem+json"] | operations["deleteStudentCurricula"]['responses'][404]['content']["application/problem+json"] | operations["deleteStudentCurricula"]['responses'][500]['content']["application/problem+json"]
export type deleteStudentFriendshipInput = OperationInput<operations["deleteStudentFriendship"]['parameters']['path'], operations["deleteStudentFriendship"]['parameters']['query'], operations["deleteStudentFriendship"]['parameters']['header'], RequestBodyOf<operations["deleteStudentFriendship"]>, false>
export type deleteStudentFriendshipOutput = void
export type deleteStudentFriendshipProblem = operations["deleteStudentFriendship"]['responses'][400]['content']["application/problem+json"] | operations["deleteStudentFriendship"]['responses'][404]['content']["application/problem+json"] | operations["deleteStudentFriendship"]['responses'][500]['content']["application/problem+json"]
export type deleteStudentPeriodPlanningsInput = OperationInput<operations["deleteStudentPeriodPlannings"]['parameters']['path'], operations["deleteStudentPeriodPlannings"]['parameters']['query'], operations["deleteStudentPeriodPlannings"]['parameters']['header'], RequestBodyOf<operations["deleteStudentPeriodPlannings"]>, false>
export type deleteStudentPeriodPlanningsOutput = void
export type deleteStudentPeriodPlanningsProblem = operations["deleteStudentPeriodPlannings"]['responses'][400]['content']["application/problem+json"] | operations["deleteStudentPeriodPlannings"]['responses'][404]['content']["application/problem+json"] | operations["deleteStudentPeriodPlannings"]['responses'][500]['content']["application/problem+json"]
export type deleteStudentsInput = OperationInput<operations["deleteStudents"]['parameters']['path'], operations["deleteStudents"]['parameters']['query'], operations["deleteStudents"]['parameters']['header'], RequestBodyOf<operations["deleteStudents"]>, true>
export type deleteStudentsOutput = void
export type deleteStudentsProblem = operations["deleteStudents"]['responses'][400]['content']["application/problem+json"] | operations["deleteStudents"]['responses'][404]['content']["application/problem+json"] | operations["deleteStudents"]['responses'][422]['content']["application/problem+json"] | operations["deleteStudents"]['responses'][500]['content']["application/problem+json"]
export type deleteStudentTagInterestInput = OperationInput<operations["deleteStudentTagInterest"]['parameters']['path'], operations["deleteStudentTagInterest"]['parameters']['query'], operations["deleteStudentTagInterest"]['parameters']['header'], RequestBodyOf<operations["deleteStudentTagInterest"]>, false>
export type deleteStudentTagInterestOutput = void
export type deleteStudentTagInterestProblem = operations["deleteStudentTagInterest"]['responses'][400]['content']["application/problem+json"] | operations["deleteStudentTagInterest"]['responses'][500]['content']["application/problem+json"]
export type deleteTagInput = OperationInput<operations["deleteTag"]['parameters']['path'], operations["deleteTag"]['parameters']['query'], operations["deleteTag"]['parameters']['header'], RequestBodyOf<operations["deleteTag"]>, false>
export type deleteTagOutput = void
export type deleteTagProblem = operations["deleteTag"]['responses'][400]['content']["application/problem+json"] | operations["deleteTag"]['responses'][404]['content']["application/problem+json"] | operations["deleteTag"]['responses'][409]['content']["application/problem+json"] | operations["deleteTag"]['responses'][500]['content']["application/problem+json"]
export type getCategoryInput = OperationInput<operations["getCategory"]['parameters']['path'], operations["getCategory"]['parameters']['query'], operations["getCategory"]['parameters']['header'], RequestBodyOf<operations["getCategory"]>, false>
export type getCategoryOutput = import('./domain.js').Category
export type getCategoryProblem = operations["getCategory"]['responses'][400]['content']["application/problem+json"] | operations["getCategory"]['responses'][404]['content']["application/problem+json"] | operations["getCategory"]['responses'][500]['content']["application/problem+json"]
export type getCurrentUserInput = OperationInput<operations["getCurrentUser"]['parameters']['path'], operations["getCurrentUser"]['parameters']['query'], operations["getCurrentUser"]['parameters']['header'], RequestBodyOf<operations["getCurrentUser"]>, false>
export type getCurrentUserOutput = import('./domain.js').CurrentUser
export type getCurrentUserProblem = operations["getCurrentUser"]['responses'][400]['content']["application/problem+json"] | operations["getCurrentUser"]['responses'][500]['content']["application/problem+json"]
export type getExchangeNoticeSubscriptionInput = OperationInput<operations["getExchangeNoticeSubscription"]['parameters']['path'], operations["getExchangeNoticeSubscription"]['parameters']['query'], operations["getExchangeNoticeSubscription"]['parameters']['header'], RequestBodyOf<operations["getExchangeNoticeSubscription"]>, false>
export type getExchangeNoticeSubscriptionOutput = import('./domain.js').ExchangeNoticeSubscription
export type getExchangeNoticeSubscriptionProblem = operations["getExchangeNoticeSubscription"]['responses'][400]['content']["application/problem+json"] | operations["getExchangeNoticeSubscription"]['responses'][500]['content']["application/problem+json"]
export type getProfessorEvaluationInput = OperationInput<operations["getProfessorEvaluation"]['parameters']['path'], operations["getProfessorEvaluation"]['parameters']['query'], operations["getProfessorEvaluation"]['parameters']['header'], RequestBodyOf<operations["getProfessorEvaluation"]>, false>
export type getProfessorEvaluationOutput = import('./domain.js').ProfessorEvaluationEligibility
export type getProfessorEvaluationProblem = operations["getProfessorEvaluation"]['responses'][400]['content']["application/problem+json"] | operations["getProfessorEvaluation"]['responses'][422]['content']["application/problem+json"] | operations["getProfessorEvaluation"]['responses'][500]['content']["application/problem+json"]
export type getPublicSharedPeriodPlanningInput = OperationInput<operations["getPublicSharedPeriodPlanning"]['parameters']['path'], operations["getPublicSharedPeriodPlanning"]['parameters']['query'], operations["getPublicSharedPeriodPlanning"]['parameters']['header'], RequestBodyOf<operations["getPublicSharedPeriodPlanning"]>, false>
export type getPublicSharedPeriodPlanningOutput = import('./domain.js').SharedPeriodPlanning
export type getPublicSharedPeriodPlanningProblem = operations["getPublicSharedPeriodPlanning"]['responses'][400]['content']["application/problem+json"] | operations["getPublicSharedPeriodPlanning"]['responses'][404]['content']["application/problem+json"] | operations["getPublicSharedPeriodPlanning"]['responses'][500]['content']["application/problem+json"]
export type getStudentCourseAttemptsInput = OperationInput<operations["getStudentCourseAttempts"]['parameters']['path'], operations["getStudentCourseAttempts"]['parameters']['query'], operations["getStudentCourseAttempts"]['parameters']['header'], RequestBodyOf<operations["getStudentCourseAttempts"]>, false>
export type getStudentCourseAttemptsOutput = import('./domain.js').StudentCourseAttempt
export type getStudentCourseAttemptsProblem = operations["getStudentCourseAttempts"]['responses'][400]['content']["application/problem+json"] | operations["getStudentCourseAttempts"]['responses'][404]['content']["application/problem+json"] | operations["getStudentCourseAttempts"]['responses'][500]['content']["application/problem+json"]
export type getStudentCurriculaInput = OperationInput<operations["getStudentCurricula"]['parameters']['path'], operations["getStudentCurricula"]['parameters']['query'], operations["getStudentCurricula"]['parameters']['header'], RequestBodyOf<operations["getStudentCurricula"]>, false>
export type getStudentCurriculaOutput = import('./domain.js').Curriculum
export type getStudentCurriculaProblem = operations["getStudentCurricula"]['responses'][400]['content']["application/problem+json"] | operations["getStudentCurricula"]['responses'][404]['content']["application/problem+json"] | operations["getStudentCurricula"]['responses'][500]['content']["application/problem+json"]
export type getStudentPeriodPlanningsInput = OperationInput<operations["getStudentPeriodPlannings"]['parameters']['path'], operations["getStudentPeriodPlannings"]['parameters']['query'], operations["getStudentPeriodPlannings"]['parameters']['header'], RequestBodyOf<operations["getStudentPeriodPlannings"]>, false>
export type getStudentPeriodPlanningsOutput = import('./domain.js').PeriodPlanning
export type getStudentPeriodPlanningsProblem = operations["getStudentPeriodPlannings"]['responses'][400]['content']["application/problem+json"] | operations["getStudentPeriodPlannings"]['responses'][404]['content']["application/problem+json"] | operations["getStudentPeriodPlannings"]['responses'][500]['content']["application/problem+json"]
export type getStudentPersonInput = OperationInput<operations["getStudentPerson"]['parameters']['path'], operations["getStudentPerson"]['parameters']['query'], operations["getStudentPerson"]['parameters']['header'], RequestBodyOf<operations["getStudentPerson"]>, false>
export type getStudentPersonOutput = import('./domain.js').StudentPublicPerson
export type getStudentPersonProblem = operations["getStudentPerson"]['responses'][400]['content']["application/problem+json"] | operations["getStudentPerson"]['responses'][404]['content']["application/problem+json"] | operations["getStudentPerson"]['responses'][500]['content']["application/problem+json"]
export type getStudentPublicProfileInput = OperationInput<operations["getStudentPublicProfile"]['parameters']['path'], operations["getStudentPublicProfile"]['parameters']['query'], operations["getStudentPublicProfile"]['parameters']['header'], RequestBodyOf<operations["getStudentPublicProfile"]>, false>
export type getStudentPublicProfileOutput = import('./domain.js').StudentPublicProfile
export type getStudentPublicProfileProblem = operations["getStudentPublicProfile"]['responses'][400]['content']["application/problem+json"] | operations["getStudentPublicProfile"]['responses'][404]['content']["application/problem+json"] | operations["getStudentPublicProfile"]['responses'][500]['content']["application/problem+json"]
export type getStudentsInput = OperationInput<operations["getStudents"]['parameters']['path'], operations["getStudents"]['parameters']['query'], operations["getStudents"]['parameters']['header'], RequestBodyOf<operations["getStudents"]>, false>
export type getStudentsOutput = import('./domain.js').Student
export type getStudentsProblem = operations["getStudents"]['responses'][400]['content']["application/problem+json"] | operations["getStudents"]['responses'][404]['content']["application/problem+json"] | operations["getStudents"]['responses'][500]['content']["application/problem+json"]
export type getStudentSharedPeriodPlanningInput = OperationInput<operations["getStudentSharedPeriodPlanning"]['parameters']['path'], operations["getStudentSharedPeriodPlanning"]['parameters']['query'], operations["getStudentSharedPeriodPlanning"]['parameters']['header'], RequestBodyOf<operations["getStudentSharedPeriodPlanning"]>, false>
export type getStudentSharedPeriodPlanningOutput = import('./domain.js').SharedPeriodPlanning
export type getStudentSharedPeriodPlanningProblem = operations["getStudentSharedPeriodPlanning"]['responses'][400]['content']["application/problem+json"] | operations["getStudentSharedPeriodPlanning"]['responses'][404]['content']["application/problem+json"] | operations["getStudentSharedPeriodPlanning"]['responses'][500]['content']["application/problem+json"]
export type getTagInput = OperationInput<operations["getTag"]['parameters']['path'], operations["getTag"]['parameters']['query'], operations["getTag"]['parameters']['header'], RequestBodyOf<operations["getTag"]>, false>
export type getTagOutput = import('./domain.js').Tag
export type getTagProblem = operations["getTag"]['responses'][400]['content']["application/problem+json"] | operations["getTag"]['responses'][404]['content']["application/problem+json"] | operations["getTag"]['responses'][500]['content']["application/problem+json"]
export type listAuthUsersInput = OperationInput<operations["listAuthUsers"]['parameters']['path'], SortQuery<operations["listAuthUsers"]['parameters']['query'], "id" | "displayName" | "email" | "status">, operations["listAuthUsers"]['parameters']['header'], RequestBodyOf<operations["listAuthUsers"]>, false>
export type listAuthUsersOutput = import('./domain.js').Page<import('./domain.js').AuthUser>
export type listAuthUsersProblem = operations["listAuthUsers"]['responses'][400]['content']["application/problem+json"] | operations["listAuthUsers"]['responses'][500]['content']["application/problem+json"]
export type listBotGrantsInput = OperationInput<operations["listBotGrants"]['parameters']['path'], SortQuery<operations["listBotGrants"]['parameters']['query'], "createdAt" | "capability" | "botDisplayName">, operations["listBotGrants"]['parameters']['header'], RequestBodyOf<operations["listBotGrants"]>, false>
export type listBotGrantsOutput = import('./domain.js').Page<import('./domain.js').BotGrant>
export type listBotGrantsProblem = operations["listBotGrants"]['responses'][400]['content']["application/problem+json"] | operations["listBotGrants"]['responses'][500]['content']["application/problem+json"]
export type listBotsInput = OperationInput<operations["listBots"]['parameters']['path'], SortQuery<operations["listBots"]['parameters']['query'], "displayName">, operations["listBots"]['parameters']['header'], RequestBodyOf<operations["listBots"]>, false>
export type listBotsOutput = import('./domain.js').Page<import('./domain.js').BotIdentity>
export type listBotsProblem = operations["listBots"]['responses'][400]['content']["application/problem+json"] | operations["listBots"]['responses'][500]['content']["application/problem+json"]
export type listCategoriesInput = OperationInput<operations["listCategories"]['parameters']['path'], SortQuery<operations["listCategories"]['parameters']['query'], "name">, operations["listCategories"]['parameters']['header'], RequestBodyOf<operations["listCategories"]>, false>
export type listCategoriesOutput = import('./domain.js').Page<import('./domain.js').Category>
export type listCategoriesProblem = operations["listCategories"]['responses'][400]['content']["application/problem+json"] | operations["listCategories"]['responses'][500]['content']["application/problem+json"]
export type listCourseTagsInput = OperationInput<operations["listCourseTags"]['parameters']['path'], SortQuery<operations["listCourseTags"]['parameters']['query'], "name" | "categoryId">, operations["listCourseTags"]['parameters']['header'], RequestBodyOf<operations["listCourseTags"]>, false>
export type listCourseTagsOutput = import('./domain.js').Page<import('./domain.js').Tag>
export type listCourseTagsProblem = operations["listCourseTags"]['responses'][400]['content']["application/problem+json"] | operations["listCourseTags"]['responses'][404]['content']["application/problem+json"] | operations["listCourseTags"]['responses'][500]['content']["application/problem+json"]
export type listFeedbackReportsInput = OperationInput<operations["listFeedbackReports"]['parameters']['path'], SortQuery<operations["listFeedbackReports"]['parameters']['query'], "createdAt" | "updatedAt" | "status" | "kind" | "title">, operations["listFeedbackReports"]['parameters']['header'], RequestBodyOf<operations["listFeedbackReports"]>, false>
export type listFeedbackReportsOutput = import('./domain.js').Page<import('./domain.js').FeedbackReport>
export type listFeedbackReportsProblem = operations["listFeedbackReports"]['responses'][400]['content']["application/problem+json"] | operations["listFeedbackReports"]['responses'][500]['content']["application/problem+json"]
export type listPendingProfessorEvaluationsInput = OperationInput<operations["listPendingProfessorEvaluations"]['parameters']['path'], SortQuery<operations["listPendingProfessorEvaluations"]['parameters']['query'], "courseCode" | "courseName" | "classCode" | "professorName">, operations["listPendingProfessorEvaluations"]['parameters']['header'], RequestBodyOf<operations["listPendingProfessorEvaluations"]>, false>
export type listPendingProfessorEvaluationsOutput = import('./domain.js').Page<import('./domain.js').PendingProfessorEvaluation>
export type listPendingProfessorEvaluationsProblem = operations["listPendingProfessorEvaluations"]['responses'][400]['content']["application/problem+json"] | operations["listPendingProfessorEvaluations"]['responses'][500]['content']["application/problem+json"]
export type listPublicSharedPeriodPlanningsInput = OperationInput<operations["listPublicSharedPeriodPlannings"]['parameters']['path'], SortQuery<operations["listPublicSharedPeriodPlannings"]['parameters']['query'], "updatedAt" | "name" | "studyPeriodYear">, operations["listPublicSharedPeriodPlannings"]['parameters']['header'], RequestBodyOf<operations["listPublicSharedPeriodPlannings"]>, false>
export type listPublicSharedPeriodPlanningsOutput = import('./domain.js').Page<import('./domain.js').SharedPeriodPlanning>
export type listPublicSharedPeriodPlanningsProblem = operations["listPublicSharedPeriodPlannings"]['responses'][400]['content']["application/problem+json"] | operations["listPublicSharedPeriodPlannings"]['responses'][500]['content']["application/problem+json"]
export type listStudentAbsencesInput = OperationInput<operations["listStudentAbsences"]['parameters']['path'], SortQuery<operations["listStudentAbsences"]['parameters']['query'], "date" | "courseCode" | "classCode" | "start" | "createdAt">, operations["listStudentAbsences"]['parameters']['header'], RequestBodyOf<operations["listStudentAbsences"]>, false>
export type listStudentAbsencesOutput = import('./domain.js').Page<import('./domain.js').StudentAbsence>
export type listStudentAbsencesProblem = operations["listStudentAbsences"]['responses'][400]['content']["application/problem+json"] | operations["listStudentAbsences"]['responses'][500]['content']["application/problem+json"]
export type listStudentCourseAttemptsInput = OperationInput<operations["listStudentCourseAttempts"]['parameters']['path'], SortQuery<operations["listStudentCourseAttempts"]['parameters']['query'], "createdAt" | "updatedAt" | "courseCode" | "status" | "grade">, operations["listStudentCourseAttempts"]['parameters']['header'], RequestBodyOf<operations["listStudentCourseAttempts"]>, false>
export type listStudentCourseAttemptsOutput = import('./domain.js').Page<import('./domain.js').StudentCourseAttempt>
export type listStudentCourseAttemptsProblem = operations["listStudentCourseAttempts"]['responses'][400]['content']["application/problem+json"] | operations["listStudentCourseAttempts"]['responses'][500]['content']["application/problem+json"]
export type listStudentCurriculaInput = OperationInput<operations["listStudentCurricula"]['parameters']['path'], SortQuery<operations["listStudentCurricula"]['parameters']['query'], "isFavorite" | "updatedAt" | "name">, operations["listStudentCurricula"]['parameters']['header'], RequestBodyOf<operations["listStudentCurricula"]>, false>
export type listStudentCurriculaOutput = import('./domain.js').Page<import('./domain.js').CurriculumSummary>
export type listStudentCurriculaProblem = operations["listStudentCurricula"]['responses'][400]['content']["application/problem+json"] | operations["listStudentCurricula"]['responses'][500]['content']["application/problem+json"]
export type listStudentFeedbackReportsInput = OperationInput<operations["listStudentFeedbackReports"]['parameters']['path'], SortQuery<operations["listStudentFeedbackReports"]['parameters']['query'], "createdAt" | "updatedAt" | "status" | "kind" | "title">, operations["listStudentFeedbackReports"]['parameters']['header'], RequestBodyOf<operations["listStudentFeedbackReports"]>, false>
export type listStudentFeedbackReportsOutput = import('./domain.js').Page<import('./domain.js').FeedbackReport>
export type listStudentFeedbackReportsProblem = operations["listStudentFeedbackReports"]['responses'][400]['content']["application/problem+json"] | operations["listStudentFeedbackReports"]['responses'][500]['content']["application/problem+json"]
export type listStudentFriendshipsInput = OperationInput<operations["listStudentFriendships"]['parameters']['path'], SortQuery<operations["listStudentFriendships"]['parameters']['query'], "updatedAt" | "status">, operations["listStudentFriendships"]['parameters']['header'], RequestBodyOf<operations["listStudentFriendships"]>, false>
export type listStudentFriendshipsOutput = import('./domain.js').Page<import('./domain.js').StudentFriendship>
export type listStudentFriendshipsProblem = operations["listStudentFriendships"]['responses'][400]['content']["application/problem+json"] | operations["listStudentFriendships"]['responses'][500]['content']["application/problem+json"]
export type listStudentPeopleInput = OperationInput<operations["listStudentPeople"]['parameters']['path'], SortQuery<operations["listStudentPeople"]['parameters']['query'], "displayName">, operations["listStudentPeople"]['parameters']['header'], RequestBodyOf<operations["listStudentPeople"]>, false>
export type listStudentPeopleOutput = import('./domain.js').Page<import('./domain.js').StudentPublicPerson>
export type listStudentPeopleProblem = operations["listStudentPeople"]['responses'][400]['content']["application/problem+json"] | operations["listStudentPeople"]['responses'][500]['content']["application/problem+json"]
export type listStudentPeriodPlanningsInput = OperationInput<operations["listStudentPeriodPlannings"]['parameters']['path'], SortQuery<operations["listStudentPeriodPlannings"]['parameters']['query'], "updatedAt" | "name" | "studyPeriodYear" | "studyPeriodYearPeriod" | "visibility">, operations["listStudentPeriodPlannings"]['parameters']['header'], RequestBodyOf<operations["listStudentPeriodPlannings"]>, false>
export type listStudentPeriodPlanningsOutput = import('./domain.js').Page<import('./domain.js').PeriodPlanning>
export type listStudentPeriodPlanningsProblem = operations["listStudentPeriodPlannings"]['responses'][400]['content']["application/problem+json"] | operations["listStudentPeriodPlannings"]['responses'][500]['content']["application/problem+json"]
export type listStudentsInput = OperationInput<operations["listStudents"]['parameters']['path'], SortQuery<operations["listStudents"]['parameters']['query'], "id" | "ra" | "name" | "entryYear">, operations["listStudents"]['parameters']['header'], RequestBodyOf<operations["listStudents"]>, false>
export type listStudentsOutput = import('./domain.js').Page<import('./domain.js').Student>
export type listStudentsProblem = operations["listStudents"]['responses'][400]['content']["application/problem+json"] | operations["listStudents"]['responses'][500]['content']["application/problem+json"]
export type listStudentSharedPeriodPlanningsInput = OperationInput<operations["listStudentSharedPeriodPlannings"]['parameters']['path'], SortQuery<operations["listStudentSharedPeriodPlannings"]['parameters']['query'], "updatedAt" | "name" | "studyPeriodYear">, operations["listStudentSharedPeriodPlannings"]['parameters']['header'], RequestBodyOf<operations["listStudentSharedPeriodPlannings"]>, false>
export type listStudentSharedPeriodPlanningsOutput = import('./domain.js').Page<import('./domain.js').SharedPeriodPlanning>
export type listStudentSharedPeriodPlanningsProblem = operations["listStudentSharedPeriodPlannings"]['responses'][400]['content']["application/problem+json"] | operations["listStudentSharedPeriodPlannings"]['responses'][500]['content']["application/problem+json"]
export type listStudentTagInterestsInput = OperationInput<operations["listStudentTagInterests"]['parameters']['path'], SortQuery<operations["listStudentTagInterests"]['parameters']['query'], "name">, operations["listStudentTagInterests"]['parameters']['header'], RequestBodyOf<operations["listStudentTagInterests"]>, false>
export type listStudentTagInterestsOutput = import('./domain.js').Page<import('./domain.js').StudentTagInterest>
export type listStudentTagInterestsProblem = operations["listStudentTagInterests"]['responses'][400]['content']["application/problem+json"] | operations["listStudentTagInterests"]['responses'][500]['content']["application/problem+json"]
export type listTagCoursesInput = OperationInput<operations["listTagCourses"]['parameters']['path'], SortQuery<operations["listTagCourses"]['parameters']['query'], "code" | "name" | "credits">, operations["listTagCourses"]['parameters']['header'], RequestBodyOf<operations["listTagCourses"]>, false>
export type listTagCoursesOutput = import('./domain.js').Page<import('./domain.js').TagRelatedCourse>
export type listTagCoursesProblem = operations["listTagCourses"]['responses'][400]['content']["application/problem+json"] | operations["listTagCourses"]['responses'][404]['content']["application/problem+json"] | operations["listTagCourses"]['responses'][500]['content']["application/problem+json"]
export type listTagsInput = OperationInput<operations["listTags"]['parameters']['path'], SortQuery<operations["listTags"]['parameters']['query'], "name" | "categoryId">, operations["listTags"]['parameters']['header'], RequestBodyOf<operations["listTags"]>, false>
export type listTagsOutput = import('./domain.js').Page<import('./domain.js').Tag>
export type listTagsProblem = operations["listTags"]['responses'][400]['content']["application/problem+json"] | operations["listTags"]['responses'][500]['content']["application/problem+json"]
export type removeCourseTagInput = OperationInput<operations["removeCourseTag"]['parameters']['path'], operations["removeCourseTag"]['parameters']['query'], operations["removeCourseTag"]['parameters']['header'], RequestBodyOf<operations["removeCourseTag"]>, false>
export type removeCourseTagOutput = void
export type removeCourseTagProblem = operations["removeCourseTag"]['responses'][400]['content']["application/problem+json"] | operations["removeCourseTag"]['responses'][422]['content']["application/problem+json"] | operations["removeCourseTag"]['responses'][500]['content']["application/problem+json"]
export type replaceBotGrantInput = OperationInput<operations["replaceBotGrant"]['parameters']['path'], operations["replaceBotGrant"]['parameters']['query'], operations["replaceBotGrant"]['parameters']['header'], RequestBodyOf<operations["replaceBotGrant"]>, true>
export type replaceBotGrantOutput = void
export type replaceBotGrantProblem = operations["replaceBotGrant"]['responses'][400]['content']["application/problem+json"] | operations["replaceBotGrant"]['responses'][404]['content']["application/problem+json"] | operations["replaceBotGrant"]['responses'][500]['content']["application/problem+json"]
export type unsubscribeExchangeNoticesInput = OperationInput<operations["unsubscribeExchangeNotices"]['parameters']['path'], operations["unsubscribeExchangeNotices"]['parameters']['query'], operations["unsubscribeExchangeNotices"]['parameters']['header'], RequestBodyOf<operations["unsubscribeExchangeNotices"]>, false>
export type unsubscribeExchangeNoticesOutput = operations["unsubscribeExchangeNotices"]['responses'][200]['content']["application/json"]
export type unsubscribeExchangeNoticesProblem = operations["unsubscribeExchangeNotices"]['responses'][400]['content']["application/problem+json"] | operations["unsubscribeExchangeNotices"]['responses'][500]['content']["application/problem+json"]
export type updateAuthUserInput = OperationInput<operations["updateAuthUser"]['parameters']['path'], operations["updateAuthUser"]['parameters']['query'], operations["updateAuthUser"]['parameters']['header'], RequestBodyOf<operations["updateAuthUser"]>, true>
export type updateAuthUserOutput = import('./domain.js').AuthUser
export type updateAuthUserProblem = operations["updateAuthUser"]['responses'][400]['content']["application/problem+json"] | operations["updateAuthUser"]['responses'][403]['content']["application/problem+json"] | operations["updateAuthUser"]['responses'][404]['content']["application/problem+json"] | operations["updateAuthUser"]['responses'][500]['content']["application/problem+json"]
export type updateCategoryInput = OperationInput<operations["updateCategory"]['parameters']['path'], operations["updateCategory"]['parameters']['query'], operations["updateCategory"]['parameters']['header'], RequestBodyOf<operations["updateCategory"]>, true>
export type updateCategoryOutput = import('./domain.js').Category
export type updateCategoryProblem = operations["updateCategory"]['responses'][400]['content']["application/problem+json"] | operations["updateCategory"]['responses'][404]['content']["application/problem+json"] | operations["updateCategory"]['responses'][409]['content']["application/problem+json"] | operations["updateCategory"]['responses'][500]['content']["application/problem+json"]
export type updateExchangeNoticeSubscriptionInput = OperationInput<operations["updateExchangeNoticeSubscription"]['parameters']['path'], operations["updateExchangeNoticeSubscription"]['parameters']['query'], operations["updateExchangeNoticeSubscription"]['parameters']['header'], RequestBodyOf<operations["updateExchangeNoticeSubscription"]>, true>
export type updateExchangeNoticeSubscriptionOutput = import('./domain.js').ExchangeNoticeSubscription
export type updateExchangeNoticeSubscriptionProblem = operations["updateExchangeNoticeSubscription"]['responses'][400]['content']["application/problem+json"] | operations["updateExchangeNoticeSubscription"]['responses'][422]['content']["application/problem+json"] | operations["updateExchangeNoticeSubscription"]['responses'][500]['content']["application/problem+json"]
export type updateFeedbackReportInput = OperationInput<operations["updateFeedbackReport"]['parameters']['path'], operations["updateFeedbackReport"]['parameters']['query'], operations["updateFeedbackReport"]['parameters']['header'], RequestBodyOf<operations["updateFeedbackReport"]>, true>
export type updateFeedbackReportOutput = import('./domain.js').FeedbackReport
export type updateFeedbackReportProblem = operations["updateFeedbackReport"]['responses'][400]['content']["application/problem+json"] | operations["updateFeedbackReport"]['responses'][404]['content']["application/problem+json"] | operations["updateFeedbackReport"]['responses'][500]['content']["application/problem+json"]
export type updateProfessorEvaluationInput = OperationInput<operations["updateProfessorEvaluation"]['parameters']['path'], operations["updateProfessorEvaluation"]['parameters']['query'], operations["updateProfessorEvaluation"]['parameters']['header'], RequestBodyOf<operations["updateProfessorEvaluation"]>, true>
export type updateProfessorEvaluationOutput = import('./domain.js').ProfessorEvaluation
export type updateProfessorEvaluationProblem = operations["updateProfessorEvaluation"]['responses'][400]['content']["application/problem+json"] | operations["updateProfessorEvaluation"]['responses'][422]['content']["application/problem+json"] | operations["updateProfessorEvaluation"]['responses'][500]['content']["application/problem+json"]
export type updateStudentCourseAttemptsInput = OperationInput<operations["updateStudentCourseAttempts"]['parameters']['path'], operations["updateStudentCourseAttempts"]['parameters']['query'], operations["updateStudentCourseAttempts"]['parameters']['header'], RequestBodyOf<operations["updateStudentCourseAttempts"]>, true>
export type updateStudentCourseAttemptsOutput = import('./domain.js').StudentCourseAttempt
export type updateStudentCourseAttemptsProblem = operations["updateStudentCourseAttempts"]['responses'][400]['content']["application/problem+json"] | operations["updateStudentCourseAttempts"]['responses'][404]['content']["application/problem+json"] | operations["updateStudentCourseAttempts"]['responses'][409]['content']["application/problem+json"] | operations["updateStudentCourseAttempts"]['responses'][422]['content']["application/problem+json"] | operations["updateStudentCourseAttempts"]['responses'][500]['content']["application/problem+json"]
export type updateStudentCurriculaInput = OperationInput<operations["updateStudentCurricula"]['parameters']['path'], operations["updateStudentCurricula"]['parameters']['query'], operations["updateStudentCurricula"]['parameters']['header'], RequestBodyOf<operations["updateStudentCurricula"]>, true>
export type updateStudentCurriculaOutput = import('./domain.js').Curriculum
export type updateStudentCurriculaProblem = operations["updateStudentCurricula"]['responses'][400]['content']["application/problem+json"] | operations["updateStudentCurricula"]['responses'][404]['content']["application/problem+json"] | operations["updateStudentCurricula"]['responses'][422]['content']["application/problem+json"] | operations["updateStudentCurricula"]['responses'][500]['content']["application/problem+json"]
export type updateStudentPeriodPlanningsInput = OperationInput<operations["updateStudentPeriodPlannings"]['parameters']['path'], operations["updateStudentPeriodPlannings"]['parameters']['query'], operations["updateStudentPeriodPlannings"]['parameters']['header'], RequestBodyOf<operations["updateStudentPeriodPlannings"]>, true>
export type updateStudentPeriodPlanningsOutput = import('./domain.js').PeriodPlanning
export type updateStudentPeriodPlanningsProblem = operations["updateStudentPeriodPlannings"]['responses'][400]['content']["application/problem+json"] | operations["updateStudentPeriodPlannings"]['responses'][404]['content']["application/problem+json"] | operations["updateStudentPeriodPlannings"]['responses'][422]['content']["application/problem+json"] | operations["updateStudentPeriodPlannings"]['responses'][500]['content']["application/problem+json"]
export type updateStudentPublicProfileInput = OperationInput<operations["updateStudentPublicProfile"]['parameters']['path'], operations["updateStudentPublicProfile"]['parameters']['query'], operations["updateStudentPublicProfile"]['parameters']['header'], RequestBodyOf<operations["updateStudentPublicProfile"]>, true>
export type updateStudentPublicProfileOutput = import('./domain.js').StudentPublicProfile
export type updateStudentPublicProfileProblem = operations["updateStudentPublicProfile"]['responses'][400]['content']["application/problem+json"] | operations["updateStudentPublicProfile"]['responses'][404]['content']["application/problem+json"] | operations["updateStudentPublicProfile"]['responses'][500]['content']["application/problem+json"]
export type updateStudentsInput = OperationInput<operations["updateStudents"]['parameters']['path'], operations["updateStudents"]['parameters']['query'], operations["updateStudents"]['parameters']['header'], RequestBodyOf<operations["updateStudents"]>, true>
export type updateStudentsOutput = import('./domain.js').Student
export type updateStudentsProblem = operations["updateStudents"]['responses'][400]['content']["application/problem+json"] | operations["updateStudents"]['responses'][404]['content']["application/problem+json"] | operations["updateStudents"]['responses'][422]['content']["application/problem+json"] | operations["updateStudents"]['responses'][500]['content']["application/problem+json"]
export type updateStudentTagInterestInput = OperationInput<operations["updateStudentTagInterest"]['parameters']['path'], operations["updateStudentTagInterest"]['parameters']['query'], operations["updateStudentTagInterest"]['parameters']['header'], RequestBodyOf<operations["updateStudentTagInterest"]>, false>
export type updateStudentTagInterestOutput = void
export type updateStudentTagInterestProblem = operations["updateStudentTagInterest"]['responses'][400]['content']["application/problem+json"] | operations["updateStudentTagInterest"]['responses'][422]['content']["application/problem+json"] | operations["updateStudentTagInterest"]['responses'][500]['content']["application/problem+json"]
export type updateTagInput = OperationInput<operations["updateTag"]['parameters']['path'], operations["updateTag"]['parameters']['query'], operations["updateTag"]['parameters']['header'], RequestBodyOf<operations["updateTag"]>, true>
export type updateTagOutput = import('./domain.js').Tag
export type updateTagProblem = operations["updateTag"]['responses'][400]['content']["application/problem+json"] | operations["updateTag"]['responses'][404]['content']["application/problem+json"] | operations["updateTag"]['responses'][409]['content']["application/problem+json"] | operations["updateTag"]['responses'][422]['content']["application/problem+json"] | operations["updateTag"]['responses'][500]['content']["application/problem+json"]

export interface OperationInputs {
    acceptStudentFriendship: acceptStudentFriendshipInput
    addCourseTag: addCourseTagInput
    createAuthUser: createAuthUserInput
    createCategory: createCategoryInput
    createFeedbackReport: createFeedbackReportInput
    createStudentAbsences: createStudentAbsencesInput
    createStudentCourseAttempts: createStudentCourseAttemptsInput
    createStudentCurricula: createStudentCurriculaInput
    createStudentFeedbackReport: createStudentFeedbackReportInput
    createStudentFriendship: createStudentFriendshipInput
    createStudentHistory: createStudentHistoryInput
    createStudentPeriodPlannings: createStudentPeriodPlanningsInput
    createStudents: createStudentsInput
    createTag: createTagInput
    deleteCategory: deleteCategoryInput
    deleteStudentAbsences: deleteStudentAbsencesInput
    deleteStudentCourseAttempts: deleteStudentCourseAttemptsInput
    deleteStudentCurricula: deleteStudentCurriculaInput
    deleteStudentFriendship: deleteStudentFriendshipInput
    deleteStudentPeriodPlannings: deleteStudentPeriodPlanningsInput
    deleteStudents: deleteStudentsInput
    deleteStudentTagInterest: deleteStudentTagInterestInput
    deleteTag: deleteTagInput
    getCategory: getCategoryInput
    getCurrentUser: getCurrentUserInput
    getExchangeNoticeSubscription: getExchangeNoticeSubscriptionInput
    getProfessorEvaluation: getProfessorEvaluationInput
    getPublicSharedPeriodPlanning: getPublicSharedPeriodPlanningInput
    getStudentCourseAttempts: getStudentCourseAttemptsInput
    getStudentCurricula: getStudentCurriculaInput
    getStudentPeriodPlannings: getStudentPeriodPlanningsInput
    getStudentPerson: getStudentPersonInput
    getStudentPublicProfile: getStudentPublicProfileInput
    getStudents: getStudentsInput
    getStudentSharedPeriodPlanning: getStudentSharedPeriodPlanningInput
    getTag: getTagInput
    listAuthUsers: listAuthUsersInput
    listBotGrants: listBotGrantsInput
    listBots: listBotsInput
    listCategories: listCategoriesInput
    listCourseTags: listCourseTagsInput
    listFeedbackReports: listFeedbackReportsInput
    listPendingProfessorEvaluations: listPendingProfessorEvaluationsInput
    listPublicSharedPeriodPlannings: listPublicSharedPeriodPlanningsInput
    listStudentAbsences: listStudentAbsencesInput
    listStudentCourseAttempts: listStudentCourseAttemptsInput
    listStudentCurricula: listStudentCurriculaInput
    listStudentFeedbackReports: listStudentFeedbackReportsInput
    listStudentFriendships: listStudentFriendshipsInput
    listStudentPeople: listStudentPeopleInput
    listStudentPeriodPlannings: listStudentPeriodPlanningsInput
    listStudents: listStudentsInput
    listStudentSharedPeriodPlannings: listStudentSharedPeriodPlanningsInput
    listStudentTagInterests: listStudentTagInterestsInput
    listTagCourses: listTagCoursesInput
    listTags: listTagsInput
    removeCourseTag: removeCourseTagInput
    replaceBotGrant: replaceBotGrantInput
    unsubscribeExchangeNotices: unsubscribeExchangeNoticesInput
    updateAuthUser: updateAuthUserInput
    updateCategory: updateCategoryInput
    updateExchangeNoticeSubscription: updateExchangeNoticeSubscriptionInput
    updateFeedbackReport: updateFeedbackReportInput
    updateProfessorEvaluation: updateProfessorEvaluationInput
    updateStudentCourseAttempts: updateStudentCourseAttemptsInput
    updateStudentCurricula: updateStudentCurriculaInput
    updateStudentPeriodPlannings: updateStudentPeriodPlanningsInput
    updateStudentPublicProfile: updateStudentPublicProfileInput
    updateStudents: updateStudentsInput
    updateStudentTagInterest: updateStudentTagInterestInput
    updateTag: updateTagInput
}

export interface OperationOutputs {
    acceptStudentFriendship: acceptStudentFriendshipOutput
    addCourseTag: addCourseTagOutput
    createAuthUser: createAuthUserOutput
    createCategory: createCategoryOutput
    createFeedbackReport: createFeedbackReportOutput
    createStudentAbsences: createStudentAbsencesOutput
    createStudentCourseAttempts: createStudentCourseAttemptsOutput
    createStudentCurricula: createStudentCurriculaOutput
    createStudentFeedbackReport: createStudentFeedbackReportOutput
    createStudentFriendship: createStudentFriendshipOutput
    createStudentHistory: createStudentHistoryOutput
    createStudentPeriodPlannings: createStudentPeriodPlanningsOutput
    createStudents: createStudentsOutput
    createTag: createTagOutput
    deleteCategory: deleteCategoryOutput
    deleteStudentAbsences: deleteStudentAbsencesOutput
    deleteStudentCourseAttempts: deleteStudentCourseAttemptsOutput
    deleteStudentCurricula: deleteStudentCurriculaOutput
    deleteStudentFriendship: deleteStudentFriendshipOutput
    deleteStudentPeriodPlannings: deleteStudentPeriodPlanningsOutput
    deleteStudents: deleteStudentsOutput
    deleteStudentTagInterest: deleteStudentTagInterestOutput
    deleteTag: deleteTagOutput
    getCategory: getCategoryOutput
    getCurrentUser: getCurrentUserOutput
    getExchangeNoticeSubscription: getExchangeNoticeSubscriptionOutput
    getProfessorEvaluation: getProfessorEvaluationOutput
    getPublicSharedPeriodPlanning: getPublicSharedPeriodPlanningOutput
    getStudentCourseAttempts: getStudentCourseAttemptsOutput
    getStudentCurricula: getStudentCurriculaOutput
    getStudentPeriodPlannings: getStudentPeriodPlanningsOutput
    getStudentPerson: getStudentPersonOutput
    getStudentPublicProfile: getStudentPublicProfileOutput
    getStudents: getStudentsOutput
    getStudentSharedPeriodPlanning: getStudentSharedPeriodPlanningOutput
    getTag: getTagOutput
    listAuthUsers: listAuthUsersOutput
    listBotGrants: listBotGrantsOutput
    listBots: listBotsOutput
    listCategories: listCategoriesOutput
    listCourseTags: listCourseTagsOutput
    listFeedbackReports: listFeedbackReportsOutput
    listPendingProfessorEvaluations: listPendingProfessorEvaluationsOutput
    listPublicSharedPeriodPlannings: listPublicSharedPeriodPlanningsOutput
    listStudentAbsences: listStudentAbsencesOutput
    listStudentCourseAttempts: listStudentCourseAttemptsOutput
    listStudentCurricula: listStudentCurriculaOutput
    listStudentFeedbackReports: listStudentFeedbackReportsOutput
    listStudentFriendships: listStudentFriendshipsOutput
    listStudentPeople: listStudentPeopleOutput
    listStudentPeriodPlannings: listStudentPeriodPlanningsOutput
    listStudents: listStudentsOutput
    listStudentSharedPeriodPlannings: listStudentSharedPeriodPlanningsOutput
    listStudentTagInterests: listStudentTagInterestsOutput
    listTagCourses: listTagCoursesOutput
    listTags: listTagsOutput
    removeCourseTag: removeCourseTagOutput
    replaceBotGrant: replaceBotGrantOutput
    unsubscribeExchangeNotices: unsubscribeExchangeNoticesOutput
    updateAuthUser: updateAuthUserOutput
    updateCategory: updateCategoryOutput
    updateExchangeNoticeSubscription: updateExchangeNoticeSubscriptionOutput
    updateFeedbackReport: updateFeedbackReportOutput
    updateProfessorEvaluation: updateProfessorEvaluationOutput
    updateStudentCourseAttempts: updateStudentCourseAttemptsOutput
    updateStudentCurricula: updateStudentCurriculaOutput
    updateStudentPeriodPlannings: updateStudentPeriodPlanningsOutput
    updateStudentPublicProfile: updateStudentPublicProfileOutput
    updateStudents: updateStudentsOutput
    updateStudentTagInterest: updateStudentTagInterestOutput
    updateTag: updateTagOutput
}

export interface OperationProblems {
    acceptStudentFriendship: acceptStudentFriendshipProblem
    addCourseTag: addCourseTagProblem
    createAuthUser: createAuthUserProblem
    createCategory: createCategoryProblem
    createFeedbackReport: createFeedbackReportProblem
    createStudentAbsences: createStudentAbsencesProblem
    createStudentCourseAttempts: createStudentCourseAttemptsProblem
    createStudentCurricula: createStudentCurriculaProblem
    createStudentFeedbackReport: createStudentFeedbackReportProblem
    createStudentFriendship: createStudentFriendshipProblem
    createStudentHistory: createStudentHistoryProblem
    createStudentPeriodPlannings: createStudentPeriodPlanningsProblem
    createStudents: createStudentsProblem
    createTag: createTagProblem
    deleteCategory: deleteCategoryProblem
    deleteStudentAbsences: deleteStudentAbsencesProblem
    deleteStudentCourseAttempts: deleteStudentCourseAttemptsProblem
    deleteStudentCurricula: deleteStudentCurriculaProblem
    deleteStudentFriendship: deleteStudentFriendshipProblem
    deleteStudentPeriodPlannings: deleteStudentPeriodPlanningsProblem
    deleteStudents: deleteStudentsProblem
    deleteStudentTagInterest: deleteStudentTagInterestProblem
    deleteTag: deleteTagProblem
    getCategory: getCategoryProblem
    getCurrentUser: getCurrentUserProblem
    getExchangeNoticeSubscription: getExchangeNoticeSubscriptionProblem
    getProfessorEvaluation: getProfessorEvaluationProblem
    getPublicSharedPeriodPlanning: getPublicSharedPeriodPlanningProblem
    getStudentCourseAttempts: getStudentCourseAttemptsProblem
    getStudentCurricula: getStudentCurriculaProblem
    getStudentPeriodPlannings: getStudentPeriodPlanningsProblem
    getStudentPerson: getStudentPersonProblem
    getStudentPublicProfile: getStudentPublicProfileProblem
    getStudents: getStudentsProblem
    getStudentSharedPeriodPlanning: getStudentSharedPeriodPlanningProblem
    getTag: getTagProblem
    listAuthUsers: listAuthUsersProblem
    listBotGrants: listBotGrantsProblem
    listBots: listBotsProblem
    listCategories: listCategoriesProblem
    listCourseTags: listCourseTagsProblem
    listFeedbackReports: listFeedbackReportsProblem
    listPendingProfessorEvaluations: listPendingProfessorEvaluationsProblem
    listPublicSharedPeriodPlannings: listPublicSharedPeriodPlanningsProblem
    listStudentAbsences: listStudentAbsencesProblem
    listStudentCourseAttempts: listStudentCourseAttemptsProblem
    listStudentCurricula: listStudentCurriculaProblem
    listStudentFeedbackReports: listStudentFeedbackReportsProblem
    listStudentFriendships: listStudentFriendshipsProblem
    listStudentPeople: listStudentPeopleProblem
    listStudentPeriodPlannings: listStudentPeriodPlanningsProblem
    listStudents: listStudentsProblem
    listStudentSharedPeriodPlannings: listStudentSharedPeriodPlanningsProblem
    listStudentTagInterests: listStudentTagInterestsProblem
    listTagCourses: listTagCoursesProblem
    listTags: listTagsProblem
    removeCourseTag: removeCourseTagProblem
    replaceBotGrant: replaceBotGrantProblem
    unsubscribeExchangeNotices: unsubscribeExchangeNoticesProblem
    updateAuthUser: updateAuthUserProblem
    updateCategory: updateCategoryProblem
    updateExchangeNoticeSubscription: updateExchangeNoticeSubscriptionProblem
    updateFeedbackReport: updateFeedbackReportProblem
    updateProfessorEvaluation: updateProfessorEvaluationProblem
    updateStudentCourseAttempts: updateStudentCourseAttemptsProblem
    updateStudentCurricula: updateStudentCurriculaProblem
    updateStudentPeriodPlannings: updateStudentPeriodPlanningsProblem
    updateStudentPublicProfile: updateStudentPublicProfileProblem
    updateStudents: updateStudentsProblem
    updateStudentTagInterest: updateStudentTagInterestProblem
    updateTag: updateTagProblem
}

export const operationDefinitions = {
    "acceptStudentFriendship": {
        "operationId": "acceptStudentFriendship",
        "target": "app",
        "method": "POST",
        "path": "/student/{sid}/friendships/{id}/accept",
        "authentication": "required",
        "tags": [
            "student-social"
        ],
        "summary": "acceptStudentFriendship",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid",
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/StudentFriendship"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 409,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/UniqueConstraintConflictProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:unique-constraint-conflict"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "studentSocial",
            "method": "acceptFriendship",
            "action": "update",
            "pathParameters": {
                "sid": "studentId",
                "id": "friendshipId"
            }
        },
        "pagination": null
    },
    "addCourseTag": {
        "operationId": "addCourseTag",
        "target": "app",
        "method": "PUT",
        "path": "/courses/{courseId}/tags/{tagId}",
        "authentication": "required",
        "tags": [
            "course-tags"
        ],
        "summary": "addCourseTag",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "courseId",
            "tagId"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 204,
                "success": true,
                "contents": [],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 422,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ReferenceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:reference-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "courseTags",
            "method": "add",
            "action": "update",
            "pathParameters": {
                "courseId": "courseId",
                "tagId": "tagId"
            }
        },
        "pagination": null
    },
    "createAuthUser": {
        "operationId": "createAuthUser",
        "target": "app",
        "method": "POST",
        "path": "/admin/auth-users",
        "authentication": "required",
        "tags": [
            "auth-users"
        ],
        "summary": "Create AuthUser",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": {
            "required": true,
            "contentType": "application/json",
            "schema": {
                "$ref": "#/components/schemas/CreateBotAuthUserBody"
            }
        },
        "responses": [
            {
                "status": 201,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/AuthUserEntity"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "authUsers",
            "method": "create",
            "action": "create"
        },
        "pagination": null
    },
    "createCategory": {
        "operationId": "createCategory",
        "target": "app",
        "method": "POST",
        "path": "/categories",
        "authentication": "required",
        "tags": [
            "categories"
        ],
        "summary": "Create Category",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": {
            "required": true,
            "contentType": "application/json",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "minLength": 1
                    }
                },
                "required": [
                    "name"
                ],
                "additionalProperties": false
            }
        },
        "responses": [
            {
                "status": 201,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/Category"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 409,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/UniqueConstraintConflictProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:unique-constraint-conflict"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "categories",
            "method": "create",
            "action": "create"
        },
        "pagination": null
    },
    "createFeedbackReport": {
        "operationId": "createFeedbackReport",
        "target": "app",
        "method": "POST",
        "path": "/feedback-reports",
        "authentication": "public",
        "tags": [
            "feedback-reports"
        ],
        "summary": "Create FeedbackReport",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": {
            "required": true,
            "contentType": "application/json",
            "schema": {
                "$ref": "#/components/schemas/CreateFeedbackReportBody"
            }
        },
        "responses": [
            {
                "status": 201,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/FeedbackReportAccepted"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 422,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "oneOf": [
                                {
                                    "$ref": "#/components/schemas/ReferenceNotFoundProblem"
                                },
                                {
                                    "$ref": "#/components/schemas/InvalidFeedbackReportProblem"
                                }
                            ],
                            "discriminator": {
                                "propertyName": "type",
                                "mapping": {
                                    "urn:pomi:problem:reference-not-found": "#/components/schemas/ReferenceNotFoundProblem",
                                    "urn:pomi:problem:invalid-feedback-report": "#/components/schemas/InvalidFeedbackReportProblem"
                                }
                            }
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:reference-not-found",
                    "urn:pomi:problem:invalid-feedback-report"
                ]
            },
            {
                "status": 429,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/FeedbackRateLimitProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:feedback-rate-limit"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "feedbackReports",
            "method": "create",
            "action": "create"
        },
        "pagination": null
    },
    "createStudentAbsences": {
        "operationId": "createStudentAbsences",
        "target": "app",
        "method": "POST",
        "path": "/student/{sid}/absences",
        "authentication": "required",
        "tags": [
            "student-absences"
        ],
        "summary": "Create StudentAbsences",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": {
            "required": true,
            "contentType": "application/json",
            "schema": {
                "$ref": "#/components/schemas/CreateStudentAbsenceBody"
            }
        },
        "responses": [
            {
                "status": 201,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/StudentAbsence"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 409,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/UniqueConstraintConflictProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:unique-constraint-conflict"
                ]
            },
            {
                "status": 422,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "oneOf": [
                                {
                                    "$ref": "#/components/schemas/ReferenceNotFoundProblem"
                                },
                                {
                                    "$ref": "#/components/schemas/InvalidStudentAbsenceProblem"
                                }
                            ],
                            "discriminator": {
                                "propertyName": "type",
                                "mapping": {
                                    "urn:pomi:problem:reference-not-found": "#/components/schemas/ReferenceNotFoundProblem",
                                    "urn:pomi:problem:invalid-student-absence": "#/components/schemas/InvalidStudentAbsenceProblem"
                                }
                            }
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:reference-not-found",
                    "urn:pomi:problem:invalid-student-absence"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "studentAbsences",
            "method": "create",
            "action": "create",
            "pathParameters": {
                "sid": "studentId"
            }
        },
        "pagination": null
    },
    "createStudentCourseAttempts": {
        "operationId": "createStudentCourseAttempts",
        "target": "app",
        "method": "POST",
        "path": "/student/{sid}/course-attempts",
        "authentication": "required",
        "tags": [
            "student-course-attempts"
        ],
        "summary": "Create StudentCourseAttempts",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": {
            "required": true,
            "contentType": "application/json",
            "schema": {
                "$ref": "#/components/schemas/CreateStudentCourseAttemptInput"
            }
        },
        "responses": [
            {
                "status": 201,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/StudentCourseAttempt"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 409,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/UniqueConstraintConflictProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:unique-constraint-conflict"
                ]
            },
            {
                "status": 422,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "oneOf": [
                                {
                                    "$ref": "#/components/schemas/ReferenceNotFoundProblem"
                                },
                                {
                                    "$ref": "#/components/schemas/InvalidStudentCourseAttemptProblem"
                                }
                            ],
                            "discriminator": {
                                "propertyName": "type",
                                "mapping": {
                                    "urn:pomi:problem:reference-not-found": "#/components/schemas/ReferenceNotFoundProblem",
                                    "urn:pomi:problem:invalid-student-course-attempt": "#/components/schemas/InvalidStudentCourseAttemptProblem"
                                }
                            }
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:reference-not-found",
                    "urn:pomi:problem:invalid-student-course-attempt"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "courseAttempts",
            "action": "create",
            "method": "create",
            "pathParameters": {
                "sid": "studentId"
            }
        },
        "pagination": null
    },
    "createStudentCurricula": {
        "operationId": "createStudentCurricula",
        "target": "app",
        "method": "POST",
        "path": "/student/{sid}/curricula",
        "authentication": "required",
        "tags": [
            "curricula"
        ],
        "summary": "Create StudentCurricula",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": {
            "required": true,
            "contentType": "application/json",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "minLength": 1
                    },
                    "selection": {
                        "type": "object",
                        "properties": {
                            "catalogProgramId": {
                                "type": "integer",
                                "nullable": true
                            },
                            "catalogProgramVariantId": {
                                "type": "integer",
                                "nullable": true
                            },
                            "languageId": {
                                "type": "integer",
                                "nullable": true
                            }
                        },
                        "additionalProperties": false
                    },
                    "planningStart": {
                        "type": "object",
                        "nullable": true,
                        "properties": {
                            "year": {
                                "type": "integer"
                            },
                            "semester": {
                                "anyOf": [
                                    {
                                        "type": "number",
                                        "enum": [
                                            1
                                        ]
                                    },
                                    {
                                        "type": "number",
                                        "enum": [
                                            2
                                        ]
                                    }
                                ]
                            },
                            "semesterNumber": {
                                "type": "integer",
                                "minimum": 0,
                                "exclusiveMinimum": true
                            }
                        },
                        "required": [
                            "year",
                            "semester",
                            "semesterNumber"
                        ],
                        "additionalProperties": false
                    },
                    "currentPeriodId": {
                        "type": "integer",
                        "nullable": true
                    },
                    "periods": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "position": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "exclusiveMinimum": true
                                }
                            },
                            "required": [
                                "position"
                            ],
                            "additionalProperties": false
                        }
                    },
                    "courses": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "courseId": {
                                    "type": "integer"
                                },
                                "periodId": {
                                    "type": "integer",
                                    "nullable": true
                                }
                            },
                            "required": [
                                "courseId",
                                "periodId"
                            ],
                            "additionalProperties": false
                        }
                    }
                },
                "additionalProperties": false
            }
        },
        "responses": [
            {
                "status": 201,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/CurriculumEntity"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 422,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "oneOf": [
                                {
                                    "$ref": "#/components/schemas/ReferenceNotFoundProblem"
                                },
                                {
                                    "$ref": "#/components/schemas/InvalidCurriculumProblem"
                                }
                            ],
                            "discriminator": {
                                "propertyName": "type",
                                "mapping": {
                                    "urn:pomi:problem:reference-not-found": "#/components/schemas/ReferenceNotFoundProblem",
                                    "urn:pomi:problem:invalid-curriculum": "#/components/schemas/InvalidCurriculumProblem"
                                }
                            }
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:reference-not-found",
                    "urn:pomi:problem:invalid-curriculum"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "curricula",
            "method": "create",
            "action": "create",
            "pathParameters": {
                "sid": "studentId"
            }
        },
        "pagination": null
    },
    "createStudentFeedbackReport": {
        "operationId": "createStudentFeedbackReport",
        "target": "app",
        "method": "POST",
        "path": "/student/{sid}/feedback-reports",
        "authentication": "required",
        "tags": [
            "feedback-reports"
        ],
        "summary": "Create StudentFeedbackReport",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": {
            "required": true,
            "contentType": "application/json",
            "schema": {
                "$ref": "#/components/schemas/CreateFeedbackReportBody"
            }
        },
        "responses": [
            {
                "status": 201,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/FeedbackReportAccepted"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 422,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "oneOf": [
                                {
                                    "$ref": "#/components/schemas/ReferenceNotFoundProblem"
                                },
                                {
                                    "$ref": "#/components/schemas/InvalidFeedbackReportProblem"
                                }
                            ],
                            "discriminator": {
                                "propertyName": "type",
                                "mapping": {
                                    "urn:pomi:problem:reference-not-found": "#/components/schemas/ReferenceNotFoundProblem",
                                    "urn:pomi:problem:invalid-feedback-report": "#/components/schemas/InvalidFeedbackReportProblem"
                                }
                            }
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:reference-not-found",
                    "urn:pomi:problem:invalid-feedback-report"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "feedbackReports",
            "method": "createForStudent",
            "action": "create",
            "pathParameters": {
                "sid": "studentId"
            }
        },
        "pagination": null
    },
    "createStudentFriendship": {
        "operationId": "createStudentFriendship",
        "target": "app",
        "method": "POST",
        "path": "/student/{sid}/friendships",
        "authentication": "required",
        "tags": [
            "student-social"
        ],
        "summary": "Create StudentFriendship",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": {
            "required": true,
            "contentType": "application/json",
            "schema": {
                "type": "object",
                "properties": {
                    "targetPublicId": {
                        "type": "string",
                        "format": "uuid"
                    }
                },
                "required": [
                    "targetPublicId"
                ],
                "additionalProperties": false
            }
        },
        "responses": [
            {
                "status": 201,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/StudentFriendship"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 409,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/UniqueConstraintConflictProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:unique-constraint-conflict"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "studentSocial",
            "method": "createFriendship",
            "action": "create",
            "pathParameters": {
                "sid": "studentId"
            }
        },
        "pagination": null
    },
    "createStudentHistory": {
        "operationId": "createStudentHistory",
        "target": "app",
        "method": "POST",
        "path": "/student/{sid}/course-history",
        "authentication": "required",
        "tags": [
            "student-course-history"
        ],
        "summary": "Create StudentHistory",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": {
            "required": true,
            "contentType": "application/json",
            "schema": {
                "$ref": "#/components/schemas/StudentHistoryImportBody"
            }
        },
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/StudentHistoryImportSummary"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 422,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidStudentHistoryImportProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-student-history-import"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "studentHistory",
            "method": "create",
            "action": "create",
            "pathParameters": {
                "sid": "studentId"
            }
        },
        "pagination": null
    },
    "createStudentPeriodPlannings": {
        "operationId": "createStudentPeriodPlannings",
        "target": "app",
        "method": "POST",
        "path": "/student/{sid}/period-plannings",
        "authentication": "required",
        "tags": [
            "period-plannings"
        ],
        "summary": "Create StudentPeriodPlannings",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": {
            "required": true,
            "contentType": "application/json",
            "schema": {
                "$ref": "#/components/schemas/CreatePeriodPlanningInput"
            }
        },
        "responses": [
            {
                "status": 201,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/PeriodPlanningEntity"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 422,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "oneOf": [
                                {
                                    "$ref": "#/components/schemas/ReferenceNotFoundProblem"
                                },
                                {
                                    "$ref": "#/components/schemas/InvalidPeriodPlanProblem"
                                }
                            ],
                            "discriminator": {
                                "propertyName": "type",
                                "mapping": {
                                    "urn:pomi:problem:reference-not-found": "#/components/schemas/ReferenceNotFoundProblem",
                                    "urn:pomi:problem:invalid-period-plan": "#/components/schemas/InvalidPeriodPlanProblem"
                                }
                            }
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:reference-not-found",
                    "urn:pomi:problem:invalid-period-plan"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "periodPlannings",
            "action": "create",
            "method": "create",
            "pathParameters": {
                "sid": "studentId"
            }
        },
        "pagination": null
    },
    "createStudents": {
        "operationId": "createStudents",
        "target": "app",
        "method": "POST",
        "path": "/students",
        "authentication": "required",
        "tags": [
            "students"
        ],
        "summary": "Create Students",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": {
            "required": true,
            "contentType": "application/json",
            "schema": {
                "$ref": "#/components/schemas/CreateStudentBody"
            }
        },
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/StudentEntity"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 201,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/StudentEntity"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 409,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/UniqueConstraintConflictProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:unique-constraint-conflict"
                ]
            },
            {
                "status": 422,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "oneOf": [
                                {
                                    "$ref": "#/components/schemas/ReferenceNotFoundProblem"
                                },
                                {
                                    "$ref": "#/components/schemas/InvalidStudentProfileProblem"
                                }
                            ],
                            "discriminator": {
                                "propertyName": "type",
                                "mapping": {
                                    "urn:pomi:problem:reference-not-found": "#/components/schemas/ReferenceNotFoundProblem",
                                    "urn:pomi:problem:invalid-student-profile": "#/components/schemas/InvalidStudentProfileProblem"
                                }
                            }
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:reference-not-found",
                    "urn:pomi:problem:invalid-student-profile"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "students",
            "method": "create",
            "action": "create"
        },
        "pagination": null
    },
    "createTag": {
        "operationId": "createTag",
        "target": "app",
        "method": "POST",
        "path": "/tags",
        "authentication": "required",
        "tags": [
            "tags"
        ],
        "summary": "Create Tag",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": {
            "required": true,
            "contentType": "application/json",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "minLength": 1
                    },
                    "categoryId": {
                        "type": "integer",
                        "minimum": 0,
                        "exclusiveMinimum": true
                    },
                    "parentTagId": {
                        "type": "integer",
                        "nullable": true,
                        "minimum": 0,
                        "exclusiveMinimum": true
                    }
                },
                "required": [
                    "name",
                    "categoryId",
                    "parentTagId"
                ],
                "additionalProperties": false
            }
        },
        "responses": [
            {
                "status": 201,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/Tag"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 409,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/UniqueConstraintConflictProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:unique-constraint-conflict"
                ]
            },
            {
                "status": 422,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ReferenceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:reference-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "tags",
            "method": "create",
            "action": "create"
        },
        "pagination": null
    },
    "deleteCategory": {
        "operationId": "deleteCategory",
        "target": "app",
        "method": "DELETE",
        "path": "/categories/{id}",
        "authentication": "required",
        "tags": [
            "categories"
        ],
        "summary": "Delete Category",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 204,
                "success": true,
                "contents": [],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 409,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/UniqueConstraintConflictProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:unique-constraint-conflict"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "categories",
            "method": "delete",
            "action": "delete",
            "pathParameters": {
                "id": "categoryId"
            }
        },
        "pagination": null
    },
    "deleteStudentAbsences": {
        "operationId": "deleteStudentAbsences",
        "target": "app",
        "method": "DELETE",
        "path": "/student/{sid}/absences/{id}",
        "authentication": "required",
        "tags": [
            "student-absences"
        ],
        "summary": "Delete StudentAbsences",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid",
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 204,
                "success": true,
                "contents": [],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "studentAbsences",
            "method": "delete",
            "action": "delete",
            "pathParameters": {
                "sid": "studentId",
                "id": "studentAbsenceId"
            }
        },
        "pagination": null
    },
    "deleteStudentCourseAttempts": {
        "operationId": "deleteStudentCourseAttempts",
        "target": "app",
        "method": "DELETE",
        "path": "/student/{sid}/course-attempts/{id}",
        "authentication": "required",
        "tags": [
            "student-course-attempts"
        ],
        "summary": "Delete StudentCourseAttempts",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid",
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 204,
                "success": true,
                "contents": [],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "courseAttempts",
            "action": "delete",
            "method": "delete",
            "pathParameters": {
                "sid": "studentId",
                "id": "courseAttemptId"
            }
        },
        "pagination": null
    },
    "deleteStudentCurricula": {
        "operationId": "deleteStudentCurricula",
        "target": "app",
        "method": "DELETE",
        "path": "/student/{sid}/curricula/{id}",
        "authentication": "required",
        "tags": [
            "curricula"
        ],
        "summary": "Delete StudentCurricula",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid",
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 204,
                "success": true,
                "contents": [],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "curricula",
            "method": "delete",
            "action": "delete",
            "pathParameters": {
                "sid": "studentId",
                "id": "curriculumId"
            }
        },
        "pagination": null
    },
    "deleteStudentFriendship": {
        "operationId": "deleteStudentFriendship",
        "target": "app",
        "method": "DELETE",
        "path": "/student/{sid}/friendships/{id}",
        "authentication": "required",
        "tags": [
            "student-social"
        ],
        "summary": "Delete StudentFriendship",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid",
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 204,
                "success": true,
                "contents": [],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "studentSocial",
            "method": "removeFriendship",
            "action": "delete",
            "pathParameters": {
                "sid": "studentId",
                "id": "friendshipId"
            }
        },
        "pagination": null
    },
    "deleteStudentPeriodPlannings": {
        "operationId": "deleteStudentPeriodPlannings",
        "target": "app",
        "method": "DELETE",
        "path": "/student/{sid}/period-plannings/{id}",
        "authentication": "required",
        "tags": [
            "period-plannings"
        ],
        "summary": "Delete StudentPeriodPlannings",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid",
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 204,
                "success": true,
                "contents": [],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "periodPlannings",
            "action": "delete",
            "method": "delete",
            "pathParameters": {
                "sid": "studentId",
                "id": "periodPlanningId"
            }
        },
        "pagination": null
    },
    "deleteStudents": {
        "operationId": "deleteStudents",
        "target": "app",
        "method": "DELETE",
        "path": "/students/{id}",
        "authentication": "required",
        "tags": [
            "students"
        ],
        "summary": "Delete Students",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": {
            "required": true,
            "contentType": "application/json",
            "schema": {
                "type": "object",
                "properties": {
                    "confirmationRa": {
                        "type": "string",
                        "pattern": "^\\d{6}$"
                    }
                },
                "required": [
                    "confirmationRa"
                ],
                "additionalProperties": false
            }
        },
        "responses": [
            {
                "status": 204,
                "success": true,
                "contents": [],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 422,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidStudentProfileProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-student-profile"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "students",
            "method": "delete",
            "action": "delete",
            "pathParameters": {
                "id": "studentId"
            }
        },
        "pagination": null
    },
    "deleteStudentTagInterest": {
        "operationId": "deleteStudentTagInterest",
        "target": "app",
        "method": "DELETE",
        "path": "/student/{sid}/tag-interests/{tagId}",
        "authentication": "required",
        "tags": [
            "student-tag-interests"
        ],
        "summary": "Delete StudentTagInterest",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid",
            "tagId"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 204,
                "success": true,
                "contents": [],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "studentTagInterests",
            "method": "delete",
            "action": "delete",
            "pathParameters": {
                "sid": "studentId",
                "tagId": "tagId"
            }
        },
        "pagination": null
    },
    "deleteTag": {
        "operationId": "deleteTag",
        "target": "app",
        "method": "DELETE",
        "path": "/tags/{id}",
        "authentication": "required",
        "tags": [
            "tags"
        ],
        "summary": "Delete Tag",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 204,
                "success": true,
                "contents": [],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 409,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/UniqueConstraintConflictProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:unique-constraint-conflict"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "tags",
            "method": "delete",
            "action": "delete",
            "pathParameters": {
                "id": "tagId"
            }
        },
        "pagination": null
    },
    "getCategory": {
        "operationId": "getCategory",
        "target": "app",
        "method": "GET",
        "path": "/categories/{id}",
        "authentication": "public",
        "tags": [
            "categories"
        ],
        "summary": "Get Category",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/Category"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "categories",
            "method": "get",
            "action": "get",
            "pathParameters": {
                "id": "categoryId"
            }
        },
        "pagination": null
    },
    "getCurrentUser": {
        "operationId": "getCurrentUser",
        "target": "app",
        "method": "GET",
        "path": "/me",
        "authentication": "required",
        "tags": [
            "current-user"
        ],
        "summary": "Get CurrentUser",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/CurrentUserEntity"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "currentUser",
            "method": "get",
            "action": "get"
        },
        "pagination": null
    },
    "getExchangeNoticeSubscription": {
        "operationId": "getExchangeNoticeSubscription",
        "target": "app",
        "method": "GET",
        "path": "/student/{sid}/exchange-notice-subscription",
        "authentication": "required",
        "tags": [
            "exchange-notice-subscriptions"
        ],
        "summary": "Get ExchangeNoticeSubscription",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/ExchangeNoticeSubscription"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "exchangeNoticeSubscriptions",
            "method": "get",
            "action": "get",
            "pathParameters": {
                "sid": "studentId"
            }
        },
        "pagination": null
    },
    "getProfessorEvaluation": {
        "operationId": "getProfessorEvaluation",
        "target": "app",
        "method": "GET",
        "path": "/student/{sid}/classes/{classId}/professors/{professorId}/evaluation",
        "authentication": "required",
        "tags": [
            "professor-evaluations"
        ],
        "summary": "Get ProfessorEvaluation",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid",
            "classId",
            "professorId"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/ProfessorEvaluationEligibility"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 422,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "oneOf": [
                                {
                                    "$ref": "#/components/schemas/ReferenceNotFoundProblem"
                                },
                                {
                                    "$ref": "#/components/schemas/InvalidProfessorEvaluationProblem"
                                }
                            ],
                            "discriminator": {
                                "propertyName": "type",
                                "mapping": {
                                    "urn:pomi:problem:reference-not-found": "#/components/schemas/ReferenceNotFoundProblem",
                                    "urn:pomi:problem:invalid-professor-evaluation": "#/components/schemas/InvalidProfessorEvaluationProblem"
                                }
                            }
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:reference-not-found",
                    "urn:pomi:problem:invalid-professor-evaluation"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "professorEvaluations",
            "method": "get",
            "action": "get",
            "pathParameters": {
                "sid": "studentId",
                "classId": "classId",
                "professorId": "professorId"
            }
        },
        "pagination": null
    },
    "getPublicSharedPeriodPlanning": {
        "operationId": "getPublicSharedPeriodPlanning",
        "target": "app",
        "method": "GET",
        "path": "/shared-period-plannings/{shareId}",
        "authentication": "public",
        "tags": [
            "shared-period-plannings"
        ],
        "summary": "Get PublicSharedPeriodPlanning",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "shareId"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/SharedPeriodPlanning"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "sharedPeriodPlannings",
            "method": "getPublic",
            "action": "get",
            "pathParameters": {
                "shareId": "shareId"
            }
        },
        "pagination": null
    },
    "getStudentCourseAttempts": {
        "operationId": "getStudentCourseAttempts",
        "target": "app",
        "method": "GET",
        "path": "/student/{sid}/course-attempts/{id}",
        "authentication": "required",
        "tags": [
            "student-course-attempts"
        ],
        "summary": "Get StudentCourseAttempts",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid",
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/StudentCourseAttempt"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "courseAttempts",
            "action": "get",
            "method": "get",
            "pathParameters": {
                "sid": "studentId",
                "id": "courseAttemptId"
            }
        },
        "pagination": null
    },
    "getStudentCurricula": {
        "operationId": "getStudentCurricula",
        "target": "app",
        "method": "GET",
        "path": "/student/{sid}/curricula/{id}",
        "authentication": "required",
        "tags": [
            "curricula"
        ],
        "summary": "Get StudentCurricula",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid",
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/CurriculumEntity"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "curricula",
            "method": "get",
            "action": "get",
            "pathParameters": {
                "sid": "studentId",
                "id": "curriculumId"
            }
        },
        "pagination": null
    },
    "getStudentPeriodPlannings": {
        "operationId": "getStudentPeriodPlannings",
        "target": "app",
        "method": "GET",
        "path": "/student/{sid}/period-plannings/{id}",
        "authentication": "required",
        "tags": [
            "period-plannings"
        ],
        "summary": "Get StudentPeriodPlannings",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid",
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/PeriodPlanningEntity"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "periodPlannings",
            "action": "get",
            "method": "get",
            "pathParameters": {
                "sid": "studentId",
                "id": "periodPlanningId"
            }
        },
        "pagination": null
    },
    "getStudentPerson": {
        "operationId": "getStudentPerson",
        "target": "app",
        "method": "GET",
        "path": "/student/{sid}/people/{publicId}",
        "authentication": "required",
        "tags": [
            "student-social"
        ],
        "summary": "Get StudentPerson",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid",
            "publicId"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/StudentPublicPerson"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "studentSocial",
            "method": "getPerson",
            "action": "get",
            "pathParameters": {
                "sid": "studentId",
                "publicId": "publicId"
            }
        },
        "pagination": null
    },
    "getStudentPublicProfile": {
        "operationId": "getStudentPublicProfile",
        "target": "app",
        "method": "GET",
        "path": "/student/{sid}/public-profile",
        "authentication": "required",
        "tags": [
            "student-social"
        ],
        "summary": "Get StudentPublicProfile",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/StudentPublicProfile"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "studentSocial",
            "method": "getProfile",
            "action": "get",
            "pathParameters": {
                "sid": "studentId"
            }
        },
        "pagination": null
    },
    "getStudents": {
        "operationId": "getStudents",
        "target": "app",
        "method": "GET",
        "path": "/students/{id}",
        "authentication": "required",
        "tags": [
            "students"
        ],
        "summary": "Get Students",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/StudentEntity"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "students",
            "method": "get",
            "action": "get",
            "pathParameters": {
                "id": "studentId"
            }
        },
        "pagination": null
    },
    "getStudentSharedPeriodPlanning": {
        "operationId": "getStudentSharedPeriodPlanning",
        "target": "app",
        "method": "GET",
        "path": "/student/{sid}/shared-period-plannings/{shareId}",
        "authentication": "required",
        "tags": [
            "shared-period-plannings"
        ],
        "summary": "Get StudentSharedPeriodPlanning",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid",
            "shareId"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/SharedPeriodPlanning"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "sharedPeriodPlannings",
            "method": "getForStudent",
            "action": "get",
            "pathParameters": {
                "sid": "studentId",
                "shareId": "shareId"
            }
        },
        "pagination": null
    },
    "getTag": {
        "operationId": "getTag",
        "target": "app",
        "method": "GET",
        "path": "/tags/{id}",
        "authentication": "public",
        "tags": [
            "tags"
        ],
        "summary": "Get Tag",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/Tag"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "tags",
            "method": "get",
            "action": "get",
            "pathParameters": {
                "id": "tagId"
            }
        },
        "pagination": null
    },
    "listAuthUsers": {
        "operationId": "listAuthUsers",
        "target": "app",
        "method": "GET",
        "path": "/admin/auth-users",
        "authentication": "required",
        "tags": [
            "auth-users"
        ],
        "summary": "List AuthUsers",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "page",
            "pageSize",
            "sort"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "data": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/AuthUserEntity"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
                            ]
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "id:asc"
                    }
                }
            ],
            "filter": null,
            "sort": {
                "version": 1,
                "fields": [
                    "id",
                    "displayName",
                    "email",
                    "status"
                ],
                "default": "id:asc"
            }
        },
        "sdk": {
            "resource": "authUsers",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
    },
    "listBotGrants": {
        "operationId": "listBotGrants",
        "target": "app",
        "method": "GET",
        "path": "/me/bot-grants",
        "authentication": "required",
        "tags": [
            "bot-grants"
        ],
        "summary": "List BotGrants",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "page",
            "pageSize",
            "sort"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "data": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/BotGrantEntity"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
                            ]
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "createdAt:desc"
                    }
                }
            ],
            "filter": null,
            "sort": {
                "version": 1,
                "fields": [
                    "createdAt",
                    "capability",
                    "botDisplayName"
                ],
                "default": "createdAt:desc"
            }
        },
        "sdk": {
            "resource": "botGrants",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
    },
    "listBots": {
        "operationId": "listBots",
        "target": "app",
        "method": "GET",
        "path": "/bots",
        "authentication": "required",
        "tags": [
            "bot-grants"
        ],
        "summary": "List Bots",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "page",
            "pageSize",
            "sort"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "data": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/BotIdentityEntity"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
                            ]
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "displayName:asc"
                    }
                }
            ],
            "filter": null,
            "sort": {
                "version": 1,
                "fields": [
                    "displayName"
                ],
                "default": "displayName:asc"
            }
        },
        "sdk": {
            "resource": "bots",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
    },
    "listCategories": {
        "operationId": "listCategories",
        "target": "app",
        "method": "GET",
        "path": "/categories",
        "authentication": "public",
        "tags": [
            "categories"
        ],
        "summary": "List Categories",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "page",
            "pageSize",
            "sort"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "data": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/Category"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
                            ]
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "name:asc"
                    }
                }
            ],
            "filter": null,
            "sort": {
                "version": 1,
                "fields": [
                    "name"
                ],
                "default": "name:asc"
            }
        },
        "sdk": {
            "resource": "categories",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
    },
    "listCourseTags": {
        "operationId": "listCourseTags",
        "target": "app",
        "method": "GET",
        "path": "/courses/{courseId}/tags",
        "authentication": "public",
        "tags": [
            "course-tags"
        ],
        "summary": "List CourseTags",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "courseId"
        ],
        "queryParameters": [
            "page",
            "pageSize",
            "sort"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "data": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/Tag"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
                            ]
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "name:asc"
                    }
                }
            ],
            "filter": null,
            "sort": {
                "version": 1,
                "fields": [
                    "name",
                    "categoryId"
                ],
                "default": "name:asc"
            }
        },
        "sdk": {
            "resource": "courseTags",
            "method": "listForCourse",
            "action": "list",
            "pathParameters": {
                "courseId": "courseId"
            }
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
    },
    "listFeedbackReports": {
        "operationId": "listFeedbackReports",
        "target": "app",
        "method": "GET",
        "path": "/admin/feedback-reports",
        "authentication": "required",
        "tags": [
            "feedback-reports"
        ],
        "summary": "List FeedbackReports",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "page",
            "pageSize",
            "sort"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "data": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/FeedbackReport"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
                            ]
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "createdAt:desc"
                    }
                }
            ],
            "filter": null,
            "sort": {
                "version": 1,
                "fields": [
                    "createdAt",
                    "updatedAt",
                    "status",
                    "kind",
                    "title"
                ],
                "default": "createdAt:desc"
            }
        },
        "sdk": {
            "resource": "feedbackReports",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
    },
    "listPendingProfessorEvaluations": {
        "operationId": "listPendingProfessorEvaluations",
        "target": "app",
        "method": "GET",
        "path": "/student/{sid}/professor-evaluations/pending",
        "authentication": "required",
        "tags": [
            "professor-evaluations"
        ],
        "summary": "List PendingProfessorEvaluations",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid"
        ],
        "queryParameters": [
            "page",
            "pageSize",
            "filter",
            "sort"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "data": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/PendingProfessorEvaluation"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
                            ]
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
                {
                    "name": "filter",
                    "required": true,
                    "description": "Pending evaluation filters. Use filter[year]=2026&filter[yearPeriod]=FIRST_SEMESTER.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "year": {
                                "oneOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "type": "integer"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "yearPeriod": {
                                "oneOf": [
                                    {
                                        "enum": [
                                            "FIRST_SEMESTER",
                                            "SECOND_SEMESTER"
                                        ],
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "enum": [
                                                    "FIRST_SEMESTER",
                                                    "SECOND_SEMESTER"
                                                ],
                                                "type": "string"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "courseCode:asc,classCode:asc,professorName:asc"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "year"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq"
                        ]
                    },
                    {
                        "path": [
                            "yearPeriod"
                        ],
                        "schema": {
                            "enum": [
                                "FIRST_SEMESTER",
                                "SECOND_SEMESTER"
                            ],
                            "type": "string"
                        },
                        "operators": [
                            "eq"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            },
            "sort": {
                "version": 1,
                "fields": [
                    "courseCode",
                    "courseName",
                    "classCode",
                    "professorName"
                ],
                "default": "courseCode:asc,classCode:asc,professorName:asc"
            }
        },
        "sdk": {
            "resource": "professorEvaluations",
            "method": "listPending",
            "action": "list",
            "pathParameters": {
                "sid": "studentId"
            }
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
    },
    "listPublicSharedPeriodPlannings": {
        "operationId": "listPublicSharedPeriodPlannings",
        "target": "app",
        "method": "GET",
        "path": "/shared-period-plannings",
        "authentication": "public",
        "tags": [
            "shared-period-plannings"
        ],
        "summary": "List PublicSharedPeriodPlannings",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "page",
            "pageSize",
            "query",
            "filter",
            "sort"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/SharedPeriodPlanningPage"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "maximum": 50,
                        "description": "Number of items per page."
                    }
                },
                {
                    "name": "query",
                    "required": false,
                    "description": null,
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "string",
                        "minLength": 1
                    }
                },
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured shared planning filters. Use filter[studyPeriodId]=42.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "studyPeriodId": {
                                "oneOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "updatedAt:desc"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "studyPeriodId"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            },
            "sort": {
                "version": 1,
                "fields": [
                    "updatedAt",
                    "name",
                    "studyPeriodYear"
                ],
                "default": "updatedAt:desc"
            }
        },
        "sdk": {
            "resource": "sharedPeriodPlannings",
            "action": "list",
            "method": "list"
        },
        "pagination": {
            "defaultMode": "page",
            "defaultPageSize": 20,
            "maxPageSize": 50,
            "allowAll": false
        }
    },
    "listStudentAbsences": {
        "operationId": "listStudentAbsences",
        "target": "app",
        "method": "GET",
        "path": "/student/{sid}/absences",
        "authentication": "required",
        "tags": [
            "student-absences"
        ],
        "summary": "List StudentAbsences",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid"
        ],
        "queryParameters": [
            "page",
            "pageSize",
            "filter",
            "sort"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "data": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/StudentAbsence"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
                            ]
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured absence filters. Use filter[courseAttemptId]=42.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "courseAttemptId": {
                                "oneOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "date:desc"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "courseAttemptId"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            },
            "sort": {
                "version": 1,
                "fields": [
                    "date",
                    "courseCode",
                    "classCode",
                    "start",
                    "createdAt"
                ],
                "default": "date:desc"
            }
        },
        "sdk": {
            "resource": "studentAbsences",
            "method": "list",
            "action": "list",
            "pathParameters": {
                "sid": "studentId"
            }
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
    },
    "listStudentCourseAttempts": {
        "operationId": "listStudentCourseAttempts",
        "target": "app",
        "method": "GET",
        "path": "/student/{sid}/course-attempts",
        "authentication": "required",
        "tags": [
            "student-course-attempts"
        ],
        "summary": "List StudentCourseAttempts",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid"
        ],
        "queryParameters": [
            "page",
            "pageSize",
            "filter",
            "sort"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "data": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/StudentCourseAttempt"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
                            ]
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured course attempt filters. Use filter[status]=APPROVED or filter[courseId]=42.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "status": {
                                "oneOf": [
                                    {
                                        "enum": [
                                            "ENROLLED",
                                            "DROPPED",
                                            "APPROVED",
                                            "FAILED_BY_GRADE",
                                            "APPROVED_BY_ATTENDANCE",
                                            "APPROVED_BY_PROFICIENCY",
                                            "FAILED_BY_ATTENDANCE",
                                            "SUFFICIENT",
                                            "INSUFFICIENT"
                                        ],
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "enum": [
                                                    "ENROLLED",
                                                    "DROPPED",
                                                    "APPROVED",
                                                    "FAILED_BY_GRADE",
                                                    "APPROVED_BY_ATTENDANCE",
                                                    "APPROVED_BY_PROFICIENCY",
                                                    "FAILED_BY_ATTENDANCE",
                                                    "SUFFICIENT",
                                                    "INSUFFICIENT"
                                                ],
                                                "type": "string"
                                            },
                                            "in": {
                                                "items": {
                                                    "enum": [
                                                        "ENROLLED",
                                                        "DROPPED",
                                                        "APPROVED",
                                                        "FAILED_BY_GRADE",
                                                        "APPROVED_BY_ATTENDANCE",
                                                        "APPROVED_BY_PROFICIENCY",
                                                        "FAILED_BY_ATTENDANCE",
                                                        "SUFFICIENT",
                                                        "INSUFFICIENT"
                                                    ],
                                                    "type": "string"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "courseId": {
                                "oneOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "studyPeriodId": {
                                "oneOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "createdAt:desc"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "status"
                        ],
                        "schema": {
                            "enum": [
                                "ENROLLED",
                                "DROPPED",
                                "APPROVED",
                                "FAILED_BY_GRADE",
                                "APPROVED_BY_ATTENDANCE",
                                "APPROVED_BY_PROFICIENCY",
                                "FAILED_BY_ATTENDANCE",
                                "SUFFICIENT",
                                "INSUFFICIENT"
                            ],
                            "type": "string"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "courseId"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "studyPeriodId"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            },
            "sort": {
                "version": 1,
                "fields": [
                    "createdAt",
                    "updatedAt",
                    "courseCode",
                    "status",
                    "grade"
                ],
                "default": "createdAt:desc"
            }
        },
        "sdk": {
            "resource": "courseAttempts",
            "action": "list",
            "method": "list",
            "pathParameters": {
                "sid": "studentId"
            }
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
    },
    "listStudentCurricula": {
        "operationId": "listStudentCurricula",
        "target": "app",
        "method": "GET",
        "path": "/student/{sid}/curricula",
        "authentication": "required",
        "tags": [
            "curricula"
        ],
        "summary": "List StudentCurricula",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid"
        ],
        "queryParameters": [
            "page",
            "pageSize",
            "sort"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "data": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/CurriculumSummaryEntity"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
                            ]
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "isFavorite:desc,updatedAt:desc"
                    }
                }
            ],
            "filter": null,
            "sort": {
                "version": 1,
                "fields": [
                    "isFavorite",
                    "updatedAt",
                    "name"
                ],
                "default": "isFavorite:desc,updatedAt:desc"
            }
        },
        "sdk": {
            "resource": "curricula",
            "method": "list",
            "action": "list",
            "pathParameters": {
                "sid": "studentId"
            }
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
    },
    "listStudentFeedbackReports": {
        "operationId": "listStudentFeedbackReports",
        "target": "app",
        "method": "GET",
        "path": "/student/{sid}/feedback-reports",
        "authentication": "required",
        "tags": [
            "feedback-reports"
        ],
        "summary": "List StudentFeedbackReports",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid"
        ],
        "queryParameters": [
            "page",
            "pageSize",
            "sort"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "data": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/FeedbackReport"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
                            ]
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "createdAt:desc"
                    }
                }
            ],
            "filter": null,
            "sort": {
                "version": 1,
                "fields": [
                    "createdAt",
                    "updatedAt",
                    "status",
                    "kind",
                    "title"
                ],
                "default": "createdAt:desc"
            }
        },
        "sdk": {
            "resource": "feedbackReports",
            "method": "listForStudent",
            "action": "list",
            "pathParameters": {
                "sid": "studentId"
            }
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
    },
    "listStudentFriendships": {
        "operationId": "listStudentFriendships",
        "target": "app",
        "method": "GET",
        "path": "/student/{sid}/friendships",
        "authentication": "required",
        "tags": [
            "student-social"
        ],
        "summary": "List StudentFriendships",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid"
        ],
        "queryParameters": [
            "page",
            "pageSize",
            "filter",
            "sort"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "data": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/StudentFriendship"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
                            ]
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured friendship filters. Use filter[status]=PENDING or filter[direction]=INCOMING.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "status": {
                                "oneOf": [
                                    {
                                        "enum": [
                                            "PENDING",
                                            "ACCEPTED"
                                        ],
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "enum": [
                                                    "PENDING",
                                                    "ACCEPTED"
                                                ],
                                                "type": "string"
                                            },
                                            "in": {
                                                "items": {
                                                    "enum": [
                                                        "PENDING",
                                                        "ACCEPTED"
                                                    ],
                                                    "type": "string"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "direction": {
                                "oneOf": [
                                    {
                                        "enum": [
                                            "INCOMING",
                                            "OUTGOING"
                                        ],
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "enum": [
                                                    "INCOMING",
                                                    "OUTGOING"
                                                ],
                                                "type": "string"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "updatedAt:desc"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "status"
                        ],
                        "schema": {
                            "enum": [
                                "PENDING",
                                "ACCEPTED"
                            ],
                            "type": "string"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "direction"
                        ],
                        "schema": {
                            "enum": [
                                "INCOMING",
                                "OUTGOING"
                            ],
                            "type": "string"
                        },
                        "operators": [
                            "eq"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            },
            "sort": {
                "version": 1,
                "fields": [
                    "updatedAt",
                    "status"
                ],
                "default": "updatedAt:desc"
            }
        },
        "sdk": {
            "resource": "studentSocial",
            "method": "listFriendships",
            "action": "list",
            "pathParameters": {
                "sid": "studentId"
            }
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
    },
    "listStudentPeople": {
        "operationId": "listStudentPeople",
        "target": "app",
        "method": "GET",
        "path": "/student/{sid}/people",
        "authentication": "required",
        "tags": [
            "student-social"
        ],
        "summary": "List StudentPeople",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid"
        ],
        "queryParameters": [
            "page",
            "pageSize",
            "query",
            "sort"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/StudentPeoplePage"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "maximum": 50,
                        "description": "Number of items per page."
                    }
                },
                {
                    "name": "query",
                    "required": false,
                    "description": null,
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "string",
                        "minLength": 1
                    }
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "displayName:asc"
                    }
                }
            ],
            "filter": null,
            "sort": {
                "version": 1,
                "fields": [
                    "displayName"
                ],
                "default": "displayName:asc"
            }
        },
        "sdk": {
            "resource": "studentPeople",
            "action": "list",
            "method": "list",
            "pathParameters": {
                "sid": "studentId"
            }
        },
        "pagination": {
            "defaultMode": "page",
            "defaultPageSize": 20,
            "maxPageSize": 50,
            "allowAll": false
        }
    },
    "listStudentPeriodPlannings": {
        "operationId": "listStudentPeriodPlannings",
        "target": "app",
        "method": "GET",
        "path": "/student/{sid}/period-plannings",
        "authentication": "required",
        "tags": [
            "period-plannings"
        ],
        "summary": "List StudentPeriodPlannings",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid"
        ],
        "queryParameters": [
            "page",
            "pageSize",
            "sort"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "data": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/PeriodPlanningEntity"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
                            ]
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "updatedAt:desc"
                    }
                }
            ],
            "filter": null,
            "sort": {
                "version": 1,
                "fields": [
                    "updatedAt",
                    "name",
                    "studyPeriodYear",
                    "studyPeriodYearPeriod",
                    "visibility"
                ],
                "default": "updatedAt:desc"
            }
        },
        "sdk": {
            "resource": "periodPlannings",
            "action": "list",
            "method": "list",
            "pathParameters": {
                "sid": "studentId"
            }
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
    },
    "listStudents": {
        "operationId": "listStudents",
        "target": "app",
        "method": "GET",
        "path": "/students",
        "authentication": "required",
        "tags": [
            "students"
        ],
        "summary": "List Students",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "page",
            "pageSize",
            "sort"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "data": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/StudentEntity"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
                            ]
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "id:asc"
                    }
                }
            ],
            "filter": null,
            "sort": {
                "version": 1,
                "fields": [
                    "id",
                    "ra",
                    "name",
                    "entryYear"
                ],
                "default": "id:asc"
            }
        },
        "sdk": {
            "resource": "students",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
    },
    "listStudentSharedPeriodPlannings": {
        "operationId": "listStudentSharedPeriodPlannings",
        "target": "app",
        "method": "GET",
        "path": "/student/{sid}/shared-period-plannings",
        "authentication": "required",
        "tags": [
            "shared-period-plannings"
        ],
        "summary": "List StudentSharedPeriodPlannings",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid"
        ],
        "queryParameters": [
            "page",
            "pageSize",
            "filter",
            "sort"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/SharedPeriodPlanningPage"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "maximum": 50,
                        "description": "Number of items per page."
                    }
                },
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured shared planning filters. Use filter[ownerPublicId]=UUID.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "ownerPublicId": {
                                "oneOf": [
                                    {
                                        "format": "uuid",
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "format": "uuid",
                                                "type": "string"
                                            },
                                            "in": {
                                                "items": {
                                                    "format": "uuid",
                                                    "type": "string"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "updatedAt:desc"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "ownerPublicId"
                        ],
                        "schema": {
                            "format": "uuid",
                            "type": "string"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            },
            "sort": {
                "version": 1,
                "fields": [
                    "updatedAt",
                    "name",
                    "studyPeriodYear"
                ],
                "default": "updatedAt:desc"
            }
        },
        "sdk": {
            "resource": "studentSharedPeriodPlannings",
            "action": "list",
            "method": "list",
            "pathParameters": {
                "sid": "studentId"
            }
        },
        "pagination": {
            "defaultMode": "page",
            "defaultPageSize": 20,
            "maxPageSize": 50,
            "allowAll": false
        }
    },
    "listStudentTagInterests": {
        "operationId": "listStudentTagInterests",
        "target": "app",
        "method": "GET",
        "path": "/student/{sid}/tag-interests",
        "authentication": "required",
        "tags": [
            "student-tag-interests"
        ],
        "summary": "List StudentTagInterests",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid"
        ],
        "queryParameters": [
            "page",
            "pageSize",
            "sort"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "data": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/StudentTagInterest"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
                            ]
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "name:asc"
                    }
                }
            ],
            "filter": null,
            "sort": {
                "version": 1,
                "fields": [
                    "name"
                ],
                "default": "name:asc"
            }
        },
        "sdk": {
            "resource": "studentTagInterests",
            "method": "list",
            "action": "list",
            "pathParameters": {
                "sid": "studentId"
            }
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
    },
    "listTagCourses": {
        "operationId": "listTagCourses",
        "target": "app",
        "method": "GET",
        "path": "/tags/{id}/courses",
        "authentication": "public",
        "tags": [
            "course-tags"
        ],
        "summary": "List TagCourses",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [
            "page",
            "pageSize",
            "sort"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "data": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/TagRelatedCourse"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
                            ]
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 20,
                        "description": "Number of items per page."
                    }
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "code:asc"
                    }
                }
            ],
            "filter": null,
            "sort": {
                "version": 1,
                "fields": [
                    "code",
                    "name",
                    "credits"
                ],
                "default": "code:asc"
            }
        },
        "sdk": {
            "resource": "courseTags",
            "method": "listCoursesForTag",
            "action": "list",
            "pathParameters": {
                "id": "tagId"
            }
        },
        "pagination": {
            "defaultMode": "page",
            "defaultPageSize": 20,
            "allowAll": false
        }
    },
    "listTags": {
        "operationId": "listTags",
        "target": "app",
        "method": "GET",
        "path": "/tags",
        "authentication": "public",
        "tags": [
            "tags"
        ],
        "summary": "List Tags",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "page",
            "pageSize",
            "filter",
            "sort"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "data": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/Tag"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
                            ]
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured tag filters. Use filter[categoryId]=1 or filter[courseId]=2.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "categoryId": {
                                "oneOf": [
                                    {
                                        "minimum": 1,
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minimum": 1,
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "minimum": 1,
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "parentTagId": {
                                "oneOf": [
                                    {
                                        "minimum": 1,
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minimum": 1,
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "minimum": 1,
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "courseId": {
                                "oneOf": [
                                    {
                                        "minimum": 1,
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minimum": 1,
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "minimum": 1,
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "name:asc"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "categoryId"
                        ],
                        "schema": {
                            "minimum": 1,
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "parentTagId"
                        ],
                        "schema": {
                            "minimum": 1,
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "courseId"
                        ],
                        "schema": {
                            "minimum": 1,
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            },
            "sort": {
                "version": 1,
                "fields": [
                    "name",
                    "categoryId"
                ],
                "default": "name:asc"
            }
        },
        "sdk": {
            "resource": "tags",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
    },
    "removeCourseTag": {
        "operationId": "removeCourseTag",
        "target": "app",
        "method": "DELETE",
        "path": "/courses/{courseId}/tags/{tagId}",
        "authentication": "required",
        "tags": [
            "course-tags"
        ],
        "summary": "removeCourseTag",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "courseId",
            "tagId"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 204,
                "success": true,
                "contents": [],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 422,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ReferenceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:reference-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "courseTags",
            "method": "remove",
            "action": "delete",
            "pathParameters": {
                "courseId": "courseId",
                "tagId": "tagId"
            }
        },
        "pagination": null
    },
    "replaceBotGrant": {
        "operationId": "replaceBotGrant",
        "target": "app",
        "method": "PUT",
        "path": "/me/bot-grants/{botAuthUserId}",
        "authentication": "required",
        "tags": [
            "bot-grants"
        ],
        "summary": "replaceBotGrant",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "botAuthUserId"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": {
            "required": true,
            "contentType": "application/json",
            "schema": {
                "$ref": "#/components/schemas/ReplaceBotGrantBody"
            }
        },
        "responses": [
            {
                "status": 204,
                "success": true,
                "contents": [],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "botGrants",
            "method": "replace",
            "action": "update",
            "pathParameters": {
                "botAuthUserId": "botAuthUserId"
            }
        },
        "pagination": null
    },
    "unsubscribeExchangeNotices": {
        "operationId": "unsubscribeExchangeNotices",
        "target": "app",
        "method": "POST",
        "path": "/exchange-notice-subscriptions/unsubscribe",
        "authentication": "public",
        "tags": [
            "exchange-notice-subscriptions"
        ],
        "summary": "unsubscribeExchangeNotices",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "token"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "enabled": {
                                    "type": "boolean",
                                    "enum": [
                                        false
                                    ]
                                }
                            },
                            "required": [
                                "enabled"
                            ],
                            "additionalProperties": false
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "token",
                    "required": true,
                    "description": null,
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "string",
                        "minLength": 1
                    }
                }
            ],
            "filter": null
        },
        "sdk": {
            "resource": "exchangeNoticeSubscriptions",
            "method": "unsubscribe",
            "action": "update"
        },
        "pagination": null
    },
    "updateAuthUser": {
        "operationId": "updateAuthUser",
        "target": "app",
        "method": "PATCH",
        "path": "/admin/auth-users/{id}",
        "authentication": "required",
        "tags": [
            "auth-users"
        ],
        "summary": "Update AuthUser",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": {
            "required": true,
            "contentType": "application/json",
            "schema": {
                "$ref": "#/components/schemas/PatchAuthUserBody"
            }
        },
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/AuthUserEntity"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 403,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/AdminIdentityManagedByCliProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:admin-identity-managed-by-cli"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "authUsers",
            "method": "update",
            "action": "update",
            "pathParameters": {
                "id": "authUserId"
            }
        },
        "pagination": null
    },
    "updateCategory": {
        "operationId": "updateCategory",
        "target": "app",
        "method": "PUT",
        "path": "/categories/{id}",
        "authentication": "required",
        "tags": [
            "categories"
        ],
        "summary": "Update Category",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": {
            "required": true,
            "contentType": "application/json",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "minLength": 1
                    }
                },
                "required": [
                    "name"
                ],
                "additionalProperties": false
            }
        },
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/Category"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 409,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/UniqueConstraintConflictProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:unique-constraint-conflict"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "categories",
            "method": "update",
            "action": "update",
            "pathParameters": {
                "id": "categoryId"
            }
        },
        "pagination": null
    },
    "updateExchangeNoticeSubscription": {
        "operationId": "updateExchangeNoticeSubscription",
        "target": "app",
        "method": "PATCH",
        "path": "/student/{sid}/exchange-notice-subscription",
        "authentication": "required",
        "tags": [
            "exchange-notice-subscriptions"
        ],
        "summary": "Update ExchangeNoticeSubscription",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": {
            "required": true,
            "contentType": "application/json",
            "schema": {
                "$ref": "#/components/schemas/PatchExchangeNoticeSubscriptionBody"
            }
        },
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/ExchangeNoticeSubscription"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 422,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ReferenceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:reference-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "exchangeNoticeSubscriptions",
            "method": "update",
            "action": "update",
            "pathParameters": {
                "sid": "studentId"
            }
        },
        "pagination": null
    },
    "updateFeedbackReport": {
        "operationId": "updateFeedbackReport",
        "target": "app",
        "method": "PATCH",
        "path": "/admin/feedback-reports/{id}",
        "authentication": "required",
        "tags": [
            "feedback-reports"
        ],
        "summary": "Update FeedbackReport",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": {
            "required": true,
            "contentType": "application/json",
            "schema": {
                "$ref": "#/components/schemas/PatchFeedbackReportBody"
            }
        },
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/FeedbackReport"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "feedbackReports",
            "method": "update",
            "action": "update",
            "pathParameters": {
                "id": "feedbackReportId"
            }
        },
        "pagination": null
    },
    "updateProfessorEvaluation": {
        "operationId": "updateProfessorEvaluation",
        "target": "app",
        "method": "PUT",
        "path": "/student/{sid}/classes/{classId}/professors/{professorId}/evaluation",
        "authentication": "required",
        "tags": [
            "professor-evaluations"
        ],
        "summary": "Update ProfessorEvaluation",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid",
            "classId",
            "professorId"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": {
            "required": true,
            "contentType": "application/json",
            "schema": {
                "$ref": "#/components/schemas/ProfessorEvaluationBody"
            }
        },
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/ProfessorEvaluation"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 422,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "oneOf": [
                                {
                                    "$ref": "#/components/schemas/ReferenceNotFoundProblem"
                                },
                                {
                                    "$ref": "#/components/schemas/InvalidProfessorEvaluationProblem"
                                }
                            ],
                            "discriminator": {
                                "propertyName": "type",
                                "mapping": {
                                    "urn:pomi:problem:reference-not-found": "#/components/schemas/ReferenceNotFoundProblem",
                                    "urn:pomi:problem:invalid-professor-evaluation": "#/components/schemas/InvalidProfessorEvaluationProblem"
                                }
                            }
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:reference-not-found",
                    "urn:pomi:problem:invalid-professor-evaluation"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "professorEvaluations",
            "method": "update",
            "action": "update",
            "pathParameters": {
                "sid": "studentId",
                "classId": "classId",
                "professorId": "professorId"
            }
        },
        "pagination": null
    },
    "updateStudentCourseAttempts": {
        "operationId": "updateStudentCourseAttempts",
        "target": "app",
        "method": "PATCH",
        "path": "/student/{sid}/course-attempts/{id}",
        "authentication": "required",
        "tags": [
            "student-course-attempts"
        ],
        "summary": "Update StudentCourseAttempts",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid",
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": {
            "required": true,
            "contentType": "application/json",
            "schema": {
                "$ref": "#/components/schemas/UpdateStudentCourseAttemptInput"
            }
        },
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/StudentCourseAttempt"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 409,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/UniqueConstraintConflictProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:unique-constraint-conflict"
                ]
            },
            {
                "status": 422,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "oneOf": [
                                {
                                    "$ref": "#/components/schemas/ReferenceNotFoundProblem"
                                },
                                {
                                    "$ref": "#/components/schemas/InvalidStudentCourseAttemptProblem"
                                }
                            ],
                            "discriminator": {
                                "propertyName": "type",
                                "mapping": {
                                    "urn:pomi:problem:reference-not-found": "#/components/schemas/ReferenceNotFoundProblem",
                                    "urn:pomi:problem:invalid-student-course-attempt": "#/components/schemas/InvalidStudentCourseAttemptProblem"
                                }
                            }
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:reference-not-found",
                    "urn:pomi:problem:invalid-student-course-attempt"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "courseAttempts",
            "action": "update",
            "method": "update",
            "pathParameters": {
                "sid": "studentId",
                "id": "courseAttemptId"
            }
        },
        "pagination": null
    },
    "updateStudentCurricula": {
        "operationId": "updateStudentCurricula",
        "target": "app",
        "method": "PATCH",
        "path": "/student/{sid}/curricula/{id}",
        "authentication": "required",
        "tags": [
            "curricula"
        ],
        "summary": "Update StudentCurricula",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid",
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": {
            "required": true,
            "contentType": "application/json",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "minLength": 1
                    },
                    "isFavorite": {
                        "type": "boolean"
                    },
                    "selection": {
                        "type": "object",
                        "properties": {
                            "catalogProgramId": {
                                "type": "integer",
                                "nullable": true
                            },
                            "catalogProgramVariantId": {
                                "type": "integer",
                                "nullable": true
                            },
                            "languageId": {
                                "type": "integer",
                                "nullable": true
                            }
                        },
                        "additionalProperties": false
                    },
                    "planningStart": {
                        "type": "object",
                        "nullable": true,
                        "properties": {
                            "year": {
                                "type": "integer"
                            },
                            "semester": {
                                "anyOf": [
                                    {
                                        "type": "number",
                                        "enum": [
                                            1
                                        ]
                                    },
                                    {
                                        "type": "number",
                                        "enum": [
                                            2
                                        ]
                                    }
                                ]
                            },
                            "semesterNumber": {
                                "type": "integer",
                                "minimum": 0,
                                "exclusiveMinimum": true
                            }
                        },
                        "required": [
                            "year",
                            "semester",
                            "semesterNumber"
                        ],
                        "additionalProperties": false
                    },
                    "currentPeriodId": {
                        "type": "integer",
                        "nullable": true
                    },
                    "periods": {
                        "type": "object",
                        "properties": {
                            "add": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "position": {
                                            "type": "integer",
                                            "minimum": 0,
                                            "exclusiveMinimum": true
                                        }
                                    },
                                    "required": [
                                        "position"
                                    ],
                                    "additionalProperties": false
                                }
                            },
                            "update": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "id": {
                                            "type": "integer"
                                        },
                                        "position": {
                                            "type": "integer",
                                            "minimum": 0,
                                            "exclusiveMinimum": true
                                        }
                                    },
                                    "required": [
                                        "id",
                                        "position"
                                    ],
                                    "additionalProperties": false
                                }
                            },
                            "remove": {
                                "type": "array",
                                "items": {
                                    "type": "integer"
                                }
                            }
                        },
                        "additionalProperties": false
                    },
                    "courses": {
                        "type": "object",
                        "properties": {
                            "upsert": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "courseId": {
                                            "type": "integer"
                                        },
                                        "periodId": {
                                            "type": "integer",
                                            "nullable": true
                                        }
                                    },
                                    "required": [
                                        "courseId",
                                        "periodId"
                                    ],
                                    "additionalProperties": false
                                }
                            },
                            "remove": {
                                "type": "array",
                                "items": {
                                    "type": "integer"
                                }
                            }
                        },
                        "additionalProperties": false
                    }
                },
                "additionalProperties": false
            }
        },
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/CurriculumEntity"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 422,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "oneOf": [
                                {
                                    "$ref": "#/components/schemas/ReferenceNotFoundProblem"
                                },
                                {
                                    "$ref": "#/components/schemas/InvalidCurriculumProblem"
                                }
                            ],
                            "discriminator": {
                                "propertyName": "type",
                                "mapping": {
                                    "urn:pomi:problem:reference-not-found": "#/components/schemas/ReferenceNotFoundProblem",
                                    "urn:pomi:problem:invalid-curriculum": "#/components/schemas/InvalidCurriculumProblem"
                                }
                            }
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:reference-not-found",
                    "urn:pomi:problem:invalid-curriculum"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "curricula",
            "method": "update",
            "action": "update",
            "pathParameters": {
                "sid": "studentId",
                "id": "curriculumId"
            }
        },
        "pagination": null
    },
    "updateStudentPeriodPlannings": {
        "operationId": "updateStudentPeriodPlannings",
        "target": "app",
        "method": "PATCH",
        "path": "/student/{sid}/period-plannings/{id}",
        "authentication": "required",
        "tags": [
            "period-plannings"
        ],
        "summary": "Update StudentPeriodPlannings",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid",
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": {
            "required": true,
            "contentType": "application/json",
            "schema": {
                "$ref": "#/components/schemas/UpdatePeriodPlanningInput"
            }
        },
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/PeriodPlanningEntity"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 422,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "oneOf": [
                                {
                                    "$ref": "#/components/schemas/ReferenceNotFoundProblem"
                                },
                                {
                                    "$ref": "#/components/schemas/InvalidPeriodPlanProblem"
                                }
                            ],
                            "discriminator": {
                                "propertyName": "type",
                                "mapping": {
                                    "urn:pomi:problem:reference-not-found": "#/components/schemas/ReferenceNotFoundProblem",
                                    "urn:pomi:problem:invalid-period-plan": "#/components/schemas/InvalidPeriodPlanProblem"
                                }
                            }
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:reference-not-found",
                    "urn:pomi:problem:invalid-period-plan"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "periodPlannings",
            "action": "update",
            "method": "update",
            "pathParameters": {
                "sid": "studentId",
                "id": "periodPlanningId"
            }
        },
        "pagination": null
    },
    "updateStudentPublicProfile": {
        "operationId": "updateStudentPublicProfile",
        "target": "app",
        "method": "PATCH",
        "path": "/student/{sid}/public-profile",
        "authentication": "required",
        "tags": [
            "student-social"
        ],
        "summary": "Update StudentPublicProfile",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": {
            "required": true,
            "contentType": "application/json",
            "schema": {
                "type": "object",
                "properties": {
                    "enabled": {
                        "type": "boolean"
                    },
                    "displayName": {
                        "type": "string",
                        "nullable": true,
                        "minLength": 1,
                        "maxLength": 80
                    },
                    "bio": {
                        "type": "string",
                        "nullable": true,
                        "maxLength": 280
                    },
                    "currentCoursesVisibility": {
                        "$ref": "#/components/schemas/StudentProfileVisibility"
                    }
                },
                "additionalProperties": false
            }
        },
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/StudentPublicProfile"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "studentSocial",
            "method": "updateProfile",
            "action": "update",
            "pathParameters": {
                "sid": "studentId"
            }
        },
        "pagination": null
    },
    "updateStudents": {
        "operationId": "updateStudents",
        "target": "app",
        "method": "PATCH",
        "path": "/students/{id}",
        "authentication": "required",
        "tags": [
            "students"
        ],
        "summary": "Update Students",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": {
            "required": true,
            "contentType": "application/json",
            "schema": {
                "$ref": "#/components/schemas/PatchStudentBody"
            }
        },
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/StudentEntity"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 422,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "oneOf": [
                                {
                                    "$ref": "#/components/schemas/ReferenceNotFoundProblem"
                                },
                                {
                                    "$ref": "#/components/schemas/InvalidStudentProfileProblem"
                                }
                            ],
                            "discriminator": {
                                "propertyName": "type",
                                "mapping": {
                                    "urn:pomi:problem:reference-not-found": "#/components/schemas/ReferenceNotFoundProblem",
                                    "urn:pomi:problem:invalid-student-profile": "#/components/schemas/InvalidStudentProfileProblem"
                                }
                            }
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:reference-not-found",
                    "urn:pomi:problem:invalid-student-profile"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "students",
            "method": "update",
            "action": "update",
            "pathParameters": {
                "id": "studentId"
            }
        },
        "pagination": null
    },
    "updateStudentTagInterest": {
        "operationId": "updateStudentTagInterest",
        "target": "app",
        "method": "PUT",
        "path": "/student/{sid}/tag-interests/{tagId}",
        "authentication": "required",
        "tags": [
            "student-tag-interests"
        ],
        "summary": "Update StudentTagInterest",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid",
            "tagId"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 204,
                "success": true,
                "contents": [],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 422,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ReferenceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:reference-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "studentTagInterests",
            "method": "update",
            "action": "update",
            "pathParameters": {
                "sid": "studentId",
                "tagId": "tagId"
            }
        },
        "pagination": null
    },
    "updateTag": {
        "operationId": "updateTag",
        "target": "app",
        "method": "PUT",
        "path": "/tags/{id}",
        "authentication": "required",
        "tags": [
            "tags"
        ],
        "summary": "Update Tag",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": {
            "required": true,
            "contentType": "application/json",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "minLength": 1
                    },
                    "categoryId": {
                        "type": "integer",
                        "minimum": 0,
                        "exclusiveMinimum": true
                    },
                    "parentTagId": {
                        "type": "integer",
                        "nullable": true,
                        "minimum": 0,
                        "exclusiveMinimum": true
                    }
                },
                "required": [
                    "name",
                    "categoryId",
                    "parentTagId"
                ],
                "additionalProperties": false
            }
        },
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/Tag"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 409,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/UniqueConstraintConflictProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:unique-constraint-conflict"
                ]
            },
            {
                "status": 422,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ReferenceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:reference-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "tags",
            "method": "update",
            "action": "update",
            "pathParameters": {
                "id": "tagId"
            }
        },
        "pagination": null
    },
} as const satisfies Record<string, GeneratedOperationDefinition>

export type OperationName = keyof typeof operationDefinitions
