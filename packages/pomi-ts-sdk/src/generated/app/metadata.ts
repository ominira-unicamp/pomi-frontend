export const componentSchemas = {
    "CurrentUserEntity": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "roles": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "capabilities": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "studentId": {
                "type": "integer",
                "nullable": true
            }
        },
        "required": [
            "id",
            "roles",
            "capabilities",
            "studentId"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "CurrentUser",
            "identityFields": [
                "id"
            ]
        }
    },
    "InvalidRequestProblem": {
        "type": "object",
        "properties": {
            "type": {
                "type": "string",
                "enum": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            "title": {
                "type": "string",
                "enum": [
                    "Dados da requisição inválidos"
                ]
            },
            "status": {
                "type": "number",
                "enum": [
                    400
                ]
            },
            "detail": {
                "type": "string"
            },
            "instance": {
                "type": "string"
            },
            "fields": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/ProblemField"
                }
            }
        },
        "required": [
            "type",
            "title",
            "status",
            "detail",
            "fields"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "problem",
            "publicName": "InvalidRequestProblem"
        }
    },
    "ProblemField": {
        "type": "object",
        "properties": {
            "code": {
                "type": "string"
            },
            "path": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "message": {
                "type": "string"
            },
            "details": {
                "type": "object",
                "additionalProperties": {
                    "nullable": true
                }
            }
        },
        "required": [
            "code",
            "path",
            "message"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "problem",
            "publicName": "ProblemField"
        }
    },
    "InternalServerErrorProblem": {
        "type": "object",
        "properties": {
            "type": {
                "type": "string",
                "enum": [
                    "urn:pomi:problem:internal-server-error"
                ]
            },
            "title": {
                "type": "string",
                "enum": [
                    "Não foi possível concluir a ação"
                ]
            },
            "status": {
                "type": "number",
                "enum": [
                    500
                ]
            },
            "detail": {
                "type": "string"
            },
            "instance": {
                "type": "string"
            }
        },
        "required": [
            "type",
            "title",
            "status",
            "detail"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "problem",
            "publicName": "InternalServerErrorProblem"
        }
    },
    "BotIdentityEntity": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "displayName": {
                "type": "string",
                "nullable": true
            }
        },
        "required": [
            "id",
            "displayName"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "BotIdentity",
            "identityFields": [
                "id"
            ]
        }
    },
    "PaginationLinks": {
        "type": "object",
        "properties": {
            "self": {
                "type": "string",
                "format": "uri-reference"
            },
            "first": {
                "type": "string",
                "format": "uri-reference"
            },
            "last": {
                "type": "string",
                "format": "uri-reference"
            },
            "next": {
                "type": "string",
                "nullable": true,
                "format": "uri-reference"
            },
            "previous": {
                "type": "string",
                "nullable": true,
                "format": "uri-reference"
            }
        },
        "required": [
            "self",
            "first",
            "last",
            "next",
            "previous"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "transport",
            "publicName": "PaginationLinks",
            "generate": false
        }
    },
    "BotGrantEntity": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "studentId": {
                "type": "integer"
            },
            "botAuthUserId": {
                "type": "integer"
            },
            "capability": {
                "$ref": "#/components/schemas/StudentCapability"
            },
            "createdAt": {
                "type": "string",
                "nullable": true,
                "format": "date-time"
            },
            "revokedAt": {
                "type": "string",
                "nullable": true,
                "format": "date-time"
            },
            "botAuthUser": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer"
                    },
                    "displayName": {
                        "type": "string",
                        "nullable": true
                    }
                },
                "required": [
                    "id",
                    "displayName"
                ]
            }
        },
        "required": [
            "id",
            "studentId",
            "botAuthUserId",
            "capability",
            "createdAt",
            "revokedAt",
            "botAuthUser"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "BotGrant",
            "identityFields": [
                "id"
            ]
        }
    },
    "StudentCapability": {
        "type": "string",
        "enum": [
            "STUDENT_PROFILE_READ",
            "STUDENT_PROFILE_WRITE",
            "STUDENT_HISTORY_READ",
            "STUDENT_HISTORY_WRITE",
            "STUDENT_PLANNING_READ",
            "STUDENT_PLANNING_WRITE",
            "STUDENT_SOCIAL_READ",
            "STUDENT_SOCIAL_WRITE",
            "STUDENT_FEEDBACK_READ",
            "STUDENT_FEEDBACK_WRITE"
        ],
        "x-pomi-schema": {
            "kind": "value-object",
            "publicName": "StudentCapability"
        }
    },
    "ResourceNotFoundProblem": {
        "type": "object",
        "properties": {
            "type": {
                "type": "string",
                "enum": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            "title": {
                "type": "string",
                "enum": [
                    "Recurso não encontrado"
                ]
            },
            "status": {
                "type": "number",
                "enum": [
                    404
                ]
            },
            "detail": {
                "type": "string"
            },
            "instance": {
                "type": "string"
            }
        },
        "required": [
            "type",
            "title",
            "status",
            "detail"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "problem",
            "publicName": "ResourceNotFoundProblem"
        }
    },
    "ReplaceBotGrantBody": {
        "type": "object",
        "properties": {
            "capabilities": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/StudentCapability"
                }
            }
        },
        "required": [
            "capabilities"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "input",
            "publicName": "ReplaceBotGrantBody"
        }
    },
    "AuthUserEntity": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "issuer": {
                "type": "string"
            },
            "subject": {
                "type": "string"
            },
            "email": {
                "type": "string",
                "nullable": true
            },
            "displayName": {
                "type": "string",
                "nullable": true
            },
            "status": {
                "$ref": "#/components/schemas/AuthUserStatus"
            },
            "roles": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "authUserId": {
                            "type": "integer"
                        },
                        "role": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "authUserId",
                        "role"
                    ]
                }
            },
            "capabilities": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "authUserId": {
                            "type": "integer"
                        },
                        "capability": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "authUserId",
                        "capability"
                    ]
                }
            }
        },
        "required": [
            "id",
            "issuer",
            "subject",
            "email",
            "displayName",
            "status",
            "roles",
            "capabilities"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "AuthUser",
            "identityFields": [
                "id"
            ]
        }
    },
    "AuthUserStatus": {
        "type": "string",
        "enum": [
            "ACTIVE",
            "DISABLED"
        ],
        "x-pomi-schema": {
            "kind": "value-object",
            "publicName": "AuthUserStatus"
        }
    },
    "CreateBotAuthUserBody": {
        "type": "object",
        "properties": {
            "subject": {
                "type": "string",
                "minLength": 1
            },
            "displayName": {
                "type": "string",
                "minLength": 1,
                "maxLength": 200
            },
            "capabilities": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/AuthCapability"
                },
                "default": []
            }
        },
        "required": [
            "subject",
            "displayName"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "input",
            "publicName": "CreateBotAuthUserBody"
        }
    },
    "AuthCapability": {
        "type": "string",
        "enum": [
            "ACADEMIC_WRITE"
        ],
        "x-pomi-schema": {
            "kind": "value-object",
            "publicName": "AuthCapability"
        }
    },
    "AdminIdentityManagedByCliProblem": {
        "type": "object",
        "properties": {
            "type": {
                "type": "string",
                "enum": [
                    "urn:pomi:problem:admin-identity-managed-by-cli"
                ]
            },
            "title": {
                "type": "string",
                "enum": [
                    "Identidade administrada pela linha de comando"
                ]
            },
            "status": {
                "type": "number",
                "enum": [
                    403
                ]
            },
            "detail": {
                "type": "string"
            },
            "instance": {
                "type": "string"
            }
        },
        "required": [
            "type",
            "title",
            "status",
            "detail"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "problem",
            "publicName": "AdminIdentityManagedByCliProblem"
        }
    },
    "PatchAuthUserBody": {
        "type": "object",
        "properties": {
            "status": {
                "$ref": "#/components/schemas/AuthUserStatus"
            },
            "displayName": {
                "type": "string",
                "minLength": 1,
                "maxLength": 200
            },
            "capabilities": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/AuthCapability"
                }
            }
        },
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "input",
            "publicName": "PatchAuthUserBody"
        }
    },
    "StudentEntity": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "ra": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "programId": {
                "type": "integer",
                "nullable": true
            },
            "specializationId": {
                "type": "integer",
                "nullable": true
            },
            "catalogId": {
                "type": "integer",
                "nullable": true
            },
            "entryYear": {
                "type": "integer",
                "nullable": true,
                "minimum": 1900,
                "maximum": 9999
            },
            "languageId": {
                "type": "integer",
                "nullable": true
            }
        },
        "required": [
            "id",
            "ra",
            "name",
            "programId",
            "specializationId",
            "catalogId",
            "entryYear",
            "languageId"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "Student",
            "identityFields": [
                "id"
            ]
        }
    },
    "UniqueConstraintConflictProblem": {
        "type": "object",
        "properties": {
            "type": {
                "type": "string",
                "enum": [
                    "urn:pomi:problem:unique-constraint-conflict"
                ]
            },
            "title": {
                "type": "string",
                "enum": [
                    "Informação já utilizada"
                ]
            },
            "status": {
                "type": "number",
                "enum": [
                    409
                ]
            },
            "detail": {
                "type": "string"
            },
            "instance": {
                "type": "string"
            },
            "fields": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/ProblemField"
                }
            }
        },
        "required": [
            "type",
            "title",
            "status",
            "detail",
            "fields"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "problem",
            "publicName": "UniqueConstraintConflictProblem"
        }
    },
    "ReferenceNotFoundProblem": {
        "type": "object",
        "properties": {
            "type": {
                "type": "string",
                "enum": [
                    "urn:pomi:problem:reference-not-found"
                ],
                "description": "discriminator enum property added by openapi-typescript"
            },
            "title": {
                "type": "string",
                "enum": [
                    "Referência não encontrada"
                ]
            },
            "status": {
                "type": "number",
                "enum": [
                    422
                ]
            },
            "detail": {
                "type": "string"
            },
            "instance": {
                "type": "string"
            },
            "fields": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/ProblemField"
                }
            }
        },
        "required": [
            "type",
            "title",
            "status",
            "detail",
            "fields"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "problem",
            "publicName": "ReferenceNotFoundProblem"
        }
    },
    "InvalidStudentProfileProblem": {
        "type": "object",
        "properties": {
            "type": {
                "type": "string",
                "enum": [
                    "urn:pomi:problem:invalid-student-profile"
                ],
                "description": "discriminator enum property added by openapi-typescript"
            },
            "title": {
                "type": "string",
                "enum": [
                    "Perfil de aluno inválido"
                ]
            },
            "status": {
                "type": "number",
                "enum": [
                    422
                ]
            },
            "detail": {
                "type": "string"
            },
            "instance": {
                "type": "string"
            },
            "fields": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "code": {
                            "type": "string"
                        },
                        "path": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "message": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "code",
                        "path",
                        "message"
                    ],
                    "additionalProperties": false
                }
            }
        },
        "required": [
            "type",
            "title",
            "status",
            "detail",
            "fields"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "problem",
            "publicName": "InvalidStudentProfileProblem"
        }
    },
    "CreateStudentBody": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string"
            },
            "programId": {
                "type": "integer",
                "nullable": true
            },
            "specializationId": {
                "type": "integer",
                "nullable": true
            },
            "catalogId": {
                "type": "integer",
                "nullable": true
            },
            "entryYear": {
                "type": "integer",
                "nullable": true,
                "minimum": 1900,
                "maximum": 9999
            },
            "languageId": {
                "type": "integer",
                "nullable": true
            }
        },
        "required": [
            "name"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "input",
            "publicName": "CreateStudentBody"
        }
    },
    "PatchStudentBody": {
        "type": "object",
        "properties": {
            "ra": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "programId": {
                "type": "integer",
                "nullable": true
            },
            "specializationId": {
                "type": "integer",
                "nullable": true
            },
            "catalogId": {
                "type": "integer",
                "nullable": true
            },
            "entryYear": {
                "type": "integer",
                "nullable": true,
                "minimum": 1900,
                "maximum": 9999
            },
            "languageId": {
                "type": "integer",
                "nullable": true
            }
        },
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "input",
            "publicName": "PatchStudentBody"
        }
    },
    "CurriculumEntity": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "studentId": {
                "type": "integer"
            },
            "name": {
                "type": "string"
            },
            "isFavorite": {
                "type": "boolean"
            },
            "selection": {
                "type": "object",
                "properties": {
                    "catalogProgramId": {
                        "type": "integer",
                        "nullable": true
                    },
                    "catalogProgramVariantId": {
                        "type": "integer",
                        "nullable": true
                    },
                    "languageId": {
                        "type": "integer",
                        "nullable": true
                    }
                },
                "required": [
                    "catalogProgramId",
                    "catalogProgramVariantId",
                    "languageId"
                ],
                "additionalProperties": false
            },
            "planningStart": {
                "type": "object",
                "nullable": true,
                "properties": {
                    "year": {
                        "type": "integer"
                    },
                    "semester": {
                        "anyOf": [
                            {
                                "type": "number",
                                "enum": [
                                    1
                                ]
                            },
                            {
                                "type": "number",
                                "enum": [
                                    2
                                ]
                            }
                        ]
                    },
                    "semesterNumber": {
                        "type": "integer",
                        "minimum": 0,
                        "exclusiveMinimum": true
                    }
                },
                "required": [
                    "year",
                    "semester",
                    "semesterNumber"
                ],
                "additionalProperties": false
            },
            "currentPeriodId": {
                "type": "integer",
                "nullable": true
            },
            "courses": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "courseId": {
                            "type": "integer"
                        },
                        "periodId": {
                            "type": "integer",
                            "nullable": true
                        },
                        "name": {
                            "type": "string"
                        },
                        "code": {
                            "type": "string"
                        },
                        "credits": {
                            "type": "integer"
                        }
                    },
                    "required": [
                        "courseId",
                        "periodId",
                        "name",
                        "code",
                        "credits"
                    ],
                    "additionalProperties": false
                }
            },
            "periods": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "integer"
                        },
                        "position": {
                            "type": "integer",
                            "minimum": 0,
                            "exclusiveMinimum": true
                        }
                    },
                    "required": [
                        "id",
                        "position"
                    ],
                    "additionalProperties": false
                }
            },
            "createdAt": {
                "type": "string",
                "format": "date-time"
            },
            "updatedAt": {
                "type": "string",
                "format": "date-time"
            }
        },
        "required": [
            "id",
            "studentId",
            "name",
            "isFavorite",
            "selection",
            "planningStart",
            "currentPeriodId",
            "courses",
            "periods",
            "createdAt",
            "updatedAt"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "Curriculum",
            "identityFields": [
                "id"
            ]
        }
    },
    "CurriculumSummaryEntity": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "studentId": {
                "type": "integer"
            },
            "name": {
                "type": "string"
            },
            "isFavorite": {
                "type": "boolean"
            },
            "selection": {
                "type": "object",
                "properties": {
                    "catalogProgramId": {
                        "type": "integer",
                        "nullable": true
                    },
                    "catalogProgramVariantId": {
                        "type": "integer",
                        "nullable": true
                    },
                    "languageId": {
                        "type": "integer",
                        "nullable": true
                    }
                },
                "required": [
                    "catalogProgramId",
                    "catalogProgramVariantId",
                    "languageId"
                ],
                "additionalProperties": false
            },
            "createdAt": {
                "type": "string",
                "format": "date-time"
            },
            "updatedAt": {
                "type": "string",
                "format": "date-time"
            }
        },
        "required": [
            "id",
            "studentId",
            "name",
            "isFavorite",
            "selection",
            "createdAt",
            "updatedAt"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "CurriculumSummary",
            "identityFields": [
                "id"
            ]
        }
    },
    "InvalidCurriculumProblem": {
        "type": "object",
        "properties": {
            "type": {
                "type": "string",
                "enum": [
                    "urn:pomi:problem:invalid-curriculum"
                ],
                "description": "discriminator enum property added by openapi-typescript"
            },
            "title": {
                "type": "string",
                "enum": [
                    "Planejamento curricular inválido"
                ]
            },
            "status": {
                "type": "number",
                "enum": [
                    422
                ]
            },
            "detail": {
                "type": "string"
            },
            "instance": {
                "type": "string"
            },
            "fields": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "code": {
                            "type": "string"
                        },
                        "path": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "message": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "code",
                        "path",
                        "message"
                    ]
                }
            }
        },
        "required": [
            "type",
            "title",
            "status",
            "detail",
            "fields"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "problem",
            "publicName": "InvalidCurriculumProblem"
        }
    },
    "PeriodPlanningEntity": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "studentId": {
                "type": "integer"
            },
            "name": {
                "type": "string"
            },
            "studyPeriodId": {
                "type": "integer"
            },
            "studyPeriodYear": {
                "type": "integer"
            },
            "studyPeriodYearPeriod": {
                "$ref": "#/components/schemas/YearPeriod"
            },
            "curriculumId": {
                "type": "integer",
                "nullable": true
            },
            "visibility": {
                "$ref": "#/components/schemas/PlanningVisibility"
            },
            "shareId": {
                "type": "string",
                "format": "uuid"
            },
            "guide": {
                "$ref": "#/components/schemas/PlanningGuide"
            },
            "createdAt": {
                "type": "string",
                "format": "date-time"
            },
            "updatedAt": {
                "type": "string",
                "format": "date-time"
            },
            "classes": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/PeriodPlanningClass"
                }
            }
        },
        "required": [
            "id",
            "studentId",
            "name",
            "studyPeriodId",
            "studyPeriodYear",
            "studyPeriodYearPeriod",
            "curriculumId",
            "visibility",
            "shareId",
            "guide",
            "createdAt",
            "updatedAt",
            "classes"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "PeriodPlanning",
            "identityFields": [
                "id"
            ],
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
        }
    },
    "YearPeriod": {
        "type": "string",
        "enum": [
            "SUMMER",
            "FIRST_SEMESTER",
            "WINTER",
            "SECOND_SEMESTER"
        ],
        "x-pomi-schema": {
            "kind": "value-object",
            "publicName": "YearPeriod"
        }
    },
    "PlanningVisibility": {
        "type": "string",
        "enum": [
            "PRIVATE",
            "FRIENDS",
            "PUBLIC"
        ],
        "x-pomi-schema": {
            "kind": "value-object",
            "publicName": "PlanningVisibility"
        }
    },
    "PlanningGuide": {
        "type": "object",
        "properties": {
            "mode": {
                "$ref": "#/components/schemas/PlanningGuideMode"
            },
            "curriculumSource": {
                "$ref": "#/components/schemas/PlanningCurriculumSource"
            },
            "curriculumId": {
                "type": "integer",
                "nullable": true
            },
            "suggestionId": {
                "type": "integer",
                "nullable": true
            },
            "suggestionCatalogProgramId": {
                "type": "integer",
                "nullable": true
            },
            "catalogProgramId": {
                "type": "integer",
                "nullable": true
            },
            "catalogProgramVariantId": {
                "type": "integer",
                "nullable": true
            },
            "languageId": {
                "type": "integer",
                "nullable": true
            },
            "manualCourseIds": {
                "type": "array",
                "items": {
                    "type": "integer"
                }
            }
        },
        "required": [
            "mode",
            "curriculumSource",
            "curriculumId",
            "suggestionId",
            "catalogProgramId",
            "catalogProgramVariantId",
            "languageId",
            "manualCourseIds"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "value-object",
            "publicName": "PlanningGuide"
        }
    },
    "PlanningGuideMode": {
        "type": "string",
        "enum": [
            "CURRICULUM",
            "PROGRAM",
            "NONE"
        ],
        "x-pomi-schema": {
            "kind": "value-object",
            "publicName": "PlanningGuideMode"
        }
    },
    "PlanningCurriculumSource": {
        "type": "string",
        "nullable": true,
        "enum": [
            "SAVED",
            "SUGGESTION",
            null
        ],
        "x-pomi-schema": {
            "kind": "value-object",
            "publicName": "PlanningCurriculumSource"
        }
    },
    "PeriodPlanningClass": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "code": {
                "type": "string"
            },
            "reservationPrograms": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "integer"
                        },
                        "code": {
                            "type": "integer"
                        },
                        "name": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "id",
                        "code",
                        "name"
                    ],
                    "additionalProperties": false
                }
            },
            "courseId": {
                "type": "integer"
            },
            "courseCode": {
                "type": "string"
            },
            "courseCredits": {
                "type": "number"
            },
            "professors": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/PeriodPlanningProfessor"
                }
            },
            "classSchedules": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/PeriodPlanningSchedule"
                }
            }
        },
        "required": [
            "id",
            "code",
            "reservationPrograms",
            "courseId",
            "courseCode",
            "courseCredits",
            "professors",
            "classSchedules"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "projection",
            "publicName": "PeriodPlanningClass"
        }
    },
    "PeriodPlanningProfessor": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "name": {
                "type": "string"
            }
        },
        "required": [
            "id",
            "name"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "projection",
            "publicName": "PeriodPlanningProfessor"
        }
    },
    "PeriodPlanningSchedule": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "dayOfWeek": {
                "$ref": "#/components/schemas/DayOfWeek"
            },
            "start": {
                "type": "string"
            },
            "end": {
                "type": "string"
            },
            "roomId": {
                "type": "integer"
            },
            "roomCode": {
                "type": "string"
            }
        },
        "required": [
            "id",
            "dayOfWeek",
            "start",
            "end",
            "roomId",
            "roomCode"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "projection",
            "publicName": "PeriodPlanningSchedule"
        }
    },
    "DayOfWeek": {
        "type": "string",
        "enum": [
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
            "SATURDAY",
            "SUNDAY"
        ],
        "x-pomi-schema": {
            "kind": "value-object",
            "publicName": "DayOfWeek"
        }
    },
    "InvalidPeriodPlanProblem": {
        "type": "object",
        "properties": {
            "type": {
                "type": "string",
                "enum": [
                    "urn:pomi:problem:invalid-period-plan"
                ],
                "description": "discriminator enum property added by openapi-typescript"
            },
            "title": {
                "type": "string",
                "enum": [
                    "Planejamento de semestre inválido"
                ]
            },
            "status": {
                "type": "number",
                "enum": [
                    422
                ]
            },
            "detail": {
                "type": "string"
            },
            "instance": {
                "type": "string"
            },
            "fields": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "code": {
                            "type": "string"
                        },
                        "path": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "message": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "code",
                        "path",
                        "message"
                    ]
                }
            }
        },
        "required": [
            "type",
            "title",
            "status",
            "detail",
            "fields"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "problem",
            "publicName": "InvalidPeriodPlanProblem"
        }
    },
    "CreatePeriodPlanningInput": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "minLength": 1
            },
            "studyPeriodId": {
                "type": "integer"
            },
            "curriculumId": {
                "type": "integer",
                "nullable": true
            },
            "guide": {
                "$ref": "#/components/schemas/PlanningGuide"
            },
            "classes": {
                "type": "array",
                "items": {
                    "type": "integer"
                }
            }
        },
        "required": [
            "studyPeriodId",
            "classes"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "input",
            "publicName": "CreatePeriodPlanningInput"
        }
    },
    "UpdatePeriodPlanningInput": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "minLength": 1
            },
            "visibility": {
                "$ref": "#/components/schemas/PlanningVisibility"
            },
            "curriculumId": {
                "type": "integer",
                "nullable": true
            },
            "guide": {
                "$ref": "#/components/schemas/PlanningGuide"
            },
            "classes": {
                "type": "object",
                "properties": {
                    "set": {
                        "type": "array",
                        "items": {
                            "type": "integer"
                        }
                    },
                    "add": {
                        "type": "array",
                        "items": {
                            "type": "integer"
                        }
                    },
                    "remove": {
                        "type": "array",
                        "items": {
                            "type": "integer"
                        }
                    }
                }
            }
        },
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "input",
            "publicName": "UpdatePeriodPlanningInput"
        }
    },
    "SharedPeriodPlanningPage": {
        "type": "object",
        "properties": {
            "data": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/SharedPeriodPlanning"
                }
            },
            "quantity": {
                "type": "integer"
            },
            "total": {
                "type": "integer"
            },
            "links": {
                "$ref": "#/components/schemas/PaginationLinks"
            }
        },
        "required": [
            "data",
            "quantity",
            "total",
            "links"
        ],
        "x-pomi-schema": {
            "kind": "page",
            "publicName": "SharedPeriodPlanningPage"
        }
    },
    "SharedPeriodPlanning": {
        "type": "object",
        "properties": {
            "shareId": {
                "type": "string",
                "format": "uuid"
            },
            "name": {
                "type": "string"
            },
            "visibility": {
                "$ref": "#/components/schemas/SharedPlanningVisibility"
            },
            "studyPeriodId": {
                "type": "integer"
            },
            "studyPeriodYear": {
                "type": "integer"
            },
            "studyPeriodYearPeriod": {
                "$ref": "#/components/schemas/YearPeriod"
            },
            "owner": {
                "type": "object",
                "nullable": true,
                "properties": {
                    "publicId": {
                        "type": "string",
                        "format": "uuid"
                    },
                    "displayName": {
                        "type": "string"
                    }
                },
                "required": [
                    "publicId",
                    "displayName"
                ],
                "additionalProperties": false
            },
            "classes": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/PeriodPlanningClass"
                }
            },
            "createdAt": {
                "type": "string",
                "format": "date-time"
            },
            "updatedAt": {
                "type": "string",
                "format": "date-time"
            }
        },
        "required": [
            "shareId",
            "name",
            "visibility",
            "studyPeriodId",
            "studyPeriodYear",
            "studyPeriodYearPeriod",
            "owner",
            "classes",
            "createdAt",
            "updatedAt"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "SharedPeriodPlanning",
            "identityFields": [
                "shareId"
            ],
            "relations": {
                "classes": {
                    "resource": "classes",
                    "cardinality": "many"
                }
            }
        }
    },
    "SharedPlanningVisibility": {
        "type": "string",
        "enum": [
            "FRIENDS",
            "PUBLIC"
        ],
        "x-pomi-schema": {
            "kind": "value-object",
            "publicName": "SharedPlanningVisibility"
        }
    },
    "ProfessorEvaluationEligibility": {
        "type": "object",
        "properties": {
            "eligible": {
                "type": "boolean"
            },
            "evaluation": {
                "$ref": "#/components/schemas/ProfessorEvaluation"
            }
        },
        "required": [
            "eligible",
            "evaluation"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "projection",
            "publicName": "ProfessorEvaluationEligibility"
        }
    },
    "ProfessorEvaluation": {
        "type": "object",
        "nullable": true,
        "properties": {
            "wouldTakeAgain": {
                "type": "integer",
                "minimum": 1,
                "maximum": 5
            },
            "fairness": {
                "type": "integer",
                "minimum": 1,
                "maximum": 5
            },
            "clarity": {
                "type": "integer",
                "minimum": 1,
                "maximum": 5
            },
            "difficulty": {
                "type": "integer",
                "minimum": 1,
                "maximum": 5
            },
            "id": {
                "type": "integer"
            },
            "studentId": {
                "type": "integer"
            },
            "classId": {
                "type": "integer"
            },
            "professorId": {
                "type": "integer"
            },
            "createdAt": {
                "type": "string",
                "format": "date-time"
            },
            "updatedAt": {
                "type": "string",
                "format": "date-time"
            }
        },
        "required": [
            "wouldTakeAgain",
            "fairness",
            "clarity",
            "difficulty",
            "id",
            "studentId",
            "classId",
            "professorId",
            "createdAt",
            "updatedAt"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "ProfessorEvaluation",
            "identityFields": [
                "id"
            ]
        }
    },
    "InvalidProfessorEvaluationProblem": {
        "type": "object",
        "properties": {
            "type": {
                "type": "string",
                "enum": [
                    "urn:pomi:problem:invalid-professor-evaluation"
                ],
                "description": "discriminator enum property added by openapi-typescript"
            },
            "title": {
                "type": "string",
                "enum": [
                    "Avaliação de professor inválida"
                ]
            },
            "status": {
                "type": "number",
                "enum": [
                    422
                ]
            },
            "detail": {
                "type": "string"
            },
            "instance": {
                "type": "string"
            },
            "fields": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "code": {
                            "type": "string"
                        },
                        "path": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "message": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "code",
                        "path",
                        "message"
                    ],
                    "additionalProperties": false
                }
            }
        },
        "required": [
            "type",
            "title",
            "status",
            "detail",
            "fields"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "problem",
            "publicName": "InvalidProfessorEvaluationProblem"
        }
    },
    "ProfessorEvaluationBody": {
        "type": "object",
        "properties": {
            "wouldTakeAgain": {
                "type": "integer",
                "minimum": 1,
                "maximum": 5
            },
            "fairness": {
                "type": "integer",
                "minimum": 1,
                "maximum": 5
            },
            "clarity": {
                "type": "integer",
                "minimum": 1,
                "maximum": 5
            },
            "difficulty": {
                "type": "integer",
                "minimum": 1,
                "maximum": 5
            }
        },
        "required": [
            "wouldTakeAgain",
            "fairness",
            "clarity",
            "difficulty"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "input",
            "publicName": "ProfessorEvaluationBody"
        }
    },
    "PendingProfessorEvaluation": {
        "type": "object",
        "properties": {
            "attemptId": {
                "type": "integer"
            },
            "class": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer"
                    },
                    "code": {
                        "type": "string"
                    }
                },
                "required": [
                    "id",
                    "code"
                ]
            },
            "course": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer"
                    },
                    "code": {
                        "type": "string"
                    },
                    "name": {
                        "type": "string"
                    }
                },
                "required": [
                    "id",
                    "code",
                    "name"
                ]
            },
            "professor": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer"
                    },
                    "name": {
                        "type": "string"
                    }
                },
                "required": [
                    "id",
                    "name"
                ]
            }
        },
        "required": [
            "attemptId",
            "class",
            "course",
            "professor"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "PendingProfessorEvaluation"
        }
    },
    "StudentCourseAttempt": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "studentId": {
                "type": "integer"
            },
            "courseId": {
                "type": "integer"
            },
            "studyPeriodId": {
                "type": "integer",
                "nullable": true
            },
            "classId": {
                "type": "integer",
                "nullable": true
            },
            "evaluationMode": {
                "$ref": "#/components/schemas/CourseEvaluationMode"
            },
            "status": {
                "$ref": "#/components/schemas/StudentCourseAttemptStatus"
            },
            "grade": {
                "type": "number",
                "nullable": true
            },
            "createdAt": {
                "type": "string",
                "format": "date-time"
            },
            "updatedAt": {
                "type": "string",
                "format": "date-time"
            },
            "course": {
                "$ref": "#/components/schemas/CourseAttemptCourse"
            },
            "studyPeriod": {
                "$ref": "#/components/schemas/CourseAttemptStudyPeriod"
            },
            "class": {
                "$ref": "#/components/schemas/CourseAttemptClass"
            }
        },
        "required": [
            "id",
            "studentId",
            "courseId",
            "studyPeriodId",
            "classId",
            "evaluationMode",
            "status",
            "grade",
            "createdAt",
            "updatedAt",
            "course",
            "studyPeriod",
            "class"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "StudentCourseAttempt",
            "identityFields": [
                "id"
            ],
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
        }
    },
    "CourseEvaluationMode": {
        "type": "string",
        "enum": [
            "GRADE_AND_ATTENDANCE",
            "ATTENDANCE",
            "CONCEPT"
        ],
        "x-pomi-schema": {
            "kind": "value-object",
            "publicName": "CourseEvaluationMode"
        }
    },
    "StudentCourseAttemptStatus": {
        "type": "string",
        "enum": [
            "ENROLLED",
            "DROPPED",
            "APPROVED",
            "FAILED_BY_GRADE",
            "APPROVED_BY_ATTENDANCE",
            "APPROVED_BY_PROFICIENCY",
            "FAILED_BY_ATTENDANCE",
            "SUFFICIENT",
            "INSUFFICIENT"
        ],
        "x-pomi-schema": {
            "kind": "value-object",
            "publicName": "StudentCourseAttemptStatus"
        }
    },
    "CourseAttemptCourse": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "code": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "credits": {
                "type": "integer"
            },
            "unit": {
                "type": "object",
                "nullable": true,
                "properties": {
                    "id": {
                        "type": "integer"
                    },
                    "code": {
                        "type": "string"
                    }
                },
                "required": [
                    "id",
                    "code"
                ]
            }
        },
        "required": [
            "id",
            "code",
            "name",
            "credits",
            "unit"
        ],
        "x-pomi-schema": {
            "kind": "projection",
            "publicName": "CourseAttemptCourse"
        }
    },
    "CourseAttemptStudyPeriod": {
        "type": "object",
        "nullable": true,
        "properties": {
            "id": {
                "type": "integer"
            },
            "year": {
                "type": "integer"
            },
            "yearPeriod": {
                "$ref": "#/components/schemas/YearPeriod"
            }
        },
        "required": [
            "id",
            "year",
            "yearPeriod"
        ],
        "x-pomi-schema": {
            "kind": "projection",
            "publicName": "CourseAttemptStudyPeriod"
        }
    },
    "CourseAttemptClass": {
        "type": "object",
        "nullable": true,
        "properties": {
            "id": {
                "type": "integer"
            },
            "code": {
                "type": "string"
            },
            "professors": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "integer"
                        },
                        "name": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "id",
                        "name"
                    ]
                }
            }
        },
        "required": [
            "id",
            "code",
            "professors"
        ],
        "x-pomi-schema": {
            "kind": "projection",
            "publicName": "CourseAttemptClass"
        }
    },
    "InvalidStudentCourseAttemptProblem": {
        "type": "object",
        "properties": {
            "type": {
                "type": "string",
                "enum": [
                    "urn:pomi:problem:invalid-student-course-attempt"
                ],
                "description": "discriminator enum property added by openapi-typescript"
            },
            "title": {
                "type": "string",
                "enum": [
                    "Tentativa de disciplina inválida"
                ]
            },
            "status": {
                "type": "number",
                "enum": [
                    422
                ]
            },
            "detail": {
                "type": "string"
            },
            "instance": {
                "type": "string"
            },
            "fields": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "code": {
                            "type": "string"
                        },
                        "path": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "message": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "code",
                        "path",
                        "message"
                    ],
                    "additionalProperties": false
                }
            }
        },
        "required": [
            "type",
            "title",
            "status",
            "detail",
            "fields"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "problem",
            "publicName": "InvalidStudentCourseAttemptProblem"
        }
    },
    "CreateStudentCourseAttemptInput": {
        "type": "object",
        "properties": {
            "courseId": {
                "type": "integer"
            },
            "studyPeriodId": {
                "type": "integer",
                "nullable": true
            },
            "classId": {
                "type": "integer",
                "nullable": true
            },
            "evaluationMode": {
                "$ref": "#/components/schemas/CourseEvaluationMode"
            },
            "status": {
                "$ref": "#/components/schemas/StudentCourseAttemptStatus"
            },
            "grade": {
                "type": "number",
                "nullable": true,
                "minimum": 0,
                "maximum": 10
            }
        },
        "required": [
            "courseId",
            "status"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "input",
            "publicName": "CreateStudentCourseAttemptInput"
        }
    },
    "UpdateStudentCourseAttemptInput": {
        "type": "object",
        "properties": {
            "studyPeriodId": {
                "type": "integer",
                "nullable": true
            },
            "classId": {
                "type": "integer",
                "nullable": true
            },
            "evaluationMode": {
                "$ref": "#/components/schemas/CourseEvaluationMode"
            },
            "status": {
                "$ref": "#/components/schemas/StudentCourseAttemptStatus"
            },
            "grade": {
                "type": "number",
                "nullable": true,
                "minimum": 0,
                "maximum": 10
            }
        },
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "input",
            "publicName": "UpdateStudentCourseAttemptInput"
        }
    },
    "StudentHistoryImportSummary": {
        "type": "object",
        "properties": {
            "created": {
                "type": "integer",
                "minimum": 0
            },
            "updated": {
                "type": "integer",
                "minimum": 0
            },
            "skipped": {
                "type": "integer",
                "minimum": 0
            },
            "warnings": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "year": {
                            "type": "integer",
                            "nullable": true
                        },
                        "yearPeriod": {
                            "type": "string",
                            "nullable": true
                        },
                        "code": {
                            "type": "string",
                            "nullable": true
                        },
                        "message": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "year",
                        "yearPeriod",
                        "code",
                        "message"
                    ],
                    "additionalProperties": false
                }
            }
        },
        "required": [
            "created",
            "updated",
            "skipped",
            "warnings"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "projection",
            "publicName": "StudentHistoryImportSummary"
        }
    },
    "InvalidStudentHistoryImportProblem": {
        "type": "object",
        "properties": {
            "type": {
                "type": "string",
                "enum": [
                    "urn:pomi:problem:invalid-student-history-import"
                ]
            },
            "title": {
                "type": "string",
                "enum": [
                    "Importação de histórico escolar inválida"
                ]
            },
            "status": {
                "type": "number",
                "enum": [
                    422
                ]
            },
            "detail": {
                "type": "string"
            },
            "instance": {
                "type": "string"
            },
            "fields": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "code": {
                            "type": "string"
                        },
                        "path": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "message": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "code",
                        "path",
                        "message"
                    ],
                    "additionalProperties": false
                }
            }
        },
        "required": [
            "type",
            "title",
            "status",
            "detail",
            "fields"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "problem",
            "publicName": "InvalidStudentHistoryImportProblem"
        }
    },
    "StudentHistoryImportBody": {
        "type": "object",
        "properties": {
            "format": {
                "type": "string",
                "enum": [
                    "pomi-student-history"
                ]
            },
            "version": {
                "type": "number",
                "enum": [
                    1
                ]
            },
            "student": {
                "type": "object",
                "properties": {
                    "ra": {
                        "type": "string",
                        "pattern": "^\\d{6}$"
                    }
                },
                "required": [
                    "ra"
                ]
            },
            "semesters": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "year": {
                            "type": "integer",
                            "minimum": 1900,
                            "maximum": 9999
                        },
                        "yearPeriod": {
                            "$ref": "#/components/schemas/YearPeriod"
                        },
                        "courses": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "code": {
                                        "type": "string",
                                        "minLength": 1
                                    },
                                    "name": {
                                        "type": "string",
                                        "minLength": 1
                                    },
                                    "classCode": {
                                        "type": "string",
                                        "nullable": true,
                                        "minLength": 1
                                    },
                                    "grade": {
                                        "type": "number",
                                        "nullable": true,
                                        "minimum": 0,
                                        "maximum": 10
                                    },
                                    "workloadHours": {
                                        "type": "integer",
                                        "nullable": true,
                                        "minimum": 0
                                    },
                                    "credits": {
                                        "type": "integer",
                                        "nullable": true,
                                        "minimum": 0
                                    },
                                    "status": {
                                        "$ref": "#/components/schemas/HistoryCourseStatus"
                                    }
                                },
                                "required": [
                                    "code",
                                    "name",
                                    "grade",
                                    "workloadHours",
                                    "credits",
                                    "status"
                                ]
                            }
                        }
                    },
                    "required": [
                        "year",
                        "yearPeriod",
                        "courses"
                    ]
                },
                "minItems": 1
            }
        },
        "required": [
            "format",
            "version",
            "student",
            "semesters"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "input",
            "publicName": "StudentHistoryImportBody"
        }
    },
    "HistoryCourseStatus": {
        "type": "string",
        "enum": [
            "ENROLLED",
            "APPROVED",
            "APPROVED_BY_ATTENDANCE",
            "APPROVED_BY_PROFICIENCY",
            "DROPPED",
            "FAILED_BY_ATTENDANCE",
            "SUFFICIENT"
        ],
        "x-pomi-schema": {
            "kind": "value-object",
            "publicName": "HistoryCourseStatus"
        }
    },
    "StudentAbsence": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "studentCourseAttemptId": {
                "type": "integer"
            },
            "classScheduleId": {
                "type": "integer"
            },
            "date": {
                "type": "string",
                "format": "date"
            },
            "createdAt": {
                "type": "string",
                "format": "date-time"
            },
            "updatedAt": {
                "type": "string",
                "format": "date-time"
            },
            "studyPeriodId": {
                "type": "integer"
            },
            "studyPeriodYear": {
                "type": "integer"
            },
            "studyPeriodYearPeriod": {
                "$ref": "#/components/schemas/YearPeriod"
            },
            "courseId": {
                "type": "integer"
            },
            "courseCode": {
                "type": "string"
            },
            "classId": {
                "type": "integer"
            },
            "classCode": {
                "type": "string"
            },
            "dayOfWeek": {
                "$ref": "#/components/schemas/DayOfWeek"
            },
            "start": {
                "type": "string"
            },
            "end": {
                "type": "string"
            }
        },
        "required": [
            "id",
            "studentCourseAttemptId",
            "classScheduleId",
            "date",
            "createdAt",
            "updatedAt",
            "studyPeriodId",
            "studyPeriodYear",
            "studyPeriodYearPeriod",
            "courseId",
            "courseCode",
            "classId",
            "classCode",
            "dayOfWeek",
            "start",
            "end"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "StudentAbsence",
            "identityFields": [
                "id"
            ]
        }
    },
    "InvalidStudentAbsenceProblem": {
        "type": "object",
        "properties": {
            "type": {
                "type": "string",
                "enum": [
                    "urn:pomi:problem:invalid-student-absence"
                ],
                "description": "discriminator enum property added by openapi-typescript"
            },
            "title": {
                "type": "string",
                "enum": [
                    "Falta inválida"
                ]
            },
            "status": {
                "type": "number",
                "enum": [
                    422
                ]
            },
            "detail": {
                "type": "string"
            },
            "instance": {
                "type": "string"
            },
            "fields": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "code": {
                            "type": "string"
                        },
                        "path": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "message": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "code",
                        "path",
                        "message"
                    ],
                    "additionalProperties": false
                }
            }
        },
        "required": [
            "type",
            "title",
            "status",
            "detail",
            "fields"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "problem",
            "publicName": "InvalidStudentAbsenceProblem"
        }
    },
    "CreateStudentAbsenceBody": {
        "type": "object",
        "properties": {
            "courseAttemptId": {
                "type": "integer"
            },
            "classScheduleId": {
                "type": "integer"
            },
            "date": {
                "type": "string",
                "format": "date"
            }
        },
        "required": [
            "courseAttemptId",
            "classScheduleId",
            "date"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "input",
            "publicName": "CreateStudentAbsenceBody"
        }
    },
    "StudentPublicProfile": {
        "type": "object",
        "properties": {
            "publicId": {
                "type": "string",
                "format": "uuid"
            },
            "displayName": {
                "type": "string"
            },
            "bio": {
                "type": "string",
                "nullable": true
            },
            "interests": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "integer",
                            "minimum": 0,
                            "exclusiveMinimum": true
                        },
                        "name": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "id",
                        "name"
                    ],
                    "additionalProperties": false
                }
            },
            "currentCourses": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/StudentCurrentCourse"
                }
            },
            "program": {
                "type": "object",
                "nullable": true,
                "properties": {
                    "code": {
                        "anyOf": [
                            {
                                "type": "string"
                            },
                            {
                                "type": "number"
                            }
                        ]
                    },
                    "name": {
                        "type": "string"
                    }
                },
                "required": [
                    "code",
                    "name"
                ],
                "additionalProperties": false
            },
            "specialization": {
                "type": "object",
                "nullable": true,
                "properties": {
                    "code": {
                        "anyOf": [
                            {
                                "type": "string"
                            },
                            {
                                "type": "number"
                            }
                        ]
                    },
                    "name": {
                        "type": "string"
                    }
                },
                "required": [
                    "code",
                    "name"
                ],
                "additionalProperties": false
            },
            "entryYear": {
                "type": "integer",
                "nullable": true
            },
            "enabled": {
                "type": "boolean"
            },
            "currentCoursesVisibility": {
                "$ref": "#/components/schemas/StudentProfileVisibility"
            }
        },
        "required": [
            "publicId",
            "displayName",
            "bio",
            "interests",
            "currentCourses",
            "program",
            "specialization",
            "entryYear",
            "enabled",
            "currentCoursesVisibility"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "StudentPublicProfile",
            "identityFields": [
                "publicId"
            ]
        }
    },
    "StudentCurrentCourse": {
        "type": "object",
        "properties": {
            "courseCode": {
                "type": "string"
            },
            "courseName": {
                "type": "string"
            },
            "classCode": {
                "type": "string",
                "nullable": true
            },
            "schedules": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "integer",
                            "minimum": 0,
                            "exclusiveMinimum": true
                        },
                        "dayOfWeek": {
                            "$ref": "#/components/schemas/DayOfWeek"
                        },
                        "start": {
                            "type": "string"
                        },
                        "end": {
                            "type": "string"
                        },
                        "roomCode": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "id",
                        "dayOfWeek",
                        "start",
                        "end",
                        "roomCode"
                    ],
                    "additionalProperties": false
                }
            }
        },
        "required": [
            "courseCode",
            "courseName",
            "classCode",
            "schedules"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "StudentCurrentCourse"
        }
    },
    "StudentProfileVisibility": {
        "type": "string",
        "enum": [
            "PRIVATE",
            "FRIENDS",
            "PUBLIC"
        ],
        "x-pomi-schema": {
            "kind": "value-object",
            "publicName": "StudentProfileVisibility"
        }
    },
    "StudentPeoplePage": {
        "type": "object",
        "properties": {
            "data": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/StudentPublicPerson"
                }
            },
            "quantity": {
                "type": "integer"
            },
            "total": {
                "type": "integer"
            },
            "links": {
                "$ref": "#/components/schemas/PaginationLinks"
            }
        },
        "required": [
            "data",
            "quantity",
            "total",
            "links"
        ],
        "x-pomi-schema": {
            "kind": "page",
            "publicName": "StudentPeoplePage"
        }
    },
    "StudentPublicPerson": {
        "type": "object",
        "properties": {
            "publicId": {
                "type": "string",
                "format": "uuid"
            },
            "displayName": {
                "type": "string"
            },
            "bio": {
                "type": "string",
                "nullable": true
            },
            "interests": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "integer",
                            "minimum": 0,
                            "exclusiveMinimum": true
                        },
                        "name": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "id",
                        "name"
                    ],
                    "additionalProperties": false
                }
            },
            "currentCourses": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/StudentCurrentCourse"
                }
            },
            "program": {
                "type": "object",
                "nullable": true,
                "properties": {
                    "code": {
                        "anyOf": [
                            {
                                "type": "string"
                            },
                            {
                                "type": "number"
                            }
                        ]
                    },
                    "name": {
                        "type": "string"
                    }
                },
                "required": [
                    "code",
                    "name"
                ],
                "additionalProperties": false
            },
            "specialization": {
                "type": "object",
                "nullable": true,
                "properties": {
                    "code": {
                        "anyOf": [
                            {
                                "type": "string"
                            },
                            {
                                "type": "number"
                            }
                        ]
                    },
                    "name": {
                        "type": "string"
                    }
                },
                "required": [
                    "code",
                    "name"
                ],
                "additionalProperties": false
            },
            "entryYear": {
                "type": "integer",
                "nullable": true
            }
        },
        "required": [
            "publicId",
            "displayName",
            "bio",
            "interests",
            "currentCourses",
            "program",
            "specialization",
            "entryYear"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "StudentPublicPerson",
            "identityFields": [
                "publicId"
            ],
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
        }
    },
    "StudentFriendship": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "status": {
                "$ref": "#/components/schemas/StudentFriendshipStatus"
            },
            "direction": {
                "$ref": "#/components/schemas/StudentFriendshipDirection"
            },
            "friend": {
                "$ref": "#/components/schemas/StudentPublicPerson"
            },
            "createdAt": {
                "type": "string",
                "format": "date-time"
            },
            "acceptedAt": {
                "type": "string",
                "nullable": true,
                "format": "date-time"
            }
        },
        "required": [
            "id",
            "status",
            "direction",
            "friend",
            "createdAt",
            "acceptedAt"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "StudentFriendship",
            "identityFields": [
                "id"
            ],
            "relations": {
                "friend": {
                    "resource": "studentSocial",
                    "cardinality": "one"
                }
            }
        }
    },
    "StudentFriendshipStatus": {
        "type": "string",
        "enum": [
            "PENDING",
            "ACCEPTED"
        ],
        "x-pomi-schema": {
            "kind": "value-object",
            "publicName": "StudentFriendshipStatus"
        }
    },
    "StudentFriendshipDirection": {
        "type": "string",
        "enum": [
            "INCOMING",
            "OUTGOING",
            "NONE"
        ],
        "x-pomi-schema": {
            "kind": "value-object",
            "publicName": "StudentFriendshipDirection"
        }
    },
    "FeedbackReportAccepted": {
        "type": "object",
        "properties": {
            "createdAt": {
                "type": "string",
                "format": "date-time"
            }
        },
        "required": [
            "createdAt"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "projection",
            "publicName": "FeedbackReportAccepted"
        }
    },
    "InvalidFeedbackReportProblem": {
        "type": "object",
        "properties": {
            "type": {
                "type": "string",
                "enum": [
                    "urn:pomi:problem:invalid-feedback-report"
                ],
                "description": "discriminator enum property added by openapi-typescript"
            },
            "title": {
                "type": "string",
                "enum": [
                    "Feedback inválido"
                ]
            },
            "status": {
                "type": "number",
                "enum": [
                    422
                ]
            },
            "detail": {
                "type": "string"
            },
            "instance": {
                "type": "string"
            },
            "fields": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "code": {
                            "type": "string"
                        },
                        "path": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "message": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "code",
                        "path",
                        "message"
                    ],
                    "additionalProperties": false
                }
            }
        },
        "required": [
            "type",
            "title",
            "status",
            "detail",
            "fields"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "problem",
            "publicName": "InvalidFeedbackReportProblem"
        }
    },
    "FeedbackRateLimitProblem": {
        "type": "object",
        "properties": {
            "type": {
                "type": "string",
                "enum": [
                    "urn:pomi:problem:feedback-rate-limit"
                ]
            },
            "title": {
                "type": "string",
                "enum": [
                    "Muitos envios de feedback"
                ]
            },
            "status": {
                "type": "number",
                "enum": [
                    429
                ]
            },
            "detail": {
                "type": "string"
            },
            "instance": {
                "type": "string"
            },
            "retryAfterSeconds": {
                "type": "integer",
                "minimum": 0,
                "exclusiveMinimum": true
            }
        },
        "required": [
            "type",
            "title",
            "status",
            "detail",
            "retryAfterSeconds"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "problem",
            "publicName": "FeedbackRateLimitProblem"
        }
    },
    "CreateFeedbackReportBody": {
        "type": "object",
        "properties": {
            "kind": {
                "$ref": "#/components/schemas/FeedbackKind"
            },
            "target": {
                "$ref": "#/components/schemas/FeedbackReportTarget"
            },
            "title": {
                "type": "string",
                "minLength": 5,
                "maxLength": 160
            },
            "description": {
                "type": "string",
                "minLength": 20,
                "maxLength": 5000
            },
            "sourcePath": {
                "type": "string",
                "maxLength": 300,
                "pattern": "^\\/(?:[^?#]*)$"
            }
        },
        "required": [
            "kind",
            "target",
            "title",
            "description"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "input",
            "publicName": "CreateFeedbackReportBody"
        }
    },
    "FeedbackKind": {
        "type": "string",
        "enum": [
            "BUG",
            "SUGGESTION",
            "DATA_ISSUE"
        ],
        "x-pomi-schema": {
            "kind": "value-object",
            "publicName": "FeedbackKind"
        }
    },
    "FeedbackReportTarget": {
        "oneOf": [
            {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": [
                            "GENERAL"
                        ]
                    }
                },
                "required": [
                    "type"
                ],
                "additionalProperties": false
            },
            {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": [
                            "FEATURE"
                        ]
                    },
                    "featureKey": {
                        "$ref": "#/components/schemas/FeedbackFeatureKey"
                    }
                },
                "required": [
                    "type",
                    "featureKey"
                ],
                "additionalProperties": false
            },
            {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": [
                            "ACADEMIC_RESOURCE"
                        ]
                    },
                    "academicResourceType": {
                        "$ref": "#/components/schemas/FeedbackAcademicResourceType"
                    },
                    "academicResourceId": {
                        "type": "integer",
                        "minimum": 0,
                        "exclusiveMinimum": true
                    }
                },
                "required": [
                    "type",
                    "academicResourceType",
                    "academicResourceId"
                ],
                "additionalProperties": false
            }
        ],
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "FeedbackReportTarget"
        }
    },
    "FeedbackFeatureKey": {
        "type": "string",
        "enum": [
            "home",
            "curriculum-planner",
            "semester-planner",
            "course-situation",
            "agenda",
            "social",
            "academic-data"
        ],
        "x-pomi-schema": {
            "kind": "value-object",
            "publicName": "FeedbackFeatureKey"
        }
    },
    "FeedbackAcademicResourceType": {
        "type": "string",
        "enum": [
            "COURSE",
            "CATALOG_COURSE",
            "CATALOG_PROGRAM",
            "CURRICULUM_SUGGESTION",
            "CLASS",
            "CLASS_SCHEDULE",
            "STUDY_PERIOD",
            "DAILY_MENU",
            "CALENDAR_EVENT"
        ],
        "x-pomi-schema": {
            "kind": "value-object",
            "publicName": "FeedbackAcademicResourceType"
        }
    },
    "FeedbackReport": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "kind": {
                "$ref": "#/components/schemas/FeedbackKind"
            },
            "target": {
                "$ref": "#/components/schemas/FeedbackReportTarget"
            },
            "title": {
                "type": "string"
            },
            "description": {
                "type": "string"
            },
            "sourcePath": {
                "type": "string",
                "nullable": true
            },
            "status": {
                "$ref": "#/components/schemas/FeedbackStatus"
            },
            "adminMessage": {
                "type": "string",
                "nullable": true
            },
            "reporterStudentId": {
                "type": "integer",
                "nullable": true
            },
            "createdAt": {
                "type": "string",
                "format": "date-time"
            },
            "updatedAt": {
                "type": "string",
                "format": "date-time"
            }
        },
        "required": [
            "id",
            "kind",
            "target",
            "title",
            "description",
            "sourcePath",
            "status",
            "adminMessage",
            "reporterStudentId",
            "createdAt",
            "updatedAt"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "FeedbackReport",
            "identityFields": [
                "id"
            ]
        }
    },
    "FeedbackStatus": {
        "type": "string",
        "enum": [
            "OPEN",
            "IN_PROGRESS",
            "CLOSED"
        ],
        "x-pomi-schema": {
            "kind": "value-object",
            "publicName": "FeedbackStatus"
        }
    },
    "PatchFeedbackReportBody": {
        "type": "object",
        "properties": {
            "status": {
                "$ref": "#/components/schemas/FeedbackStatus"
            },
            "adminMessage": {
                "type": "string",
                "nullable": true,
                "maxLength": 5000
            }
        },
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "input",
            "publicName": "PatchFeedbackReportBody"
        }
    },
    "ExchangeNoticeSubscription": {
        "type": "object",
        "properties": {
            "studentId": {
                "type": "integer",
                "minimum": 0,
                "exclusiveMinimum": true
            },
            "enabled": {
                "type": "boolean"
            },
            "placeIds": {
                "type": "array",
                "items": {
                    "type": "integer",
                    "minimum": 0,
                    "exclusiveMinimum": true
                }
            }
        },
        "required": [
            "studentId",
            "enabled",
            "placeIds"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "ExchangeNoticeSubscription"
        }
    },
    "PatchExchangeNoticeSubscriptionBody": {
        "type": "object",
        "properties": {
            "enabled": {
                "type": "boolean"
            },
            "placeIds": {
                "type": "array",
                "items": {
                    "type": "integer",
                    "minimum": 0,
                    "exclusiveMinimum": true
                }
            }
        },
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "input",
            "publicName": "PatchExchangeNoticeSubscriptionBody"
        }
    },
    "Category": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "name": {
                "type": "string",
                "minLength": 1
            }
        },
        "required": [
            "id",
            "name"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "Category",
            "identityFields": [
                "id"
            ]
        }
    },
    "Tag": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "name": {
                "type": "string",
                "minLength": 1
            },
            "categoryId": {
                "type": "integer"
            },
            "parentTagId": {
                "type": "integer",
                "nullable": true
            }
        },
        "required": [
            "id",
            "name",
            "categoryId",
            "parentTagId"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "Tag",
            "identityFields": [
                "id"
            ]
        }
    },
    "TagRelatedCourse": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "code": {
                "type": "string",
                "minLength": 1
            },
            "name": {
                "type": "string",
                "minLength": 1
            },
            "credits": {
                "type": "integer",
                "minimum": 0
            }
        },
        "required": [
            "id",
            "code",
            "name",
            "credits"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "TagRelatedCourse",
            "identityFields": [
                "id"
            ]
        }
    },
    "StudentTagInterest": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer",
                "minimum": 0,
                "exclusiveMinimum": true
            },
            "name": {
                "type": "string"
            },
            "categoryId": {
                "type": "integer",
                "minimum": 0,
                "exclusiveMinimum": true
            },
            "parentTagId": {
                "type": "integer",
                "nullable": true,
                "minimum": 0,
                "exclusiveMinimum": true
            }
        },
        "required": [
            "id",
            "name",
            "categoryId",
            "parentTagId"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "StudentTagInterest",
            "identityFields": [
                "id"
            ]
        }
    }
} as const

