import type { listCalendarEventsInput, listCalendarTagsInput, listCatalogCoursesInput, listCatalogProgramInput, listCatalogsInput, listClassesInput, listClassSchedulesInput, listCoauthorsInput, listCoordinatorsInput, listCoursesInput, listCoursesEvaluationSummariesInput, listCurriculumSuggestionsInput, listDailyMenusInput, listDepartmentsInput, listEvaluationSummariesInput, listExchangeNoticesInput, listExchangePlacesInput, listKeywordsInput, listLanguagesInput, listProfessorDataPortalProfilesInput, listProfessorPositionsInput, listProfessorsInput, listProfessorsEvaluationSummariesInput, listProgramsInput, listRoomsInput, listSpecializationsInput, listStudyPeriodsInput, listUnitsInput } from './operations.js'

export type listCalendarEventsFilter = NonNullable<listCalendarEventsInput['filter']>
export type listCalendarTagsFilter = NonNullable<listCalendarTagsInput['filter']>
export type listCatalogCoursesFilter = NonNullable<listCatalogCoursesInput['filter']>
export type listCatalogProgramFilter = NonNullable<listCatalogProgramInput['filter']>
export type listCatalogsFilter = NonNullable<listCatalogsInput['filter']>
export type listClassesFilter = NonNullable<listClassesInput['filter']>
export type listClassSchedulesFilter = NonNullable<listClassSchedulesInput['filter']>
export type listCoauthorsFilter = NonNullable<listCoauthorsInput['filter']>
export type listCoordinatorsFilter = NonNullable<listCoordinatorsInput['filter']>
export type listCoursesFilter = NonNullable<listCoursesInput['filter']>
export type listCoursesEvaluationSummariesFilter = NonNullable<listCoursesEvaluationSummariesInput['filter']>
export type listCurriculumSuggestionsFilter = NonNullable<listCurriculumSuggestionsInput['filter']>
export type listDailyMenusFilter = NonNullable<listDailyMenusInput['filter']>
export type listDepartmentsFilter = NonNullable<listDepartmentsInput['filter']>
export type listEvaluationSummariesFilter = NonNullable<listEvaluationSummariesInput['filter']>
export type listExchangeNoticesFilter = NonNullable<listExchangeNoticesInput['filter']>
export type listExchangePlacesFilter = NonNullable<listExchangePlacesInput['filter']>
export type listKeywordsFilter = NonNullable<listKeywordsInput['filter']>
export type listLanguagesFilter = NonNullable<listLanguagesInput['filter']>
export type listProfessorDataPortalProfilesFilter = NonNullable<listProfessorDataPortalProfilesInput['filter']>
export type listProfessorPositionsFilter = NonNullable<listProfessorPositionsInput['filter']>
export type listProfessorsFilter = NonNullable<listProfessorsInput['filter']>
export type listProfessorsEvaluationSummariesFilter = NonNullable<listProfessorsEvaluationSummariesInput['filter']>
export type listProgramsFilter = NonNullable<listProgramsInput['filter']>
export type listRoomsFilter = NonNullable<listRoomsInput['filter']>
export type listSpecializationsFilter = NonNullable<listSpecializationsInput['filter']>
export type listStudyPeriodsFilter = NonNullable<listStudyPeriodsInput['filter']>
export type listUnitsFilter = NonNullable<listUnitsInput['filter']>

export const filterCapabilities = {
    "listCalendarEvents": {
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
    "listCalendarTags": {
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
    "listCatalogCourses": {
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
    "listCatalogProgram": {
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
    "listCatalogs": {
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
    "listClasses": {
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
    "listClassSchedules": {
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
    "listCoauthors": {
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
    "listCoordinators": {
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
    "listCourses": {
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
    "listCoursesEvaluationSummaries": {
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
    "listCurriculumSuggestions": {
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
    "listDailyMenus": {
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
    "listDepartments": {
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
    "listEvaluationSummaries": {
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
    },
    "listExchangeNotices": {
        "version": 1,
        "fields": [
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
                    "gte",
                    "lte"
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
    "listExchangePlaces": {
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
    "listKeywords": {
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
    "listLanguages": {
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
    "listProfessorDataPortalProfiles": {
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
    "listProfessorPositions": {
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
    "listProfessors": {
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
    "listProfessorsEvaluationSummaries": {
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
    "listPrograms": {
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
    "listRooms": {
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
    "listSpecializations": {
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
    "listStudyPeriods": {
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
    "listUnits": {
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
    }
} as const
