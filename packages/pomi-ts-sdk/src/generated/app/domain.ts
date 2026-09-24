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

export type CurrentUserTransport = components['schemas']['CurrentUserEntity']
export type CurrentUser = Domain<CurrentUserTransport>

export type BotIdentityTransport = components['schemas']['BotIdentityEntity']
export type BotIdentity = Domain<BotIdentityTransport>

export type BotGrantTransport = components['schemas']['BotGrantEntity']
export type BotGrant = Domain<BotGrantTransport>

export type AuthUserTransport = components['schemas']['AuthUserEntity']
export type AuthUser = Domain<AuthUserTransport>

export type StudentTransport = components['schemas']['StudentEntity']
export type Student = Domain<StudentTransport>

export type CurriculumTransport = components['schemas']['CurriculumEntity']
export type Curriculum = Domain<CurriculumTransport>

export type CurriculumSummaryTransport = components['schemas']['CurriculumSummaryEntity']
export type CurriculumSummary = Domain<CurriculumSummaryTransport>

export type PeriodPlanningTransport = components['schemas']['PeriodPlanningEntity']
export type PeriodPlanning = Domain<PeriodPlanningTransport>

export type PlanningGuideTransport = components['schemas']['PlanningGuide']
export type PlanningGuide = Domain<PlanningGuideTransport>

export type PeriodPlanningClassTransport = components['schemas']['PeriodPlanningClass']
export type PeriodPlanningClass = Domain<PeriodPlanningClassTransport>

export type PeriodPlanningProfessorTransport = components['schemas']['PeriodPlanningProfessor']
export type PeriodPlanningProfessor = Domain<PeriodPlanningProfessorTransport>

export type PeriodPlanningScheduleTransport = components['schemas']['PeriodPlanningSchedule']
export type PeriodPlanningSchedule = Domain<PeriodPlanningScheduleTransport>

export type SharedPeriodPlanningPageTransport = components['schemas']['SharedPeriodPlanningPage']
export type SharedPeriodPlanningPage = Domain<SharedPeriodPlanningPageTransport>

export type SharedPeriodPlanningTransport = components['schemas']['SharedPeriodPlanning']
export type SharedPeriodPlanning = Domain<SharedPeriodPlanningTransport>

export type ProfessorEvaluationEligibilityTransport = components['schemas']['ProfessorEvaluationEligibility']
export type ProfessorEvaluationEligibility = Domain<ProfessorEvaluationEligibilityTransport>

export type ProfessorEvaluationTransport = components['schemas']['ProfessorEvaluation']
export type ProfessorEvaluation = Domain<ProfessorEvaluationTransport>

export type PendingProfessorEvaluationTransport = components['schemas']['PendingProfessorEvaluation']
export type PendingProfessorEvaluation = Domain<PendingProfessorEvaluationTransport>

export type StudentCourseAttemptTransport = components['schemas']['StudentCourseAttempt']
export type StudentCourseAttempt = Domain<StudentCourseAttemptTransport>

export type CourseAttemptCourseTransport = components['schemas']['CourseAttemptCourse']
export type CourseAttemptCourse = Domain<CourseAttemptCourseTransport>

export type CourseAttemptStudyPeriodTransport = components['schemas']['CourseAttemptStudyPeriod']
export type CourseAttemptStudyPeriod = Domain<CourseAttemptStudyPeriodTransport>

export type CourseAttemptClassTransport = components['schemas']['CourseAttemptClass']
export type CourseAttemptClass = Domain<CourseAttemptClassTransport>

export type StudentHistoryImportSummaryTransport = components['schemas']['StudentHistoryImportSummary']
export type StudentHistoryImportSummary = Domain<StudentHistoryImportSummaryTransport>

export type StudentAbsenceTransport = components['schemas']['StudentAbsence']
export type StudentAbsence = Domain<StudentAbsenceTransport>

export type StudentPublicProfileTransport = components['schemas']['StudentPublicProfile']
export type StudentPublicProfile = Domain<StudentPublicProfileTransport>

export type StudentCurrentCourseTransport = components['schemas']['StudentCurrentCourse']
export type StudentCurrentCourse = Domain<StudentCurrentCourseTransport>

export type StudentPeoplePageTransport = components['schemas']['StudentPeoplePage']
export type StudentPeoplePage = Domain<StudentPeoplePageTransport>

export type StudentPublicPersonTransport = components['schemas']['StudentPublicPerson']
export type StudentPublicPerson = Domain<StudentPublicPersonTransport>

export type StudentFriendshipTransport = components['schemas']['StudentFriendship']
export type StudentFriendship = Domain<StudentFriendshipTransport>

export type FeedbackReportAcceptedTransport = components['schemas']['FeedbackReportAccepted']
export type FeedbackReportAccepted = Domain<FeedbackReportAcceptedTransport>

export type FeedbackReportTargetTransport = components['schemas']['FeedbackReportTarget']
export type FeedbackReportTarget = Domain<FeedbackReportTargetTransport>

export type FeedbackReportTransport = components['schemas']['FeedbackReport']
export type FeedbackReport = Domain<FeedbackReportTransport>

