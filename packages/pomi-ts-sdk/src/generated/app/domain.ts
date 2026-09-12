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

export type StudentCourseAttemptTransport = components['schemas']['StudentCourseAttempt']
export type StudentCourseAttempt = Domain<StudentCourseAttemptTransport>

export type CategoryTransport = components['schemas']['Category']
export type Category = Domain<CategoryTransport>

export type TagTransport = components['schemas']['Tag']
export type Tag = Domain<TagTransport>

export type TagRelatedCourseTransport = components['schemas']['TagRelatedCourse']
export type TagRelatedCourse = Domain<TagRelatedCourseTransport>

export type FeedbackReportAcceptedTransport = components['schemas']['FeedbackReportAccepted']
export type FeedbackReportAccepted = Domain<FeedbackReportAcceptedTransport>

export type StudentAbsenceTransport = components['schemas']['StudentAbsence']
export type StudentAbsence = Domain<StudentAbsenceTransport>

export type StudentHistoryImportSummaryTransport = components['schemas']['StudentHistoryImportSummary']
export type StudentHistoryImportSummary = Domain<StudentHistoryImportSummaryTransport>

export type CurriculumTransport = components['schemas']['CurriculumEntity']
export type Curriculum = Domain<CurriculumTransport>

export type StudentFriendshipTransport = components['schemas']['StudentFriendship']
export type StudentFriendship = Domain<StudentFriendshipTransport>

export type PeriodPlanningTransport = components['schemas']['PeriodPlanningEntity']
export type PeriodPlanning = Domain<PeriodPlanningTransport>

export type StudentTransport = components['schemas']['StudentEntity']
export type Student = Domain<StudentTransport>

export type SharedPeriodPlanningTransport = components['schemas']['SharedPeriodPlanning']
export type SharedPeriodPlanning = Domain<SharedPeriodPlanningTransport>

export type StudentPublicPersonTransport = components['schemas']['StudentPublicPerson']
export type StudentPublicPerson = Domain<StudentPublicPersonTransport>

export type BotIdentityTransport = components['schemas']['BotIdentityEntity']
export type BotIdentity = Domain<BotIdentityTransport>

export type CurrentUserTransport = components['schemas']['CurrentUserEntity']
export type CurrentUser = Domain<CurrentUserTransport>

export type BotGrantTransport = components['schemas']['BotGrantEntity']
export type BotGrant = Domain<BotGrantTransport>

export type ProfessorEvaluationEligibilityTransport = components['schemas']['ProfessorEvaluationEligibility']
export type ProfessorEvaluationEligibility = Domain<ProfessorEvaluationEligibilityTransport>

export type CurriculumSummaryTransport = components['schemas']['CurriculumSummaryEntity']
export type CurriculumSummary = Domain<CurriculumSummaryTransport>

export type ExchangeNoticeSubscriptionTransport = components['schemas']['ExchangeNoticeSubscription']
export type ExchangeNoticeSubscription = Domain<ExchangeNoticeSubscriptionTransport>

export type FeedbackReportTransport = components['schemas']['FeedbackReport']
export type FeedbackReport = Domain<FeedbackReportTransport>

export type PendingProfessorEvaluationTransport = components['schemas']['PendingProfessorEvaluation']
export type PendingProfessorEvaluation = Domain<PendingProfessorEvaluationTransport>

export type StudentPublicProfileTransport = components['schemas']['StudentPublicProfile']
export type StudentPublicProfile = Domain<StudentPublicProfileTransport>

export type StudentTagInterestTransport = components['schemas']['StudentTagInterest']
export type StudentTagInterest = Domain<StudentTagInterestTransport>

export type ProfessorEvaluationTransport = components['schemas']['ProfessorEvaluation']
export type ProfessorEvaluation = Domain<ProfessorEvaluationTransport>



export const domainModelDefinitions = {
    "StudentCourseAttempt": {
        "schema": "StudentCourseAttempt",
        "transportFields": [
            "_paths"
        ]
    },
    "Category": {
        "schema": "Category",
        "transportFields": []
    },
    "Tag": {
        "schema": "Tag",
        "transportFields": []
    },
    "TagRelatedCourse": {
        "schema": "TagRelatedCourse",
        "transportFields": []
    },
    "FeedbackReportAccepted": {
        "schema": "FeedbackReportAccepted",
        "transportFields": []
    },
    "StudentAbsence": {
        "schema": "StudentAbsence",
        "transportFields": [
            "_paths"
        ]
    },
    "StudentHistoryImportSummary": {
        "schema": "StudentHistoryImportSummary",
        "transportFields": []
    },
    "Curriculum": {
        "schema": "CurriculumEntity",
        "transportFields": [
            "_paths"
        ]
    },
    "StudentFriendship": {
        "schema": "StudentFriendship",
        "transportFields": [
            "_paths"
        ]
    },
    "PeriodPlanning": {
        "schema": "PeriodPlanningEntity",
        "transportFields": [
            "_paths"
        ]
    },
    "Student": {
        "schema": "StudentEntity",
        "transportFields": [
            "_paths"
        ]
    },
    "SharedPeriodPlanning": {
        "schema": "SharedPeriodPlanning",
        "transportFields": []
    },
    "StudentPublicPerson": {
        "schema": "StudentPublicPerson",
        "transportFields": [
            "_paths"
        ]
    },
    "BotIdentity": {
        "schema": "BotIdentityEntity",
        "transportFields": []
    },
    "CurrentUser": {
        "schema": "CurrentUserEntity",
        "transportFields": []
    },
    "BotGrant": {
        "schema": "BotGrantEntity",
        "transportFields": []
    },
    "ProfessorEvaluationEligibility": {
        "schema": "ProfessorEvaluationEligibility",
        "transportFields": []
    },
    "CurriculumSummary": {
        "schema": "CurriculumSummaryEntity",
        "transportFields": [
            "_paths"
        ]
    },
    "ExchangeNoticeSubscription": {
        "schema": "ExchangeNoticeSubscription",
        "transportFields": []
    },
    "FeedbackReport": {
        "schema": "FeedbackReport",
        "transportFields": []
    },
    "PendingProfessorEvaluation": {
        "schema": "PendingProfessorEvaluation",
        "transportFields": []
    },
    "StudentPublicProfile": {
        "schema": "StudentPublicProfile",
        "transportFields": [
            "_paths"
        ]
    },
    "StudentTagInterest": {
        "schema": "StudentTagInterest",
        "transportFields": []
    },
    "ProfessorEvaluation": {
        "schema": "ProfessorEvaluation",
        "transportFields": []
    }
} as const
