import type { PomiRequestContext } from '../../runtime/client.js'
import type { AuthenticationMode } from '../../runtime/operation.js'
import { operationDefinitions as definitions } from './operations.js'
import type { acceptStudentFriendshipInput, acceptStudentFriendshipOutput, addCourseTagInput, addCourseTagOutput, createAuthUserInput, createAuthUserOutput, createCategoryInput, createCategoryOutput, createFeedbackReportInput, createFeedbackReportOutput, createStudentAbsencesInput, createStudentAbsencesOutput, createStudentCourseAttemptsInput, createStudentCourseAttemptsOutput, createStudentCurriculaInput, createStudentCurriculaOutput, createStudentFeedbackReportInput, createStudentFeedbackReportOutput, createStudentFriendshipInput, createStudentFriendshipOutput, createStudentHistoryInput, createStudentHistoryOutput, createStudentPeriodPlanningsInput, createStudentPeriodPlanningsOutput, createStudentsInput, createStudentsOutput, createTagInput, createTagOutput, deleteCategoryInput, deleteCategoryOutput, deleteStudentAbsencesInput, deleteStudentAbsencesOutput, deleteStudentCourseAttemptsInput, deleteStudentCourseAttemptsOutput, deleteStudentCurriculaInput, deleteStudentCurriculaOutput, deleteStudentFriendshipInput, deleteStudentFriendshipOutput, deleteStudentPeriodPlanningsInput, deleteStudentPeriodPlanningsOutput, deleteStudentsInput, deleteStudentsOutput, deleteStudentTagInterestInput, deleteStudentTagInterestOutput, deleteTagInput, deleteTagOutput, getCategoryInput, getCategoryOutput, getCurrentUserInput, getCurrentUserOutput, getExchangeNoticeSubscriptionInput, getExchangeNoticeSubscriptionOutput, getProfessorEvaluationInput, getProfessorEvaluationOutput, getPublicSharedPeriodPlanningInput, getPublicSharedPeriodPlanningOutput, getStudentCourseAttemptsInput, getStudentCourseAttemptsOutput, getStudentCurriculaInput, getStudentCurriculaOutput, getStudentPeriodPlanningsInput, getStudentPeriodPlanningsOutput, getStudentPersonInput, getStudentPersonOutput, getStudentPublicProfileInput, getStudentPublicProfileOutput, getStudentsInput, getStudentsOutput, getStudentSharedPeriodPlanningInput, getStudentSharedPeriodPlanningOutput, getTagInput, getTagOutput, listAuthUsersInput, listAuthUsersOutput, listBotGrantsInput, listBotGrantsOutput, listBotsInput, listBotsOutput, listCategoriesInput, listCategoriesOutput, listCourseTagsInput, listCourseTagsOutput, listFeedbackReportsInput, listFeedbackReportsOutput, listPendingProfessorEvaluationsInput, listPendingProfessorEvaluationsOutput, listPublicSharedPeriodPlanningsInput, listPublicSharedPeriodPlanningsOutput, listStudentAbsencesInput, listStudentAbsencesOutput, listStudentCourseAttemptsInput, listStudentCourseAttemptsOutput, listStudentCurriculaInput, listStudentCurriculaOutput, listStudentFeedbackReportsInput, listStudentFeedbackReportsOutput, listStudentFriendshipsInput, listStudentFriendshipsOutput, listStudentPeopleInput, listStudentPeopleOutput, listStudentPeriodPlanningsInput, listStudentPeriodPlanningsOutput, listStudentsInput, listStudentsOutput, listStudentSharedPeriodPlanningsInput, listStudentSharedPeriodPlanningsOutput, listStudentTagInterestsInput, listStudentTagInterestsOutput, listTagCoursesInput, listTagCoursesOutput, listTagsInput, listTagsOutput, removeCourseTagInput, removeCourseTagOutput, replaceBotGrantInput, replaceBotGrantOutput, unsubscribeExchangeNoticesInput, unsubscribeExchangeNoticesOutput, updateAuthUserInput, updateAuthUserOutput, updateCategoryInput, updateCategoryOutput, updateExchangeNoticeSubscriptionInput, updateExchangeNoticeSubscriptionOutput, updateFeedbackReportInput, updateFeedbackReportOutput, updateProfessorEvaluationInput, updateProfessorEvaluationOutput, updateStudentCourseAttemptsInput, updateStudentCourseAttemptsOutput, updateStudentCurriculaInput, updateStudentCurriculaOutput, updateStudentPeriodPlanningsInput, updateStudentPeriodPlanningsOutput, updateStudentPublicProfileInput, updateStudentPublicProfileOutput, updateStudentsInput, updateStudentsOutput, updateStudentTagInterestInput, updateStudentTagInterestOutput, updateTagInput, updateTagOutput } from './operations.js'
import { operationProblemTypes } from './problems.js'

