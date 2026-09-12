import type { PomiRequestContext } from '../../runtime/client.js'
import type { AuthenticationMode } from '../../runtime/operation.js'
import { operationDefinitions as definitions } from './operations.js'
import type { createCategoriesInput, createCategoriesOutput, createExchangeNoticeSubscriptionsUnsubscribeInput, createExchangeNoticeSubscriptionsUnsubscribeOutput, createFeedbackReportsInput, createFeedbackReportsOutput, createStudentAbsencesInput, createStudentAbsencesOutput, createStudentCourseAttemptsInput, createStudentCourseAttemptsOutput, createStudentCourseHistoryInput, createStudentCourseHistoryOutput, createStudentCurriculaInput, createStudentCurriculaOutput, createStudentFeedbackReportsInput, createStudentFeedbackReportsOutput, createStudentFriendshipsInput, createStudentFriendshipsOutput, createStudentFriendshipsAcceptInput, createStudentFriendshipsAcceptOutput, createStudentPeriodPlanInput, createStudentPeriodPlanOutput, createStudentPeriodPlanningsInput, createStudentPeriodPlanningsOutput, createStudentsInput, createStudentsOutput, createTagsInput, createTagsOutput, deleteCategoriesInput, deleteCategoriesOutput, deleteCoursesTagsInput, deleteCoursesTagsOutput, deleteStudentAbsencesInput, deleteStudentAbsencesOutput, deleteStudentCourseAttemptsInput, deleteStudentCourseAttemptsOutput, deleteStudentCurriculaInput, deleteStudentCurriculaOutput, deleteStudentFriendshipsInput, deleteStudentFriendshipsOutput, deleteStudentPeriodPlanInput, deleteStudentPeriodPlanOutput, deleteStudentPeriodPlanningsInput, deleteStudentPeriodPlanningsOutput, deleteStudentsInput, deleteStudentsOutput, deleteStudentTagInterestsInput, deleteStudentTagInterestsOutput, deleteTagsInput, deleteTagsOutput, getCategoriesInput, getCategoriesOutput, getSharedPeriodPlanningsInput, getSharedPeriodPlanningsOutput, getStudentCourseAttemptsInput, getStudentCourseAttemptsOutput, getStudentCurriculaInput, getStudentCurriculaOutput, getStudentPeopleInput, getStudentPeopleOutput, getStudentPeriodPlanInput, getStudentPeriodPlanOutput, getStudentPeriodPlanningsInput, getStudentPeriodPlanningsOutput, getStudentsInput, getStudentsOutput, getStudentSharedPeriodPlanningsInput, getStudentSharedPeriodPlanningsOutput, getTagsInput, getTagsOutput, listBotsInput, listBotsOutput, listCategoriesInput, listCategoriesOutput, listCoursesTagsInput, listCoursesTagsOutput, listMeInput, listMeOutput, listMeBotGrantsInput, listMeBotGrantsOutput, listSharedPeriodPlanningsInput, listSharedPeriodPlanningsOutput, listStudentAbsencesInput, listStudentAbsencesOutput, listStudentClassesProfessorsEvaluationInput, listStudentClassesProfessorsEvaluationOutput, listStudentCourseAttemptsInput, listStudentCourseAttemptsOutput, listStudentCurriculaInput, listStudentCurriculaOutput, listStudentExchangeNoticeSubscriptionInput, listStudentExchangeNoticeSubscriptionOutput, listStudentFeedbackReportsInput, listStudentFeedbackReportsOutput, listStudentFriendshipsInput, listStudentFriendshipsOutput, listStudentPeopleInput, listStudentPeopleOutput, listStudentPeriodPlanInput, listStudentPeriodPlanOutput, listStudentPeriodPlanningsInput, listStudentPeriodPlanningsOutput, listStudentProfessorEvaluationsPendingInput, listStudentProfessorEvaluationsPendingOutput, listStudentPublicProfileInput, listStudentPublicProfileOutput, listStudentSharedPeriodPlanningsInput, listStudentSharedPeriodPlanningsOutput, listStudentTagInterestsInput, listStudentTagInterestsOutput, listTagsInput, listTagsOutput, listTagsCoursesInput, listTagsCoursesOutput, updateCategoriesInput, updateCategoriesOutput, updateCoursesTagsInput, updateCoursesTagsOutput, updateMeBotGrantsInput, updateMeBotGrantsOutput, updateStudentClassesProfessorsEvaluationInput, updateStudentClassesProfessorsEvaluationOutput, updateStudentCourseAttemptsInput, updateStudentCourseAttemptsOutput, updateStudentCurriculaInput, updateStudentCurriculaOutput, updateStudentExchangeNoticeSubscriptionInput, updateStudentExchangeNoticeSubscriptionOutput, updateStudentPeriodPlanInput, updateStudentPeriodPlanOutput, updateStudentPeriodPlanningsInput, updateStudentPeriodPlanningsOutput, updateStudentPublicProfileInput, updateStudentPublicProfileOutput, updateStudentsInput, updateStudentsOutput, updateStudentTagInterestsInput, updateStudentTagInterestsOutput, updateTagsInput, updateTagsOutput } from './operations.js'
import { operationProblemTypes } from './problems.js'

