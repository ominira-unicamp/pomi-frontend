import type { PomiRequestContext } from '../../runtime/client.js'
import type { AuthenticationMode } from '../../runtime/operation.js'
import { operationDefinitions as definitions } from './operations.js'
import type { createCategoriesInput, createCategoriesOutput, createExchangeNoticeSubscriptionsUnsubscribeInput, createExchangeNoticeSubscriptionsUnsubscribeOutput, createFeedbackReportsInput, createFeedbackReportsOutput, createStudentAbsencesInput, createStudentAbsencesOutput, createStudentCourseAttemptsInput, createStudentCourseAttemptsOutput, createStudentCourseHistoryInput, createStudentCourseHistoryOutput, createStudentCurriculaInput, createStudentCurriculaOutput, createStudentFeedbackReportsInput, createStudentFeedbackReportsOutput, createStudentFriendshipsInput, createStudentFriendshipsOutput, createStudentFriendshipsAcceptInput, createStudentFriendshipsAcceptOutput, createStudentPeriodPlanningsInput, createStudentPeriodPlanningsOutput, createStudentsInput, createStudentsOutput, createTagsInput, createTagsOutput, deleteCategoriesInput, deleteCategoriesOutput, deleteCoursesTagsInput, deleteCoursesTagsOutput, deleteStudentAbsencesInput, deleteStudentAbsencesOutput, deleteStudentCourseAttemptsInput, deleteStudentCourseAttemptsOutput, deleteStudentCurriculaInput, deleteStudentCurriculaOutput, deleteStudentFriendshipsInput, deleteStudentFriendshipsOutput, deleteStudentPeriodPlanningsInput, deleteStudentPeriodPlanningsOutput, deleteStudentsInput, deleteStudentsOutput, deleteStudentTagInterestsInput, deleteStudentTagInterestsOutput, deleteTagsInput, deleteTagsOutput, getCategoriesInput, getCategoriesOutput, getSharedPeriodPlanningsInput, getSharedPeriodPlanningsOutput, getStudentCourseAttemptsInput, getStudentCourseAttemptsOutput, getStudentCurriculaInput, getStudentCurriculaOutput, getStudentPeopleInput, getStudentPeopleOutput, getStudentPeriodPlanningsInput, getStudentPeriodPlanningsOutput, getStudentsInput, getStudentsOutput, getStudentSharedPeriodPlanningsInput, getStudentSharedPeriodPlanningsOutput, getTagsInput, getTagsOutput, listBotsInput, listBotsOutput, listCategoriesInput, listCategoriesOutput, listCoursesTagsInput, listCoursesTagsOutput, listMeInput, listMeOutput, listMeBotGrantsInput, listMeBotGrantsOutput, listSharedPeriodPlanningsInput, listSharedPeriodPlanningsOutput, listStudentAbsencesInput, listStudentAbsencesOutput, listStudentClassesProfessorsEvaluationInput, listStudentClassesProfessorsEvaluationOutput, listStudentCourseAttemptsInput, listStudentCourseAttemptsOutput, listStudentCurriculaInput, listStudentCurriculaOutput, listStudentExchangeNoticeSubscriptionInput, listStudentExchangeNoticeSubscriptionOutput, listStudentFeedbackReportsInput, listStudentFeedbackReportsOutput, listStudentFriendshipsInput, listStudentFriendshipsOutput, listStudentPeopleInput, listStudentPeopleOutput, listStudentPeriodPlanningsInput, listStudentPeriodPlanningsOutput, listStudentProfessorEvaluationsPendingInput, listStudentProfessorEvaluationsPendingOutput, listStudentPublicProfileInput, listStudentPublicProfileOutput, listStudentSharedPeriodPlanningsInput, listStudentSharedPeriodPlanningsOutput, listStudentTagInterestsInput, listStudentTagInterestsOutput, listTagsInput, listTagsOutput, listTagsCoursesInput, listTagsCoursesOutput, updateCategoriesInput, updateCategoriesOutput, updateCoursesTagsInput, updateCoursesTagsOutput, updateMeBotGrantsInput, updateMeBotGrantsOutput, updateStudentClassesProfessorsEvaluationInput, updateStudentClassesProfessorsEvaluationOutput, updateStudentCourseAttemptsInput, updateStudentCourseAttemptsOutput, updateStudentCurriculaInput, updateStudentCurriculaOutput, updateStudentExchangeNoticeSubscriptionInput, updateStudentExchangeNoticeSubscriptionOutput, updateStudentPeriodPlanningsInput, updateStudentPeriodPlanningsOutput, updateStudentPublicProfileInput, updateStudentPublicProfileOutput, updateStudentsInput, updateStudentsOutput, updateStudentTagInterestsInput, updateStudentTagInterestsOutput, updateTagsInput, updateTagsOutput } from './operations.js'
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
    createStudentPeriodPlannings: OperationFunction<createStudentPeriodPlanningsInput, createStudentPeriodPlanningsOutput>
    createStudents: OperationFunction<createStudentsInput, createStudentsOutput>
    createTags: OperationFunction<createTagsInput, createTagsOutput>
    deleteCategories: OperationFunction<deleteCategoriesInput, deleteCategoriesOutput>
    deleteCoursesTags: OperationFunction<deleteCoursesTagsInput, deleteCoursesTagsOutput>
    deleteStudentAbsences: OperationFunction<deleteStudentAbsencesInput, deleteStudentAbsencesOutput>
    deleteStudentCourseAttempts: OperationFunction<deleteStudentCourseAttemptsInput, deleteStudentCourseAttemptsOutput>
    deleteStudentCurricula: OperationFunction<deleteStudentCurriculaInput, deleteStudentCurriculaOutput>
    deleteStudentFriendships: OperationFunction<deleteStudentFriendshipsInput, deleteStudentFriendshipsOutput>
    deleteStudentPeriodPlannings: OperationFunction<deleteStudentPeriodPlanningsInput, deleteStudentPeriodPlanningsOutput>
    deleteStudents: OperationFunction<deleteStudentsInput, deleteStudentsOutput>
    deleteStudentTagInterests: OperationFunction<deleteStudentTagInterestsInput, deleteStudentTagInterestsOutput>
    deleteTags: OperationFunction<deleteTagsInput, deleteTagsOutput>
    getCategories: OperationFunction<getCategoriesInput, getCategoriesOutput>
    getSharedPeriodPlannings: OperationFunction<getSharedPeriodPlanningsInput, getSharedPeriodPlanningsOutput>
    getStudentCourseAttempts: OperationFunction<getStudentCourseAttemptsInput, getStudentCourseAttemptsOutput>
    getStudentCurricula: OperationFunction<getStudentCurriculaInput, getStudentCurriculaOutput>
    getStudentPeople: OperationFunction<getStudentPeopleInput, getStudentPeopleOutput>
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

