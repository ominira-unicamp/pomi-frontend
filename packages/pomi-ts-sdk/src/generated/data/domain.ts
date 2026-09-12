import type { components } from './openapi.js'

export type Domain<T> = T extends null
    ? null
    : T extends ReadonlyArray<infer Item>
    ? ReadonlyArray<Domain<Item>>
    : T extends object
    ? { readonly [Key in Exclude<keyof T, '_paths'>]: Domain<T[Key]> }
    : T

export type PagePaths = {
    firstPage: string
    lastPage: string
    next: string | null
    prev: string | null
}

export type Page<T> = {
    data: ReadonlyArray<T>
    quantity: number
    total: number
    _paths: PagePaths
}

export type DomainComponentSchemaName = keyof components['schemas']
export type Component<Name extends DomainComponentSchemaName> = Domain<components['schemas'][Name]>

export type PageProfessorEvaluationSummariesTransport = components['schemas']['PageProfessorEvaluationSummaries']
export type PageProfessorEvaluationSummaries = Domain<PageProfessorEvaluationSummariesTransport>

export type ProfessorEvaluationSummaryTransport = components['schemas']['ProfessorEvaluationSummary']
export type ProfessorEvaluationSummary = Domain<ProfessorEvaluationSummaryTransport>

export type InvalidRequestProblemTransport = components['schemas']['InvalidRequestProblem']
export type InvalidRequestProblem = Domain<InvalidRequestProblemTransport>

export type ProblemFieldTransport = components['schemas']['ProblemField']
export type ProblemField = Domain<ProblemFieldTransport>

export type InternalServerErrorProblemTransport = components['schemas']['InternalServerErrorProblem']
export type InternalServerErrorProblem = Domain<InternalServerErrorProblemTransport>

export type PageCourseEvaluationSummariesTransport = components['schemas']['PageCourseEvaluationSummaries']
export type PageCourseEvaluationSummaries = Domain<PageCourseEvaluationSummariesTransport>

export type CourseEvaluationSummaryTransport = components['schemas']['CourseEvaluationSummary']
export type CourseEvaluationSummary = Domain<CourseEvaluationSummaryTransport>

export type CourseProfessorEvaluationSummaryTransport = components['schemas']['CourseProfessorEvaluationSummary']
export type CourseProfessorEvaluationSummary = Domain<CourseProfessorEvaluationSummaryTransport>

export type ResourceNotFoundProblemTransport = components['schemas']['ResourceNotFoundProblem']
export type ResourceNotFoundProblem = Domain<ResourceNotFoundProblemTransport>

export type UnitTransport = components['schemas']['UnitEntity']
export type Unit = Domain<UnitTransport>

export type CourseTransport = components['schemas']['CourseEntity']
export type Course = Domain<CourseTransport>

export type PageCoursesTransport = components['schemas']['PageCourses']
export type PageCourses = Domain<PageCoursesTransport>

export type ProfessorTransport = components['schemas']['ProfessorEntity']
export type Professor = Domain<ProfessorTransport>

export type PageProfessorsTransport = components['schemas']['PageProfessors']
export type PageProfessors = Domain<PageProfessorsTransport>

export type ProfessorDataPortalProfileSummaryTransport = components['schemas']['ProfessorDataPortalProfileSummary']
export type ProfessorDataPortalProfileSummary = Domain<ProfessorDataPortalProfileSummaryTransport>

export type DepartmentTransport = components['schemas']['Department']
export type Department = Domain<DepartmentTransport>

export type ProfessorPositionTransport = components['schemas']['ProfessorPosition']
export type ProfessorPosition = Domain<ProfessorPositionTransport>

export type CareerReferenceTransport = components['schemas']['CareerReference']
export type CareerReference = Domain<CareerReferenceTransport>

export type ProfessorDataPortalProfileTransport = components['schemas']['ProfessorDataPortalProfile']
export type ProfessorDataPortalProfile = Domain<ProfessorDataPortalProfileTransport>

export type KeywordTransport = components['schemas']['Keyword']
export type Keyword = Domain<KeywordTransport>

export type CoauthorTransport = components['schemas']['Coauthor']
export type Coauthor = Domain<CoauthorTransport>

export type RoomTransport = components['schemas']['RoomEntity']
export type Room = Domain<RoomTransport>

export type CatalogTransport = components['schemas']['Catalog']
export type Catalog = Domain<CatalogTransport>

