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

export type CurrentUserTransport = components['schemas']['CurrentUserEntity']
export type CurrentUser = Domain<CurrentUserTransport>

export type InvalidRequestProblemTransport = components['schemas']['InvalidRequestProblem']
export type InvalidRequestProblem = Domain<InvalidRequestProblemTransport>

export type ProblemFieldTransport = components['schemas']['ProblemField']
export type ProblemField = Domain<ProblemFieldTransport>

export type InternalServerErrorProblemTransport = components['schemas']['InternalServerErrorProblem']
export type InternalServerErrorProblem = Domain<InternalServerErrorProblemTransport>

export type BotIdentityTransport = components['schemas']['BotIdentityEntity']
export type BotIdentity = Domain<BotIdentityTransport>

export type BotGrantTransport = components['schemas']['BotGrantEntity']
export type BotGrant = Domain<BotGrantTransport>

export type ResourceNotFoundProblemTransport = components['schemas']['ResourceNotFoundProblem']
export type ResourceNotFoundProblem = Domain<ResourceNotFoundProblemTransport>

export type ReplaceBotGrantBodyTransport = components['schemas']['ReplaceBotGrantBody']
export type ReplaceBotGrantBody = Domain<ReplaceBotGrantBodyTransport>

export type StudentTransport = components['schemas']['StudentEntity']
export type Student = Domain<StudentTransport>

export type UniqueConstraintConflictProblemTransport = components['schemas']['UniqueConstraintConflictProblem']
export type UniqueConstraintConflictProblem = Domain<UniqueConstraintConflictProblemTransport>

export type ReferenceNotFoundProblemTransport = components['schemas']['ReferenceNotFoundProblem']
export type ReferenceNotFoundProblem = Domain<ReferenceNotFoundProblemTransport>

export type InvalidStudentProfileProblemTransport = components['schemas']['InvalidStudentProfileProblem']
export type InvalidStudentProfileProblem = Domain<InvalidStudentProfileProblemTransport>

export type CreateStudentBodyTransport = components['schemas']['CreateStudentBody']
export type CreateStudentBody = Domain<CreateStudentBodyTransport>

export type PatchStudentBodyTransport = components['schemas']['PatchStudentBody']
export type PatchStudentBody = Domain<PatchStudentBodyTransport>

export type CurriculumTransport = components['schemas']['CurriculumEntity']
export type Curriculum = Domain<CurriculumTransport>

export type CurriculumSummaryTransport = components['schemas']['CurriculumSummaryEntity']
export type CurriculumSummary = Domain<CurriculumSummaryTransport>

export type InvalidCurriculumProblemTransport = components['schemas']['InvalidCurriculumProblem']
export type InvalidCurriculumProblem = Domain<InvalidCurriculumProblemTransport>

export type PeriodPlanningTransport = components['schemas']['PeriodPlanningEntity']
export type PeriodPlanning = Domain<PeriodPlanningTransport>

export type InvalidPeriodPlanProblemTransport = components['schemas']['InvalidPeriodPlanProblem']
export type InvalidPeriodPlanProblem = Domain<InvalidPeriodPlanProblemTransport>

export type CreatePeriodPlanningInputTransport = components['schemas']['CreatePeriodPlanningInput']
export type CreatePeriodPlanningInput = Domain<CreatePeriodPlanningInputTransport>

export type UpdatePeriodPlanningInputTransport = components['schemas']['UpdatePeriodPlanningInput']
export type UpdatePeriodPlanningInput = Domain<UpdatePeriodPlanningInputTransport>

export type SharedPeriodPlanningPageTransport = components['schemas']['SharedPeriodPlanningPage']
export type SharedPeriodPlanningPage = Domain<SharedPeriodPlanningPageTransport>

export type SharedPeriodPlanningTransport = components['schemas']['SharedPeriodPlanning']
export type SharedPeriodPlanning = Domain<SharedPeriodPlanningTransport>

export type ProfessorEvaluationEligibilityTransport = components['schemas']['ProfessorEvaluationEligibility']
export type ProfessorEvaluationEligibility = Domain<ProfessorEvaluationEligibilityTransport>

export type ProfessorEvaluationTransport = components['schemas']['ProfessorEvaluation']
export type ProfessorEvaluation = Domain<ProfessorEvaluationTransport>

export type InvalidProfessorEvaluationProblemTransport = components['schemas']['InvalidProfessorEvaluationProblem']
export type InvalidProfessorEvaluationProblem = Domain<InvalidProfessorEvaluationProblemTransport>

export type ProfessorEvaluationBodyTransport = components['schemas']['ProfessorEvaluationBody']
export type ProfessorEvaluationBody = Domain<ProfessorEvaluationBodyTransport>

