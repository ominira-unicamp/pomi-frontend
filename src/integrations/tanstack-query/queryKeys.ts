export const publicQueryKeys = {
  all: ['public'] as const,
  curriculumCatalog: () => ['public', 'curriculum-catalog'] as const,
  studyPeriods: () => ['public', 'study-periods'] as const,
  classSchedules: (studyPeriodId: number | string | null | undefined) =>
    ['public', 'class-schedules', String(studyPeriodId ?? 'none')] as const,
  dailyMenus: (date: string) => ['public', 'daily-menus', date] as const,
  curriculumPrerequisites: (year: number) =>
    ['public', 'curriculum-prerequisites', year] as const,
  semesterPlannerStaticData: (studyPeriodId?: number) =>
    [
      'public',
      'semester-planner',
      'static-data',
      studyPeriodId ?? 'none',
    ] as const,
  semesterPlannerProfessorEvaluationSummaries: () =>
    ['public', 'semester-planner', 'professor-evaluation-summaries'] as const,
  courseSituationStaticData: () =>
    ['public', 'course-situation', 'static-data'] as const,
  exchangePlaces: () => ['public', 'exchange', 'places'] as const,
  exchangeNotices: (query: unknown = {}) =>
    ['public', 'exchange', 'notices', query] as const,
  curriculumSuggestions: (catalogProgramId: string | number) =>
    ['public', 'curriculum-suggestions', catalogProgramId] as const,
  courseDetails: (courseId: string, catalogYear: number) =>
    ['public', 'curriculum', 'course-details', courseId, catalogYear] as const,
  semesterPlannerAnonymousCurriculumData: () =>
    ['public', 'semester-planner', 'anonymous-curriculum-data'] as const,
  semesterPlannerAnonymousSuggestions: (catalogProgramId: string) =>
    [
      'public',
      'semester-planner',
      'anonymous-curriculum-suggestions',
      catalogProgramId,
    ] as const,
  semesterPlannerCreationStaticData: () =>
    ['public', 'semester-planner', 'creation-static-data'] as const,
  semesterPlannerCreationSuggestions: (catalogProgramId: string) =>
    [
      'public',
      'semester-planner',
      'creation-suggestions',
      catalogProgramId,
    ] as const,
  plannerCreationSuggestions: (catalogProgramId: string) =>
    ['public', 'curriculum', 'creation-suggestions', catalogProgramId] as const,
}

