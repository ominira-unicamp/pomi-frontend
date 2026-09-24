import type { PomiRequestContext } from '../../runtime/client.js'
import type { AuthenticationMode } from '../../runtime/operation.js'
import { operationDefinitions as definitions } from './operations.js'
import type { getCalendarEventsInput, getCalendarEventsOutput, getCalendarFeedInput, getCalendarFeedOutput, getCalendarTagsInput, getCalendarTagsOutput, getCatalogCoursesInput, getCatalogCoursesOutput, getCatalogProgramsInput, getCatalogProgramsOutput, getCatalogsInput, getCatalogsOutput, getClassesInput, getClassesOutput, getClassSchedulesInput, getClassSchedulesOutput, getCoauthorsInput, getCoauthorsOutput, getCoordinatorsInput, getCoordinatorsOutput, getCourseProfessorEvaluationSummaryInput, getCourseProfessorEvaluationSummaryOutput, getCoursesInput, getCoursesOutput, getCurriculumSuggestionsInput, getCurriculumSuggestionsOutput, getDailyMenusInput, getDailyMenusOutput, getDepartmentsInput, getDepartmentsOutput, getExchangeNoticesInput, getExchangeNoticesOutput, getKeywordsInput, getKeywordsOutput, getLanguagesInput, getLanguagesOutput, getProfessorDataPortalProfilesInput, getProfessorDataPortalProfilesOutput, getProfessorPositionsInput, getProfessorPositionsOutput, getProfessorsInput, getProfessorsOutput, getProgramsInput, getProgramsOutput, getRoomsInput, getRoomsOutput, getSpecializationsInput, getSpecializationsOutput, getStudyPeriodsInput, getStudyPeriodsOutput, getUnitsInput, getUnitsOutput, listCalendarEventsInput, listCalendarEventsOutput, listCalendarTagsInput, listCalendarTagsOutput, listCatalogCoursesInput, listCatalogCoursesOutput, listCatalogProgramsInput, listCatalogProgramsOutput, listCatalogsInput, listCatalogsOutput, listClassesInput, listClassesOutput, listClassSchedulesInput, listClassSchedulesOutput, listCoauthorsInput, listCoauthorsOutput, listCoordinatorsInput, listCoordinatorsOutput, listCourseEvaluationSummariesInput, listCourseEvaluationSummariesOutput, listCoursesInput, listCoursesOutput, listCurriculumSuggestionsInput, listCurriculumSuggestionsOutput, listDailyMenusInput, listDailyMenusOutput, listDepartmentsInput, listDepartmentsOutput, listExchangeNoticesInput, listExchangeNoticesOutput, listExchangePlacesInput, listExchangePlacesOutput, listKeywordsInput, listKeywordsOutput, listLanguagesInput, listLanguagesOutput, listProfessorDataPortalProfilesInput, listProfessorDataPortalProfilesOutput, listProfessorEvaluationSummariesInput, listProfessorEvaluationSummariesOutput, listProfessorPositionsInput, listProfessorPositionsOutput, listProfessorsInput, listProfessorsOutput, listProgramsInput, listProgramsOutput, listRoomsInput, listRoomsOutput, listSpecializationsInput, listSpecializationsOutput, listStudyPeriodsInput, listStudyPeriodsOutput, listUnitsInput, listUnitsOutput } from './operations.js'
import { operationProblemTypes } from './problems.js'