function withPaginationDefaults<Input extends { page?: number; pageSize?: number }>(input: Input, pageSize: number) {
    return { ...input, page: input.page ?? 1, pageSize: input.pageSize ?? pageSize }
}

function valueAtPath(value: unknown, path: string) {
    return path.split('.').reduce<unknown>((current, key) => typeof current === 'object' && current !== null ? (current as Record<string, unknown>)[key] : undefined, value)
}

async function* paginate<Page>(firstPage: Promise<Page>, target: "app", authentication: AuthenticationMode, nextField: string, requestPath: RequestPath, context?: PomiRequestContext): AsyncIterable<Page> {
    let page = await firstPage
    yield page
    let next = valueAtPath(page, nextField)
    while (typeof next === 'string' && next.length > 0) {
        page = await requestPath<Page>(target, next, authentication, context)
        yield page
        next = valueAtPath(page, nextField)
    }
}


export function bindResources(operations: Operations, requestPath: RequestPath) {

    return {
        "categories": (() => {
            const create = withMetadata((body: createCategoriesInput['body'], context?: PomiRequestContext) => operations.createCategories({ body } as unknown as createCategoriesInput, context), definitions.createCategories, operationProblemTypes.createCategories)
            const deleteOperation = withMetadata((categoryId: number, context?: PomiRequestContext) => operations.deleteCategories({ "id": categoryId } as unknown as deleteCategoriesInput, context), definitions.deleteCategories, operationProblemTypes.deleteCategories)
            const get = withMetadata((categoryId: number, context?: PomiRequestContext) => operations.getCategories({ "id": categoryId } as unknown as getCategoriesInput, context), definitions.getCategories, operationProblemTypes.getCategories)
            const list = withMetadata((input: Omit<listCategoriesInput, never> = {}, context?: PomiRequestContext) => operations.listCategories({ ...input } as unknown as listCategoriesInput, context), definitions.listCategories, operationProblemTypes.listCategories)
            const update = withMetadata((categoryId: number, body: updateCategoriesInput['body'], context?: PomiRequestContext) => operations.updateCategories({ "id": categoryId, body } as unknown as updateCategoriesInput, context), definitions.updateCategories, operationProblemTypes.updateCategories)
            return { create, delete: deleteOperation, get, list, update }
        })(),
        "exchangeNoticeSubscriptionsUnsubscribe": (() => {
            const create = withMetadata((context?: PomiRequestContext) => operations.createExchangeNoticeSubscriptionsUnsubscribe({} as unknown as createExchangeNoticeSubscriptionsUnsubscribeInput, context), definitions.createExchangeNoticeSubscriptionsUnsubscribe, operationProblemTypes.createExchangeNoticeSubscriptionsUnsubscribe)
            return { create }
        })(),
        "feedbackReports": (() => {
            const create = withMetadata((body: createFeedbackReportsInput['body'], context?: PomiRequestContext) => operations.createFeedbackReports({ body } as unknown as createFeedbackReportsInput, context), definitions.createFeedbackReports, operationProblemTypes.createFeedbackReports)
            return { create }
        })(),
        "studentAbsences": (() => {
            const create = withMetadata((studentId: string, body: createStudentAbsencesInput['body'], context?: PomiRequestContext) => operations.createStudentAbsences({ "sid": studentId, body } as unknown as createStudentAbsencesInput, context), definitions.createStudentAbsences, operationProblemTypes.createStudentAbsences)
            const deleteOperation = withMetadata((studentId: string, studentAbsenceId: string, context?: PomiRequestContext) => operations.deleteStudentAbsences({ "sid": studentId, "id": studentAbsenceId } as unknown as deleteStudentAbsencesInput, context), definitions.deleteStudentAbsences, operationProblemTypes.deleteStudentAbsences)
            const list = withMetadata((studentId: string, input: Omit<listStudentAbsencesInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentAbsences({ "sid": studentId, ...input } as unknown as listStudentAbsencesInput, context), definitions.listStudentAbsences, operationProblemTypes.listStudentAbsences)
            return { create, delete: deleteOperation, list }
        })(),
        "courseAttempts": (() => {
            const create = withMetadata((studentId: string, body: createStudentCourseAttemptsInput['body'], context?: PomiRequestContext) => operations.createStudentCourseAttempts({ "sid": studentId, body } as unknown as createStudentCourseAttemptsInput, context), definitions.createStudentCourseAttempts, operationProblemTypes.createStudentCourseAttempts)
            const deleteOperation = withMetadata((studentId: string, courseAttemptId: string, context?: PomiRequestContext) => operations.deleteStudentCourseAttempts({ "sid": studentId, "id": courseAttemptId } as unknown as deleteStudentCourseAttemptsInput, context), definitions.deleteStudentCourseAttempts, operationProblemTypes.deleteStudentCourseAttempts)
            const get = withMetadata((studentId: string, courseAttemptId: string, context?: PomiRequestContext) => operations.getStudentCourseAttempts({ "sid": studentId, "id": courseAttemptId } as unknown as getStudentCourseAttemptsInput, context), definitions.getStudentCourseAttempts, operationProblemTypes.getStudentCourseAttempts)
            const list = withMetadata((studentId: string, input: Omit<listStudentCourseAttemptsInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentCourseAttempts({ "sid": studentId, ...input } as unknown as listStudentCourseAttemptsInput, context), definitions.listStudentCourseAttempts, operationProblemTypes.listStudentCourseAttempts)
            const update = withMetadata((studentId: string, courseAttemptId: string, body: updateStudentCourseAttemptsInput['body'], context?: PomiRequestContext) => operations.updateStudentCourseAttempts({ "sid": studentId, "id": courseAttemptId, body } as unknown as updateStudentCourseAttemptsInput, context), definitions.updateStudentCourseAttempts, operationProblemTypes.updateStudentCourseAttempts)
            return { create, delete: deleteOperation, get, list, update }
        })(),
        "studentCourseHistory": (() => {
            const create = withMetadata((studentId: string, body: createStudentCourseHistoryInput['body'], context?: PomiRequestContext) => operations.createStudentCourseHistory({ "sid": studentId, body } as unknown as createStudentCourseHistoryInput, context), definitions.createStudentCourseHistory, operationProblemTypes.createStudentCourseHistory)
            return { create }
        })(),
        "studentCurricula": (() => {
            const create = withMetadata((studentId: string, body: createStudentCurriculaInput['body'], context?: PomiRequestContext) => operations.createStudentCurricula({ "sid": studentId, body } as unknown as createStudentCurriculaInput, context), definitions.createStudentCurricula, operationProblemTypes.createStudentCurricula)
            const deleteOperation = withMetadata((studentId: string, studentCurriculaId: string, context?: PomiRequestContext) => operations.deleteStudentCurricula({ "sid": studentId, "id": studentCurriculaId } as unknown as deleteStudentCurriculaInput, context), definitions.deleteStudentCurricula, operationProblemTypes.deleteStudentCurricula)
            const get = withMetadata((studentId: string, studentCurriculaId: string, context?: PomiRequestContext) => operations.getStudentCurricula({ "sid": studentId, "id": studentCurriculaId } as unknown as getStudentCurriculaInput, context), definitions.getStudentCurricula, operationProblemTypes.getStudentCurricula)
            const list = withMetadata((studentId: string, input: Omit<listStudentCurriculaInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentCurricula({ "sid": studentId, ...input } as unknown as listStudentCurriculaInput, context), definitions.listStudentCurricula, operationProblemTypes.listStudentCurricula)
            const update = withMetadata((studentId: string, studentCurriculaId: string, body: updateStudentCurriculaInput['body'], context?: PomiRequestContext) => operations.updateStudentCurricula({ "sid": studentId, "id": studentCurriculaId, body } as unknown as updateStudentCurriculaInput, context), definitions.updateStudentCurricula, operationProblemTypes.updateStudentCurricula)
            return { create, delete: deleteOperation, get, list, update }
        })(),
        "studentFeedbackReports": (() => {
            const create = withMetadata((studentId: string, body: createStudentFeedbackReportsInput['body'], context?: PomiRequestContext) => operations.createStudentFeedbackReports({ "sid": studentId, body } as unknown as createStudentFeedbackReportsInput, context), definitions.createStudentFeedbackReports, operationProblemTypes.createStudentFeedbackReports)
            const list = withMetadata((studentId: string, input: Omit<listStudentFeedbackReportsInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentFeedbackReports({ "sid": studentId, ...input } as unknown as listStudentFeedbackReportsInput, context), definitions.listStudentFeedbackReports, operationProblemTypes.listStudentFeedbackReports)
            return { create, list }
        })(),
        "studentFriendships": (() => {
            const create = withMetadata((studentId: string, body: createStudentFriendshipsInput['body'], context?: PomiRequestContext) => operations.createStudentFriendships({ "sid": studentId, body } as unknown as createStudentFriendshipsInput, context), definitions.createStudentFriendships, operationProblemTypes.createStudentFriendships)
            const deleteOperation = withMetadata((studentId: string, studentFriendshipId: string, context?: PomiRequestContext) => operations.deleteStudentFriendships({ "sid": studentId, "id": studentFriendshipId } as unknown as deleteStudentFriendshipsInput, context), definitions.deleteStudentFriendships, operationProblemTypes.deleteStudentFriendships)
            const list = withMetadata((studentId: string, input: Omit<listStudentFriendshipsInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentFriendships({ "sid": studentId, ...input } as unknown as listStudentFriendshipsInput, context), definitions.listStudentFriendships, operationProblemTypes.listStudentFriendships)
            return { create, delete: deleteOperation, list }
        })(),
        "studentFriendshipsAccept": (() => {
            const create = withMetadata((studentId: string, studentFriendshipsAcceptId: string, context?: PomiRequestContext) => operations.createStudentFriendshipsAccept({ "sid": studentId, "id": studentFriendshipsAcceptId } as unknown as createStudentFriendshipsAcceptInput, context), definitions.createStudentFriendshipsAccept, operationProblemTypes.createStudentFriendshipsAccept)
            return { create }
        })(),
        "periodPlannings": (() => {
            const create = withMetadata((studentId: string, body: createStudentPeriodPlanningsInput['body'], context?: PomiRequestContext) => operations.createStudentPeriodPlannings({ "sid": studentId, body } as unknown as createStudentPeriodPlanningsInput, context), definitions.createStudentPeriodPlannings, operationProblemTypes.createStudentPeriodPlannings)
            const deleteOperation = withMetadata((studentId: string, periodPlanningId: string, context?: PomiRequestContext) => operations.deleteStudentPeriodPlannings({ "sid": studentId, "id": periodPlanningId } as unknown as deleteStudentPeriodPlanningsInput, context), definitions.deleteStudentPeriodPlannings, operationProblemTypes.deleteStudentPeriodPlannings)
            const get = withMetadata((studentId: string, periodPlanningId: string, context?: PomiRequestContext) => operations.getStudentPeriodPlannings({ "sid": studentId, "id": periodPlanningId } as unknown as getStudentPeriodPlanningsInput, context), definitions.getStudentPeriodPlannings, operationProblemTypes.getStudentPeriodPlannings)
            const list = withMetadata((studentId: string, input: Omit<listStudentPeriodPlanningsInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentPeriodPlannings({ "sid": studentId, ...input } as unknown as listStudentPeriodPlanningsInput, context), definitions.listStudentPeriodPlannings, operationProblemTypes.listStudentPeriodPlannings)
            const update = withMetadata((studentId: string, periodPlanningId: string, body: updateStudentPeriodPlanningsInput['body'], context?: PomiRequestContext) => operations.updateStudentPeriodPlannings({ "sid": studentId, "id": periodPlanningId, body } as unknown as updateStudentPeriodPlanningsInput, context), definitions.updateStudentPeriodPlannings, operationProblemTypes.updateStudentPeriodPlannings)
            return { create, delete: deleteOperation, get, list, update }
        })(),
        "students": (() => {
            const create = withMetadata((body: createStudentsInput['body'], context?: PomiRequestContext) => operations.createStudents({ body } as unknown as createStudentsInput, context), definitions.createStudents, operationProblemTypes.createStudents)
            const deleteOperation = withMetadata((studentId: string, body: deleteStudentsInput['body'], context?: PomiRequestContext) => operations.deleteStudents({ "id": studentId, body } as unknown as deleteStudentsInput, context), definitions.deleteStudents, operationProblemTypes.deleteStudents)
            const get = withMetadata((studentId: string, context?: PomiRequestContext) => operations.getStudents({ "id": studentId } as unknown as getStudentsInput, context), definitions.getStudents, operationProblemTypes.getStudents)
            const update = withMetadata((studentId: string, body: updateStudentsInput['body'], context?: PomiRequestContext) => operations.updateStudents({ "id": studentId, body } as unknown as updateStudentsInput, context), definitions.updateStudents, operationProblemTypes.updateStudents)
            return { create, delete: deleteOperation, get, update }
        })(),
        "tags": (() => {
            const create = withMetadata((body: createTagsInput['body'], context?: PomiRequestContext) => operations.createTags({ body } as unknown as createTagsInput, context), definitions.createTags, operationProblemTypes.createTags)
            const deleteOperation = withMetadata((tagId: number, context?: PomiRequestContext) => operations.deleteTags({ "id": tagId } as unknown as deleteTagsInput, context), definitions.deleteTags, operationProblemTypes.deleteTags)
            const get = withMetadata((tagId: number, context?: PomiRequestContext) => operations.getTags({ "id": tagId } as unknown as getTagsInput, context), definitions.getTags, operationProblemTypes.getTags)
            const list = withMetadata((input: Omit<listTagsInput, never> = {}, context?: PomiRequestContext) => operations.listTags({ ...input } as unknown as listTagsInput, context), definitions.listTags, operationProblemTypes.listTags)
            const update = withMetadata((tagId: number, body: updateTagsInput['body'], context?: PomiRequestContext) => operations.updateTags({ "id": tagId, body } as unknown as updateTagsInput, context), definitions.updateTags, operationProblemTypes.updateTags)
            return { create, delete: deleteOperation, get, list, update }
        })(),
        "coursesTags": (() => {
            const deleteOperation = withMetadata((courseId: number, tagId: number, context?: PomiRequestContext) => operations.deleteCoursesTags({ "courseId": courseId, "tagId": tagId } as unknown as deleteCoursesTagsInput, context), definitions.deleteCoursesTags, operationProblemTypes.deleteCoursesTags)
            const list = withMetadata((courseId: number, input: Omit<listCoursesTagsInput, "courseId"> = {}, context?: PomiRequestContext) => operations.listCoursesTags({ "courseId": courseId, ...input } as unknown as listCoursesTagsInput, context), definitions.listCoursesTags, operationProblemTypes.listCoursesTags)
            const update = withMetadata((courseId: number, tagId: number, context?: PomiRequestContext) => operations.updateCoursesTags({ "courseId": courseId, "tagId": tagId } as unknown as updateCoursesTagsInput, context), definitions.updateCoursesTags, operationProblemTypes.updateCoursesTags)
            return { delete: deleteOperation, list, update }
        })(),
        "studentTagInterests": (() => {
            const deleteOperation = withMetadata((studentId: string, tagId: string, context?: PomiRequestContext) => operations.deleteStudentTagInterests({ "sid": studentId, "tagId": tagId } as unknown as deleteStudentTagInterestsInput, context), definitions.deleteStudentTagInterests, operationProblemTypes.deleteStudentTagInterests)
            const list = withMetadata((studentId: string, input: Omit<listStudentTagInterestsInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentTagInterests({ "sid": studentId, ...input } as unknown as listStudentTagInterestsInput, context), definitions.listStudentTagInterests, operationProblemTypes.listStudentTagInterests)
            const update = withMetadata((studentId: string, tagId: string, context?: PomiRequestContext) => operations.updateStudentTagInterests({ "sid": studentId, "tagId": tagId } as unknown as updateStudentTagInterestsInput, context), definitions.updateStudentTagInterests, operationProblemTypes.updateStudentTagInterests)
            return { delete: deleteOperation, list, update }
        })(),
        "sharedPeriodPlannings": (() => {
            const get = withMetadata((shareId: string, context?: PomiRequestContext) => operations.getSharedPeriodPlannings({ "shareId": shareId } as unknown as getSharedPeriodPlanningsInput, context), definitions.getSharedPeriodPlannings, operationProblemTypes.getSharedPeriodPlannings)
            const list = withMetadata((input: Omit<listSharedPeriodPlanningsInput, never> = {}, context?: PomiRequestContext) => operations.listSharedPeriodPlannings({ ...input } as unknown as listSharedPeriodPlanningsInput, context), definitions.listSharedPeriodPlannings, operationProblemTypes.listSharedPeriodPlannings)
            return { get, list }
        })(),
        "studentPeople": (() => {
            const get = withMetadata((studentId: string, publicId: string, context?: PomiRequestContext) => operations.getStudentPeople({ "sid": studentId, "publicId": publicId } as unknown as getStudentPeopleInput, context), definitions.getStudentPeople, operationProblemTypes.getStudentPeople)
            const list = withMetadata((studentId: string, input: Omit<listStudentPeopleInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentPeople({ "sid": studentId, ...input } as unknown as listStudentPeopleInput, context), definitions.listStudentPeople, operationProblemTypes.listStudentPeople)
            return { get, list }
        })(),
        "studentSharedPeriodPlannings": (() => {
            const get = withMetadata((studentId: string, shareId: string, context?: PomiRequestContext) => operations.getStudentSharedPeriodPlannings({ "sid": studentId, "shareId": shareId } as unknown as getStudentSharedPeriodPlanningsInput, context), definitions.getStudentSharedPeriodPlannings, operationProblemTypes.getStudentSharedPeriodPlannings)
            const list = withMetadata((studentId: string, input: Omit<listStudentSharedPeriodPlanningsInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentSharedPeriodPlannings({ "sid": studentId, ...input } as unknown as listStudentSharedPeriodPlanningsInput, context), definitions.listStudentSharedPeriodPlannings, operationProblemTypes.listStudentSharedPeriodPlannings)
            return { get, list }
        })(),
        "bots": (() => {
            const list = withMetadata((input: Omit<listBotsInput, never> = {}, context?: PomiRequestContext) => operations.listBots({ ...input } as unknown as listBotsInput, context), definitions.listBots, operationProblemTypes.listBots)
            return { list }
        })(),
        "me": (() => {
            const list = withMetadata((input: Omit<listMeInput, never> = {}, context?: PomiRequestContext) => operations.listMe({ ...input } as unknown as listMeInput, context), definitions.listMe, operationProblemTypes.listMe)
            return { list }
        })(),
        "meBotGrants": (() => {
            const list = withMetadata((input: Omit<listMeBotGrantsInput, never> = {}, context?: PomiRequestContext) => operations.listMeBotGrants({ ...input } as unknown as listMeBotGrantsInput, context), definitions.listMeBotGrants, operationProblemTypes.listMeBotGrants)
            const update = withMetadata((botAuthUserId: string, body: updateMeBotGrantsInput['body'], context?: PomiRequestContext) => operations.updateMeBotGrants({ "botAuthUserId": botAuthUserId, body } as unknown as updateMeBotGrantsInput, context), definitions.updateMeBotGrants, operationProblemTypes.updateMeBotGrants)
            return { list, update }
        })(),
        "studentClassesProfessorsEvaluation": (() => {
            const list = withMetadata((studentId: string, classId: string, professorId: string, input: Omit<listStudentClassesProfessorsEvaluationInput, "sid" | "classId" | "professorId"> = {}, context?: PomiRequestContext) => operations.listStudentClassesProfessorsEvaluation({ "sid": studentId, "classId": classId, "professorId": professorId, ...input } as unknown as listStudentClassesProfessorsEvaluationInput, context), definitions.listStudentClassesProfessorsEvaluation, operationProblemTypes.listStudentClassesProfessorsEvaluation)
            const update = withMetadata((studentId: string, classId: string, professorId: string, body: updateStudentClassesProfessorsEvaluationInput['body'], context?: PomiRequestContext) => operations.updateStudentClassesProfessorsEvaluation({ "sid": studentId, "classId": classId, "professorId": professorId, body } as unknown as updateStudentClassesProfessorsEvaluationInput, context), definitions.updateStudentClassesProfessorsEvaluation, operationProblemTypes.updateStudentClassesProfessorsEvaluation)
            return { list, update }
        })(),
        "studentExchangeNoticeSubscription": (() => {
            const list = withMetadata((studentId: string, input: Omit<listStudentExchangeNoticeSubscriptionInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentExchangeNoticeSubscription({ "sid": studentId, ...input } as unknown as listStudentExchangeNoticeSubscriptionInput, context), definitions.listStudentExchangeNoticeSubscription, operationProblemTypes.listStudentExchangeNoticeSubscription)
            const update = withMetadata((studentId: string, body: updateStudentExchangeNoticeSubscriptionInput['body'], context?: PomiRequestContext) => operations.updateStudentExchangeNoticeSubscription({ "sid": studentId, body } as unknown as updateStudentExchangeNoticeSubscriptionInput, context), definitions.updateStudentExchangeNoticeSubscription, operationProblemTypes.updateStudentExchangeNoticeSubscription)
            return { list, update }
        })(),
        "studentProfessorEvaluationsPending": (() => {
            const list = withMetadata((studentId: string, input: Omit<listStudentProfessorEvaluationsPendingInput, "sid">, context?: PomiRequestContext) => operations.listStudentProfessorEvaluationsPending({ "sid": studentId, ...input } as unknown as listStudentProfessorEvaluationsPendingInput, context), definitions.listStudentProfessorEvaluationsPending, operationProblemTypes.listStudentProfessorEvaluationsPending)
            return { list }
        })(),
        "studentPublicProfile": (() => {
            const list = withMetadata((studentId: string, input: Omit<listStudentPublicProfileInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentPublicProfile({ "sid": studentId, ...input } as unknown as listStudentPublicProfileInput, context), definitions.listStudentPublicProfile, operationProblemTypes.listStudentPublicProfile)
            const update = withMetadata((studentId: string, body: updateStudentPublicProfileInput['body'], context?: PomiRequestContext) => operations.updateStudentPublicProfile({ "sid": studentId, body } as unknown as updateStudentPublicProfileInput, context), definitions.updateStudentPublicProfile, operationProblemTypes.updateStudentPublicProfile)
            return { list, update }
        })(),
        "tagsCourses": (() => {
            const list = withMetadata((tagsCourseId: number, input: Omit<listTagsCoursesInput, "id"> = {}, context?: PomiRequestContext) => operations.listTagsCourses({ "id": tagsCourseId, ...input } as unknown as listTagsCoursesInput, context), definitions.listTagsCourses, operationProblemTypes.listTagsCourses)
            const pages = (tagsCourseId: number, input: Omit<listTagsCoursesInput, "id"> = {}, context?: PomiRequestContext) => paginate<listTagsCoursesOutput>(operations.listTagsCourses({ "id": tagsCourseId, ...withPaginationDefaults(input, 100) } as unknown as listTagsCoursesInput, context), "app", definitions.listTagsCourses.authentication, "_paths.next", requestPath, context)
            const listAll = async (tagsCourseId: number, input: Omit<listTagsCoursesInput, "id"> = {}, context?: PomiRequestContext) => { const items: Array<listTagsCoursesOutput["data"][number]> = []; for await (const page of pages(tagsCourseId, input, context)) items.push(...page["data"]); return items }
            return { list, pages, listAll }
        })(),
    }
}

export type Resources = ReturnType<typeof bindResources>
