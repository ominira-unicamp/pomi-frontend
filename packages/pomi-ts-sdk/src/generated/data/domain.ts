import type { components } from './openapi.js'

export type Domain<T> = T extends null
    ? null
    : T extends ReadonlyArray<infer Item>
    ? ReadonlyArray<Domain<Item>>
    : T extends object
    ? { readonly [Key in keyof T]: Domain<T[Key]> }
    : T

export type PaginationLinks = {
    self: string
    first: string
    last: string
    next: string | null
    previous: string | null
}

export type Page<T> = {
    data: ReadonlyArray<T>
    quantity: number
    total: number
    links: PaginationLinks
}

export type DomainComponentSchemaName = keyof components['schemas']
export type Component<Name extends DomainComponentSchemaName> = Domain<components['schemas'][Name]>

export type PageProfessorEvaluationSummariesTransport = components['schemas']['PageProfessorEvaluationSummaries']
export type PageProfessorEvaluationSummaries = Domain<PageProfessorEvaluationSummariesTransport>

export type ProfessorEvaluationSummaryTransport = components['schemas']['ProfessorEvaluationSummary']
export type ProfessorEvaluationSummary = Domain<ProfessorEvaluationSummaryTransport>

export type PageCourseEvaluationSummariesTransport = components['schemas']['PageCourseEvaluationSummaries']
export type PageCourseEvaluationSummaries = Domain<PageCourseEvaluationSummariesTransport>

export type CourseEvaluationSummaryTransport = components['schemas']['CourseEvaluationSummary']
export type CourseEvaluationSummary = Domain<CourseEvaluationSummaryTransport>

export type CourseProfessorEvaluationSummaryTransport = components['schemas']['CourseProfessorEvaluationSummary']
export type CourseProfessorEvaluationSummary = Domain<CourseProfessorEvaluationSummaryTransport>

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

export type CourseBlockSetTransport = components['schemas']['CourseBlockSet']
export type CourseBlockSet = Domain<CourseBlockSetTransport>

export type CourseRequirementTransport = components['schemas']['CourseRequirement']
export type CourseRequirement = Domain<CourseRequirementTransport>

export type ElectiveBlockTransport = components['schemas']['ElectiveBlock']
export type ElectiveBlock = Domain<ElectiveBlockTransport>

export type CatalogProgramVariantTransport = components['schemas']['CatalogProgramVariant']
export type CatalogProgramVariant = Domain<CatalogProgramVariantTransport>

export type CatalogProgramLanguageTransport = components['schemas']['CatalogProgramLanguage']
export type CatalogProgramLanguage = Domain<CatalogProgramLanguageTransport>

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



export const domainModelDefinitions = {
    "PageProfessorEvaluationSummaries": {
        "schema": "PageProfessorEvaluationSummaries",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "ProfessorEvaluationSummary": {
        "schema": "ProfessorEvaluationSummary",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "PageCourseEvaluationSummaries": {
        "schema": "PageCourseEvaluationSummaries",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "CourseEvaluationSummary": {
        "schema": "CourseEvaluationSummary",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "CourseProfessorEvaluationSummary": {
        "schema": "CourseProfessorEvaluationSummary",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "Unit": {
        "schema": "UnitEntity",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "Course": {
        "schema": "CourseEntity",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "PageCourses": {
        "schema": "PageCourses",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "Professor": {
        "schema": "ProfessorEntity",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "PageProfessors": {
        "schema": "PageProfessors",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "ProfessorDataPortalProfileSummary": {
        "schema": "ProfessorDataPortalProfileSummary",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "Department": {
        "schema": "Department",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "ProfessorPosition": {
        "schema": "ProfessorPosition",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "CareerReference": {
        "schema": "CareerReference",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "ProfessorDataPortalProfile": {
        "schema": "ProfessorDataPortalProfile",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "Keyword": {
        "schema": "Keyword",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "Coauthor": {
        "schema": "Coauthor",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "Room": {
        "schema": "RoomEntity",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "Catalog": {
        "schema": "Catalog",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "CatalogCourse": {
        "schema": "CatalogCourseEntity",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "Coordinator": {
        "schema": "CoordinatorEntity",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "CatalogProgram": {
        "schema": "CatalogProgramEntity",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {
            "catalogId": {
                "resource": "catalogs",
                "cardinality": "one"
            },
            "programId": {
                "resource": "programs",
                "cardinality": "one"
            },
            "variants": {
                "resource": "catalogProgramVariants",
                "cardinality": "many"
            },
            "languages": {
                "resource": "languages",
                "cardinality": "many"
            }
        }
    },
    "CourseBlockSet": {
        "schema": "CourseBlockSet",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "CourseRequirement": {
        "schema": "CourseRequirement",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "ElectiveBlock": {
        "schema": "ElectiveBlock",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "CatalogProgramVariant": {
        "schema": "CatalogProgramVariant",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "CatalogProgramLanguage": {
        "schema": "CatalogProgramLanguage",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "CurriculumSuggestion": {
        "schema": "CurriculumSuggestionEntity",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "SemesterSuggestion": {
        "schema": "SemesterSuggestionEntity",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "CurriculumSuggestionCourse": {
        "schema": "CurriculumSuggestionCourseEntity",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "Language": {
        "schema": "Language",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "Program": {
        "schema": "Program",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "Specialization": {
        "schema": "Specialization",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "ExchangeNotice": {
        "schema": "ExchangeNotice",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "ExchangePlace": {
        "schema": "ExchangePlace",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "ExchangeNoticeFile": {
        "schema": "ExchangeNoticeFile",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "ExchangePlaceListItem": {
        "schema": "ExchangePlaceListItem",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "CalendarEvent": {
        "schema": "CalendarEvent",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "CalendarTag": {
        "schema": "CalendarTag",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "Class": {
        "schema": "ClassEntity",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "ClassSchedule": {
        "schema": "ClassScheduleEntity",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {
            "roomId": {
                "resource": "rooms",
                "cardinality": "one"
            },
            "classId": {
                "resource": "classes",
                "cardinality": "one"
            },
            "unitId": {
                "resource": "units",
                "cardinality": "one",
                "nullable": true
            },
            "courseId": {
                "resource": "courses",
                "cardinality": "one"
            },
            "studyPeriodId": {
                "resource": "studyPeriods",
                "cardinality": "one"
            }
        }
    },
    "PageClassSchedules": {
        "schema": "PageClassSchedules",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "DailyMenu": {
        "schema": "DailyMenu",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "Meal": {
        "schema": "Meal",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "StudyPeriod": {
        "schema": "StudyPeriodEntity",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    }
} as const