type OperationFunction<Input, Output> = (input: Input, context?: PomiRequestContext) => Promise<Output>
type Operations = {
    getCalendarEvents: OperationFunction<getCalendarEventsInput, getCalendarEventsOutput>
    getCalendarFeed: OperationFunction<getCalendarFeedInput, getCalendarFeedOutput>
    getCalendarTags: OperationFunction<getCalendarTagsInput, getCalendarTagsOutput>
    getCatalogCourses: OperationFunction<getCatalogCoursesInput, getCatalogCoursesOutput>
    getCatalogPrograms: OperationFunction<getCatalogProgramsInput, getCatalogProgramsOutput>
    getCatalogs: OperationFunction<getCatalogsInput, getCatalogsOutput>
    getClasses: OperationFunction<getClassesInput, getClassesOutput>
    getClassSchedules: OperationFunction<getClassSchedulesInput, getClassSchedulesOutput>
    getCoauthors: OperationFunction<getCoauthorsInput, getCoauthorsOutput>
    getCoordinators: OperationFunction<getCoordinatorsInput, getCoordinatorsOutput>
    getCourseProfessorEvaluationSummary: OperationFunction<getCourseProfessorEvaluationSummaryInput, getCourseProfessorEvaluationSummaryOutput>
    getCourses: OperationFunction<getCoursesInput, getCoursesOutput>
    getCurriculumSuggestions: OperationFunction<getCurriculumSuggestionsInput, getCurriculumSuggestionsOutput>
    getDailyMenus: OperationFunction<getDailyMenusInput, getDailyMenusOutput>
    getDepartments: OperationFunction<getDepartmentsInput, getDepartmentsOutput>
    getExchangeNotices: OperationFunction<getExchangeNoticesInput, getExchangeNoticesOutput>
    getKeywords: OperationFunction<getKeywordsInput, getKeywordsOutput>
    getLanguages: OperationFunction<getLanguagesInput, getLanguagesOutput>
    getProfessorDataPortalProfiles: OperationFunction<getProfessorDataPortalProfilesInput, getProfessorDataPortalProfilesOutput>
    getProfessorPositions: OperationFunction<getProfessorPositionsInput, getProfessorPositionsOutput>
    getProfessors: OperationFunction<getProfessorsInput, getProfessorsOutput>
    getPrograms: OperationFunction<getProgramsInput, getProgramsOutput>
    getRooms: OperationFunction<getRoomsInput, getRoomsOutput>
    getSpecializations: OperationFunction<getSpecializationsInput, getSpecializationsOutput>
    getStudyPeriods: OperationFunction<getStudyPeriodsInput, getStudyPeriodsOutput>
    getUnits: OperationFunction<getUnitsInput, getUnitsOutput>
    listCalendarEvents: OperationFunction<listCalendarEventsInput, listCalendarEventsOutput>
    listCalendarTags: OperationFunction<listCalendarTagsInput, listCalendarTagsOutput>
    listCatalogCourses: OperationFunction<listCatalogCoursesInput, listCatalogCoursesOutput>
    listCatalogPrograms: OperationFunction<listCatalogProgramsInput, listCatalogProgramsOutput>
    listCatalogs: OperationFunction<listCatalogsInput, listCatalogsOutput>
    listClasses: OperationFunction<listClassesInput, listClassesOutput>
    listClassSchedules: OperationFunction<listClassSchedulesInput, listClassSchedulesOutput>
    listCoauthors: OperationFunction<listCoauthorsInput, listCoauthorsOutput>
    listCoordinators: OperationFunction<listCoordinatorsInput, listCoordinatorsOutput>
    listCourseEvaluationSummaries: OperationFunction<listCourseEvaluationSummariesInput, listCourseEvaluationSummariesOutput>
    listCourses: OperationFunction<listCoursesInput, listCoursesOutput>
    listCurriculumSuggestions: OperationFunction<listCurriculumSuggestionsInput, listCurriculumSuggestionsOutput>
    listDailyMenus: OperationFunction<listDailyMenusInput, listDailyMenusOutput>
    listDepartments: OperationFunction<listDepartmentsInput, listDepartmentsOutput>
    listExchangeNotices: OperationFunction<listExchangeNoticesInput, listExchangeNoticesOutput>
    listExchangePlaces: OperationFunction<listExchangePlacesInput, listExchangePlacesOutput>
    listKeywords: OperationFunction<listKeywordsInput, listKeywordsOutput>
    listLanguages: OperationFunction<listLanguagesInput, listLanguagesOutput>
    listProfessorDataPortalProfiles: OperationFunction<listProfessorDataPortalProfilesInput, listProfessorDataPortalProfilesOutput>
    listProfessorEvaluationSummaries: OperationFunction<listProfessorEvaluationSummariesInput, listProfessorEvaluationSummariesOutput>
    listProfessorPositions: OperationFunction<listProfessorPositionsInput, listProfessorPositionsOutput>
    listProfessors: OperationFunction<listProfessorsInput, listProfessorsOutput>
    listPrograms: OperationFunction<listProgramsInput, listProgramsOutput>
    listRooms: OperationFunction<listRoomsInput, listRoomsOutput>
    listSpecializations: OperationFunction<listSpecializationsInput, listSpecializationsOutput>
    listStudyPeriods: OperationFunction<listStudyPeriodsInput, listStudyPeriodsOutput>
    listUnits: OperationFunction<listUnitsInput, listUnitsOutput>
}
type RequestPath = <T>(target: "data", path: string, authentication?: AuthenticationMode, context?: PomiRequestContext) => Promise<T>

