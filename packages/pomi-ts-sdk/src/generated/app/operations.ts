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
type OperationInput<Path, Query, Header, Body, BodyRequired extends boolean> =
    ParameterRecord<Path> & ParameterRecord<Query> & HeaderInput<Header> & BodyInput<Body, BodyRequired>

export type createCategoriesInput = OperationInput<operations["createCategories"]['parameters']['path'], operations["createCategories"]['parameters']['query'], operations["createCategories"]['parameters']['header'], RequestBodyOf<operations["createCategories"]>, true>
export type createCategoriesOutput = operations["createCategories"]['responses'][201]['content']["application/json"]
export type createCategoriesProblem = operations["createCategories"]['responses'][400]['content']["application/problem+json"] | operations["createCategories"]['responses'][409]['content']["application/problem+json"] | operations["createCategories"]['responses'][500]['content']["application/problem+json"]
export type createExchangeNoticeSubscriptionsUnsubscribeInput = OperationInput<operations["createExchangeNoticeSubscriptionsUnsubscribe"]['parameters']['path'], operations["createExchangeNoticeSubscriptionsUnsubscribe"]['parameters']['query'], operations["createExchangeNoticeSubscriptionsUnsubscribe"]['parameters']['header'], RequestBodyOf<operations["createExchangeNoticeSubscriptionsUnsubscribe"]>, false>
export type createExchangeNoticeSubscriptionsUnsubscribeOutput = operations["createExchangeNoticeSubscriptionsUnsubscribe"]['responses'][200]['content']["application/json"]
export type createExchangeNoticeSubscriptionsUnsubscribeProblem = operations["createExchangeNoticeSubscriptionsUnsubscribe"]['responses'][400]['content']["application/problem+json"] | operations["createExchangeNoticeSubscriptionsUnsubscribe"]['responses'][500]['content']["application/problem+json"]
export type createFeedbackReportsInput = OperationInput<operations["createFeedbackReports"]['parameters']['path'], operations["createFeedbackReports"]['parameters']['query'], operations["createFeedbackReports"]['parameters']['header'], RequestBodyOf<operations["createFeedbackReports"]>, true>
export type createFeedbackReportsOutput = operations["createFeedbackReports"]['responses'][201]['content']["application/json"]
export type createFeedbackReportsProblem = operations["createFeedbackReports"]['responses'][400]['content']["application/problem+json"] | operations["createFeedbackReports"]['responses'][404]['content']["application/problem+json"] | operations["createFeedbackReports"]['responses'][422]['content']["application/problem+json"] | operations["createFeedbackReports"]['responses'][429]['content']["application/problem+json"] | operations["createFeedbackReports"]['responses'][500]['content']["application/problem+json"]
export type createStudentAbsencesInput = OperationInput<operations["createStudentAbsences"]['parameters']['path'], operations["createStudentAbsences"]['parameters']['query'], operations["createStudentAbsences"]['parameters']['header'], RequestBodyOf<operations["createStudentAbsences"]>, true>
export type createStudentAbsencesOutput = operations["createStudentAbsences"]['responses'][201]['content']["application/json"]
export type createStudentAbsencesProblem = operations["createStudentAbsences"]['responses'][400]['content']["application/problem+json"] | operations["createStudentAbsences"]['responses'][409]['content']["application/problem+json"] | operations["createStudentAbsences"]['responses'][422]['content']["application/problem+json"] | operations["createStudentAbsences"]['responses'][500]['content']["application/problem+json"]
export type createStudentCourseAttemptsInput = OperationInput<operations["createStudentCourseAttempts"]['parameters']['path'], operations["createStudentCourseAttempts"]['parameters']['query'], operations["createStudentCourseAttempts"]['parameters']['header'], RequestBodyOf<operations["createStudentCourseAttempts"]>, true>
export type createStudentCourseAttemptsOutput = operations["createStudentCourseAttempts"]['responses'][201]['content']["application/json"]
export type createStudentCourseAttemptsProblem = operations["createStudentCourseAttempts"]['responses'][400]['content']["application/problem+json"] | operations["createStudentCourseAttempts"]['responses'][409]['content']["application/problem+json"] | operations["createStudentCourseAttempts"]['responses'][422]['content']["application/problem+json"] | operations["createStudentCourseAttempts"]['responses'][500]['content']["application/problem+json"]
export type createStudentCourseHistoryInput = OperationInput<operations["createStudentCourseHistory"]['parameters']['path'], operations["createStudentCourseHistory"]['parameters']['query'], operations["createStudentCourseHistory"]['parameters']['header'], RequestBodyOf<operations["createStudentCourseHistory"]>, true>
export type createStudentCourseHistoryOutput = operations["createStudentCourseHistory"]['responses'][200]['content']["application/json"]
export type createStudentCourseHistoryProblem = operations["createStudentCourseHistory"]['responses'][400]['content']["application/problem+json"] | operations["createStudentCourseHistory"]['responses'][404]['content']["application/problem+json"] | operations["createStudentCourseHistory"]['responses'][422]['content']["application/problem+json"] | operations["createStudentCourseHistory"]['responses'][500]['content']["application/problem+json"]
export type createStudentCurriculaInput = OperationInput<operations["createStudentCurricula"]['parameters']['path'], operations["createStudentCurricula"]['parameters']['query'], operations["createStudentCurricula"]['parameters']['header'], RequestBodyOf<operations["createStudentCurricula"]>, true>
export type createStudentCurriculaOutput = operations["createStudentCurricula"]['responses'][201]['content']["application/json"]
export type createStudentCurriculaProblem = operations["createStudentCurricula"]['responses'][400]['content']["application/problem+json"] | operations["createStudentCurricula"]['responses'][422]['content']["application/problem+json"] | operations["createStudentCurricula"]['responses'][500]['content']["application/problem+json"]
export type createStudentFeedbackReportsInput = OperationInput<operations["createStudentFeedbackReports"]['parameters']['path'], operations["createStudentFeedbackReports"]['parameters']['query'], operations["createStudentFeedbackReports"]['parameters']['header'], RequestBodyOf<operations["createStudentFeedbackReports"]>, true>
export type createStudentFeedbackReportsOutput = operations["createStudentFeedbackReports"]['responses'][201]['content']["application/json"]
export type createStudentFeedbackReportsProblem = operations["createStudentFeedbackReports"]['responses'][400]['content']["application/problem+json"] | operations["createStudentFeedbackReports"]['responses'][404]['content']["application/problem+json"] | operations["createStudentFeedbackReports"]['responses'][422]['content']["application/problem+json"] | operations["createStudentFeedbackReports"]['responses'][500]['content']["application/problem+json"]
export type createStudentFriendshipsInput = OperationInput<operations["createStudentFriendships"]['parameters']['path'], operations["createStudentFriendships"]['parameters']['query'], operations["createStudentFriendships"]['parameters']['header'], RequestBodyOf<operations["createStudentFriendships"]>, true>
export type createStudentFriendshipsOutput = operations["createStudentFriendships"]['responses'][201]['content']["application/json"]
export type createStudentFriendshipsProblem = operations["createStudentFriendships"]['responses'][400]['content']["application/problem+json"] | operations["createStudentFriendships"]['responses'][404]['content']["application/problem+json"] | operations["createStudentFriendships"]['responses'][409]['content']["application/problem+json"] | operations["createStudentFriendships"]['responses'][500]['content']["application/problem+json"]
export type createStudentFriendshipsAcceptInput = OperationInput<operations["createStudentFriendshipsAccept"]['parameters']['path'], operations["createStudentFriendshipsAccept"]['parameters']['query'], operations["createStudentFriendshipsAccept"]['parameters']['header'], RequestBodyOf<operations["createStudentFriendshipsAccept"]>, false>
export type createStudentFriendshipsAcceptOutput = operations["createStudentFriendshipsAccept"]['responses'][200]['content']["application/json"]
export type createStudentFriendshipsAcceptProblem = operations["createStudentFriendshipsAccept"]['responses'][400]['content']["application/problem+json"] | operations["createStudentFriendshipsAccept"]['responses'][404]['content']["application/problem+json"] | operations["createStudentFriendshipsAccept"]['responses'][409]['content']["application/problem+json"] | operations["createStudentFriendshipsAccept"]['responses'][500]['content']["application/problem+json"]
export type createStudentPeriodPlanInput = OperationInput<operations["createStudentPeriodPlan"]['parameters']['path'], operations["createStudentPeriodPlan"]['parameters']['query'], operations["createStudentPeriodPlan"]['parameters']['header'], RequestBodyOf<operations["createStudentPeriodPlan"]>, true>
export type createStudentPeriodPlanOutput = operations["createStudentPeriodPlan"]['responses'][201]['content']["application/json"]
export type createStudentPeriodPlanProblem = operations["createStudentPeriodPlan"]['responses'][400]['content']["application/problem+json"] | operations["createStudentPeriodPlan"]['responses'][422]['content']["application/problem+json"] | operations["createStudentPeriodPlan"]['responses'][500]['content']["application/problem+json"]
export type createStudentPeriodPlanningsInput = OperationInput<operations["createStudentPeriodPlannings"]['parameters']['path'], operations["createStudentPeriodPlannings"]['parameters']['query'], operations["createStudentPeriodPlannings"]['parameters']['header'], RequestBodyOf<operations["createStudentPeriodPlannings"]>, true>
export type createStudentPeriodPlanningsOutput = operations["createStudentPeriodPlannings"]['responses'][201]['content']["application/json"]
export type createStudentPeriodPlanningsProblem = operations["createStudentPeriodPlannings"]['responses'][400]['content']["application/problem+json"] | operations["createStudentPeriodPlannings"]['responses'][422]['content']["application/problem+json"] | operations["createStudentPeriodPlannings"]['responses'][500]['content']["application/problem+json"]
export type createStudentsInput = OperationInput<operations["createStudents"]['parameters']['path'], operations["createStudents"]['parameters']['query'], operations["createStudents"]['parameters']['header'], RequestBodyOf<operations["createStudents"]>, true>
export type createStudentsOutput = operations["createStudents"]['responses'][200]['content']["application/json"] | operations["createStudents"]['responses'][201]['content']["application/json"]
export type createStudentsProblem = operations["createStudents"]['responses'][400]['content']["application/problem+json"] | operations["createStudents"]['responses'][409]['content']["application/problem+json"] | operations["createStudents"]['responses'][422]['content']["application/problem+json"] | operations["createStudents"]['responses'][500]['content']["application/problem+json"]
export type createTagsInput = OperationInput<operations["createTags"]['parameters']['path'], operations["createTags"]['parameters']['query'], operations["createTags"]['parameters']['header'], RequestBodyOf<operations["createTags"]>, true>
export type createTagsOutput = operations["createTags"]['responses'][201]['content']["application/json"]
export type createTagsProblem = operations["createTags"]['responses'][400]['content']["application/problem+json"] | operations["createTags"]['responses'][409]['content']["application/problem+json"] | operations["createTags"]['responses'][422]['content']["application/problem+json"] | operations["createTags"]['responses'][500]['content']["application/problem+json"]
export type deleteCategoriesInput = OperationInput<operations["deleteCategories"]['parameters']['path'], operations["deleteCategories"]['parameters']['query'], operations["deleteCategories"]['parameters']['header'], RequestBodyOf<operations["deleteCategories"]>, false>
export type deleteCategoriesOutput = void
export type deleteCategoriesProblem = operations["deleteCategories"]['responses'][400]['content']["application/problem+json"] | operations["deleteCategories"]['responses'][404]['content']["application/problem+json"] | operations["deleteCategories"]['responses'][409]['content']["application/problem+json"] | operations["deleteCategories"]['responses'][500]['content']["application/problem+json"]
export type deleteCoursesTagsInput = OperationInput<operations["deleteCoursesTags"]['parameters']['path'], operations["deleteCoursesTags"]['parameters']['query'], operations["deleteCoursesTags"]['parameters']['header'], RequestBodyOf<operations["deleteCoursesTags"]>, false>
export type deleteCoursesTagsOutput = void
export type deleteCoursesTagsProblem = operations["deleteCoursesTags"]['responses'][400]['content']["application/problem+json"] | operations["deleteCoursesTags"]['responses'][422]['content']["application/problem+json"] | operations["deleteCoursesTags"]['responses'][500]['content']["application/problem+json"]
export type deleteStudentAbsencesInput = OperationInput<operations["deleteStudentAbsences"]['parameters']['path'], operations["deleteStudentAbsences"]['parameters']['query'], operations["deleteStudentAbsences"]['parameters']['header'], RequestBodyOf<operations["deleteStudentAbsences"]>, false>
export type deleteStudentAbsencesOutput = void
export type deleteStudentAbsencesProblem = operations["deleteStudentAbsences"]['responses'][400]['content']["application/problem+json"] | operations["deleteStudentAbsences"]['responses'][404]['content']["application/problem+json"] | operations["deleteStudentAbsences"]['responses'][500]['content']["application/problem+json"]
export type deleteStudentCourseAttemptsInput = OperationInput<operations["deleteStudentCourseAttempts"]['parameters']['path'], operations["deleteStudentCourseAttempts"]['parameters']['query'], operations["deleteStudentCourseAttempts"]['parameters']['header'], RequestBodyOf<operations["deleteStudentCourseAttempts"]>, false>
export type deleteStudentCourseAttemptsOutput = void
export type deleteStudentCourseAttemptsProblem = operations["deleteStudentCourseAttempts"]['responses'][400]['content']["application/problem+json"] | operations["deleteStudentCourseAttempts"]['responses'][404]['content']["application/problem+json"] | operations["deleteStudentCourseAttempts"]['responses'][500]['content']["application/problem+json"]
export type deleteStudentCurriculaInput = OperationInput<operations["deleteStudentCurricula"]['parameters']['path'], operations["deleteStudentCurricula"]['parameters']['query'], operations["deleteStudentCurricula"]['parameters']['header'], RequestBodyOf<operations["deleteStudentCurricula"]>, false>
export type deleteStudentCurriculaOutput = void
export type deleteStudentCurriculaProblem = operations["deleteStudentCurricula"]['responses'][400]['content']["application/problem+json"] | operations["deleteStudentCurricula"]['responses'][404]['content']["application/problem+json"] | operations["deleteStudentCurricula"]['responses'][500]['content']["application/problem+json"]
export type deleteStudentFriendshipsInput = OperationInput<operations["deleteStudentFriendships"]['parameters']['path'], operations["deleteStudentFriendships"]['parameters']['query'], operations["deleteStudentFriendships"]['parameters']['header'], RequestBodyOf<operations["deleteStudentFriendships"]>, false>
export type deleteStudentFriendshipsOutput = void
export type deleteStudentFriendshipsProblem = operations["deleteStudentFriendships"]['responses'][400]['content']["application/problem+json"] | operations["deleteStudentFriendships"]['responses'][404]['content']["application/problem+json"] | operations["deleteStudentFriendships"]['responses'][500]['content']["application/problem+json"]
export type deleteStudentPeriodPlanInput = OperationInput<operations["deleteStudentPeriodPlan"]['parameters']['path'], operations["deleteStudentPeriodPlan"]['parameters']['query'], operations["deleteStudentPeriodPlan"]['parameters']['header'], RequestBodyOf<operations["deleteStudentPeriodPlan"]>, false>
export type deleteStudentPeriodPlanOutput = void
export type deleteStudentPeriodPlanProblem = operations["deleteStudentPeriodPlan"]['responses'][400]['content']["application/problem+json"] | operations["deleteStudentPeriodPlan"]['responses'][404]['content']["application/problem+json"] | operations["deleteStudentPeriodPlan"]['responses'][500]['content']["application/problem+json"]
export type deleteStudentPeriodPlanningsInput = OperationInput<operations["deleteStudentPeriodPlannings"]['parameters']['path'], operations["deleteStudentPeriodPlannings"]['parameters']['query'], operations["deleteStudentPeriodPlannings"]['parameters']['header'], RequestBodyOf<operations["deleteStudentPeriodPlannings"]>, false>
export type deleteStudentPeriodPlanningsOutput = void
export type deleteStudentPeriodPlanningsProblem = operations["deleteStudentPeriodPlannings"]['responses'][400]['content']["application/problem+json"] | operations["deleteStudentPeriodPlannings"]['responses'][404]['content']["application/problem+json"] | operations["deleteStudentPeriodPlannings"]['responses'][500]['content']["application/problem+json"]
export type deleteStudentsInput = OperationInput<operations["deleteStudents"]['parameters']['path'], operations["deleteStudents"]['parameters']['query'], operations["deleteStudents"]['parameters']['header'], RequestBodyOf<operations["deleteStudents"]>, true>
export type deleteStudentsOutput = void
export type deleteStudentsProblem = operations["deleteStudents"]['responses'][400]['content']["application/problem+json"] | operations["deleteStudents"]['responses'][404]['content']["application/problem+json"] | operations["deleteStudents"]['responses'][422]['content']["application/problem+json"] | operations["deleteStudents"]['responses'][500]['content']["application/problem+json"]
export type deleteStudentTagInterestsInput = OperationInput<operations["deleteStudentTagInterests"]['parameters']['path'], operations["deleteStudentTagInterests"]['parameters']['query'], operations["deleteStudentTagInterests"]['parameters']['header'], RequestBodyOf<operations["deleteStudentTagInterests"]>, false>
export type deleteStudentTagInterestsOutput = void
export type deleteStudentTagInterestsProblem = operations["deleteStudentTagInterests"]['responses'][400]['content']["application/problem+json"] | operations["deleteStudentTagInterests"]['responses'][500]['content']["application/problem+json"]
export type deleteTagsInput = OperationInput<operations["deleteTags"]['parameters']['path'], operations["deleteTags"]['parameters']['query'], operations["deleteTags"]['parameters']['header'], RequestBodyOf<operations["deleteTags"]>, false>
export type deleteTagsOutput = void
export type deleteTagsProblem = operations["deleteTags"]['responses'][400]['content']["application/problem+json"] | operations["deleteTags"]['responses'][404]['content']["application/problem+json"] | operations["deleteTags"]['responses'][409]['content']["application/problem+json"] | operations["deleteTags"]['responses'][500]['content']["application/problem+json"]
export type getCategoriesInput = OperationInput<operations["getCategories"]['parameters']['path'], operations["getCategories"]['parameters']['query'], operations["getCategories"]['parameters']['header'], RequestBodyOf<operations["getCategories"]>, false>
export type getCategoriesOutput = operations["getCategories"]['responses'][200]['content']["application/json"]
export type getCategoriesProblem = operations["getCategories"]['responses'][400]['content']["application/problem+json"] | operations["getCategories"]['responses'][404]['content']["application/problem+json"] | operations["getCategories"]['responses'][500]['content']["application/problem+json"]
export type getSharedPeriodPlanningsInput = OperationInput<operations["getSharedPeriodPlannings"]['parameters']['path'], operations["getSharedPeriodPlannings"]['parameters']['query'], operations["getSharedPeriodPlannings"]['parameters']['header'], RequestBodyOf<operations["getSharedPeriodPlannings"]>, false>
export type getSharedPeriodPlanningsOutput = operations["getSharedPeriodPlannings"]['responses'][200]['content']["application/json"]
export type getSharedPeriodPlanningsProblem = operations["getSharedPeriodPlannings"]['responses'][400]['content']["application/problem+json"] | operations["getSharedPeriodPlannings"]['responses'][404]['content']["application/problem+json"] | operations["getSharedPeriodPlannings"]['responses'][500]['content']["application/problem+json"]
export type getStudentCourseAttemptsInput = OperationInput<operations["getStudentCourseAttempts"]['parameters']['path'], operations["getStudentCourseAttempts"]['parameters']['query'], operations["getStudentCourseAttempts"]['parameters']['header'], RequestBodyOf<operations["getStudentCourseAttempts"]>, false>
export type getStudentCourseAttemptsOutput = operations["getStudentCourseAttempts"]['responses'][200]['content']["application/json"]
export type getStudentCourseAttemptsProblem = operations["getStudentCourseAttempts"]['responses'][400]['content']["application/problem+json"] | operations["getStudentCourseAttempts"]['responses'][404]['content']["application/problem+json"] | operations["getStudentCourseAttempts"]['responses'][500]['content']["application/problem+json"]
export type getStudentCurriculaInput = OperationInput<operations["getStudentCurricula"]['parameters']['path'], operations["getStudentCurricula"]['parameters']['query'], operations["getStudentCurricula"]['parameters']['header'], RequestBodyOf<operations["getStudentCurricula"]>, false>
export type getStudentCurriculaOutput = operations["getStudentCurricula"]['responses'][200]['content']["application/json"]
export type getStudentCurriculaProblem = operations["getStudentCurricula"]['responses'][400]['content']["application/problem+json"] | operations["getStudentCurricula"]['responses'][404]['content']["application/problem+json"] | operations["getStudentCurricula"]['responses'][500]['content']["application/problem+json"]
export type getStudentPeopleInput = OperationInput<operations["getStudentPeople"]['parameters']['path'], operations["getStudentPeople"]['parameters']['query'], operations["getStudentPeople"]['parameters']['header'], RequestBodyOf<operations["getStudentPeople"]>, false>
export type getStudentPeopleOutput = operations["getStudentPeople"]['responses'][200]['content']["application/json"]
export type getStudentPeopleProblem = operations["getStudentPeople"]['responses'][400]['content']["application/problem+json"] | operations["getStudentPeople"]['responses'][404]['content']["application/problem+json"] | operations["getStudentPeople"]['responses'][500]['content']["application/problem+json"]
export type getStudentPeriodPlanInput = OperationInput<operations["getStudentPeriodPlan"]['parameters']['path'], operations["getStudentPeriodPlan"]['parameters']['query'], operations["getStudentPeriodPlan"]['parameters']['header'], RequestBodyOf<operations["getStudentPeriodPlan"]>, false>
export type getStudentPeriodPlanOutput = operations["getStudentPeriodPlan"]['responses'][200]['content']["application/json"]
export type getStudentPeriodPlanProblem = operations["getStudentPeriodPlan"]['responses'][400]['content']["application/problem+json"] | operations["getStudentPeriodPlan"]['responses'][404]['content']["application/problem+json"] | operations["getStudentPeriodPlan"]['responses'][500]['content']["application/problem+json"]
export type getStudentPeriodPlanningsInput = OperationInput<operations["getStudentPeriodPlannings"]['parameters']['path'], operations["getStudentPeriodPlannings"]['parameters']['query'], operations["getStudentPeriodPlannings"]['parameters']['header'], RequestBodyOf<operations["getStudentPeriodPlannings"]>, false>
export type getStudentPeriodPlanningsOutput = operations["getStudentPeriodPlannings"]['responses'][200]['content']["application/json"]
export type getStudentPeriodPlanningsProblem = operations["getStudentPeriodPlannings"]['responses'][400]['content']["application/problem+json"] | operations["getStudentPeriodPlannings"]['responses'][404]['content']["application/problem+json"] | operations["getStudentPeriodPlannings"]['responses'][500]['content']["application/problem+json"]
export type getStudentsInput = OperationInput<operations["getStudents"]['parameters']['path'], operations["getStudents"]['parameters']['query'], operations["getStudents"]['parameters']['header'], RequestBodyOf<operations["getStudents"]>, false>
export type getStudentsOutput = operations["getStudents"]['responses'][200]['content']["application/json"]
export type getStudentsProblem = operations["getStudents"]['responses'][400]['content']["application/problem+json"] | operations["getStudents"]['responses'][404]['content']["application/problem+json"] | operations["getStudents"]['responses'][500]['content']["application/problem+json"]
export type getStudentSharedPeriodPlanningsInput = OperationInput<operations["getStudentSharedPeriodPlannings"]['parameters']['path'], operations["getStudentSharedPeriodPlannings"]['parameters']['query'], operations["getStudentSharedPeriodPlannings"]['parameters']['header'], RequestBodyOf<operations["getStudentSharedPeriodPlannings"]>, false>
export type getStudentSharedPeriodPlanningsOutput = operations["getStudentSharedPeriodPlannings"]['responses'][200]['content']["application/json"]
export type getStudentSharedPeriodPlanningsProblem = operations["getStudentSharedPeriodPlannings"]['responses'][400]['content']["application/problem+json"] | operations["getStudentSharedPeriodPlannings"]['responses'][404]['content']["application/problem+json"] | operations["getStudentSharedPeriodPlannings"]['responses'][500]['content']["application/problem+json"]
export type getTagsInput = OperationInput<operations["getTags"]['parameters']['path'], operations["getTags"]['parameters']['query'], operations["getTags"]['parameters']['header'], RequestBodyOf<operations["getTags"]>, false>
export type getTagsOutput = operations["getTags"]['responses'][200]['content']["application/json"]
export type getTagsProblem = operations["getTags"]['responses'][400]['content']["application/problem+json"] | operations["getTags"]['responses'][404]['content']["application/problem+json"] | operations["getTags"]['responses'][500]['content']["application/problem+json"]
export type listBotsInput = OperationInput<operations["listBots"]['parameters']['path'], operations["listBots"]['parameters']['query'], operations["listBots"]['parameters']['header'], RequestBodyOf<operations["listBots"]>, false>
export type listBotsOutput = operations["listBots"]['responses'][200]['content']["application/json"]
export type listBotsProblem = operations["listBots"]['responses'][400]['content']["application/problem+json"] | operations["listBots"]['responses'][500]['content']["application/problem+json"]
export type listCategoriesInput = OperationInput<operations["listCategories"]['parameters']['path'], operations["listCategories"]['parameters']['query'], operations["listCategories"]['parameters']['header'], RequestBodyOf<operations["listCategories"]>, false>
export type listCategoriesOutput = operations["listCategories"]['responses'][200]['content']["application/json"]
export type listCategoriesProblem = operations["listCategories"]['responses'][400]['content']["application/problem+json"] | operations["listCategories"]['responses'][500]['content']["application/problem+json"]
export type listCoursesTagsInput = OperationInput<operations["listCoursesTags"]['parameters']['path'], operations["listCoursesTags"]['parameters']['query'], operations["listCoursesTags"]['parameters']['header'], RequestBodyOf<operations["listCoursesTags"]>, false>
export type listCoursesTagsOutput = operations["listCoursesTags"]['responses'][200]['content']["application/json"]
export type listCoursesTagsProblem = operations["listCoursesTags"]['responses'][400]['content']["application/problem+json"] | operations["listCoursesTags"]['responses'][404]['content']["application/problem+json"] | operations["listCoursesTags"]['responses'][500]['content']["application/problem+json"]
export type listMeInput = OperationInput<operations["listMe"]['parameters']['path'], operations["listMe"]['parameters']['query'], operations["listMe"]['parameters']['header'], RequestBodyOf<operations["listMe"]>, false>
export type listMeOutput = operations["listMe"]['responses'][200]['content']["application/json"]
export type listMeProblem = operations["listMe"]['responses'][400]['content']["application/problem+json"] | operations["listMe"]['responses'][500]['content']["application/problem+json"]
export type listMeBotGrantsInput = OperationInput<operations["listMeBotGrants"]['parameters']['path'], operations["listMeBotGrants"]['parameters']['query'], operations["listMeBotGrants"]['parameters']['header'], RequestBodyOf<operations["listMeBotGrants"]>, false>
export type listMeBotGrantsOutput = operations["listMeBotGrants"]['responses'][200]['content']["application/json"]
export type listMeBotGrantsProblem = operations["listMeBotGrants"]['responses'][400]['content']["application/problem+json"] | operations["listMeBotGrants"]['responses'][500]['content']["application/problem+json"]
export type listSharedPeriodPlanningsInput = OperationInput<operations["listSharedPeriodPlannings"]['parameters']['path'], operations["listSharedPeriodPlannings"]['parameters']['query'], operations["listSharedPeriodPlannings"]['parameters']['header'], RequestBodyOf<operations["listSharedPeriodPlannings"]>, false>
export type listSharedPeriodPlanningsOutput = operations["listSharedPeriodPlannings"]['responses'][200]['content']["application/json"]
export type listSharedPeriodPlanningsProblem = operations["listSharedPeriodPlannings"]['responses'][400]['content']["application/problem+json"] | operations["listSharedPeriodPlannings"]['responses'][500]['content']["application/problem+json"]
export type listStudentAbsencesInput = OperationInput<operations["listStudentAbsences"]['parameters']['path'], operations["listStudentAbsences"]['parameters']['query'], operations["listStudentAbsences"]['parameters']['header'], RequestBodyOf<operations["listStudentAbsences"]>, false>
export type listStudentAbsencesOutput = operations["listStudentAbsences"]['responses'][200]['content']["application/json"]
export type listStudentAbsencesProblem = operations["listStudentAbsences"]['responses'][400]['content']["application/problem+json"] | operations["listStudentAbsences"]['responses'][500]['content']["application/problem+json"]
export type listStudentClassesProfessorsEvaluationInput = OperationInput<operations["listStudentClassesProfessorsEvaluation"]['parameters']['path'], operations["listStudentClassesProfessorsEvaluation"]['parameters']['query'], operations["listStudentClassesProfessorsEvaluation"]['parameters']['header'], RequestBodyOf<operations["listStudentClassesProfessorsEvaluation"]>, false>
export type listStudentClassesProfessorsEvaluationOutput = operations["listStudentClassesProfessorsEvaluation"]['responses'][200]['content']["application/json"]
export type listStudentClassesProfessorsEvaluationProblem = operations["listStudentClassesProfessorsEvaluation"]['responses'][400]['content']["application/problem+json"] | operations["listStudentClassesProfessorsEvaluation"]['responses'][422]['content']["application/problem+json"] | operations["listStudentClassesProfessorsEvaluation"]['responses'][500]['content']["application/problem+json"]
export type listStudentCourseAttemptsInput = OperationInput<operations["listStudentCourseAttempts"]['parameters']['path'], operations["listStudentCourseAttempts"]['parameters']['query'], operations["listStudentCourseAttempts"]['parameters']['header'], RequestBodyOf<operations["listStudentCourseAttempts"]>, false>
export type listStudentCourseAttemptsOutput = operations["listStudentCourseAttempts"]['responses'][200]['content']["application/json"]
export type listStudentCourseAttemptsProblem = operations["listStudentCourseAttempts"]['responses'][400]['content']["application/problem+json"] | operations["listStudentCourseAttempts"]['responses'][500]['content']["application/problem+json"]
export type listStudentCurriculaInput = OperationInput<operations["listStudentCurricula"]['parameters']['path'], operations["listStudentCurricula"]['parameters']['query'], operations["listStudentCurricula"]['parameters']['header'], RequestBodyOf<operations["listStudentCurricula"]>, false>
export type listStudentCurriculaOutput = operations["listStudentCurricula"]['responses'][200]['content']["application/json"]
export type listStudentCurriculaProblem = operations["listStudentCurricula"]['responses'][400]['content']["application/problem+json"] | operations["listStudentCurricula"]['responses'][500]['content']["application/problem+json"]
export type listStudentExchangeNoticeSubscriptionInput = OperationInput<operations["listStudentExchangeNoticeSubscription"]['parameters']['path'], operations["listStudentExchangeNoticeSubscription"]['parameters']['query'], operations["listStudentExchangeNoticeSubscription"]['parameters']['header'], RequestBodyOf<operations["listStudentExchangeNoticeSubscription"]>, false>
export type listStudentExchangeNoticeSubscriptionOutput = operations["listStudentExchangeNoticeSubscription"]['responses'][200]['content']["application/json"]
export type listStudentExchangeNoticeSubscriptionProblem = operations["listStudentExchangeNoticeSubscription"]['responses'][400]['content']["application/problem+json"] | operations["listStudentExchangeNoticeSubscription"]['responses'][500]['content']["application/problem+json"]
export type listStudentFeedbackReportsInput = OperationInput<operations["listStudentFeedbackReports"]['parameters']['path'], operations["listStudentFeedbackReports"]['parameters']['query'], operations["listStudentFeedbackReports"]['parameters']['header'], RequestBodyOf<operations["listStudentFeedbackReports"]>, false>
export type listStudentFeedbackReportsOutput = operations["listStudentFeedbackReports"]['responses'][200]['content']["application/json"]
export type listStudentFeedbackReportsProblem = operations["listStudentFeedbackReports"]['responses'][400]['content']["application/problem+json"] | operations["listStudentFeedbackReports"]['responses'][500]['content']["application/problem+json"]
export type listStudentFriendshipsInput = OperationInput<operations["listStudentFriendships"]['parameters']['path'], operations["listStudentFriendships"]['parameters']['query'], operations["listStudentFriendships"]['parameters']['header'], RequestBodyOf<operations["listStudentFriendships"]>, false>
export type listStudentFriendshipsOutput = operations["listStudentFriendships"]['responses'][200]['content']["application/json"]
export type listStudentFriendshipsProblem = operations["listStudentFriendships"]['responses'][400]['content']["application/problem+json"] | operations["listStudentFriendships"]['responses'][500]['content']["application/problem+json"]
export type listStudentPeopleInput = OperationInput<operations["listStudentPeople"]['parameters']['path'], operations["listStudentPeople"]['parameters']['query'], operations["listStudentPeople"]['parameters']['header'], RequestBodyOf<operations["listStudentPeople"]>, false>
export type listStudentPeopleOutput = operations["listStudentPeople"]['responses'][200]['content']["application/json"]
export type listStudentPeopleProblem = operations["listStudentPeople"]['responses'][400]['content']["application/problem+json"] | operations["listStudentPeople"]['responses'][500]['content']["application/problem+json"]
export type listStudentPeriodPlanInput = OperationInput<operations["listStudentPeriodPlan"]['parameters']['path'], operations["listStudentPeriodPlan"]['parameters']['query'], operations["listStudentPeriodPlan"]['parameters']['header'], RequestBodyOf<operations["listStudentPeriodPlan"]>, false>
export type listStudentPeriodPlanOutput = operations["listStudentPeriodPlan"]['responses'][200]['content']["application/json"]
export type listStudentPeriodPlanProblem = operations["listStudentPeriodPlan"]['responses'][400]['content']["application/problem+json"] | operations["listStudentPeriodPlan"]['responses'][500]['content']["application/problem+json"]
export type listStudentPeriodPlanningsInput = OperationInput<operations["listStudentPeriodPlannings"]['parameters']['path'], operations["listStudentPeriodPlannings"]['parameters']['query'], operations["listStudentPeriodPlannings"]['parameters']['header'], RequestBodyOf<operations["listStudentPeriodPlannings"]>, false>
export type listStudentPeriodPlanningsOutput = operations["listStudentPeriodPlannings"]['responses'][200]['content']["application/json"]
export type listStudentPeriodPlanningsProblem = operations["listStudentPeriodPlannings"]['responses'][400]['content']["application/problem+json"] | operations["listStudentPeriodPlannings"]['responses'][500]['content']["application/problem+json"]
export type listStudentProfessorEvaluationsPendingInput = OperationInput<operations["listStudentProfessorEvaluationsPending"]['parameters']['path'], operations["listStudentProfessorEvaluationsPending"]['parameters']['query'], operations["listStudentProfessorEvaluationsPending"]['parameters']['header'], RequestBodyOf<operations["listStudentProfessorEvaluationsPending"]>, false>
export type listStudentProfessorEvaluationsPendingOutput = operations["listStudentProfessorEvaluationsPending"]['responses'][200]['content']["application/json"]
export type listStudentProfessorEvaluationsPendingProblem = operations["listStudentProfessorEvaluationsPending"]['responses'][400]['content']["application/problem+json"] | operations["listStudentProfessorEvaluationsPending"]['responses'][500]['content']["application/problem+json"]
export type listStudentPublicProfileInput = OperationInput<operations["listStudentPublicProfile"]['parameters']['path'], operations["listStudentPublicProfile"]['parameters']['query'], operations["listStudentPublicProfile"]['parameters']['header'], RequestBodyOf<operations["listStudentPublicProfile"]>, false>
export type listStudentPublicProfileOutput = operations["listStudentPublicProfile"]['responses'][200]['content']["application/json"]
export type listStudentPublicProfileProblem = operations["listStudentPublicProfile"]['responses'][400]['content']["application/problem+json"] | operations["listStudentPublicProfile"]['responses'][404]['content']["application/problem+json"] | operations["listStudentPublicProfile"]['responses'][500]['content']["application/problem+json"]
export type listStudentSharedPeriodPlanningsInput = OperationInput<operations["listStudentSharedPeriodPlannings"]['parameters']['path'], operations["listStudentSharedPeriodPlannings"]['parameters']['query'], operations["listStudentSharedPeriodPlannings"]['parameters']['header'], RequestBodyOf<operations["listStudentSharedPeriodPlannings"]>, false>
export type listStudentSharedPeriodPlanningsOutput = operations["listStudentSharedPeriodPlannings"]['responses'][200]['content']["application/json"]
export type listStudentSharedPeriodPlanningsProblem = operations["listStudentSharedPeriodPlannings"]['responses'][400]['content']["application/problem+json"] | operations["listStudentSharedPeriodPlannings"]['responses'][500]['content']["application/problem+json"]
export type listStudentTagInterestsInput = OperationInput<operations["listStudentTagInterests"]['parameters']['path'], operations["listStudentTagInterests"]['parameters']['query'], operations["listStudentTagInterests"]['parameters']['header'], RequestBodyOf<operations["listStudentTagInterests"]>, false>
export type listStudentTagInterestsOutput = operations["listStudentTagInterests"]['responses'][200]['content']["application/json"]
export type listStudentTagInterestsProblem = operations["listStudentTagInterests"]['responses'][400]['content']["application/problem+json"] | operations["listStudentTagInterests"]['responses'][500]['content']["application/problem+json"]
export type listTagsInput = OperationInput<operations["listTags"]['parameters']['path'], operations["listTags"]['parameters']['query'], operations["listTags"]['parameters']['header'], RequestBodyOf<operations["listTags"]>, false>
export type listTagsOutput = operations["listTags"]['responses'][200]['content']["application/json"]
export type listTagsProblem = operations["listTags"]['responses'][400]['content']["application/problem+json"] | operations["listTags"]['responses'][500]['content']["application/problem+json"]
export type listTagsCoursesInput = OperationInput<operations["listTagsCourses"]['parameters']['path'], operations["listTagsCourses"]['parameters']['query'], operations["listTagsCourses"]['parameters']['header'], RequestBodyOf<operations["listTagsCourses"]>, false>
export type listTagsCoursesOutput = operations["listTagsCourses"]['responses'][200]['content']["application/json"]
export type listTagsCoursesProblem = operations["listTagsCourses"]['responses'][400]['content']["application/problem+json"] | operations["listTagsCourses"]['responses'][404]['content']["application/problem+json"] | operations["listTagsCourses"]['responses'][500]['content']["application/problem+json"]
export type updateCategoriesInput = OperationInput<operations["updateCategories"]['parameters']['path'], operations["updateCategories"]['parameters']['query'], operations["updateCategories"]['parameters']['header'], RequestBodyOf<operations["updateCategories"]>, true>
export type updateCategoriesOutput = operations["updateCategories"]['responses'][200]['content']["application/json"]
export type updateCategoriesProblem = operations["updateCategories"]['responses'][400]['content']["application/problem+json"] | operations["updateCategories"]['responses'][404]['content']["application/problem+json"] | operations["updateCategories"]['responses'][409]['content']["application/problem+json"] | operations["updateCategories"]['responses'][500]['content']["application/problem+json"]
export type updateCoursesTagsInput = OperationInput<operations["updateCoursesTags"]['parameters']['path'], operations["updateCoursesTags"]['parameters']['query'], operations["updateCoursesTags"]['parameters']['header'], RequestBodyOf<operations["updateCoursesTags"]>, false>
export type updateCoursesTagsOutput = void
export type updateCoursesTagsProblem = operations["updateCoursesTags"]['responses'][400]['content']["application/problem+json"] | operations["updateCoursesTags"]['responses'][422]['content']["application/problem+json"] | operations["updateCoursesTags"]['responses'][500]['content']["application/problem+json"]
export type updateMeBotGrantsInput = OperationInput<operations["updateMeBotGrants"]['parameters']['path'], operations["updateMeBotGrants"]['parameters']['query'], operations["updateMeBotGrants"]['parameters']['header'], RequestBodyOf<operations["updateMeBotGrants"]>, true>
export type updateMeBotGrantsOutput = void
export type updateMeBotGrantsProblem = operations["updateMeBotGrants"]['responses'][400]['content']["application/problem+json"] | operations["updateMeBotGrants"]['responses'][404]['content']["application/problem+json"] | operations["updateMeBotGrants"]['responses'][500]['content']["application/problem+json"]
export type updateStudentClassesProfessorsEvaluationInput = OperationInput<operations["updateStudentClassesProfessorsEvaluation"]['parameters']['path'], operations["updateStudentClassesProfessorsEvaluation"]['parameters']['query'], operations["updateStudentClassesProfessorsEvaluation"]['parameters']['header'], RequestBodyOf<operations["updateStudentClassesProfessorsEvaluation"]>, true>
export type updateStudentClassesProfessorsEvaluationOutput = operations["updateStudentClassesProfessorsEvaluation"]['responses'][200]['content']["application/json"]
export type updateStudentClassesProfessorsEvaluationProblem = operations["updateStudentClassesProfessorsEvaluation"]['responses'][400]['content']["application/problem+json"] | operations["updateStudentClassesProfessorsEvaluation"]['responses'][422]['content']["application/problem+json"] | operations["updateStudentClassesProfessorsEvaluation"]['responses'][500]['content']["application/problem+json"]
export type updateStudentCourseAttemptsInput = OperationInput<operations["updateStudentCourseAttempts"]['parameters']['path'], operations["updateStudentCourseAttempts"]['parameters']['query'], operations["updateStudentCourseAttempts"]['parameters']['header'], RequestBodyOf<operations["updateStudentCourseAttempts"]>, true>
export type updateStudentCourseAttemptsOutput = operations["updateStudentCourseAttempts"]['responses'][200]['content']["application/json"]
export type updateStudentCourseAttemptsProblem = operations["updateStudentCourseAttempts"]['responses'][400]['content']["application/problem+json"] | operations["updateStudentCourseAttempts"]['responses'][404]['content']["application/problem+json"] | operations["updateStudentCourseAttempts"]['responses'][409]['content']["application/problem+json"] | operations["updateStudentCourseAttempts"]['responses'][422]['content']["application/problem+json"] | operations["updateStudentCourseAttempts"]['responses'][500]['content']["application/problem+json"]
export type updateStudentCurriculaInput = OperationInput<operations["updateStudentCurricula"]['parameters']['path'], operations["updateStudentCurricula"]['parameters']['query'], operations["updateStudentCurricula"]['parameters']['header'], RequestBodyOf<operations["updateStudentCurricula"]>, true>
export type updateStudentCurriculaOutput = operations["updateStudentCurricula"]['responses'][200]['content']["application/json"]
export type updateStudentCurriculaProblem = operations["updateStudentCurricula"]['responses'][400]['content']["application/problem+json"] | operations["updateStudentCurricula"]['responses'][404]['content']["application/problem+json"] | operations["updateStudentCurricula"]['responses'][422]['content']["application/problem+json"] | operations["updateStudentCurricula"]['responses'][500]['content']["application/problem+json"]
export type updateStudentExchangeNoticeSubscriptionInput = OperationInput<operations["updateStudentExchangeNoticeSubscription"]['parameters']['path'], operations["updateStudentExchangeNoticeSubscription"]['parameters']['query'], operations["updateStudentExchangeNoticeSubscription"]['parameters']['header'], RequestBodyOf<operations["updateStudentExchangeNoticeSubscription"]>, true>
export type updateStudentExchangeNoticeSubscriptionOutput = operations["updateStudentExchangeNoticeSubscription"]['responses'][200]['content']["application/json"]
export type updateStudentExchangeNoticeSubscriptionProblem = operations["updateStudentExchangeNoticeSubscription"]['responses'][400]['content']["application/problem+json"] | operations["updateStudentExchangeNoticeSubscription"]['responses'][422]['content']["application/problem+json"] | operations["updateStudentExchangeNoticeSubscription"]['responses'][500]['content']["application/problem+json"]
export type updateStudentPeriodPlanInput = OperationInput<operations["updateStudentPeriodPlan"]['parameters']['path'], operations["updateStudentPeriodPlan"]['parameters']['query'], operations["updateStudentPeriodPlan"]['parameters']['header'], RequestBodyOf<operations["updateStudentPeriodPlan"]>, true>
export type updateStudentPeriodPlanOutput = operations["updateStudentPeriodPlan"]['responses'][200]['content']["application/json"]
export type updateStudentPeriodPlanProblem = operations["updateStudentPeriodPlan"]['responses'][400]['content']["application/problem+json"] | operations["updateStudentPeriodPlan"]['responses'][404]['content']["application/problem+json"] | operations["updateStudentPeriodPlan"]['responses'][422]['content']["application/problem+json"] | operations["updateStudentPeriodPlan"]['responses'][500]['content']["application/problem+json"]
export type updateStudentPeriodPlanningsInput = OperationInput<operations["updateStudentPeriodPlannings"]['parameters']['path'], operations["updateStudentPeriodPlannings"]['parameters']['query'], operations["updateStudentPeriodPlannings"]['parameters']['header'], RequestBodyOf<operations["updateStudentPeriodPlannings"]>, true>
export type updateStudentPeriodPlanningsOutput = operations["updateStudentPeriodPlannings"]['responses'][200]['content']["application/json"]
export type updateStudentPeriodPlanningsProblem = operations["updateStudentPeriodPlannings"]['responses'][400]['content']["application/problem+json"] | operations["updateStudentPeriodPlannings"]['responses'][404]['content']["application/problem+json"] | operations["updateStudentPeriodPlannings"]['responses'][422]['content']["application/problem+json"] | operations["updateStudentPeriodPlannings"]['responses'][500]['content']["application/problem+json"]
export type updateStudentPublicProfileInput = OperationInput<operations["updateStudentPublicProfile"]['parameters']['path'], operations["updateStudentPublicProfile"]['parameters']['query'], operations["updateStudentPublicProfile"]['parameters']['header'], RequestBodyOf<operations["updateStudentPublicProfile"]>, true>
export type updateStudentPublicProfileOutput = operations["updateStudentPublicProfile"]['responses'][200]['content']["application/json"]
export type updateStudentPublicProfileProblem = operations["updateStudentPublicProfile"]['responses'][400]['content']["application/problem+json"] | operations["updateStudentPublicProfile"]['responses'][404]['content']["application/problem+json"] | operations["updateStudentPublicProfile"]['responses'][500]['content']["application/problem+json"]
export type updateStudentsInput = OperationInput<operations["updateStudents"]['parameters']['path'], operations["updateStudents"]['parameters']['query'], operations["updateStudents"]['parameters']['header'], RequestBodyOf<operations["updateStudents"]>, true>
export type updateStudentsOutput = operations["updateStudents"]['responses'][200]['content']["application/json"]
export type updateStudentsProblem = operations["updateStudents"]['responses'][400]['content']["application/problem+json"] | operations["updateStudents"]['responses'][404]['content']["application/problem+json"] | operations["updateStudents"]['responses'][422]['content']["application/problem+json"] | operations["updateStudents"]['responses'][500]['content']["application/problem+json"]
export type updateStudentTagInterestsInput = OperationInput<operations["updateStudentTagInterests"]['parameters']['path'], operations["updateStudentTagInterests"]['parameters']['query'], operations["updateStudentTagInterests"]['parameters']['header'], RequestBodyOf<operations["updateStudentTagInterests"]>, false>
export type updateStudentTagInterestsOutput = void
export type updateStudentTagInterestsProblem = operations["updateStudentTagInterests"]['responses'][400]['content']["application/problem+json"] | operations["updateStudentTagInterests"]['responses'][422]['content']["application/problem+json"] | operations["updateStudentTagInterests"]['responses'][500]['content']["application/problem+json"]
export type updateTagsInput = OperationInput<operations["updateTags"]['parameters']['path'], operations["updateTags"]['parameters']['query'], operations["updateTags"]['parameters']['header'], RequestBodyOf<operations["updateTags"]>, true>
export type updateTagsOutput = operations["updateTags"]['responses'][200]['content']["application/json"]
export type updateTagsProblem = operations["updateTags"]['responses'][400]['content']["application/problem+json"] | operations["updateTags"]['responses'][404]['content']["application/problem+json"] | operations["updateTags"]['responses'][409]['content']["application/problem+json"] | operations["updateTags"]['responses'][422]['content']["application/problem+json"] | operations["updateTags"]['responses'][500]['content']["application/problem+json"]

