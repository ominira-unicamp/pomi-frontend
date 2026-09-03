import type {
  CatalogProgramOption,
  Course,
  CourseId,
  CourseSelector,
  CurriculumBlocks,
  CurriculumPlannerSnapshot,
  CurriculumPlannerStaticData,
  ElectiveCreditsRequirement,
  PlanningPeriodId,
} from './curriculumPlanner'

export type CurriculumCourseState = Readonly<{
  course: Course
  plannedPeriodId?: PlanningPeriodId
  completed: boolean
}>

export type CurriculumBlockView = Readonly<{
  id: string
  title: string
  requiredCredits?: number
  requirement?: ElectiveCreditsRequirement
  selectorLabels: ReadonlyArray<string>
  courses: ReadonlyArray<CurriculumCourseState>
}>

export type CurriculumGroupView = Readonly<{
  id: string
  title: string
  mandatory?: CurriculumBlockView
  electives: ReadonlyArray<CurriculumBlockView>
}>

type CurriculumBlockDefinition = Omit<CurriculumBlockView, 'courses'> &
  Readonly<{ courses: ReadonlyArray<Course> }>

type CurriculumGroupDefinition = Omit<
  CurriculumGroupView,
  'mandatory' | 'electives'
> &
  Readonly<{
    mandatory?: CurriculumBlockDefinition
    electives: ReadonlyArray<CurriculumBlockDefinition>
  }>

const definitionsByStaticData = new WeakMap<
  CurriculumPlannerStaticData,
  Map<string, ReadonlyArray<CurriculumGroupDefinition>>
>()
const viewsByStaticData = new WeakMap<
  CurriculumPlannerStaticData,
  Map<string, ReadonlyArray<CurriculumGroupView>>
>()

function coursesForSelector(
  selector: CourseSelector,
  courses: ReadonlyArray<Course>,
) {
  if (selector.type === 'anyCourse') return courses
  if (selector.type === 'specificCourse') {
    return courses.filter((course) => course.id === selector.courseId)
  }
  const prefix = selector.prefix.trim().toUpperCase()
  return courses.filter(
    (course) => course.prefix?.trim().toUpperCase() === prefix,
  )
}

function distinctCourses(
  selectors: ReadonlyArray<CourseSelector>,
  courses: ReadonlyArray<Course>,
) {
  const result = new Map<CourseId, Course>()
  for (const selector of selectors) {
    for (const course of coursesForSelector(selector, courses)) {
      result.set(course.id, course)
    }
  }
  return [...result.values()].sort((left, right) =>
    left.code.localeCompare(right.code),
  )
}

function courseStates(
  courses: ReadonlyArray<Course>,
  completed: ReadonlySet<CourseId>,
  planned: ReadonlySet<CourseId>,
) {
  return courses
    .filter((course) => !completed.has(course.id) && !planned.has(course.id))
    .map((course) => ({ course, completed: false }))
}

export function curriculumAvailabilityKey(snapshot: CurriculumPlannerSnapshot) {
  const completed = snapshot.academicRecord.completedCourses
    .map((course) => course.courseId)
    .sort()
  const planned = new Set<CourseId>()
  for (const period of snapshot.plan.periods) {
    for (const item of period.items) planned.add(item.courseId)
  }
  for (const courseId of snapshot.plan.unallocatedCourseIds ?? [])
    planned.add(courseId)
  return `${completed.join(',')}|${[...planned].sort().join(',')}`
}

function electiveSelectorLabels(selectors: ReadonlyArray<CourseSelector>) {
  return [
    ...new Set(
      selectors.flatMap((selector) => {
        if (selector.type === 'prefix')
          return [selector.prefix.trim().toUpperCase()]
        if (selector.type === 'anyCourse') return ['Qualquer disciplina']
        return []
      }),
    ),
  ].sort((left, right) => left.localeCompare(right))
}