function withMetadata<FunctionType extends (...args: any[]) => unknown, Definition, Problems>(fn: FunctionType, meta: Definition, problemTypes: Problems) {
    return Object.assign(fn, { meta, problemTypes })
}

function operationInput<Input>(input: Input): Input {
    return input
}

async function* paginateByLink<Page extends { links: { next: string | null } }>(firstPage: Promise<Page>, target: "data", authentication: AuthenticationMode, requestPath: RequestPath, context?: PomiRequestContext): AsyncIterable<Page> {
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
        "calendarEvents": (() => {
            const getOperation = withMetadata((calendarEventId: number, context?: PomiRequestContext) => operations.getCalendarEvents(operationInput<getCalendarEventsInput>({ "id": calendarEventId }), context), definitions.getCalendarEvents, operationProblemTypes.getCalendarEvents)
            const listOperation = withMetadata((input: Omit<listCalendarEventsInput, never> = {}, context?: PomiRequestContext) => operations.listCalendarEvents(operationInput<listCalendarEventsInput>({ ...input }), context), definitions.listCalendarEvents, operationProblemTypes.listCalendarEvents)
            const pages = (input: Omit<listCalendarEventsInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listCalendarEventsOutput>(operations.listCalendarEvents(operationInput<listCalendarEventsInput>({ ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "data", definitions.listCalendarEvents.authentication, requestPath, context)
            const listAll = async (input: Omit<listCalendarEventsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listCalendarEventsOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "calendar": (() => {
            const getFeedOperation = withMetadata((input: Omit<getCalendarFeedInput, never> = {}, context?: PomiRequestContext) => operations.getCalendarFeed(operationInput<getCalendarFeedInput>({ ...input }), context), definitions.getCalendarFeed, operationProblemTypes.getCalendarFeed)
            return { getFeed: getFeedOperation }
        })(),
        "calendarTags": (() => {
            const getOperation = withMetadata((calendarTagId: number, context?: PomiRequestContext) => operations.getCalendarTags(operationInput<getCalendarTagsInput>({ "id": calendarTagId }), context), definitions.getCalendarTags, operationProblemTypes.getCalendarTags)
            const listOperation = withMetadata((input: Omit<listCalendarTagsInput, never> = {}, context?: PomiRequestContext) => operations.listCalendarTags(operationInput<listCalendarTagsInput>({ ...input }), context), definitions.listCalendarTags, operationProblemTypes.listCalendarTags)
            const pages = (input: Omit<listCalendarTagsInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listCalendarTagsOutput>(operations.listCalendarTags(operationInput<listCalendarTagsInput>({ ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "data", definitions.listCalendarTags.authentication, requestPath, context)
            const listAll = async (input: Omit<listCalendarTagsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listCalendarTagsOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "catalogCourses": (() => {
            const getOperation = withMetadata((catalogCourseId: number, context?: PomiRequestContext) => operations.getCatalogCourses(operationInput<getCatalogCoursesInput>({ "id": catalogCourseId }), context), definitions.getCatalogCourses, operationProblemTypes.getCatalogCourses)
            const listOperation = withMetadata((input: Omit<listCatalogCoursesInput, never> = {}, context?: PomiRequestContext) => operations.listCatalogCourses(operationInput<listCatalogCoursesInput>({ ...input }), context), definitions.listCatalogCourses, operationProblemTypes.listCatalogCourses)
            const pages = (input: Omit<listCatalogCoursesInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listCatalogCoursesOutput>(operations.listCatalogCourses(operationInput<listCatalogCoursesInput>({ ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "data", definitions.listCatalogCourses.authentication, requestPath, context)
            const listAll = async (input: Omit<listCatalogCoursesInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listCatalogCoursesOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "catalogPrograms": (() => {
            const getOperation = withMetadata((catalogProgramId: number, context?: PomiRequestContext) => operations.getCatalogPrograms(operationInput<getCatalogProgramsInput>({ "id": catalogProgramId }), context), definitions.getCatalogPrograms, operationProblemTypes.getCatalogPrograms)
            const listOperation = withMetadata((input: Omit<listCatalogProgramsInput, never> = {}, context?: PomiRequestContext) => operations.listCatalogPrograms(operationInput<listCatalogProgramsInput>({ ...input }), context), definitions.listCatalogPrograms, operationProblemTypes.listCatalogPrograms)
            const pages = (input: Omit<listCatalogProgramsInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listCatalogProgramsOutput>(operations.listCatalogPrograms(operationInput<listCatalogProgramsInput>({ ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "data", definitions.listCatalogPrograms.authentication, requestPath, context)
            const listAll = async (input: Omit<listCatalogProgramsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listCatalogProgramsOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "catalogs": (() => {
            const getOperation = withMetadata((catalogId: number, context?: PomiRequestContext) => operations.getCatalogs(operationInput<getCatalogsInput>({ "id": catalogId }), context), definitions.getCatalogs, operationProblemTypes.getCatalogs)
            const listOperation = withMetadata((input: Omit<listCatalogsInput, never> = {}, context?: PomiRequestContext) => operations.listCatalogs(operationInput<listCatalogsInput>({ ...input }), context), definitions.listCatalogs, operationProblemTypes.listCatalogs)
            const pages = (input: Omit<listCatalogsInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listCatalogsOutput>(operations.listCatalogs(operationInput<listCatalogsInput>({ ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "data", definitions.listCatalogs.authentication, requestPath, context)
            const listAll = async (input: Omit<listCatalogsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listCatalogsOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "classes": (() => {
            const getOperation = withMetadata((classeId: number, context?: PomiRequestContext) => operations.getClasses(operationInput<getClassesInput>({ "id": classeId }), context), definitions.getClasses, operationProblemTypes.getClasses)
            const listOperation = withMetadata((input: Omit<listClassesInput, never> = {}, context?: PomiRequestContext) => operations.listClasses(operationInput<listClassesInput>({ ...input }), context), definitions.listClasses, operationProblemTypes.listClasses)
            const pages = (input: Omit<listClassesInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listClassesOutput>(operations.listClasses(operationInput<listClassesInput>({ ...{ ...input, page: input.page ?? 1, pageSize: input.pageSize ?? 20 } }), context), "data", definitions.listClasses.authentication, requestPath, context)
            const listAll = async (input: Omit<listClassesInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listClassesOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "classSchedules": (() => {
            const getOperation = withMetadata((classScheduleId: number, context?: PomiRequestContext) => operations.getClassSchedules(operationInput<getClassSchedulesInput>({ "id": classScheduleId }), context), definitions.getClassSchedules, operationProblemTypes.getClassSchedules)
            const listOperation = withMetadata((input: Omit<listClassSchedulesInput, never> = {}, context?: PomiRequestContext) => operations.listClassSchedules(operationInput<listClassSchedulesInput>({ ...input }), context), definitions.listClassSchedules, operationProblemTypes.listClassSchedules)
            const pages = (input: Omit<listClassSchedulesInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listClassSchedulesOutput>(operations.listClassSchedules(operationInput<listClassSchedulesInput>({ ...{ ...input, page: input.page ?? 1, pageSize: input.pageSize ?? 20 } }), context), "data", definitions.listClassSchedules.authentication, requestPath, context)
            const listAll = async (input: Omit<listClassSchedulesInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listClassSchedulesOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "coauthors": (() => {
            const getOperation = withMetadata((coauthorId: number, context?: PomiRequestContext) => operations.getCoauthors(operationInput<getCoauthorsInput>({ "id": coauthorId }), context), definitions.getCoauthors, operationProblemTypes.getCoauthors)
            const listOperation = withMetadata((input: Omit<listCoauthorsInput, never> = {}, context?: PomiRequestContext) => operations.listCoauthors(operationInput<listCoauthorsInput>({ ...input }), context), definitions.listCoauthors, operationProblemTypes.listCoauthors)
            const pages = (input: Omit<listCoauthorsInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listCoauthorsOutput>(operations.listCoauthors(operationInput<listCoauthorsInput>({ ...{ ...input, page: input.page ?? 1, pageSize: input.pageSize ?? 20 } }), context), "data", definitions.listCoauthors.authentication, requestPath, context)
            const listAll = async (input: Omit<listCoauthorsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listCoauthorsOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "coordinators": (() => {
            const getOperation = withMetadata((coordinatorId: number, context?: PomiRequestContext) => operations.getCoordinators(operationInput<getCoordinatorsInput>({ "id": coordinatorId }), context), definitions.getCoordinators, operationProblemTypes.getCoordinators)
            const listOperation = withMetadata((input: Omit<listCoordinatorsInput, never> = {}, context?: PomiRequestContext) => operations.listCoordinators(operationInput<listCoordinatorsInput>({ ...input }), context), definitions.listCoordinators, operationProblemTypes.listCoordinators)
            const pages = (input: Omit<listCoordinatorsInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listCoordinatorsOutput>(operations.listCoordinators(operationInput<listCoordinatorsInput>({ ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "data", definitions.listCoordinators.authentication, requestPath, context)
            const listAll = async (input: Omit<listCoordinatorsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listCoordinatorsOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "evaluationSummaries": (() => {
            const getByCourseAndProfessorOperation = withMetadata((input: Omit<getCourseProfessorEvaluationSummaryInput, never>, context?: PomiRequestContext) => operations.getCourseProfessorEvaluationSummary(operationInput<getCourseProfessorEvaluationSummaryInput>({ ...input }), context), definitions.getCourseProfessorEvaluationSummary, operationProblemTypes.getCourseProfessorEvaluationSummary)
            const listByCourseOperation = withMetadata((input: Omit<listCourseEvaluationSummariesInput, never> = {}, context?: PomiRequestContext) => operations.listCourseEvaluationSummaries(operationInput<listCourseEvaluationSummariesInput>({ ...input }), context), definitions.listCourseEvaluationSummaries, operationProblemTypes.listCourseEvaluationSummaries)
            const listByProfessorOperation = withMetadata((input: Omit<listProfessorEvaluationSummariesInput, never> = {}, context?: PomiRequestContext) => operations.listProfessorEvaluationSummaries(operationInput<listProfessorEvaluationSummariesInput>({ ...input }), context), definitions.listProfessorEvaluationSummaries, operationProblemTypes.listProfessorEvaluationSummaries)
            const listByCoursePages = (input: Omit<listCourseEvaluationSummariesInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listCourseEvaluationSummariesOutput>(operations.listCourseEvaluationSummaries(operationInput<listCourseEvaluationSummariesInput>({ ...{ ...input, page: input.page ?? 1, pageSize: input.pageSize ?? 20 } }), context), "data", definitions.listCourseEvaluationSummaries.authentication, requestPath, context)
            const listByCourseAll = async (input: Omit<listCourseEvaluationSummariesInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listCourseEvaluationSummariesOutput['data'][number]> = []; for await (const page of listByCoursePages(input, context)) items.push(...page.data); return items }
            const listByProfessorPages = (input: Omit<listProfessorEvaluationSummariesInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listProfessorEvaluationSummariesOutput>(operations.listProfessorEvaluationSummaries(operationInput<listProfessorEvaluationSummariesInput>({ ...{ ...input, page: input.page ?? 1, pageSize: input.pageSize ?? 20 } }), context), "data", definitions.listProfessorEvaluationSummaries.authentication, requestPath, context)
            const listByProfessorAll = async (input: Omit<listProfessorEvaluationSummariesInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listProfessorEvaluationSummariesOutput['data'][number]> = []; for await (const page of listByProfessorPages(input, context)) items.push(...page.data); return items }
            return { getByCourseAndProfessor: getByCourseAndProfessorOperation, listByCourse: listByCourseOperation, listByProfessor: listByProfessorOperation, listByCoursePages, listByCourseAll, listByProfessorPages, listByProfessorAll }
        })(),
        "courses": (() => {
            const getOperation = withMetadata((courseId: number, context?: PomiRequestContext) => operations.getCourses(operationInput<getCoursesInput>({ "id": courseId }), context), definitions.getCourses, operationProblemTypes.getCourses)
            const listOperation = withMetadata((input: Omit<listCoursesInput, never> = {}, context?: PomiRequestContext) => operations.listCourses(operationInput<listCoursesInput>({ ...input }), context), definitions.listCourses, operationProblemTypes.listCourses)
            const pages = (input: Omit<listCoursesInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listCoursesOutput>(operations.listCourses(operationInput<listCoursesInput>({ ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "data", definitions.listCourses.authentication, requestPath, context)
            const listAll = async (input: Omit<listCoursesInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listCoursesOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "curriculumSuggestions": (() => {
            const getOperation = withMetadata((curriculumSuggestionId: number, context?: PomiRequestContext) => operations.getCurriculumSuggestions(operationInput<getCurriculumSuggestionsInput>({ "id": curriculumSuggestionId }), context), definitions.getCurriculumSuggestions, operationProblemTypes.getCurriculumSuggestions)
            const listOperation = withMetadata((input: Omit<listCurriculumSuggestionsInput, never> = {}, context?: PomiRequestContext) => operations.listCurriculumSuggestions(operationInput<listCurriculumSuggestionsInput>({ ...input }), context), definitions.listCurriculumSuggestions, operationProblemTypes.listCurriculumSuggestions)
            const pages = (input: Omit<listCurriculumSuggestionsInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listCurriculumSuggestionsOutput>(operations.listCurriculumSuggestions(operationInput<listCurriculumSuggestionsInput>({ ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "data", definitions.listCurriculumSuggestions.authentication, requestPath, context)
            const listAll = async (input: Omit<listCurriculumSuggestionsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listCurriculumSuggestionsOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "dailyMenus": (() => {
            const getOperation = withMetadata((dailyMenuId: number, context?: PomiRequestContext) => operations.getDailyMenus(operationInput<getDailyMenusInput>({ "id": dailyMenuId }), context), definitions.getDailyMenus, operationProblemTypes.getDailyMenus)
            const listOperation = withMetadata((input: Omit<listDailyMenusInput, never> = {}, context?: PomiRequestContext) => operations.listDailyMenus(operationInput<listDailyMenusInput>({ ...input }), context), definitions.listDailyMenus, operationProblemTypes.listDailyMenus)
            const pages = (input: Omit<listDailyMenusInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listDailyMenusOutput>(operations.listDailyMenus(operationInput<listDailyMenusInput>({ ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "data", definitions.listDailyMenus.authentication, requestPath, context)
            const listAll = async (input: Omit<listDailyMenusInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listDailyMenusOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "departments": (() => {
            const getOperation = withMetadata((departmentId: number, context?: PomiRequestContext) => operations.getDepartments(operationInput<getDepartmentsInput>({ "id": departmentId }), context), definitions.getDepartments, operationProblemTypes.getDepartments)
            const listOperation = withMetadata((input: Omit<listDepartmentsInput, never> = {}, context?: PomiRequestContext) => operations.listDepartments(operationInput<listDepartmentsInput>({ ...input }), context), definitions.listDepartments, operationProblemTypes.listDepartments)
            const pages = (input: Omit<listDepartmentsInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listDepartmentsOutput>(operations.listDepartments(operationInput<listDepartmentsInput>({ ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "data", definitions.listDepartments.authentication, requestPath, context)
            const listAll = async (input: Omit<listDepartmentsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listDepartmentsOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "exchangeNotices": (() => {
            const getOperation = withMetadata((exchangeNoticeId: number, context?: PomiRequestContext) => operations.getExchangeNotices(operationInput<getExchangeNoticesInput>({ "id": exchangeNoticeId }), context), definitions.getExchangeNotices, operationProblemTypes.getExchangeNotices)
            const listOperation = withMetadata((input: Omit<listExchangeNoticesInput, never> = {}, context?: PomiRequestContext) => operations.listExchangeNotices(operationInput<listExchangeNoticesInput>({ ...input }), context), definitions.listExchangeNotices, operationProblemTypes.listExchangeNotices)
            const pages = (input: Omit<listExchangeNoticesInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listExchangeNoticesOutput>(operations.listExchangeNotices(operationInput<listExchangeNoticesInput>({ ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "data", definitions.listExchangeNotices.authentication, requestPath, context)
            const listAll = async (input: Omit<listExchangeNoticesInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listExchangeNoticesOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "keywords": (() => {
            const getOperation = withMetadata((keywordId: number, context?: PomiRequestContext) => operations.getKeywords(operationInput<getKeywordsInput>({ "id": keywordId }), context), definitions.getKeywords, operationProblemTypes.getKeywords)
            const listOperation = withMetadata((input: Omit<listKeywordsInput, never> = {}, context?: PomiRequestContext) => operations.listKeywords(operationInput<listKeywordsInput>({ ...input }), context), definitions.listKeywords, operationProblemTypes.listKeywords)
            const pages = (input: Omit<listKeywordsInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listKeywordsOutput>(operations.listKeywords(operationInput<listKeywordsInput>({ ...{ ...input, page: input.page ?? 1, pageSize: input.pageSize ?? 20 } }), context), "data", definitions.listKeywords.authentication, requestPath, context)
            const listAll = async (input: Omit<listKeywordsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listKeywordsOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "languages": (() => {
            const getOperation = withMetadata((languageId: number, context?: PomiRequestContext) => operations.getLanguages(operationInput<getLanguagesInput>({ "id": languageId }), context), definitions.getLanguages, operationProblemTypes.getLanguages)
            const listOperation = withMetadata((input: Omit<listLanguagesInput, never> = {}, context?: PomiRequestContext) => operations.listLanguages(operationInput<listLanguagesInput>({ ...input }), context), definitions.listLanguages, operationProblemTypes.listLanguages)
            const pages = (input: Omit<listLanguagesInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listLanguagesOutput>(operations.listLanguages(operationInput<listLanguagesInput>({ ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "data", definitions.listLanguages.authentication, requestPath, context)
            const listAll = async (input: Omit<listLanguagesInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listLanguagesOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "professorDataPortalProfiles": (() => {
            const getOperation = withMetadata((profileId: number, context?: PomiRequestContext) => operations.getProfessorDataPortalProfiles(operationInput<getProfessorDataPortalProfilesInput>({ "id": profileId }), context), definitions.getProfessorDataPortalProfiles, operationProblemTypes.getProfessorDataPortalProfiles)
            const listOperation = withMetadata((input: Omit<listProfessorDataPortalProfilesInput, never> = {}, context?: PomiRequestContext) => operations.listProfessorDataPortalProfiles(operationInput<listProfessorDataPortalProfilesInput>({ ...input }), context), definitions.listProfessorDataPortalProfiles, operationProblemTypes.listProfessorDataPortalProfiles)
            const pages = (input: Omit<listProfessorDataPortalProfilesInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listProfessorDataPortalProfilesOutput>(operations.listProfessorDataPortalProfiles(operationInput<listProfessorDataPortalProfilesInput>({ ...{ ...input, page: input.page ?? 1, pageSize: input.pageSize ?? 20 } }), context), "data", definitions.listProfessorDataPortalProfiles.authentication, requestPath, context)
            const listAll = async (input: Omit<listProfessorDataPortalProfilesInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listProfessorDataPortalProfilesOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "professorPositions": (() => {
            const getOperation = withMetadata((professorPositionId: number, context?: PomiRequestContext) => operations.getProfessorPositions(operationInput<getProfessorPositionsInput>({ "id": professorPositionId }), context), definitions.getProfessorPositions, operationProblemTypes.getProfessorPositions)
            const listOperation = withMetadata((input: Omit<listProfessorPositionsInput, never> = {}, context?: PomiRequestContext) => operations.listProfessorPositions(operationInput<listProfessorPositionsInput>({ ...input }), context), definitions.listProfessorPositions, operationProblemTypes.listProfessorPositions)
            const pages = (input: Omit<listProfessorPositionsInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listProfessorPositionsOutput>(operations.listProfessorPositions(operationInput<listProfessorPositionsInput>({ ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "data", definitions.listProfessorPositions.authentication, requestPath, context)
            const listAll = async (input: Omit<listProfessorPositionsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listProfessorPositionsOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "professors": (() => {
            const getOperation = withMetadata((professorId: number, context?: PomiRequestContext) => operations.getProfessors(operationInput<getProfessorsInput>({ "id": professorId }), context), definitions.getProfessors, operationProblemTypes.getProfessors)
            const listOperation = withMetadata((input: Omit<listProfessorsInput, never> = {}, context?: PomiRequestContext) => operations.listProfessors(operationInput<listProfessorsInput>({ ...input }), context), definitions.listProfessors, operationProblemTypes.listProfessors)
            const pages = (input: Omit<listProfessorsInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listProfessorsOutput>(operations.listProfessors(operationInput<listProfessorsInput>({ ...{ ...input, page: input.page ?? 1, pageSize: input.pageSize ?? 20 } }), context), "data", definitions.listProfessors.authentication, requestPath, context)
            const listAll = async (input: Omit<listProfessorsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listProfessorsOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "programs": (() => {
            const getOperation = withMetadata((programId: number, context?: PomiRequestContext) => operations.getPrograms(operationInput<getProgramsInput>({ "id": programId }), context), definitions.getPrograms, operationProblemTypes.getPrograms)
            const listOperation = withMetadata((input: Omit<listProgramsInput, never> = {}, context?: PomiRequestContext) => operations.listPrograms(operationInput<listProgramsInput>({ ...input }), context), definitions.listPrograms, operationProblemTypes.listPrograms)
            const pages = (input: Omit<listProgramsInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listProgramsOutput>(operations.listPrograms(operationInput<listProgramsInput>({ ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "data", definitions.listPrograms.authentication, requestPath, context)
            const listAll = async (input: Omit<listProgramsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listProgramsOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "rooms": (() => {
            const getOperation = withMetadata((roomId: number, context?: PomiRequestContext) => operations.getRooms(operationInput<getRoomsInput>({ "id": roomId }), context), definitions.getRooms, operationProblemTypes.getRooms)
            const listOperation = withMetadata((input: Omit<listRoomsInput, never> = {}, context?: PomiRequestContext) => operations.listRooms(operationInput<listRoomsInput>({ ...input }), context), definitions.listRooms, operationProblemTypes.listRooms)
            const pages = (input: Omit<listRoomsInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listRoomsOutput>(operations.listRooms(operationInput<listRoomsInput>({ ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "data", definitions.listRooms.authentication, requestPath, context)
            const listAll = async (input: Omit<listRoomsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listRoomsOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "specializations": (() => {
            const getOperation = withMetadata((specializationId: number, context?: PomiRequestContext) => operations.getSpecializations(operationInput<getSpecializationsInput>({ "id": specializationId }), context), definitions.getSpecializations, operationProblemTypes.getSpecializations)
            const listOperation = withMetadata((input: Omit<listSpecializationsInput, never> = {}, context?: PomiRequestContext) => operations.listSpecializations(operationInput<listSpecializationsInput>({ ...input }), context), definitions.listSpecializations, operationProblemTypes.listSpecializations)
            const pages = (input: Omit<listSpecializationsInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listSpecializationsOutput>(operations.listSpecializations(operationInput<listSpecializationsInput>({ ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "data", definitions.listSpecializations.authentication, requestPath, context)
            const listAll = async (input: Omit<listSpecializationsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listSpecializationsOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "studyPeriods": (() => {
            const getOperation = withMetadata((studyPeriodId: number, context?: PomiRequestContext) => operations.getStudyPeriods(operationInput<getStudyPeriodsInput>({ "id": studyPeriodId }), context), definitions.getStudyPeriods, operationProblemTypes.getStudyPeriods)
            const listOperation = withMetadata((input: Omit<listStudyPeriodsInput, never> = {}, context?: PomiRequestContext) => operations.listStudyPeriods(operationInput<listStudyPeriodsInput>({ ...input }), context), definitions.listStudyPeriods, operationProblemTypes.listStudyPeriods)
            const pages = (input: Omit<listStudyPeriodsInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listStudyPeriodsOutput>(operations.listStudyPeriods(operationInput<listStudyPeriodsInput>({ ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "data", definitions.listStudyPeriods.authentication, requestPath, context)
            const listAll = async (input: Omit<listStudyPeriodsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listStudyPeriodsOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "units": (() => {
            const getOperation = withMetadata((unitId: number, context?: PomiRequestContext) => operations.getUnits(operationInput<getUnitsInput>({ "id": unitId }), context), definitions.getUnits, operationProblemTypes.getUnits)
            const listOperation = withMetadata((input: Omit<listUnitsInput, never> = {}, context?: PomiRequestContext) => operations.listUnits(operationInput<listUnitsInput>({ ...input }), context), definitions.listUnits, operationProblemTypes.listUnits)
            const pages = (input: Omit<listUnitsInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listUnitsOutput>(operations.listUnits(operationInput<listUnitsInput>({ ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "data", definitions.listUnits.authentication, requestPath, context)
            const listAll = async (input: Omit<listUnitsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listUnitsOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "exchangePlaces": (() => {
            const listOperation = withMetadata((input: Omit<listExchangePlacesInput, never> = {}, context?: PomiRequestContext) => operations.listExchangePlaces(operationInput<listExchangePlacesInput>({ ...input }), context), definitions.listExchangePlaces, operationProblemTypes.listExchangePlaces)
            const pages = (input: Omit<listExchangePlacesInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listExchangePlacesOutput>(operations.listExchangePlaces(operationInput<listExchangePlacesInput>({ ...{ ...input, pageSize: input.pageSize ?? 'all' } }), context), "data", definitions.listExchangePlaces.authentication, requestPath, context)
            const listAll = async (input: Omit<listExchangePlacesInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listExchangePlacesOutput['data'][number]> = []; for await (const page of pages(input, context)) items.push(...page.data); return items }
            return { list: listOperation, pages, listAll }
        })(),
    }
}

export type Resources = ReturnType<typeof bindResources>