export type ExchangeNoticeSubscriptionTransport = components['schemas']['ExchangeNoticeSubscription']
export type ExchangeNoticeSubscription = Domain<ExchangeNoticeSubscriptionTransport>

export type CategoryTransport = components['schemas']['Category']
export type Category = Domain<CategoryTransport>

export type TagTransport = components['schemas']['Tag']
export type Tag = Domain<TagTransport>

export type TagRelatedCourseTransport = components['schemas']['TagRelatedCourse']
export type TagRelatedCourse = Domain<TagRelatedCourseTransport>

export type StudentTagInterestTransport = components['schemas']['StudentTagInterest']
export type StudentTagInterest = Domain<StudentTagInterestTransport>



export const domainModelDefinitions = {
    "CurrentUser": {
        "schema": "CurrentUserEntity",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "BotIdentity": {
        "schema": "BotIdentityEntity",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "BotGrant": {
        "schema": "BotGrantEntity",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "AuthUser": {
        "schema": "AuthUserEntity",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "Student": {
        "schema": "StudentEntity",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "Curriculum": {
        "schema": "CurriculumEntity",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "CurriculumSummary": {
        "schema": "CurriculumSummaryEntity",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "PeriodPlanning": {
        "schema": "PeriodPlanningEntity",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {
            "studentId": {
                "resource": "students",
                "cardinality": "one"
            },
            "studyPeriodId": {
                "resource": "studyPeriods",
                "cardinality": "one"
            },
            "curriculumId": {
                "resource": "curricula",
                "cardinality": "one",
                "nullable": true
            },
            "classes": {
                "resource": "classes",
                "cardinality": "many"
            }
        }
    },
    "PlanningGuide": {
        "schema": "PlanningGuide",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "PeriodPlanningClass": {
        "schema": "PeriodPlanningClass",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "PeriodPlanningProfessor": {
        "schema": "PeriodPlanningProfessor",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "PeriodPlanningSchedule": {
        "schema": "PeriodPlanningSchedule",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "SharedPeriodPlanningPage": {
        "schema": "SharedPeriodPlanningPage",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "SharedPeriodPlanning": {
        "schema": "SharedPeriodPlanning",
        "transportFields": [],
        "identityFields": [
            "shareId"
        ],
        "readOnlyFields": [],
        "relations": {
            "classes": {
                "resource": "classes",
                "cardinality": "many"
            }
        }
    },
    "ProfessorEvaluationEligibility": {
        "schema": "ProfessorEvaluationEligibility",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "ProfessorEvaluation": {
        "schema": "ProfessorEvaluation",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "PendingProfessorEvaluation": {
        "schema": "PendingProfessorEvaluation",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "StudentCourseAttempt": {
        "schema": "StudentCourseAttempt",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {
            "course": {
                "resource": "courses",
                "cardinality": "one"
            },
            "studyPeriod": {
                "resource": "studyPeriods",
                "cardinality": "one",
                "nullable": true
            },
            "class": {
                "resource": "classes",
                "cardinality": "one",
                "nullable": true
            }
        }
    },
    "CourseAttemptCourse": {
        "schema": "CourseAttemptCourse",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "CourseAttemptStudyPeriod": {
        "schema": "CourseAttemptStudyPeriod",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "CourseAttemptClass": {
        "schema": "CourseAttemptClass",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "StudentHistoryImportSummary": {
        "schema": "StudentHistoryImportSummary",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "StudentAbsence": {
        "schema": "StudentAbsence",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "StudentPublicProfile": {
        "schema": "StudentPublicProfile",
        "transportFields": [],
        "identityFields": [
            "publicId"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "StudentCurrentCourse": {
        "schema": "StudentCurrentCourse",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "StudentPeoplePage": {
        "schema": "StudentPeoplePage",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "StudentPublicPerson": {
        "schema": "StudentPublicPerson",
        "transportFields": [],
        "identityFields": [
            "publicId"
        ],
        "readOnlyFields": [],
        "relations": {
            "currentCourses": {
                "resource": "courses",
                "cardinality": "many"
            },
            "program": {
                "resource": "programs",
                "cardinality": "one",
                "nullable": true
            },
            "specialization": {
                "resource": "specializations",
                "cardinality": "one",
                "nullable": true
            }
        }
    },
    "StudentFriendship": {
        "schema": "StudentFriendship",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {
            "friend": {
                "resource": "studentSocial",
                "cardinality": "one"
            }
        }
    },
    "FeedbackReportAccepted": {
        "schema": "FeedbackReportAccepted",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "FeedbackReportTarget": {
        "schema": "FeedbackReportTarget",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "FeedbackReport": {
        "schema": "FeedbackReport",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "ExchangeNoticeSubscription": {
        "schema": "ExchangeNoticeSubscription",
        "transportFields": [],
        "identityFields": [],
        "readOnlyFields": [],
        "relations": {}
    },
    "Category": {
        "schema": "Category",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "Tag": {
        "schema": "Tag",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "TagRelatedCourse": {
        "schema": "TagRelatedCourse",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    },
    "StudentTagInterest": {
        "schema": "StudentTagInterest",
        "transportFields": [],
        "identityFields": [
            "id"
        ],
        "readOnlyFields": [],
        "relations": {}
    }
} as const