function groupDefinitionFromBlocks(
  id: string,
  title: string,
  blocks: CurriculumBlocks,
  staticData: CurriculumPlannerStaticData,
): CurriculumGroupDefinition {
  const mandatoryCourses = distinctCourses(
    blocks.mandatory.map((requirement) => requirement.selector),
    staticData.courses,
  )
  return {
    id,
    title,
    mandatory: mandatoryCourses.length
      ? {
          id: `${id}:mandatory`,
          title: 'Obrigatórias',
          selectorLabels: [],
          courses: mandatoryCourses,
        }
      : undefined,
    electives: blocks.electives.map((requirement, index) => ({
      id: `${id}:elective:${index}`,
      title: 'Bloco eletivo',
      requiredCredits: requirement.requiredCredits,
      requirement,
      selectorLabels: electiveSelectorLabels(requirement.eligibleCourses),
      courses: distinctCourses(
        requirement.eligibleCourses.filter(
          (selector) => selector.type === 'specificCourse',
        ),
        staticData.courses,
      ),
    })),
  }
}

function selectedCatalogProgram(
  staticData: CurriculumPlannerStaticData,
  snapshot: CurriculumPlannerSnapshot,
): CatalogProgramOption | undefined {
  return staticData.catalogPrograms.find(
    (program) => program.id === snapshot.selection.catalogProgramId,
  )
}

export function buildCurriculumGroups(
  staticData: CurriculumPlannerStaticData,
  snapshot: CurriculumPlannerSnapshot,
) {
  const selectionKey = [
    snapshot.selection.catalogProgramId ?? '',
    snapshot.selection.specializationId ?? '',
    snapshot.selection.languageId ?? '',
  ].join(':')
  const availabilityKey = curriculumAvailabilityKey(snapshot)
  const viewKey = `${selectionKey}|${availabilityKey}`
  const cachedViews = viewsByStaticData.get(staticData)?.get(viewKey)
  if (cachedViews) return cachedViews
  const program = selectedCatalogProgram(staticData, snapshot)
  if (!program) return []
  let definitions = definitionsByStaticData.get(staticData)?.get(selectionKey)
  if (!definitions) {
    const next: Array<CurriculumGroupDefinition> = [
      groupDefinitionFromBlocks('base', 'Base', program.baseBlocks, staticData),
    ]
    const specialization = program.specializations.find(
      (option) => option.id === snapshot.selection.specializationId,
    )
    if (specialization) {
      next.push(
        groupDefinitionFromBlocks(
          `specialization:${specialization.id}`,
          `Habilitação · ${specialization.code} — ${specialization.name}`,
          specialization.blocks,
          staticData,
        ),
      )
    }
    const language = program.languages.find(
      (option) => option.id === snapshot.selection.languageId,
    )
    if (language) {
      next.push(
        groupDefinitionFromBlocks(
          `language:${language.id}`,
          `Língua · ${language.name}`,
          language.blocks,
          staticData,
        ),
      )
    }
    definitions = next
    const definitionCache = definitionsByStaticData.get(staticData) ?? new Map()
    definitionCache.set(selectionKey, definitions)
    definitionsByStaticData.set(staticData, definitionCache)
  }
  const completed = new Set(
    snapshot.academicRecord.completedCourses.map((course) => course.courseId),
  )
  const planned = new Set<CourseId>()
  for (const period of snapshot.plan.periods) {
    for (const item of period.items) planned.add(item.courseId)
  }
  for (const courseId of snapshot.plan.unallocatedCourseIds ?? [])
    planned.add(courseId)
  const groups = definitions.map((group) => ({
    ...group,
    mandatory: group.mandatory
      ? {
          ...group.mandatory,
          courses: courseStates(group.mandatory.courses, completed, planned),
        }
      : undefined,
    electives: group.electives.map((block) => ({
      ...block,
      courses: courseStates(block.courses, completed, planned),
    })),
  }))
  const viewCache = viewsByStaticData.get(staticData) ?? new Map()
  viewCache.set(viewKey, groups)
  viewsByStaticData.set(staticData, viewCache)
  return groups
}