export interface OperationInputs {
    createCategories: createCategoriesInput
    createExchangeNoticeSubscriptionsUnsubscribe: createExchangeNoticeSubscriptionsUnsubscribeInput
    createFeedbackReports: createFeedbackReportsInput
    createStudentAbsences: createStudentAbsencesInput
    createStudentCourseAttempts: createStudentCourseAttemptsInput
    createStudentCourseHistory: createStudentCourseHistoryInput
    createStudentCurricula: createStudentCurriculaInput
    createStudentFeedbackReports: createStudentFeedbackReportsInput
    createStudentFriendships: createStudentFriendshipsInput
    createStudentFriendshipsAccept: createStudentFriendshipsAcceptInput
    createStudentPeriodPlan: createStudentPeriodPlanInput
    createStudentPeriodPlannings: createStudentPeriodPlanningsInput
    createStudents: createStudentsInput
    createTags: createTagsInput
    deleteCategories: deleteCategoriesInput
    deleteCoursesTags: deleteCoursesTagsInput
    deleteStudentAbsences: deleteStudentAbsencesInput
    deleteStudentCourseAttempts: deleteStudentCourseAttemptsInput
    deleteStudentCurricula: deleteStudentCurriculaInput
    deleteStudentFriendships: deleteStudentFriendshipsInput
    deleteStudentPeriodPlan: deleteStudentPeriodPlanInput
    deleteStudentPeriodPlannings: deleteStudentPeriodPlanningsInput
    deleteStudents: deleteStudentsInput
    deleteStudentTagInterests: deleteStudentTagInterestsInput
    deleteTags: deleteTagsInput
    getCategories: getCategoriesInput
    getSharedPeriodPlannings: getSharedPeriodPlanningsInput
    getStudentCourseAttempts: getStudentCourseAttemptsInput
    getStudentCurricula: getStudentCurriculaInput
    getStudentPeople: getStudentPeopleInput
    getStudentPeriodPlan: getStudentPeriodPlanInput
    getStudentPeriodPlannings: getStudentPeriodPlanningsInput
    getStudents: getStudentsInput
    getStudentSharedPeriodPlannings: getStudentSharedPeriodPlanningsInput
    getTags: getTagsInput
    listBots: listBotsInput
    listCategories: listCategoriesInput
    listCoursesTags: listCoursesTagsInput
    listMe: listMeInput
    listMeBotGrants: listMeBotGrantsInput
    listSharedPeriodPlannings: listSharedPeriodPlanningsInput
    listStudentAbsences: listStudentAbsencesInput
    listStudentClassesProfessorsEvaluation: listStudentClassesProfessorsEvaluationInput
    listStudentCourseAttempts: listStudentCourseAttemptsInput
    listStudentCurricula: listStudentCurriculaInput
    listStudentExchangeNoticeSubscription: listStudentExchangeNoticeSubscriptionInput
    listStudentFeedbackReports: listStudentFeedbackReportsInput
    listStudentFriendships: listStudentFriendshipsInput
    listStudentPeople: listStudentPeopleInput
    listStudentPeriodPlan: listStudentPeriodPlanInput
    listStudentPeriodPlannings: listStudentPeriodPlanningsInput
    listStudentProfessorEvaluationsPending: listStudentProfessorEvaluationsPendingInput
    listStudentPublicProfile: listStudentPublicProfileInput
    listStudentSharedPeriodPlannings: listStudentSharedPeriodPlanningsInput
    listStudentTagInterests: listStudentTagInterestsInput
    listTags: listTagsInput
    listTagsCourses: listTagsCoursesInput
    updateCategories: updateCategoriesInput
    updateCoursesTags: updateCoursesTagsInput
    updateMeBotGrants: updateMeBotGrantsInput
    updateStudentClassesProfessorsEvaluation: updateStudentClassesProfessorsEvaluationInput
    updateStudentCourseAttempts: updateStudentCourseAttemptsInput
    updateStudentCurricula: updateStudentCurriculaInput
    updateStudentExchangeNoticeSubscription: updateStudentExchangeNoticeSubscriptionInput
    updateStudentPeriodPlan: updateStudentPeriodPlanInput
    updateStudentPeriodPlannings: updateStudentPeriodPlanningsInput
    updateStudentPublicProfile: updateStudentPublicProfileInput
    updateStudents: updateStudentsInput
    updateStudentTagInterests: updateStudentTagInterestsInput
    updateTags: updateTagsInput
}

