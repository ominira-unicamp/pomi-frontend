import type { components } from './openapi.js'

export const problemCatalog = {
    "urn:pomi:problem:invalid-request": {
        "schemaName": "InvalidRequestProblem",
        "type": "urn:pomi:problem:invalid-request",
        "status": 400,
        "title": "Dados da requisição inválidos",
        "hasFields": true
    },
    "urn:pomi:problem:internal-server-error": {
        "schemaName": "InternalServerErrorProblem",
        "type": "urn:pomi:problem:internal-server-error",
        "status": 500,
        "title": "Não foi possível concluir a ação",
        "hasFields": false
    },
    "urn:pomi:problem:resource-not-found": {
        "schemaName": "ResourceNotFoundProblem",
        "type": "urn:pomi:problem:resource-not-found",
        "status": 404,
        "title": "Recurso não encontrado",
        "hasFields": false
    },
    "urn:pomi:problem:admin-identity-managed-by-cli": {
        "schemaName": "AdminIdentityManagedByCliProblem",
        "type": "urn:pomi:problem:admin-identity-managed-by-cli",
        "status": 403,
        "title": "Identidade administrada pela linha de comando",
        "hasFields": false
    },
    "urn:pomi:problem:unique-constraint-conflict": {
        "schemaName": "UniqueConstraintConflictProblem",
        "type": "urn:pomi:problem:unique-constraint-conflict",
        "status": 409,
        "title": "Informação já utilizada",
        "hasFields": true
    },
    "urn:pomi:problem:reference-not-found": {
        "schemaName": "ReferenceNotFoundProblem",
        "type": "urn:pomi:problem:reference-not-found",
        "status": 422,
        "title": "Referência não encontrada",
        "hasFields": true
    },
    "urn:pomi:problem:invalid-student-profile": {
        "schemaName": "InvalidStudentProfileProblem",
        "type": "urn:pomi:problem:invalid-student-profile",
        "status": 422,
        "title": "Perfil de aluno inválido",
        "hasFields": true
    },
    "urn:pomi:problem:invalid-curriculum": {
        "schemaName": "InvalidCurriculumProblem",
        "type": "urn:pomi:problem:invalid-curriculum",
        "status": 422,
        "title": "Planejamento curricular inválido",
        "hasFields": true
    },
    "urn:pomi:problem:invalid-period-plan": {
        "schemaName": "InvalidPeriodPlanProblem",
        "type": "urn:pomi:problem:invalid-period-plan",
        "status": 422,
        "title": "Planejamento de semestre inválido",
        "hasFields": true
    },
    "urn:pomi:problem:invalid-professor-evaluation": {
        "schemaName": "InvalidProfessorEvaluationProblem",
        "type": "urn:pomi:problem:invalid-professor-evaluation",
        "status": 422,
        "title": "Avaliação de professor inválida",
        "hasFields": true
    },
    "urn:pomi:problem:invalid-student-course-attempt": {
        "schemaName": "InvalidStudentCourseAttemptProblem",
        "type": "urn:pomi:problem:invalid-student-course-attempt",
        "status": 422,
        "title": "Tentativa de disciplina inválida",
        "hasFields": true
    },
    "urn:pomi:problem:invalid-student-history-import": {
        "schemaName": "InvalidStudentHistoryImportProblem",
        "type": "urn:pomi:problem:invalid-student-history-import",
        "status": 422,
        "title": "Importação de histórico escolar inválida",
        "hasFields": true
    },
    "urn:pomi:problem:invalid-student-absence": {
        "schemaName": "InvalidStudentAbsenceProblem",
        "type": "urn:pomi:problem:invalid-student-absence",
        "status": 422,
        "title": "Falta inválida",
        "hasFields": true
    },
    "urn:pomi:problem:invalid-feedback-report": {
        "schemaName": "InvalidFeedbackReportProblem",
        "type": "urn:pomi:problem:invalid-feedback-report",
        "status": 422,
        "title": "Feedback inválido",
        "hasFields": true
    },
    "urn:pomi:problem:feedback-rate-limit": {
        "schemaName": "FeedbackRateLimitProblem",
        "type": "urn:pomi:problem:feedback-rate-limit",
        "status": 429,
        "title": "Muitos envios de feedback",
        "hasFields": false
    }
} as const