type OperationFunction<Input, Output> = (input: Input, context?: PomiRequestContext) => Promise<Output>
type Operations = {
    acceptStudentFriendship: OperationFunction<acceptStudentFriendshipInput, acceptStudentFriendshipOutput>
    addCourseTag: OperationFunction<addCourseTagInput, addCourseTagOutput>
    createAuthUser: OperationFunction<createAuthUserInput, createAuthUserOutput>
    createCategory: OperationFunction<createCategoryInput, createCategoryOutput>
    createFeedbackReport: OperationFunction<createFeedbackReportInput, createFeedbackReportOutput>
    createStudentAbsences: OperationFunction<createStudentAbsencesInput, createStudentAbsencesOutput>
    createStudentCourseAttempts: OperationFunction<createStudentCourseAttemptsInput, createStudentCourseAttemptsOutput>
    createStudentCurricula: OperationFunction<createStudentCurriculaInput, createStudentCurriculaOutput>
    createStudentFeedbackReport: OperationFunction<createStudentFeedbackReportInput, createStudentFeedbackReportOutput>
    createStudentFriendship: OperationFunction<createStudentFriendshipInput, createStudentFriendshipOutput>
    createStudentHistory: OperationFunction<createStudentHistoryInput, createStudentHistoryOutput>
    createStudentPeriodPlannings: OperationFunction<createStudentPeriodPlanningsInput, createStudentPeriodPlanningsOutput>
    createStudents: OperationFunction<createStudentsInput, createStudentsOutput>
    createTag: OperationFunction<createTagInput, createTagOutput>
    deleteCategory: OperationFunction<deleteCategoryInput, deleteCategoryOutput>
    deleteStudentAbsences: OperationFunction<deleteStudentAbsencesInput, deleteStudentAbsencesOutput>
    deleteStudentCourseAttempts: OperationFunction<deleteStudentCourseAttemptsInput, deleteStudentCourseAttemptsOutput>
    deleteStudentCurricula: OperationFunction<deleteStudentCurriculaInput, deleteStudentCurriculaOutput>
    deleteStudentFriendship: OperationFunction<deleteStudentFriendshipInput, deleteStudentFriendshipOutput>
    deleteStudentPeriodPlannings: OperationFunction<deleteStudentPeriodPlanningsInput, deleteStudentPeriodPlanningsOutput>
    deleteStudents: OperationFunction<deleteStudentsInput, deleteStudentsOutput>
    deleteStudentTagInterest: OperationFunction<deleteStudentTagInterestInput, deleteStudentTagInterestOutput>
    deleteTag: OperationFunction<deleteTagInput, deleteTagOutput>
    getCategory: OperationFunction<getCategoryInput, getCategoryOutput>
    getCurrentUser: OperationFunction<getCurrentUserInput, getCurrentUserOutput>
    getExchangeNoticeSubscription: OperationFunction<getExchangeNoticeSubscriptionInput, getExchangeNoticeSubscriptionOutput>
    getProfessorEvaluation: OperationFunction<getProfessorEvaluationInput, getProfessorEvaluationOutput>
    getPublicSharedPeriodPlanning: OperationFunction<getPublicSharedPeriodPlanningInput, getPublicSharedPeriodPlanningOutput>
    getStudentCourseAttempts: OperationFunction<getStudentCourseAttemptsInput, getStudentCourseAttemptsOutput>
    getStudentCurricula: OperationFunction<getStudentCurriculaInput, getStudentCurriculaOutput>
    getStudentPeriodPlannings: OperationFunction<getStudentPeriodPlanningsInput, getStudentPeriodPlanningsOutput>
    getStudentPerson: OperationFunction<getStudentPersonInput, getStudentPersonOutput>
    getStudentPublicProfile: OperationFunction<getStudentPublicProfileInput, getStudentPublicProfileOutput>
    getStudents: OperationFunction<getStudentsInput, getStudentsOutput>
    getStudentSharedPeriodPlanning: OperationFunction<getStudentSharedPeriodPlanningInput, getStudentSharedPeriodPlanningOutput>
    getTag: OperationFunction<getTagInput, getTagOutput>
    listAuthUsers: OperationFunction<listAuthUsersInput, listAuthUsersOutput>
    listBotGrants: OperationFunction<listBotGrantsInput, listBotGrantsOutput>
    listBots: OperationFunction<listBotsInput, listBotsOutput>
    listCategories: OperationFunction<listCategoriesInput, listCategoriesOutput>
    listCourseTags: OperationFunction<listCourseTagsInput, listCourseTagsOutput>
    listFeedbackReports: OperationFunction<listFeedbackReportsInput, listFeedbackReportsOutput>
    listPendingProfessorEvaluations: OperationFunction<listPendingProfessorEvaluationsInput, listPendingProfessorEvaluationsOutput>
    listPublicSharedPeriodPlannings: OperationFunction<listPublicSharedPeriodPlanningsInput, listPublicSharedPeriodPlanningsOutput>
    listStudentAbsences: OperationFunction<listStudentAbsencesInput, listStudentAbsencesOutput>
    listStudentCourseAttempts: OperationFunction<listStudentCourseAttemptsInput, listStudentCourseAttemptsOutput>
    listStudentCurricula: OperationFunction<listStudentCurriculaInput, listStudentCurriculaOutput>
    listStudentFeedbackReports: OperationFunction<listStudentFeedbackReportsInput, listStudentFeedbackReportsOutput>
    listStudentFriendships: OperationFunction<listStudentFriendshipsInput, listStudentFriendshipsOutput>
    listStudentPeople: OperationFunction<listStudentPeopleInput, listStudentPeopleOutput>
    listStudentPeriodPlannings: OperationFunction<listStudentPeriodPlanningsInput, listStudentPeriodPlanningsOutput>
    listStudents: OperationFunction<listStudentsInput, listStudentsOutput>
    listStudentSharedPeriodPlannings: OperationFunction<listStudentSharedPeriodPlanningsInput, listStudentSharedPeriodPlanningsOutput>
    listStudentTagInterests: OperationFunction<listStudentTagInterestsInput, listStudentTagInterestsOutput>
    listTagCourses: OperationFunction<listTagCoursesInput, listTagCoursesOutput>
    listTags: OperationFunction<listTagsInput, listTagsOutput>
    removeCourseTag: OperationFunction<removeCourseTagInput, removeCourseTagOutput>
    replaceBotGrant: OperationFunction<replaceBotGrantInput, replaceBotGrantOutput>
    unsubscribeExchangeNotices: OperationFunction<unsubscribeExchangeNoticesInput, unsubscribeExchangeNoticesOutput>
    updateAuthUser: OperationFunction<updateAuthUserInput, updateAuthUserOutput>
    updateCategory: OperationFunction<updateCategoryInput, updateCategoryOutput>
    updateExchangeNoticeSubscription: OperationFunction<updateExchangeNoticeSubscriptionInput, updateExchangeNoticeSubscriptionOutput>
    updateFeedbackReport: OperationFunction<updateFeedbackReportInput, updateFeedbackReportOutput>
    updateProfessorEvaluation: OperationFunction<updateProfessorEvaluationInput, updateProfessorEvaluationOutput>
    updateStudentCourseAttempts: OperationFunction<updateStudentCourseAttemptsInput, updateStudentCourseAttemptsOutput>
    updateStudentCurricula: OperationFunction<updateStudentCurriculaInput, updateStudentCurriculaOutput>
    updateStudentPeriodPlannings: OperationFunction<updateStudentPeriodPlanningsInput, updateStudentPeriodPlanningsOutput>
    updateStudentPublicProfile: OperationFunction<updateStudentPublicProfileInput, updateStudentPublicProfileOutput>
    updateStudents: OperationFunction<updateStudentsInput, updateStudentsOutput>
    updateStudentTagInterest: OperationFunction<updateStudentTagInterestInput, updateStudentTagInterestOutput>
    updateTag: OperationFunction<updateTagInput, updateTagOutput>
}
type RequestPath = <T>(target: "app", path: string, authentication?: AuthenticationMode, context?: PomiRequestContext) => Promise<T>

