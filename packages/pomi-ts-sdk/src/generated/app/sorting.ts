export type { SortDirection, SortInput, SortTerm } from '../../runtime/sorting.js'
import type { listAuthUsersInput, listBotGrantsInput, listBotsInput, listCategoriesInput, listCourseTagsInput, listFeedbackReportsInput, listPendingProfessorEvaluationsInput, listPublicSharedPeriodPlanningsInput, listStudentAbsencesInput, listStudentCourseAttemptsInput, listStudentCurriculaInput, listStudentFeedbackReportsInput, listStudentFriendshipsInput, listStudentPeopleInput, listStudentPeriodPlanningsInput, listStudentsInput, listStudentSharedPeriodPlanningsInput, listStudentTagInterestsInput, listTagCoursesInput, listTagsInput } from './operations.js'

export type listAuthUsersSort = NonNullable<listAuthUsersInput['sort']>
export type listBotGrantsSort = NonNullable<listBotGrantsInput['sort']>
export type listBotsSort = NonNullable<listBotsInput['sort']>
export type listCategoriesSort = NonNullable<listCategoriesInput['sort']>
export type listCourseTagsSort = NonNullable<listCourseTagsInput['sort']>
export type listFeedbackReportsSort = NonNullable<listFeedbackReportsInput['sort']>
export type listPendingProfessorEvaluationsSort = NonNullable<listPendingProfessorEvaluationsInput['sort']>
export type listPublicSharedPeriodPlanningsSort = NonNullable<listPublicSharedPeriodPlanningsInput['sort']>
export type listStudentAbsencesSort = NonNullable<listStudentAbsencesInput['sort']>
export type listStudentCourseAttemptsSort = NonNullable<listStudentCourseAttemptsInput['sort']>
export type listStudentCurriculaSort = NonNullable<listStudentCurriculaInput['sort']>
export type listStudentFeedbackReportsSort = NonNullable<listStudentFeedbackReportsInput['sort']>
export type listStudentFriendshipsSort = NonNullable<listStudentFriendshipsInput['sort']>
export type listStudentPeopleSort = NonNullable<listStudentPeopleInput['sort']>
export type listStudentPeriodPlanningsSort = NonNullable<listStudentPeriodPlanningsInput['sort']>
export type listStudentsSort = NonNullable<listStudentsInput['sort']>
export type listStudentSharedPeriodPlanningsSort = NonNullable<listStudentSharedPeriodPlanningsInput['sort']>
export type listStudentTagInterestsSort = NonNullable<listStudentTagInterestsInput['sort']>
export type listTagCoursesSort = NonNullable<listTagCoursesInput['sort']>
export type listTagsSort = NonNullable<listTagsInput['sort']>

export const sortCapabilities = {
    "listAuthUsers": {
        "version": 1,
        "fields": [
            "id",
            "displayName",
            "email",
            "status"
        ],
        "default": "id:asc"
    },
    "listBotGrants": {
        "version": 1,
        "fields": [
            "createdAt",
            "capability",
            "botDisplayName"
        ],
        "default": "createdAt:desc"
    },
    "listBots": {
        "version": 1,
        "fields": [
            "displayName"
        ],
        "default": "displayName:asc"
    },
    "listCategories": {
        "version": 1,
        "fields": [
            "name"
        ],
        "default": "name:asc"
    },
    "listCourseTags": {
        "version": 1,
        "fields": [
            "name",
            "categoryId"
        ],
        "default": "name:asc"
    },
    "listFeedbackReports": {
        "version": 1,
        "fields": [
            "createdAt",
            "updatedAt",
            "status",
            "kind",
            "title"
        ],
        "default": "createdAt:desc"
    },
    "listPendingProfessorEvaluations": {
        "version": 1,
        "fields": [
            "courseCode",
            "courseName",
            "classCode",
            "professorName"
        ],
        "default": "courseCode:asc,classCode:asc,professorName:asc"
    },
    "listPublicSharedPeriodPlannings": {
        "version": 1,
        "fields": [
            "updatedAt",
            "name",
            "studyPeriodYear"
        ],
        "default": "updatedAt:desc"
    },
    "listStudentAbsences": {
        "version": 1,
        "fields": [
            "date",
            "courseCode",
            "classCode",
            "start",
            "createdAt"
        ],
        "default": "date:desc"
    },
    "listStudentCourseAttempts": {
        "version": 1,
        "fields": [
            "createdAt",
            "updatedAt",
            "courseCode",
            "status",
            "grade"
        ],
        "default": "createdAt:desc"
    },
    "listStudentCurricula": {
        "version": 1,
        "fields": [
            "isFavorite",
            "updatedAt",
            "name"
        ],
        "default": "isFavorite:desc,updatedAt:desc"
    },
    "listStudentFeedbackReports": {
        "version": 1,
        "fields": [
            "createdAt",
            "updatedAt",
            "status",
            "kind",
            "title"
        ],
        "default": "createdAt:desc"
    },
    "listStudentFriendships": {
        "version": 1,
        "fields": [
            "updatedAt",
            "status"
        ],
        "default": "updatedAt:desc"
    },
    "listStudentPeople": {
        "version": 1,
        "fields": [
            "displayName"
        ],
        "default": "displayName:asc"
    },
    "listStudentPeriodPlannings": {
        "version": 1,
        "fields": [
            "updatedAt",
            "name",
            "studyPeriodYear",
            "studyPeriodYearPeriod",
            "visibility"
        ],
        "default": "updatedAt:desc"
    },
    "listStudents": {
        "version": 1,
        "fields": [
            "id",
            "ra",
            "name",
            "entryYear"
        ],
        "default": "id:asc"
    },
    "listStudentSharedPeriodPlannings": {
        "version": 1,
        "fields": [
            "updatedAt",
            "name",
            "studyPeriodYear"
        ],
        "default": "updatedAt:desc"
    },
    "listStudentTagInterests": {
        "version": 1,
        "fields": [
            "name"
        ],
        "default": "name:asc"
    },
    "listTagCourses": {
        "version": 1,
        "fields": [
            "code",
            "name",
            "credits"
        ],
        "default": "code:asc"
    },
    "listTags": {
        "version": 1,
        "fields": [
            "name",
            "categoryId"
        ],
        "default": "name:asc"
    }
} as const