export const operationProblemTypes = {
    "acceptStudentFriendship": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:unique-constraint-conflict",
        "urn:pomi:problem:internal-server-error"
    ],
    "addCourseTag": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:reference-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "createAuthUser": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "createCategory": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:unique-constraint-conflict",
        "urn:pomi:problem:internal-server-error"
    ],
    "createFeedbackReport": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:reference-not-found",
        "urn:pomi:problem:invalid-feedback-report",
        "urn:pomi:problem:feedback-rate-limit",
        "urn:pomi:problem:internal-server-error"
    ],
    "createStudentAbsences": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:unique-constraint-conflict",
        "urn:pomi:problem:reference-not-found",
        "urn:pomi:problem:invalid-student-absence",
        "urn:pomi:problem:internal-server-error"
    ],
    "createStudentCourseAttempts": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:unique-constraint-conflict",
        "urn:pomi:problem:reference-not-found",
        "urn:pomi:problem:invalid-student-course-attempt",
        "urn:pomi:problem:internal-server-error"
    ],
    "createStudentCurricula": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:reference-not-found",
        "urn:pomi:problem:invalid-curriculum",
        "urn:pomi:problem:internal-server-error"
    ],
    "createStudentFeedbackReport": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:reference-not-found",
        "urn:pomi:problem:invalid-feedback-report",
        "urn:pomi:problem:internal-server-error"
    ],
    "createStudentFriendship": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:unique-constraint-conflict",
        "urn:pomi:problem:internal-server-error"
    ],
    "createStudentHistory": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:invalid-student-history-import",
        "urn:pomi:problem:internal-server-error"
    ],
    "createStudentPeriodPlannings": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:reference-not-found",
        "urn:pomi:problem:invalid-period-plan",
        "urn:pomi:problem:internal-server-error"
    ],
    "createStudents": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:unique-constraint-conflict",
        "urn:pomi:problem:reference-not-found",
        "urn:pomi:problem:invalid-student-profile",
        "urn:pomi:problem:internal-server-error"
    ],
    "createTag": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:unique-constraint-conflict",
        "urn:pomi:problem:reference-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "deleteCategory": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:unique-constraint-conflict",
        "urn:pomi:problem:internal-server-error"
    ],
    "deleteStudentAbsences": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "deleteStudentCourseAttempts": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "deleteStudentCurricula": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "deleteStudentFriendship": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "deleteStudentPeriodPlannings": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "deleteStudents": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:invalid-student-profile",
        "urn:pomi:problem:internal-server-error"
    ],
    "deleteStudentTagInterest": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "deleteTag": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:unique-constraint-conflict",
        "urn:pomi:problem:internal-server-error"
    ],
    "getCategory": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getCurrentUser": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "getExchangeNoticeSubscription": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "getProfessorEvaluation": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:reference-not-found",
        "urn:pomi:problem:invalid-professor-evaluation",
        "urn:pomi:problem:internal-server-error"
    ],
    "getPublicSharedPeriodPlanning": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getStudentCourseAttempts": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getStudentCurricula": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getStudentPeriodPlannings": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getStudentPerson": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getStudentPublicProfile": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getStudents": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getStudentSharedPeriodPlanning": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getTag": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "listAuthUsers": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listBotGrants": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listBots": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listCategories": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listCourseTags": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "listFeedbackReports": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listPendingProfessorEvaluations": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listPublicSharedPeriodPlannings": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listStudentAbsences": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listStudentCourseAttempts": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listStudentCurricula": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listStudentFeedbackReports": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listStudentFriendships": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listStudentPeople": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listStudentPeriodPlannings": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listStudents": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listStudentSharedPeriodPlannings": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listStudentTagInterests": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listTagCourses": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "listTags": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "removeCourseTag": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:reference-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "replaceBotGrant": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "unsubscribeExchangeNotices": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "updateAuthUser": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:admin-identity-managed-by-cli",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "updateCategory": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:unique-constraint-conflict",
        "urn:pomi:problem:internal-server-error"
    ],
    "updateExchangeNoticeSubscription": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:reference-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "updateFeedbackReport": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "updateProfessorEvaluation": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:reference-not-found",
        "urn:pomi:problem:invalid-professor-evaluation",
        "urn:pomi:problem:internal-server-error"
    ],
    "updateStudentCourseAttempts": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:unique-constraint-conflict",
        "urn:pomi:problem:reference-not-found",
        "urn:pomi:problem:invalid-student-course-attempt",
        "urn:pomi:problem:internal-server-error"
    ],
    "updateStudentCurricula": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:reference-not-found",
        "urn:pomi:problem:invalid-curriculum",
        "urn:pomi:problem:internal-server-error"
    ],
    "updateStudentPeriodPlannings": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:reference-not-found",
        "urn:pomi:problem:invalid-period-plan",
        "urn:pomi:problem:internal-server-error"
    ],
    "updateStudentPublicProfile": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "updateStudents": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:reference-not-found",
        "urn:pomi:problem:invalid-student-profile",
        "urn:pomi:problem:internal-server-error"
    ],
    "updateStudentTagInterest": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:reference-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "updateTag": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:unique-constraint-conflict",
        "urn:pomi:problem:reference-not-found",
        "urn:pomi:problem:internal-server-error"
    ]
} as const

export type ProblemType = keyof typeof problemCatalog
export type ProblemByType = {
    "urn:pomi:problem:invalid-request": components['schemas']["InvalidRequestProblem"]
    "urn:pomi:problem:internal-server-error": components['schemas']["InternalServerErrorProblem"]
    "urn:pomi:problem:resource-not-found": components['schemas']["ResourceNotFoundProblem"]
    "urn:pomi:problem:admin-identity-managed-by-cli": components['schemas']["AdminIdentityManagedByCliProblem"]
    "urn:pomi:problem:unique-constraint-conflict": components['schemas']["UniqueConstraintConflictProblem"]
    "urn:pomi:problem:reference-not-found": components['schemas']["ReferenceNotFoundProblem"]
    "urn:pomi:problem:invalid-student-profile": components['schemas']["InvalidStudentProfileProblem"]
    "urn:pomi:problem:invalid-curriculum": components['schemas']["InvalidCurriculumProblem"]
    "urn:pomi:problem:invalid-period-plan": components['schemas']["InvalidPeriodPlanProblem"]
    "urn:pomi:problem:invalid-professor-evaluation": components['schemas']["InvalidProfessorEvaluationProblem"]
    "urn:pomi:problem:invalid-student-course-attempt": components['schemas']["InvalidStudentCourseAttemptProblem"]
    "urn:pomi:problem:invalid-student-history-import": components['schemas']["InvalidStudentHistoryImportProblem"]
    "urn:pomi:problem:invalid-student-absence": components['schemas']["InvalidStudentAbsenceProblem"]
    "urn:pomi:problem:invalid-feedback-report": components['schemas']["InvalidFeedbackReportProblem"]
    "urn:pomi:problem:feedback-rate-limit": components['schemas']["FeedbackRateLimitProblem"]
}
export type AnyProblem = ProblemByType[ProblemType]
export type OperationProblem<Name extends keyof typeof operationProblemTypes> =
    ProblemByType[(typeof operationProblemTypes)[Name][number] & ProblemType]