export type CatalogCourseTransport = components['schemas']['CatalogCourseEntity']
export type CatalogCourse = Domain<CatalogCourseTransport>

export type CoordinatorTransport = components['schemas']['CoordinatorEntity']
export type Coordinator = Domain<CoordinatorTransport>

export type CatalogProgramTransport = components['schemas']['CatalogProgramEntity']
export type CatalogProgram = Domain<CatalogProgramTransport>

export type CurriculumSuggestionTransport = components['schemas']['CurriculumSuggestionEntity']
export type CurriculumSuggestion = Domain<CurriculumSuggestionTransport>

export type SemesterSuggestionTransport = components['schemas']['SemesterSuggestionEntity']
export type SemesterSuggestion = Domain<SemesterSuggestionTransport>

export type CurriculumSuggestionCourseTransport = components['schemas']['CurriculumSuggestionCourseEntity']
export type CurriculumSuggestionCourse = Domain<CurriculumSuggestionCourseTransport>

export type LanguageTransport = components['schemas']['Language']
export type Language = Domain<LanguageTransport>

export type ProgramTransport = components['schemas']['Program']
export type Program = Domain<ProgramTransport>

export type SpecializationTransport = components['schemas']['Specialization']
export type Specialization = Domain<SpecializationTransport>

export type ExchangeNoticeTransport = components['schemas']['ExchangeNotice']
export type ExchangeNotice = Domain<ExchangeNoticeTransport>

export type ExchangePlaceTransport = components['schemas']['ExchangePlace']
export type ExchangePlace = Domain<ExchangePlaceTransport>

export type ExchangeNoticeFileTransport = components['schemas']['ExchangeNoticeFile']
export type ExchangeNoticeFile = Domain<ExchangeNoticeFileTransport>

export type ExchangePlaceListItemTransport = components['schemas']['ExchangePlaceListItem']
export type ExchangePlaceListItem = Domain<ExchangePlaceListItemTransport>

export type CalendarEventTransport = components['schemas']['CalendarEvent']
export type CalendarEvent = Domain<CalendarEventTransport>

export type CalendarTagTransport = components['schemas']['CalendarTag']
export type CalendarTag = Domain<CalendarTagTransport>

export type ClassTransport = components['schemas']['ClassEntity']
export type Class = Domain<ClassTransport>

export type ClassScheduleTransport = components['schemas']['ClassScheduleEntity']
export type ClassSchedule = Domain<ClassScheduleTransport>

export type PageClassSchedulesTransport = components['schemas']['PageClassSchedules']
export type PageClassSchedules = Domain<PageClassSchedulesTransport>

export type DailyMenuTransport = components['schemas']['DailyMenu']
export type DailyMenu = Domain<DailyMenuTransport>

export type MealTransport = components['schemas']['Meal']
export type Meal = Domain<MealTransport>

export type StudyPeriodTransport = components['schemas']['StudyPeriodEntity']
export type StudyPeriod = Domain<StudyPeriodTransport>

export type BlockSet = Domain<CatalogProgramTransport['base']>
export type CourseRequirement = Domain<CatalogProgramTransport['base']['mandatory'][number]>
export type CatalogProgramModality = Domain<CatalogProgramTransport['modalities'][number]>
export type CatalogProgramLanguage = Domain<CatalogProgramTransport['languages'][number]>

