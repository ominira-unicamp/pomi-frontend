import type { PomiRequestContext } from '../../runtime/client.js'
import type { OperationInputs, OperationName, OperationOutputs } from './operations.js'

export type OperationApi = {
    [Name in OperationName]: (
        input: OperationInputs[Name],
        context?: PomiRequestContext,
    ) => Promise<OperationOutputs[Name]>
}

export type ExecuteOperation = <Name extends OperationName>(
    name: Name,
    input: OperationInputs[Name],
    context?: PomiRequestContext,
) => Promise<OperationOutputs[Name]>

export function bindOperations(execute: ExecuteOperation): OperationApi {
    return {
        getCalendarEvents: (input, context) => execute("getCalendarEvents", input, context),
        getCalendarTags: (input, context) => execute("getCalendarTags", input, context),
        getCatalogCourses: (input, context) => execute("getCatalogCourses", input, context),
        getCatalogProgram: (input, context) => execute("getCatalogProgram", input, context),
        getCatalogs: (input, context) => execute("getCatalogs", input, context),
        getClasses: (input, context) => execute("getClasses", input, context),
        getClassSchedules: (input, context) => execute("getClassSchedules", input, context),
        getCoauthors: (input, context) => execute("getCoauthors", input, context),
        getCoordinators: (input, context) => execute("getCoordinators", input, context),
        getCourses: (input, context) => execute("getCourses", input, context),
        getCurriculumSuggestions: (input, context) => execute("getCurriculumSuggestions", input, context),
        getDailyMenus: (input, context) => execute("getDailyMenus", input, context),
        getDepartments: (input, context) => execute("getDepartments", input, context),
        getExchangeNotices: (input, context) => execute("getExchangeNotices", input, context),
        getKeywords: (input, context) => execute("getKeywords", input, context),
        getLanguages: (input, context) => execute("getLanguages", input, context),
        getProfessorDataPortalProfiles: (input, context) => execute("getProfessorDataPortalProfiles", input, context),
        getProfessorPositions: (input, context) => execute("getProfessorPositions", input, context),
        getProfessors: (input, context) => execute("getProfessors", input, context),
        getPrograms: (input, context) => execute("getPrograms", input, context),
        getRooms: (input, context) => execute("getRooms", input, context),
        getSpecializations: (input, context) => execute("getSpecializations", input, context),
        getStudyPeriods: (input, context) => execute("getStudyPeriods", input, context),
        getUnits: (input, context) => execute("getUnits", input, context),
        listCalendar: (input, context) => execute("listCalendar", input, context),
        listCalendarEvents: (input, context) => execute("listCalendarEvents", input, context),
        listCalendarTags: (input, context) => execute("listCalendarTags", input, context),
        listCatalogCourses: (input, context) => execute("listCatalogCourses", input, context),
        listCatalogProgram: (input, context) => execute("listCatalogProgram", input, context),
        listCatalogs: (input, context) => execute("listCatalogs", input, context),
        listClasses: (input, context) => execute("listClasses", input, context),
        listClassSchedules: (input, context) => execute("listClassSchedules", input, context),
        listCoauthors: (input, context) => execute("listCoauthors", input, context),
        listCoordinators: (input, context) => execute("listCoordinators", input, context),
        listCourses: (input, context) => execute("listCourses", input, context),
        listCoursesEvaluationSummaries: (input, context) => execute("listCoursesEvaluationSummaries", input, context),
        listCurriculumSuggestions: (input, context) => execute("listCurriculumSuggestions", input, context),
        listDailyMenus: (input, context) => execute("listDailyMenus", input, context),
        listDepartments: (input, context) => execute("listDepartments", input, context),
        listEvaluationSummaries: (input, context) => execute("listEvaluationSummaries", input, context),
        listExchangeNotices: (input, context) => execute("listExchangeNotices", input, context),
        listExchangePlaces: (input, context) => execute("listExchangePlaces", input, context),
        listKeywords: (input, context) => execute("listKeywords", input, context),
        listLanguages: (input, context) => execute("listLanguages", input, context),
        listProfessorDataPortalProfiles: (input, context) => execute("listProfessorDataPortalProfiles", input, context),
        listProfessorPositions: (input, context) => execute("listProfessorPositions", input, context),
        listProfessors: (input, context) => execute("listProfessors", input, context),
        listProfessorsEvaluationSummaries: (input, context) => execute("listProfessorsEvaluationSummaries", input, context),
        listPrograms: (input, context) => execute("listPrograms", input, context),
        listRooms: (input, context) => execute("listRooms", input, context),
        listSpecializations: (input, context) => execute("listSpecializations", input, context),
        listStudyPeriods: (input, context) => execute("listStudyPeriods", input, context),
        listUnits: (input, context) => execute("listUnits", input, context),
    }
}
