import type { PomiRequestContext } from '../../runtime/client.js'
import type { AuthenticationMode } from '../../runtime/operation.js'
import { operationDefinitions as definitions } from './operations.js'
import type { getCalendarEventsInput, getCalendarEventsOutput, getCalendarTagsInput, getCalendarTagsOutput, getCatalogCoursesInput, getCatalogCoursesOutput, getCatalogProgramInput, getCatalogProgramOutput, getCatalogsInput, getCatalogsOutput, getClassesInput, getClassesOutput, getClassSchedulesInput, getClassSchedulesOutput, getCoauthorsInput, getCoauthorsOutput, getCoordinatorsInput, getCoordinatorsOutput, getCoursesInput, getCoursesOutput, getCurriculumSuggestionsInput, getCurriculumSuggestionsOutput, getDailyMenusInput, getDailyMenusOutput, getDepartmentsInput, getDepartmentsOutput, getExchangeNoticesInput, getExchangeNoticesOutput, getKeywordsInput, getKeywordsOutput, getLanguagesInput, getLanguagesOutput, getProfessorDataPortalProfilesInput, getProfessorDataPortalProfilesOutput, getProfessorPositionsInput, getProfessorPositionsOutput, getProfessorsInput, getProfessorsOutput, getProgramsInput, getProgramsOutput, getRoomsInput, getRoomsOutput, getSpecializationsInput, getSpecializationsOutput, getStudyPeriodsInput, getStudyPeriodsOutput, getUnitsInput, getUnitsOutput, listCalendarInput, listCalendarOutput, listCalendarEventsInput, listCalendarEventsOutput, listCalendarTagsInput, listCalendarTagsOutput, listCatalogCoursesInput, listCatalogCoursesOutput, listCatalogProgramInput, listCatalogProgramOutput, listCatalogsInput, listCatalogsOutput, listClassesInput, listClassesOutput, listClassSchedulesInput, listClassSchedulesOutput, listCoauthorsInput, listCoauthorsOutput, listCoordinatorsInput, listCoordinatorsOutput, listCoursesInput, listCoursesOutput, listCoursesEvaluationSummariesInput, listCoursesEvaluationSummariesOutput, listCurriculumSuggestionsInput, listCurriculumSuggestionsOutput, listDailyMenusInput, listDailyMenusOutput, listDepartmentsInput, listDepartmentsOutput, listEvaluationSummariesInput, listEvaluationSummariesOutput, listExchangeNoticesInput, listExchangeNoticesOutput, listExchangePlacesInput, listExchangePlacesOutput, listKeywordsInput, listKeywordsOutput, listLanguagesInput, listLanguagesOutput, listProfessorDataPortalProfilesInput, listProfessorDataPortalProfilesOutput, listProfessorPositionsInput, listProfessorPositionsOutput, listProfessorsInput, listProfessorsOutput, listProfessorsEvaluationSummariesInput, listProfessorsEvaluationSummariesOutput, listProgramsInput, listProgramsOutput, listRoomsInput, listRoomsOutput, listSpecializationsInput, listSpecializationsOutput, listStudyPeriodsInput, listStudyPeriodsOutput, listUnitsInput, listUnitsOutput } from './operations.js'
import { operationProblemTypes } from './problems.js'