export type PendingProfessorEvaluationTransport = components['schemas']['PendingProfessorEvaluation']
export type PendingProfessorEvaluation = Domain<PendingProfessorEvaluationTransport>

export type StudentCourseAttemptTransport = components['schemas']['StudentCourseAttempt']
export type StudentCourseAttempt = Domain<StudentCourseAttemptTransport>

export type InvalidStudentCourseAttemptProblemTransport = components['schemas']['InvalidStudentCourseAttemptProblem']
export type InvalidStudentCourseAttemptProblem = Domain<InvalidStudentCourseAttemptProblemTransport>

export type CreateStudentCourseAttemptInputTransport = components['schemas']['CreateStudentCourseAttemptInput']
export type CreateStudentCourseAttemptInput = Domain<CreateStudentCourseAttemptInputTransport>

export type UpdateStudentCourseAttemptInputTransport = components['schemas']['UpdateStudentCourseAttemptInput']
export type UpdateStudentCourseAttemptInput = Domain<UpdateStudentCourseAttemptInputTransport>

export type StudentHistoryImportSummaryTransport = components['schemas']['StudentHistoryImportSummary']
export type StudentHistoryImportSummary = Domain<StudentHistoryImportSummaryTransport>

export type InvalidStudentHistoryImportProblemTransport = components['schemas']['InvalidStudentHistoryImportProblem']
export type InvalidStudentHistoryImportProblem = Domain<InvalidStudentHistoryImportProblemTransport>

export type StudentHistoryImportBodyTransport = components['schemas']['StudentHistoryImportBody']
export type StudentHistoryImportBody = Domain<StudentHistoryImportBodyTransport>

export type StudentAbsenceTransport = components['schemas']['StudentAbsence']
export type StudentAbsence = Domain<StudentAbsenceTransport>

export type InvalidStudentAbsenceProblemTransport = components['schemas']['InvalidStudentAbsenceProblem']
export type InvalidStudentAbsenceProblem = Domain<InvalidStudentAbsenceProblemTransport>

export type CreateStudentAbsenceBodyTransport = components['schemas']['CreateStudentAbsenceBody']
export type CreateStudentAbsenceBody = Domain<CreateStudentAbsenceBodyTransport>

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

export type InvalidFeedbackReportProblemTransport = components['schemas']['InvalidFeedbackReportProblem']
export type InvalidFeedbackReportProblem = Domain<InvalidFeedbackReportProblemTransport>

export type FeedbackRateLimitProblemTransport = components['schemas']['FeedbackRateLimitProblem']
export type FeedbackRateLimitProblem = Domain<FeedbackRateLimitProblemTransport>

export type CreateFeedbackReportBodyTransport = components['schemas']['CreateFeedbackReportBody']
export type CreateFeedbackReportBody = Domain<CreateFeedbackReportBodyTransport>

export type FeedbackReportTargetTransport = components['schemas']['FeedbackReportTarget']
export type FeedbackReportTarget = Domain<FeedbackReportTargetTransport>

export type FeedbackReportTransport = components['schemas']['FeedbackReport']
export type FeedbackReport = Domain<FeedbackReportTransport>

export type ExchangeNoticeSubscriptionTransport = components['schemas']['ExchangeNoticeSubscription']
export type ExchangeNoticeSubscription = Domain<ExchangeNoticeSubscriptionTransport>

