import type {
  CatalogProgramOption,
  CourseSelector,
  CurriculumBlocks,
} from '@/planner/domain/curriculumPlanner'
import type {
  SemesterClass,
  SemesterCourse,
  SemesterPlanningGuide,
} from '@/semester-planner/domain/semesterPlanner'

export type GuideMode = 'curriculum' | 'program' | 'none'

export type GuideChanges = Readonly<{
  mode?: GuideMode
  curriculum?: Partial<SemesterPlanningGuide['curriculum']>
  program?: Partial<SemesterPlanningGuide['program']>
  manualCourseIds?: ReadonlyArray<number>
}>

export type GuideClassContext = Readonly<{
  courseIds: ReadonlySet<number>
  prefixes: ReadonlyArray<string>
}>

export function emptyGuide(): SemesterPlanningGuide {
  return {
    mode: 'none',
    curriculum: {
      source: null,
      curriculumId: null,
      suggestionId: null,
      suggestionCatalogProgramId: null,
    },
    program: {
      catalogProgramId: null,
      specializationId: null,
      languageId: null,
    },
    manualCourseIds: [],
  }
}

export function guideFromApi(value: {
  mode: 'CURRICULUM' | 'PROGRAM' | 'NONE'
  curriculumSource: 'SAVED' | 'SUGGESTION' | null
  curriculumId: number | null
  suggestionId: number | null
  suggestionCatalogProgramId: number | null
  catalogProgramId: number | null
  specializationId: number | null
  languageId: number | null
  manualCourseIds: ReadonlyArray<number>
}): SemesterPlanningGuide {
  return {
    mode: value.mode.toLowerCase() as GuideMode,
    curriculum: {
      source: value.curriculumSource?.toLowerCase() as
        | 'saved'
        | 'suggestion'
        | null,
      curriculumId: value.curriculumId,
      suggestionId: value.suggestionId,
      suggestionCatalogProgramId: value.suggestionCatalogProgramId,
    },
    program: {
      catalogProgramId: value.catalogProgramId,
      specializationId: value.specializationId,
      languageId: value.languageId,
    },
    manualCourseIds: value.manualCourseIds,
  }
}

export function numericId(value: string) {
  const parsed = Number(value)
  return Number.isInteger(parsed) ? parsed : null
}

function normalizeCourseCode(value: string) {
  return value.toUpperCase().replace(/[\s-]/g, '')
}

export function buildGuideClassContext(
  mode: GuideMode,
  guideCourses: ReadonlyArray<{ course: SemesterCourse }>,
  programBlocks: ReadonlyArray<Readonly<{ blocks: CurriculumBlocks }>>,
  manualCourseIds: ReadonlyArray<number>,
): GuideClassContext {
  const courseIds = new Set<number>(manualCourseIds)
  const prefixes = new Set<string>()
  if (mode === 'curriculum') {
    for (const item of guideCourses) courseIds.add(item.course.id)
  }
  if (mode === 'program') {
    for (const group of programBlocks) {
      const requirements = [
        ...group.blocks.mandatory,
        ...group.blocks.electives.flatMap((item) => item.eligibleCourses),
      ]
      for (const requirement of requirements) {
        if (requirement.type === 'specificCourse')
          courseIds.add(Number(requirement.courseId))
        if (requirement.type === 'prefix')
          prefixes.add(normalizeCourseCode(requirement.prefix))
      }
    }
  }
  return { courseIds, prefixes: [...prefixes] }
}

export function matchesGuideClass(
  classItem: SemesterClass,
  context: GuideClassContext,
) {
  return (
    context.courseIds.has(classItem.courseId) ||
    context.prefixes.some((prefix) =>
      normalizeCourseCode(classItem.courseCode).startsWith(prefix),
    )
  )
}

export function selectorLabel(selector: CourseSelector, courseCode?: string) {
  if (selector.type === 'specificCourse') return courseCode ?? 'Disciplina'
  if (selector.type === 'prefix') return `${selector.prefix}---`
  return 'Qualquer disciplina'
}

export function programGuideBlocks(
  catalogProgram: CatalogProgramOption | undefined,
  specializationId: string,
  languageId: string,
) {
  if (!catalogProgram) return []
  const groups: Array<Readonly<{ title: string; blocks: CurriculumBlocks }>> = [
    { title: 'Base', blocks: catalogProgram.baseBlocks },
  ]
  const specialization = catalogProgram.specializations.find(
    (item) => item.id === specializationId,
  )
  if (specialization)
    groups.push({
      title: `Habilitação · ${specialization.code}`,
      blocks: specialization.blocks,
    })
  const language = catalogProgram.languages.find(
    (item) => item.id === languageId,
  )
  if (language)
    groups.push({ title: `Língua · ${language.name}`, blocks: language.blocks })
  return groups
}