export const enumValues = {
    "StudentCapability": [
        "STUDENT_PROFILE_READ",
        "STUDENT_PROFILE_WRITE",
        "STUDENT_HISTORY_READ",
        "STUDENT_HISTORY_WRITE",
        "STUDENT_PLANNING_READ",
        "STUDENT_PLANNING_WRITE",
        "STUDENT_SOCIAL_READ",
        "STUDENT_SOCIAL_WRITE",
        "STUDENT_FEEDBACK_READ",
        "STUDENT_FEEDBACK_WRITE"
    ],
    "AuthUserStatus": [
        "ACTIVE",
        "DISABLED"
    ],
    "YearPeriod": [
        "SUMMER",
        "FIRST_SEMESTER",
        "WINTER",
        "SECOND_SEMESTER"
    ],
    "PlanningVisibility": [
        "PRIVATE",
        "FRIENDS",
        "PUBLIC"
    ],
    "PlanningGuideMode": [
        "CURRICULUM",
        "PROGRAM",
        "NONE"
    ],
    "PlanningCurriculumSource": [
        "SAVED",
        "SUGGESTION",
        null
    ],
    "DayOfWeek": [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY"
    ],
    "SharedPlanningVisibility": [
        "FRIENDS",
        "PUBLIC"
    ],
    "CourseEvaluationMode": [
        "GRADE_AND_ATTENDANCE",
        "ATTENDANCE",
        "CONCEPT"
    ],
    "StudentCourseAttemptStatus": [
        "ENROLLED",
        "DROPPED",
        "APPROVED",
        "FAILED_BY_GRADE",
        "APPROVED_BY_ATTENDANCE",
        "APPROVED_BY_PROFICIENCY",
        "FAILED_BY_ATTENDANCE",
        "SUFFICIENT",
        "INSUFFICIENT"
    ],
    "HistoryCourseStatus": [
        "ENROLLED",
        "APPROVED",
        "APPROVED_BY_ATTENDANCE",
        "APPROVED_BY_PROFICIENCY",
        "DROPPED",
        "FAILED_BY_ATTENDANCE",
        "SUFFICIENT"
    ],
    "StudentProfileVisibility": [
        "PRIVATE",
        "FRIENDS",
        "PUBLIC"
    ],
    "StudentFriendshipStatus": [
        "PENDING",
        "ACCEPTED"
    ],
    "StudentFriendshipDirection": [
        "INCOMING",
        "OUTGOING",
        "NONE"
    ],
    "FeedbackKind": [
        "BUG",
        "SUGGESTION",
        "DATA_ISSUE"
    ],
    "FeedbackFeatureKey": [
        "home",
        "curriculum-planner",
        "semester-planner",
        "course-situation",
        "agenda",
        "social",
        "academic-data"
    ],
    "FeedbackAcademicResourceType": [
        "COURSE",
        "CATALOG_COURSE",
        "CATALOG_PROGRAM",
        "CURRICULUM_SUGGESTION",
        "CLASS",
        "CLASS_SCHEDULE",
        "STUDY_PERIOD",
        "DAILY_MENU",
        "CALENDAR_EVENT"
    ],
    "FeedbackStatus": [
        "OPEN",
        "IN_PROGRESS",
        "CLOSED"
    ]
} as const