export const privateQueryKeys = {
  all: ['private'] as const,
  session: (sessionSubject: string) => ['private', sessionSubject] as const,
  currentUser: (sessionSubject: string) =>
    ['private', sessionSubject, 'user', 'current'] as const,
  studentAcademicProfile: (sessionSubject: string, userId?: number | null) =>
    [
      'private',
      sessionSubject,
      'user',
      userId ?? 'none',
      'student-profile',
    ] as const,
  userInterests: (sessionSubject: string, userId?: number | null) =>
    [
      'private',
      sessionSubject,
      'user',
      userId ?? 'none',
      'tag-interests',
    ] as const,
  courseAttempts: (sessionSubject: string, userId?: number | null) =>
    [
      'private',
      sessionSubject,
      'user',
      userId ?? 'none',
      'course-attempts',
    ] as const,
  absences: (sessionSubject: string, userId?: number | null) =>
    ['private', sessionSubject, 'user', userId ?? 'none', 'absences'] as const,
  curricula: (sessionSubject: string, userId?: number | null) =>
    ['private', sessionSubject, 'user', userId ?? 'none', 'curricula'] as const,
  curriculum: (
    sessionSubject: string,
    userId?: number | null,
    curriculumId?: number,
  ) =>
    [
      'private',
      sessionSubject,
      'user',
      userId ?? 'none',
      'curricula',
      curriculumId ?? 'none',
    ] as const,
  curriculumPlannerSnapshot: (
    sessionSubject: string,
    curriculumId: number | 'draft',
  ) =>
    [
      'private',
      sessionSubject,
      'curriculum-planner',
      'snapshot',
      curriculumId,
    ] as const,
  curriculumPlannerSnapshots: (sessionSubject: string) =>
    ['private', sessionSubject, 'curriculum-planner', 'snapshot'] as const,
  semesterPlannings: (sessionSubject: string, userId?: number | null) =>
    [
      'private',
      sessionSubject,
      'user',
      userId ?? 'none',
      'semester-plannings',
    ] as const,
  semesterPlanning: (
    sessionSubject: string,
    userId: number | null | undefined,
    planningId: string | number,
  ) =>
    [
      'private',
      sessionSubject,
      'user',
      userId ?? 'none',
      'semester-plannings',
      String(planningId),
    ] as const,
  semesterPlannerSnapshot: (
    sessionSubject: string,
    planningId: string | number,
    document: unknown,
  ) =>
    [
      'private',
      sessionSubject,
      'semester-planner',
      'snapshot',
      planningId,
      document,
    ] as const,
  pendingProfessorEvaluations: (
    sessionSubject: string,
    userId: number | null | undefined,
    year: number | undefined,
    yearPeriod: string | undefined,
  ) =>
    [
      'private',
      sessionSubject,
      'user',
      userId ?? 'none',
      'professor-evaluations',
      'pending',
      year ?? 'none',
      yearPeriod ?? 'none',
    ] as const,
  professorEvaluation: (
    sessionSubject: string,
    userId: number | undefined,
    classId: number | undefined,
    professorId: number | undefined,
  ) =>
    [
      'private',
      sessionSubject,
      'user',
      userId ?? 'none',
      'professor-evaluations',
      classId ?? 'none',
      professorId ?? 'none',
    ] as const,
  exchangeSubscription: (sessionSubject: string, userId?: number | null) =>
    [
      'private',
      sessionSubject,
      'user',
      userId ?? 'none',
      'exchange-subscription',
    ] as const,
  userSocial: (sessionSubject: string, userId?: number | null) =>
    ['private', sessionSubject, 'user', userId ?? 'none', 'social'] as const,
  userSocialProfile: (sessionSubject: string, userId?: number | null) =>
    [
      ...privateQueryKeys.userSocial(sessionSubject, userId),
      'profile',
    ] as const,
  feedbackReports: (sessionSubject: string, userId?: number | null) =>
    [
      'private',
      sessionSubject,
      'user',
      userId ?? 'none',
      'feedback-reports',
    ] as const,
  userSocialFriendships: (sessionSubject: string, userId?: number | null) =>
    [
      ...privateQueryKeys.userSocial(sessionSubject, userId),
      'friendships',
    ] as const,
  userSocialPeople: (
    sessionSubject: string,
    userId: number | null | undefined,
    search: string,
  ) =>
    [
      ...privateQueryKeys.userSocial(sessionSubject, userId),
      'people',
      search,
    ] as const,
  userSocialPerson: (
    sessionSubject: string,
    userId: number | null | undefined,
    publicId: string,
  ) =>
    [
      ...privateQueryKeys.userSocial(sessionSubject, userId),
      'person',
      publicId,
    ] as const,
  userSharedPeriodPlans: (
    sessionSubject: string,
    userId: number | null | undefined,
    ownerPublicId: string,
  ) =>
    [
      ...privateQueryKeys.userSocial(sessionSubject, userId),
      'shared-period-plannings',
      ownerPublicId,
    ] as const,
  sharedPeriodPlanning: (sessionSubject: string, shareId: string) =>
    ['shared-period-planning', sessionSubject, shareId] as const,
  courseSituationClasses: (
    sessionSubject: string,
    userId: number | null | undefined,
    courseId: string,
    studyPeriodId: string,
  ) =>
    [
      'private',
      sessionSubject,
      'user',
      userId ?? 'none',
      'course-situation',
      'classes',
      courseId,
      studyPeriodId,
    ] as const,
  courseSituationEvaluation: (
    sessionSubject: string,
    userId: number | null | undefined,
    courseId: string,
    year: number | string | undefined,
  ) =>
    [
      'private',
      sessionSubject,
      'user',
      userId ?? 'none',
      'course-situation',
      'evaluation',
      courseId,
      year ?? 'none',
    ] as const,
}

export function isPrivateQueryKey(queryKey: ReadonlyArray<unknown>) {
  return queryKey[0] === privateQueryKeys.all[0]
}
