export type { SortDirection, SortInput, SortTerm } from '../../runtime/sorting.js'
import type { listCalendarEventsInput, listCalendarTagsInput, listCatalogCoursesInput, listCatalogProgramsInput, listCatalogsInput, listClassesInput, listClassSchedulesInput, listCoauthorsInput, listCoordinatorsInput, listCourseEvaluationSummariesInput, listCoursesInput, listCurriculumSuggestionsInput, listDailyMenusInput, listDepartmentsInput, listExchangeNoticesInput, listExchangePlacesInput, listKeywordsInput, listLanguagesInput, listProfessorDataPortalProfilesInput, listProfessorEvaluationSummariesInput, listProfessorPositionsInput, listProfessorsInput, listProgramsInput, listRoomsInput, listSpecializationsInput, listStudyPeriodsInput, listUnitsInput } from './operations.js'

export type listCalendarEventsSort = NonNullable<listCalendarEventsInput['sort']>
export type listCalendarTagsSort = NonNullable<listCalendarTagsInput['sort']>
export type listCatalogCoursesSort = NonNullable<listCatalogCoursesInput['sort']>
export type listCatalogProgramsSort = NonNullable<listCatalogProgramsInput['sort']>
export type listCatalogsSort = NonNullable<listCatalogsInput['sort']>
export type listClassesSort = NonNullable<listClassesInput['sort']>
export type listClassSchedulesSort = NonNullable<listClassSchedulesInput['sort']>
export type listCoauthorsSort = NonNullable<listCoauthorsInput['sort']>
export type listCoordinatorsSort = NonNullable<listCoordinatorsInput['sort']>
export type listCourseEvaluationSummariesSort = NonNullable<listCourseEvaluationSummariesInput['sort']>
export type listCoursesSort = NonNullable<listCoursesInput['sort']>
export type listCurriculumSuggestionsSort = NonNullable<listCurriculumSuggestionsInput['sort']>
export type listDailyMenusSort = NonNullable<listDailyMenusInput['sort']>
export type listDepartmentsSort = NonNullable<listDepartmentsInput['sort']>
export type listExchangeNoticesSort = NonNullable<listExchangeNoticesInput['sort']>
export type listExchangePlacesSort = NonNullable<listExchangePlacesInput['sort']>
export type listKeywordsSort = NonNullable<listKeywordsInput['sort']>
export type listLanguagesSort = NonNullable<listLanguagesInput['sort']>
export type listProfessorDataPortalProfilesSort = NonNullable<listProfessorDataPortalProfilesInput['sort']>
export type listProfessorEvaluationSummariesSort = NonNullable<listProfessorEvaluationSummariesInput['sort']>
export type listProfessorPositionsSort = NonNullable<listProfessorPositionsInput['sort']>
export type listProfessorsSort = NonNullable<listProfessorsInput['sort']>
export type listProgramsSort = NonNullable<listProgramsInput['sort']>
export type listRoomsSort = NonNullable<listRoomsInput['sort']>
export type listSpecializationsSort = NonNullable<listSpecializationsInput['sort']>
export type listStudyPeriodsSort = NonNullable<listStudyPeriodsInput['sort']>
export type listUnitsSort = NonNullable<listUnitsInput['sort']>

