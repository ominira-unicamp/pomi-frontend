import type { components } from './openapi.js'

type Domain<T> = T extends null
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

export type CourseTransport = components['schemas']['CourseEntity']
export type Course = Domain<CourseTransport>

export type CatalogProgramTransport = components['schemas']['CatalogProgramEntity']
export type CatalogProgram = Domain<CatalogProgramTransport>

export type ClassScheduleTransport = components['schemas']['ClassScheduleEntity']
export type ClassSchedule = Domain<ClassScheduleTransport>

export type UnitTransport = components['schemas']['UnitEntity']
export type Unit = Domain<UnitTransport>

export type CatalogTransport = components['schemas']['Catalog']
export type Catalog = Domain<CatalogTransport>

export type CatalogCourseTransport = components['schemas']['CatalogCourseEntity']
export type CatalogCourse = Domain<CatalogCourseTransport>

export type StudyPeriodTransport = components['schemas']['StudyPeriodEntity']
export type StudyPeriod = Domain<StudyPeriodTransport>

export type ClassTransport = components['schemas']['ClassEntity']
export type Class = Domain<ClassTransport>

export type CalendarEventTransport = components['schemas']['CalendarEvent']
export type CalendarEvent = Domain<CalendarEventTransport>

export type CalendarTagTransport = components['schemas']['CalendarTag']
export type CalendarTag = Domain<CalendarTagTransport>

export type CoordinatorTransport = components['schemas']['CoordinatorEntity']
export type Coordinator = Domain<CoordinatorTransport>

export type CurriculumSuggestionTransport = components['schemas']['CurriculumSuggestionEntity']
export type CurriculumSuggestion = Domain<CurriculumSuggestionTransport>

export type DailyMenuTransport = components['schemas']['DailyMenu']
export type DailyMenu = Domain<DailyMenuTransport>

export type ExchangeNoticeTransport = components['schemas']['ExchangeNotice']
export type ExchangeNotice = Domain<ExchangeNoticeTransport>

export type LanguageTransport = components['schemas']['Language']
export type Language = Domain<LanguageTransport>

export type ProfessorDataPortalProfileTransport = components['schemas']['ProfessorDataPortalProfile']
export type ProfessorDataPortalProfile = Domain<ProfessorDataPortalProfileTransport>

export type ProfessorTransport = components['schemas']['ProfessorEntity']
export type Professor = Domain<ProfessorTransport>

export type ProgramTransport = components['schemas']['Program']
export type Program = Domain<ProgramTransport>

export type RoomTransport = components['schemas']['RoomEntity']
export type Room = Domain<RoomTransport>

export type SpecializationTransport = components['schemas']['Specialization']
export type Specialization = Domain<SpecializationTransport>

export type CourseEvaluationSummaryTransport = components['schemas']['CourseEvaluationSummary']
export type CourseEvaluationSummary = Domain<CourseEvaluationSummaryTransport>

export type CourseProfessorEvaluationSummaryTransport = components['schemas']['CourseProfessorEvaluationSummary']
export type CourseProfessorEvaluationSummary = Domain<CourseProfessorEvaluationSummaryTransport>

export type ExchangePlaceListItemTransport = components['schemas']['ExchangePlaceListItem']
export type ExchangePlaceListItem = Domain<ExchangePlaceListItemTransport>

export type ProfessorEvaluationSummaryTransport = components['schemas']['ProfessorEvaluationSummary']
export type ProfessorEvaluationSummary = Domain<ProfessorEvaluationSummaryTransport>

export type BlockSet = Domain<CatalogProgramTransport['base']>
export type CourseRequirement = Domain<CatalogProgramTransport['base']['mandatory'][number]>
export type CatalogProgramModality = Domain<CatalogProgramTransport['modalities'][number]>
export type CatalogProgramLanguage = Domain<CatalogProgramTransport['languages'][number]>

export const domainModelDefinitions = {
    "Course": {
        "schema": "CourseEntity",
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
    "ClassSchedule": {
        "schema": "ClassScheduleEntity",
        "transportFields": [
            "_paths"
        ]
    },
    "Unit": {
        "schema": "UnitEntity",
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
    "StudyPeriod": {
        "schema": "StudyPeriodEntity",
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
    "Coordinator": {
        "schema": "CoordinatorEntity",
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
    "DailyMenu": {
        "schema": "DailyMenu",
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
    "Language": {
        "schema": "Language",
        "transportFields": [
            "_paths"
        ]
    },
    "ProfessorDataPortalProfile": {
        "schema": "ProfessorDataPortalProfile",
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
    "Program": {
        "schema": "Program",
        "transportFields": [
            "_paths"
        ]
    },
    "Room": {
        "schema": "RoomEntity",
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
    "CourseEvaluationSummary": {
        "schema": "CourseEvaluationSummary",
        "transportFields": []
    },
    "CourseProfessorEvaluationSummary": {
        "schema": "CourseProfessorEvaluationSummary",
        "transportFields": []
    },
    "ExchangePlaceListItem": {
        "schema": "ExchangePlaceListItem",
        "transportFields": [
            "_paths"
        ]
    },
    "ProfessorEvaluationSummary": {
        "schema": "ProfessorEvaluationSummary",
        "transportFields": []
    }
} as const