export interface OperationOutputs {
    createCategories: createCategoriesOutput
    createExchangeNoticeSubscriptionsUnsubscribe: createExchangeNoticeSubscriptionsUnsubscribeOutput
    createFeedbackReports: createFeedbackReportsOutput
    createStudentAbsences: createStudentAbsencesOutput
    createStudentCourseAttempts: createStudentCourseAttemptsOutput
    createStudentCourseHistory: createStudentCourseHistoryOutput
    createStudentCurricula: createStudentCurriculaOutput
    createStudentFeedbackReports: createStudentFeedbackReportsOutput
    createStudentFriendships: createStudentFriendshipsOutput
    createStudentFriendshipsAccept: createStudentFriendshipsAcceptOutput
    createStudentPeriodPlan: createStudentPeriodPlanOutput
    createStudentPeriodPlannings: createStudentPeriodPlanningsOutput
    createStudents: createStudentsOutput
    createTags: createTagsOutput
    deleteCategories: deleteCategoriesOutput
    deleteCoursesTags: deleteCoursesTagsOutput
    deleteStudentAbsences: deleteStudentAbsencesOutput
    deleteStudentCourseAttempts: deleteStudentCourseAttemptsOutput
    deleteStudentCurricula: deleteStudentCurriculaOutput
    deleteStudentFriendships: deleteStudentFriendshipsOutput
    deleteStudentPeriodPlan: deleteStudentPeriodPlanOutput
    deleteStudentPeriodPlannings: deleteStudentPeriodPlanningsOutput
    deleteStudents: deleteStudentsOutput
    deleteStudentTagInterests: deleteStudentTagInterestsOutput
    deleteTags: deleteTagsOutput
    getCategories: getCategoriesOutput
    getSharedPeriodPlannings: getSharedPeriodPlanningsOutput
    getStudentCourseAttempts: getStudentCourseAttemptsOutput
    getStudentCurricula: getStudentCurriculaOutput
    getStudentPeople: getStudentPeopleOutput
    getStudentPeriodPlan: getStudentPeriodPlanOutput
    getStudentPeriodPlannings: getStudentPeriodPlanningsOutput
    getStudents: getStudentsOutput
    getStudentSharedPeriodPlannings: getStudentSharedPeriodPlanningsOutput
    getTags: getTagsOutput
    listBots: listBotsOutput
    listCategories: listCategoriesOutput
    listCoursesTags: listCoursesTagsOutput
    listMe: listMeOutput
    listMeBotGrants: listMeBotGrantsOutput
    listSharedPeriodPlannings: listSharedPeriodPlanningsOutput
    listStudentAbsences: listStudentAbsencesOutput
    listStudentClassesProfessorsEvaluation: listStudentClassesProfessorsEvaluationOutput
    listStudentCourseAttempts: listStudentCourseAttemptsOutput
    listStudentCurricula: listStudentCurriculaOutput
    listStudentExchangeNoticeSubscription: listStudentExchangeNoticeSubscriptionOutput
    listStudentFeedbackReports: listStudentFeedbackReportsOutput
    listStudentFriendships: listStudentFriendshipsOutput
    listStudentPeople: listStudentPeopleOutput
    listStudentPeriodPlan: listStudentPeriodPlanOutput
    listStudentPeriodPlannings: listStudentPeriodPlanningsOutput
    listStudentProfessorEvaluationsPending: listStudentProfessorEvaluationsPendingOutput
    listStudentPublicProfile: listStudentPublicProfileOutput
    listStudentSharedPeriodPlannings: listStudentSharedPeriodPlanningsOutput
    listStudentTagInterests: listStudentTagInterestsOutput
    listTags: listTagsOutput
    listTagsCourses: listTagsCoursesOutput
    updateCategories: updateCategoriesOutput
    updateCoursesTags: updateCoursesTagsOutput
    updateMeBotGrants: updateMeBotGrantsOutput
    updateStudentClassesProfessorsEvaluation: updateStudentClassesProfessorsEvaluationOutput
    updateStudentCourseAttempts: updateStudentCourseAttemptsOutput
    updateStudentCurricula: updateStudentCurriculaOutput
    updateStudentExchangeNoticeSubscription: updateStudentExchangeNoticeSubscriptionOutput
    updateStudentPeriodPlan: updateStudentPeriodPlanOutput
    updateStudentPeriodPlannings: updateStudentPeriodPlanningsOutput
    updateStudentPublicProfile: updateStudentPublicProfileOutput
    updateStudents: updateStudentsOutput
    updateStudentTagInterests: updateStudentTagInterestsOutput
    updateTags: updateTagsOutput
}

