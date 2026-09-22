export const studentCapabilityValues = ["STUDENT_PROFILE_READ", "STUDENT_PROFILE_WRITE", "STUDENT_HISTORY_READ", "STUDENT_HISTORY_WRITE", "STUDENT_PLANNING_READ", "STUDENT_PLANNING_WRITE", "STUDENT_SOCIAL_READ", "STUDENT_SOCIAL_WRITE", "STUDENT_FEEDBACK_READ", "STUDENT_FEEDBACK_WRITE"] as const
export type StudentCapability = (typeof studentCapabilityValues)[number]

export const authUserStatusValues = ["ACTIVE", "DISABLED"] as const
export type AuthUserStatus = (typeof authUserStatusValues)[number]

export const yearPeriodValues = ["SUMMER", "FIRST_SEMESTER", "WINTER", "SECOND_SEMESTER"] as const
export type YearPeriod = (typeof yearPeriodValues)[number]

export const planningVisibilityValues = ["PRIVATE", "FRIENDS", "PUBLIC"] as const
export type PlanningVisibility = (typeof planningVisibilityValues)[number]

export const planningGuideModeValues = ["CURRICULUM", "PROGRAM", "NONE"] as const
export type PlanningGuideMode = (typeof planningGuideModeValues)[number]

export const planningCurriculumSourceValues = ["SAVED", "SUGGESTION", null] as const
export type PlanningCurriculumSource = (typeof planningCurriculumSourceValues)[number]

export const dayOfWeekValues = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"] as const
export type DayOfWeek = (typeof dayOfWeekValues)[number]

export const sharedPlanningVisibilityValues = ["FRIENDS", "PUBLIC"] as const
export type SharedPlanningVisibility = (typeof sharedPlanningVisibilityValues)[number]

export const courseEvaluationModeValues = ["GRADE_AND_ATTENDANCE", "ATTENDANCE", "CONCEPT"] as const
export type CourseEvaluationMode = (typeof courseEvaluationModeValues)[number]

export const studentCourseAttemptStatusValues = ["ENROLLED", "DROPPED", "APPROVED", "FAILED_BY_GRADE", "APPROVED_BY_ATTENDANCE", "APPROVED_BY_PROFICIENCY", "FAILED_BY_ATTENDANCE", "SUFFICIENT", "INSUFFICIENT"] as const
export type StudentCourseAttemptStatus = (typeof studentCourseAttemptStatusValues)[number]

export const historyCourseStatusValues = ["ENROLLED", "APPROVED", "APPROVED_BY_ATTENDANCE", "APPROVED_BY_PROFICIENCY", "DROPPED", "FAILED_BY_ATTENDANCE", "SUFFICIENT"] as const
export type HistoryCourseStatus = (typeof historyCourseStatusValues)[number]

export const studentProfileVisibilityValues = ["PRIVATE", "FRIENDS", "PUBLIC"] as const
export type StudentProfileVisibility = (typeof studentProfileVisibilityValues)[number]

export const studentFriendshipStatusValues = ["PENDING", "ACCEPTED"] as const
export type StudentFriendshipStatus = (typeof studentFriendshipStatusValues)[number]

export const studentFriendshipDirectionValues = ["INCOMING", "OUTGOING", "NONE"] as const
export type StudentFriendshipDirection = (typeof studentFriendshipDirectionValues)[number]

export const feedbackKindValues = ["BUG", "SUGGESTION", "DATA_ISSUE"] as const
export type FeedbackKind = (typeof feedbackKindValues)[number]

export const feedbackFeatureKeyValues = ["home", "curriculum-planner", "semester-planner", "course-situation", "agenda", "social", "academic-data"] as const
export type FeedbackFeatureKey = (typeof feedbackFeatureKeyValues)[number]

export const feedbackAcademicResourceTypeValues = ["COURSE", "CATALOG_COURSE", "CATALOG_PROGRAM", "CURRICULUM_SUGGESTION", "CLASS", "CLASS_SCHEDULE", "STUDY_PERIOD", "DAILY_MENU", "CALENDAR_EVENT"] as const
export type FeedbackAcademicResourceType = (typeof feedbackAcademicResourceTypeValues)[number]

export const feedbackStatusValues = ["OPEN", "IN_PROGRESS", "CLOSED"] as const
export type FeedbackStatus = (typeof feedbackStatusValues)[number]

export const enumValueNames = {
    "StudentCapability": "studentCapabilityValues",
    "AuthUserStatus": "authUserStatusValues",
    "YearPeriod": "yearPeriodValues",
    "PlanningVisibility": "planningVisibilityValues",
    "PlanningGuideMode": "planningGuideModeValues",
    "PlanningCurriculumSource": "planningCurriculumSourceValues",
    "DayOfWeek": "dayOfWeekValues",
    "SharedPlanningVisibility": "sharedPlanningVisibilityValues",
    "CourseEvaluationMode": "courseEvaluationModeValues",
    "StudentCourseAttemptStatus": "studentCourseAttemptStatusValues",
    "HistoryCourseStatus": "historyCourseStatusValues",
    "StudentProfileVisibility": "studentProfileVisibilityValues",
    "StudentFriendshipStatus": "studentFriendshipStatusValues",
    "StudentFriendshipDirection": "studentFriendshipDirectionValues",
    "FeedbackKind": "feedbackKindValues",
    "FeedbackFeatureKey": "feedbackFeatureKeyValues",
    "FeedbackAcademicResourceType": "feedbackAcademicResourceTypeValues",
    "FeedbackStatus": "feedbackStatusValues"
} as const
