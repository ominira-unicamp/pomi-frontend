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
    "createCategories": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:unique-constraint-conflict",
        "urn:pomi:problem:internal-server-error"
    ],
    "createExchangeNoticeSubscriptionsUnsubscribe": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "createFeedbackReports": [
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
    "createStudentCourseHistory": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:invalid-student-history-import",
        "urn:pomi:problem:internal-server-error"
    ],
    "createStudentCurricula": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:reference-not-found",
        "urn:pomi:problem:invalid-curriculum",
        "urn:pomi:problem:internal-server-error"
    ],
    "createStudentFeedbackReports": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:reference-not-found",
        "urn:pomi:problem:invalid-feedback-report",
        "urn:pomi:problem:internal-server-error"
    ],
    "createStudentFriendships": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:unique-constraint-conflict",
        "urn:pomi:problem:internal-server-error"
    ],
    "createStudentFriendshipsAccept": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:unique-constraint-conflict",
        "urn:pomi:problem:internal-server-error"
    ],
    "createStudentPeriodPlan": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:reference-not-found",
        "urn:pomi:problem:invalid-period-plan",
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
    "createTags": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:unique-constraint-conflict",
        "urn:pomi:problem:reference-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "deleteCategories": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:unique-constraint-conflict",
        "urn:pomi:problem:internal-server-error"
    ],
    "deleteCoursesTags": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:reference-not-found",
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
    "deleteStudentFriendships": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "deleteStudentPeriodPlan": [
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
    "deleteStudentTagInterests": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "deleteTags": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:unique-constraint-conflict",
        "urn:pomi:problem:internal-server-error"
    ],
    "getCategories": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getSharedPeriodPlannings": [
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
    "getStudentPeople": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getStudentPeriodPlan": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getStudentPeriodPlannings": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getStudents": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getStudentSharedPeriodPlannings": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getTags": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
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
    "listCoursesTags": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "listMe": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listMeBotGrants": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listSharedPeriodPlannings": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listStudentAbsences": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listStudentClassesProfessorsEvaluation": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:reference-not-found",
        "urn:pomi:problem:invalid-professor-evaluation",
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
    "listStudentExchangeNoticeSubscription": [
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
    "listStudentPeriodPlan": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listStudentPeriodPlannings": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listStudentProfessorEvaluationsPending": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listStudentPublicProfile": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
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
    "listTags": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listTagsCourses": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "updateCategories": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:unique-constraint-conflict",
        "urn:pomi:problem:internal-server-error"
    ],
    "updateCoursesTags": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:reference-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "updateMeBotGrants": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "updateStudentClassesProfessorsEvaluation": [
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
    "updateStudentExchangeNoticeSubscription": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:reference-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "updateStudentPeriodPlan": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:reference-not-found",
        "urn:pomi:problem:invalid-period-plan",
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
    "updateStudentTagInterests": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:reference-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "updateTags": [
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
