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
  exchangeNotices: () => ['public', 'exchange', 'notices'] as const,
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
  currentStudent: (sessionSubject: string) =>
    ['private', sessionSubject, 'student', 'current'] as const,
  studentProfile: (sessionSubject: string, studentId?: number | null) =>
    [
      'private',
      sessionSubject,
      'student',
      studentId ?? 'none',
      'profile',
    ] as const,
  courseAttempts: (sessionSubject: string, studentId?: number | null) =>
    [
      'private',
      sessionSubject,
      'student',
      studentId ?? 'none',
      'course-attempts',
    ] as const,
  absences: (sessionSubject: string, studentId?: number | null) =>
    [
      'private',
      sessionSubject,
      'student',
      studentId ?? 'none',
      'absences',
    ] as const,
  curricula: (sessionSubject: string, studentId?: number | null) =>
    [
      'private',
      sessionSubject,
      'student',
      studentId ?? 'none',
      'curricula',
    ] as const,
  curriculum: (
    sessionSubject: string,
    studentId?: number | null,
    curriculumId?: number,
  ) =>
    [
      'private',
      sessionSubject,
      'student',
      studentId ?? 'none',
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
  semesterPlannings: (sessionSubject: string, studentId?: number | null) =>
    [
      'private',
      sessionSubject,
      'student',
      studentId ?? 'none',
      'semester-plannings',
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
    studentId: number | null | undefined,
    year: number | undefined,
    yearPeriod: string | undefined,
  ) =>
    [
      'private',
      sessionSubject,
      'student',
      studentId ?? 'none',
      'professor-evaluations',
      'pending',
      year ?? 'none',
      yearPeriod ?? 'none',
    ] as const,
  professorEvaluation: (
    sessionSubject: string,
    studentId: number | undefined,
    classId: number | undefined,
    professorId: number | undefined,
  ) =>
    [
      'private',
      sessionSubject,
      'student',
      studentId ?? 'none',
      'professor-evaluations',
      classId ?? 'none',
      professorId ?? 'none',
    ] as const,
  exchangeSubscription: (sessionSubject: string, studentId?: number | null) =>
    [
      'private',
      sessionSubject,
      'student',
      studentId ?? 'none',
      'exchange-subscription',
    ] as const,
  studentSocial: (sessionSubject: string, studentId?: number | null) =>
    [
      'private',
      sessionSubject,
      'student',
      studentId ?? 'none',
      'social',
    ] as const,
  studentSocialProfile: (sessionSubject: string, studentId?: number | null) =>
    [
      ...privateQueryKeys.studentSocial(sessionSubject, studentId),
      'profile',
    ] as const,
  studentSocialFriendships: (
    sessionSubject: string,
    studentId?: number | null,
  ) =>
    [
      ...privateQueryKeys.studentSocial(sessionSubject, studentId),
      'friendships',
    ] as const,
  studentSocialPeople: (
    sessionSubject: string,
    studentId: number | null | undefined,
    search: string,
  ) =>
    [
      ...privateQueryKeys.studentSocial(sessionSubject, studentId),
      'people',
      search,
    ] as const,
  courseSituationClasses: (
    sessionSubject: string,
    studentId: number | null | undefined,
    courseId: string,
    studyPeriodId: string,
  ) =>
    [
      'private',
      sessionSubject,
      'student',
      studentId ?? 'none',
      'course-situation',
      'classes',
      courseId,
      studyPeriodId,
    ] as const,
  courseSituationEvaluation: (
    sessionSubject: string,
    studentId: number | null | undefined,
    courseId: string,
    year: number | string | undefined,
  ) =>
    [
      'private',
      sessionSubject,
      'student',
      studentId ?? 'none',
      'course-situation',
      'evaluation',
      courseId,
      year ?? 'none',
    ] as const,
}

export function isPrivateQueryKey(queryKey: ReadonlyArray<unknown>) {
  return queryKey[0] === privateQueryKeys.all[0]
}
