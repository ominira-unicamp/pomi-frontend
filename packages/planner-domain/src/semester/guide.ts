import type {
  CatalogProgramOption,
  CourseSelector,
  CurriculumBlocks,
} from '../curriculum/curriculumPlanner'
import type {
  SemesterClass,
  SemesterCourse,
  SemesterPlanningGuide,
} from './semesterPlanner'

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
  courseCodes?: ReadonlyArray<string>
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
      catalogProgramVariantId: null,
      languageId: null,
    },
    manualCourseIds: [],
  }
}

export function guideFromApi(value: {
  mode: 'NONE' | 'PROGRAM' | 'CURRICULUM'
  manualCourseIds: ReadonlyArray<number>
  program?: {
    catalogProgramId: number
    catalogProgramVariantId: number
    languageId: number
  }
  curriculum?:
    | { source: 'SAVED'; saved: { curriculumId: number } }
    | {
        source: 'SUGGESTION'
        suggestion: { suggestionId: number; catalogProgramId: number }
      }
}): SemesterPlanningGuide {
  const saved =
    value.curriculum?.source === 'SAVED' ? value.curriculum.saved : undefined
  const suggestion =
    value.curriculum?.source === 'SUGGESTION'
      ? value.curriculum.suggestion
      : undefined
  return {
    mode: value.mode.toLowerCase() as GuideMode,
    curriculum: {
      source: value.curriculum
        ? (value.curriculum.source.toLowerCase() as 'saved' | 'suggestion')
        : null,
      curriculumId: saved?.curriculumId ?? null,
      suggestionId: suggestion?.suggestionId ?? null,
      suggestionCatalogProgramId: suggestion?.catalogProgramId ?? null,
    },
    program: {
      catalogProgramId: value.program?.catalogProgramId ?? null,
      catalogProgramVariantId: value.program?.catalogProgramVariantId ?? null,
      languageId: value.program?.languageId ?? null,
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
  coursesById?: ReadonlyMap<number, SemesterCourse>,
): GuideClassContext {
  const courseIds = new Set<number>(manualCourseIds)
  const prefixes = new Set<string>()
  const courseCodes = new Set<string>()
  if (mode === 'curriculum') {
    for (const item of guideCourses) {
      courseIds.add(item.course.id)
      courseCodes.add(normalizeCourseCode(item.course.code))
    }
  }
  if (mode === 'program') {
    for (const group of programBlocks) {
      const requirements = [
        ...group.blocks.mandatory.map((item) => item.selector),
        ...group.blocks.electives.flatMap((item) => item.eligibleCourses),
      ]
      for (const requirement of requirements) {
        if (requirement.type === 'specificCourse') {
          courseIds.add(Number(requirement.courseId))
          const course = coursesById?.get(Number(requirement.courseId))
          if (course) courseCodes.add(normalizeCourseCode(course.code))
        }
        if (requirement.type === 'prefix')
          prefixes.add(normalizeCourseCode(requirement.prefix))
      }
    }
  }
  return {
    courseIds,
    prefixes: [...prefixes],
    courseCodes: [...courseCodes],
  }
}

export function matchesGuideClass(
  classItem: SemesterClass,
  context: GuideClassContext,
) {
  return matchesGuideCourse(
    { id: classItem.courseId, code: classItem.courseCode },
    context,
  )
}

export function matchesGuideCourse(
  course: Pick<SemesterCourse, 'id' | 'code'>,
  context: GuideClassContext,
) {
  return (
    context.courseIds.has(course.id) ||
    (context.courseCodes ?? []).includes(normalizeCourseCode(course.code)) ||
    context.prefixes.some((prefix) =>
      normalizeCourseCode(course.code).startsWith(prefix),
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
  catalogProgramVariantId: string,
  languageId: string,
) {
  if (!catalogProgram) return []
  const groups: Array<Readonly<{ title: string; blocks: CurriculumBlocks }>> = [
    { title: 'Base', blocks: catalogProgram.baseBlocks },
  ]
  const variant = catalogProgram.variants.find(
    (item) => item.id === catalogProgramVariantId,
  )
  if (variant)
    groups.push({
      title:
        variant.specializationId === null
          ? `Modalidade · ${variant.name}`
          : `Modalidade · ${variant.code}`,
      blocks: variant.blocks,
    })
  const language = catalogProgram.languages.find(
    (item) => item.id === languageId,
  )
  if (language)
    groups.push({ title: `Língua · ${language.name}`, blocks: language.blocks })
  return groups
}
