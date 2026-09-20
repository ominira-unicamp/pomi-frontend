export type { SortDirection, SortInput, SortTerm } from '../../runtime/sorting.js'
import type { listCatalogCoursesInput, listCourseEvaluationSummariesInput, listExchangeNoticesInput, listProfessorEvaluationSummariesInput } from './operations.js'

export type listCatalogCoursesSort = NonNullable<listCatalogCoursesInput['sort']>
export type listCourseEvaluationSummariesSort = NonNullable<listCourseEvaluationSummariesInput['sort']>
export type listExchangeNoticesSort = NonNullable<listExchangeNoticesInput['sort']>
export type listProfessorEvaluationSummariesSort = NonNullable<listProfessorEvaluationSummariesInput['sort']>

export const sortCapabilities = {
    "listCatalogCourses": {
        "version": 1,
        "fields": [
            "catalogYear",
            "code",
            "name",
            "credits"
        ],
        "default": "catalogYear:desc,code:asc"
    },
    "listCourseEvaluationSummaries": {
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
    },
    "listExchangeNotices": {
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
    },
    "listProfessorEvaluationSummaries": {
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
} as const
