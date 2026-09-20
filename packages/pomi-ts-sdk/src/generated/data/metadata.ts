export const componentSchemas = {
    "PageProfessorEvaluationSummaries": {
        "type": "object",
        "properties": {
            "data": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/ProfessorEvaluationSummary"
                }
            },
            "quantity": {
                "type": "integer"
            },
            "total": {
                "type": "integer"
            },
            "_paths": {
                "type": "object",
                "properties": {
                    "firstPage": {
                        "type": "string"
                    },
                    "lastPage": {
                        "type": "string"
                    },
                    "next": {
                        "type": "string",
                        "nullable": true
                    },
                    "prev": {
                        "type": "string",
                        "nullable": true
                    }
                },
                "required": [
                    "firstPage",
                    "lastPage",
                    "next",
                    "prev"
                ]
            }
        },
        "required": [
            "data",
            "quantity",
            "total",
            "_paths"
        ],
        "x-pomi-schema": {
            "kind": "page",
            "publicName": "PageProfessorEvaluationSummaries"
        }
    },
    "ProfessorEvaluationSummary": {
        "type": "object",
        "properties": {
            "responseCount": {
                "type": "integer",
                "minimum": 5
            },
            "wouldTakeAgain": {
                "type": "number"
            },
            "fairness": {
                "type": "number"
            },
            "clarity": {
                "type": "number"
            },
            "difficulty": {
                "type": "number"
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
                ],
                "additionalProperties": false
            }
        },
        "required": [
            "responseCount",
            "wouldTakeAgain",
            "fairness",
            "clarity",
            "difficulty",
            "professor"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "projection",
            "publicName": "ProfessorEvaluationSummary"
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
    "PageCourseEvaluationSummaries": {
        "type": "object",
        "properties": {
            "data": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/CourseEvaluationSummary"
                }
            },
            "quantity": {
                "type": "integer"
            },
            "total": {
                "type": "integer"
            },
            "_paths": {
                "type": "object",
                "properties": {
                    "firstPage": {
                        "type": "string"
                    },
                    "lastPage": {
                        "type": "string"
                    },
                    "next": {
                        "type": "string",
                        "nullable": true
                    },
                    "prev": {
                        "type": "string",
                        "nullable": true
                    }
                },
                "required": [
                    "firstPage",
                    "lastPage",
                    "next",
                    "prev"
                ]
            }
        },
        "required": [
            "data",
            "quantity",
            "total",
            "_paths"
        ],
        "x-pomi-schema": {
            "kind": "page",
            "publicName": "PageCourseEvaluationSummaries"
        }
    },
    "CourseEvaluationSummary": {
        "type": "object",
        "properties": {
            "responseCount": {
                "type": "integer",
                "minimum": 5
            },
            "wouldTakeAgain": {
                "type": "number"
            },
            "fairness": {
                "type": "number"
            },
            "clarity": {
                "type": "number"
            },
            "difficulty": {
                "type": "number"
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
                ],
                "additionalProperties": false
            }
        },
        "required": [
            "responseCount",
            "wouldTakeAgain",
            "fairness",
            "clarity",
            "difficulty",
            "course"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "projection",
            "publicName": "CourseEvaluationSummary"
        }
    },
    "CourseProfessorEvaluationSummary": {
        "type": "object",
        "properties": {
            "responseCount": {
                "type": "integer",
                "minimum": 5
            },
            "wouldTakeAgain": {
                "type": "number"
            },
            "fairness": {
                "type": "number"
            },
            "clarity": {
                "type": "number"
            },
            "difficulty": {
                "type": "number"
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
                ],
                "additionalProperties": false
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
                ],
                "additionalProperties": false
            }
        },
        "required": [
            "responseCount",
            "wouldTakeAgain",
            "fairness",
            "clarity",
            "difficulty",
            "course",
            "professor"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "projection",
            "publicName": "CourseProfessorEvaluationSummary"
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
    "UnitEntity": {
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
            "_paths": {
                "type": "object",
                "properties": {
                    "classes": {
                        "type": "string"
                    },
                    "courses": {
                        "type": "string"
                    }
                },
                "required": [
                    "classes",
                    "courses"
                ],
                "additionalProperties": false
            }
        },
        "required": [
            "id",
            "code",
            "name",
            "_paths"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "Unit",
            "identityFields": [
                "id"
            ],
            "transportFields": [
                "_paths"
            ]
        }
    },
    "CourseEntity": {
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
            },
            "prefix": {
                "type": "string",
                "minLength": 1
            },
            "unitId": {
                "type": "integer",
                "nullable": true
            },
            "unitCode": {
                "type": "string",
                "nullable": true,
                "minLength": 1
            },
            "_paths": {
                "type": "object",
                "properties": {
                    "classes": {
                        "type": "string"
                    },
                    "unit": {
                        "type": "string",
                        "nullable": true
                    },
                    "catalogCourses": {
                        "type": "string"
                    }
                },
                "required": [
                    "classes",
                    "unit",
                    "catalogCourses"
                ],
                "additionalProperties": false
            }
        },
        "required": [
            "id",
            "code",
            "name",
            "credits",
            "prefix",
            "unitId",
            "unitCode",
            "_paths"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "Course",
            "identityFields": [
                "id"
            ],
            "transportFields": [
                "_paths"
            ]
        }
    },
    "PageCourses": {
        "type": "object",
        "properties": {
            "data": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/CourseEntity"
                }
            },
            "quantity": {
                "type": "integer"
            },
            "total": {
                "type": "integer"
            },
            "_paths": {
                "type": "object",
                "properties": {
                    "firstPage": {
                        "type": "string"
                    },
                    "lastPage": {
                        "type": "string"
                    },
                    "next": {
                        "type": "string",
                        "nullable": true
                    },
                    "prev": {
                        "type": "string",
                        "nullable": true
                    }
                },
                "required": [
                    "firstPage",
                    "lastPage",
                    "next",
                    "prev"
                ]
            }
        },
        "required": [
            "data",
            "quantity",
            "total",
            "_paths"
        ],
        "x-pomi-schema": {
            "kind": "page",
            "publicName": "PageCourses",
            "transportFields": [
                "_paths"
            ]
        }
    },
    "ProfessorEntity": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "name": {
                "type": "string"
            },
            "_paths": {
                "type": "object",
                "properties": {
                    "entity": {
                        "type": "string"
                    },
                    "dataPortalProfile": {
                        "type": "string",
                        "nullable": true
                    }
                },
                "required": [
                    "entity",
                    "dataPortalProfile"
                ]
            }
        },
        "required": [
            "id",
            "name",
            "_paths"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "Professor",
            "identityFields": [
                "id"
            ],
            "transportFields": [
                "_paths"
            ]
        }
    },
    "PageProfessors": {
        "type": "object",
        "properties": {
            "data": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/ProfessorEntity"
                }
            },
            "quantity": {
                "type": "integer"
            },
            "total": {
                "type": "integer"
            },
            "_paths": {
                "type": "object",
                "properties": {
                    "firstPage": {
                        "type": "string"
                    },
                    "lastPage": {
                        "type": "string"
                    },
                    "next": {
                        "type": "string",
                        "nullable": true
                    },
                    "prev": {
                        "type": "string",
                        "nullable": true
                    }
                },
                "required": [
                    "firstPage",
                    "lastPage",
                    "next",
                    "prev"
                ]
            }
        },
        "required": [
            "data",
            "quantity",
            "total",
            "_paths"
        ],
        "x-pomi-schema": {
            "kind": "page",
            "publicName": "PageProfessors",
            "transportFields": [
                "_paths"
            ]
        }
    },
    "ProfessorDataPortalProfileSummary": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer",
                "minimum": 0,
                "exclusiveMinimum": true
            },
            "professorId": {
                "type": "integer",
                "minimum": 0,
                "exclusiveMinimum": true
            },
            "portalId": {
                "type": "integer",
                "minimum": 0,
                "exclusiveMinimum": true
            },
            "name": {
                "type": "string"
            },
            "email": {
                "type": "string",
                "nullable": true
            },
            "lattesAbstract": {
                "type": "string",
                "nullable": true
            },
            "unit": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "minimum": 0,
                        "exclusiveMinimum": true
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
                ],
                "additionalProperties": false
            },
            "department": {
                "$ref": "#/components/schemas/Department"
            },
            "position": {
                "$ref": "#/components/schemas/ProfessorPosition"
            },
            "_paths": {
                "type": "object",
                "properties": {
                    "self": {
                        "type": "string"
                    },
                    "professor": {
                        "type": "string"
                    }
                },
                "required": [
                    "self",
                    "professor"
                ],
                "additionalProperties": false
            }
        },
        "required": [
            "id",
            "professorId",
            "portalId",
            "name",
            "email",
            "lattesAbstract",
            "unit",
            "department",
            "position",
            "_paths"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "projection",
            "publicName": "ProfessorDataPortalProfileSummary",
            "transportFields": [
                "_paths"
            ]
        }
    },
    "Department": {
        "type": "object",
        "nullable": true,
        "properties": {
            "id": {
                "type": "integer",
                "minimum": 0,
                "exclusiveMinimum": true
            },
            "name": {
                "type": "string"
            },
            "unitId": {
                "type": "integer",
                "minimum": 0,
                "exclusiveMinimum": true
            }
        },
        "required": [
            "id",
            "name",
            "unitId"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "Department",
            "identityFields": [
                "id"
            ]
        }
    },
    "ProfessorPosition": {
        "type": "object",
        "nullable": true,
        "properties": {
            "id": {
                "type": "integer",
                "minimum": 0,
                "exclusiveMinimum": true
            },
            "canonicalKey": {
                "type": "string"
            },
            "role": {
                "type": "string"
            },
            "affiliationType": {
                "type": "string"
            },
            "programCode": {
                "type": "string",
                "nullable": true
            },
            "postdoctoralModality": {
                "type": "string",
                "nullable": true
            },
            "careerReference": {
                "$ref": "#/components/schemas/CareerReference"
            }
        },
        "required": [
            "id",
            "canonicalKey",
            "role",
            "affiliationType",
            "programCode",
            "postdoctoralModality",
            "careerReference"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "ProfessorPosition",
            "identityFields": [
                "id"
            ]
        }
    },
    "CareerReference": {
        "type": "object",
        "nullable": true,
        "properties": {
            "career": {
                "type": "string"
            },
            "code": {
                "type": "string"
            },
            "rank": {
                "type": "string",
                "nullable": true
            },
            "category": {
                "type": "string",
                "nullable": true
            },
            "progressionOrder": {
                "type": "integer"
            }
        },
        "required": [
            "career",
            "code",
            "rank",
            "category",
            "progressionOrder"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "CareerReference"
        }
    },
    "ProfessorDataPortalProfile": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer",
                "minimum": 0,
                "exclusiveMinimum": true
            },
            "professorId": {
                "type": "integer",
                "minimum": 0,
                "exclusiveMinimum": true
            },
            "portalId": {
                "type": "integer",
                "minimum": 0,
                "exclusiveMinimum": true
            },
            "name": {
                "type": "string"
            },
            "email": {
                "type": "string",
                "nullable": true
            },
            "lattesAbstract": {
                "type": "string",
                "nullable": true
            },
            "unit": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "minimum": 0,
                        "exclusiveMinimum": true
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
                ],
                "additionalProperties": false
            },
            "department": {
                "$ref": "#/components/schemas/Department"
            },
            "position": {
                "$ref": "#/components/schemas/ProfessorPosition"
            },
            "identifiers": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "integer",
                            "minimum": 0,
                            "exclusiveMinimum": true
                        },
                        "system": {
                            "type": "string"
                        },
                        "externalId": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "id",
                        "system",
                        "externalId"
                    ],
                    "additionalProperties": false
                }
            },
            "citationNames": {
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
            "trainings": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "integer",
                            "minimum": 0,
                            "exclusiveMinimum": true
                        },
                        "degree": {
                            "type": "string"
                        },
                        "institutionName": {
                            "type": "string"
                        },
                        "startYear": {
                            "type": "integer",
                            "nullable": true
                        },
                        "endYear": {
                            "type": "integer",
                            "nullable": true
                        }
                    },
                    "required": [
                        "id",
                        "degree",
                        "institutionName",
                        "startYear",
                        "endYear"
                    ],
                    "additionalProperties": false
                }
            },
            "keywords": {
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
                        },
                        "count": {
                            "type": "integer",
                            "nullable": true
                        }
                    },
                    "required": [
                        "id",
                        "name",
                        "count"
                    ],
                    "additionalProperties": false
                }
            },
            "coauthors": {
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
                        },
                        "count": {
                            "type": "integer",
                            "nullable": true
                        }
                    },
                    "required": [
                        "id",
                        "name",
                        "count"
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
                    "professor": {
                        "type": "string"
                    }
                },
                "required": [
                    "self",
                    "professor"
                ],
                "additionalProperties": false
            }
        },
        "required": [
            "id",
            "professorId",
            "portalId",
            "name",
            "email",
            "lattesAbstract",
            "unit",
            "department",
            "position",
            "identifiers",
            "citationNames",
            "trainings",
            "keywords",
            "coauthors",
            "_paths"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "ProfessorDataPortalProfile",
            "identityFields": [
                "id"
            ],
            "transportFields": [
                "_paths"
            ]
        }
    },
    "Keyword": {
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
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "Keyword",
            "identityFields": [
                "id"
            ]
        }
    },
    "Coauthor": {
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
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "Coauthor",
            "identityFields": [
                "id"
            ]
        }
    },
    "RoomEntity": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "code": {
                "type": "string"
            },
            "_paths": {
                "type": "object",
                "properties": {
                    "entity": {
                        "type": "string"
                    }
                },
                "required": [
                    "entity"
                ]
            }
        },
        "required": [
            "id",
            "code",
            "_paths"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "Room",
            "identityFields": [
                "id"
            ],
            "transportFields": [
                "_paths"
            ]
        }
    },
    "Catalog": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer",
                "example": 1
            },
            "year": {
                "type": "integer",
                "example": 2024
            },
            "programsCount": {
                "type": "integer",
                "example": 5
            },
            "coursesCount": {
                "type": "integer",
                "example": 8996
            },
            "studentsCount": {
                "type": "integer",
                "example": 150
            },
            "programIds": {
                "type": "array",
                "items": {
                    "type": "integer"
                },
                "example": [
                    1,
                    2,
                    3
                ]
            },
            "links": {
                "type": "object",
                "properties": {
                    "self": {
                        "type": "string",
                        "example": "/catalogs/1"
                    }
                },
                "required": [
                    "self"
                ]
            },
            "_paths": {
                "type": "object",
                "properties": {
                    "self": {
                        "type": "string"
                    },
                    "courses": {
                        "type": "string"
                    }
                },
                "required": [
                    "self",
                    "courses"
                ],
                "additionalProperties": false
            }
        },
        "required": [
            "id",
            "year",
            "programsCount",
            "coursesCount",
            "studentsCount",
            "programIds",
            "links",
            "_paths"
        ],
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "Catalog",
            "identityFields": [
                "id"
            ],
            "transportFields": [
                "_paths"
            ]
        }
    },
    "CatalogCourseEntity": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "catalogId": {
                "type": "integer"
            },
            "catalogYear": {
                "type": "integer"
            },
            "courseId": {
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
            },
            "coordinator": {
                "type": "object",
                "nullable": true,
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
            "workload": {
                "type": "object",
                "properties": {
                    "theoreticalHours": {
                        "type": "integer",
                        "nullable": true
                    },
                    "practicalHours": {
                        "type": "integer",
                        "nullable": true
                    },
                    "laboratoryHours": {
                        "type": "integer",
                        "nullable": true
                    },
                    "guidedActivityHours": {
                        "type": "integer",
                        "nullable": true
                    },
                    "distanceHours": {
                        "type": "integer",
                        "nullable": true
                    },
                    "guidedExtensionHours": {
                        "type": "integer",
                        "nullable": true
                    },
                    "practicalExtensionHours": {
                        "type": "integer",
                        "nullable": true
                    },
                    "weeks": {
                        "type": "integer",
                        "nullable": true
                    },
                    "weeklyClassHours": {
                        "type": "integer",
                        "nullable": true
                    },
                    "classroomHours": {
                        "type": "integer",
                        "nullable": true
                    }
                },
                "required": [
                    "theoreticalHours",
                    "practicalHours",
                    "laboratoryHours",
                    "guidedActivityHours",
                    "distanceHours",
                    "guidedExtensionHours",
                    "practicalExtensionHours",
                    "weeks",
                    "weeklyClassHours",
                    "classroomHours"
                ],
                "additionalProperties": false
            },
            "offeringPeriod": {
                "$ref": "#/components/schemas/CourseOfferingPeriod"
            },
            "evaluation": {
                "type": "string",
                "nullable": true
            },
            "finalExam": {
                "type": "boolean",
                "nullable": true
            },
            "minimumAttendancePercent": {
                "type": "integer",
                "nullable": true
            },
            "syllabus": {
                "type": "string",
                "nullable": true
            },
            "bibliography": {
                "type": "string",
                "nullable": true
            },
            "sourceUrl": {
                "type": "string",
                "nullable": true
            },
            "prerequisites": {
                "type": "object",
                "properties": {
                    "any": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "all": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "code": {
                                                "type": "string",
                                                "minLength": 1
                                            },
                                            "kind": {
                                                "$ref": "#/components/schemas/CourseOfferingKind"
                                            },
                                            "courseId": {
                                                "type": "integer",
                                                "nullable": true
                                            }
                                        },
                                        "required": [
                                            "code",
                                            "kind",
                                            "courseId"
                                        ],
                                        "additionalProperties": false
                                    }
                                }
                            },
                            "required": [
                                "all"
                            ],
                            "additionalProperties": false
                        }
                    }
                },
                "required": [
                    "any"
                ],
                "additionalProperties": false
            },
            "_paths": {
                "type": "object",
                "properties": {
                    "self": {
                        "type": "string"
                    },
                    "catalog": {
                        "type": "string"
                    },
                    "course": {
                        "type": "string"
                    },
                    "coordinator": {
                        "type": "string",
                        "nullable": true
                    }
                },
                "required": [
                    "self",
                    "catalog",
                    "course",
                    "coordinator"
                ],
                "additionalProperties": false
            }
        },
        "required": [
            "id",
            "catalogId",
            "catalogYear",
            "courseId",
            "code",
            "name",
            "credits",
            "coordinator",
            "workload",
            "offeringPeriod",
            "evaluation",
            "finalExam",
            "minimumAttendancePercent",
            "syllabus",
            "bibliography",
            "sourceUrl",
            "prerequisites",
            "_paths"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "CatalogCourse",
            "identityFields": [
                "id"
            ],
            "transportFields": [
                "_paths"
            ]
        }
    },
    "CourseOfferingPeriod": {
        "type": "string",
        "nullable": true,
        "enum": [
            "ALL_PERIODS",
            "ODD_PERIODS",
            "EVEN_PERIODS",
            "UNIT_DISCRETION",
            null
        ],
        "x-pomi-schema": {
            "kind": "value-object",
            "publicName": "CourseOfferingPeriod"
        }
    },
    "CourseOfferingKind": {
        "type": "string",
        "enum": [
            "FULL",
            "PARTIAL",
            "SPECIAL"
        ],
        "x-pomi-schema": {
            "kind": "value-object",
            "publicName": "CourseOfferingKind"
        }
    },
    "CoordinatorEntity": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "name": {
                "type": "string",
                "minLength": 1
            },
            "catalogCoursesCount": {
                "type": "integer"
            },
            "_paths": {
                "type": "object",
                "properties": {
                    "self": {
                        "type": "string"
                    },
                    "catalogCourses": {
                        "type": "string"
                    }
                },
                "required": [
                    "self",
                    "catalogCourses"
                ],
                "additionalProperties": false
            }
        },
        "required": [
            "id",
            "name",
            "catalogCoursesCount",
            "_paths"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "Coordinator",
            "identityFields": [
                "id"
            ],
            "transportFields": [
                "_paths"
            ]
        }
    },
    "CatalogProgramEntity": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "catalogId": {
                "type": "integer"
            },
            "programId": {
                "type": "integer"
            },
            "title": {
                "type": "string"
            },
            "catalogYear": {
                "type": "integer"
            },
            "programCode": {
                "type": "integer"
            },
            "programName": {
                "type": "string"
            },
            "base": {
                "$ref": "#/components/schemas/CourseBlockSet"
            },
            "modalities": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/CatalogProgramModality"
                }
            },
            "languages": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/CatalogProgramLanguage"
                }
            },
            "_paths": {
                "type": "object",
                "properties": {
                    "self": {
                        "type": "string"
                    },
                    "catalog": {
                        "type": "string"
                    },
                    "program": {
                        "type": "string"
                    },
                    "curriculumSuggestions": {
                        "type": "string"
                    }
                },
                "required": [
                    "self",
                    "catalog",
                    "program",
                    "curriculumSuggestions"
                ]
            }
        },
        "required": [
            "id",
            "catalogId",
            "programId",
            "title",
            "catalogYear",
            "programCode",
            "programName",
            "base",
            "modalities",
            "languages",
            "_paths"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "CatalogProgram",
            "identityFields": [
                "id"
            ],
            "transportFields": [
                "_paths"
            ],
            "relations": {
                "catalogId": {
                    "resource": "catalogs",
                    "cardinality": "one"
                },
                "programId": {
                    "resource": "programs",
                    "cardinality": "one"
                },
                "modalities": {
                    "resource": "specializations",
                    "cardinality": "many"
                },
                "languages": {
                    "resource": "languages",
                    "cardinality": "many"
                }
            }
        }
    },
    "CourseBlockSet": {
        "type": "object",
        "properties": {
            "mandatory": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/CourseRequirement"
                }
            },
            "electives": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/ElectiveBlock"
                }
            }
        },
        "required": [
            "mandatory",
            "electives"
        ],
        "x-pomi-schema": {
            "kind": "value-object",
            "publicName": "CourseBlockSet"
        }
    },
    "CourseRequirement": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "type": {
                "$ref": "#/components/schemas/CourseRequirementType"
            },
            "courseId": {
                "type": "integer",
                "nullable": true
            },
            "courseCode": {
                "type": "string",
                "nullable": true
            },
            "courseName": {
                "type": "string",
                "nullable": true
            },
            "prefix": {
                "type": "string",
                "nullable": true
            },
            "catalogCourseId": {
                "type": "integer",
                "nullable": true
            },
            "_paths": {
                "type": "object",
                "properties": {
                    "catalogCourse": {
                        "type": "string",
                        "nullable": true
                    }
                },
                "required": [
                    "catalogCourse"
                ],
                "additionalProperties": false
            }
        },
        "required": [
            "id",
            "type",
            "courseId",
            "courseCode",
            "courseName",
            "prefix",
            "catalogCourseId",
            "_paths"
        ],
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "CourseRequirement",
            "identityFields": [
                "id"
            ],
            "transportFields": [
                "_paths"
            ]
        }
    },
    "CourseRequirementType": {
        "type": "string",
        "enum": [
            "any",
            "prefix",
            "specific"
        ],
        "x-pomi-schema": {
            "kind": "value-object",
            "publicName": "CourseRequirementType"
        }
    },
    "ElectiveBlock": {
        "type": "object",
        "properties": {
            "credits": {
                "type": "integer"
            },
            "courses": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/CourseRequirement"
                }
            }
        },
        "required": [
            "credits",
            "courses"
        ],
        "x-pomi-schema": {
            "kind": "value-object",
            "publicName": "ElectiveBlock"
        }
    },
    "CatalogProgramModality": {
        "type": "object",
        "properties": {
            "specializationId": {
                "type": "integer"
            },
            "curriculumSuggestionId": {
                "type": "integer",
                "nullable": true
            },
            "code": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "blocks": {
                "$ref": "#/components/schemas/CourseBlockSet"
            }
        },
        "required": [
            "specializationId",
            "curriculumSuggestionId",
            "code",
            "name",
            "blocks"
        ],
        "x-pomi-schema": {
            "kind": "projection",
            "publicName": "CatalogProgramModality"
        }
    },
    "CatalogProgramLanguage": {
        "type": "object",
        "properties": {
            "languageId": {
                "type": "integer"
            },
            "name": {
                "type": "string"
            },
            "blocks": {
                "$ref": "#/components/schemas/CourseBlockSet"
            }
        },
        "required": [
            "languageId",
            "name",
            "blocks"
        ],
        "x-pomi-schema": {
            "kind": "projection",
            "publicName": "CatalogProgramLanguage"
        }
    },
    "CurriculumSuggestionEntity": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer",
                "minimum": 0,
                "exclusiveMinimum": true
            },
            "catalogProgramId": {
                "type": "integer",
                "minimum": 0,
                "exclusiveMinimum": true
            },
            "catalogYear": {
                "type": "integer",
                "minimum": 1900,
                "maximum": 2100
            },
            "programId": {
                "type": "integer",
                "minimum": 0,
                "exclusiveMinimum": true
            },
            "programCode": {
                "type": "integer",
                "minimum": 0,
                "exclusiveMinimum": true
            },
            "programName": {
                "type": "string",
                "minLength": 1
            },
            "code": {
                "type": "string",
                "minLength": 1
            },
            "name": {
                "type": "string",
                "minLength": 1
            },
            "type": {
                "$ref": "#/components/schemas/CurriculumSuggestionType"
            },
            "specialization": {
                "type": "object",
                "nullable": true,
                "properties": {
                    "id": {
                        "type": "integer",
                        "minimum": 0,
                        "exclusiveMinimum": true
                    },
                    "code": {
                        "type": "string",
                        "minLength": 1
                    },
                    "name": {
                        "type": "string",
                        "minLength": 1
                    }
                },
                "required": [
                    "id",
                    "code",
                    "name"
                ],
                "additionalProperties": false
            },
            "semesters": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/SemesterSuggestionEntity"
                }
            },
            "_paths": {
                "type": "object",
                "properties": {
                    "self": {
                        "type": "string",
                        "minLength": 1
                    },
                    "catalogProgram": {
                        "type": "string",
                        "minLength": 1
                    },
                    "specialization": {
                        "type": "string",
                        "nullable": true,
                        "minLength": 1
                    }
                },
                "required": [
                    "self",
                    "catalogProgram",
                    "specialization"
                ],
                "additionalProperties": false
            }
        },
        "required": [
            "id",
            "catalogProgramId",
            "catalogYear",
            "programId",
            "programCode",
            "programName",
            "code",
            "name",
            "type",
            "specialization",
            "semesters",
            "_paths"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "CurriculumSuggestion",
            "identityFields": [
                "id"
            ],
            "transportFields": [
                "_paths"
            ]
        }
    },
    "CurriculumSuggestionType": {
        "type": "string",
        "enum": [
            "GENERAL",
            "SPECIALIZATION",
            "PRE_OPTION"
        ],
        "x-pomi-schema": {
            "kind": "value-object",
            "publicName": "CurriculumSuggestionType"
        }
    },
    "SemesterSuggestionEntity": {
        "type": "object",
        "properties": {
            "semester": {
                "type": "integer",
                "minimum": 0,
                "exclusiveMinimum": true
            },
            "electiveCredits": {
                "type": "integer",
                "minimum": 0
            },
            "courses": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/CurriculumSuggestionCourseEntity"
                }
            }
        },
        "required": [
            "semester",
            "electiveCredits",
            "courses"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "SemesterSuggestion"
        }
    },
    "CurriculumSuggestionCourseEntity": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer",
                "minimum": 0,
                "exclusiveMinimum": true
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
            "publicName": "CurriculumSuggestionCourse",
            "identityFields": [
                "id"
            ]
        }
    },
    "Language": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "name": {
                "type": "string"
            },
            "catalogLanguagesCount": {
                "type": "integer"
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
                ]
            }
        },
        "required": [
            "id",
            "name",
            "catalogLanguagesCount",
            "_paths"
        ],
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "Language",
            "identityFields": [
                "id"
            ],
            "transportFields": [
                "_paths"
            ]
        }
    },
    "Program": {
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
            },
            "unitId": {
                "type": "integer"
            },
            "unit": {
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
            "catalogProgramsCount": {
                "type": "integer"
            },
            "studentsCount": {
                "type": "integer"
            },
            "_paths": {
                "type": "object",
                "properties": {
                    "self": {
                        "type": "string"
                    },
                    "unit": {
                        "type": "string"
                    }
                },
                "required": [
                    "self",
                    "unit"
                ]
            }
        },
        "required": [
            "id",
            "code",
            "name",
            "unitId",
            "unit",
            "catalogProgramsCount",
            "studentsCount",
            "_paths"
        ],
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "Program",
            "identityFields": [
                "id"
            ],
            "transportFields": [
                "_paths"
            ]
        }
    },
    "Specialization": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer",
                "minimum": 0,
                "exclusiveMinimum": true
            },
            "programId": {
                "type": "integer",
                "minimum": 0,
                "exclusiveMinimum": true
            },
            "programCode": {
                "type": "integer",
                "minimum": 0,
                "exclusiveMinimum": true
            },
            "programName": {
                "type": "string",
                "minLength": 1
            },
            "code": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "catalogSpecializationsCount": {
                "type": "integer"
            },
            "studentsCount": {
                "type": "integer"
            },
            "_paths": {
                "type": "object",
                "properties": {
                    "self": {
                        "type": "string"
                    },
                    "program": {
                        "type": "string"
                    }
                },
                "required": [
                    "self",
                    "program"
                ]
            }
        },
        "required": [
            "id",
            "programId",
            "programCode",
            "programName",
            "code",
            "name",
            "catalogSpecializationsCount",
            "studentsCount",
            "_paths"
        ],
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "Specialization",
            "identityFields": [
                "id"
            ],
            "transportFields": [
                "_paths"
            ]
        }
    },
    "ExchangeNotice": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer",
                "minimum": 0,
                "exclusiveMinimum": true
            },
            "number": {
                "type": "string",
                "nullable": true
            },
            "issuer": {
                "type": "string",
                "nullable": true
            },
            "title": {
                "type": "string",
                "nullable": true
            },
            "place": {
                "$ref": "#/components/schemas/ExchangePlace"
            },
            "registrationOriginalText": {
                "type": "string",
                "nullable": true
            },
            "registrationStart": {
                "type": "string",
                "nullable": true,
                "format": "date"
            },
            "registrationEnd": {
                "type": "string",
                "nullable": true,
                "format": "date"
            },
            "files": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/ExchangeNoticeFile"
                }
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
            "id",
            "number",
            "issuer",
            "title",
            "place",
            "registrationOriginalText",
            "registrationStart",
            "registrationEnd",
            "files",
            "_paths"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "ExchangeNotice",
            "identityFields": [
                "id"
            ],
            "transportFields": [
                "_paths"
            ]
        }
    },
    "ExchangePlace": {
        "type": "object",
        "nullable": true,
        "properties": {
            "id": {
                "type": "integer",
                "minimum": 0,
                "exclusiveMinimum": true
            },
            "name": {
                "type": "string"
            },
            "_paths": {
                "type": "object",
                "properties": {
                    "notices": {
                        "type": "string"
                    }
                },
                "required": [
                    "notices"
                ],
                "additionalProperties": false
            }
        },
        "required": [
            "id",
            "name",
            "_paths"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "ExchangePlace",
            "identityFields": [
                "id"
            ],
            "transportFields": [
                "_paths"
            ]
        }
    },
    "ExchangeNoticeFile": {
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
            "url": {
                "type": "string",
                "nullable": true,
                "format": "uri"
            }
        },
        "required": [
            "id",
            "name",
            "url"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "ExchangeNoticeFile",
            "identityFields": [
                "id"
            ]
        }
    },
    "ExchangePlaceListItem": {
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
            "_paths": {
                "type": "object",
                "properties": {
                    "notices": {
                        "type": "string"
                    }
                },
                "required": [
                    "notices"
                ],
                "additionalProperties": false
            }
        },
        "required": [
            "id",
            "name",
            "_paths"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "projection",
            "publicName": "ExchangePlaceListItem",
            "transportFields": [
                "_paths"
            ]
        }
    },
    "CalendarEvent": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "startDate": {
                "anyOf": [
                    {
                        "type": "string"
                    },
                    {
                        "type": "string",
                        "format": "date-time"
                    }
                ]
            },
            "endDate": {
                "anyOf": [
                    {
                        "type": "string"
                    },
                    {
                        "type": "string",
                        "format": "date-time"
                    },
                    {
                        "nullable": true
                    }
                ]
            },
            "description": {
                "type": "string"
            },
            "tags": {
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
            "_paths": {
                "type": "object",
                "properties": {
                    "entity": {
                        "type": "string"
                    }
                },
                "required": [
                    "entity"
                ]
            }
        },
        "required": [
            "id",
            "startDate",
            "endDate",
            "description",
            "tags",
            "_paths"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "CalendarEvent",
            "identityFields": [
                "id"
            ],
            "transportFields": [
                "_paths"
            ]
        }
    },
    "CalendarTag": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "name": {
                "type": "string"
            },
            "_paths": {
                "type": "object",
                "properties": {
                    "entity": {
                        "type": "string"
                    }
                },
                "required": [
                    "entity"
                ]
            }
        },
        "required": [
            "id",
            "name",
            "_paths"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "CalendarTag",
            "identityFields": [
                "id"
            ],
            "transportFields": [
                "_paths"
            ]
        }
    },
    "ClassEntity": {
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
            "studyPeriodId": {
                "type": "integer"
            },
            "professorIds": {
                "type": "array",
                "items": {
                    "type": "integer"
                }
            },
            "studyPeriodYear": {
                "type": "integer"
            },
            "studyPeriodYearPeriod": {
                "$ref": "#/components/schemas/YearPeriod"
            },
            "courseCode": {
                "type": "string"
            },
            "unitId": {
                "type": "integer",
                "nullable": true
            },
            "unitCode": {
                "type": "string",
                "nullable": true
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
            "_paths": {
                "type": "object",
                "properties": {
                    "studyPeriod": {
                        "type": "string"
                    },
                    "unit": {
                        "type": "string",
                        "nullable": true
                    },
                    "course": {
                        "type": "string"
                    },
                    "class": {
                        "type": "string"
                    },
                    "classSchedules": {
                        "type": "string"
                    },
                    "professors": {
                        "type": "string"
                    }
                },
                "required": [
                    "studyPeriod",
                    "unit",
                    "course",
                    "class",
                    "classSchedules",
                    "professors"
                ],
                "additionalProperties": false
            }
        },
        "required": [
            "id",
            "code",
            "reservations",
            "courseId",
            "studyPeriodId",
            "professorIds",
            "studyPeriodYear",
            "studyPeriodYearPeriod",
            "courseCode",
            "unitId",
            "unitCode",
            "professors",
            "_paths"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "Class",
            "identityFields": [
                "id"
            ],
            "transportFields": [
                "_paths"
            ]
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
    "ClassScheduleEntity": {
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
            "classId": {
                "type": "integer"
            },
            "roomCode": {
                "type": "string"
            },
            "classCode": {
                "type": "string"
            },
            "unitId": {
                "type": "integer",
                "nullable": true
            },
            "unitCode": {
                "type": "string",
                "nullable": true
            },
            "courseId": {
                "type": "integer"
            },
            "courseCode": {
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
            "_paths": {
                "type": "object",
                "properties": {
                    "entity": {
                        "type": "string"
                    },
                    "studyPeriod": {
                        "type": "string"
                    },
                    "unit": {
                        "type": "string",
                        "nullable": true
                    },
                    "course": {
                        "type": "string"
                    },
                    "class": {
                        "type": "string"
                    }
                },
                "required": [
                    "entity",
                    "studyPeriod",
                    "unit",
                    "course",
                    "class"
                ],
                "additionalProperties": false
            }
        },
        "required": [
            "id",
            "dayOfWeek",
            "start",
            "end",
            "roomId",
            "classId",
            "roomCode",
            "classCode",
            "unitId",
            "unitCode",
            "courseId",
            "courseCode",
            "studyPeriodId",
            "studyPeriodYear",
            "studyPeriodYearPeriod",
            "_paths"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "ClassSchedule",
            "identityFields": [
                "id"
            ],
            "transportFields": [
                "_paths"
            ],
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
    "PageClassSchedules": {
        "type": "object",
        "properties": {
            "data": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/ClassScheduleEntity"
                }
            },
            "quantity": {
                "type": "integer"
            },
            "total": {
                "type": "integer"
            },
            "_paths": {
                "type": "object",
                "properties": {
                    "firstPage": {
                        "type": "string"
                    },
                    "lastPage": {
                        "type": "string"
                    },
                    "next": {
                        "type": "string",
                        "nullable": true
                    },
                    "prev": {
                        "type": "string",
                        "nullable": true
                    }
                },
                "required": [
                    "firstPage",
                    "lastPage",
                    "next",
                    "prev"
                ]
            }
        },
        "required": [
            "data",
            "quantity",
            "total",
            "_paths"
        ],
        "x-pomi-schema": {
            "kind": "page",
            "publicName": "PageClassSchedules",
            "transportFields": [
                "_paths"
            ]
        }
    },
    "DailyMenu": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer",
                "minimum": 0,
                "exclusiveMinimum": true
            },
            "date": {
                "type": "string",
                "format": "date"
            },
            "meals": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/Meal"
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
                    }
                },
                "required": [
                    "self"
                ],
                "additionalProperties": false
            }
        },
        "required": [
            "id",
            "date",
            "meals",
            "createdAt",
            "updatedAt",
            "_paths"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "DailyMenu",
            "identityFields": [
                "id"
            ],
            "transportFields": [
                "_paths"
            ]
        }
    },
    "Meal": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer",
                "minimum": 0,
                "exclusiveMinimum": true
            },
            "period": {
                "$ref": "#/components/schemas/MealPeriod"
            },
            "diet": {
                "$ref": "#/components/schemas/MealDiet"
            },
            "status": {
                "$ref": "#/components/schemas/MealStatus"
            },
            "mainDish": {
                "type": "string",
                "nullable": true
            },
            "items": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "observations": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "serviceNotes": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            }
        },
        "required": [
            "id",
            "period",
            "diet",
            "status",
            "mainDish",
            "items",
            "observations",
            "serviceNotes"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "Meal",
            "identityFields": [
                "id"
            ]
        }
    },
    "MealPeriod": {
        "type": "string",
        "enum": [
            "LUNCH",
            "DINNER"
        ],
        "x-pomi-schema": {
            "kind": "value-object",
            "publicName": "MealPeriod"
        }
    },
    "MealDiet": {
        "type": "string",
        "enum": [
            "TRADITIONAL",
            "VEGAN"
        ],
        "x-pomi-schema": {
            "kind": "value-object",
            "publicName": "MealDiet"
        }
    },
    "MealStatus": {
        "type": "string",
        "enum": [
            "AVAILABLE",
            "NOT_REGISTERED"
        ],
        "x-pomi-schema": {
            "kind": "value-object",
            "publicName": "MealStatus"
        }
    },
    "StudyPeriodEntity": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "year": {
                "type": "integer"
            },
            "yearPeriod": {
                "$ref": "#/components/schemas/YearPeriod"
            },
            "startDate": {
                "anyOf": [
                    {
                        "type": "string"
                    },
                    {
                        "type": "string",
                        "format": "date-time"
                    }
                ]
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
            "year",
            "yearPeriod",
            "startDate",
            "_paths"
        ],
        "additionalProperties": false,
        "x-pomi-schema": {
            "kind": "entity",
            "publicName": "StudyPeriod",
            "identityFields": [
                "id"
            ],
            "transportFields": [
                "_paths"
            ]
        }
    }
} as const

