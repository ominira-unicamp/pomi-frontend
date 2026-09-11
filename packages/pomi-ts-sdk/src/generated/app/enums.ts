export const botGrantEntityCapabilityValues = [
  'STUDENT_PROFILE_READ',
  'STUDENT_PROFILE_WRITE',
  'STUDENT_HISTORY_READ',
  'STUDENT_HISTORY_WRITE',
  'STUDENT_PLANNING_READ',
  'STUDENT_PLANNING_WRITE',
  'STUDENT_SOCIAL_READ',
  'STUDENT_SOCIAL_WRITE',
  'STUDENT_FEEDBACK_READ',
  'STUDENT_FEEDBACK_WRITE',
] as const
export type BotGrantEntityCapability =
  (typeof botGrantEntityCapabilityValues)[number]

export const replaceBotGrantBodyCapabilitiesArrayValues = [
  'STUDENT_PROFILE_READ',
  'STUDENT_PROFILE_WRITE',
  'STUDENT_HISTORY_READ',
  'STUDENT_HISTORY_WRITE',
  'STUDENT_PLANNING_READ',
  'STUDENT_PLANNING_WRITE',
  'STUDENT_SOCIAL_READ',
  'STUDENT_SOCIAL_WRITE',
  'STUDENT_FEEDBACK_READ',
  'STUDENT_FEEDBACK_WRITE',
] as const
export type ReplaceBotGrantBodyCapabilitiesArray =
  (typeof replaceBotGrantBodyCapabilitiesArrayValues)[number]

export const periodPlanningEntityStudyPeriodYearPeriodValues = [
  'SUMMER',
  'FIRST_SEMESTER',
  'WINTER',
  'SECOND_SEMESTER',
] as const
export type PeriodPlanningEntityStudyPeriodYearPeriod =
  (typeof periodPlanningEntityStudyPeriodYearPeriodValues)[number]

export const periodPlanningEntityVisibilityValues = [
  'PRIVATE',
  'FRIENDS',
  'PUBLIC',
] as const
export type PeriodPlanningEntityVisibility =
  (typeof periodPlanningEntityVisibilityValues)[number]

export const periodPlanningEntityGuideModeValues = [
  'CURRICULUM',
  'PROGRAM',
  'NONE',
] as const
export type PeriodPlanningEntityGuideMode =
  (typeof periodPlanningEntityGuideModeValues)[number]

export const periodPlanningEntityGuideCurriculumSourceValues = [
  'SAVED',
  'SUGGESTION',
  null,
] as const
export type PeriodPlanningEntityGuideCurriculumSource =
  (typeof periodPlanningEntityGuideCurriculumSourceValues)[number]

export const periodPlanningEntityClassesArrayClassSchedulesArrayDayOfWeekValues =
  [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ] as const
export type PeriodPlanningEntityClassesArrayClassSchedulesArrayDayOfWeek =
  (typeof periodPlanningEntityClassesArrayClassSchedulesArrayDayOfWeekValues)[number]

export const sharedPeriodPlanningVisibilityValues = [
  'FRIENDS',
  'PUBLIC',
] as const
export type SharedPeriodPlanningVisibility =
  (typeof sharedPeriodPlanningVisibilityValues)[number]

export const sharedPeriodPlanningStudyPeriodYearPeriodValues = [
  'SUMMER',
  'FIRST_SEMESTER',
  'WINTER',
  'SECOND_SEMESTER',
] as const
export type SharedPeriodPlanningStudyPeriodYearPeriod =
  (typeof sharedPeriodPlanningStudyPeriodYearPeriodValues)[number]

export const sharedPeriodPlanningClassesArrayClassSchedulesArrayDayOfWeekValues =
  [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ] as const
export type SharedPeriodPlanningClassesArrayClassSchedulesArrayDayOfWeek =
  (typeof sharedPeriodPlanningClassesArrayClassSchedulesArrayDayOfWeekValues)[number]