type OperationFunction<Input, Output> = (input: Input, context?: PomiRequestContext) => Promise<Output>
type Operations = {
    getCalendarEvents: OperationFunction<getCalendarEventsInput, getCalendarEventsOutput>
    getCalendarTags: OperationFunction<getCalendarTagsInput, getCalendarTagsOutput>
    getCatalogCourses: OperationFunction<getCatalogCoursesInput, getCatalogCoursesOutput>
    getCatalogProgram: OperationFunction<getCatalogProgramInput, getCatalogProgramOutput>
    getCatalogs: OperationFunction<getCatalogsInput, getCatalogsOutput>
    getClasses: OperationFunction<getClassesInput, getClassesOutput>
    getClassSchedules: OperationFunction<getClassSchedulesInput, getClassSchedulesOutput>
    getCoauthors: OperationFunction<getCoauthorsInput, getCoauthorsOutput>
    getCoordinators: OperationFunction<getCoordinatorsInput, getCoordinatorsOutput>
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
    listCalendar: OperationFunction<listCalendarInput, listCalendarOutput>
    listCalendarEvents: OperationFunction<listCalendarEventsInput, listCalendarEventsOutput>
    listCalendarTags: OperationFunction<listCalendarTagsInput, listCalendarTagsOutput>
    listCatalogCourses: OperationFunction<listCatalogCoursesInput, listCatalogCoursesOutput>
    listCatalogProgram: OperationFunction<listCatalogProgramInput, listCatalogProgramOutput>
    listCatalogs: OperationFunction<listCatalogsInput, listCatalogsOutput>
    listClasses: OperationFunction<listClassesInput, listClassesOutput>
    listClassSchedules: OperationFunction<listClassSchedulesInput, listClassSchedulesOutput>
    listCoauthors: OperationFunction<listCoauthorsInput, listCoauthorsOutput>
    listCoordinators: OperationFunction<listCoordinatorsInput, listCoordinatorsOutput>
    listCourses: OperationFunction<listCoursesInput, listCoursesOutput>
    listCoursesEvaluationSummaries: OperationFunction<listCoursesEvaluationSummariesInput, listCoursesEvaluationSummariesOutput>
    listCurriculumSuggestions: OperationFunction<listCurriculumSuggestionsInput, listCurriculumSuggestionsOutput>
    listDailyMenus: OperationFunction<listDailyMenusInput, listDailyMenusOutput>
    listDepartments: OperationFunction<listDepartmentsInput, listDepartmentsOutput>
    listEvaluationSummaries: OperationFunction<listEvaluationSummariesInput, listEvaluationSummariesOutput>
    listExchangeNotices: OperationFunction<listExchangeNoticesInput, listExchangeNoticesOutput>
    listExchangePlaces: OperationFunction<listExchangePlacesInput, listExchangePlacesOutput>
    listKeywords: OperationFunction<listKeywordsInput, listKeywordsOutput>
    listLanguages: OperationFunction<listLanguagesInput, listLanguagesOutput>
    listProfessorDataPortalProfiles: OperationFunction<listProfessorDataPortalProfilesInput, listProfessorDataPortalProfilesOutput>
    listProfessorPositions: OperationFunction<listProfessorPositionsInput, listProfessorPositionsOutput>
    listProfessors: OperationFunction<listProfessorsInput, listProfessorsOutput>
    listProfessorsEvaluationSummaries: OperationFunction<listProfessorsEvaluationSummariesInput, listProfessorsEvaluationSummariesOutput>
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

function valueAtPath(value: unknown, path: string) {
    return path.split('.').reduce<unknown>((current, key) => typeof current === 'object' && current !== null ? (current as Record<string, unknown>)[key] : undefined, value)
}

async function* paginateByLink<Page>(firstPage: Promise<Page>, target: "data", authentication: AuthenticationMode, nextField: string, requestPath: RequestPath, context?: PomiRequestContext): AsyncIterable<Page> {
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
        "calendarEvents": (() => {
            const getOperation = withMetadata((calendarEventId: number, context?: PomiRequestContext) => operations.getCalendarEvents(operationInput<getCalendarEventsInput>({ "id": calendarEventId }), context), definitions.getCalendarEvents, operationProblemTypes.getCalendarEvents)
            const listOperation = withMetadata((input: Omit<listCalendarEventsInput, never> = {}, context?: PomiRequestContext) => operations.listCalendarEvents(operationInput<listCalendarEventsInput>({ ...input }), context), definitions.listCalendarEvents, operationProblemTypes.listCalendarEvents)
            return { get: getOperation, list: listOperation }
        })(),
        "calendarTags": (() => {
            const getOperation = withMetadata((calendarTagId: number, context?: PomiRequestContext) => operations.getCalendarTags(operationInput<getCalendarTagsInput>({ "id": calendarTagId }), context), definitions.getCalendarTags, operationProblemTypes.getCalendarTags)
            const listOperation = withMetadata((input: Omit<listCalendarTagsInput, never> = {}, context?: PomiRequestContext) => operations.listCalendarTags(operationInput<listCalendarTagsInput>({ ...input }), context), definitions.listCalendarTags, operationProblemTypes.listCalendarTags)
            return { get: getOperation, list: listOperation }
        })(),
        "catalogCourses": (() => {
            const getOperation = withMetadata((catalogCourseId: number, context?: PomiRequestContext) => operations.getCatalogCourses(operationInput<getCatalogCoursesInput>({ "id": catalogCourseId }), context), definitions.getCatalogCourses, operationProblemTypes.getCatalogCourses)
            const listOperation = withMetadata((input: Omit<listCatalogCoursesInput, never> = {}, context?: PomiRequestContext) => operations.listCatalogCourses(operationInput<listCatalogCoursesInput>({ ...input }), context), definitions.listCatalogCourses, operationProblemTypes.listCatalogCourses)
            const pages = (input: Omit<listCatalogCoursesInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listCatalogCoursesOutput>(operations.listCatalogCourses(operationInput<listCatalogCoursesInput>({ ...{ ...input, "page": input["page"] ?? 1, "pageSize": input["pageSize"] ?? 100 } }), context), "data", definitions.listCatalogCourses.authentication, "_paths.next", requestPath, context)
            const listAll = async (input: Omit<listCatalogCoursesInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listCatalogCoursesOutput["data"][number]> = []; for await (const page of pages(input, context)) items.push(...page["data"]); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "catalogProgram": (() => {
            const getOperation = withMetadata((catalogProgramId: number, context?: PomiRequestContext) => operations.getCatalogProgram(operationInput<getCatalogProgramInput>({ "id": catalogProgramId }), context), definitions.getCatalogProgram, operationProblemTypes.getCatalogProgram)
            const listOperation = withMetadata((input: Omit<listCatalogProgramInput, never> = {}, context?: PomiRequestContext) => operations.listCatalogProgram(operationInput<listCatalogProgramInput>({ ...input }), context), definitions.listCatalogProgram, operationProblemTypes.listCatalogProgram)
            return { get: getOperation, list: listOperation }
        })(),
        "catalogs": (() => {
            const getOperation = withMetadata((catalogId: number, context?: PomiRequestContext) => operations.getCatalogs(operationInput<getCatalogsInput>({ "id": catalogId }), context), definitions.getCatalogs, operationProblemTypes.getCatalogs)
            const listOperation = withMetadata((input: Omit<listCatalogsInput, never> = {}, context?: PomiRequestContext) => operations.listCatalogs(operationInput<listCatalogsInput>({ ...input }), context), definitions.listCatalogs, operationProblemTypes.listCatalogs)
            return { get: getOperation, list: listOperation }
        })(),
        "classes": (() => {
            const getOperation = withMetadata((classeId: number, context?: PomiRequestContext) => operations.getClasses(operationInput<getClassesInput>({ "id": classeId }), context), definitions.getClasses, operationProblemTypes.getClasses)
            const listOperation = withMetadata((input: Omit<listClassesInput, never> = {}, context?: PomiRequestContext) => operations.listClasses(operationInput<listClassesInput>({ ...input }), context), definitions.listClasses, operationProblemTypes.listClasses)
            const pages = (input: Omit<listClassesInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listClassesOutput>(operations.listClasses(operationInput<listClassesInput>({ ...{ ...input, "page": input["page"] ?? 1, "pageSize": input["pageSize"] ?? 100 } }), context), "data", definitions.listClasses.authentication, "_paths.next", requestPath, context)
            const listAll = async (input: Omit<listClassesInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listClassesOutput["data"][number]> = []; for await (const page of pages(input, context)) items.push(...page["data"]); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "classSchedules": (() => {
            const getOperation = withMetadata((classScheduleId: number, context?: PomiRequestContext) => operations.getClassSchedules(operationInput<getClassSchedulesInput>({ "id": classScheduleId }), context), definitions.getClassSchedules, operationProblemTypes.getClassSchedules)
            const listOperation = withMetadata((input: Omit<listClassSchedulesInput, never> = {}, context?: PomiRequestContext) => operations.listClassSchedules(operationInput<listClassSchedulesInput>({ ...input }), context), definitions.listClassSchedules, operationProblemTypes.listClassSchedules)
            const pages = (input: Omit<listClassSchedulesInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listClassSchedulesOutput>(operations.listClassSchedules(operationInput<listClassSchedulesInput>({ ...{ ...input, "page": input["page"] ?? 1, "pageSize": input["pageSize"] ?? 100 } }), context), "data", definitions.listClassSchedules.authentication, "_paths.next", requestPath, context)
            const listAll = async (input: Omit<listClassSchedulesInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listClassSchedulesOutput["data"][number]> = []; for await (const page of pages(input, context)) items.push(...page["data"]); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "coauthors": (() => {
            const getOperation = withMetadata((coauthorId: number, context?: PomiRequestContext) => operations.getCoauthors(operationInput<getCoauthorsInput>({ "id": coauthorId }), context), definitions.getCoauthors, operationProblemTypes.getCoauthors)
            const listOperation = withMetadata((input: Omit<listCoauthorsInput, never> = {}, context?: PomiRequestContext) => operations.listCoauthors(operationInput<listCoauthorsInput>({ ...input }), context), definitions.listCoauthors, operationProblemTypes.listCoauthors)
            const pages = (input: Omit<listCoauthorsInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listCoauthorsOutput>(operations.listCoauthors(operationInput<listCoauthorsInput>({ ...{ ...input, "page": input["page"] ?? 1, "pageSize": input["pageSize"] ?? 100 } }), context), "data", definitions.listCoauthors.authentication, "_paths.next", requestPath, context)
            const listAll = async (input: Omit<listCoauthorsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listCoauthorsOutput["data"][number]> = []; for await (const page of pages(input, context)) items.push(...page["data"]); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "coordinators": (() => {
            const getOperation = withMetadata((coordinatorId: number, context?: PomiRequestContext) => operations.getCoordinators(operationInput<getCoordinatorsInput>({ "id": coordinatorId }), context), definitions.getCoordinators, operationProblemTypes.getCoordinators)
            const listOperation = withMetadata((input: Omit<listCoordinatorsInput, never> = {}, context?: PomiRequestContext) => operations.listCoordinators(operationInput<listCoordinatorsInput>({ ...input }), context), definitions.listCoordinators, operationProblemTypes.listCoordinators)
            const pages = (input: Omit<listCoordinatorsInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listCoordinatorsOutput>(operations.listCoordinators(operationInput<listCoordinatorsInput>({ ...{ ...input, "page": input["page"] ?? 1, "pageSize": input["pageSize"] ?? 100 } }), context), "data", definitions.listCoordinators.authentication, "_paths.next", requestPath, context)
            const listAll = async (input: Omit<listCoordinatorsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listCoordinatorsOutput["data"][number]> = []; for await (const page of pages(input, context)) items.push(...page["data"]); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "courses": (() => {
            const getOperation = withMetadata((courseId: number, context?: PomiRequestContext) => operations.getCourses(operationInput<getCoursesInput>({ "id": courseId }), context), definitions.getCourses, operationProblemTypes.getCourses)
            const listOperation = withMetadata((input: Omit<listCoursesInput, never> = {}, context?: PomiRequestContext) => operations.listCourses(operationInput<listCoursesInput>({ ...input }), context), definitions.listCourses, operationProblemTypes.listCourses)
            const pages = (input: Omit<listCoursesInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listCoursesOutput>(operations.listCourses(operationInput<listCoursesInput>({ ...{ ...input, "page": input["page"] ?? 1, "pageSize": input["pageSize"] ?? 20 } }), context), "data", definitions.listCourses.authentication, "_paths.next", requestPath, context)
            const listAll = async (input: Omit<listCoursesInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listCoursesOutput["data"][number]> = []; for await (const page of pages(input, context)) items.push(...page["data"]); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "curriculumSuggestions": (() => {
            const getOperation = withMetadata((curriculumSuggestionId: number, context?: PomiRequestContext) => operations.getCurriculumSuggestions(operationInput<getCurriculumSuggestionsInput>({ "id": curriculumSuggestionId }), context), definitions.getCurriculumSuggestions, operationProblemTypes.getCurriculumSuggestions)
            const listOperation = withMetadata((input: Omit<listCurriculumSuggestionsInput, never> = {}, context?: PomiRequestContext) => operations.listCurriculumSuggestions(operationInput<listCurriculumSuggestionsInput>({ ...input }), context), definitions.listCurriculumSuggestions, operationProblemTypes.listCurriculumSuggestions)
            return { get: getOperation, list: listOperation }
        })(),
        "dailyMenus": (() => {
            const getOperation = withMetadata((dailyMenuId: number, context?: PomiRequestContext) => operations.getDailyMenus(operationInput<getDailyMenusInput>({ "id": dailyMenuId }), context), definitions.getDailyMenus, operationProblemTypes.getDailyMenus)
            const listOperation = withMetadata((input: Omit<listDailyMenusInput, never> = {}, context?: PomiRequestContext) => operations.listDailyMenus(operationInput<listDailyMenusInput>({ ...input }), context), definitions.listDailyMenus, operationProblemTypes.listDailyMenus)
            return { get: getOperation, list: listOperation }
        })(),
        "departments": (() => {
            const getOperation = withMetadata((departmentId: number, context?: PomiRequestContext) => operations.getDepartments(operationInput<getDepartmentsInput>({ "id": departmentId }), context), definitions.getDepartments, operationProblemTypes.getDepartments)
            const listOperation = withMetadata((input: Omit<listDepartmentsInput, never> = {}, context?: PomiRequestContext) => operations.listDepartments(operationInput<listDepartmentsInput>({ ...input }), context), definitions.listDepartments, operationProblemTypes.listDepartments)
            return { get: getOperation, list: listOperation }
        })(),
        "exchangeNotices": (() => {
            const getOperation = withMetadata((exchangeNoticeId: number, context?: PomiRequestContext) => operations.getExchangeNotices(operationInput<getExchangeNoticesInput>({ "id": exchangeNoticeId }), context), definitions.getExchangeNotices, operationProblemTypes.getExchangeNotices)
            const listOperation = withMetadata((input: Omit<listExchangeNoticesInput, never> = {}, context?: PomiRequestContext) => operations.listExchangeNotices(operationInput<listExchangeNoticesInput>({ ...input }), context), definitions.listExchangeNotices, operationProblemTypes.listExchangeNotices)
            return { get: getOperation, list: listOperation }
        })(),
        "keywords": (() => {
            const getOperation = withMetadata((keywordId: number, context?: PomiRequestContext) => operations.getKeywords(operationInput<getKeywordsInput>({ "id": keywordId }), context), definitions.getKeywords, operationProblemTypes.getKeywords)
            const listOperation = withMetadata((input: Omit<listKeywordsInput, never> = {}, context?: PomiRequestContext) => operations.listKeywords(operationInput<listKeywordsInput>({ ...input }), context), definitions.listKeywords, operationProblemTypes.listKeywords)
            const pages = (input: Omit<listKeywordsInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listKeywordsOutput>(operations.listKeywords(operationInput<listKeywordsInput>({ ...{ ...input, "page": input["page"] ?? 1, "pageSize": input["pageSize"] ?? 100 } }), context), "data", definitions.listKeywords.authentication, "_paths.next", requestPath, context)
            const listAll = async (input: Omit<listKeywordsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listKeywordsOutput["data"][number]> = []; for await (const page of pages(input, context)) items.push(...page["data"]); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "languages": (() => {
            const getOperation = withMetadata((languageId: number, context?: PomiRequestContext) => operations.getLanguages(operationInput<getLanguagesInput>({ "id": languageId }), context), definitions.getLanguages, operationProblemTypes.getLanguages)
            const listOperation = withMetadata((input: Omit<listLanguagesInput, never> = {}, context?: PomiRequestContext) => operations.listLanguages(operationInput<listLanguagesInput>({ ...input }), context), definitions.listLanguages, operationProblemTypes.listLanguages)
            return { get: getOperation, list: listOperation }
        })(),
        "professorDataPortalProfiles": (() => {
            const getOperation = withMetadata((professorDataPortalProfileId: number, context?: PomiRequestContext) => operations.getProfessorDataPortalProfiles(operationInput<getProfessorDataPortalProfilesInput>({ "id": professorDataPortalProfileId }), context), definitions.getProfessorDataPortalProfiles, operationProblemTypes.getProfessorDataPortalProfiles)
            const listOperation = withMetadata((input: Omit<listProfessorDataPortalProfilesInput, never> = {}, context?: PomiRequestContext) => operations.listProfessorDataPortalProfiles(operationInput<listProfessorDataPortalProfilesInput>({ ...input }), context), definitions.listProfessorDataPortalProfiles, operationProblemTypes.listProfessorDataPortalProfiles)
            const pages = (input: Omit<listProfessorDataPortalProfilesInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listProfessorDataPortalProfilesOutput>(operations.listProfessorDataPortalProfiles(operationInput<listProfessorDataPortalProfilesInput>({ ...{ ...input, "page": input["page"] ?? 1, "pageSize": input["pageSize"] ?? 100 } }), context), "data", definitions.listProfessorDataPortalProfiles.authentication, "_paths.next", requestPath, context)
            const listAll = async (input: Omit<listProfessorDataPortalProfilesInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listProfessorDataPortalProfilesOutput["data"][number]> = []; for await (const page of pages(input, context)) items.push(...page["data"]); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "professorPositions": (() => {
            const getOperation = withMetadata((professorPositionId: number, context?: PomiRequestContext) => operations.getProfessorPositions(operationInput<getProfessorPositionsInput>({ "id": professorPositionId }), context), definitions.getProfessorPositions, operationProblemTypes.getProfessorPositions)
            const listOperation = withMetadata((input: Omit<listProfessorPositionsInput, never> = {}, context?: PomiRequestContext) => operations.listProfessorPositions(operationInput<listProfessorPositionsInput>({ ...input }), context), definitions.listProfessorPositions, operationProblemTypes.listProfessorPositions)
            return { get: getOperation, list: listOperation }
        })(),
        "professors": (() => {
            const getOperation = withMetadata((professorId: number, context?: PomiRequestContext) => operations.getProfessors(operationInput<getProfessorsInput>({ "id": professorId }), context), definitions.getProfessors, operationProblemTypes.getProfessors)
            const listOperation = withMetadata((input: Omit<listProfessorsInput, never> = {}, context?: PomiRequestContext) => operations.listProfessors(operationInput<listProfessorsInput>({ ...input }), context), definitions.listProfessors, operationProblemTypes.listProfessors)
            const pages = (input: Omit<listProfessorsInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listProfessorsOutput>(operations.listProfessors(operationInput<listProfessorsInput>({ ...{ ...input, "page": input["page"] ?? 1, "pageSize": input["pageSize"] ?? 100 } }), context), "data", definitions.listProfessors.authentication, "_paths.next", requestPath, context)
            const listAll = async (input: Omit<listProfessorsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listProfessorsOutput["data"][number]> = []; for await (const page of pages(input, context)) items.push(...page["data"]); return items }
            return { get: getOperation, list: listOperation, pages, listAll }
        })(),
        "programs": (() => {
            const getOperation = withMetadata((programId: number, context?: PomiRequestContext) => operations.getPrograms(operationInput<getProgramsInput>({ "id": programId }), context), definitions.getPrograms, operationProblemTypes.getPrograms)
            const listOperation = withMetadata((input: Omit<listProgramsInput, never> = {}, context?: PomiRequestContext) => operations.listPrograms(operationInput<listProgramsInput>({ ...input }), context), definitions.listPrograms, operationProblemTypes.listPrograms)
            return { get: getOperation, list: listOperation }
        })(),
        "rooms": (() => {
            const getOperation = withMetadata((roomId: number, context?: PomiRequestContext) => operations.getRooms(operationInput<getRoomsInput>({ "id": roomId }), context), definitions.getRooms, operationProblemTypes.getRooms)
            const listOperation = withMetadata((input: Omit<listRoomsInput, never> = {}, context?: PomiRequestContext) => operations.listRooms(operationInput<listRoomsInput>({ ...input }), context), definitions.listRooms, operationProblemTypes.listRooms)
            return { get: getOperation, list: listOperation }
        })(),
        "specializations": (() => {
            const getOperation = withMetadata((specializationId: number, context?: PomiRequestContext) => operations.getSpecializations(operationInput<getSpecializationsInput>({ "id": specializationId }), context), definitions.getSpecializations, operationProblemTypes.getSpecializations)
            const listOperation = withMetadata((input: Omit<listSpecializationsInput, never> = {}, context?: PomiRequestContext) => operations.listSpecializations(operationInput<listSpecializationsInput>({ ...input }), context), definitions.listSpecializations, operationProblemTypes.listSpecializations)
            return { get: getOperation, list: listOperation }
        })(),
        "studyPeriods": (() => {
            const getOperation = withMetadata((studyPeriodId: number, context?: PomiRequestContext) => operations.getStudyPeriods(operationInput<getStudyPeriodsInput>({ "id": studyPeriodId }), context), definitions.getStudyPeriods, operationProblemTypes.getStudyPeriods)
            const listOperation = withMetadata((input: Omit<listStudyPeriodsInput, never> = {}, context?: PomiRequestContext) => operations.listStudyPeriods(operationInput<listStudyPeriodsInput>({ ...input }), context), definitions.listStudyPeriods, operationProblemTypes.listStudyPeriods)
            return { get: getOperation, list: listOperation }
        })(),
        "units": (() => {
            const getOperation = withMetadata((unitId: number, context?: PomiRequestContext) => operations.getUnits(operationInput<getUnitsInput>({ "id": unitId }), context), definitions.getUnits, operationProblemTypes.getUnits)
            const listOperation = withMetadata((input: Omit<listUnitsInput, never> = {}, context?: PomiRequestContext) => operations.listUnits(operationInput<listUnitsInput>({ ...input }), context), definitions.listUnits, operationProblemTypes.listUnits)
            return { get: getOperation, list: listOperation }
        })(),
        "calendar": (() => {
            const listOperation = withMetadata((input: Omit<listCalendarInput, never> = {}, context?: PomiRequestContext) => operations.listCalendar(operationInput<listCalendarInput>({ ...input }), context), definitions.listCalendar, operationProblemTypes.listCalendar)
            return { list: listOperation }
        })(),
        "coursesEvaluationSummaries": (() => {
            const listOperation = withMetadata((input: Omit<listCoursesEvaluationSummariesInput, never> = {}, context?: PomiRequestContext) => operations.listCoursesEvaluationSummaries(operationInput<listCoursesEvaluationSummariesInput>({ ...input }), context), definitions.listCoursesEvaluationSummaries, operationProblemTypes.listCoursesEvaluationSummaries)
            const pages = (input: Omit<listCoursesEvaluationSummariesInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listCoursesEvaluationSummariesOutput>(operations.listCoursesEvaluationSummaries(operationInput<listCoursesEvaluationSummariesInput>({ ...{ ...input, "page": input["page"] ?? 1, "pageSize": input["pageSize"] ?? 100 } }), context), "data", definitions.listCoursesEvaluationSummaries.authentication, "_paths.next", requestPath, context)
            const listAll = async (input: Omit<listCoursesEvaluationSummariesInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listCoursesEvaluationSummariesOutput["data"][number]> = []; for await (const page of pages(input, context)) items.push(...page["data"]); return items }
            return { list: listOperation, pages, listAll }
        })(),
        "evaluationSummaries": (() => {
            const listOperation = withMetadata((input: Omit<listEvaluationSummariesInput, never>, context?: PomiRequestContext) => operations.listEvaluationSummaries(operationInput<listEvaluationSummariesInput>({ ...input }), context), definitions.listEvaluationSummaries, operationProblemTypes.listEvaluationSummaries)
            return { list: listOperation }
        })(),
        "exchangePlaces": (() => {
            const listOperation = withMetadata((input: Omit<listExchangePlacesInput, never> = {}, context?: PomiRequestContext) => operations.listExchangePlaces(operationInput<listExchangePlacesInput>({ ...input }), context), definitions.listExchangePlaces, operationProblemTypes.listExchangePlaces)
            return { list: listOperation }
        })(),
        "professorsEvaluationSummaries": (() => {
            const listOperation = withMetadata((input: Omit<listProfessorsEvaluationSummariesInput, never> = {}, context?: PomiRequestContext) => operations.listProfessorsEvaluationSummaries(operationInput<listProfessorsEvaluationSummariesInput>({ ...input }), context), definitions.listProfessorsEvaluationSummaries, operationProblemTypes.listProfessorsEvaluationSummaries)
            const pages = (input: Omit<listProfessorsEvaluationSummariesInput, never> = {}, context?: PomiRequestContext) => paginateByLink<listProfessorsEvaluationSummariesOutput>(operations.listProfessorsEvaluationSummaries(operationInput<listProfessorsEvaluationSummariesInput>({ ...{ ...input, "page": input["page"] ?? 1, "pageSize": input["pageSize"] ?? 100 } }), context), "data", definitions.listProfessorsEvaluationSummaries.authentication, "_paths.next", requestPath, context)
            const listAll = async (input: Omit<listProfessorsEvaluationSummariesInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listProfessorsEvaluationSummariesOutput["data"][number]> = []; for await (const page of pages(input, context)) items.push(...page["data"]); return items }
            return { list: listOperation, pages, listAll }
        })(),
    }
}

export type Resources = ReturnType<typeof bindResources>
