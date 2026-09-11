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
    }
} as const

export const operationProblemTypes = {
    "getCalendarEvents": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getCalendarTags": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getCatalogCourses": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getCatalogProgram": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getCatalogs": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getClasses": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getClassSchedules": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getCoauthors": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getCoordinators": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getCourses": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getCurriculumSuggestions": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getDailyMenus": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getDepartments": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getExchangeNotices": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getKeywords": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getLanguages": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getProfessorDataPortalProfiles": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getProfessorPositions": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getProfessors": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getPrograms": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getRooms": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getSpecializations": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getStudyPeriods": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "getUnits": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "listCalendar": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listCalendarEvents": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listCalendarTags": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listCatalogCourses": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listCatalogProgram": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listCatalogs": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listClasses": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listClassSchedules": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listCoauthors": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listCoordinators": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listCourses": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listCoursesEvaluationSummaries": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listCurriculumSuggestions": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listDailyMenus": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listDepartments": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listEvaluationSummaries": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:resource-not-found",
        "urn:pomi:problem:internal-server-error"
    ],
    "listExchangeNotices": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listExchangePlaces": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listKeywords": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listLanguages": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listProfessorDataPortalProfiles": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listProfessorPositions": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listProfessors": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listProfessorsEvaluationSummaries": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listPrograms": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listRooms": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listSpecializations": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listStudyPeriods": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ],
    "listUnits": [
        "urn:pomi:problem:invalid-request",
        "urn:pomi:problem:internal-server-error"
    ]
} as const

export type ProblemType = keyof typeof problemCatalog
