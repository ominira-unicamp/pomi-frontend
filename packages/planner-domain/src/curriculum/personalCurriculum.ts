import { catalogProgramVariantForSelection } from './curriculumPlanner'
import { courseMatchesSelector } from './electiveCredits'
import type {
  CatalogProgramOption,
  Course,
  CourseId,
  CourseSelector,
  CurriculumBlocks,
  LanguageId,
} from './curriculumPlanner'

export type RecordedCourseFacts = Readonly<{
  courseId: CourseId
  approved: boolean
  enrolled: boolean
}>

export type PersonalCurriculumCourse = Readonly<{
  course: Course
  approved: boolean
  enrolled: boolean
  attemptCount: number
}>

export type PersonalCurriculumGroup = Readonly<{
  key: string
  title: string
  kind: 'mandatory' | 'elective'
  requiredCredits?: number
  selectors: ReadonlyArray<CourseSelector>
  courses: ReadonlyArray<PersonalCurriculumCourse>
  unresolvedSelectors: ReadonlyArray<CourseSelector>
}>

export function buildPersonalCurriculum({
  program,
  specializationId,
  languageId,
  courses,
  records,
}: {
  program: CatalogProgramOption
  specializationId?: number | null
  languageId?: LanguageId
  courses: ReadonlyArray<Course>
  records: ReadonlyArray<RecordedCourseFacts>
}) {
  const variant = catalogProgramVariantForSelection(program, specializationId)
  const language = program.languages.find((item) => item.id === languageId)
  const sources: Array<{
    key: string
    title: string
    blocks: CurriculumBlocks
  }> = [{ key: 'base', title: 'Núcleo comum', blocks: program.baseBlocks }]
  if (variant)
    sources.push({
      key: `variant-${variant.id}`,
      title: variant.name,
      blocks: variant.blocks,
    })
  if (language)
    sources.push({
      key: `language-${language.id}`,
      title: language.name,
      blocks: language.blocks,
    })

  const facts = new Map<
    CourseId,
    { approved: boolean; enrolled: boolean; attemptCount: number }
  >()
  for (const record of records) {
    const previous = facts.get(record.courseId)
    facts.set(record.courseId, {
      approved: record.approved || previous?.approved === true,
      enrolled: record.enrolled || previous?.enrolled === true,
      attemptCount: (previous?.attemptCount ?? 0) + 1,
    })
  }
  const distinctCourses = [
    ...new Map(courses.map((course) => [course.id, course])).values(),
  ]
  const courseIds = new Set(distinctCourses.map((course) => course.id))
  const groups: Array<PersonalCurriculumGroup> = []
  for (const source of sources) {
    const addGroup = (
      key: string,
      kind: PersonalCurriculumGroup['kind'],
      selectors: ReadonlyArray<CourseSelector>,
      requiredCredits?: number,
    ) => {
      const resolvedSelectors = selectors.filter(
        (selector) => kind === 'elective' || selector.type === 'specificCourse',
      )
      groups.push({
        key,
        title: source.title,
        kind,
        requiredCredits,
        selectors,
        unresolvedSelectors: selectors.filter((selector) =>
          selector.type === 'specificCourse'
            ? !courseIds.has(selector.courseId)
            : kind === 'mandatory',
        ),
        courses: distinctCourses
          .filter((course) =>
            resolvedSelectors.some((selector) =>
              courseMatchesSelector(course, selector),
            ),
          )
          .map((course) => ({
            course,
            ...(facts.get(course.id) ?? {
              approved: false,
              enrolled: false,
              attemptCount: 0,
            }),
          })),
      })
    }
    if (source.blocks.mandatory.length)
      addGroup(
        `${source.key}-mandatory`,
        'mandatory',
        source.blocks.mandatory.map((requirement) => requirement.selector),
      )
    source.blocks.electives.forEach((requirement, index) =>
      addGroup(
        `${source.key}-elective-${index}`,
        'elective',
        requirement.eligibleCourses,
        requirement.requiredCredits,
      ),
    )
  }
  const mandatory = [
    ...new Map(
      groups
        .filter((group) => group.kind === 'mandatory')
        .flatMap((group) => group.courses)
        .map((item) => [item.course.id, item]),
    ).values(),
  ]

  return {
    groups,
    mandatoryCount: mandatory.length,
    approvedMandatoryCount: mandatory.filter((item) => item.approved).length,
    missingVariant: program.variants.length > 0 && !variant,
    missingLanguage: program.languages.length > 0 && !language,
  }
}