export const sortCapabilities = {
    "listCalendarEvents": {
        "version": 1,
        "fields": [
            "startDate",
            "endDate",
            "description"
        ],
        "default": "startDate:asc,endDate:asc"
    },
    "listCalendarTags": {
        "version": 1,
        "fields": [
            "name"
        ],
        "default": "name:asc"
    },
    "listCatalogCourses": {
        "version": 1,
        "fields": [
            "catalogYear",
            "code",
            "name",
            "credits"
        ],
        "default": "catalogYear:desc,code:asc"
    },
    "listCatalogPrograms": {
        "version": 1,
        "fields": [
            "id",
            "catalogYear",
            "programCode",
            "programName",
            "title"
        ],
        "default": "id:asc"
    },
    "listCatalogs": {
        "version": 1,
        "fields": [
            "year"
        ],
        "default": "year:desc"
    },
    "listClasses": {
        "version": 1,
        "fields": [
            "id",
            "classCode",
            "courseCode",
            "studyPeriodYear"
        ],
        "default": "id:asc"
    },
    "listClassSchedules": {
        "version": 1,
        "fields": [
            "id",
            "dayOfWeek",
            "start",
            "end",
            "roomCode",
            "classCode",
            "courseCode",
            "studyPeriodYear"
        ],
        "default": "id:asc"
    },
    "listCoauthors": {
        "version": 1,
        "fields": [
            "name"
        ],
        "default": "name:asc"
    },
    "listCoordinators": {
        "version": 1,
        "fields": [
            "name"
        ],
        "default": "name:asc"
    },
    "listCourseEvaluationSummaries": {
        "version": 1,
        "fields": [
            "course.code",
            "course.name",
            "responseCount",
            "wouldTakeAgain",
            "fairness",
            "clarity",
            "difficulty"
        ],
        "default": "course.code:asc"
    },
    "listCourses": {
        "version": 1,
        "fields": [
            "code",
            "name",
            "credits",
            "unitCode"
        ],
        "default": "code:asc"
    },
    "listCurriculumSuggestions": {
        "version": 1,
        "fields": [
            "catalogYear",
            "programCode",
            "programName",
            "specializationCode"
        ],
        "default": "catalogYear:desc,programCode:desc,specializationCode:asc"
    },
    "listDailyMenus": {
        "version": 1,
        "fields": [
            "date",
            "createdAt",
            "updatedAt"
        ],
        "default": "date:asc"
    },
    "listDepartments": {
        "version": 1,
        "fields": [
            "name"
        ],
        "default": "name:asc"
    },
    "listExchangeNotices": {
        "version": 1,
        "fields": [
            "registrationEnd",
            "registrationStart",
            "number",
            "issuer",
            "title",
            "place.name"
        ],
        "default": "registrationEnd:desc,registrationStart:desc"
    },
    "listExchangePlaces": {
        "version": 1,
        "fields": [
            "name"
        ],
        "default": "name:asc"
    },
    "listKeywords": {
        "version": 1,
        "fields": [
            "name"
        ],
        "default": "name:asc"
    },
    "listLanguages": {
        "version": 1,
        "fields": [
            "name"
        ],
        "default": "name:asc"
    },
    "listProfessorDataPortalProfiles": {
        "version": 1,
        "fields": [
            "name"
        ],
        "default": "name:asc"
    },
    "listProfessorEvaluationSummaries": {
        "version": 1,
        "fields": [
            "professor.name",
            "responseCount",
            "wouldTakeAgain",
            "fairness",
            "clarity",
            "difficulty"
        ],
        "default": "professor.name:asc"
    },
    "listProfessorPositions": {
        "version": 1,
        "fields": [
            "canonicalKey",
            "role"
        ],
        "default": "canonicalKey:asc"
    },
    "listProfessors": {
        "version": 1,
        "fields": [
            "name"
        ],
        "default": "name:asc"
    },
    "listPrograms": {
        "version": 1,
        "fields": [
            "code",
            "name",
            "unitCode"
        ],
        "default": "name:asc"
    },
    "listRooms": {
        "version": 1,
        "fields": [
            "code"
        ],
        "default": "code:asc"
    },
    "listSpecializations": {
        "version": 1,
        "fields": [
            "programCode",
            "programName",
            "code",
            "name"
        ],
        "default": "programCode:asc,name:asc"
    },
    "listStudyPeriods": {
        "version": 1,
        "fields": [
            "id",
            "year",
            "yearPeriod",
            "startDate"
        ],
        "default": "id:asc"
    },
    "listUnits": {
        "version": 1,
        "fields": [
            "code",
            "name"
        ],
        "default": "code:asc"
    }
} as const