export type PatchExchangeNoticeSubscriptionBodyTransport = components['schemas']['PatchExchangeNoticeSubscriptionBody']
export type PatchExchangeNoticeSubscriptionBody = Domain<PatchExchangeNoticeSubscriptionBodyTransport>

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
    "BotIdentity": {
        "schema": "BotIdentityEntity",
        "transportFields": []
    },
    "BotGrant": {
        "schema": "BotGrantEntity",
        "transportFields": []
    },
    "ResourceNotFoundProblem": {
        "schema": "ResourceNotFoundProblem",
        "transportFields": []
    },
    "ReplaceBotGrantBody": {
        "schema": "ReplaceBotGrantBody",
        "transportFields": []
    },
    "Student": {
        "schema": "StudentEntity",
        "transportFields": [
            "_paths"
        ]
    },
    "UniqueConstraintConflictProblem": {
        "schema": "UniqueConstraintConflictProblem",
        "transportFields": []
    },
    "ReferenceNotFoundProblem": {
        "schema": "ReferenceNotFoundProblem",
        "transportFields": []
    },
    "InvalidStudentProfileProblem": {
        "schema": "InvalidStudentProfileProblem",
        "transportFields": []
    },
    "CreateStudentBody": {
        "schema": "CreateStudentBody",
        "transportFields": []
    },
    "PatchStudentBody": {
        "schema": "PatchStudentBody",
        "transportFields": []
    },
    "Curriculum": {
        "schema": "CurriculumEntity",
        "transportFields": [
            "_paths"
        ]
    },
    "CurriculumSummary": {
        "schema": "CurriculumSummaryEntity",
        "transportFields": [
            "_paths"
        ]
    },
    "InvalidCurriculumProblem": {
        "schema": "InvalidCurriculumProblem",
        "transportFields": []
    },
    "PeriodPlanning": {
        "schema": "PeriodPlanningEntity",
        "transportFields": [
            "_paths"
        ]
    },
    "InvalidPeriodPlanProblem": {
        "schema": "InvalidPeriodPlanProblem",
        "transportFields": []
    },
    "CreatePeriodPlanningInput": {
        "schema": "CreatePeriodPlanningInput",
        "transportFields": []
    },
    "UpdatePeriodPlanningInput": {
        "schema": "UpdatePeriodPlanningInput",
        "transportFields": []
    },
    "SharedPeriodPlanningPage": {
        "schema": "SharedPeriodPlanningPage",
        "transportFields": []
    },
    "SharedPeriodPlanning": {
        "schema": "SharedPeriodPlanning",
        "transportFields": []
    },
    "ProfessorEvaluationEligibility": {
        "schema": "ProfessorEvaluationEligibility",
        "transportFields": []
    },
    "ProfessorEvaluation": {
        "schema": "ProfessorEvaluation",
        "transportFields": []
    },
    "InvalidProfessorEvaluationProblem": {
        "schema": "InvalidProfessorEvaluationProblem",
        "transportFields": []
    },
    "ProfessorEvaluationBody": {
        "schema": "ProfessorEvaluationBody",
        "transportFields": []
    },
    "PendingProfessorEvaluation": {
        "schema": "PendingProfessorEvaluation",
        "transportFields": []
    },
    "StudentCourseAttempt": {
        "schema": "StudentCourseAttempt",
        "transportFields": [
            "_paths"
        ]
    },
    "InvalidStudentCourseAttemptProblem": {
        "schema": "InvalidStudentCourseAttemptProblem",
        "transportFields": []
    },
    "CreateStudentCourseAttemptInput": {
        "schema": "CreateStudentCourseAttemptInput",
        "transportFields": []
    },
    "UpdateStudentCourseAttemptInput": {
        "schema": "UpdateStudentCourseAttemptInput",
        "transportFields": []
    },
    "StudentHistoryImportSummary": {
        "schema": "StudentHistoryImportSummary",
        "transportFields": []
    },
    "InvalidStudentHistoryImportProblem": {
        "schema": "InvalidStudentHistoryImportProblem",
        "transportFields": []
    },
    "StudentHistoryImportBody": {
        "schema": "StudentHistoryImportBody",
        "transportFields": []
    },
    "StudentAbsence": {
        "schema": "StudentAbsence",
        "transportFields": [
            "_paths"
        ]
    },
    "InvalidStudentAbsenceProblem": {
        "schema": "InvalidStudentAbsenceProblem",
        "transportFields": []
    },
    "CreateStudentAbsenceBody": {
        "schema": "CreateStudentAbsenceBody",
        "transportFields": []
    },
    "StudentPublicProfile": {
        "schema": "StudentPublicProfile",
        "transportFields": [
            "_paths"
        ]
    },
    "StudentCurrentCourse": {
        "schema": "StudentCurrentCourse",
        "transportFields": []
    },
    "StudentPeoplePage": {
        "schema": "StudentPeoplePage",
        "transportFields": []
    },
    "StudentPublicPerson": {
        "schema": "StudentPublicPerson",
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
    "FeedbackReportAccepted": {
        "schema": "FeedbackReportAccepted",
        "transportFields": []
    },
    "InvalidFeedbackReportProblem": {
        "schema": "InvalidFeedbackReportProblem",
        "transportFields": []
    },
    "FeedbackRateLimitProblem": {
        "schema": "FeedbackRateLimitProblem",
        "transportFields": []
    },
    "CreateFeedbackReportBody": {
        "schema": "CreateFeedbackReportBody",
        "transportFields": []
    },
    "FeedbackReportTarget": {
        "schema": "FeedbackReportTarget",
        "transportFields": []
    },
    "FeedbackReport": {
        "schema": "FeedbackReport",
        "transportFields": []
    },
    "ExchangeNoticeSubscription": {
        "schema": "ExchangeNoticeSubscription",
        "transportFields": []
    },
    "PatchExchangeNoticeSubscriptionBody": {
        "schema": "PatchExchangeNoticeSubscriptionBody",
        "transportFields": []
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
    "StudentTagInterest": {
        "schema": "StudentTagInterest",
        "transportFields": []
    }
} as const