export const domainModelDefinitions = {
    "PageProfessorEvaluationSummaries": {
        "schema": "PageProfessorEvaluationSummaries",
        "transportFields": [
            "_paths"
        ]
    },
    "ProfessorEvaluationSummary": {
        "schema": "ProfessorEvaluationSummary",
        "transportFields": []
    },
    "InvalidRequestProblem": {
        "schema": "InvalidRequestProblem",
        "transportFields": []
    },
    "ProblemField": {
        "schema": "ProblemField",
        "transportFields": []
    },
    "InternalServerErrorProblem": {
        "schema": "InternalServerErrorProblem",
        "transportFields": []
    },
    "PageCourseEvaluationSummaries": {
        "schema": "PageCourseEvaluationSummaries",
        "transportFields": [
            "_paths"
        ]
    },
    "CourseEvaluationSummary": {
        "schema": "CourseEvaluationSummary",
        "transportFields": []
    },
    "CourseProfessorEvaluationSummary": {
        "schema": "CourseProfessorEvaluationSummary",
        "transportFields": []
    },
    "ResourceNotFoundProblem": {
        "schema": "ResourceNotFoundProblem",
        "transportFields": []
    },
    "Unit": {
        "schema": "UnitEntity",
        "transportFields": [
            "_paths"
        ]
    },
    "Course": {
        "schema": "CourseEntity",
        "transportFields": [
            "_paths"
        ]
    },
    "PageCourses": {
        "schema": "PageCourses",
        "transportFields": [
            "_paths"
        ]
    },
    "Professor": {
        "schema": "ProfessorEntity",
        "transportFields": [
            "_paths"
        ]
    },
    "PageProfessors": {
        "schema": "PageProfessors",
        "transportFields": [
            "_paths"
        ]
    },
    "ProfessorDataPortalProfileSummary": {
        "schema": "ProfessorDataPortalProfileSummary",
        "transportFields": [
            "_paths"
        ]
    },
    "Department": {
        "schema": "Department",
        "transportFields": []
    },
    "ProfessorPosition": {
        "schema": "ProfessorPosition",
        "transportFields": []
    },
    "CareerReference": {
        "schema": "CareerReference",
        "transportFields": []
    },
    "ProfessorDataPortalProfile": {
        "schema": "ProfessorDataPortalProfile",
        "transportFields": [
            "_paths"
        ]
    },
    "Keyword": {
        "schema": "Keyword",
        "transportFields": []
    },
    "Coauthor": {
        "schema": "Coauthor",
        "transportFields": []
    },
    "Room": {
        "schema": "RoomEntity",
        "transportFields": [
            "_paths"
        ]
    },
    "Catalog": {
        "schema": "Catalog",
        "transportFields": [
            "_paths"
        ]
    },
    "CatalogCourse": {
        "schema": "CatalogCourseEntity",
        "transportFields": [
            "_paths"
        ]
    },
    "Coordinator": {
        "schema": "CoordinatorEntity",
        "transportFields": [
            "_paths"
        ]
    },
    "CatalogProgram": {
        "schema": "CatalogProgramEntity",
        "transportFields": [
            "_paths"
        ]
    },
    "CurriculumSuggestion": {
        "schema": "CurriculumSuggestionEntity",
        "transportFields": [
            "_paths"
        ]
    },
    "SemesterSuggestion": {
        "schema": "SemesterSuggestionEntity",
        "transportFields": []
    },
    "CurriculumSuggestionCourse": {
        "schema": "CurriculumSuggestionCourseEntity",
        "transportFields": []
    },
    "Language": {
        "schema": "Language",
        "transportFields": [
            "_paths"
        ]
    },
    "Program": {
        "schema": "Program",
        "transportFields": [
            "_paths"
        ]
    },
    "Specialization": {
        "schema": "Specialization",
        "transportFields": [
            "_paths"
        ]
    },
    "ExchangeNotice": {
        "schema": "ExchangeNotice",
        "transportFields": [
            "_paths"
        ]
    },
    "ExchangePlace": {
        "schema": "ExchangePlace",
        "transportFields": [
            "_paths"
        ]
    },
    "ExchangeNoticeFile": {
        "schema": "ExchangeNoticeFile",
        "transportFields": []
    },
    "ExchangePlaceListItem": {
        "schema": "ExchangePlaceListItem",
        "transportFields": [
            "_paths"
        ]
    },
    "CalendarEvent": {
        "schema": "CalendarEvent",
        "transportFields": [
            "_paths"
        ]
    },
    "CalendarTag": {
        "schema": "CalendarTag",
        "transportFields": [
            "_paths"
        ]
    },
    "Class": {
        "schema": "ClassEntity",
        "transportFields": [
            "_paths"
        ]
    },
    "ClassSchedule": {
        "schema": "ClassScheduleEntity",
        "transportFields": [
            "_paths"
        ]
    },
    "PageClassSchedules": {
        "schema": "PageClassSchedules",
        "transportFields": [
            "_paths"
        ]
    },
    "DailyMenu": {
        "schema": "DailyMenu",
        "transportFields": [
            "_paths"
        ]
    },
    "Meal": {
        "schema": "Meal",
        "transportFields": []
    },
    "StudyPeriod": {
        "schema": "StudyPeriodEntity",
        "transportFields": [
            "_paths"
        ]
    }
} as const