function withMetadata<FunctionType extends (...args: any[]) => unknown, Definition, Problems>(fn: FunctionType, meta: Definition, problemTypes: Problems) {
    return Object.assign(fn, { meta, problemTypes })
}

function operationInput<Input>(input: Input): Input {
    return input
}

async function* paginateByLink<Page extends { links: { next: string | null } }>(firstPage: Promise<Page>, target: "app", authentication: AuthenticationMode, requestPath: RequestPath, context?: PomiRequestContext): AsyncIterable<Page> {
    let page = await firstPage
    yield page
    let next = page.links.next
    while (typeof next === 'string' && next.length > 0) {
        page = await requestPath<Page>(target, next, authentication, context)
        yield page
        next = page.links.next
    }
}


export function bindResources(operations: Operations, requestPath: RequestPath) {

    return {
        "studentSocial": (() => {
            const acceptFriendshipOperation = withMetadata((studentId: number, friendshipId: number, context?: PomiRequestContext) => operations.acceptStudentFriendship(operationInput<acceptStudentFriendshipInput>({ "sid": studentId, "id": friendshipId }), context), definitions.acceptStudentFriendship, operationProblemTypes.acceptStudentFriendship)
            const createFriendshipOperation = withMetadata((studentId: number, body: createStudentFriendshipInput['body'], context?: PomiRequestContext) => operations.createStudentFriendship(operationInput<createStudentFriendshipInput>({ "sid": studentId, body }), context), definitions.createStudentFriendship, operationProblemTypes.createStudentFriendship)
            const removeFriendshipOperation = withMetadata((studentId: number, friendshipId: number, context?: PomiRequestContext) => operations.deleteStudentFriendship(operationInput<deleteStudentFriendshipInput>({ "sid": studentId, "id": friendshipId }), context), definitions.deleteStudentFriendship, operationProblemTypes.deleteStudentFriendship)
            const getPersonOperation = withMetadata((studentId: number, publicId: string, context?: PomiRequestContext) => operations.getStudentPerson(operationInput<getStudentPersonInput>({ "sid": studentId, "publicId": publicId }), context), definitions.getStudentPerson, operationProblemTypes.getStudentPerson)
            const getProfileOperation = withMetadata((studentId: number, context?: PomiRequestContext) => operations.getStudentPublicProfile(operationInput<getStudentPublicProfileInput>({ "sid": studentId }), context), definitions.getStudentPublicProfile, operationProblemTypes.getStudentPublicProfile)
            const listFriendshipsOperation = withMetadata((studentId: number, input: Omit<listStudentFriendshipsInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentFriendships(operationInput<listStudentFriendshipsInput>({ "sid": studentId, ...input }), context), definitions.listStudentFriendships, operationProblemTypes.listStudentFriendships)
            const updateProfileOperation = withMetadata((studentId: number, body: updateStudentPublicProfileInput['body'], context?: PomiRequestContext) => operations.updateStudentPublicProfile(operationInput<updateStudentPublicProfileInput>({ "sid": studentId, body }), context), definitions.updateStudentPublicProfile, operationProblemTypes.updateStudentPublicProfile)
            const pages = (studentId: number, input: Omit<listStudentFriendshipsInput, "sid"> = {}, context?: PomiRequestContext) => paginateByLink<listStudentFriendshipsOutput>(operations.listStudentFriendships(operationInput<listStudentFriendshipsInput>({ "sid": studentId, ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "app", definitions.listStudentFriendships.authentication, requestPath, context)
            const listAll = async (studentId: number, input: Omit<listStudentFriendshipsInput, "sid"> = {}, context?: PomiRequestContext) => { const items: Array<listStudentFriendshipsOutput['data'][number]> = []; for await (const page of pages(studentId, input, context)) items.push(...page.data); return items }
            return { acceptFriendship: acceptFriendshipOperation, createFriendship: createFriendshipOperation, removeFriendship: removeFriendshipOperation, getPerson: getPersonOperation, getProfile: getProfileOperation, listFriendships: listFriendshipsOperation, updateProfile: updateProfileOperation, pages, listAll }
        })(),
        "courseTags": (() => {
            const addOperation = withMetadata((courseId: number, tagId: number, context?: PomiRequestContext) => operations.addCourseTag(operationInput<addCourseTagInput>({ "courseId": courseId, "tagId": tagId }), context), definitions.addCourseTag, operationProblemTypes.addCourseTag)
            const listForCourseOperation = withMetadata((courseId: number, input: Omit<listCourseTagsInput, "courseId"> = {}, context?: PomiRequestContext) => operations.listCourseTags(operationInput<listCourseTagsInput>({ "courseId": courseId, ...input }), context), definitions.listCourseTags, operationProblemTypes.listCourseTags)
            const listCoursesForTagOperation = withMetadata((tagId: number, input: Omit<listTagCoursesInput, "id"> = {}, context?: PomiRequestContext) => operations.listTagCourses(operationInput<listTagCoursesInput>({ "id": tagId, ...input }), context), definitions.listTagCourses, operationProblemTypes.listTagCourses)
            const removeOperation = withMetadata((courseId: number, tagId: number, context?: PomiRequestContext) => operations.removeCourseTag(operationInput<removeCourseTagInput>({ "courseId": courseId, "tagId": tagId }), context), definitions.removeCourseTag, operationProblemTypes.removeCourseTag)
            const listForCoursePages = (courseId: number, input: Omit<listCourseTagsInput, "courseId"> = {}, context?: PomiRequestContext) => paginateByLink<listCourseTagsOutput>(operations.listCourseTags(operationInput<listCourseTagsInput>({ "courseId": courseId, ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "app", definitions.listCourseTags.authentication, requestPath, context)
            const listForCourseAll = async (courseId: number, input: Omit<listCourseTagsInput, "courseId"> = {}, context?: PomiRequestContext) => { const items: Array<listCourseTagsOutput['data'][number]> = []; for await (const page of listForCoursePages(courseId, input, context)) items.push(...page.data); return items }
            const listCoursesForTagPages = (tagId: number, input: Omit<listTagCoursesInput, "id"> = {}, context?: PomiRequestContext) => paginateByLink<listTagCoursesOutput>(operations.listTagCourses(operationInput<listTagCoursesInput>({ "id": tagId, ...{ ...input, page: input.page ?? 1, pageSize: input.pageSize ?? 20 } }), context), "app", definitions.listTagCourses.authentication, requestPath, context)
            const listCoursesForTagAll = async (tagId: number, input: Omit<listTagCoursesInput, "id"> = {}, context?: PomiRequestContext) => { const items: Array<listTagCoursesOutput['data'][number]> = []; for await (const page of listCoursesForTagPages(tagId, input, context)) items.push(...page.data); return items }
            return { add: addOperation, listForCourse: listForCourseOperation, listCoursesForTag: listCoursesForTagOperation, remove: removeOperation, listForCoursePages, listForCourseAll, listCoursesForTagPages, listCoursesForTagAll }
        })(),
        "authUsers": (() => {
            const createOperation = withMetadata((body: createAuthUserInput['body'], context?: PomiRequestContext) => operations.createAuthUser(operationInput<createAuthUserInput>({ body }), context), definitions.createAuthUser, operationProblemTypes.createAuthUser)
            const listOperation = withMetadata((input: Omit<listAuthUsersInput, never> = {}, context?: PomiRequestContext) => operations.listAuthUsers(operationInput<listAuthUsersInput>({ ...input }), context), definitions.listAuthUsers, operationProblemTypes.listAuthUsers)
            const updateOperation = withMetadata((authUserId: number, body: updateAuthUserInput['body'], context?: PomiRequestContext) => operations.updateAuthUser(operationInput<updateAuthUserInput>({ "id": authUserId, body }), context), definitions.updateAuthUser, operationProblemTypes.updateAuthUser)
            const pages = (input: Omit<listAuthUsersInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listAuthUsersOutput>(operations.listAuthUsers(operationInput<listAuthUsersInput>({ ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "app", definitions.listAuthUsers.authentication, requestPath, context)
            const listAll = async (input: Omit<listAuthUsersInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listAuthUsersOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { create: createOperation, list: listOperation, update: updateOperation, pages, listAll }
        })(),
        "categories": (() => {
            const createOperation = withMetadata((body: createCategoryInput['body'], context?: PomiRequestContext) => operations.createCategory(operationInput<createCategoryInput>({ body }), context), definitions.createCategory, operationProblemTypes.createCategory)
            const deleteOperation = withMetadata((categoryId: number, context?: PomiRequestContext) => operations.deleteCategory(operationInput<deleteCategoryInput>({ "id": categoryId }), context), definitions.deleteCategory, operationProblemTypes.deleteCategory)
            const getOperation = withMetadata((categoryId: number, context?: PomiRequestContext) => operations.getCategory(operationInput<getCategoryInput>({ "id": categoryId }), context), definitions.getCategory, operationProblemTypes.getCategory)
            const listOperation = withMetadata((input: Omit<listCategoriesInput, never> = {}, context?: PomiRequestContext) => operations.listCategories(operationInput<listCategoriesInput>({ ...input }), context), definitions.listCategories, operationProblemTypes.listCategories)
            const updateOperation = withMetadata((categoryId: number, body: updateCategoryInput['body'], context?: PomiRequestContext) => operations.updateCategory(operationInput<updateCategoryInput>({ "id": categoryId, body }), context), definitions.updateCategory, operationProblemTypes.updateCategory)
            const pages = (input: Omit<listCategoriesInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listCategoriesOutput>(operations.listCategories(operationInput<listCategoriesInput>({ ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "app", definitions.listCategories.authentication, requestPath, context)
            const listAll = async (input: Omit<listCategoriesInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listCategoriesOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { create: createOperation, delete: deleteOperation, get: getOperation, list: listOperation, update: updateOperation, pages, listAll }
        })(),
        "feedbackReports": (() => {
            const createOperation = withMetadata((body: createFeedbackReportInput['body'], context?: PomiRequestContext) => operations.createFeedbackReport(operationInput<createFeedbackReportInput>({ body }), context), definitions.createFeedbackReport, operationProblemTypes.createFeedbackReport)
            const createForStudentOperation = withMetadata((studentId: number, body: createStudentFeedbackReportInput['body'], context?: PomiRequestContext) => operations.createStudentFeedbackReport(operationInput<createStudentFeedbackReportInput>({ "sid": studentId, body }), context), definitions.createStudentFeedbackReport, operationProblemTypes.createStudentFeedbackReport)
            const listOperation = withMetadata((input: Omit<listFeedbackReportsInput, never> = {}, context?: PomiRequestContext) => operations.listFeedbackReports(operationInput<listFeedbackReportsInput>({ ...input }), context), definitions.listFeedbackReports, operationProblemTypes.listFeedbackReports)
            const listForStudentOperation = withMetadata((studentId: number, input: Omit<listStudentFeedbackReportsInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentFeedbackReports(operationInput<listStudentFeedbackReportsInput>({ "sid": studentId, ...input }), context), definitions.listStudentFeedbackReports, operationProblemTypes.listStudentFeedbackReports)
            const updateOperation = withMetadata((feedbackReportId: number, body: updateFeedbackReportInput['body'], context?: PomiRequestContext) => operations.updateFeedbackReport(operationInput<updateFeedbackReportInput>({ "id": feedbackReportId, body }), context), definitions.updateFeedbackReport, operationProblemTypes.updateFeedbackReport)
            const listPages = (input: Omit<listFeedbackReportsInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listFeedbackReportsOutput>(operations.listFeedbackReports(operationInput<listFeedbackReportsInput>({ ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "app", definitions.listFeedbackReports.authentication, requestPath, context)
            const listAll = async (input: Omit<listFeedbackReportsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listFeedbackReportsOutput['data'][number]> = []; for await (const page of listPages(input, context)) items.push(...page.data); return items }
            const listForStudentPages = (studentId: number, input: Omit<listStudentFeedbackReportsInput, "sid"> = {}, context?: PomiRequestContext) => paginateByLink<listStudentFeedbackReportsOutput>(operations.listStudentFeedbackReports(operationInput<listStudentFeedbackReportsInput>({ "sid": studentId, ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "app", definitions.listStudentFeedbackReports.authentication, requestPath, context)
            const listForStudentAll = async (studentId: number, input: Omit<listStudentFeedbackReportsInput, "sid"> = {}, context?: PomiRequestContext) => { const items: Array<listStudentFeedbackReportsOutput['data'][number]> = []; for await (const page of listForStudentPages(studentId, input, context)) items.push(...page.data); return items }
            return { create: createOperation, createForStudent: createForStudentOperation, list: listOperation, listForStudent: listForStudentOperation, update: updateOperation, listPages, listAll, listForStudentPages, listForStudentAll }
        })(),
        "studentAbsences": (() => {
            const createOperation = withMetadata((studentId: number, body: createStudentAbsencesInput['body'], context?: PomiRequestContext) => operations.createStudentAbsences(operationInput<createStudentAbsencesInput>({ "sid": studentId, body }), context), definitions.createStudentAbsences, operationProblemTypes.createStudentAbsences)
            const deleteOperation = withMetadata((studentId: number, studentAbsenceId: number, context?: PomiRequestContext) => operations.deleteStudentAbsences(operationInput<deleteStudentAbsencesInput>({ "sid": studentId, "id": studentAbsenceId }), context), definitions.deleteStudentAbsences, operationProblemTypes.deleteStudentAbsences)
            const listOperation = withMetadata((studentId: number, input: Omit<listStudentAbsencesInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentAbsences(operationInput<listStudentAbsencesInput>({ "sid": studentId, ...input }), context), definitions.listStudentAbsences, operationProblemTypes.listStudentAbsences)
            const pages = (studentId: number, input: Omit<listStudentAbsencesInput, "sid"> = {}, context?: PomiRequestContext) => paginateByLink<listStudentAbsencesOutput>(operations.listStudentAbsences(operationInput<listStudentAbsencesInput>({ "sid": studentId, ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "app", definitions.listStudentAbsences.authentication, requestPath, context)
            const listAll = async (studentId: number, input: Omit<listStudentAbsencesInput, "sid"> = {}, context?: PomiRequestContext) => { const items: Array<listStudentAbsencesOutput['data'][number]> = []; for await (const page of pages(studentId, input, context)) items.push(...page.data); return items }
            return { create: createOperation, delete: deleteOperation, list: listOperation, pages, listAll }
        })(),
        "courseAttempts": (() => {
            const createOperation = withMetadata((studentId: number, body: createStudentCourseAttemptsInput['body'], context?: PomiRequestContext) => operations.createStudentCourseAttempts(operationInput<createStudentCourseAttemptsInput>({ "sid": studentId, body }), context), definitions.createStudentCourseAttempts, operationProblemTypes.createStudentCourseAttempts)
            const deleteOperation = withMetadata((studentId: number, courseAttemptId: number, context?: PomiRequestContext) => operations.deleteStudentCourseAttempts(operationInput<deleteStudentCourseAttemptsInput>({ "sid": studentId, "id": courseAttemptId }), context), definitions.deleteStudentCourseAttempts, operationProblemTypes.deleteStudentCourseAttempts)
            const getOperation = withMetadata((studentId: number, courseAttemptId: number, context?: PomiRequestContext) => operations.getStudentCourseAttempts(operationInput<getStudentCourseAttemptsInput>({ "sid": studentId, "id": courseAttemptId }), context), definitions.getStudentCourseAttempts, operationProblemTypes.getStudentCourseAttempts)
            const listOperation = withMetadata((studentId: number, input: Omit<listStudentCourseAttemptsInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentCourseAttempts(operationInput<listStudentCourseAttemptsInput>({ "sid": studentId, ...input }), context), definitions.listStudentCourseAttempts, operationProblemTypes.listStudentCourseAttempts)
            const updateOperation = withMetadata((studentId: number, courseAttemptId: number, body: updateStudentCourseAttemptsInput['body'], context?: PomiRequestContext) => operations.updateStudentCourseAttempts(operationInput<updateStudentCourseAttemptsInput>({ "sid": studentId, "id": courseAttemptId, body }), context), definitions.updateStudentCourseAttempts, operationProblemTypes.updateStudentCourseAttempts)
            const pages = (studentId: number, input: Omit<listStudentCourseAttemptsInput, "sid"> = {}, context?: PomiRequestContext) => paginateByLink<listStudentCourseAttemptsOutput>(operations.listStudentCourseAttempts(operationInput<listStudentCourseAttemptsInput>({ "sid": studentId, ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "app", definitions.listStudentCourseAttempts.authentication, requestPath, context)
            const listAll = async (studentId: number, input: Omit<listStudentCourseAttemptsInput, "sid"> = {}, context?: PomiRequestContext) => { const items: Array<listStudentCourseAttemptsOutput['data'][number]> = []; for await (const page of pages(studentId, input, context)) items.push(...page.data); return items }
            return { create: createOperation, delete: deleteOperation, get: getOperation, list: listOperation, update: updateOperation, pages, listAll }
        })(),
        "curricula": (() => {
            const createOperation = withMetadata((studentId: number, body: createStudentCurriculaInput['body'], context?: PomiRequestContext) => operations.createStudentCurricula(operationInput<createStudentCurriculaInput>({ "sid": studentId, body }), context), definitions.createStudentCurricula, operationProblemTypes.createStudentCurricula)
            const deleteOperation = withMetadata((studentId: number, curriculumId: number, context?: PomiRequestContext) => operations.deleteStudentCurricula(operationInput<deleteStudentCurriculaInput>({ "sid": studentId, "id": curriculumId }), context), definitions.deleteStudentCurricula, operationProblemTypes.deleteStudentCurricula)
            const getOperation = withMetadata((studentId: number, curriculumId: number, context?: PomiRequestContext) => operations.getStudentCurricula(operationInput<getStudentCurriculaInput>({ "sid": studentId, "id": curriculumId }), context), definitions.getStudentCurricula, operationProblemTypes.getStudentCurricula)
            const listOperation = withMetadata((studentId: number, input: Omit<listStudentCurriculaInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentCurricula(operationInput<listStudentCurriculaInput>({ "sid": studentId, ...input }), context), definitions.listStudentCurricula, operationProblemTypes.listStudentCurricula)
            const updateOperation = withMetadata((studentId: number, curriculumId: number, body: updateStudentCurriculaInput['body'], context?: PomiRequestContext) => operations.updateStudentCurricula(operationInput<updateStudentCurriculaInput>({ "sid": studentId, "id": curriculumId, body }), context), definitions.updateStudentCurricula, operationProblemTypes.updateStudentCurricula)
            const pages = (studentId: number, input: Omit<listStudentCurriculaInput, "sid"> = {}, context?: PomiRequestContext) => paginateByLink<listStudentCurriculaOutput>(operations.listStudentCurricula(operationInput<listStudentCurriculaInput>({ "sid": studentId, ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "app", definitions.listStudentCurricula.authentication, requestPath, context)
            const listAll = async (studentId: number, input: Omit<listStudentCurriculaInput, "sid"> = {}, context?: PomiRequestContext) => { const items: Array<listStudentCurriculaOutput['data'][number]> = []; for await (const page of pages(studentId, input, context)) items.push(...page.data); return items }
            return { create: createOperation, delete: deleteOperation, get: getOperation, list: listOperation, update: updateOperation, pages, listAll }
        })(),
        "studentHistory": (() => {
            const createOperation = withMetadata((studentId: number, body: createStudentHistoryInput['body'], context?: PomiRequestContext) => operations.createStudentHistory(operationInput<createStudentHistoryInput>({ "sid": studentId, body }), context), definitions.createStudentHistory, operationProblemTypes.createStudentHistory)
            return { create: createOperation }
        })(),
        "periodPlannings": (() => {
            const createOperation = withMetadata((studentId: number, body: createStudentPeriodPlanningsInput['body'], context?: PomiRequestContext) => operations.createStudentPeriodPlannings(operationInput<createStudentPeriodPlanningsInput>({ "sid": studentId, body }), context), definitions.createStudentPeriodPlannings, operationProblemTypes.createStudentPeriodPlannings)
            const deleteOperation = withMetadata((studentId: number, periodPlanningId: number, context?: PomiRequestContext) => operations.deleteStudentPeriodPlannings(operationInput<deleteStudentPeriodPlanningsInput>({ "sid": studentId, "id": periodPlanningId }), context), definitions.deleteStudentPeriodPlannings, operationProblemTypes.deleteStudentPeriodPlannings)
            const getOperation = withMetadata((studentId: number, periodPlanningId: number, context?: PomiRequestContext) => operations.getStudentPeriodPlannings(operationInput<getStudentPeriodPlanningsInput>({ "sid": studentId, "id": periodPlanningId }), context), definitions.getStudentPeriodPlannings, operationProblemTypes.getStudentPeriodPlannings)
            const listOperation = withMetadata((studentId: number, input: Omit<listStudentPeriodPlanningsInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentPeriodPlannings(operationInput<listStudentPeriodPlanningsInput>({ "sid": studentId, ...input }), context), definitions.listStudentPeriodPlannings, operationProblemTypes.listStudentPeriodPlannings)
            const updateOperation = withMetadata((studentId: number, periodPlanningId: number, body: updateStudentPeriodPlanningsInput['body'], context?: PomiRequestContext) => operations.updateStudentPeriodPlannings(operationInput<updateStudentPeriodPlanningsInput>({ "sid": studentId, "id": periodPlanningId, body }), context), definitions.updateStudentPeriodPlannings, operationProblemTypes.updateStudentPeriodPlannings)
            const pages = (studentId: number, input: Omit<listStudentPeriodPlanningsInput, "sid"> = {}, context?: PomiRequestContext) => paginateByLink<listStudentPeriodPlanningsOutput>(operations.listStudentPeriodPlannings(operationInput<listStudentPeriodPlanningsInput>({ "sid": studentId, ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "app", definitions.listStudentPeriodPlannings.authentication, requestPath, context)
            const listAll = async (studentId: number, input: Omit<listStudentPeriodPlanningsInput, "sid"> = {}, context?: PomiRequestContext) => { const items: Array<listStudentPeriodPlanningsOutput['data'][number]> = []; for await (const page of pages(studentId, input, context)) items.push(...page.data); return items }
            return { create: createOperation, delete: deleteOperation, get: getOperation, list: listOperation, update: updateOperation, pages, listAll }
        })(),
        "students": (() => {
            const createOperation = withMetadata((body: createStudentsInput['body'], context?: PomiRequestContext) => operations.createStudents(operationInput<createStudentsInput>({ body }), context), definitions.createStudents, operationProblemTypes.createStudents)
            const deleteOperation = withMetadata((studentId: number, body: deleteStudentsInput['body'], context?: PomiRequestContext) => operations.deleteStudents(operationInput<deleteStudentsInput>({ "id": studentId, body }), context), definitions.deleteStudents, operationProblemTypes.deleteStudents)
            const getOperation = withMetadata((studentId: number, context?: PomiRequestContext) => operations.getStudents(operationInput<getStudentsInput>({ "id": studentId }), context), definitions.getStudents, operationProblemTypes.getStudents)
            const listOperation = withMetadata((input: Omit<listStudentsInput, never> = {}, context?: PomiRequestContext) => operations.listStudents(operationInput<listStudentsInput>({ ...input }), context), definitions.listStudents, operationProblemTypes.listStudents)
            const updateOperation = withMetadata((studentId: number, body: updateStudentsInput['body'], context?: PomiRequestContext) => operations.updateStudents(operationInput<updateStudentsInput>({ "id": studentId, body }), context), definitions.updateStudents, operationProblemTypes.updateStudents)
            const pages = (input: Omit<listStudentsInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listStudentsOutput>(operations.listStudents(operationInput<listStudentsInput>({ ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "app", definitions.listStudents.authentication, requestPath, context)
            const listAll = async (input: Omit<listStudentsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listStudentsOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { create: createOperation, delete: deleteOperation, get: getOperation, list: listOperation, update: updateOperation, pages, listAll }
        })(),
        "tags": (() => {
            const createOperation = withMetadata((body: createTagInput['body'], context?: PomiRequestContext) => operations.createTag(operationInput<createTagInput>({ body }), context), definitions.createTag, operationProblemTypes.createTag)
            const deleteOperation = withMetadata((tagId: number, context?: PomiRequestContext) => operations.deleteTag(operationInput<deleteTagInput>({ "id": tagId }), context), definitions.deleteTag, operationProblemTypes.deleteTag)
            const getOperation = withMetadata((tagId: number, context?: PomiRequestContext) => operations.getTag(operationInput<getTagInput>({ "id": tagId }), context), definitions.getTag, operationProblemTypes.getTag)
            const listOperation = withMetadata((input: Omit<listTagsInput, never> = {}, context?: PomiRequestContext) => operations.listTags(operationInput<listTagsInput>({ ...input }), context), definitions.listTags, operationProblemTypes.listTags)
            const updateOperation = withMetadata((tagId: number, body: updateTagInput['body'], context?: PomiRequestContext) => operations.updateTag(operationInput<updateTagInput>({ "id": tagId, body }), context), definitions.updateTag, operationProblemTypes.updateTag)
            const pages = (input: Omit<listTagsInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listTagsOutput>(operations.listTags(operationInput<listTagsInput>({ ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "app", definitions.listTags.authentication, requestPath, context)
            const listAll = async (input: Omit<listTagsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listTagsOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { create: createOperation, delete: deleteOperation, get: getOperation, list: listOperation, update: updateOperation, pages, listAll }
        })(),
        "studentTagInterests": (() => {
            const deleteOperation = withMetadata((studentId: number, tagId: number, context?: PomiRequestContext) => operations.deleteStudentTagInterest(operationInput<deleteStudentTagInterestInput>({ "sid": studentId, "tagId": tagId }), context), definitions.deleteStudentTagInterest, operationProblemTypes.deleteStudentTagInterest)
            const listOperation = withMetadata((studentId: number, input: Omit<listStudentTagInterestsInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentTagInterests(operationInput<listStudentTagInterestsInput>({ "sid": studentId, ...input }), context), definitions.listStudentTagInterests, operationProblemTypes.listStudentTagInterests)
            const updateOperation = withMetadata((studentId: number, tagId: number, context?: PomiRequestContext) => operations.updateStudentTagInterest(operationInput<updateStudentTagInterestInput>({ "sid": studentId, "tagId": tagId }), context), definitions.updateStudentTagInterest, operationProblemTypes.updateStudentTagInterest)
            const pages = (studentId: number, input: Omit<listStudentTagInterestsInput, "sid"> = {}, context?: PomiRequestContext) => paginateByLink<listStudentTagInterestsOutput>(operations.listStudentTagInterests(operationInput<listStudentTagInterestsInput>({ "sid": studentId, ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "app", definitions.listStudentTagInterests.authentication, requestPath, context)
            const listAll = async (studentId: number, input: Omit<listStudentTagInterestsInput, "sid"> = {}, context?: PomiRequestContext) => { const items: Array<listStudentTagInterestsOutput['data'][number]> = []; for await (const page of pages(studentId, input, context)) items.push(...page.data); return items }
            return { delete: deleteOperation, list: listOperation, update: updateOperation, pages, listAll }
        })(),
        "currentUser": (() => {
            const getOperation = withMetadata((context?: PomiRequestContext) => operations.getCurrentUser(operationInput<getCurrentUserInput>({}), context), definitions.getCurrentUser, operationProblemTypes.getCurrentUser)
            return { get: getOperation }
        })(),
        "exchangeNoticeSubscriptions": (() => {
            const getOperation = withMetadata((studentId: number, context?: PomiRequestContext) => operations.getExchangeNoticeSubscription(operationInput<getExchangeNoticeSubscriptionInput>({ "sid": studentId }), context), definitions.getExchangeNoticeSubscription, operationProblemTypes.getExchangeNoticeSubscription)
            const unsubscribeOperation = withMetadata((input: Omit<unsubscribeExchangeNoticesInput, never>, context?: PomiRequestContext) => operations.unsubscribeExchangeNotices(operationInput<unsubscribeExchangeNoticesInput>({ ...input }), context), definitions.unsubscribeExchangeNotices, operationProblemTypes.unsubscribeExchangeNotices)
            const updateOperation = withMetadata((studentId: number, body: updateExchangeNoticeSubscriptionInput['body'], context?: PomiRequestContext) => operations.updateExchangeNoticeSubscription(operationInput<updateExchangeNoticeSubscriptionInput>({ "sid": studentId, body }), context), definitions.updateExchangeNoticeSubscription, operationProblemTypes.updateExchangeNoticeSubscription)
            return { get: getOperation, unsubscribe: unsubscribeOperation, update: updateOperation }
        })(),
        "professorEvaluations": (() => {
            const getOperation = withMetadata((studentId: number, classId: number, professorId: number, context?: PomiRequestContext) => operations.getProfessorEvaluation(operationInput<getProfessorEvaluationInput>({ "sid": studentId, "classId": classId, "professorId": professorId }), context), definitions.getProfessorEvaluation, operationProblemTypes.getProfessorEvaluation)
            const listPendingOperation = withMetadata((studentId: number, input: Omit<listPendingProfessorEvaluationsInput, "sid">, context?: PomiRequestContext) => operations.listPendingProfessorEvaluations(operationInput<listPendingProfessorEvaluationsInput>({ "sid": studentId, ...input }), context), definitions.listPendingProfessorEvaluations, operationProblemTypes.listPendingProfessorEvaluations)
            const updateOperation = withMetadata((studentId: number, classId: number, professorId: number, body: updateProfessorEvaluationInput['body'], context?: PomiRequestContext) => operations.updateProfessorEvaluation(operationInput<updateProfessorEvaluationInput>({ "sid": studentId, "classId": classId, "professorId": professorId, body }), context), definitions.updateProfessorEvaluation, operationProblemTypes.updateProfessorEvaluation)
            const pages = (studentId: number, input: Omit<listPendingProfessorEvaluationsInput, "sid">, context?: PomiRequestContext) => paginateByLink<listPendingProfessorEvaluationsOutput>(operations.listPendingProfessorEvaluations(operationInput<listPendingProfessorEvaluationsInput>({ "sid": studentId, ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "app", definitions.listPendingProfessorEvaluations.authentication, requestPath, context)
            const listAll = async (studentId: number, input: Omit<listPendingProfessorEvaluationsInput, "sid">, context?: PomiRequestContext) => { const items: Array<listPendingProfessorEvaluationsOutput['data'][number]> = []; for await (const page of pages(studentId, input, context)) items.push(...page.data); return items }
            return { get: getOperation, listPending: listPendingOperation, update: updateOperation, pages, listAll }
        })(),
        "sharedPeriodPlannings": (() => {
            const getPublicOperation = withMetadata((shareId: string, context?: PomiRequestContext) => operations.getPublicSharedPeriodPlanning(operationInput<getPublicSharedPeriodPlanningInput>({ "shareId": shareId }), context), definitions.getPublicSharedPeriodPlanning, operationProblemTypes.getPublicSharedPeriodPlanning)
            const getForStudentOperation = withMetadata((studentId: number, shareId: string, context?: PomiRequestContext) => operations.getStudentSharedPeriodPlanning(operationInput<getStudentSharedPeriodPlanningInput>({ "sid": studentId, "shareId": shareId }), context), definitions.getStudentSharedPeriodPlanning, operationProblemTypes.getStudentSharedPeriodPlanning)
            const listOperation = withMetadata((input: Omit<listPublicSharedPeriodPlanningsInput, never> = {}, context?: PomiRequestContext) => operations.listPublicSharedPeriodPlannings(operationInput<listPublicSharedPeriodPlanningsInput>({ ...input }), context), definitions.listPublicSharedPeriodPlannings, operationProblemTypes.listPublicSharedPeriodPlannings)
            const pages = (input: Omit<listPublicSharedPeriodPlanningsInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listPublicSharedPeriodPlanningsOutput>(operations.listPublicSharedPeriodPlannings(operationInput<listPublicSharedPeriodPlanningsInput>({ ...{ ...input, page: input.page ?? 1, pageSize: input.pageSize ?? 20 } }), context), "app", definitions.listPublicSharedPeriodPlannings.authentication, requestPath, context)
            const listAll = async (input: Omit<listPublicSharedPeriodPlanningsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listPublicSharedPeriodPlanningsOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { getPublic: getPublicOperation, getForStudent: getForStudentOperation, list: listOperation, pages, listAll }
        })(),
        "botGrants": (() => {
            const listOperation = withMetadata((input: Omit<listBotGrantsInput, never> = {}, context?: PomiRequestContext) => operations.listBotGrants(operationInput<listBotGrantsInput>({ ...input }), context), definitions.listBotGrants, operationProblemTypes.listBotGrants)
            const replaceOperation = withMetadata((botAuthUserId: number, body: replaceBotGrantInput['body'], context?: PomiRequestContext) => operations.replaceBotGrant(operationInput<replaceBotGrantInput>({ "botAuthUserId": botAuthUserId, body }), context), definitions.replaceBotGrant, operationProblemTypes.replaceBotGrant)
            const pages = (input: Omit<listBotGrantsInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listBotGrantsOutput>(operations.listBotGrants(operationInput<listBotGrantsInput>({ ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "app", definitions.listBotGrants.authentication, requestPath, context)
            const listAll = async (input: Omit<listBotGrantsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listBotGrantsOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { list: listOperation, replace: replaceOperation, pages, listAll }
        })(),
        "bots": (() => {
            const listOperation = withMetadata((input: Omit<listBotsInput, never> = {}, context?: PomiRequestContext) => operations.listBots(operationInput<listBotsInput>({ ...input }), context), definitions.listBots, operationProblemTypes.listBots)
            const pages = (input: Omit<listBotsInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listBotsOutput>(operations.listBots(operationInput<listBotsInput>({ ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "app", definitions.listBots.authentication, requestPath, context)
            const listAll = async (input: Omit<listBotsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listBotsOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { list: listOperation, pages, listAll }
        })(),
        "studentPeople": (() => {
            const listOperation = withMetadata((studentId: number, input: Omit<listStudentPeopleInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentPeople(operationInput<listStudentPeopleInput>({ "sid": studentId, ...input }), context), definitions.listStudentPeople, operationProblemTypes.listStudentPeople)
            const pages = (studentId: number, input: Omit<listStudentPeopleInput, "sid"> = {}, context?: PomiRequestContext) => paginateByLink<listStudentPeopleOutput>(operations.listStudentPeople(operationInput<listStudentPeopleInput>({ "sid": studentId, ...{ ...input, page: input.page ?? 1, pageSize: input.pageSize ?? 20 } }), context), "app", definitions.listStudentPeople.authentication, requestPath, context)
            const listAll = async (studentId: number, input: Omit<listStudentPeopleInput, "sid"> = {}, context?: PomiRequestContext) => { const items: Array<listStudentPeopleOutput['data'][number]> = []; for await (const page of pages(studentId, input, context)) items.push(...page.data); return items }
            return { list: listOperation, pages, listAll }
        })(),
        "studentSharedPeriodPlannings": (() => {
            const listOperation = withMetadata((studentId: number, input: Omit<listStudentSharedPeriodPlanningsInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentSharedPeriodPlannings(operationInput<listStudentSharedPeriodPlanningsInput>({ "sid": studentId, ...input }), context), definitions.listStudentSharedPeriodPlannings, operationProblemTypes.listStudentSharedPeriodPlannings)
            const pages = (studentId: number, input: Omit<listStudentSharedPeriodPlanningsInput, "sid"> = {}, context?: PomiRequestContext) => paginateByLink<listStudentSharedPeriodPlanningsOutput>(operations.listStudentSharedPeriodPlannings(operationInput<listStudentSharedPeriodPlanningsInput>({ "sid": studentId, ...{ ...input, page: input.page ?? 1, pageSize: input.pageSize ?? 20 } }), context), "app", definitions.listStudentSharedPeriodPlannings.authentication, requestPath, context)
            const listAll = async (studentId: number, input: Omit<listStudentSharedPeriodPlanningsInput, "sid"> = {}, context?: PomiRequestContext) => { const items: Array<listStudentSharedPeriodPlanningsOutput['data'][number]> = []; for await (const page of pages(studentId, input, context)) items.push(...page.data); return items }
            return { list: listOperation, pages, listAll }
        })(),
    }
}

export type Resources = ReturnType<typeof bindResources>