export const studentCourseAttemptEvaluationModeValues = [
  'GRADE_AND_ATTENDANCE',
  'ATTENDANCE',
  'CONCEPT',
] as const
export type StudentCourseAttemptEvaluationMode =
  (typeof studentCourseAttemptEvaluationModeValues)[number]

export const studentCourseAttemptStatusValues = [
  'ENROLLED',
  'DROPPED',
  'APPROVED',
  'FAILED_BY_GRADE',
  'APPROVED_BY_ATTENDANCE',
  'APPROVED_BY_PROFICIENCY',
  'FAILED_BY_ATTENDANCE',
  'SUFFICIENT',
  'INSUFFICIENT',
] as const
export type StudentCourseAttemptStatus =
  (typeof studentCourseAttemptStatusValues)[number]

export const studentCourseAttemptStudyPeriodYearPeriodValues = [
  'SUMMER',
  'FIRST_SEMESTER',
  'WINTER',
  'SECOND_SEMESTER',
] as const
export type StudentCourseAttemptStudyPeriodYearPeriod =
  (typeof studentCourseAttemptStudyPeriodYearPeriodValues)[number]

export const studentHistoryImportBodySemestersArrayYearPeriodValues = [
  'SUMMER',
  'FIRST_SEMESTER',
  'WINTER',
  'SECOND_SEMESTER',
] as const
export type StudentHistoryImportBodySemestersArrayYearPeriod =
  (typeof studentHistoryImportBodySemestersArrayYearPeriodValues)[number]

export const studentHistoryImportBodySemestersArrayCoursesArrayStatusValues = [
  'APPROVED',
  'APPROVED_BY_ATTENDANCE',
  'APPROVED_BY_PROFICIENCY',
  'DROPPED',
  'FAILED_BY_ATTENDANCE',
  'SUFFICIENT',
] as const
export type StudentHistoryImportBodySemestersArrayCoursesArrayStatus =
  (typeof studentHistoryImportBodySemestersArrayCoursesArrayStatusValues)[number]

export const studentAbsenceStudyPeriodYearPeriodValues = [
  'SUMMER',
  'FIRST_SEMESTER',
  'WINTER',
  'SECOND_SEMESTER',
] as const
export type StudentAbsenceStudyPeriodYearPeriod =
  (typeof studentAbsenceStudyPeriodYearPeriodValues)[number]

export const studentAbsenceDayOfWeekValues = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
] as const
export type StudentAbsenceDayOfWeek =
  (typeof studentAbsenceDayOfWeekValues)[number]

export const studentPublicProfileCurrentCoursesVisibilityValues = [
  'PRIVATE',
  'FRIENDS',
  'PUBLIC',
] as const
export type StudentPublicProfileCurrentCoursesVisibility =
  (typeof studentPublicProfileCurrentCoursesVisibilityValues)[number]

export const studentCurrentCourseSchedulesArrayDayOfWeekValues = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
] as const
export type StudentCurrentCourseSchedulesArrayDayOfWeek =
  (typeof studentCurrentCourseSchedulesArrayDayOfWeekValues)[number]

export const studentFriendshipStatusValues = ['PENDING', 'ACCEPTED'] as const
export type StudentFriendshipStatus =
  (typeof studentFriendshipStatusValues)[number]

export const studentFriendshipDirectionValues = [
  'INCOMING',
  'OUTGOING',
  'NONE',
] as const
export type StudentFriendshipDirection =
  (typeof studentFriendshipDirectionValues)[number]

export const createFeedbackReportBodyKindValues = [
  'BUG',
  'SUGGESTION',
  'DATA_ISSUE',
] as const
export type CreateFeedbackReportBodyKind =
  (typeof createFeedbackReportBodyKindValues)[number]

export const feedbackReportTargetFeatureKeyValues = [
  'home',
  'curriculum-planner',
  'semester-planner',
  'course-situation',
  'agenda',
  'social',
  'academic-data',
] as const
export type FeedbackReportTargetFeatureKey =
  (typeof feedbackReportTargetFeatureKeyValues)[number]

