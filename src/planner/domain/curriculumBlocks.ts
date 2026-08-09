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
} from '@/planner/domain/curriculumPlanner'

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
  snapshot: CurriculumPlannerSnapshot,
) {
  const completed = new Set(
    snapshot.academicRecord.completedCourses.map((course) => course.courseId),
  )
  const planned = new Map<CourseId, PlanningPeriodId>()
  for (const period of snapshot.plan.periods) {
    for (const item of period.items) {
      planned.set(item.courseId, period.id)
    }
  }
  return courses
    .filter((course) => !completed.has(course.id) && !planned.has(course.id))
    .map((course) => ({
      course,
      plannedPeriodId: planned.get(course.id),
      completed: false,
    }))
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

function groupFromBlocks(
  id: string,
  title: string,
  blocks: CurriculumBlocks,
  staticData: CurriculumPlannerStaticData,
  snapshot: CurriculumPlannerSnapshot,
): CurriculumGroupView {
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
          courses: courseStates(mandatoryCourses, snapshot),
        }
      : undefined,
    electives: blocks.electives.map((requirement, index) => ({
      id: `${id}:elective:${index}`,
      title: 'Bloco eletivo',
      requiredCredits: requirement.requiredCredits,
      requirement,
      selectorLabels: electiveSelectorLabels(requirement.eligibleCourses),
      courses: courseStates(
        distinctCourses(
          requirement.eligibleCourses.filter(
            (selector) => selector.type === 'specificCourse',
          ),
          staticData.courses,
        ),
        snapshot,
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
  const program = selectedCatalogProgram(staticData, snapshot)
  if (!program) return []
  const groups: Array<CurriculumGroupView> = [
    groupFromBlocks('base', 'Base', program.baseBlocks, staticData, snapshot),
  ]
  const specialization = program.specializations.find(
    (option) => option.id === snapshot.selection.specializationId,
  )
  if (specialization) {
    groups.push(
      groupFromBlocks(
        `specialization:${specialization.id}`,
        `Habilitação · ${specialization.code} — ${specialization.name}`,
        specialization.blocks,
        staticData,
        snapshot,
      ),
    )
  }
  const language = program.languages.find(
    (option) => option.id === snapshot.selection.languageId,
  )
  if (language) {
    groups.push(
      groupFromBlocks(
        `language:${language.id}`,
        `Língua · ${language.name}`,
        language.blocks,
        staticData,
        snapshot,
      ),
    )
  }
  return groups
}