export const enumValues = {
    "CourseOfferingPeriod": [
        "ALL_PERIODS",
        "ODD_PERIODS",
        "EVEN_PERIODS",
        "UNIT_DISCRETION",
        null
    ],
    "CourseOfferingKind": [
        "FULL",
        "PARTIAL",
        "SPECIAL"
    ],
    "CourseRequirementType": [
        "any",
        "prefix",
        "specific"
    ],
    "CurriculumSuggestionType": [
        "GENERAL",
        "SPECIALIZATION",
        "PRE_OPTION"
    ],
    "YearPeriod": [
        "SUMMER",
        "FIRST_SEMESTER",
        "WINTER",
        "SECOND_SEMESTER"
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
    "MealPeriod": [
        "LUNCH",
        "DINNER"
    ],
    "MealDiet": [
        "TRADITIONAL",
        "VEGAN"
    ],
    "MealStatus": [
        "AVAILABLE",
        "NOT_REGISTERED"
    ]
} as const

export const queryCapabilities = {
    "getCalendarEvents": {
        "parameters": [],
        "filter": null
    },
    "getCalendarFeed": {
        "parameters": [
            {
                "name": "filter",
                "required": false,
                "description": "Structured calendar feed filters. Use bracket notation such as filter[tagId]=1.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "startDate": {
                            "oneOf": [
                                {
                                    "format": "date-time",
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "format": "date-time",
                                            "type": "string"
                                        },
                                        "in": {
                                            "items": {
                                                "format": "date-time",
                                                "type": "string"
                                            },
                                            "type": "array"
                                        }
                                    },
                                    "type": "object"
                                }
                            ]
                        },
                        "endDate": {
                            "oneOf": [
                                {
                                    "format": "date-time",
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "format": "date-time",
                                            "type": "string"
                                        },
                                        "in": {
                                            "items": {
                                                "format": "date-time",
                                                "type": "string"
                                            },
                                            "type": "array"
                                        }
                                    },
                                    "type": "object"
                                }
                            ]
                        },
                        "tagId": {
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
                        "startDate"
                    ],
                    "schema": {
                        "format": "date-time",
                        "type": "string"
                    },
                    "operators": [
                        "eq",
                        "in"
                    ]
                },
                {
                    "path": [
                        "endDate"
                    ],
                    "schema": {
                        "format": "date-time",
                        "type": "string"
                    },
                    "operators": [
                        "eq",
                        "in"
                    ]
                },
                {
                    "path": [
                        "tagId"
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
    "getCalendarTags": {
        "parameters": [],
        "filter": null
    },
    "getCatalogCourses": {
        "parameters": [],
        "filter": null
    },
    "getCatalogPrograms": {
        "parameters": [],
        "filter": null
    },
    "getCatalogs": {
        "parameters": [],
        "filter": null
    },
    "getClasses": {
        "parameters": [],
        "filter": null
    },
    "getClassSchedules": {
        "parameters": [],
        "filter": null
    },
    "getCoauthors": {
        "parameters": [],
        "filter": null
    },
    "getCoordinators": {
        "parameters": [],
        "filter": null
    },
    "getCourseProfessorEvaluationSummary": {
        "parameters": [
            {
                "name": "filter",
                "required": true,
                "description": "Structured evaluation summary filters. Use filter[courseId]=1&filter[professorId]=2.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
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
                        },
                        "professorId": {
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
                },
                {
                    "path": [
                        "professorId"
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
    "getCourses": {
        "parameters": [],
        "filter": null
    },
    "getCurriculumSuggestions": {
        "parameters": [],
        "filter": null
    },
    "getDailyMenus": {
        "parameters": [],
        "filter": null
    },
    "getDepartments": {
        "parameters": [],
        "filter": null
    },
    "getExchangeNotices": {
        "parameters": [],
        "filter": null
    },
    "getKeywords": {
        "parameters": [],
        "filter": null
    },
    "getLanguages": {
        "parameters": [],
        "filter": null
    },
    "getProfessorDataPortalProfiles": {
        "parameters": [],
        "filter": null
    },
    "getProfessorPositions": {
        "parameters": [],
        "filter": null
    },
    "getProfessors": {
        "parameters": [],
        "filter": null
    },
    "getPrograms": {
        "parameters": [],
        "filter": null
    },
    "getRooms": {
        "parameters": [],
        "filter": null
    },
    "getSpecializations": {
        "parameters": [],
        "filter": null
    },
    "getStudyPeriods": {
        "parameters": [],
        "filter": null
    },
    "getUnits": {
        "parameters": [],
        "filter": null
    },
    "listCalendarEvents": {
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
                "description": "Structured calendar event filters. Use bracket notation such as filter[tagId]=1.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "startDate": {
                            "oneOf": [
                                {
                                    "format": "date-time",
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "format": "date-time",
                                            "type": "string"
                                        },
                                        "in": {
                                            "items": {
                                                "format": "date-time",
                                                "type": "string"
                                            },
                                            "type": "array"
                                        }
                                    },
                                    "type": "object"
                                }
                            ]
                        },
                        "endDate": {
                            "oneOf": [
                                {
                                    "format": "date-time",
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "format": "date-time",
                                            "type": "string"
                                        },
                                        "in": {
                                            "items": {
                                                "format": "date-time",
                                                "type": "string"
                                            },
                                            "type": "array"
                                        }
                                    },
                                    "type": "object"
                                }
                            ]
                        },
                        "tagId": {
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
                    "example": "startDate:asc,endDate:asc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "startDate"
                    ],
                    "schema": {
                        "format": "date-time",
                        "type": "string"
                    },
                    "operators": [
                        "eq",
                        "in"
                    ]
                },
                {
                    "path": [
                        "endDate"
                    ],
                    "schema": {
                        "format": "date-time",
                        "type": "string"
                    },
                    "operators": [
                        "eq",
                        "in"
                    ]
                },
                {
                    "path": [
                        "tagId"
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
                "startDate",
                "endDate",
                "description"
            ],
            "default": "startDate:asc,endDate:asc"
        }
    },
    "listCalendarTags": {
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
                "description": "Structured calendar tag filters. Use bracket notation such as filter[name]=feriado.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "id": {
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
                        "name": {
                            "oneOf": [
                                {
                                    "minLength": 1,
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "minLength": 1,
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
                    "example": "name:asc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "id"
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
                        "name"
                    ],
                    "schema": {
                        "minLength": 1,
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
                "name"
            ],
            "default": "name:asc"
        }
    },
    "listCatalogCourses": {
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
                "description": "Structured catalog course filters. Use bracket notation such as filter[unit][code]=IC.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "catalogId": {
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
                        "catalogYear": {
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
                        "courseCode": {
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "type": "string"
                                        },
                                        "ne": {
                                            "type": "string"
                                        },
                                        "in": {
                                            "items": {
                                                "type": "string"
                                            },
                                            "type": "array"
                                        }
                                    },
                                    "type": "object"
                                }
                            ]
                        },
                        "unit": {
                            "additionalProperties": false,
                            "properties": {
                                "id": {
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
                                "code": {
                                    "oneOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "additionalProperties": false,
                                            "properties": {
                                                "eq": {
                                                    "type": "string"
                                                },
                                                "in": {
                                                    "items": {
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
                        },
                        "coordinatorId": {
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
                        "offeringPeriod": {
                            "oneOf": [
                                {
                                    "enum": [
                                        "ALL_PERIODS",
                                        "ODD_PERIODS",
                                        "EVEN_PERIODS",
                                        "UNIT_DISCRETION"
                                    ],
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "enum": [
                                                "ALL_PERIODS",
                                                "ODD_PERIODS",
                                                "EVEN_PERIODS",
                                                "UNIT_DISCRETION"
                                            ],
                                            "type": "string"
                                        },
                                        "in": {
                                            "items": {
                                                "enum": [
                                                    "ALL_PERIODS",
                                                    "ODD_PERIODS",
                                                    "EVEN_PERIODS",
                                                    "UNIT_DISCRETION"
                                                ],
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
                    "example": "catalogYear:desc,code:asc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "catalogId"
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
                        "catalogYear"
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
                        "courseCode"
                    ],
                    "schema": {
                        "type": "string"
                    },
                    "operators": [
                        "eq",
                        "ne",
                        "in"
                    ]
                },
                {
                    "path": [
                        "unit",
                        "id"
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
                        "unit",
                        "code"
                    ],
                    "schema": {
                        "type": "string"
                    },
                    "operators": [
                        "eq",
                        "in"
                    ]
                },
                {
                    "path": [
                        "coordinatorId"
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
                        "offeringPeriod"
                    ],
                    "schema": {
                        "enum": [
                            "ALL_PERIODS",
                            "ODD_PERIODS",
                            "EVEN_PERIODS",
                            "UNIT_DISCRETION"
                        ],
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
                "catalogYear",
                "code",
                "name",
                "credits"
            ],
            "default": "catalogYear:desc,code:asc"
        }
    },
    "listCatalogPrograms": {
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
                "description": "Structured catalog program filters. Use bracket notation such as filter[catalogYear]=2025.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "catalogId": {
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
                        "catalogYear": {
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
                        "programId": {
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
                        "programCode": {
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
                    "example": "id:asc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "catalogId"
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
                        "catalogYear"
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
                        "programId"
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
                        "programCode"
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
                "id",
                "catalogYear",
                "programCode",
                "programName",
                "title"
            ],
            "default": "id:asc"
        }
    },
    "listCatalogs": {
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
                "description": "Structured catalog filters. Use bracket notation such as filter[year]=2025.",
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
                    "example": "year:desc"
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
                "year"
            ],
            "default": "year:desc"
        }
    },
    "listClasses": {
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
                "name": "filter",
                "required": false,
                "description": "Structured class filters. Use bracket notation such as filter[courseCode]=MC102.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "classCode": {
                            "oneOf": [
                                {
                                    "minLength": 1,
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "minLength": 1,
                                            "type": "string"
                                        }
                                    },
                                    "type": "object"
                                }
                            ]
                        },
                        "unitId": {
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
                        "unitCode": {
                            "oneOf": [
                                {
                                    "minLength": 1,
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "minLength": 1,
                                            "type": "string"
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
                        "courseCode": {
                            "oneOf": [
                                {
                                    "minLength": 1,
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "minLength": 1,
                                            "type": "string"
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
                        },
                        "studyPeriodYear": {
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
                        "studyPeriodYearPeriod": {
                            "oneOf": [
                                {
                                    "enum": [
                                        "SUMMER",
                                        "FIRST_SEMESTER",
                                        "WINTER",
                                        "SECOND_SEMESTER"
                                    ],
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "enum": [
                                                "SUMMER",
                                                "FIRST_SEMESTER",
                                                "WINTER",
                                                "SECOND_SEMESTER"
                                            ],
                                            "type": "string"
                                        },
                                        "in": {
                                            "items": {
                                                "enum": [
                                                    "SUMMER",
                                                    "FIRST_SEMESTER",
                                                    "WINTER",
                                                    "SECOND_SEMESTER"
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
                        "professorId": {
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
                        "professorName": {
                            "oneOf": [
                                {
                                    "minLength": 1,
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "minLength": 1,
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
                    "example": "id:asc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "classCode"
                    ],
                    "schema": {
                        "minLength": 1,
                        "type": "string"
                    },
                    "operators": [
                        "eq"
                    ]
                },
                {
                    "path": [
                        "unitId"
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
                        "unitCode"
                    ],
                    "schema": {
                        "minLength": 1,
                        "type": "string"
                    },
                    "operators": [
                        "eq"
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
                        "courseCode"
                    ],
                    "schema": {
                        "minLength": 1,
                        "type": "string"
                    },
                    "operators": [
                        "eq"
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
                },
                {
                    "path": [
                        "studyPeriodYear"
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
                        "studyPeriodYearPeriod"
                    ],
                    "schema": {
                        "enum": [
                            "SUMMER",
                            "FIRST_SEMESTER",
                            "WINTER",
                            "SECOND_SEMESTER"
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
                        "professorId"
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
                        "professorName"
                    ],
                    "schema": {
                        "minLength": 1,
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
                "id",
                "classCode",
                "courseCode",
                "studyPeriodYear"
            ],
            "default": "id:asc"
        }
    },
    "listClassSchedules": {
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
                "name": "filter",
                "required": false,
                "description": "Structured class schedule filters. Use bracket notation such as filter[course][code]=MC102.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "dayOfWeek": {
                            "oneOf": [
                                {
                                    "enum": [
                                        "MONDAY",
                                        "TUESDAY",
                                        "WEDNESDAY",
                                        "THURSDAY",
                                        "FRIDAY",
                                        "SATURDAY",
                                        "SUNDAY"
                                    ],
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "enum": [
                                                "MONDAY",
                                                "TUESDAY",
                                                "WEDNESDAY",
                                                "THURSDAY",
                                                "FRIDAY",
                                                "SATURDAY",
                                                "SUNDAY"
                                            ],
                                            "type": "string"
                                        },
                                        "in": {
                                            "items": {
                                                "enum": [
                                                    "MONDAY",
                                                    "TUESDAY",
                                                    "WEDNESDAY",
                                                    "THURSDAY",
                                                    "FRIDAY",
                                                    "SATURDAY",
                                                    "SUNDAY"
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
                        "room": {
                            "additionalProperties": false,
                            "properties": {
                                "id": {
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
                                "code": {
                                    "oneOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "additionalProperties": false,
                                            "properties": {
                                                "eq": {
                                                    "type": "string"
                                                },
                                                "in": {
                                                    "items": {
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
                        },
                        "class": {
                            "additionalProperties": false,
                            "properties": {
                                "id": {
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
                        },
                        "course": {
                            "additionalProperties": false,
                            "properties": {
                                "id": {
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
                                "code": {
                                    "oneOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "additionalProperties": false,
                                            "properties": {
                                                "eq": {
                                                    "type": "string"
                                                },
                                                "in": {
                                                    "items": {
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
                        },
                        "unit": {
                            "additionalProperties": false,
                            "properties": {
                                "id": {
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
                                "code": {
                                    "oneOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "additionalProperties": false,
                                            "properties": {
                                                "eq": {
                                                    "type": "string"
                                                },
                                                "in": {
                                                    "items": {
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
                        },
                        "studyPeriod": {
                            "additionalProperties": false,
                            "properties": {
                                "id": {
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
                                "yearPeriod": {
                                    "oneOf": [
                                        {
                                            "enum": [
                                                "SUMMER",
                                                "FIRST_SEMESTER",
                                                "WINTER",
                                                "SECOND_SEMESTER"
                                            ],
                                            "type": "string"
                                        },
                                        {
                                            "additionalProperties": false,
                                            "properties": {
                                                "eq": {
                                                    "enum": [
                                                        "SUMMER",
                                                        "FIRST_SEMESTER",
                                                        "WINTER",
                                                        "SECOND_SEMESTER"
                                                    ],
                                                    "type": "string"
                                                },
                                                "in": {
                                                    "items": {
                                                        "enum": [
                                                            "SUMMER",
                                                            "FIRST_SEMESTER",
                                                            "WINTER",
                                                            "SECOND_SEMESTER"
                                                        ],
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
                    "example": "id:asc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "dayOfWeek"
                    ],
                    "schema": {
                        "enum": [
                            "MONDAY",
                            "TUESDAY",
                            "WEDNESDAY",
                            "THURSDAY",
                            "FRIDAY",
                            "SATURDAY",
                            "SUNDAY"
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
                        "room",
                        "id"
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
                        "room",
                        "code"
                    ],
                    "schema": {
                        "type": "string"
                    },
                    "operators": [
                        "eq",
                        "in"
                    ]
                },
                {
                    "path": [
                        "class",
                        "id"
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
                        "course",
                        "id"
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
                        "course",
                        "code"
                    ],
                    "schema": {
                        "type": "string"
                    },
                    "operators": [
                        "eq",
                        "in"
                    ]
                },
                {
                    "path": [
                        "unit",
                        "id"
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
                        "unit",
                        "code"
                    ],
                    "schema": {
                        "type": "string"
                    },
                    "operators": [
                        "eq",
                        "in"
                    ]
                },
                {
                    "path": [
                        "studyPeriod",
                        "id"
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
                        "studyPeriod",
                        "year"
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
                        "studyPeriod",
                        "yearPeriod"
                    ],
                    "schema": {
                        "enum": [
                            "SUMMER",
                            "FIRST_SEMESTER",
                            "WINTER",
                            "SECOND_SEMESTER"
                        ],
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
                "id",
                "dayOfWeek",
                "start",
                "end",
                "roomCode",
                "classCode",
                "courseCode",
                "studyPeriodYear"
            ],
            "default": "id:asc"
        }
    },
    "listCoauthors": {
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
                "name": "filter",
                "required": false,
                "description": "Structured name filters. Use bracket notation such as filter[name]=Ada.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "name": {
                            "oneOf": [
                                {
                                    "minLength": 1,
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "minLength": 1,
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
                    "example": "name:asc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "name"
                    ],
                    "schema": {
                        "minLength": 1,
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
                "name"
            ],
            "default": "name:asc"
        }
    },
    "listCoordinators": {
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
                "description": "Structured coordinator filters. Use bracket notation such as filter[name]=Ada.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "name": {
                            "oneOf": [
                                {
                                    "minLength": 1,
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "minLength": 1,
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
                    "example": "name:asc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "name"
                    ],
                    "schema": {
                        "minLength": 1,
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
                "name"
            ],
            "default": "name:asc"
        }
    },
    "listCourseEvaluationSummaries": {
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
                "name": "filter",
                "required": false,
                "description": "Structured course summary filters. Use filter[courseCode]=MC102.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
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
                        },
                        "courseCode": {
                            "oneOf": [
                                {
                                    "minLength": 1,
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "minLength": 1,
                                            "type": "string"
                                        },
                                        "ne": {
                                            "minLength": 1,
                                            "type": "string"
                                        },
                                        "in": {
                                            "items": {
                                                "minLength": 1,
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
                    "example": "course.code:asc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
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
                },
                {
                    "path": [
                        "courseCode"
                    ],
                    "schema": {
                        "minLength": 1,
                        "type": "string"
                    },
                    "operators": [
                        "eq",
                        "ne",
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
                "course.code",
                "course.name",
                "responseCount",
                "wouldTakeAgain",
                "fairness",
                "clarity",
                "difficulty"
            ],
            "default": "course.code:asc"
        }
    },
    "listCourses": {
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
                            "minimum": 1,
                            "maximum": 1000
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
                "description": "Structured course filters. Use bracket notation such as filter[credits][gte]=4.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "catalogYear": {
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
                        "code": {
                            "oneOf": [
                                {
                                    "minLength": 1,
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "minLength": 1,
                                            "type": "string"
                                        },
                                        "ne": {
                                            "minLength": 1,
                                            "type": "string"
                                        },
                                        "in": {
                                            "items": {
                                                "minLength": 1,
                                                "type": "string"
                                            },
                                            "type": "array"
                                        }
                                    },
                                    "type": "object"
                                }
                            ]
                        },
                        "credits": {
                            "oneOf": [
                                {
                                    "minimum": 0,
                                    "type": "integer"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "minimum": 0,
                                            "type": "integer"
                                        },
                                        "ne": {
                                            "minimum": 0,
                                            "type": "integer"
                                        },
                                        "gt": {
                                            "minimum": 0,
                                            "type": "integer"
                                        },
                                        "gte": {
                                            "minimum": 0,
                                            "type": "integer"
                                        },
                                        "lt": {
                                            "minimum": 0,
                                            "type": "integer"
                                        },
                                        "lte": {
                                            "minimum": 0,
                                            "type": "integer"
                                        },
                                        "in": {
                                            "items": {
                                                "minimum": 0,
                                                "type": "integer"
                                            },
                                            "type": "array"
                                        }
                                    },
                                    "type": "object"
                                }
                            ]
                        },
                        "tagId": {
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
                        "unit": {
                            "additionalProperties": false,
                            "properties": {
                                "code": {
                                    "oneOf": [
                                        {
                                            "minLength": 1,
                                            "type": "string"
                                        },
                                        {
                                            "additionalProperties": false,
                                            "properties": {
                                                "eq": {
                                                    "minLength": 1,
                                                    "type": "string"
                                                },
                                                "in": {
                                                    "items": {
                                                        "minLength": 1,
                                                        "type": "string"
                                                    },
                                                    "type": "array"
                                                }
                                            },
                                            "type": "object"
                                        }
                                    ]
                                },
                                "id": {
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
                    "example": "code:asc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "catalogYear"
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
                        "code"
                    ],
                    "schema": {
                        "minLength": 1,
                        "type": "string"
                    },
                    "operators": [
                        "eq",
                        "ne",
                        "in"
                    ]
                },
                {
                    "path": [
                        "credits"
                    ],
                    "schema": {
                        "minimum": 0,
                        "type": "integer"
                    },
                    "operators": [
                        "eq",
                        "ne",
                        "gt",
                        "gte",
                        "lt",
                        "lte",
                        "in"
                    ]
                },
                {
                    "path": [
                        "tagId"
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
                        "unit",
                        "code"
                    ],
                    "schema": {
                        "minLength": 1,
                        "type": "string"
                    },
                    "operators": [
                        "eq",
                        "in"
                    ]
                },
                {
                    "path": [
                        "unit",
                        "id"
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
                "code",
                "name",
                "credits",
                "unitCode"
            ],
            "default": "code:asc"
        }
    },
    "listCurriculumSuggestions": {
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
                "description": "Structured curriculum suggestion filters. Use bracket notation such as filter[catalogYear]=2025.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "catalogProgramId": {
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
                        "catalogId": {
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
                        "catalogYear": {
                            "oneOf": [
                                {
                                    "minimum": 1900,
                                    "type": "integer"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "minimum": 1900,
                                            "type": "integer"
                                        },
                                        "in": {
                                            "items": {
                                                "minimum": 1900,
                                                "type": "integer"
                                            },
                                            "type": "array"
                                        }
                                    },
                                    "type": "object"
                                }
                            ]
                        },
                        "programId": {
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
                        "programCode": {
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
                        "code": {
                            "oneOf": [
                                {
                                    "minLength": 1,
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "minLength": 1,
                                            "type": "string"
                                        },
                                        "ne": {
                                            "minLength": 1,
                                            "type": "string"
                                        },
                                        "in": {
                                            "items": {
                                                "minLength": 1,
                                                "type": "string"
                                            },
                                            "type": "array"
                                        }
                                    },
                                    "type": "object"
                                }
                            ]
                        },
                        "type": {
                            "oneOf": [
                                {
                                    "enum": [
                                        "GENERAL",
                                        "SPECIALIZATION",
                                        "PRE_OPTION"
                                    ],
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "enum": [
                                                "GENERAL",
                                                "SPECIALIZATION",
                                                "PRE_OPTION"
                                            ],
                                            "type": "string"
                                        },
                                        "in": {
                                            "items": {
                                                "enum": [
                                                    "GENERAL",
                                                    "SPECIALIZATION",
                                                    "PRE_OPTION"
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
                        "specializationId": {
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
                    "example": "catalogYear:desc,programCode:desc,code:asc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "catalogProgramId"
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
                        "catalogId"
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
                        "catalogYear"
                    ],
                    "schema": {
                        "minimum": 1900,
                        "type": "integer"
                    },
                    "operators": [
                        "eq",
                        "in"
                    ]
                },
                {
                    "path": [
                        "programId"
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
                        "programCode"
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
                        "code"
                    ],
                    "schema": {
                        "minLength": 1,
                        "type": "string"
                    },
                    "operators": [
                        "eq",
                        "ne",
                        "in"
                    ]
                },
                {
                    "path": [
                        "type"
                    ],
                    "schema": {
                        "enum": [
                            "GENERAL",
                            "SPECIALIZATION",
                            "PRE_OPTION"
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
                        "specializationId"
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
                "catalogYear",
                "programCode",
                "programName",
                "code",
                "name",
                "type"
            ],
            "default": "catalogYear:desc,programCode:desc,code:asc"
        }
    },
    "listDailyMenus": {
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
                "description": "Structured daily menu filters. Use bracket notation such as filter[date][gte]=2026-08-20.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "date": {
                            "oneOf": [
                                {
                                    "format": "date",
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "format": "date",
                                            "type": "string"
                                        },
                                        "gte": {
                                            "format": "date",
                                            "type": "string"
                                        },
                                        "lte": {
                                            "format": "date",
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
                    "example": "date:asc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "date"
                    ],
                    "schema": {
                        "format": "date",
                        "type": "string"
                    },
                    "operators": [
                        "eq",
                        "gte",
                        "lte"
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
                "createdAt",
                "updatedAt"
            ],
            "default": "date:asc"
        }
    },
    "listDepartments": {
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
                "description": "Structured department filters. Use bracket notation such as filter[unitId]=1.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "unitId": {
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
                        "name": {
                            "oneOf": [
                                {
                                    "minLength": 1,
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "minLength": 1,
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
                    "example": "name:asc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "unitId"
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
                        "name"
                    ],
                    "schema": {
                        "minLength": 1,
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
                "name"
            ],
            "default": "name:asc"
        }
    },
    "listExchangeNotices": {
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
                "description": "Structured exchange notice filters. Use bracket notation such as filter[registrationEnd][gte]=2026-01-01.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "number": {
                            "oneOf": [
                                {
                                    "minLength": 1,
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "minLength": 1,
                                            "type": "string"
                                        },
                                        "ne": {
                                            "minLength": 1,
                                            "type": "string"
                                        },
                                        "in": {
                                            "items": {
                                                "minLength": 1,
                                                "type": "string"
                                            },
                                            "type": "array"
                                        }
                                    },
                                    "type": "object"
                                }
                            ]
                        },
                        "issuer": {
                            "oneOf": [
                                {
                                    "minLength": 1,
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "minLength": 1,
                                            "type": "string"
                                        },
                                        "ne": {
                                            "minLength": 1,
                                            "type": "string"
                                        },
                                        "in": {
                                            "items": {
                                                "minLength": 1,
                                                "type": "string"
                                            },
                                            "type": "array"
                                        }
                                    },
                                    "type": "object"
                                }
                            ]
                        },
                        "title": {
                            "oneOf": [
                                {
                                    "minLength": 1,
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "minLength": 1,
                                            "type": "string"
                                        },
                                        "ne": {
                                            "minLength": 1,
                                            "type": "string"
                                        },
                                        "in": {
                                            "items": {
                                                "minLength": 1,
                                                "type": "string"
                                            },
                                            "type": "array"
                                        }
                                    },
                                    "type": "object"
                                }
                            ]
                        },
                        "placeId": {
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
                                        "ne": {
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
                        "placeName": {
                            "oneOf": [
                                {
                                    "minLength": 1,
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "minLength": 1,
                                            "type": "string"
                                        }
                                    },
                                    "type": "object"
                                }
                            ]
                        },
                        "registrationStart": {
                            "oneOf": [
                                {
                                    "format": "date",
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "format": "date",
                                            "type": "string"
                                        },
                                        "ne": {
                                            "format": "date",
                                            "type": "string"
                                        },
                                        "gt": {
                                            "format": "date",
                                            "type": "string"
                                        },
                                        "gte": {
                                            "format": "date",
                                            "type": "string"
                                        },
                                        "lt": {
                                            "format": "date",
                                            "type": "string"
                                        },
                                        "lte": {
                                            "format": "date",
                                            "type": "string"
                                        },
                                        "in": {
                                            "items": {
                                                "format": "date",
                                                "type": "string"
                                            },
                                            "type": "array"
                                        }
                                    },
                                    "type": "object"
                                }
                            ]
                        },
                        "registrationEnd": {
                            "oneOf": [
                                {
                                    "format": "date",
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "format": "date",
                                            "type": "string"
                                        },
                                        "ne": {
                                            "format": "date",
                                            "type": "string"
                                        },
                                        "gt": {
                                            "format": "date",
                                            "type": "string"
                                        },
                                        "gte": {
                                            "format": "date",
                                            "type": "string"
                                        },
                                        "lt": {
                                            "format": "date",
                                            "type": "string"
                                        },
                                        "lte": {
                                            "format": "date",
                                            "type": "string"
                                        },
                                        "in": {
                                            "items": {
                                                "format": "date",
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
                    "example": "registrationEnd:desc,registrationStart:desc"
                }
            },
            {
                "name": "q",
                "required": false,
                "description": null,
                "style": null,
                "explode": null,
                "schema": {
                    "type": "string",
                    "minLength": 1
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "number"
                    ],
                    "schema": {
                        "minLength": 1,
                        "type": "string"
                    },
                    "operators": [
                        "eq",
                        "ne",
                        "in"
                    ]
                },
                {
                    "path": [
                        "issuer"
                    ],
                    "schema": {
                        "minLength": 1,
                        "type": "string"
                    },
                    "operators": [
                        "eq",
                        "ne",
                        "in"
                    ]
                },
                {
                    "path": [
                        "title"
                    ],
                    "schema": {
                        "minLength": 1,
                        "type": "string"
                    },
                    "operators": [
                        "eq",
                        "ne",
                        "in"
                    ]
                },
                {
                    "path": [
                        "placeId"
                    ],
                    "schema": {
                        "minimum": 1,
                        "type": "integer"
                    },
                    "operators": [
                        "eq",
                        "ne",
                        "in"
                    ]
                },
                {
                    "path": [
                        "placeName"
                    ],
                    "schema": {
                        "minLength": 1,
                        "type": "string"
                    },
                    "operators": [
                        "eq"
                    ]
                },
                {
                    "path": [
                        "registrationStart"
                    ],
                    "schema": {
                        "format": "date",
                        "type": "string"
                    },
                    "operators": [
                        "eq",
                        "ne",
                        "gt",
                        "gte",
                        "lt",
                        "lte",
                        "in"
                    ]
                },
                {
                    "path": [
                        "registrationEnd"
                    ],
                    "schema": {
                        "format": "date",
                        "type": "string"
                    },
                    "operators": [
                        "eq",
                        "ne",
                        "gt",
                        "gte",
                        "lt",
                        "lte",
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
                "registrationEnd",
                "registrationStart",
                "number",
                "issuer",
                "title",
                "place.name"
            ],
            "default": "registrationEnd:desc,registrationStart:desc"
        }
    },
    "listExchangePlaces": {
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
                "description": "Structured exchange place filters. Use bracket notation such as filter[name]=França.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "id": {
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
                        "name": {
                            "oneOf": [
                                {
                                    "minLength": 1,
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "minLength": 1,
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
                    "example": "name:asc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "id"
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
                        "name"
                    ],
                    "schema": {
                        "minLength": 1,
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
                "name"
            ],
            "default": "name:asc"
        }
    },
    "listKeywords": {
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
                "name": "filter",
                "required": false,
                "description": "Structured name filters. Use bracket notation such as filter[name]=Ada.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "name": {
                            "oneOf": [
                                {
                                    "minLength": 1,
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "minLength": 1,
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
                    "example": "name:asc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "name"
                    ],
                    "schema": {
                        "minLength": 1,
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
                "name"
            ],
            "default": "name:asc"
        }
    },
    "listLanguages": {
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
                "description": "Structured language filters. Use bracket notation such as filter[name]=Português.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "id": {
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
                        "name": {
                            "oneOf": [
                                {
                                    "minLength": 1,
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "minLength": 1,
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
                    "example": "name:asc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "id"
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
                        "name"
                    ],
                    "schema": {
                        "minLength": 1,
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
                "name"
            ],
            "default": "name:asc"
        }
    },
    "listProfessorDataPortalProfiles": {
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
                "name": "filter",
                "required": false,
                "description": "Structured profile filters. Use bracket notation such as filter[unitId]=1.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "professorId": {
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
                        "portalId": {
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
                        "unitId": {
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
                        "departmentId": {
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
                        "positionId": {
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
                        "name": {
                            "oneOf": [
                                {
                                    "minLength": 1,
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "minLength": 1,
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
                    "example": "name:asc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "professorId"
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
                        "portalId"
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
                        "unitId"
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
                        "departmentId"
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
                        "positionId"
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
                        "name"
                    ],
                    "schema": {
                        "minLength": 1,
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
                "name"
            ],
            "default": "name:asc"
        }
    },
    "listProfessorEvaluationSummaries": {
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
                "name": "filter",
                "required": false,
                "description": "Structured professor summary filters. Use filter[professorId]=1.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "professorId": {
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
                    "example": "professor.name:asc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "professorId"
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
                "professor.name",
                "responseCount",
                "wouldTakeAgain",
                "fairness",
                "clarity",
                "difficulty"
            ],
            "default": "professor.name:asc"
        }
    },
    "listProfessorPositions": {
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
                "description": "Structured professor position filters. Use bracket notation such as filter[role]=Professor.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "id": {
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
                        "canonicalKey": {
                            "oneOf": [
                                {
                                    "minLength": 1,
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "minLength": 1,
                                            "type": "string"
                                        }
                                    },
                                    "type": "object"
                                }
                            ]
                        },
                        "role": {
                            "oneOf": [
                                {
                                    "enum": [
                                        "PROFESSOR",
                                        "RESEARCHER",
                                        "POSTDOCTORAL_RESEARCHER"
                                    ],
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "enum": [
                                                "PROFESSOR",
                                                "RESEARCHER",
                                                "POSTDOCTORAL_RESEARCHER"
                                            ],
                                            "type": "string"
                                        },
                                        "in": {
                                            "items": {
                                                "enum": [
                                                    "PROFESSOR",
                                                    "RESEARCHER",
                                                    "POSTDOCTORAL_RESEARCHER"
                                                ],
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
                    "example": "canonicalKey:asc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "id"
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
                        "canonicalKey"
                    ],
                    "schema": {
                        "minLength": 1,
                        "type": "string"
                    },
                    "operators": [
                        "eq"
                    ]
                },
                {
                    "path": [
                        "role"
                    ],
                    "schema": {
                        "enum": [
                            "PROFESSOR",
                            "RESEARCHER",
                            "POSTDOCTORAL_RESEARCHER"
                        ],
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
                "canonicalKey",
                "role"
            ],
            "default": "canonicalKey:asc"
        }
    },
    "listProfessors": {
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
                "name": "filter",
                "required": false,
                "description": "Structured professor filters. Use bracket notation such as filter[classId]=1.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "classId": {
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
                    "example": "name:asc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "classId"
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
                "name"
            ],
            "default": "name:asc"
        }
    },
    "listPrograms": {
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
                "description": "Structured program filters. Use bracket notation such as filter[unitId]=1.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "unitId": {
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
                    "example": "name:asc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "unitId"
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
                "code",
                "name",
                "unitCode"
            ],
            "default": "name:asc"
        }
    },
    "listRooms": {
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
                "description": "Structured room filters. Use bracket notation such as filter[code]=PB01.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "id": {
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
                        "code": {
                            "oneOf": [
                                {
                                    "minLength": 1,
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "minLength": 1,
                                            "type": "string"
                                        },
                                        "ne": {
                                            "minLength": 1,
                                            "type": "string"
                                        },
                                        "in": {
                                            "items": {
                                                "minLength": 1,
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
                    "example": "code:asc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "id"
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
                        "code"
                    ],
                    "schema": {
                        "minLength": 1,
                        "type": "string"
                    },
                    "operators": [
                        "eq",
                        "ne",
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
                "code"
            ],
            "default": "code:asc"
        }
    },
    "listSpecializations": {
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
                "description": "Structured specialization filters. Use bracket notation such as filter[programId]=1.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "programId": {
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
                        "programCode": {
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
                        "code": {
                            "oneOf": [
                                {
                                    "minLength": 1,
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "minLength": 1,
                                            "type": "string"
                                        },
                                        "ne": {
                                            "minLength": 1,
                                            "type": "string"
                                        },
                                        "in": {
                                            "items": {
                                                "minLength": 1,
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
                    "example": "programCode:asc,name:asc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "programId"
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
                        "programCode"
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
                        "code"
                    ],
                    "schema": {
                        "minLength": 1,
                        "type": "string"
                    },
                    "operators": [
                        "eq",
                        "ne",
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
                "programCode",
                "programName",
                "code",
                "name"
            ],
            "default": "programCode:asc,name:asc"
        }
    },
    "listStudyPeriods": {
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
                "description": "Structured study period filters. Use bracket notation such as filter[year]=2025.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "id": {
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
                        "yearPeriod": {
                            "oneOf": [
                                {
                                    "enum": [
                                        "SUMMER",
                                        "FIRST_SEMESTER",
                                        "WINTER",
                                        "SECOND_SEMESTER"
                                    ],
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "enum": [
                                                "SUMMER",
                                                "FIRST_SEMESTER",
                                                "WINTER",
                                                "SECOND_SEMESTER"
                                            ],
                                            "type": "string"
                                        },
                                        "in": {
                                            "items": {
                                                "enum": [
                                                    "SUMMER",
                                                    "FIRST_SEMESTER",
                                                    "WINTER",
                                                    "SECOND_SEMESTER"
                                                ],
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
                    "example": "id:asc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "id"
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
                        "year"
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
                        "yearPeriod"
                    ],
                    "schema": {
                        "enum": [
                            "SUMMER",
                            "FIRST_SEMESTER",
                            "WINTER",
                            "SECOND_SEMESTER"
                        ],
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
                "id",
                "year",
                "yearPeriod",
                "startDate"
            ],
            "default": "id:asc"
        }
    },
    "listUnits": {
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
                "description": "Structured unit filters. Use bracket notation such as filter[code]=IC.",
                "style": "deepObject",
                "explode": true,
                "schema": {
                    "additionalProperties": false,
                    "properties": {
                        "id": {
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
                        "code": {
                            "oneOf": [
                                {
                                    "minLength": 1,
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "minLength": 1,
                                            "type": "string"
                                        },
                                        "ne": {
                                            "minLength": 1,
                                            "type": "string"
                                        },
                                        "in": {
                                            "items": {
                                                "minLength": 1,
                                                "type": "string"
                                            },
                                            "type": "array"
                                        }
                                    },
                                    "type": "object"
                                }
                            ]
                        },
                        "name": {
                            "oneOf": [
                                {
                                    "minLength": 1,
                                    "type": "string"
                                },
                                {
                                    "additionalProperties": false,
                                    "properties": {
                                        "eq": {
                                            "minLength": 1,
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
                    "example": "code:asc"
                }
            }
        ],
        "filter": {
            "version": 1,
            "fields": [
                {
                    "path": [
                        "id"
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
                        "code"
                    ],
                    "schema": {
                        "minLength": 1,
                        "type": "string"
                    },
                    "operators": [
                        "eq",
                        "ne",
                        "in"
                    ]
                },
                {
                    "path": [
                        "name"
                    ],
                    "schema": {
                        "minLength": 1,
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
                "code",
                "name"
            ],
            "default": "code:asc"
        }
    }
} as const

export type ComponentSchemaName = keyof typeof componentSchemas
export type EnumName = keyof typeof enumValues
