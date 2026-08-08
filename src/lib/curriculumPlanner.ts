declare const opaqueIdBrand: unique symbol

export type OpaqueId<TName extends string> = string & {
  readonly [opaqueIdBrand]: TName
}

export type CatalogId = OpaqueId<'CatalogId'>
export type CatalogProgramId = OpaqueId<'CatalogProgramId'>
export type ProgramId = OpaqueId<'ProgramId'>
export type SpecializationId = OpaqueId<'SpecializationId'>
export type LanguageId = OpaqueId<'LanguageId'>
export type CourseId = OpaqueId<'CourseId'>
export type PrefixId = OpaqueId<'PrefixId'>
export type RequirementId = OpaqueId<'RequirementId'>
export type PlanningPeriodId = OpaqueId<'PlanningPeriodId'>
export type ElectivePlaceholderId = OpaqueId<'ElectivePlaceholderId'>
export type PlannerRevision = OpaqueId<'PlannerRevision'>

export type Course = Readonly<{
  id: CourseId
  code: string
  name: string
  credits: number
  prefixId?: PrefixId
  prefix?: string
}>

export type SpecializationOption = Readonly<{
  id: SpecializationId
  code: string
  name: string
  blocks: CurriculumBlocks
}>

export type LanguageOption = Readonly<{
  id: LanguageId
  name: string
  blocks: CurriculumBlocks
}>

export type CatalogProgramOption = Readonly<{
  id: CatalogProgramId
  title: string
  catalog: Readonly<{
    id: CatalogId
    year: number
  }>
  program: Readonly<{
    id: ProgramId
    code: string
    name: string
  }>
  baseBlocks: CurriculumBlocks
  specializations: ReadonlyArray<SpecializationOption>
  languages: ReadonlyArray<LanguageOption>
}>

export type CurriculumSelection = Readonly<{
  catalogProgramId?: CatalogProgramId
  specializationId?: SpecializationId
  languageId?: LanguageId
}>

export type RequirementSource =
  | Readonly<{ type: 'base' }>
  | Readonly<{
      type: 'specialization'
      specializationId: SpecializationId
    }>
  | Readonly<{
      type: 'language'
      languageId: LanguageId
    }>

export type CourseSelector =
  | Readonly<{ type: 'anyCourse' }>
  | Readonly<{
      type: 'prefix'
      prefixId: PrefixId
      prefix: string
    }>
  | Readonly<{
      type: 'specificCourse'
      courseId: CourseId
    }>

export type CourseRequirement = Readonly<{
  id: RequirementId
  type: 'course'
  source: RequirementSource
  selector: CourseSelector
}>

export type ElectiveCreditsRequirement = Readonly<{
  id: RequirementId
  type: 'electiveCredits'
  source: RequirementSource
  requiredCredits: number
  eligibleCourses: ReadonlyArray<CourseSelector>
}>

export type CurriculumRequirement =
  | CourseRequirement
  | ElectiveCreditsRequirement

export type CurriculumBlocks = Readonly<{
  mandatory: ReadonlyArray<CourseRequirement>
  electives: ReadonlyArray<ElectiveCreditsRequirement>
}>

export type CurriculumDefinition = Readonly<{
  catalogProgramId: CatalogProgramId
  title: string
  requirements: ReadonlyArray<CurriculumRequirement>
}>

export type PlannedCourse = Readonly<{
  type: 'course'
  courseId: CourseId
}>

export type ElectivePlaceholder = Readonly<{
  type: 'electivePlaceholder'
  id: ElectivePlaceholderId
  requirementId: RequirementId
  credits: number
}>

export type PlannedItem = PlannedCourse | ElectivePlaceholder

export type PlanningPeriod = Readonly<{
  id: PlanningPeriodId
  label?: string
  items: ReadonlyArray<PlannedItem>
}>

export type CurriculumPlan = Readonly<{
  currentPeriodId?: PlanningPeriodId
  periods: ReadonlyArray<PlanningPeriod>
}>

export type CompletedCourse = Readonly<{
  courseId: CourseId
  periodId?: PlanningPeriodId
}>

export type AcademicRecord = Readonly<{
  completedCourses: ReadonlyArray<CompletedCourse>
}>

export type CourseSituation =
  | 'completed'
  | 'inProgress'
  | 'planned'
  | 'notPlanned'

export type EvaluatedCourse = Readonly<{
  courseId: CourseId
  situation: CourseSituation
  periodId?: PlanningPeriodId
  contributesTo: ReadonlyArray<RequirementId>
}>

export type RequirementProgressStatus =
  | 'notStarted'
  | 'partiallySatisfied'
  | 'satisfied'

export type RequirementProgress = Readonly<{
  requirementId: RequirementId
  status: RequirementProgressStatus
  completedCredits: number
  inProgressCredits: number
  plannedCredits: number
  reservedCredits: number
  contributingCourseIds: ReadonlyArray<CourseId>
  placeholderIds: ReadonlyArray<ElectivePlaceholderId>
}>

export type CurriculumCreditTotals = Readonly<{
  completed: number
  inProgress: number
  planned: number
  reservedElective: number
}>

export type PlannerFindingCode =
  | 'incompleteSelection'
  | 'missingRequirement'
  | 'insufficientCredits'
  | 'courseDoesNotContribute'
  | 'completedCoursePlannedAgain'
  | 'electivePlaceholderDoesNotContribute'
  | 'electivePlaceholderExceedsRequirement'

export type PlannerFindingSeverity = 'info' | 'warning' | 'error'