export const feedbackReportTargetAcademicResourceTypeValues = [
  'COURSE',
  'CATALOG_COURSE',
  'CATALOG_PROGRAM',
  'CURRICULUM_SUGGESTION',
  'CLASS',
  'CLASS_SCHEDULE',
  'STUDY_PERIOD',
  'DAILY_MENU',
  'CALENDAR_EVENT',
] as const
export type FeedbackReportTargetAcademicResourceType =
  (typeof feedbackReportTargetAcademicResourceTypeValues)[number]

export const feedbackReportKindValues = [
  'BUG',
  'SUGGESTION',
  'DATA_ISSUE',
] as const
export type FeedbackReportKind = (typeof feedbackReportKindValues)[number]

export const feedbackReportStatusValues = [
  'OPEN',
  'IN_PROGRESS',
  'CLOSED',
] as const
export type FeedbackReportStatus = (typeof feedbackReportStatusValues)[number]

export const enumValueNames = {
  'BotGrantEntity.capability': 'botGrantEntityCapabilityValues',
  'ReplaceBotGrantBody.capabilities[]':
    'replaceBotGrantBodyCapabilitiesArrayValues',
  'PeriodPlanningEntity.studyPeriodYearPeriod':
    'periodPlanningEntityStudyPeriodYearPeriodValues',
  'PeriodPlanningEntity.visibility': 'periodPlanningEntityVisibilityValues',
  'PeriodPlanningEntity.guide.mode': 'periodPlanningEntityGuideModeValues',
  'PeriodPlanningEntity.guide.curriculumSource':
    'periodPlanningEntityGuideCurriculumSourceValues',
  'PeriodPlanningEntity.classes[].classSchedules[].dayOfWeek':
    'periodPlanningEntityClassesArrayClassSchedulesArrayDayOfWeekValues',
  'SharedPeriodPlanning.visibility': 'sharedPeriodPlanningVisibilityValues',
  'SharedPeriodPlanning.studyPeriodYearPeriod':
    'sharedPeriodPlanningStudyPeriodYearPeriodValues',
  'SharedPeriodPlanning.classes[].classSchedules[].dayOfWeek':
    'sharedPeriodPlanningClassesArrayClassSchedulesArrayDayOfWeekValues',
  'StudentCourseAttempt.evaluationMode':
    'studentCourseAttemptEvaluationModeValues',
  'StudentCourseAttempt.status': 'studentCourseAttemptStatusValues',
  'StudentCourseAttempt.studyPeriod.yearPeriod':
    'studentCourseAttemptStudyPeriodYearPeriodValues',
  'StudentHistoryImportBody.semesters[].yearPeriod':
    'studentHistoryImportBodySemestersArrayYearPeriodValues',
  'StudentHistoryImportBody.semesters[].courses[].status':
    'studentHistoryImportBodySemestersArrayCoursesArrayStatusValues',
  'StudentAbsence.studyPeriodYearPeriod':
    'studentAbsenceStudyPeriodYearPeriodValues',
  'StudentAbsence.dayOfWeek': 'studentAbsenceDayOfWeekValues',
  'StudentPublicProfile.currentCoursesVisibility':
    'studentPublicProfileCurrentCoursesVisibilityValues',
  'StudentCurrentCourse.schedules[].dayOfWeek':
    'studentCurrentCourseSchedulesArrayDayOfWeekValues',
  'StudentFriendship.status': 'studentFriendshipStatusValues',
  'StudentFriendship.direction': 'studentFriendshipDirectionValues',
  'CreateFeedbackReportBody.kind': 'createFeedbackReportBodyKindValues',
  'FeedbackReportTarget.oneOf.featureKey':
    'feedbackReportTargetFeatureKeyValues',
  'FeedbackReportTarget.oneOf.academicResourceType':
    'feedbackReportTargetAcademicResourceTypeValues',
  'FeedbackReport.kind': 'feedbackReportKindValues',
  'FeedbackReport.status': 'feedbackReportStatusValues',
} as const