export interface OperationProblems {
    createCategories: createCategoriesProblem
    createExchangeNoticeSubscriptionsUnsubscribe: createExchangeNoticeSubscriptionsUnsubscribeProblem
    createFeedbackReports: createFeedbackReportsProblem
    createStudentAbsences: createStudentAbsencesProblem
    createStudentCourseAttempts: createStudentCourseAttemptsProblem
    createStudentCourseHistory: createStudentCourseHistoryProblem
    createStudentCurricula: createStudentCurriculaProblem
    createStudentFeedbackReports: createStudentFeedbackReportsProblem
    createStudentFriendships: createStudentFriendshipsProblem
    createStudentFriendshipsAccept: createStudentFriendshipsAcceptProblem
    createStudentPeriodPlan: createStudentPeriodPlanProblem
    createStudentPeriodPlannings: createStudentPeriodPlanningsProblem
    createStudents: createStudentsProblem
    createTags: createTagsProblem
    deleteCategories: deleteCategoriesProblem
    deleteCoursesTags: deleteCoursesTagsProblem
    deleteStudentAbsences: deleteStudentAbsencesProblem
    deleteStudentCourseAttempts: deleteStudentCourseAttemptsProblem
    deleteStudentCurricula: deleteStudentCurriculaProblem
    deleteStudentFriendships: deleteStudentFriendshipsProblem
    deleteStudentPeriodPlan: deleteStudentPeriodPlanProblem
    deleteStudentPeriodPlannings: deleteStudentPeriodPlanningsProblem
    deleteStudents: deleteStudentsProblem
    deleteStudentTagInterests: deleteStudentTagInterestsProblem
    deleteTags: deleteTagsProblem
    getCategories: getCategoriesProblem
    getSharedPeriodPlannings: getSharedPeriodPlanningsProblem
    getStudentCourseAttempts: getStudentCourseAttemptsProblem
    getStudentCurricula: getStudentCurriculaProblem
    getStudentPeople: getStudentPeopleProblem
    getStudentPeriodPlan: getStudentPeriodPlanProblem
    getStudentPeriodPlannings: getStudentPeriodPlanningsProblem
    getStudents: getStudentsProblem
    getStudentSharedPeriodPlannings: getStudentSharedPeriodPlanningsProblem
    getTags: getTagsProblem
    listBots: listBotsProblem
    listCategories: listCategoriesProblem
    listCoursesTags: listCoursesTagsProblem
    listMe: listMeProblem
    listMeBotGrants: listMeBotGrantsProblem
    listSharedPeriodPlannings: listSharedPeriodPlanningsProblem
    listStudentAbsences: listStudentAbsencesProblem
    listStudentClassesProfessorsEvaluation: listStudentClassesProfessorsEvaluationProblem
    listStudentCourseAttempts: listStudentCourseAttemptsProblem
    listStudentCurricula: listStudentCurriculaProblem
    listStudentExchangeNoticeSubscription: listStudentExchangeNoticeSubscriptionProblem
    listStudentFeedbackReports: listStudentFeedbackReportsProblem
    listStudentFriendships: listStudentFriendshipsProblem
    listStudentPeople: listStudentPeopleProblem
    listStudentPeriodPlan: listStudentPeriodPlanProblem
    listStudentPeriodPlannings: listStudentPeriodPlanningsProblem
    listStudentProfessorEvaluationsPending: listStudentProfessorEvaluationsPendingProblem
    listStudentPublicProfile: listStudentPublicProfileProblem
    listStudentSharedPeriodPlannings: listStudentSharedPeriodPlanningsProblem
    listStudentTagInterests: listStudentTagInterestsProblem
    listTags: listTagsProblem
    listTagsCourses: listTagsCoursesProblem
    updateCategories: updateCategoriesProblem
    updateCoursesTags: updateCoursesTagsProblem
    updateMeBotGrants: updateMeBotGrantsProblem
    updateStudentClassesProfessorsEvaluation: updateStudentClassesProfessorsEvaluationProblem
    updateStudentCourseAttempts: updateStudentCourseAttemptsProblem
    updateStudentCurricula: updateStudentCurriculaProblem
    updateStudentExchangeNoticeSubscription: updateStudentExchangeNoticeSubscriptionProblem
    updateStudentPeriodPlan: updateStudentPeriodPlanProblem
    updateStudentPeriodPlannings: updateStudentPeriodPlanningsProblem
    updateStudentPublicProfile: updateStudentPublicProfileProblem
    updateStudents: updateStudentsProblem
    updateStudentTagInterests: updateStudentTagInterestsProblem
    updateTags: updateTagsProblem
}

