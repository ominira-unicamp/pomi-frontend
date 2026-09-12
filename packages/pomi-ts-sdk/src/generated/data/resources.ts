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

function withPaginationDefaults<Input extends { page?: number; pageSize?: number }>(input: Input, pageSize: number) {
    return { ...input, page: input.page ?? 1, pageSize: input.pageSize ?? pageSize }
}

function valueAtPath(value: unknown, path: string) {
    return path.split('.').reduce<unknown>((current, key) => typeof current === 'object' && current !== null ? (current as Record<string, unknown>)[key] : undefined, value)
}

async function* paginate<Page>(firstPage: Promise<Page>, target: "data", authentication: AuthenticationMode, nextField: string, requestPath: RequestPath, context?: PomiRequestContext): AsyncIterable<Page> {
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
            const get = withMetadata((calendarEventId: string, context?: PomiRequestContext) => operations.getCalendarEvents({ "id": calendarEventId } as unknown as getCalendarEventsInput, context), definitions.getCalendarEvents, operationProblemTypes.getCalendarEvents)
            const list = withMetadata((input: Omit<listCalendarEventsInput, never> = {}, context?: PomiRequestContext) => operations.listCalendarEvents({ ...input } as unknown as listCalendarEventsInput, context), definitions.listCalendarEvents, operationProblemTypes.listCalendarEvents)
            return { get, list }
        })(),
        "calendarTags": (() => {
            const get = withMetadata((calendarTagId: string, context?: PomiRequestContext) => operations.getCalendarTags({ "id": calendarTagId } as unknown as getCalendarTagsInput, context), definitions.getCalendarTags, operationProblemTypes.getCalendarTags)
            const list = withMetadata((input: Omit<listCalendarTagsInput, never> = {}, context?: PomiRequestContext) => operations.listCalendarTags({ ...input } as unknown as listCalendarTagsInput, context), definitions.listCalendarTags, operationProblemTypes.listCalendarTags)
            return { get, list }
        })(),
        "catalogCourses": (() => {
            const get = withMetadata((catalogCourseId: number, context?: PomiRequestContext) => operations.getCatalogCourses({ "id": catalogCourseId } as unknown as getCatalogCoursesInput, context), definitions.getCatalogCourses, operationProblemTypes.getCatalogCourses)
            const list = withMetadata((input: Omit<listCatalogCoursesInput, never> = {}, context?: PomiRequestContext) => operations.listCatalogCourses({ ...input } as unknown as listCatalogCoursesInput, context), definitions.listCatalogCourses, operationProblemTypes.listCatalogCourses)
            const pages = (input: Omit<listCatalogCoursesInput, never> = {}, context?: PomiRequestContext) => paginate<listCatalogCoursesOutput>(operations.listCatalogCourses({ ...withPaginationDefaults(input, 100) } as unknown as listCatalogCoursesInput, context), "data", definitions.listCatalogCourses.authentication, "_paths.next", requestPath, context)
            const listAll = async (input: Omit<listCatalogCoursesInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listCatalogCoursesOutput["data"][number]> = []; for await (const page of pages(input, context)) items.push(...page["data"]); return items }
            return { get, list, pages, listAll }
        })(),
        "catalogProgram": (() => {
            const get = withMetadata((catalogProgramId: string, context?: PomiRequestContext) => operations.getCatalogProgram({ "id": catalogProgramId } as unknown as getCatalogProgramInput, context), definitions.getCatalogProgram, operationProblemTypes.getCatalogProgram)
            const list = withMetadata((input: Omit<listCatalogProgramInput, never> = {}, context?: PomiRequestContext) => operations.listCatalogProgram({ ...input } as unknown as listCatalogProgramInput, context), definitions.listCatalogProgram, operationProblemTypes.listCatalogProgram)
            return { get, list }
        })(),
        "catalogs": (() => {
            const get = withMetadata((catalogId: string, context?: PomiRequestContext) => operations.getCatalogs({ "id": catalogId } as unknown as getCatalogsInput, context), definitions.getCatalogs, operationProblemTypes.getCatalogs)
            const list = withMetadata((input: Omit<listCatalogsInput, never> = {}, context?: PomiRequestContext) => operations.listCatalogs({ ...input } as unknown as listCatalogsInput, context), definitions.listCatalogs, operationProblemTypes.listCatalogs)
            return { get, list }
        })(),
        "classes": (() => {
            const get = withMetadata((classeId: string, context?: PomiRequestContext) => operations.getClasses({ "id": classeId } as unknown as getClassesInput, context), definitions.getClasses, operationProblemTypes.getClasses)
            const list = withMetadata((input: Omit<listClassesInput, never> = {}, context?: PomiRequestContext) => operations.listClasses({ ...input } as unknown as listClassesInput, context), definitions.listClasses, operationProblemTypes.listClasses)
            const pages = (input: Omit<listClassesInput, never> = {}, context?: PomiRequestContext) => paginate<listClassesOutput>(operations.listClasses({ ...withPaginationDefaults(input, 100) } as unknown as listClassesInput, context), "data", definitions.listClasses.authentication, "_paths.next", requestPath, context)
            const listAll = async (input: Omit<listClassesInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listClassesOutput["data"][number]> = []; for await (const page of pages(input, context)) items.push(...page["data"]); return items }
            return { get, list, pages, listAll }
        })(),
        "classSchedules": (() => {
            const get = withMetadata((classScheduleId: string, context?: PomiRequestContext) => operations.getClassSchedules({ "id": classScheduleId } as unknown as getClassSchedulesInput, context), definitions.getClassSchedules, operationProblemTypes.getClassSchedules)
            const list = withMetadata((input: Omit<listClassSchedulesInput, never> = {}, context?: PomiRequestContext) => operations.listClassSchedules({ ...input } as unknown as listClassSchedulesInput, context), definitions.listClassSchedules, operationProblemTypes.listClassSchedules)
            const pages = (input: Omit<listClassSchedulesInput, never> = {}, context?: PomiRequestContext) => paginate<listClassSchedulesOutput>(operations.listClassSchedules({ ...withPaginationDefaults(input, 100) } as unknown as listClassSchedulesInput, context), "data", definitions.listClassSchedules.authentication, "_paths.next", requestPath, context)
            const listAll = async (input: Omit<listClassSchedulesInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listClassSchedulesOutput["data"][number]> = []; for await (const page of pages(input, context)) items.push(...page["data"]); return items }
            return { get, list, pages, listAll }
        })(),
        "coauthors": (() => {
            const get = withMetadata((coauthorId: string, context?: PomiRequestContext) => operations.getCoauthors({ "id": coauthorId } as unknown as getCoauthorsInput, context), definitions.getCoauthors, operationProblemTypes.getCoauthors)
            const list = withMetadata((input: Omit<listCoauthorsInput, never> = {}, context?: PomiRequestContext) => operations.listCoauthors({ ...input } as unknown as listCoauthorsInput, context), definitions.listCoauthors, operationProblemTypes.listCoauthors)
            const pages = (input: Omit<listCoauthorsInput, never> = {}, context?: PomiRequestContext) => paginate<listCoauthorsOutput>(operations.listCoauthors({ ...withPaginationDefaults(input, 100) } as unknown as listCoauthorsInput, context), "data", definitions.listCoauthors.authentication, "_paths.next", requestPath, context)
            const listAll = async (input: Omit<listCoauthorsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listCoauthorsOutput["data"][number]> = []; for await (const page of pages(input, context)) items.push(...page["data"]); return items }
            return { get, list, pages, listAll }
        })(),
        "coordinators": (() => {
            const get = withMetadata((coordinatorId: number, context?: PomiRequestContext) => operations.getCoordinators({ "id": coordinatorId } as unknown as getCoordinatorsInput, context), definitions.getCoordinators, operationProblemTypes.getCoordinators)
            const list = withMetadata((input: Omit<listCoordinatorsInput, never> = {}, context?: PomiRequestContext) => operations.listCoordinators({ ...input } as unknown as listCoordinatorsInput, context), definitions.listCoordinators, operationProblemTypes.listCoordinators)
            const pages = (input: Omit<listCoordinatorsInput, never> = {}, context?: PomiRequestContext) => paginate<listCoordinatorsOutput>(operations.listCoordinators({ ...withPaginationDefaults(input, 100) } as unknown as listCoordinatorsInput, context), "data", definitions.listCoordinators.authentication, "_paths.next", requestPath, context)
            const listAll = async (input: Omit<listCoordinatorsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listCoordinatorsOutput["data"][number]> = []; for await (const page of pages(input, context)) items.push(...page["data"]); return items }
            return { get, list, pages, listAll }
        })(),
        "courses": (() => {
            const get = withMetadata((courseId: number, context?: PomiRequestContext) => operations.getCourses({ "id": courseId } as unknown as getCoursesInput, context), definitions.getCourses, operationProblemTypes.getCourses)
            const list = withMetadata((input: Omit<listCoursesInput, never> = {}, context?: PomiRequestContext) => operations.listCourses({ ...input } as unknown as listCoursesInput, context), definitions.listCourses, operationProblemTypes.listCourses)
            const pages = (input: Omit<listCoursesInput, never> = {}, context?: PomiRequestContext) => paginate<listCoursesOutput>(operations.listCourses({ ...withPaginationDefaults(input, 20) } as unknown as listCoursesInput, context), "data", definitions.listCourses.authentication, "_paths.next", requestPath, context)
            const listAll = async (input: Omit<listCoursesInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listCoursesOutput["data"][number]> = []; for await (const page of pages(input, context)) items.push(...page["data"]); return items }
            return { get, list, pages, listAll }
        })(),
        "curriculumSuggestions": (() => {
            const get = withMetadata((curriculumSuggestionId: string, context?: PomiRequestContext) => operations.getCurriculumSuggestions({ "id": curriculumSuggestionId } as unknown as getCurriculumSuggestionsInput, context), definitions.getCurriculumSuggestions, operationProblemTypes.getCurriculumSuggestions)
            const list = withMetadata((input: Omit<listCurriculumSuggestionsInput, never> = {}, context?: PomiRequestContext) => operations.listCurriculumSuggestions({ ...input } as unknown as listCurriculumSuggestionsInput, context), definitions.listCurriculumSuggestions, operationProblemTypes.listCurriculumSuggestions)
            return { get, list }
        })(),
        "dailyMenus": (() => {
            const get = withMetadata((dailyMenuId: string, context?: PomiRequestContext) => operations.getDailyMenus({ "id": dailyMenuId } as unknown as getDailyMenusInput, context), definitions.getDailyMenus, operationProblemTypes.getDailyMenus)
            const list = withMetadata((input: Omit<listDailyMenusInput, never> = {}, context?: PomiRequestContext) => operations.listDailyMenus({ ...input } as unknown as listDailyMenusInput, context), definitions.listDailyMenus, operationProblemTypes.listDailyMenus)
            return { get, list }
        })(),
        "departments": (() => {
            const get = withMetadata((departmentId: string, context?: PomiRequestContext) => operations.getDepartments({ "id": departmentId } as unknown as getDepartmentsInput, context), definitions.getDepartments, operationProblemTypes.getDepartments)
            const list = withMetadata((input: Omit<listDepartmentsInput, never> = {}, context?: PomiRequestContext) => operations.listDepartments({ ...input } as unknown as listDepartmentsInput, context), definitions.listDepartments, operationProblemTypes.listDepartments)
            return { get, list }
        })(),
        "exchangeNotices": (() => {
            const get = withMetadata((exchangeNoticeId: string, context?: PomiRequestContext) => operations.getExchangeNotices({ "id": exchangeNoticeId } as unknown as getExchangeNoticesInput, context), definitions.getExchangeNotices, operationProblemTypes.getExchangeNotices)
            const list = withMetadata((input: Omit<listExchangeNoticesInput, never> = {}, context?: PomiRequestContext) => operations.listExchangeNotices({ ...input } as unknown as listExchangeNoticesInput, context), definitions.listExchangeNotices, operationProblemTypes.listExchangeNotices)
            return { get, list }
        })(),
        "keywords": (() => {
            const get = withMetadata((keywordId: string, context?: PomiRequestContext) => operations.getKeywords({ "id": keywordId } as unknown as getKeywordsInput, context), definitions.getKeywords, operationProblemTypes.getKeywords)
            const list = withMetadata((input: Omit<listKeywordsInput, never> = {}, context?: PomiRequestContext) => operations.listKeywords({ ...input } as unknown as listKeywordsInput, context), definitions.listKeywords, operationProblemTypes.listKeywords)
            const pages = (input: Omit<listKeywordsInput, never> = {}, context?: PomiRequestContext) => paginate<listKeywordsOutput>(operations.listKeywords({ ...withPaginationDefaults(input, 100) } as unknown as listKeywordsInput, context), "data", definitions.listKeywords.authentication, "_paths.next", requestPath, context)
            const listAll = async (input: Omit<listKeywordsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listKeywordsOutput["data"][number]> = []; for await (const page of pages(input, context)) items.push(...page["data"]); return items }
            return { get, list, pages, listAll }
        })(),
        "languages": (() => {
            const get = withMetadata((languageId: string, context?: PomiRequestContext) => operations.getLanguages({ "id": languageId } as unknown as getLanguagesInput, context), definitions.getLanguages, operationProblemTypes.getLanguages)
            const list = withMetadata((input: Omit<listLanguagesInput, never> = {}, context?: PomiRequestContext) => operations.listLanguages({ ...input } as unknown as listLanguagesInput, context), definitions.listLanguages, operationProblemTypes.listLanguages)
            return { get, list }
        })(),
        "professorDataPortalProfiles": (() => {
            const get = withMetadata((professorDataPortalProfileId: string, context?: PomiRequestContext) => operations.getProfessorDataPortalProfiles({ "id": professorDataPortalProfileId } as unknown as getProfessorDataPortalProfilesInput, context), definitions.getProfessorDataPortalProfiles, operationProblemTypes.getProfessorDataPortalProfiles)
            const list = withMetadata((input: Omit<listProfessorDataPortalProfilesInput, never> = {}, context?: PomiRequestContext) => operations.listProfessorDataPortalProfiles({ ...input } as unknown as listProfessorDataPortalProfilesInput, context), definitions.listProfessorDataPortalProfiles, operationProblemTypes.listProfessorDataPortalProfiles)
            const pages = (input: Omit<listProfessorDataPortalProfilesInput, never> = {}, context?: PomiRequestContext) => paginate<listProfessorDataPortalProfilesOutput>(operations.listProfessorDataPortalProfiles({ ...withPaginationDefaults(input, 100) } as unknown as listProfessorDataPortalProfilesInput, context), "data", definitions.listProfessorDataPortalProfiles.authentication, "_paths.next", requestPath, context)
            const listAll = async (input: Omit<listProfessorDataPortalProfilesInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listProfessorDataPortalProfilesOutput["data"][number]> = []; for await (const page of pages(input, context)) items.push(...page["data"]); return items }
            return { get, list, pages, listAll }
        })(),
        "professorPositions": (() => {
            const get = withMetadata((professorPositionId: string, context?: PomiRequestContext) => operations.getProfessorPositions({ "id": professorPositionId } as unknown as getProfessorPositionsInput, context), definitions.getProfessorPositions, operationProblemTypes.getProfessorPositions)
            const list = withMetadata((input: Omit<listProfessorPositionsInput, never> = {}, context?: PomiRequestContext) => operations.listProfessorPositions({ ...input } as unknown as listProfessorPositionsInput, context), definitions.listProfessorPositions, operationProblemTypes.listProfessorPositions)
            return { get, list }
        })(),
        "professors": (() => {
            const get = withMetadata((professorId: string, context?: PomiRequestContext) => operations.getProfessors({ "id": professorId } as unknown as getProfessorsInput, context), definitions.getProfessors, operationProblemTypes.getProfessors)
            const list = withMetadata((input: Omit<listProfessorsInput, never> = {}, context?: PomiRequestContext) => operations.listProfessors({ ...input } as unknown as listProfessorsInput, context), definitions.listProfessors, operationProblemTypes.listProfessors)
            const pages = (input: Omit<listProfessorsInput, never> = {}, context?: PomiRequestContext) => paginate<listProfessorsOutput>(operations.listProfessors({ ...withPaginationDefaults(input, 100) } as unknown as listProfessorsInput, context), "data", definitions.listProfessors.authentication, "_paths.next", requestPath, context)
            const listAll = async (input: Omit<listProfessorsInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listProfessorsOutput["data"][number]> = []; for await (const page of pages(input, context)) items.push(...page["data"]); return items }
            return { get, list, pages, listAll }
        })(),
        "programs": (() => {
            const get = withMetadata((programId: string, context?: PomiRequestContext) => operations.getPrograms({ "id": programId } as unknown as getProgramsInput, context), definitions.getPrograms, operationProblemTypes.getPrograms)
            const list = withMetadata((input: Omit<listProgramsInput, never> = {}, context?: PomiRequestContext) => operations.listPrograms({ ...input } as unknown as listProgramsInput, context), definitions.listPrograms, operationProblemTypes.listPrograms)
            return { get, list }
        })(),
        "rooms": (() => {
            const get = withMetadata((roomId: string, context?: PomiRequestContext) => operations.getRooms({ "id": roomId } as unknown as getRoomsInput, context), definitions.getRooms, operationProblemTypes.getRooms)
            const list = withMetadata((input: Omit<listRoomsInput, never> = {}, context?: PomiRequestContext) => operations.listRooms({ ...input } as unknown as listRoomsInput, context), definitions.listRooms, operationProblemTypes.listRooms)
            return { get, list }
        })(),
        "specializations": (() => {
            const get = withMetadata((specializationId: string, context?: PomiRequestContext) => operations.getSpecializations({ "id": specializationId } as unknown as getSpecializationsInput, context), definitions.getSpecializations, operationProblemTypes.getSpecializations)
            const list = withMetadata((input: Omit<listSpecializationsInput, never> = {}, context?: PomiRequestContext) => operations.listSpecializations({ ...input } as unknown as listSpecializationsInput, context), definitions.listSpecializations, operationProblemTypes.listSpecializations)
            return { get, list }
        })(),
        "studyPeriods": (() => {
            const get = withMetadata((studyPeriodId: string, context?: PomiRequestContext) => operations.getStudyPeriods({ "id": studyPeriodId } as unknown as getStudyPeriodsInput, context), definitions.getStudyPeriods, operationProblemTypes.getStudyPeriods)
            const list = withMetadata((input: Omit<listStudyPeriodsInput, never> = {}, context?: PomiRequestContext) => operations.listStudyPeriods({ ...input } as unknown as listStudyPeriodsInput, context), definitions.listStudyPeriods, operationProblemTypes.listStudyPeriods)
            return { get, list }
        })(),
        "units": (() => {
            const get = withMetadata((unitId: string, context?: PomiRequestContext) => operations.getUnits({ "id": unitId } as unknown as getUnitsInput, context), definitions.getUnits, operationProblemTypes.getUnits)
            const list = withMetadata((input: Omit<listUnitsInput, never> = {}, context?: PomiRequestContext) => operations.listUnits({ ...input } as unknown as listUnitsInput, context), definitions.listUnits, operationProblemTypes.listUnits)
            return { get, list }
        })(),
        "calendar": (() => {
            const list = withMetadata((input: Omit<listCalendarInput, never> = {}, context?: PomiRequestContext) => operations.listCalendar({ ...input } as unknown as listCalendarInput, context), definitions.listCalendar, operationProblemTypes.listCalendar)
            return { list }
        })(),
        "coursesEvaluationSummaries": (() => {
            const list = withMetadata((input: Omit<listCoursesEvaluationSummariesInput, never> = {}, context?: PomiRequestContext) => operations.listCoursesEvaluationSummaries({ ...input } as unknown as listCoursesEvaluationSummariesInput, context), definitions.listCoursesEvaluationSummaries, operationProblemTypes.listCoursesEvaluationSummaries)
            const pages = (input: Omit<listCoursesEvaluationSummariesInput, never> = {}, context?: PomiRequestContext) => paginate<listCoursesEvaluationSummariesOutput>(operations.listCoursesEvaluationSummaries({ ...withPaginationDefaults(input, 100) } as unknown as listCoursesEvaluationSummariesInput, context), "data", definitions.listCoursesEvaluationSummaries.authentication, "_paths.next", requestPath, context)
            const listAll = async (input: Omit<listCoursesEvaluationSummariesInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listCoursesEvaluationSummariesOutput["data"][number]> = []; for await (const page of pages(input, context)) items.push(...page["data"]); return items }
            return { list, pages, listAll }
        })(),
        "evaluationSummaries": (() => {
            const list = withMetadata((input: Omit<listEvaluationSummariesInput, never>, context?: PomiRequestContext) => operations.listEvaluationSummaries({ ...input } as unknown as listEvaluationSummariesInput, context), definitions.listEvaluationSummaries, operationProblemTypes.listEvaluationSummaries)
            return { list }
        })(),
        "exchangePlaces": (() => {
            const list = withMetadata((input: Omit<listExchangePlacesInput, never> = {}, context?: PomiRequestContext) => operations.listExchangePlaces({ ...input } as unknown as listExchangePlacesInput, context), definitions.listExchangePlaces, operationProblemTypes.listExchangePlaces)
            return { list }
        })(),
        "professorsEvaluationSummaries": (() => {
            const list = withMetadata((input: Omit<listProfessorsEvaluationSummariesInput, never> = {}, context?: PomiRequestContext) => operations.listProfessorsEvaluationSummaries({ ...input } as unknown as listProfessorsEvaluationSummariesInput, context), definitions.listProfessorsEvaluationSummaries, operationProblemTypes.listProfessorsEvaluationSummaries)
            const pages = (input: Omit<listProfessorsEvaluationSummariesInput, never> = {}, context?: PomiRequestContext) => paginate<listProfessorsEvaluationSummariesOutput>(operations.listProfessorsEvaluationSummaries({ ...withPaginationDefaults(input, 100) } as unknown as listProfessorsEvaluationSummariesInput, context), "data", definitions.listProfessorsEvaluationSummaries.authentication, "_paths.next", requestPath, context)
            const listAll = async (input: Omit<listProfessorsEvaluationSummariesInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listProfessorsEvaluationSummariesOutput["data"][number]> = []; for await (const page of pages(input, context)) items.push(...page["data"]); return items }
            return { list, pages, listAll }
        })(),
    }
}

export type Resources = ReturnType<typeof bindResources>