type OperationFunction<Input, Output> = (input: Input, context?: PomiRequestContext) => Promise<Output>
type Operations = {
    createCategories: OperationFunction<createCategoriesInput, createCategoriesOutput>
    createExchangeNoticeSubscriptionsUnsubscribe: OperationFunction<createExchangeNoticeSubscriptionsUnsubscribeInput, createExchangeNoticeSubscriptionsUnsubscribeOutput>
    createFeedbackReports: OperationFunction<createFeedbackReportsInput, createFeedbackReportsOutput>
    createStudentAbsences: OperationFunction<createStudentAbsencesInput, createStudentAbsencesOutput>
    createStudentCourseAttempts: OperationFunction<createStudentCourseAttemptsInput, createStudentCourseAttemptsOutput>
    createStudentCourseHistory: OperationFunction<createStudentCourseHistoryInput, createStudentCourseHistoryOutput>
    createStudentCurricula: OperationFunction<createStudentCurriculaInput, createStudentCurriculaOutput>
    createStudentFeedbackReports: OperationFunction<createStudentFeedbackReportsInput, createStudentFeedbackReportsOutput>
    createStudentFriendships: OperationFunction<createStudentFriendshipsInput, createStudentFriendshipsOutput>
    createStudentFriendshipsAccept: OperationFunction<createStudentFriendshipsAcceptInput, createStudentFriendshipsAcceptOutput>
    createStudentPeriodPlan: OperationFunction<createStudentPeriodPlanInput, createStudentPeriodPlanOutput>
    createStudentPeriodPlannings: OperationFunction<createStudentPeriodPlanningsInput, createStudentPeriodPlanningsOutput>
    createStudents: OperationFunction<createStudentsInput, createStudentsOutput>
    createTags: OperationFunction<createTagsInput, createTagsOutput>
    deleteCategories: OperationFunction<deleteCategoriesInput, deleteCategoriesOutput>
    deleteCoursesTags: OperationFunction<deleteCoursesTagsInput, deleteCoursesTagsOutput>
    deleteStudentAbsences: OperationFunction<deleteStudentAbsencesInput, deleteStudentAbsencesOutput>
    deleteStudentCourseAttempts: OperationFunction<deleteStudentCourseAttemptsInput, deleteStudentCourseAttemptsOutput>
    deleteStudentCurricula: OperationFunction<deleteStudentCurriculaInput, deleteStudentCurriculaOutput>
    deleteStudentFriendships: OperationFunction<deleteStudentFriendshipsInput, deleteStudentFriendshipsOutput>
    deleteStudentPeriodPlan: OperationFunction<deleteStudentPeriodPlanInput, deleteStudentPeriodPlanOutput>
    deleteStudentPeriodPlannings: OperationFunction<deleteStudentPeriodPlanningsInput, deleteStudentPeriodPlanningsOutput>
    deleteStudents: OperationFunction<deleteStudentsInput, deleteStudentsOutput>
    deleteStudentTagInterests: OperationFunction<deleteStudentTagInterestsInput, deleteStudentTagInterestsOutput>
    deleteTags: OperationFunction<deleteTagsInput, deleteTagsOutput>
    getCategories: OperationFunction<getCategoriesInput, getCategoriesOutput>
    getSharedPeriodPlannings: OperationFunction<getSharedPeriodPlanningsInput, getSharedPeriodPlanningsOutput>
    getStudentCourseAttempts: OperationFunction<getStudentCourseAttemptsInput, getStudentCourseAttemptsOutput>
    getStudentCurricula: OperationFunction<getStudentCurriculaInput, getStudentCurriculaOutput>
    getStudentPeople: OperationFunction<getStudentPeopleInput, getStudentPeopleOutput>
    getStudentPeriodPlan: OperationFunction<getStudentPeriodPlanInput, getStudentPeriodPlanOutput>
    getStudentPeriodPlannings: OperationFunction<getStudentPeriodPlanningsInput, getStudentPeriodPlanningsOutput>
    getStudents: OperationFunction<getStudentsInput, getStudentsOutput>
    getStudentSharedPeriodPlannings: OperationFunction<getStudentSharedPeriodPlanningsInput, getStudentSharedPeriodPlanningsOutput>
    getTags: OperationFunction<getTagsInput, getTagsOutput>
    listBots: OperationFunction<listBotsInput, listBotsOutput>
    listCategories: OperationFunction<listCategoriesInput, listCategoriesOutput>
    listCoursesTags: OperationFunction<listCoursesTagsInput, listCoursesTagsOutput>
    listMe: OperationFunction<listMeInput, listMeOutput>
    listMeBotGrants: OperationFunction<listMeBotGrantsInput, listMeBotGrantsOutput>
    listSharedPeriodPlannings: OperationFunction<listSharedPeriodPlanningsInput, listSharedPeriodPlanningsOutput>
    listStudentAbsences: OperationFunction<listStudentAbsencesInput, listStudentAbsencesOutput>
    listStudentClassesProfessorsEvaluation: OperationFunction<listStudentClassesProfessorsEvaluationInput, listStudentClassesProfessorsEvaluationOutput>
    listStudentCourseAttempts: OperationFunction<listStudentCourseAttemptsInput, listStudentCourseAttemptsOutput>
    listStudentCurricula: OperationFunction<listStudentCurriculaInput, listStudentCurriculaOutput>
    listStudentExchangeNoticeSubscription: OperationFunction<listStudentExchangeNoticeSubscriptionInput, listStudentExchangeNoticeSubscriptionOutput>
    listStudentFeedbackReports: OperationFunction<listStudentFeedbackReportsInput, listStudentFeedbackReportsOutput>
    listStudentFriendships: OperationFunction<listStudentFriendshipsInput, listStudentFriendshipsOutput>
    listStudentPeople: OperationFunction<listStudentPeopleInput, listStudentPeopleOutput>
    listStudentPeriodPlan: OperationFunction<listStudentPeriodPlanInput, listStudentPeriodPlanOutput>
    listStudentPeriodPlannings: OperationFunction<listStudentPeriodPlanningsInput, listStudentPeriodPlanningsOutput>
    listStudentProfessorEvaluationsPending: OperationFunction<listStudentProfessorEvaluationsPendingInput, listStudentProfessorEvaluationsPendingOutput>
    listStudentPublicProfile: OperationFunction<listStudentPublicProfileInput, listStudentPublicProfileOutput>
    listStudentSharedPeriodPlannings: OperationFunction<listStudentSharedPeriodPlanningsInput, listStudentSharedPeriodPlanningsOutput>
    listStudentTagInterests: OperationFunction<listStudentTagInterestsInput, listStudentTagInterestsOutput>
    listTags: OperationFunction<listTagsInput, listTagsOutput>
    listTagsCourses: OperationFunction<listTagsCoursesInput, listTagsCoursesOutput>
    updateCategories: OperationFunction<updateCategoriesInput, updateCategoriesOutput>
    updateCoursesTags: OperationFunction<updateCoursesTagsInput, updateCoursesTagsOutput>
    updateMeBotGrants: OperationFunction<updateMeBotGrantsInput, updateMeBotGrantsOutput>
    updateStudentClassesProfessorsEvaluation: OperationFunction<updateStudentClassesProfessorsEvaluationInput, updateStudentClassesProfessorsEvaluationOutput>
    updateStudentCourseAttempts: OperationFunction<updateStudentCourseAttemptsInput, updateStudentCourseAttemptsOutput>
    updateStudentCurricula: OperationFunction<updateStudentCurriculaInput, updateStudentCurriculaOutput>
    updateStudentExchangeNoticeSubscription: OperationFunction<updateStudentExchangeNoticeSubscriptionInput, updateStudentExchangeNoticeSubscriptionOutput>
    updateStudentPeriodPlan: OperationFunction<updateStudentPeriodPlanInput, updateStudentPeriodPlanOutput>
    updateStudentPeriodPlannings: OperationFunction<updateStudentPeriodPlanningsInput, updateStudentPeriodPlanningsOutput>
    updateStudentPublicProfile: OperationFunction<updateStudentPublicProfileInput, updateStudentPublicProfileOutput>
    updateStudents: OperationFunction<updateStudentsInput, updateStudentsOutput>
    updateStudentTagInterests: OperationFunction<updateStudentTagInterestsInput, updateStudentTagInterestsOutput>
    updateTags: OperationFunction<updateTagsInput, updateTagsOutput>
}
type RequestPath = <T>(target: "app", path: string, authentication?: AuthenticationMode, context?: PomiRequestContext) => Promise<T>