export const operationDefinitions = {
    "createCategories": {
        "operationId": "createCategories",
        "target": "app",
        "method": "POST",
        "path": "/categories",
        "authentication": "required",
        "tags": [
            "categories"
        ],
        "summary": "Create Categories",
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
        }
    },
    "createExchangeNoticeSubscriptionsUnsubscribe": {
        "operationId": "createExchangeNoticeSubscriptionsUnsubscribe",
        "target": "app",
        "method": "POST",
        "path": "/exchange-notice-subscriptions/unsubscribe",
        "authentication": "public",
        "tags": [
            "exchange-notice-subscriptions"
        ],
        "summary": "Create ExchangeNoticeSubscriptionsUnsubscribe",
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
        }
    },
    "createFeedbackReports": {
        "operationId": "createFeedbackReports",
        "target": "app",
        "method": "POST",
        "path": "/feedback-reports",
        "authentication": "public",
        "tags": [
            "feedback-reports"
        ],
        "summary": "Create FeedbackReports",
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
        }
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
        }
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
                "type": "object",
                "properties": {
                    "courseId": {
                        "type": "integer"
                    },
                    "studyPeriodId": {
                        "type": "integer",
                        "nullable": true
                    },
                    "classId": {
                        "type": "integer",
                        "nullable": true
                    },
                    "evaluationMode": {
                        "type": "string",
                        "enum": [
                            "GRADE_AND_ATTENDANCE",
                            "ATTENDANCE",
                            "CONCEPT"
                        ]
                    },
                    "status": {
                        "type": "string",
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
                        ]
                    },
                    "grade": {
                        "type": "number",
                        "nullable": true,
                        "minimum": 0,
                        "maximum": 10
                    }
                },
                "required": [
                    "courseId",
                    "status"
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
        }
    },
    "createStudentCourseHistory": {
        "operationId": "createStudentCourseHistory",
        "target": "app",
        "method": "POST",
        "path": "/student/{sid}/course-history",
        "authentication": "required",
        "tags": [
            "student-course-history"
        ],
        "summary": "Create StudentCourseHistory",
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
        }
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
                            "specializationId": {
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
        }
    },
    "createStudentFeedbackReports": {
        "operationId": "createStudentFeedbackReports",
        "target": "app",
        "method": "POST",
        "path": "/student/{sid}/feedback-reports",
        "authentication": "required",
        "tags": [
            "feedback-reports"
        ],
        "summary": "Create StudentFeedbackReports",
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
        }
    },
    "createStudentFriendships": {
        "operationId": "createStudentFriendships",
        "target": "app",
        "method": "POST",
        "path": "/student/{sid}/friendships",
        "authentication": "required",
        "tags": [
            "student-social"
        ],
        "summary": "Create StudentFriendships",
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
        }
    },
    "createStudentFriendshipsAccept": {
        "operationId": "createStudentFriendshipsAccept",
        "target": "app",
        "method": "POST",
        "path": "/student/{sid}/friendships/{id}/accept",
        "authentication": "required",
        "tags": [
            "student-social"
        ],
        "summary": "Create StudentFriendshipsAccept",
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
        }
    },
    "createStudentPeriodPlan": {
        "operationId": "createStudentPeriodPlan",
        "target": "app",
        "method": "POST",
        "path": "/student/{sid}/period-plan",
        "authentication": "required",
        "tags": [
            "period-plannings"
        ],
        "summary": "Create StudentPeriodPlan",
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
                    "studyPeriodId": {
                        "type": "integer"
                    },
                    "curriculumId": {
                        "type": "integer",
                        "nullable": true
                    },
                    "guide": {
                        "type": "object",
                        "properties": {
                            "mode": {
                                "type": "string",
                                "enum": [
                                    "CURRICULUM",
                                    "PROGRAM",
                                    "NONE"
                                ]
                            },
                            "curriculumSource": {
                                "type": "string",
                                "nullable": true,
                                "enum": [
                                    "SAVED",
                                    "SUGGESTION",
                                    null
                                ]
                            },
                            "curriculumId": {
                                "type": "integer",
                                "nullable": true
                            },
                            "suggestionId": {
                                "type": "integer",
                                "nullable": true
                            },
                            "suggestionCatalogProgramId": {
                                "type": "integer",
                                "nullable": true
                            },
                            "catalogProgramId": {
                                "type": "integer",
                                "nullable": true
                            },
                            "specializationId": {
                                "type": "integer",
                                "nullable": true
                            },
                            "languageId": {
                                "type": "integer",
                                "nullable": true
                            },
                            "manualCourseIds": {
                                "type": "array",
                                "items": {
                                    "type": "integer"
                                }
                            }
                        },
                        "required": [
                            "mode",
                            "curriculumSource",
                            "curriculumId",
                            "suggestionId",
                            "catalogProgramId",
                            "specializationId",
                            "languageId",
                            "manualCourseIds"
                        ],
                        "additionalProperties": false
                    },
                    "classes": {
                        "type": "array",
                        "items": {
                            "type": "integer"
                        }
                    }
                },
                "required": [
                    "studyPeriodId",
                    "classes"
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
        }
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
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "minLength": 1
                    },
                    "studyPeriodId": {
                        "type": "integer"
                    },
                    "curriculumId": {
                        "type": "integer",
                        "nullable": true
                    },
                    "guide": {
                        "type": "object",
                        "properties": {
                            "mode": {
                                "type": "string",
                                "enum": [
                                    "CURRICULUM",
                                    "PROGRAM",
                                    "NONE"
                                ]
                            },
                            "curriculumSource": {
                                "type": "string",
                                "nullable": true,
                                "enum": [
                                    "SAVED",
                                    "SUGGESTION",
                                    null
                                ]
                            },
                            "curriculumId": {
                                "type": "integer",
                                "nullable": true
                            },
                            "suggestionId": {
                                "type": "integer",
                                "nullable": true
                            },
                            "suggestionCatalogProgramId": {
                                "type": "integer",
                                "nullable": true
                            },
                            "catalogProgramId": {
                                "type": "integer",
                                "nullable": true
                            },
                            "specializationId": {
                                "type": "integer",
                                "nullable": true
                            },
                            "languageId": {
                                "type": "integer",
                                "nullable": true
                            },
                            "manualCourseIds": {
                                "type": "array",
                                "items": {
                                    "type": "integer"
                                }
                            }
                        },
                        "required": [
                            "mode",
                            "curriculumSource",
                            "curriculumId",
                            "suggestionId",
                            "catalogProgramId",
                            "specializationId",
                            "languageId",
                            "manualCourseIds"
                        ],
                        "additionalProperties": false
                    },
                    "classes": {
                        "type": "array",
                        "items": {
                            "type": "integer"
                        }
                    }
                },
                "required": [
                    "studyPeriodId",
                    "classes"
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
        }
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
        }
    },
    "createTags": {
        "operationId": "createTags",
        "target": "app",
        "method": "POST",
        "path": "/tags",
        "authentication": "required",
        "tags": [
            "tags"
        ],
        "summary": "Create Tags",
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
        }
    },
    "deleteCategories": {
        "operationId": "deleteCategories",
        "target": "app",
        "method": "DELETE",
        "path": "/categories/{id}",
        "authentication": "required",
        "tags": [
            "categories"
        ],
        "summary": "Delete Categories",
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
        }
    },
    "deleteCoursesTags": {
        "operationId": "deleteCoursesTags",
        "target": "app",
        "method": "DELETE",
        "path": "/courses/{courseId}/tags/{tagId}",
        "authentication": "required",
        "tags": [
            "course-tags"
        ],
        "summary": "Delete CoursesTags",
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
        }
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
        }
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
        }
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
        }
    },
    "deleteStudentFriendships": {
        "operationId": "deleteStudentFriendships",
        "target": "app",
        "method": "DELETE",
        "path": "/student/{sid}/friendships/{id}",
        "authentication": "required",
        "tags": [
            "student-social"
        ],
        "summary": "Delete StudentFriendships",
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
        }
    },
    "deleteStudentPeriodPlan": {
        "operationId": "deleteStudentPeriodPlan",
        "target": "app",
        "method": "DELETE",
        "path": "/student/{sid}/period-plan/{id}",
        "authentication": "required",
        "tags": [
            "period-plannings"
        ],
        "summary": "Delete StudentPeriodPlan",
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
        }
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
        }
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
        }
    },
    "deleteStudentTagInterests": {
        "operationId": "deleteStudentTagInterests",
        "target": "app",
        "method": "DELETE",
        "path": "/student/{sid}/tag-interests/{tagId}",
        "authentication": "required",
        "tags": [
            "student-tag-interests"
        ],
        "summary": "Delete StudentTagInterests",
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
        }
    },
    "deleteTags": {
        "operationId": "deleteTags",
        "target": "app",
        "method": "DELETE",
        "path": "/tags/{id}",
        "authentication": "required",
        "tags": [
            "tags"
        ],
        "summary": "Delete Tags",
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
        }
    },
    "getCategories": {
        "operationId": "getCategories",
        "target": "app",
        "method": "GET",
        "path": "/categories/{id}",
        "authentication": "public",
        "tags": [
            "categories"
        ],
        "summary": "Get Categories",
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
        }
    },
    "getSharedPeriodPlannings": {
        "operationId": "getSharedPeriodPlannings",
        "target": "app",
        "method": "GET",
        "path": "/shared-period-plannings/{shareId}",
        "authentication": "public",
        "tags": [
            "shared-period-plannings"
        ],
        "summary": "Get SharedPeriodPlannings",
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
        }
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
        }
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
        }
    },
    "getStudentPeople": {
        "operationId": "getStudentPeople",
        "target": "app",
        "method": "GET",
        "path": "/student/{sid}/people/{publicId}",
        "authentication": "required",
        "tags": [
            "student-social"
        ],
        "summary": "Get StudentPeople",
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
        }
    },
    "getStudentPeriodPlan": {
        "operationId": "getStudentPeriodPlan",
        "target": "app",
        "method": "GET",
        "path": "/student/{sid}/period-plan/{id}",
        "authentication": "required",
        "tags": [
            "period-plannings"
        ],
        "summary": "Get StudentPeriodPlan",
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
        }
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
        }
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
        }
    },
    "getStudentSharedPeriodPlannings": {
        "operationId": "getStudentSharedPeriodPlannings",
        "target": "app",
        "method": "GET",
        "path": "/student/{sid}/shared-period-plannings/{shareId}",
        "authentication": "required",
        "tags": [
            "shared-period-plannings"
        ],
        "summary": "Get StudentSharedPeriodPlannings",
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
        }
    },
    "getTags": {
        "operationId": "getTags",
        "target": "app",
        "method": "GET",
        "path": "/tags/{id}",
        "authentication": "public",
        "tags": [
            "tags"
        ],
        "summary": "Get Tags",
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
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/BotIdentityEntity"
                            }
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
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/Category"
                            }
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
        }
    },
    "listCoursesTags": {
        "operationId": "listCoursesTags",
        "target": "app",
        "method": "GET",
        "path": "/courses/{courseId}/tags",
        "authentication": "public",
        "tags": [
            "course-tags"
        ],
        "summary": "List CoursesTags",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "courseId"
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
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/Tag"
                            }
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
        }
    },
    "listMe": {
        "operationId": "listMe",
        "target": "app",
        "method": "GET",
        "path": "/me",
        "authentication": "required",
        "tags": [
            "current-user"
        ],
        "summary": "List Me",
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
        }
    },
    "listMeBotGrants": {
        "operationId": "listMeBotGrants",
        "target": "app",
        "method": "GET",
        "path": "/me/bot-grants",
        "authentication": "required",
        "tags": [
            "bot-grants"
        ],
        "summary": "List MeBotGrants",
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
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/BotGrantEntity"
                            }
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
        }
    },
    "listSharedPeriodPlannings": {
        "operationId": "listSharedPeriodPlannings",
        "target": "app",
        "method": "GET",
        "path": "/shared-period-plannings",
        "authentication": "public",
        "tags": [
            "shared-period-plannings"
        ],
        "summary": "List SharedPeriodPlannings",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "page",
            "pageSize",
            "query",
            "filter"
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
                                "items": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/SharedPeriodPlanning"
                                    }
                                },
                                "page": {
                                    "type": "integer"
                                },
                                "pageSize": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                }
                            },
                            "required": [
                                "items",
                                "page",
                                "pageSize",
                                "total"
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
                    "name": "page",
                    "required": false,
                    "description": null,
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "string",
                        "default": 1
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": null,
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "string",
                        "default": 20
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
            }
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
            "filter"
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
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/StudentAbsence"
                            }
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
            }
        }
    },
    "listStudentClassesProfessorsEvaluation": {
        "operationId": "listStudentClassesProfessorsEvaluation",
        "target": "app",
        "method": "GET",
        "path": "/student/{sid}/classes/{classId}/professors/{professorId}/evaluation",
        "authentication": "required",
        "tags": [
            "professor-evaluations"
        ],
        "summary": "List StudentClassesProfessorsEvaluation",
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
            "filter"
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
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/StudentCourseAttempt"
                            }
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
            }
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
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/CurriculumSummaryEntity"
                            }
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
        }
    },
    "listStudentExchangeNoticeSubscription": {
        "operationId": "listStudentExchangeNoticeSubscription",
        "target": "app",
        "method": "GET",
        "path": "/student/{sid}/exchange-notice-subscription",
        "authentication": "required",
        "tags": [
            "exchange-notice-subscriptions"
        ],
        "summary": "List StudentExchangeNoticeSubscription",
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
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/FeedbackReport"
                            }
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
            "filter"
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
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/StudentFriendship"
                            }
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
            }
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
            "query",
            "page",
            "pageSize"
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
                                "items": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/StudentPublicPerson"
                                    }
                                },
                                "page": {
                                    "type": "number"
                                },
                                "pageSize": {
                                    "type": "number"
                                },
                                "total": {
                                    "type": "number"
                                }
                            },
                            "required": [
                                "items",
                                "page",
                                "pageSize",
                                "total"
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
                    "name": "page",
                    "required": false,
                    "description": null,
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "string",
                        "default": 1
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": null,
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "string",
                        "default": 20
                    }
                }
            ],
            "filter": null
        }
    },
    "listStudentPeriodPlan": {
        "operationId": "listStudentPeriodPlan",
        "target": "app",
        "method": "GET",
        "path": "/student/{sid}/period-plan",
        "authentication": "required",
        "tags": [
            "period-plannings"
        ],
        "summary": "List StudentPeriodPlan",
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
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/PeriodPlanningEntity"
                            }
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
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/PeriodPlanningEntity"
                            }
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
        }
    },
    "listStudentProfessorEvaluationsPending": {
        "operationId": "listStudentProfessorEvaluationsPending",
        "target": "app",
        "method": "GET",
        "path": "/student/{sid}/professor-evaluations/pending",
        "authentication": "required",
        "tags": [
            "professor-evaluations"
        ],
        "summary": "List StudentProfessorEvaluationsPending",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "sid"
        ],
        "queryParameters": [
            "filter"
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
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/PendingProfessorEvaluation"
                            }
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
            }
        }
    },
    "listStudentPublicProfile": {
        "operationId": "listStudentPublicProfile",
        "target": "app",
        "method": "GET",
        "path": "/student/{sid}/public-profile",
        "authentication": "required",
        "tags": [
            "student-social"
        ],
        "summary": "List StudentPublicProfile",
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
            "filter"
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
                                "items": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/SharedPeriodPlanning"
                                    }
                                },
                                "page": {
                                    "type": "integer"
                                },
                                "pageSize": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                }
                            },
                            "required": [
                                "items",
                                "page",
                                "pageSize",
                                "total"
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
                    "name": "page",
                    "required": false,
                    "description": null,
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "string",
                        "default": 1
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": null,
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "string",
                        "default": 20
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
            }
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
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/StudentTagInterest"
                            }
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
            "filter"
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
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/Tag"
                            }
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
            }
        }
    },
    "listTagsCourses": {
        "operationId": "listTagsCourses",
        "target": "app",
        "method": "GET",
        "path": "/tags/{id}/courses",
        "authentication": "public",
        "tags": [
            "course-tags"
        ],
        "summary": "List TagsCourses",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [
            "page",
            "pageSize"
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
                                "_paths": {
                                    "type": "object",
                                    "properties": {
                                        "firstPage": {
                                            "type": "string"
                                        },
                                        "lastPage": {
                                            "type": "string"
                                        },
                                        "next": {
                                            "type": "string",
                                            "nullable": true
                                        },
                                        "prev": {
                                            "type": "string",
                                            "nullable": true
                                        }
                                    },
                                    "required": [
                                        "firstPage",
                                        "lastPage",
                                        "next",
                                        "prev"
                                    ]
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "_paths"
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
                    "description": null,
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": null,
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1
                    }
                }
            ],
            "filter": null
        }
    },
    "updateCategories": {
        "operationId": "updateCategories",
        "target": "app",
        "method": "PUT",
        "path": "/categories/{id}",
        "authentication": "required",
        "tags": [
            "categories"
        ],
        "summary": "Update Categories",
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
        }
    },
    "updateCoursesTags": {
        "operationId": "updateCoursesTags",
        "target": "app",
        "method": "PUT",
        "path": "/courses/{courseId}/tags/{tagId}",
        "authentication": "required",
        "tags": [
            "course-tags"
        ],
        "summary": "Update CoursesTags",
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
        }
    },
    "updateMeBotGrants": {
        "operationId": "updateMeBotGrants",
        "target": "app",
        "method": "PUT",
        "path": "/me/bot-grants/{botAuthUserId}",
        "authentication": "required",
        "tags": [
            "bot-grants"
        ],
        "summary": "Update MeBotGrants",
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
        }
    },
    "updateStudentClassesProfessorsEvaluation": {
        "operationId": "updateStudentClassesProfessorsEvaluation",
        "target": "app",
        "method": "PUT",
        "path": "/student/{sid}/classes/{classId}/professors/{professorId}/evaluation",
        "authentication": "required",
        "tags": [
            "professor-evaluations"
        ],
        "summary": "Update StudentClassesProfessorsEvaluation",
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
        }
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
                "type": "object",
                "properties": {
                    "studyPeriodId": {
                        "type": "integer",
                        "nullable": true
                    },
                    "classId": {
                        "type": "integer",
                        "nullable": true
                    },
                    "evaluationMode": {
                        "type": "string",
                        "enum": [
                            "GRADE_AND_ATTENDANCE",
                            "ATTENDANCE",
                            "CONCEPT"
                        ]
                    },
                    "status": {
                        "type": "string",
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
                        ]
                    },
                    "grade": {
                        "type": "number",
                        "nullable": true,
                        "minimum": 0,
                        "maximum": 10
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
        }
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
                            "specializationId": {
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
        }
    },
    "updateStudentExchangeNoticeSubscription": {
        "operationId": "updateStudentExchangeNoticeSubscription",
        "target": "app",
        "method": "PATCH",
        "path": "/student/{sid}/exchange-notice-subscription",
        "authentication": "required",
        "tags": [
            "exchange-notice-subscriptions"
        ],
        "summary": "Update StudentExchangeNoticeSubscription",
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
        }
    },
    "updateStudentPeriodPlan": {
        "operationId": "updateStudentPeriodPlan",
        "target": "app",
        "method": "PATCH",
        "path": "/student/{sid}/period-plan/{id}",
        "authentication": "required",
        "tags": [
            "period-plannings"
        ],
        "summary": "Update StudentPeriodPlan",
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
                    "visibility": {
                        "type": "string",
                        "enum": [
                            "PRIVATE",
                            "FRIENDS",
                            "PUBLIC"
                        ]
                    },
                    "curriculumId": {
                        "type": "integer",
                        "nullable": true
                    },
                    "guide": {
                        "type": "object",
                        "properties": {
                            "mode": {
                                "type": "string",
                                "enum": [
                                    "CURRICULUM",
                                    "PROGRAM",
                                    "NONE"
                                ]
                            },
                            "curriculumSource": {
                                "type": "string",
                                "nullable": true,
                                "enum": [
                                    "SAVED",
                                    "SUGGESTION",
                                    null
                                ]
                            },
                            "curriculumId": {
                                "type": "integer",
                                "nullable": true
                            },
                            "suggestionId": {
                                "type": "integer",
                                "nullable": true
                            },
                            "suggestionCatalogProgramId": {
                                "type": "integer",
                                "nullable": true
                            },
                            "catalogProgramId": {
                                "type": "integer",
                                "nullable": true
                            },
                            "specializationId": {
                                "type": "integer",
                                "nullable": true
                            },
                            "languageId": {
                                "type": "integer",
                                "nullable": true
                            },
                            "manualCourseIds": {
                                "type": "array",
                                "items": {
                                    "type": "integer"
                                }
                            }
                        },
                        "required": [
                            "mode",
                            "curriculumSource",
                            "curriculumId",
                            "suggestionId",
                            "catalogProgramId",
                            "specializationId",
                            "languageId",
                            "manualCourseIds"
                        ],
                        "additionalProperties": false
                    },
                    "classes": {
                        "type": "object",
                        "properties": {
                            "set": {
                                "type": "array",
                                "items": {
                                    "type": "integer"
                                }
                            },
                            "add": {
                                "type": "array",
                                "items": {
                                    "type": "integer"
                                }
                            },
                            "remove": {
                                "type": "array",
                                "items": {
                                    "type": "integer"
                                }
                            }
                        }
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
        }
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
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "minLength": 1
                    },
                    "visibility": {
                        "type": "string",
                        "enum": [
                            "PRIVATE",
                            "FRIENDS",
                            "PUBLIC"
                        ]
                    },
                    "curriculumId": {
                        "type": "integer",
                        "nullable": true
                    },
                    "guide": {
                        "type": "object",
                        "properties": {
                            "mode": {
                                "type": "string",
                                "enum": [
                                    "CURRICULUM",
                                    "PROGRAM",
                                    "NONE"
                                ]
                            },
                            "curriculumSource": {
                                "type": "string",
                                "nullable": true,
                                "enum": [
                                    "SAVED",
                                    "SUGGESTION",
                                    null
                                ]
                            },
                            "curriculumId": {
                                "type": "integer",
                                "nullable": true
                            },
                            "suggestionId": {
                                "type": "integer",
                                "nullable": true
                            },
                            "suggestionCatalogProgramId": {
                                "type": "integer",
                                "nullable": true
                            },
                            "catalogProgramId": {
                                "type": "integer",
                                "nullable": true
                            },
                            "specializationId": {
                                "type": "integer",
                                "nullable": true
                            },
                            "languageId": {
                                "type": "integer",
                                "nullable": true
                            },
                            "manualCourseIds": {
                                "type": "array",
                                "items": {
                                    "type": "integer"
                                }
                            }
                        },
                        "required": [
                            "mode",
                            "curriculumSource",
                            "curriculumId",
                            "suggestionId",
                            "catalogProgramId",
                            "specializationId",
                            "languageId",
                            "manualCourseIds"
                        ],
                        "additionalProperties": false
                    },
                    "classes": {
                        "type": "object",
                        "properties": {
                            "set": {
                                "type": "array",
                                "items": {
                                    "type": "integer"
                                }
                            },
                            "add": {
                                "type": "array",
                                "items": {
                                    "type": "integer"
                                }
                            },
                            "remove": {
                                "type": "array",
                                "items": {
                                    "type": "integer"
                                }
                            }
                        }
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
        }
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
                        "type": "string",
                        "enum": [
                            "PRIVATE",
                            "FRIENDS",
                            "PUBLIC"
                        ]
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
        }
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
        }
    },
    "updateStudentTagInterests": {
        "operationId": "updateStudentTagInterests",
        "target": "app",
        "method": "PUT",
        "path": "/student/{sid}/tag-interests/{tagId}",
        "authentication": "required",
        "tags": [
            "student-tag-interests"
        ],
        "summary": "Update StudentTagInterests",
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
        }
    },
    "updateTags": {
        "operationId": "updateTags",
        "target": "app",
        "method": "PUT",
        "path": "/tags/{id}",
        "authentication": "required",
        "tags": [
            "tags"
        ],
        "summary": "Update Tags",
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
        }
    },
} as const satisfies Record<string, GeneratedOperationDefinition>

export type OperationName = keyof typeof operationDefinitions