export type PlannerFindingReference =
  | Readonly<{ type: 'selection' }>
  | Readonly<{ type: 'course'; courseId: CourseId }>
  | Readonly<{ type: 'requirement'; requirementId: RequirementId }>
  | Readonly<{ type: 'period'; periodId: PlanningPeriodId }>
  | Readonly<{
      type: 'electivePlaceholder'
      placeholderId: ElectivePlaceholderId
    }>

export type PlannerFinding = Readonly<{
  code: PlannerFindingCode
  severity: PlannerFindingSeverity
  references: ReadonlyArray<PlannerFindingReference>
}>

export type CurriculumEvaluation = Readonly<{
  credits: CurriculumCreditTotals
  courses: ReadonlyArray<EvaluatedCourse>
  requirements: ReadonlyArray<RequirementProgress>
  findings: ReadonlyArray<PlannerFinding>
}>

export type CurriculumPlannerStaticData = Readonly<{
  catalogPrograms: ReadonlyArray<CatalogProgramOption>
  courses: ReadonlyArray<Course>
}>

export type CurriculumPlannerSnapshot = Readonly<{
  revision: PlannerRevision
  selection: CurriculumSelection
  plan: CurriculumPlan
  academicRecord: AcademicRecord
  curriculum?: CurriculumDefinition
  evaluation?: CurriculumEvaluation
}>

export type PlannerEntityType =
  | 'catalogProgram'
  | 'specialization'
  | 'language'
  | 'course'
  | 'requirement'
  | 'planningPeriod'
  | 'electivePlaceholder'

export type PlannerSelectionField =
  | 'catalogProgramId'
  | 'specializationId'
  | 'languageId'

export type PlannerError =
  | Readonly<{
      code: 'duplicateCourse'
      retryable: false
      details: Readonly<{ courseId: CourseId }>
    }>
  | Readonly<{
      code: 'invalidInput'
      retryable: false
      details: Readonly<{
        field: string
        reason: 'required' | 'outOfRange' | 'incompatible'
      }>
    }>
  | Readonly<{
      code: 'invalidSelection'
      retryable: false
      details: Readonly<{
        field: PlannerSelectionField
        id: string
      }>
    }>
  | Readonly<{
      code: 'notFound'
      retryable: false
      details: Readonly<{
        entity: PlannerEntityType
        id: string
      }>
    }>
  | Readonly<{
      code: 'conflict'
      retryable: true
      details: Readonly<{
        expectedRevision: PlannerRevision
        currentRevision?: PlannerRevision
      }>
    }>
  | Readonly<{
      code: 'unavailable'
      retryable: true
    }>
  | Readonly<{
      code: 'unexpected'
      retryable: false
    }>

export type PlannerResult<T = void> =
  | Readonly<{
      ok: true
      value: T
    }>
  | Readonly<{
      ok: false
      error: PlannerError
    }>

export type PlannerCommandContext = Readonly<{
  expectedRevision: PlannerRevision
}>

export type PlanningPeriodPosition =
  | Readonly<{ type: 'start' }>
  | Readonly<{ type: 'end' }>
  | Readonly<{
      type: 'after'
      periodId: PlanningPeriodId
    }>

export type CurriculumPlannerCommand =
  | Readonly<{
      type: 'selectCatalogProgram'
      catalogProgramId: CatalogProgramId | null
    }>
  | Readonly<{
      type: 'selectSpecialization'
      specializationId: SpecializationId | null
    }>
  | Readonly<{
      type: 'selectLanguage'
      languageId: LanguageId | null
    }>
  | Readonly<{
      type: 'addPlanningPeriod'
      label?: string
      position: PlanningPeriodPosition
    }>
  | Readonly<{
      type: 'renamePlanningPeriod'
      periodId: PlanningPeriodId
      label: string | null
    }>
  | Readonly<{
      type: 'movePlanningPeriod'
      periodId: PlanningPeriodId
      position: PlanningPeriodPosition
    }>
  | Readonly<{
      type: 'removePlanningPeriod'
      periodId: PlanningPeriodId
    }>
  | Readonly<{
      type: 'setCurrentPlanningPeriod'
      periodId: PlanningPeriodId | null
    }>
  | Readonly<{
      type: 'addCourseToPeriod'
      courseId: CourseId
      periodId: PlanningPeriodId
    }>
  | Readonly<{
      type: 'moveCourseToPeriod'
      courseId: CourseId
      periodId: PlanningPeriodId
    }>
  | Readonly<{
      type: 'removeCourseFromPlan'
      courseId: CourseId
    }>
  | Readonly<{
      type: 'addElectivePlaceholder'
      periodId: PlanningPeriodId
      requirementId: RequirementId
      credits: number
    }>
  | Readonly<{
      type: 'updateElectivePlaceholderCredits'
      placeholderId: ElectivePlaceholderId
      credits: number
    }>
  | Readonly<{
      type: 'moveElectivePlaceholder'
      placeholderId: ElectivePlaceholderId
      periodId: PlanningPeriodId
    }>
  | Readonly<{
      type: 'removeElectivePlaceholder'
      placeholderId: ElectivePlaceholderId
    }>
  | Readonly<{
      type: 'markCourseCompleted'
      courseId: CourseId
      periodId: PlanningPeriodId | null
    }>
  | Readonly<{
      type: 'unmarkCourseCompleted'
      courseId: CourseId
    }>

export interface CurriculumPlanner {
  getStaticData: () => Promise<PlannerResult<CurriculumPlannerStaticData>>
  getSnapshot: () => Promise<PlannerResult<CurriculumPlannerSnapshot>>
  dispatch: (
    command: CurriculumPlannerCommand,
    context: PlannerCommandContext,
  ) => Promise<PlannerResult>
}