function withMetadata<FunctionType extends (...args: any[]) => unknown, Definition, Problems>(fn: FunctionType, meta: Definition, problemTypes: Problems) {
    return Object.assign(fn, { meta, problemTypes })
}

function operationInput<Input>(input: Input): Input {
    return input
}

function valueAtPath(value: unknown, path: string) {
    return path.split('.').reduce<unknown>((current, key) => typeof current === 'object' && current !== null ? (current as Record<string, unknown>)[key] : undefined, value)
}

async function* paginateByLink<Page>(firstPage: Promise<Page>, target: "app", authentication: AuthenticationMode, nextField: string, requestPath: RequestPath, context?: PomiRequestContext): AsyncIterable<Page> {
    let page = await firstPage
    yield page
    let next = valueAtPath(page, nextField)
    while (typeof next === 'string' && next.length > 0) {
        page = await requestPath<Page>(target, next, authentication, context)
        yield page
        next = valueAtPath(page, nextField)
    }
}


async function* paginateByPage<Page>(requestPage: (page: number) => Promise<Page>, initialPage: number, pageField: string, pageSizeField: string, totalField: string): AsyncIterable<Page> {
    let pageNumber = initialPage
    while (true) {
        const page = await requestPage(pageNumber)
        yield page
        const currentPage = valueAtPath(page, pageField)
        const pageSize = valueAtPath(page, pageSizeField)
        const total = valueAtPath(page, totalField)
        if (typeof currentPage !== 'number' || typeof pageSize !== 'number' || typeof total !== 'number' || currentPage * pageSize >= total) return
        pageNumber = currentPage + 1
    }
}