export const queryCapabilities = {
    "acceptStudentFriendship": {
        "parameters": [],
        "filter": null
    },
    "addCourseTag": {
        "parameters": [],
        "filter": null
    },
    "createAuthUser": {
        "parameters": [],
        "filter": null
    },
    "createCategory": {
        "parameters": [],
        "filter": null
    },
    "createFeedbackReport": {
        "parameters": [],
        "filter": null
    },
    "createStudentAbsences": {
        "parameters": [],
        "filter": null
    },
    "createStudentCourseAttempts": {
        "parameters": [],
        "filter": null
    },
    "createStudentCurricula": {
        "parameters": [],
        "filter": null
    },
    "createStudentFeedbackReport": {
        "parameters": [],
        "filter": null
    },
    "createStudentFriendship": {
        "parameters": [],
        "filter": null
    },
    "createStudentHistory": {
        "parameters": [],
        "filter": null
    },
    "createStudentPeriodPlan": {
        "parameters": [],
        "filter": null
    },
    "createStudentPeriodPlannings": {
        "parameters": [],
        "filter": null
    },
    "createStudents": {
        "parameters": [],
        "filter": null
    },
    "createTag": {
        "parameters": [],
        "filter": null
    },
    "deleteCategory": {
        "parameters": [],
        "filter": null
    },
    "deleteStudentAbsences": {
        "parameters": [],
        "filter": null
    },
    "deleteStudentCourseAttempts": {
        "parameters": [],
        "filter": null
    },
    "deleteStudentCurricula": {
        "parameters": [],
        "filter": null
    },
    "deleteStudentFriendship": {
        "parameters": [],
        "filter": null
    },
    "deleteStudentPeriodPlan": {
        "parameters": [],
        "filter": null
    },
    "deleteStudentPeriodPlannings": {
        "parameters": [],
        "filter": null
    },
    "deleteStudents": {
        "parameters": [],
        "filter": null
    },
    "deleteStudentTagInterest": {
        "parameters": [],
        "filter": null
    },
    "deleteTag": {
        "parameters": [],
        "filter": null
    },
    "getCategory": {
        "parameters": [],
        "filter": null
    },
    "getCurrentUser": {
        "parameters": [],
        "filter": null
    },
    "getExchangeNoticeSubscription": {
        "parameters": [],
        "filter": null
    },
    "getProfessorEvaluation": {
        "parameters": [],
        "filter": null
    },
    "getPublicSharedPeriodPlanning": {
        "parameters": [],
        "filter": null
    },
    "getStudentCourseAttempts": {
        "parameters": [],
        "filter": null
    },
    "getStudentCurricula": {
        "parameters": [],
        "filter": null
    },
    "getStudentPeriodPlan": {
        "parameters": [],
        "filter": null
    },
    "getStudentPeriodPlannings": {
        "parameters": [],
        "filter": null
    },
    "getStudentPerson": {
        "parameters": [],
        "filter": null
    },
    "getStudentPublicProfile": {
        "parameters": [],
        "filter": null
    },
    "getStudents": {
        "parameters": [],
        "filter": null
    },
    "getStudentSharedPeriodPlanning": {
        "parameters": [],
        "filter": null
    },
    "getTag": {
        "parameters": [],
        "filter": null
    },
    "listAuthUsers": {
        "parameters": [
            {
                "name": "page",
                "required": false,
                "description": "Page number. The first page is 1.",
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "Page number. The first page is 1."
                }
            },
            {
                "name": "pageSize",
                "required": false,
                "description": "Number of items per page, or \"all\" to return every item.",
                "style": null,
                "explode": null,
                "schema": {
                    "anyOf": [
                        {
                            "type": "integer",
                            "minimum": 1
                        },
                        {
                            "type": "string",
                            "enum": [
                                "all"
                            ]
                        }
                    ],
                    "description": "Number of items per page, or \"all\" to return every item."
                }
            },
            {
                "name": "sort",
                "required": false,
                "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                "style": "form",
                "explode": false,
                "schema": {
                    "type": "string",
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "example": "id:asc"
                }
            }
        ],
        "filter": null,
        "sort": {
            "version": 1,
            "fields": [
                "id",
                "displayName",
                "email",
                "status"
            ],
            "default": "id:asc"
        }
    },
    "listBotGrants": {
        "parameters": [
            {
                "name": "page",
                "required": false,
                "description": "Page number. The first page is 1.",
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "Page number. The first page is 1."
                }
            },
            {
                "name": "pageSize",
                "required": false,
                "description": "Number of items per page, or \"all\" to return every item.",
                "style": null,
                "explode": null,
                "schema": {
                    "anyOf": [
                        {
                            "type": "integer",
                            "minimum": 1
                        },
                        {
                            "type": "string",
                            "enum": [
                                "all"
                            ]
                        }
                    ],
                    "description": "Number of items per page, or \"all\" to return every item."
                }
            },
            {
                "name": "sort",
                "required": false,
                "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                "style": "form",
                "explode": false,
                "schema": {
                    "type": "string",
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "example": "createdAt:desc"
                }
            }
        ],
        "filter": null,
        "sort": {
            "version": 1,
            "fields": [
                "createdAt",
                "capability",
                "botDisplayName"
            ],
            "default": "createdAt:desc"
        }
    },
    "listBots": {
        "parameters": [
            {
                "name": "page",
                "required": false,
                "description": "Page number. The first page is 1.",
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "Page number. The first page is 1."
                }
            },
            {
                "name": "pageSize",
                "required": false,
                "description": "Number of items per page, or \"all\" to return every item.",
                "style": null,
                "explode": null,
                "schema": {
                    "anyOf": [
                        {
                            "type": "integer",
                            "minimum": 1
                        },
                        {
                            "type": "string",
                            "enum": [
                                "all"
                            ]
                        }
                    ],
                    "description": "Number of items per page, or \"all\" to return every item."
                }
            },
            {
                "name": "sort",
                "required": false,
                "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                "style": "form",
                "explode": false,
                "schema": {
                    "type": "string",
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "example": "displayName:asc"
                }
            }
        ],
        "filter": null,
        "sort": {
            "version": 1,
            "fields": [
                "displayName"
            ],
            "default": "displayName:asc"
        }
    },
    "listCategories": {
        "parameters": [
            {
                "name": "page",
                "required": false,
                "description": "Page number. The first page is 1.",
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "Page number. The first page is 1."
                }
            },
            {
                "name": "pageSize",
                "required": false,
                "description": "Number of items per page, or \"all\" to return every item.",
                "style": null,
                "explode": null,
                "schema": {
                    "anyOf": [
                        {
                            "type": "integer",
                            "minimum": 1
                        },
                        {
                            "type": "string",
                            "enum": [
                                "all"
                            ]
                        }
                    ],
                    "description": "Number of items per page, or \"all\" to return every item."
                }
            },
            {
                "name": "sort",
                "required": false,
                "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                "style": "form",
                "explode": false,
                "schema": {
                    "type": "string",
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "example": "name:asc"
                }
            }
        ],
        "filter": null,
        "sort": {
            "version": 1,
            "fields": [
                "name"
            ],
            "default": "name:asc"
        }
    },
    "listCourseTags": {
        "parameters": [
            {
                "name": "page",
                "required": false,
                "description": "Page number. The first page is 1.",
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "Page number. The first page is 1."
                }
            },
            {
                "name": "pageSize",
                "required": false,
                "description": "Number of items per page, or \"all\" to return every item.",
                "style": null,
                "explode": null,
                "schema": {
                    "anyOf": [
                        {
                            "type": "integer",
                            "minimum": 1
                        },
                        {
                            "type": "string",
                            "enum": [
                                "all"
                            ]
                        }
                    ],
                    "description": "Number of items per page, or \"all\" to return every item."
                }
            },
            {
                "name": "sort",
                "required": false,
                "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                "style": "form",
                "explode": false,
                "schema": {
                    "type": "string",
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "example": "name:asc"
                }
            }
        ],
        "filter": null,
        "sort": {
            "version": 1,
            "fields": [
                "name",
                "categoryId"
            ],
            "default": "name:asc"
        }
    },
    "listFeedbackReports": {
        "parameters": [
            {
                "name": "page",
                "required": false,
                "description": "Page number. The first page is 1.",
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "Page number. The first page is 1."
                }
            },
            {
                "name": "pageSize",
                "required": false,
                "description": "Number of items per page, or \"all\" to return every item.",
                "style": null,
                "explode": null,
                "schema": {
                    "anyOf": [
                        {
                            "type": "integer",
                            "minimum": 1
                        },
                        {
                            "type": "string",
                            "enum": [
                                "all"
                            ]
                        }
                    ],
                    "description": "Number of items per page, or \"all\" to return every item."
                }
            },
            {
                "name": "sort",
                "required": false,
                "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                "style": "form",
                "explode": false,
                "schema": {
                    "type": "string",
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "example": "createdAt:desc"
                }
            }
        ],
        "filter": null,
        "sort": {
            "version": 1,
            "fields": [
                "createdAt",
                "updatedAt",
                "status",
                "kind",
                "title"
            ],
            "default": "createdAt:desc"
        }
    },
    "listPendingProfessorEvaluations": {
        "parameters": [
            {
                "name": "page",
                "required": false,
                "description": "Page number. The first page is 1.",
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "Page number. The first page is 1."
                }
            },
            {
                "name": "pageSize",
                "required": false,
                "description": "Number of items per page, or \"all\" to return every item.",
                "style": null,
                "explode": null,
                "schema": {
                    "anyOf": [
                        {
                            "type": "integer",
                            "minimum": 1
                        },
                        {
                            "type": "string",
                            "enum": [
                                "all"
                            ]
                        }
                    ],
                    "description": "Number of items per page, or \"all\" to return every item."
                }
            },
            {
                "name": "filter",
                "required": true,
                "description": "Pending evaluation filters. Use filter[year]=2026&filter[yearPeriod]=FIRST_SEMESTER.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "year": {
                            "oneOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "type": "integer"
                                        }
                                    },
                                    "type": "object"
                                }
                            ]
                        },
                        "yearPeriod": {
                            "oneOf": [
                                {
                                    "enum": [
                                        "FIRST_SEMESTER",
                                        "SECOND_SEMESTER"
                                    ],
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "enum": [
                                                "FIRST_SEMESTER",
                                                "SECOND_SEMESTER"
                                            ],
                                            "type": "string"
                                        }
                                    },
                                    "type": "object"
                                }
                            ]
                        }
                    },
                    "type": "object"
                }
            },
            {
                "name": "sort",
                "required": false,
                "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                "style": "form",
                "explode": false,
                "schema": {
                    "type": "string",
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "example": "courseCode:asc,classCode:asc,professorName:asc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "year"
                    ],
                    "schema": {
                        "type": "integer"
                    },
                    "operators": [
                        "eq"
                    ]
                },
                {
                    "path": [
                        "yearPeriod"
                    ],
                    "schema": {
                        "enum": [
                            "FIRST_SEMESTER",
                            "SECOND_SEMESTER"
                        ],
                        "type": "string"
                    },
                    "operators": [
                        "eq"
                    ]
                }
            ],
            "constraints": {
                "maxExpressions": 20,
                "maxDepth": 3,
                "maxParameters": 100
            }
        },
        "sort": {
            "version": 1,
            "fields": [
                "courseCode",
                "courseName",
                "classCode",
                "professorName"
            ],
            "default": "courseCode:asc,classCode:asc,professorName:asc"
        }
    },
    "listPublicSharedPeriodPlannings": {
        "parameters": [
            {
                "name": "page",
                "required": false,
                "description": "Page number. The first page is 1.",
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "Page number. The first page is 1."
                }
            },
            {
                "name": "pageSize",
                "required": false,
                "description": "Number of items per page.",
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 50,
                    "description": "Number of items per page."
                }
            },
            {
                "name": "query",
                "required": false,
                "description": null,
                "style": null,
                "explode": null,
                "schema": {
                    "type": "string",
                    "minLength": 1
                }
            },
            {
                "name": "filter",
                "required": false,
                "description": "Structured shared planning filters. Use filter[studyPeriodId]=42.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "studyPeriodId": {
                            "oneOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "type": "integer"
                                        },
                                        "in": {
                                            "items": {
                                                "type": "integer"
                                            },
                                            "type": "array"
                                        }
                                    },
                                    "type": "object"
                                }
                            ]
                        }
                    },
                    "type": "object"
                }
            },
            {
                "name": "sort",
                "required": false,
                "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                "style": "form",
                "explode": false,
                "schema": {
                    "type": "string",
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "example": "updatedAt:desc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "studyPeriodId"
                    ],
                    "schema": {
                        "type": "integer"
                    },
                    "operators": [
                        "eq",
                        "in"
                    ]
                }
            ],
            "constraints": {
                "maxExpressions": 20,
                "maxDepth": 3,
                "maxParameters": 100
            }
        },
        "sort": {
            "version": 1,
            "fields": [
                "updatedAt",
                "name",
                "studyPeriodYear"
            ],
            "default": "updatedAt:desc"
        }
    },
    "listStudentAbsences": {
        "parameters": [
            {
                "name": "page",
                "required": false,
                "description": "Page number. The first page is 1.",
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "Page number. The first page is 1."
                }
            },
            {
                "name": "pageSize",
                "required": false,
                "description": "Number of items per page, or \"all\" to return every item.",
                "style": null,
                "explode": null,
                "schema": {
                    "anyOf": [
                        {
                            "type": "integer",
                            "minimum": 1
                        },
                        {
                            "type": "string",
                            "enum": [
                                "all"
                            ]
                        }
                    ],
                    "description": "Number of items per page, or \"all\" to return every item."
                }
            },
            {
                "name": "filter",
                "required": false,
                "description": "Structured absence filters. Use filter[courseAttemptId]=42.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "courseAttemptId": {
                            "oneOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "type": "integer"
                                        },
                                        "in": {
                                            "items": {
                                                "type": "integer"
                                            },
                                            "type": "array"
                                        }
                                    },
                                    "type": "object"
                                }
                            ]
                        }
                    },
                    "type": "object"
                }
            },
            {
                "name": "sort",
                "required": false,
                "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                "style": "form",
                "explode": false,
                "schema": {
                    "type": "string",
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "example": "date:desc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "courseAttemptId"
                    ],
                    "schema": {
                        "type": "integer"
                    },
                    "operators": [
                        "eq",
                        "in"
                    ]
                }
            ],
            "constraints": {
                "maxExpressions": 20,
                "maxDepth": 3,
                "maxParameters": 100
            }
        },
        "sort": {
            "version": 1,
            "fields": [
                "date",
                "courseCode",
                "classCode",
                "start",
                "createdAt"
            ],
            "default": "date:desc"
        }
    },
    "listStudentCourseAttempts": {
        "parameters": [
            {
                "name": "page",
                "required": false,
                "description": "Page number. The first page is 1.",
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "Page number. The first page is 1."
                }
            },
            {
                "name": "pageSize",
                "required": false,
                "description": "Number of items per page, or \"all\" to return every item.",
                "style": null,
                "explode": null,
                "schema": {
                    "anyOf": [
                        {
                            "type": "integer",
                            "minimum": 1
                        },
                        {
                            "type": "string",
                            "enum": [
                                "all"
                            ]
                        }
                    ],
                    "description": "Number of items per page, or \"all\" to return every item."
                }
            },
            {
                "name": "filter",
                "required": false,
                "description": "Structured course attempt filters. Use filter[status]=APPROVED or filter[courseId]=42.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "status": {
                            "oneOf": [
                                {
                                    "enum": [
                                        "ENROLLED",
                                        "DROPPED",
                                        "APPROVED",
                                        "FAILED_BY_GRADE",
                                        "APPROVED_BY_ATTENDANCE",
                                        "APPROVED_BY_PROFICIENCY",
                                        "FAILED_BY_ATTENDANCE",
                                        "SUFFICIENT",
                                        "INSUFFICIENT"
                                    ],
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "enum": [
                                                "ENROLLED",
                                                "DROPPED",
                                                "APPROVED",
                                                "FAILED_BY_GRADE",
                                                "APPROVED_BY_ATTENDANCE",
                                                "APPROVED_BY_PROFICIENCY",
                                                "FAILED_BY_ATTENDANCE",
                                                "SUFFICIENT",
                                                "INSUFFICIENT"
                                            ],
                                            "type": "string"
                                        },
                                        "in": {
                                            "items": {
                                                "enum": [
                                                    "ENROLLED",
                                                    "DROPPED",
                                                    "APPROVED",
                                                    "FAILED_BY_GRADE",
                                                    "APPROVED_BY_ATTENDANCE",
                                                    "APPROVED_BY_PROFICIENCY",
                                                    "FAILED_BY_ATTENDANCE",
                                                    "SUFFICIENT",
                                                    "INSUFFICIENT"
                                                ],
                                                "type": "string"
                                            },
                                            "type": "array"
                                        }
                                    },
                                    "type": "object"
                                }
                            ]
                        },
                        "courseId": {
                            "oneOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "type": "integer"
                                        },
                                        "in": {
                                            "items": {
                                                "type": "integer"
                                            },
                                            "type": "array"
                                        }
                                    },
                                    "type": "object"
                                }
                            ]
                        },
                        "studyPeriodId": {
                            "oneOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "type": "integer"
                                        },
                                        "in": {
                                            "items": {
                                                "type": "integer"
                                            },
                                            "type": "array"
                                        }
                                    },
                                    "type": "object"
                                }
                            ]
                        }
                    },
                    "type": "object"
                }
            },
            {
                "name": "sort",
                "required": false,
                "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                "style": "form",
                "explode": false,
                "schema": {
                    "type": "string",
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "example": "createdAt:desc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "status"
                    ],
                    "schema": {
                        "enum": [
                            "ENROLLED",
                            "DROPPED",
                            "APPROVED",
                            "FAILED_BY_GRADE",
                            "APPROVED_BY_ATTENDANCE",
                            "APPROVED_BY_PROFICIENCY",
                            "FAILED_BY_ATTENDANCE",
                            "SUFFICIENT",
                            "INSUFFICIENT"
                        ],
                        "type": "string"
                    },
                    "operators": [
                        "eq",
                        "in"
                    ]
                },
                {
                    "path": [
                        "courseId"
                    ],
                    "schema": {
                        "type": "integer"
                    },
                    "operators": [
                        "eq",
                        "in"
                    ]
                },
                {
                    "path": [
                        "studyPeriodId"
                    ],
                    "schema": {
                        "type": "integer"
                    },
                    "operators": [
                        "eq",
                        "in"
                    ]
                }
            ],
            "constraints": {
                "maxExpressions": 20,
                "maxDepth": 3,
                "maxParameters": 100
            }
        },
        "sort": {
            "version": 1,
            "fields": [
                "createdAt",
                "updatedAt",
                "courseCode",
                "status",
                "grade"
            ],
            "default": "createdAt:desc"
        }
    },
    "listStudentCurricula": {
        "parameters": [
            {
                "name": "page",
                "required": false,
                "description": "Page number. The first page is 1.",
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "Page number. The first page is 1."
                }
            },
            {
                "name": "pageSize",
                "required": false,
                "description": "Number of items per page, or \"all\" to return every item.",
                "style": null,
                "explode": null,
                "schema": {
                    "anyOf": [
                        {
                            "type": "integer",
                            "minimum": 1
                        },
                        {
                            "type": "string",
                            "enum": [
                                "all"
                            ]
                        }
                    ],
                    "description": "Number of items per page, or \"all\" to return every item."
                }
            },
            {
                "name": "sort",
                "required": false,
                "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                "style": "form",
                "explode": false,
                "schema": {
                    "type": "string",
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "example": "isFavorite:desc,updatedAt:desc"
                }
            }
        ],
        "filter": null,
        "sort": {
            "version": 1,
            "fields": [
                "isFavorite",
                "updatedAt",
                "name"
            ],
            "default": "isFavorite:desc,updatedAt:desc"
        }
    },
    "listStudentFeedbackReports": {
        "parameters": [
            {
                "name": "page",
                "required": false,
                "description": "Page number. The first page is 1.",
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "Page number. The first page is 1."
                }
            },
            {
                "name": "pageSize",
                "required": false,
                "description": "Number of items per page, or \"all\" to return every item.",
                "style": null,
                "explode": null,
                "schema": {
                    "anyOf": [
                        {
                            "type": "integer",
                            "minimum": 1
                        },
                        {
                            "type": "string",
                            "enum": [
                                "all"
                            ]
                        }
                    ],
                    "description": "Number of items per page, or \"all\" to return every item."
                }
            },
            {
                "name": "sort",
                "required": false,
                "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                "style": "form",
                "explode": false,
                "schema": {
                    "type": "string",
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "example": "createdAt:desc"
                }
            }
        ],
        "filter": null,
        "sort": {
            "version": 1,
            "fields": [
                "createdAt",
                "updatedAt",
                "status",
                "kind",
                "title"
            ],
            "default": "createdAt:desc"
        }
    },
    "listStudentFriendships": {
        "parameters": [
            {
                "name": "page",
                "required": false,
                "description": "Page number. The first page is 1.",
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "Page number. The first page is 1."
                }
            },
            {
                "name": "pageSize",
                "required": false,
                "description": "Number of items per page, or \"all\" to return every item.",
                "style": null,
                "explode": null,
                "schema": {
                    "anyOf": [
                        {
                            "type": "integer",
                            "minimum": 1
                        },
                        {
                            "type": "string",
                            "enum": [
                                "all"
                            ]
                        }
                    ],
                    "description": "Number of items per page, or \"all\" to return every item."
                }
            },
            {
                "name": "filter",
                "required": false,
                "description": "Structured friendship filters. Use filter[status]=PENDING or filter[direction]=INCOMING.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "status": {
                            "oneOf": [
                                {
                                    "enum": [
                                        "PENDING",
                                        "ACCEPTED"
                                    ],
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "enum": [
                                                "PENDING",
                                                "ACCEPTED"
                                            ],
                                            "type": "string"
                                        },
                                        "in": {
                                            "items": {
                                                "enum": [
                                                    "PENDING",
                                                    "ACCEPTED"
                                                ],
                                                "type": "string"
                                            },
                                            "type": "array"
                                        }
                                    },
                                    "type": "object"
                                }
                            ]
                        },
                        "direction": {
                            "oneOf": [
                                {
                                    "enum": [
                                        "INCOMING",
                                        "OUTGOING"
                                    ],
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "enum": [
                                                "INCOMING",
                                                "OUTGOING"
                                            ],
                                            "type": "string"
                                        }
                                    },
                                    "type": "object"
                                }
                            ]
                        }
                    },
                    "type": "object"
                }
            },
            {
                "name": "sort",
                "required": false,
                "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                "style": "form",
                "explode": false,
                "schema": {
                    "type": "string",
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "example": "updatedAt:desc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "status"
                    ],
                    "schema": {
                        "enum": [
                            "PENDING",
                            "ACCEPTED"
                        ],
                        "type": "string"
                    },
                    "operators": [
                        "eq",
                        "in"
                    ]
                },
                {
                    "path": [
                        "direction"
                    ],
                    "schema": {
                        "enum": [
                            "INCOMING",
                            "OUTGOING"
                        ],
                        "type": "string"
                    },
                    "operators": [
                        "eq"
                    ]
                }
            ],
            "constraints": {
                "maxExpressions": 20,
                "maxDepth": 3,
                "maxParameters": 100
            }
        },
        "sort": {
            "version": 1,
            "fields": [
                "updatedAt",
                "status"
            ],
            "default": "updatedAt:desc"
        }
    },
    "listStudentPeople": {
        "parameters": [
            {
                "name": "page",
                "required": false,
                "description": "Page number. The first page is 1.",
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "Page number. The first page is 1."
                }
            },
            {
                "name": "pageSize",
                "required": false,
                "description": "Number of items per page.",
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 50,
                    "description": "Number of items per page."
                }
            },
            {
                "name": "query",
                "required": false,
                "description": null,
                "style": null,
                "explode": null,
                "schema": {
                    "type": "string",
                    "minLength": 1
                }
            },
            {
                "name": "sort",
                "required": false,
                "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                "style": "form",
                "explode": false,
                "schema": {
                    "type": "string",
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "example": "displayName:asc"
                }
            }
        ],
        "filter": null,
        "sort": {
            "version": 1,
            "fields": [
                "displayName"
            ],
            "default": "displayName:asc"
        }
    },
    "listStudentPeriodPlan": {
        "parameters": [
            {
                "name": "page",
                "required": false,
                "description": "Page number. The first page is 1.",
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "Page number. The first page is 1."
                }
            },
            {
                "name": "pageSize",
                "required": false,
                "description": "Number of items per page, or \"all\" to return every item.",
                "style": null,
                "explode": null,
                "schema": {
                    "anyOf": [
                        {
                            "type": "integer",
                            "minimum": 1
                        },
                        {
                            "type": "string",
                            "enum": [
                                "all"
                            ]
                        }
                    ],
                    "description": "Number of items per page, or \"all\" to return every item."
                }
            },
            {
                "name": "sort",
                "required": false,
                "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                "style": "form",
                "explode": false,
                "schema": {
                    "type": "string",
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "example": "updatedAt:desc"
                }
            }
        ],
        "filter": null,
        "sort": {
            "version": 1,
            "fields": [
                "updatedAt",
                "name",
                "studyPeriodYear",
                "studyPeriodYearPeriod",
                "visibility"
            ],
            "default": "updatedAt:desc"
        }
    },
    "listStudentPeriodPlannings": {
        "parameters": [
            {
                "name": "page",
                "required": false,
                "description": "Page number. The first page is 1.",
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "Page number. The first page is 1."
                }
            },
            {
                "name": "pageSize",
                "required": false,
                "description": "Number of items per page, or \"all\" to return every item.",
                "style": null,
                "explode": null,
                "schema": {
                    "anyOf": [
                        {
                            "type": "integer",
                            "minimum": 1
                        },
                        {
                            "type": "string",
                            "enum": [
                                "all"
                            ]
                        }
                    ],
                    "description": "Number of items per page, or \"all\" to return every item."
                }
            },
            {
                "name": "sort",
                "required": false,
                "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                "style": "form",
                "explode": false,
                "schema": {
                    "type": "string",
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "example": "updatedAt:desc"
                }
            }
        ],
        "filter": null,
        "sort": {
            "version": 1,
            "fields": [
                "updatedAt",
                "name",
                "studyPeriodYear",
                "studyPeriodYearPeriod",
                "visibility"
            ],
            "default": "updatedAt:desc"
        }
    },
    "listStudents": {
        "parameters": [
            {
                "name": "page",
                "required": false,
                "description": "Page number. The first page is 1.",
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "Page number. The first page is 1."
                }
            },
            {
                "name": "pageSize",
                "required": false,
                "description": "Number of items per page, or \"all\" to return every item.",
                "style": null,
                "explode": null,
                "schema": {
                    "anyOf": [
                        {
                            "type": "integer",
                            "minimum": 1
                        },
                        {
                            "type": "string",
                            "enum": [
                                "all"
                            ]
                        }
                    ],
                    "description": "Number of items per page, or \"all\" to return every item."
                }
            },
            {
                "name": "sort",
                "required": false,
                "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                "style": "form",
                "explode": false,
                "schema": {
                    "type": "string",
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "example": "id:asc"
                }
            }
        ],
        "filter": null,
        "sort": {
            "version": 1,
            "fields": [
                "id",
                "ra",
                "name",
                "entryYear"
            ],
            "default": "id:asc"
        }
    },
    "listStudentSharedPeriodPlannings": {
        "parameters": [
            {
                "name": "page",
                "required": false,
                "description": "Page number. The first page is 1.",
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "Page number. The first page is 1."
                }
            },
            {
                "name": "pageSize",
                "required": false,
                "description": "Number of items per page.",
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 50,
                    "description": "Number of items per page."
                }
            },
            {
                "name": "filter",
                "required": false,
                "description": "Structured shared planning filters. Use filter[ownerPublicId]=UUID.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "ownerPublicId": {
                            "oneOf": [
                                {
                                    "format": "uuid",
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "format": "uuid",
                                            "type": "string"
                                        },
                                        "in": {
                                            "items": {
                                                "format": "uuid",
                                                "type": "string"
                                            },
                                            "type": "array"
                                        }
                                    },
                                    "type": "object"
                                }
                            ]
                        }
                    },
                    "type": "object"
                }
            },
            {
                "name": "sort",
                "required": false,
                "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                "style": "form",
                "explode": false,
                "schema": {
                    "type": "string",
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "example": "updatedAt:desc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "ownerPublicId"
                    ],
                    "schema": {
                        "format": "uuid",
                        "type": "string"
                    },
                    "operators": [
                        "eq",
                        "in"
                    ]
                }
            ],
            "constraints": {
                "maxExpressions": 20,
                "maxDepth": 3,
                "maxParameters": 100
            }
        },
        "sort": {
            "version": 1,
            "fields": [
                "updatedAt",
                "name",
                "studyPeriodYear"
            ],
            "default": "updatedAt:desc"
        }
    },
    "listStudentTagInterests": {
        "parameters": [
            {
                "name": "page",
                "required": false,
                "description": "Page number. The first page is 1.",
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "Page number. The first page is 1."
                }
            },
            {
                "name": "pageSize",
                "required": false,
                "description": "Number of items per page, or \"all\" to return every item.",
                "style": null,
                "explode": null,
                "schema": {
                    "anyOf": [
                        {
                            "type": "integer",
                            "minimum": 1
                        },
                        {
                            "type": "string",
                            "enum": [
                                "all"
                            ]
                        }
                    ],
                    "description": "Number of items per page, or \"all\" to return every item."
                }
            },
            {
                "name": "sort",
                "required": false,
                "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                "style": "form",
                "explode": false,
                "schema": {
                    "type": "string",
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "example": "name:asc"
                }
            }
        ],
        "filter": null,
        "sort": {
            "version": 1,
            "fields": [
                "name"
            ],
            "default": "name:asc"
        }
    },
    "listTagCourses": {
        "parameters": [
            {
                "name": "page",
                "required": false,
                "description": "Page number. The first page is 1.",
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "default": 1,
                    "description": "Page number. The first page is 1."
                }
            },
            {
                "name": "pageSize",
                "required": false,
                "description": "Number of items per page.",
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "default": 20,
                    "description": "Number of items per page."
                }
            },
            {
                "name": "sort",
                "required": false,
                "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                "style": "form",
                "explode": false,
                "schema": {
                    "type": "string",
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "example": "code:asc"
                }
            }
        ],
        "filter": null,
        "sort": {
            "version": 1,
            "fields": [
                "code",
                "name",
                "credits"
            ],
            "default": "code:asc"
        }
    },
    "listTags": {
        "parameters": [
            {
                "name": "page",
                "required": false,
                "description": "Page number. The first page is 1.",
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "Page number. The first page is 1."
                }
            },
            {
                "name": "pageSize",
                "required": false,
                "description": "Number of items per page, or \"all\" to return every item.",
                "style": null,
                "explode": null,
                "schema": {
                    "anyOf": [
                        {
                            "type": "integer",
                            "minimum": 1
                        },
                        {
                            "type": "string",
                            "enum": [
                                "all"
                            ]
                        }
                    ],
                    "description": "Number of items per page, or \"all\" to return every item."
                }
            },
            {
                "name": "filter",
                "required": false,
                "description": "Structured tag filters. Use filter[categoryId]=1 or filter[courseId]=2.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "categoryId": {
                            "oneOf": [
                                {
                                    "minimum": 1,
                                    "type": "integer"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "minimum": 1,
                                            "type": "integer"
                                        },
                                        "in": {
                                            "items": {
                                                "minimum": 1,
                                                "type": "integer"
                                            },
                                            "type": "array"
                                        }
                                    },
                                    "type": "object"
                                }
                            ]
                        },
                        "parentTagId": {
                            "oneOf": [
                                {
                                    "minimum": 1,
                                    "type": "integer"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "minimum": 1,
                                            "type": "integer"
                                        },
                                        "in": {
                                            "items": {
                                                "minimum": 1,
                                                "type": "integer"
                                            },
                                            "type": "array"
                                        }
                                    },
                                    "type": "object"
                                }
                            ]
                        },
                        "courseId": {
                            "oneOf": [
                                {
                                    "minimum": 1,
                                    "type": "integer"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "minimum": 1,
                                            "type": "integer"
                                        },
                                        "in": {
                                            "items": {
                                                "minimum": 1,
                                                "type": "integer"
                                            },
                                            "type": "array"
                                        }
                                    },
                                    "type": "object"
                                }
                            ]
                        }
                    },
                    "type": "object"
                }
            },
            {
                "name": "sort",
                "required": false,
                "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                "style": "form",
                "explode": false,
                "schema": {
                    "type": "string",
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "example": "name:asc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "categoryId"
                    ],
                    "schema": {
                        "minimum": 1,
                        "type": "integer"
                    },
                    "operators": [
                        "eq",
                        "in"
                    ]
                },
                {
                    "path": [
                        "parentTagId"
                    ],
                    "schema": {
                        "minimum": 1,
                        "type": "integer"
                    },
                    "operators": [
                        "eq",
                        "in"
                    ]
                },
                {
                    "path": [
                        "courseId"
                    ],
                    "schema": {
                        "minimum": 1,
                        "type": "integer"
                    },
                    "operators": [
                        "eq",
                        "in"
                    ]
                }
            ],
            "constraints": {
                "maxExpressions": 20,
                "maxDepth": 3,
                "maxParameters": 100
            }
        },
        "sort": {
            "version": 1,
            "fields": [
                "name",
                "categoryId"
            ],
            "default": "name:asc"
        }
    },
    "removeCourseTag": {
        "parameters": [],
        "filter": null
    },
    "replaceBotGrant": {
        "parameters": [],
        "filter": null
    },
    "unsubscribeExchangeNotices": {
        "parameters": [
            {
                "name": "token",
                "required": true,
                "description": null,
                "style": null,
                "explode": null,
                "schema": {
                    "type": "string",
                    "minLength": 1
                }
            }
        ],
        "filter": null
    },
    "updateAuthUser": {
        "parameters": [],
        "filter": null
    },
    "updateCategory": {
        "parameters": [],
        "filter": null
    },
    "updateExchangeNoticeSubscription": {
        "parameters": [],
        "filter": null
    },
    "updateFeedbackReport": {
        "parameters": [],
        "filter": null
    },
    "updateProfessorEvaluation": {
        "parameters": [],
        "filter": null
    },
    "updateStudentCourseAttempts": {
        "parameters": [],
        "filter": null
    },
    "updateStudentCurricula": {
        "parameters": [],
        "filter": null
    },
    "updateStudentPeriodPlan": {
        "parameters": [],
        "filter": null
    },
    "updateStudentPeriodPlannings": {
        "parameters": [],
        "filter": null
    },
    "updateStudentPublicProfile": {
        "parameters": [],
        "filter": null
    },
    "updateStudents": {
        "parameters": [],
        "filter": null
    },
    "updateStudentTagInterest": {
        "parameters": [],
        "filter": null
    },
    "updateTag": {
        "parameters": [],
        "filter": null
    }
} as const

export type ComponentSchemaName = keyof typeof componentSchemas
export type EnumName = keyof typeof enumValues
