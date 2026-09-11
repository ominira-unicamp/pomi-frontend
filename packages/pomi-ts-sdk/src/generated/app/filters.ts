import type { listSharedPeriodPlanningsInput, listStudentAbsencesInput, listStudentCourseAttemptsInput, listStudentFriendshipsInput, listStudentProfessorEvaluationsPendingInput, listStudentSharedPeriodPlanningsInput, listTagsInput } from './operations.js'

export type listSharedPeriodPlanningsFilter = NonNullable<listSharedPeriodPlanningsInput['filter']>
export type listStudentAbsencesFilter = NonNullable<listStudentAbsencesInput['filter']>
export type listStudentCourseAttemptsFilter = NonNullable<listStudentCourseAttemptsInput['filter']>
export type listStudentFriendshipsFilter = NonNullable<listStudentFriendshipsInput['filter']>
export type listStudentProfessorEvaluationsPendingFilter = NonNullable<listStudentProfessorEvaluationsPendingInput['filter']>
export type listStudentSharedPeriodPlanningsFilter = NonNullable<listStudentSharedPeriodPlanningsInput['filter']>
export type listTagsFilter = NonNullable<listTagsInput['filter']>

export const filterCapabilities = {
    "listSharedPeriodPlannings": {
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
    "listStudentAbsences": {
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
    "listStudentCourseAttempts": {
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
    "listStudentFriendships": {
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
    "listStudentProfessorEvaluationsPending": {
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
    "listStudentSharedPeriodPlannings": {
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
    "listTags": {
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
} as const