export function bindResources(operations: Operations, requestPath: RequestPath) {

    return {
        "categories": (() => {
            const createOperation = withMetadata((body: createCategoriesInput['body'], context?: PomiRequestContext) => operations.createCategories(operationInput<createCategoriesInput>({ body }), context), definitions.createCategories, operationProblemTypes.createCategories)
            const deleteOperation = withMetadata((categoryId: number, context?: PomiRequestContext) => operations.deleteCategories(operationInput<deleteCategoriesInput>({ "id": categoryId }), context), definitions.deleteCategories, operationProblemTypes.deleteCategories)
            const getOperation = withMetadata((categoryId: number, context?: PomiRequestContext) => operations.getCategories(operationInput<getCategoriesInput>({ "id": categoryId }), context), definitions.getCategories, operationProblemTypes.getCategories)
            const listOperation = withMetadata((input: Omit<listCategoriesInput, never> = {}, context?: PomiRequestContext) => operations.listCategories(operationInput<listCategoriesInput>({ ...input }), context), definitions.listCategories, operationProblemTypes.listCategories)
            const updateOperation = withMetadata((categoryId: number, body: updateCategoriesInput['body'], context?: PomiRequestContext) => operations.updateCategories(operationInput<updateCategoriesInput>({ "id": categoryId, body }), context), definitions.updateCategories, operationProblemTypes.updateCategories)
            return { create: createOperation, delete: deleteOperation, get: getOperation, list: listOperation, update: updateOperation }
        })(),
        "exchangeNoticeSubscriptionsUnsubscribe": (() => {
            const createOperation = withMetadata((input: Omit<createExchangeNoticeSubscriptionsUnsubscribeInput, never>, context?: PomiRequestContext) => operations.createExchangeNoticeSubscriptionsUnsubscribe(operationInput<createExchangeNoticeSubscriptionsUnsubscribeInput>({ ...input }), context), definitions.createExchangeNoticeSubscriptionsUnsubscribe, operationProblemTypes.createExchangeNoticeSubscriptionsUnsubscribe)
            return { create: createOperation }
        })(),
        "feedbackReports": (() => {
            const createOperation = withMetadata((body: createFeedbackReportsInput['body'], context?: PomiRequestContext) => operations.createFeedbackReports(operationInput<createFeedbackReportsInput>({ body }), context), definitions.createFeedbackReports, operationProblemTypes.createFeedbackReports)
            return { create: createOperation }
        })(),
        "studentAbsences": (() => {
            const createOperation = withMetadata((studentId: number, body: createStudentAbsencesInput['body'], context?: PomiRequestContext) => operations.createStudentAbsences(operationInput<createStudentAbsencesInput>({ "sid": studentId, body }), context), definitions.createStudentAbsences, operationProblemTypes.createStudentAbsences)
            const deleteOperation = withMetadata((studentId: number, studentAbsenceId: number, context?: PomiRequestContext) => operations.deleteStudentAbsences(operationInput<deleteStudentAbsencesInput>({ "sid": studentId, "id": studentAbsenceId }), context), definitions.deleteStudentAbsences, operationProblemTypes.deleteStudentAbsences)
            const listOperation = withMetadata((studentId: number, input: Omit<listStudentAbsencesInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentAbsences(operationInput<listStudentAbsencesInput>({ "sid": studentId, ...input }), context), definitions.listStudentAbsences, operationProblemTypes.listStudentAbsences)
            return { create: createOperation, delete: deleteOperation, list: listOperation }
        })(),
        "courseAttempts": (() => {
            const createOperation = withMetadata((studentId: number, body: createStudentCourseAttemptsInput['body'], context?: PomiRequestContext) => operations.createStudentCourseAttempts(operationInput<createStudentCourseAttemptsInput>({ "sid": studentId, body }), context), definitions.createStudentCourseAttempts, operationProblemTypes.createStudentCourseAttempts)
            const deleteOperation = withMetadata((studentId: number, courseAttemptId: number, context?: PomiRequestContext) => operations.deleteStudentCourseAttempts(operationInput<deleteStudentCourseAttemptsInput>({ "sid": studentId, "id": courseAttemptId }), context), definitions.deleteStudentCourseAttempts, operationProblemTypes.deleteStudentCourseAttempts)
            const getOperation = withMetadata((studentId: number, courseAttemptId: number, context?: PomiRequestContext) => operations.getStudentCourseAttempts(operationInput<getStudentCourseAttemptsInput>({ "sid": studentId, "id": courseAttemptId }), context), definitions.getStudentCourseAttempts, operationProblemTypes.getStudentCourseAttempts)
            const listOperation = withMetadata((studentId: number, input: Omit<listStudentCourseAttemptsInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentCourseAttempts(operationInput<listStudentCourseAttemptsInput>({ "sid": studentId, ...input }), context), definitions.listStudentCourseAttempts, operationProblemTypes.listStudentCourseAttempts)
            const updateOperation = withMetadata((studentId: number, courseAttemptId: number, body: updateStudentCourseAttemptsInput['body'], context?: PomiRequestContext) => operations.updateStudentCourseAttempts(operationInput<updateStudentCourseAttemptsInput>({ "sid": studentId, "id": courseAttemptId, body }), context), definitions.updateStudentCourseAttempts, operationProblemTypes.updateStudentCourseAttempts)
            return { create: createOperation, delete: deleteOperation, get: getOperation, list: listOperation, update: updateOperation }
        })(),
        "studentCourseHistory": (() => {
            const createOperation = withMetadata((studentId: number, body: createStudentCourseHistoryInput['body'], context?: PomiRequestContext) => operations.createStudentCourseHistory(operationInput<createStudentCourseHistoryInput>({ "sid": studentId, body }), context), definitions.createStudentCourseHistory, operationProblemTypes.createStudentCourseHistory)
            return { create: createOperation }
        })(),
        "studentCurricula": (() => {
            const createOperation = withMetadata((studentId: number, body: createStudentCurriculaInput['body'], context?: PomiRequestContext) => operations.createStudentCurricula(operationInput<createStudentCurriculaInput>({ "sid": studentId, body }), context), definitions.createStudentCurricula, operationProblemTypes.createStudentCurricula)
            const deleteOperation = withMetadata((studentId: number, studentCurriculaId: number, context?: PomiRequestContext) => operations.deleteStudentCurricula(operationInput<deleteStudentCurriculaInput>({ "sid": studentId, "id": studentCurriculaId }), context), definitions.deleteStudentCurricula, operationProblemTypes.deleteStudentCurricula)
            const getOperation = withMetadata((studentId: number, studentCurriculaId: number, context?: PomiRequestContext) => operations.getStudentCurricula(operationInput<getStudentCurriculaInput>({ "sid": studentId, "id": studentCurriculaId }), context), definitions.getStudentCurricula, operationProblemTypes.getStudentCurricula)
            const listOperation = withMetadata((studentId: number, input: Omit<listStudentCurriculaInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentCurricula(operationInput<listStudentCurriculaInput>({ "sid": studentId, ...input }), context), definitions.listStudentCurricula, operationProblemTypes.listStudentCurricula)
            const updateOperation = withMetadata((studentId: number, studentCurriculaId: number, body: updateStudentCurriculaInput['body'], context?: PomiRequestContext) => operations.updateStudentCurricula(operationInput<updateStudentCurriculaInput>({ "sid": studentId, "id": studentCurriculaId, body }), context), definitions.updateStudentCurricula, operationProblemTypes.updateStudentCurricula)
            return { create: createOperation, delete: deleteOperation, get: getOperation, list: listOperation, update: updateOperation }
        })(),
        "studentFeedbackReports": (() => {
            const createOperation = withMetadata((studentId: number, body: createStudentFeedbackReportsInput['body'], context?: PomiRequestContext) => operations.createStudentFeedbackReports(operationInput<createStudentFeedbackReportsInput>({ "sid": studentId, body }), context), definitions.createStudentFeedbackReports, operationProblemTypes.createStudentFeedbackReports)
            const listOperation = withMetadata((studentId: number, input: Omit<listStudentFeedbackReportsInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentFeedbackReports(operationInput<listStudentFeedbackReportsInput>({ "sid": studentId, ...input }), context), definitions.listStudentFeedbackReports, operationProblemTypes.listStudentFeedbackReports)
            return { create: createOperation, list: listOperation }
        })(),
        "studentFriendships": (() => {
            const createOperation = withMetadata((studentId: number, body: createStudentFriendshipsInput['body'], context?: PomiRequestContext) => operations.createStudentFriendships(operationInput<createStudentFriendshipsInput>({ "sid": studentId, body }), context), definitions.createStudentFriendships, operationProblemTypes.createStudentFriendships)
            const deleteOperation = withMetadata((studentId: number, studentFriendshipId: number, context?: PomiRequestContext) => operations.deleteStudentFriendships(operationInput<deleteStudentFriendshipsInput>({ "sid": studentId, "id": studentFriendshipId }), context), definitions.deleteStudentFriendships, operationProblemTypes.deleteStudentFriendships)
            const listOperation = withMetadata((studentId: number, input: Omit<listStudentFriendshipsInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentFriendships(operationInput<listStudentFriendshipsInput>({ "sid": studentId, ...input }), context), definitions.listStudentFriendships, operationProblemTypes.listStudentFriendships)
            return { create: createOperation, delete: deleteOperation, list: listOperation }
        })(),
        "studentFriendshipsAccept": (() => {
            const createOperation = withMetadata((studentId: number, studentFriendshipsAcceptId: number, context?: PomiRequestContext) => operations.createStudentFriendshipsAccept(operationInput<createStudentFriendshipsAcceptInput>({ "sid": studentId, "id": studentFriendshipsAcceptId }), context), definitions.createStudentFriendshipsAccept, operationProblemTypes.createStudentFriendshipsAccept)
            return { create: createOperation }
        })(),
        "studentPeriodPlan": (() => {
            const createOperation = withMetadata((studentId: number, body: createStudentPeriodPlanInput['body'], context?: PomiRequestContext) => operations.createStudentPeriodPlan(operationInput<createStudentPeriodPlanInput>({ "sid": studentId, body }), context), definitions.createStudentPeriodPlan, operationProblemTypes.createStudentPeriodPlan)
            const deleteOperation = withMetadata((studentId: number, studentPeriodPlanId: number, context?: PomiRequestContext) => operations.deleteStudentPeriodPlan(operationInput<deleteStudentPeriodPlanInput>({ "sid": studentId, "id": studentPeriodPlanId }), context), definitions.deleteStudentPeriodPlan, operationProblemTypes.deleteStudentPeriodPlan)
            const getOperation = withMetadata((studentId: number, studentPeriodPlanId: number, context?: PomiRequestContext) => operations.getStudentPeriodPlan(operationInput<getStudentPeriodPlanInput>({ "sid": studentId, "id": studentPeriodPlanId }), context), definitions.getStudentPeriodPlan, operationProblemTypes.getStudentPeriodPlan)
            const listOperation = withMetadata((studentId: number, input: Omit<listStudentPeriodPlanInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentPeriodPlan(operationInput<listStudentPeriodPlanInput>({ "sid": studentId, ...input }), context), definitions.listStudentPeriodPlan, operationProblemTypes.listStudentPeriodPlan)
            const updateOperation = withMetadata((studentId: number, studentPeriodPlanId: number, body: updateStudentPeriodPlanInput['body'], context?: PomiRequestContext) => operations.updateStudentPeriodPlan(operationInput<updateStudentPeriodPlanInput>({ "sid": studentId, "id": studentPeriodPlanId, body }), context), definitions.updateStudentPeriodPlan, operationProblemTypes.updateStudentPeriodPlan)
            return { create: createOperation, delete: deleteOperation, get: getOperation, list: listOperation, update: updateOperation }
        })(),
        "periodPlannings": (() => {
            const createOperation = withMetadata((studentId: number, body: createStudentPeriodPlanningsInput['body'], context?: PomiRequestContext) => operations.createStudentPeriodPlannings(operationInput<createStudentPeriodPlanningsInput>({ "sid": studentId, body }), context), definitions.createStudentPeriodPlannings, operationProblemTypes.createStudentPeriodPlannings)
            const deleteOperation = withMetadata((studentId: number, periodPlanningId: number, context?: PomiRequestContext) => operations.deleteStudentPeriodPlannings(operationInput<deleteStudentPeriodPlanningsInput>({ "sid": studentId, "id": periodPlanningId }), context), definitions.deleteStudentPeriodPlannings, operationProblemTypes.deleteStudentPeriodPlannings)
            const getOperation = withMetadata((studentId: number, periodPlanningId: number, context?: PomiRequestContext) => operations.getStudentPeriodPlannings(operationInput<getStudentPeriodPlanningsInput>({ "sid": studentId, "id": periodPlanningId }), context), definitions.getStudentPeriodPlannings, operationProblemTypes.getStudentPeriodPlannings)
            const listOperation = withMetadata((studentId: number, input: Omit<listStudentPeriodPlanningsInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentPeriodPlannings(operationInput<listStudentPeriodPlanningsInput>({ "sid": studentId, ...input }), context), definitions.listStudentPeriodPlannings, operationProblemTypes.listStudentPeriodPlannings)
            const updateOperation = withMetadata((studentId: number, periodPlanningId: number, body: updateStudentPeriodPlanningsInput['body'], context?: PomiRequestContext) => operations.updateStudentPeriodPlannings(operationInput<updateStudentPeriodPlanningsInput>({ "sid": studentId, "id": periodPlanningId, body }), context), definitions.updateStudentPeriodPlannings, operationProblemTypes.updateStudentPeriodPlannings)
            return { create: createOperation, delete: deleteOperation, get: getOperation, list: listOperation, update: updateOperation }
        })(),
        "students": (() => {
            const createOperation = withMetadata((body: createStudentsInput['body'], context?: PomiRequestContext) => operations.createStudents(operationInput<createStudentsInput>({ body }), context), definitions.createStudents, operationProblemTypes.createStudents)
            const deleteOperation = withMetadata((studentId: number, body: deleteStudentsInput['body'], context?: PomiRequestContext) => operations.deleteStudents(operationInput<deleteStudentsInput>({ "id": studentId, body }), context), definitions.deleteStudents, operationProblemTypes.deleteStudents)
            const getOperation = withMetadata((studentId: number, context?: PomiRequestContext) => operations.getStudents(operationInput<getStudentsInput>({ "id": studentId }), context), definitions.getStudents, operationProblemTypes.getStudents)
            const updateOperation = withMetadata((studentId: number, body: updateStudentsInput['body'], context?: PomiRequestContext) => operations.updateStudents(operationInput<updateStudentsInput>({ "id": studentId, body }), context), definitions.updateStudents, operationProblemTypes.updateStudents)
            return { create: createOperation, delete: deleteOperation, get: getOperation, update: updateOperation }
        })(),
        "tags": (() => {
            const createOperation = withMetadata((body: createTagsInput['body'], context?: PomiRequestContext) => operations.createTags(operationInput<createTagsInput>({ body }), context), definitions.createTags, operationProblemTypes.createTags)
            const deleteOperation = withMetadata((tagId: number, context?: PomiRequestContext) => operations.deleteTags(operationInput<deleteTagsInput>({ "id": tagId }), context), definitions.deleteTags, operationProblemTypes.deleteTags)
            const getOperation = withMetadata((tagId: number, context?: PomiRequestContext) => operations.getTags(operationInput<getTagsInput>({ "id": tagId }), context), definitions.getTags, operationProblemTypes.getTags)
            const listOperation = withMetadata((input: Omit<listTagsInput, never> = {}, context?: PomiRequestContext) => operations.listTags(operationInput<listTagsInput>({ ...input }), context), definitions.listTags, operationProblemTypes.listTags)
            const updateOperation = withMetadata((tagId: number, body: updateTagsInput['body'], context?: PomiRequestContext) => operations.updateTags(operationInput<updateTagsInput>({ "id": tagId, body }), context), definitions.updateTags, operationProblemTypes.updateTags)
            return { create: createOperation, delete: deleteOperation, get: getOperation, list: listOperation, update: updateOperation }
        })(),
        "coursesTags": (() => {
            const deleteOperation = withMetadata((courseId: number, tagId: number, context?: PomiRequestContext) => operations.deleteCoursesTags(operationInput<deleteCoursesTagsInput>({ "courseId": courseId, "tagId": tagId }), context), definitions.deleteCoursesTags, operationProblemTypes.deleteCoursesTags)
            const listOperation = withMetadata((courseId: number, input: Omit<listCoursesTagsInput, "courseId"> = {}, context?: PomiRequestContext) => operations.listCoursesTags(operationInput<listCoursesTagsInput>({ "courseId": courseId, ...input }), context), definitions.listCoursesTags, operationProblemTypes.listCoursesTags)
            const updateOperation = withMetadata((courseId: number, tagId: number, context?: PomiRequestContext) => operations.updateCoursesTags(operationInput<updateCoursesTagsInput>({ "courseId": courseId, "tagId": tagId }), context), definitions.updateCoursesTags, operationProblemTypes.updateCoursesTags)
            return { delete: deleteOperation, list: listOperation, update: updateOperation }
        })(),
        "studentTagInterests": (() => {
            const deleteOperation = withMetadata((studentId: number, tagId: number, context?: PomiRequestContext) => operations.deleteStudentTagInterests(operationInput<deleteStudentTagInterestsInput>({ "sid": studentId, "tagId": tagId }), context), definitions.deleteStudentTagInterests, operationProblemTypes.deleteStudentTagInterests)
            const listOperation = withMetadata((studentId: number, input: Omit<listStudentTagInterestsInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentTagInterests(operationInput<listStudentTagInterestsInput>({ "sid": studentId, ...input }), context), definitions.listStudentTagInterests, operationProblemTypes.listStudentTagInterests)
            const updateOperation = withMetadata((studentId: number, tagId: number, context?: PomiRequestContext) => operations.updateStudentTagInterests(operationInput<updateStudentTagInterestsInput>({ "sid": studentId, "tagId": tagId }), context), definitions.updateStudentTagInterests, operationProblemTypes.updateStudentTagInterests)
            return { delete: deleteOperation, list: listOperation, update: updateOperation }
        })(),
        "sharedPeriodPlannings": (() => {
            const getOperation = withMetadata((shareId: string, context?: PomiRequestContext) => operations.getSharedPeriodPlannings(operationInput<getSharedPeriodPlanningsInput>({ "shareId": shareId }), context), definitions.getSharedPeriodPlannings, operationProblemTypes.getSharedPeriodPlannings)
            const listOperation = withMetadata((input: Omit<listSharedPeriodPlanningsInput, never> = {}, context?: PomiRequestContext) => operations.listSharedPeriodPlannings(operationInput<listSharedPeriodPlanningsInput>({ ...input }), context), definitions.listSharedPeriodPlannings, operationProblemTypes.listSharedPeriodPlannings)
            const pages = (input: Omit<listSharedPeriodPlanningsInput, never> = {}, context?: PomiRequestContext) => paginateByPage<listSharedPeriodPlanningsOutput>((page) => operations.listSharedPeriodPlannings(operationInput<listSharedPeriodPlanningsInput>({ ...{ ...{ ...input, "page": input["page"] ?? 1, "pageSize": input["pageSize"] ?? 20 }, "page": page } }), context), { ...input, "page": input["page"] ?? 1, "pageSize": input["pageSize"] ?? 20 }["page"], "page", "pageSize", "total")
            const listAll = async (input: Omit<listSharedPeriodPlanningsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listSharedPeriodPlanningsOutput["items"][number]> = []; for await (const page of pages(input, context)) items.push(...page["items"]); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "studentPeople": (() => {
            const getOperation = withMetadata((studentId: number, publicId: string, context?: PomiRequestContext) => operations.getStudentPeople(operationInput<getStudentPeopleInput>({ "sid": studentId, "publicId": publicId }), context), definitions.getStudentPeople, operationProblemTypes.getStudentPeople)
            const listOperation = withMetadata((studentId: number, input: Omit<listStudentPeopleInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentPeople(operationInput<listStudentPeopleInput>({ "sid": studentId, ...input }), context), definitions.listStudentPeople, operationProblemTypes.listStudentPeople)
            const pages = (studentId: number, input: Omit<listStudentPeopleInput, "sid"> = {}, context?: PomiRequestContext) => paginateByPage<listStudentPeopleOutput>((page) => operations.listStudentPeople(operationInput<listStudentPeopleInput>({ "sid": studentId, ...{ ...{ ...input, "page": input["page"] ?? 1, "pageSize": input["pageSize"] ?? 20 }, "page": page } }), context), { ...input, "page": input["page"] ?? 1, "pageSize": input["pageSize"] ?? 20 }["page"], "page", "pageSize", "total")
            const listAll = async (studentId: number, input: Omit<listStudentPeopleInput, "sid"> = {}, context?: PomiRequestContext) => { const items: Array<listStudentPeopleOutput["items"][number]> = []; for await (const page of pages(studentId, input, context)) items.push(...page["items"]); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "studentSharedPeriodPlannings": (() => {
            const getOperation = withMetadata((studentId: number, shareId: string, context?: PomiRequestContext) => operations.getStudentSharedPeriodPlannings(operationInput<getStudentSharedPeriodPlanningsInput>({ "sid": studentId, "shareId": shareId }), context), definitions.getStudentSharedPeriodPlannings, operationProblemTypes.getStudentSharedPeriodPlannings)
            const listOperation = withMetadata((studentId: number, input: Omit<listStudentSharedPeriodPlanningsInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentSharedPeriodPlannings(operationInput<listStudentSharedPeriodPlanningsInput>({ "sid": studentId, ...input }), context), definitions.listStudentSharedPeriodPlannings, operationProblemTypes.listStudentSharedPeriodPlannings)
            const pages = (studentId: number, input: Omit<listStudentSharedPeriodPlanningsInput, "sid"> = {}, context?: PomiRequestContext) => paginateByPage<listStudentSharedPeriodPlanningsOutput>((page) => operations.listStudentSharedPeriodPlannings(operationInput<listStudentSharedPeriodPlanningsInput>({ "sid": studentId, ...{ ...{ ...input, "page": input["page"] ?? 1, "pageSize": input["pageSize"] ?? 20 }, "page": page } }), context), { ...input, "page": input["page"] ?? 1, "pageSize": input["pageSize"] ?? 20 }["page"], "page", "pageSize", "total")
            const listAll = async (studentId: number, input: Omit<listStudentSharedPeriodPlanningsInput, "sid"> = {}, context?: PomiRequestContext) => { const items: Array<listStudentSharedPeriodPlanningsOutput["items"][number]> = []; for await (const page of pages(studentId, input, context)) items.push(...page["items"]); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "bots": (() => {
            const listOperation = withMetadata((input: Omit<listBotsInput, never> = {}, context?: PomiRequestContext) => operations.listBots(operationInput<listBotsInput>({ ...input }), context), definitions.listBots, operationProblemTypes.listBots)
            return { list: listOperation }
        })(),
        "me": (() => {
            const listOperation = withMetadata((input: Omit<listMeInput, never> = {}, context?: PomiRequestContext) => operations.listMe(operationInput<listMeInput>({ ...input }), context), definitions.listMe, operationProblemTypes.listMe)
            return { list: listOperation }
        })(),
        "meBotGrants": (() => {
            const listOperation = withMetadata((input: Omit<listMeBotGrantsInput, never> = {}, context?: PomiRequestContext) => operations.listMeBotGrants(operationInput<listMeBotGrantsInput>({ ...input }), context), definitions.listMeBotGrants, operationProblemTypes.listMeBotGrants)
            const updateOperation = withMetadata((botAuthUserId: number, body: updateMeBotGrantsInput['body'], context?: PomiRequestContext) => operations.updateMeBotGrants(operationInput<updateMeBotGrantsInput>({ "botAuthUserId": botAuthUserId, body }), context), definitions.updateMeBotGrants, operationProblemTypes.updateMeBotGrants)
            return { list: listOperation, update: updateOperation }
        })(),
        "studentClassesProfessorsEvaluation": (() => {
            const listOperation = withMetadata((studentId: number, classId: number, professorId: number, input: Omit<listStudentClassesProfessorsEvaluationInput, "sid" | "classId" | "professorId"> = {}, context?: PomiRequestContext) => operations.listStudentClassesProfessorsEvaluation(operationInput<listStudentClassesProfessorsEvaluationInput>({ "sid": studentId, "classId": classId, "professorId": professorId, ...input }), context), definitions.listStudentClassesProfessorsEvaluation, operationProblemTypes.listStudentClassesProfessorsEvaluation)
            const updateOperation = withMetadata((studentId: number, classId: number, professorId: number, body: updateStudentClassesProfessorsEvaluationInput['body'], context?: PomiRequestContext) => operations.updateStudentClassesProfessorsEvaluation(operationInput<updateStudentClassesProfessorsEvaluationInput>({ "sid": studentId, "classId": classId, "professorId": professorId, body }), context), definitions.updateStudentClassesProfessorsEvaluation, operationProblemTypes.updateStudentClassesProfessorsEvaluation)
            return { list: listOperation, update: updateOperation }
        })(),
        "studentExchangeNoticeSubscription": (() => {
            const listOperation = withMetadata((studentId: number, input: Omit<listStudentExchangeNoticeSubscriptionInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentExchangeNoticeSubscription(operationInput<listStudentExchangeNoticeSubscriptionInput>({ "sid": studentId, ...input }), context), definitions.listStudentExchangeNoticeSubscription, operationProblemTypes.listStudentExchangeNoticeSubscription)
            const updateOperation = withMetadata((studentId: number, body: updateStudentExchangeNoticeSubscriptionInput['body'], context?: PomiRequestContext) => operations.updateStudentExchangeNoticeSubscription(operationInput<updateStudentExchangeNoticeSubscriptionInput>({ "sid": studentId, body }), context), definitions.updateStudentExchangeNoticeSubscription, operationProblemTypes.updateStudentExchangeNoticeSubscription)
            return { list: listOperation, update: updateOperation }
        })(),
        "studentProfessorEvaluationsPending": (() => {
            const listOperation = withMetadata((studentId: number, input: Omit<listStudentProfessorEvaluationsPendingInput, "sid">, context?: PomiRequestContext) => operations.listStudentProfessorEvaluationsPending(operationInput<listStudentProfessorEvaluationsPendingInput>({ "sid": studentId, ...input }), context), definitions.listStudentProfessorEvaluationsPending, operationProblemTypes.listStudentProfessorEvaluationsPending)
            return { list: listOperation }
        })(),
        "studentPublicProfile": (() => {
            const listOperation = withMetadata((studentId: number, input: Omit<listStudentPublicProfileInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentPublicProfile(operationInput<listStudentPublicProfileInput>({ "sid": studentId, ...input }), context), definitions.listStudentPublicProfile, operationProblemTypes.listStudentPublicProfile)
            const updateOperation = withMetadata((studentId: number, body: updateStudentPublicProfileInput['body'], context?: PomiRequestContext) => operations.updateStudentPublicProfile(operationInput<updateStudentPublicProfileInput>({ "sid": studentId, body }), context), definitions.updateStudentPublicProfile, operationProblemTypes.updateStudentPublicProfile)
            return { list: listOperation, update: updateOperation }
        })(),
        "tagsCourses": (() => {
            const listOperation = withMetadata((tagsCourseId: number, input: Omit<listTagsCoursesInput, "id"> = {}, context?: PomiRequestContext) => operations.listTagsCourses(operationInput<listTagsCoursesInput>({ "id": tagsCourseId, ...input }), context), definitions.listTagsCourses, operationProblemTypes.listTagsCourses)
            const pages = (tagsCourseId: number, input: Omit<listTagsCoursesInput, "id"> = {}, context?: PomiRequestContext) => paginateByLink<listTagsCoursesOutput>(operations.listTagsCourses(operationInput<listTagsCoursesInput>({ "id": tagsCourseId, ...{ ...input, "page": input["page"] ?? 1, "pageSize": input["pageSize"] ?? 100 } }), context), "app", definitions.listTagsCourses.authentication, "_paths.next", requestPath, context)
            const listAll = async (tagsCourseId: number, input: Omit<listTagsCoursesInput, "id"> = {}, context?: PomiRequestContext) => { const items: Array<listTagsCoursesOutput["data"][number]> = []; for await (const page of pages(tagsCourseId, input, context)) items.push(...page["data"]); return items }
            return { list: listOperation, pages, listAll }
        })(),
    }
}

export type Resources = ReturnType<typeof bindResources>
