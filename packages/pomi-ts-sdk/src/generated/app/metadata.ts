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
        "additionalProperties": false
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
        "additionalProperties": false
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
        "additionalProperties": false
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
        "additionalProperties": false
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
        "additionalProperties": false
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
                ]
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
        "additionalProperties": false
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
        "additionalProperties": false
    },
    "ReplaceBotGrantBody": {
        "type": "object",
        "properties": {
            "capabilities": {
                "type": "array",
                "items": {
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
                    ]
                }
            }
        },
        "required": [
            "capabilities"
        ],
        "additionalProperties": false
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
            },
            "_paths": {
                "type": "object",
                "properties": {
                    "classes": {
                        "type": "string"
                    },
                    "classSchedules": {
                        "type": "string"
                    }
                },
                "required": [
                    "classes",
                    "classSchedules"
                ]
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
            "languageId",
            "_paths"
        ],
        "additionalProperties": false
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
        "additionalProperties": false
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
        "additionalProperties": false
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
        "additionalProperties": false
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
        "additionalProperties": false
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
        "additionalProperties": false
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
                    "specializationId": {
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
                    "specializationId",
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
            },
            "_paths": {
                "type": "object",
                "properties": {
                    "self": {
                        "type": "string"
                    },
                    "student": {
                        "type": "string"
                    }
                },
                "required": [
                    "self",
                    "student"
                ],
                "additionalProperties": false
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
            "updatedAt",
            "_paths"
        ],
        "additionalProperties": false
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
                    "specializationId": {
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
                    "specializationId",
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
            },
            "_paths": {
                "type": "object",
                "properties": {
                    "self": {
                        "type": "string"
                    },
                    "student": {
                        "type": "string"
                    }
                },
                "required": [
                    "self",
                    "student"
                ],
                "additionalProperties": false
            }
        },
        "required": [
            "id",
            "studentId",
            "name",
            "isFavorite",
            "selection",
            "createdAt",
            "updatedAt",
            "_paths"
        ],
        "additionalProperties": false
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
        "additionalProperties": false
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
                "type": "string",
                "enum": [
                    "SUMMER",
                    "FIRST_SEMESTER",
                    "WINTER",
                    "SECOND_SEMESTER"
                ]
            },
            "curriculumId": {
                "type": "integer",
                "nullable": true
            },
            "visibility": {
                "type": "string",
                "enum": [
                    "PRIVATE",
                    "FRIENDS",
                    "PUBLIC"
                ]
            },
            "shareId": {
                "type": "string",
                "format": "uuid"
            },
            "guide": {
                "type": "object",
                "properties": {
                    "mode": {
                        "type": "string",
                        "enum": [
                            "CURRICULUM",
                            "PROGRAM",
                            "NONE"
                        ]
                    },
                    "curriculumSource": {
                        "type": "string",
                        "nullable": true,
                        "enum": [
                            "SAVED",
                            "SUGGESTION",
                            null
                        ]
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
                    "specializationId": {
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
                    "specializationId",
                    "languageId",
                    "manualCourseIds"
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
            },
            "classes": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "integer"
                        },
                        "code": {
                            "type": "string"
                        },
                        "reservations": {
                            "type": "array",
                            "items": {
                                "type": "integer"
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
                                "additionalProperties": false
                            }
                        },
                        "classSchedules": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "id": {
                                        "type": "integer"
                                    },
                                    "dayOfWeek": {
                                        "type": "string",
                                        "enum": [
                                            "MONDAY",
                                            "TUESDAY",
                                            "WEDNESDAY",
                                            "THURSDAY",
                                            "FRIDAY",
                                            "SATURDAY",
                                            "SUNDAY"
                                        ]
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
                                "additionalProperties": false
                            }
                        }
                    },
                    "required": [
                        "id",
                        "code",
                        "reservations",
                        "courseId",
                        "courseCode",
                        "courseCredits",
                        "professors",
                        "classSchedules"
                    ],
                    "additionalProperties": false
                }
            },
            "_paths": {
                "type": "object",
                "properties": {
                    "self": {
                        "type": "string"
                    },
                    "student": {
                        "type": "string"
                    },
                    "studyPeriod": {
                        "type": "string"
                    },
                    "curriculum": {
                        "type": "string",
                        "nullable": true
                    }
                },
                "required": [
                    "self",
                    "student",
                    "studyPeriod",
                    "curriculum"
                ],
                "additionalProperties": false
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
            "classes",
            "_paths"
        ],
        "additionalProperties": false
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
        "additionalProperties": false
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
                "type": "object",
                "properties": {
                    "mode": {
                        "type": "string",
                        "enum": [
                            "CURRICULUM",
                            "PROGRAM",
                            "NONE"
                        ]
                    },
                    "curriculumSource": {
                        "type": "string",
                        "nullable": true,
                        "enum": [
                            "SAVED",
                            "SUGGESTION",
                            null
                        ]
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
                    "specializationId": {
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
                    "specializationId",
                    "languageId",
                    "manualCourseIds"
                ],
                "additionalProperties": false
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
        "additionalProperties": false
    },
    "UpdatePeriodPlanningInput": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "minLength": 1
            },
            "visibility": {
                "type": "string",
                "enum": [
                    "PRIVATE",
                    "FRIENDS",
                    "PUBLIC"
                ]
            },
            "curriculumId": {
                "type": "integer",
                "nullable": true
            },
            "guide": {
                "type": "object",
                "properties": {
                    "mode": {
                        "type": "string",
                        "enum": [
                            "CURRICULUM",
                            "PROGRAM",
                            "NONE"
                        ]
                    },
                    "curriculumSource": {
                        "type": "string",
                        "nullable": true,
                        "enum": [
                            "SAVED",
                            "SUGGESTION",
                            null
                        ]
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
                    "specializationId": {
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
                    "specializationId",
                    "languageId",
                    "manualCourseIds"
                ],
                "additionalProperties": false
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
        "additionalProperties": false
    },
    "SharedPeriodPlanningPage": {
        "type": "object",
        "properties": {
            "items": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/SharedPeriodPlanning"
                }
            },
            "page": {
                "type": "integer"
            },
            "pageSize": {
                "type": "integer"
            },
            "total": {
                "type": "integer"
            }
        },
        "required": [
            "items",
            "page",
            "pageSize",
            "total"
        ],
        "additionalProperties": false
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
                "type": "string",
                "enum": [
                    "FRIENDS",
                    "PUBLIC"
                ]
            },
            "studyPeriodId": {
                "type": "integer"
            },
            "studyPeriodYear": {
                "type": "integer"
            },
            "studyPeriodYearPeriod": {
                "type": "string",
                "enum": [
                    "SUMMER",
                    "FIRST_SEMESTER",
                    "WINTER",
                    "SECOND_SEMESTER"
                ]
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
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "integer"
                        },
                        "code": {
                            "type": "string"
                        },
                        "reservations": {
                            "type": "array",
                            "items": {
                                "type": "integer"
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
                                "additionalProperties": false
                            }
                        },
                        "classSchedules": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "id": {
                                        "type": "integer"
                                    },
                                    "dayOfWeek": {
                                        "type": "string",
                                        "enum": [
                                            "MONDAY",
                                            "TUESDAY",
                                            "WEDNESDAY",
                                            "THURSDAY",
                                            "FRIDAY",
                                            "SATURDAY",
                                            "SUNDAY"
                                        ]
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
                                "additionalProperties": false
                            }
                        }
                    },
                    "required": [
                        "id",
                        "code",
                        "reservations",
                        "courseId",
                        "courseCode",
                        "courseCredits",
                        "professors",
                        "classSchedules"
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
        "additionalProperties": false
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
        "additionalProperties": false
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
        "additionalProperties": false
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
        "additionalProperties": false
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
        "additionalProperties": false
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
        "additionalProperties": false
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
                "type": "string",
                "enum": [
                    "GRADE_AND_ATTENDANCE",
                    "ATTENDANCE",
                    "CONCEPT"
                ]
            },
            "status": {
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
                ]
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
                ]
            },
            "studyPeriod": {
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
                        "type": "string",
                        "enum": [
                            "SUMMER",
                            "FIRST_SEMESTER",
                            "WINTER",
                            "SECOND_SEMESTER"
                        ]
                    }
                },
                "required": [
                    "id",
                    "year",
                    "yearPeriod"
                ]
            },
            "class": {
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
                ]
            },
            "_paths": {
                "type": "object",
                "properties": {
                    "self": {
                        "type": "string"
                    },
                    "student": {
                        "type": "string"
                    },
                    "course": {
                        "type": "string"
                    },
                    "studyPeriod": {
                        "type": "string",
                        "nullable": true
                    },
                    "class": {
                        "type": "string",
                        "nullable": true
                    }
                },
                "required": [
                    "self",
                    "student",
                    "course",
                    "studyPeriod",
                    "class"
                ]
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
            "class",
            "_paths"
        ],
        "additionalProperties": false
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
        "additionalProperties": false
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
                "type": "string",
                "enum": [
                    "GRADE_AND_ATTENDANCE",
                    "ATTENDANCE",
                    "CONCEPT"
                ]
            },
            "status": {
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
                ]
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
        "additionalProperties": false
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
                "type": "string",
                "enum": [
                    "GRADE_AND_ATTENDANCE",
                    "ATTENDANCE",
                    "CONCEPT"
                ]
            },
            "status": {
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
                ]
            },
            "grade": {
                "type": "number",
                "nullable": true,
                "minimum": 0,
                "maximum": 10
            }
        },
        "additionalProperties": false
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
        "additionalProperties": false
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
        "additionalProperties": false
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
                            "type": "string",
                            "enum": [
                                "SUMMER",
                                "FIRST_SEMESTER",
                                "WINTER",
                                "SECOND_SEMESTER"
                            ]
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
                                        "type": "string",
                                        "enum": [
                                            "APPROVED",
                                            "APPROVED_BY_ATTENDANCE",
                                            "APPROVED_BY_PROFICIENCY",
                                            "DROPPED",
                                            "FAILED_BY_ATTENDANCE",
                                            "SUFFICIENT"
                                        ]
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
        "additionalProperties": false
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
                "type": "string",
                "enum": [
                    "SUMMER",
                    "FIRST_SEMESTER",
                    "WINTER",
                    "SECOND_SEMESTER"
                ]
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
                "type": "string",
                "enum": [
                    "MONDAY",
                    "TUESDAY",
                    "WEDNESDAY",
                    "THURSDAY",
                    "FRIDAY",
                    "SATURDAY",
                    "SUNDAY"
                ]
            },
            "start": {
                "type": "string"
            },
            "end": {
                "type": "string"
            },
            "_paths": {
                "type": "object",
                "properties": {
                    "self": {
                        "type": "string"
                    },
                    "courseAttempt": {
                        "type": "string"
                    },
                    "classSchedule": {
                        "type": "string"
                    },
                    "class": {
                        "type": "string"
                    },
                    "course": {
                        "type": "string"
                    },
                    "studyPeriod": {
                        "type": "string"
                    }
                },
                "required": [
                    "self",
                    "courseAttempt",
                    "classSchedule",
                    "class",
                    "course",
                    "studyPeriod"
                ],
                "additionalProperties": false
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
            "end",
            "_paths"
        ],
        "additionalProperties": false
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
        "additionalProperties": false
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
        "additionalProperties": false
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
            "_paths": {
                "type": "object",
                "properties": {
                    "self": {
                        "type": "string"
                    }
                },
                "required": [
                    "self"
                ],
                "additionalProperties": false
            },
            "enabled": {
                "type": "boolean"
            },
            "currentCoursesVisibility": {
                "type": "string",
                "enum": [
                    "PRIVATE",
                    "FRIENDS",
                    "PUBLIC"
                ]
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
            "_paths",
            "enabled",
            "currentCoursesVisibility"
        ],
        "additionalProperties": false
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
                            "type": "string",
                            "enum": [
                                "MONDAY",
                                "TUESDAY",
                                "WEDNESDAY",
                                "THURSDAY",
                                "FRIDAY",
                                "SATURDAY",
                                "SUNDAY"
                            ]
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
        "additionalProperties": false
    },
    "StudentPeoplePage": {
        "type": "object",
        "properties": {
            "items": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/StudentPublicPerson"
                }
            },
            "page": {
                "type": "number"
            },
            "pageSize": {
                "type": "number"
            },
            "total": {
                "type": "number"
            }
        },
        "required": [
            "items",
            "page",
            "pageSize",
            "total"
        ],
        "additionalProperties": false
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
            },
            "_paths": {
                "type": "object",
                "properties": {
                    "self": {
                        "type": "string"
                    }
                },
                "required": [
                    "self"
                ],
                "additionalProperties": false
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
            "_paths"
        ],
        "additionalProperties": false
    },
    "StudentFriendship": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "status": {
                "type": "string",
                "enum": [
                    "PENDING",
                    "ACCEPTED"
                ]
            },
            "direction": {
                "type": "string",
                "enum": [
                    "INCOMING",
                    "OUTGOING",
                    "NONE"
                ]
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
            },
            "_paths": {
                "type": "object",
                "properties": {
                    "self": {
                        "type": "string"
                    },
                    "friend": {
                        "type": "string"
                    }
                },
                "required": [
                    "self",
                    "friend"
                ],
                "additionalProperties": false
            }
        },
        "required": [
            "id",
            "status",
            "direction",
            "friend",
            "createdAt",
            "acceptedAt",
            "_paths"
        ],
        "additionalProperties": false
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
        "additionalProperties": false
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
        "additionalProperties": false
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
        "additionalProperties": false
    },
    "CreateFeedbackReportBody": {
        "type": "object",
        "properties": {
            "kind": {
                "type": "string",
                "enum": [
                    "BUG",
                    "SUGGESTION",
                    "DATA_ISSUE"
                ]
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
        "additionalProperties": false
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
                        "type": "string",
                        "enum": [
                            "home",
                            "curriculum-planner",
                            "semester-planner",
                            "course-situation",
                            "agenda",
                            "social",
                            "academic-data"
                        ]
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
                        ]
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
        ]
    },
    "FeedbackReport": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "kind": {
                "type": "string",
                "enum": [
                    "BUG",
                    "SUGGESTION",
                    "DATA_ISSUE"
                ]
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
                "type": "string",
                "enum": [
                    "OPEN",
                    "IN_PROGRESS",
                    "CLOSED"
                ]
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
        "additionalProperties": false
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
        "additionalProperties": false
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
        "additionalProperties": false
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
        "additionalProperties": false
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
        "additionalProperties": false
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
        "additionalProperties": false
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
        "additionalProperties": false
    }
} as const

export const enumValues = {
    "BotGrantEntity.capability": [
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
    "ReplaceBotGrantBody.capabilities[]": [
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
    "PeriodPlanningEntity.studyPeriodYearPeriod": [
        "SUMMER",
        "FIRST_SEMESTER",
        "WINTER",
        "SECOND_SEMESTER"
    ],
    "PeriodPlanningEntity.visibility": [
        "PRIVATE",
        "FRIENDS",
        "PUBLIC"
    ],
    "PeriodPlanningEntity.guide.mode": [
        "CURRICULUM",
        "PROGRAM",
        "NONE"
    ],
    "PeriodPlanningEntity.guide.curriculumSource": [
        "SAVED",
        "SUGGESTION",
        null
    ],
    "PeriodPlanningEntity.classes[].classSchedules[].dayOfWeek": [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY"
    ],
    "CreatePeriodPlanningInput.guide.mode": [
        "CURRICULUM",
        "PROGRAM",
        "NONE"
    ],
    "CreatePeriodPlanningInput.guide.curriculumSource": [
        "SAVED",
        "SUGGESTION",
        null
    ],
    "UpdatePeriodPlanningInput.visibility": [
        "PRIVATE",
        "FRIENDS",
        "PUBLIC"
    ],
    "UpdatePeriodPlanningInput.guide.mode": [
        "CURRICULUM",
        "PROGRAM",
        "NONE"
    ],
    "UpdatePeriodPlanningInput.guide.curriculumSource": [
        "SAVED",
        "SUGGESTION",
        null
    ],
    "SharedPeriodPlanning.visibility": [
        "FRIENDS",
        "PUBLIC"
    ],
    "SharedPeriodPlanning.studyPeriodYearPeriod": [
        "SUMMER",
        "FIRST_SEMESTER",
        "WINTER",
        "SECOND_SEMESTER"
    ],
    "SharedPeriodPlanning.classes[].classSchedules[].dayOfWeek": [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY"
    ],
    "StudentCourseAttempt.evaluationMode": [
        "GRADE_AND_ATTENDANCE",
        "ATTENDANCE",
        "CONCEPT"
    ],
    "StudentCourseAttempt.status": [
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
    "StudentCourseAttempt.studyPeriod.yearPeriod": [
        "SUMMER",
        "FIRST_SEMESTER",
        "WINTER",
        "SECOND_SEMESTER"
    ],
    "CreateStudentCourseAttemptInput.evaluationMode": [
        "GRADE_AND_ATTENDANCE",
        "ATTENDANCE",
        "CONCEPT"
    ],
    "CreateStudentCourseAttemptInput.status": [
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
    "UpdateStudentCourseAttemptInput.evaluationMode": [
        "GRADE_AND_ATTENDANCE",
        "ATTENDANCE",
        "CONCEPT"
    ],
    "UpdateStudentCourseAttemptInput.status": [
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
    "StudentHistoryImportBody.semesters[].yearPeriod": [
        "SUMMER",
        "FIRST_SEMESTER",
        "WINTER",
        "SECOND_SEMESTER"
    ],
    "StudentHistoryImportBody.semesters[].courses[].status": [
        "APPROVED",
        "APPROVED_BY_ATTENDANCE",
        "APPROVED_BY_PROFICIENCY",
        "DROPPED",
        "FAILED_BY_ATTENDANCE",
        "SUFFICIENT"
    ],
    "StudentAbsence.studyPeriodYearPeriod": [
        "SUMMER",
        "FIRST_SEMESTER",
        "WINTER",
        "SECOND_SEMESTER"
    ],
    "StudentAbsence.dayOfWeek": [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY"
    ],
    "StudentPublicProfile.currentCoursesVisibility": [
        "PRIVATE",
        "FRIENDS",
        "PUBLIC"
    ],
    "StudentCurrentCourse.schedules[].dayOfWeek": [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY"
    ],
    "StudentFriendship.status": [
        "PENDING",
        "ACCEPTED"
    ],
    "StudentFriendship.direction": [
        "INCOMING",
        "OUTGOING",
        "NONE"
    ],
    "CreateFeedbackReportBody.kind": [
        "BUG",
        "SUGGESTION",
        "DATA_ISSUE"
    ],
    "FeedbackReportTarget.oneOf.featureKey": [
        "home",
        "curriculum-planner",
        "semester-planner",
        "course-situation",
        "agenda",
        "social",
        "academic-data"
    ],
    "FeedbackReportTarget.oneOf.academicResourceType": [
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
    "FeedbackReport.kind": [
        "BUG",
        "SUGGESTION",
        "DATA_ISSUE"
    ],
    "FeedbackReport.status": [
        "OPEN",
        "IN_PROGRESS",
        "CLOSED"
    ]
} as const

export const queryCapabilities = {
    "createCategories": {
        "parameters": [],
        "filter": null
    },
    "createExchangeNoticeSubscriptionsUnsubscribe": {
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
    "createFeedbackReports": {
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
    "createStudentCourseHistory": {
        "parameters": [],
        "filter": null
    },
    "createStudentCurricula": {
        "parameters": [],
        "filter": null
    },
    "createStudentFeedbackReports": {
        "parameters": [],
        "filter": null
    },
    "createStudentFriendships": {
        "parameters": [],
        "filter": null
    },
    "createStudentFriendshipsAccept": {
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
    "createTags": {
        "parameters": [],
        "filter": null
    },
    "deleteCategories": {
        "parameters": [],
        "filter": null
    },
    "deleteCoursesTags": {
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
    "deleteStudentFriendships": {
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
    "deleteStudentTagInterests": {
        "parameters": [],
        "filter": null
    },
    "deleteTags": {
        "parameters": [],
        "filter": null
    },
    "getCategories": {
        "parameters": [],
        "filter": null
    },
    "getSharedPeriodPlannings": {
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
    "getStudentPeople": {
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
    "getStudents": {
        "parameters": [],
        "filter": null
    },
    "getStudentSharedPeriodPlannings": {
        "parameters": [],
        "filter": null
    },
    "getTags": {
        "parameters": [],
        "filter": null
    },
    "listBots": {
        "parameters": [],
        "filter": null
    },
    "listCategories": {
        "parameters": [],
        "filter": null
    },
    "listCoursesTags": {
        "parameters": [],
        "filter": null
    },
    "listMe": {
        "parameters": [],
        "filter": null
    },
    "listMeBotGrants": {
        "parameters": [],
        "filter": null
    },
    "listSharedPeriodPlannings": {
        "parameters": [
            {
                "name": "page",
                "required": false,
                "description": null,
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "default": 1
                }
            },
            {
                "name": "pageSize",
                "required": false,
                "description": null,
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 50,
                    "default": 20
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
        }
    },
    "listStudentAbsences": {
        "parameters": [
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
        }
    },
    "listStudentClassesProfessorsEvaluation": {
        "parameters": [],
        "filter": null
    },
    "listStudentCourseAttempts": {
        "parameters": [
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
        }
    },
    "listStudentCurricula": {
        "parameters": [],
        "filter": null
    },
    "listStudentExchangeNoticeSubscription": {
        "parameters": [],
        "filter": null
    },
    "listStudentFeedbackReports": {
        "parameters": [],
        "filter": null
    },
    "listStudentFriendships": {
        "parameters": [
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
        }
    },
    "listStudentPeople": {
        "parameters": [
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
                "name": "page",
                "required": false,
                "description": null,
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "default": 1
                }
            },
            {
                "name": "pageSize",
                "required": false,
                "description": null,
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 50,
                    "default": 20
                }
            }
        ],
        "filter": null
    },
    "listStudentPeriodPlan": {
        "parameters": [],
        "filter": null
    },
    "listStudentPeriodPlannings": {
        "parameters": [],
        "filter": null
    },
    "listStudentProfessorEvaluationsPending": {
        "parameters": [
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
        }
    },
    "listStudentPublicProfile": {
        "parameters": [],
        "filter": null
    },
    "listStudentSharedPeriodPlannings": {
        "parameters": [
            {
                "name": "page",
                "required": false,
                "description": null,
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "default": 1
                }
            },
            {
                "name": "pageSize",
                "required": false,
                "description": null,
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 50,
                    "default": 20
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
        }
    },
    "listStudentTagInterests": {
        "parameters": [],
        "filter": null
    },
    "listTags": {
        "parameters": [
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
        }
    },
    "listTagsCourses": {
        "parameters": [
            {
                "name": "page",
                "required": false,
                "description": null,
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1
                }
            },
            {
                "name": "pageSize",
                "required": false,
                "description": null,
                "style": null,
                "explode": null,
                "schema": {
                    "type": "integer",
                    "minimum": 1
                }
            }
        ],
        "filter": null
    },
    "updateCategories": {
        "parameters": [],
        "filter": null
    },
    "updateCoursesTags": {
        "parameters": [],
        "filter": null
    },
    "updateMeBotGrants": {
        "parameters": [],
        "filter": null
    },
    "updateStudentClassesProfessorsEvaluation": {
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
    "updateStudentExchangeNoticeSubscription": {
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
    "updateStudentTagInterests": {
        "parameters": [],
        "filter": null
    },
    "updateTags": {
        "parameters": [],
        "filter": null
    }
} as const

export type ComponentSchemaName = keyof typeof componentSchemas
export type EnumName = keyof typeof enumValues
