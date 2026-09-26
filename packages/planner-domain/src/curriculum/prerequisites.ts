import type {
  Course,
  CourseId,
  CurriculumPlannerSnapshot,
} from './curriculumPlanner'

export type PrerequisiteFulfillment = 'FULL' | 'PARTIAL'

export type SpecialRequirementType = 'AUTHORIZATION' | 'PROGRESSION_COEFFICIENT'

export type PrerequisiteTarget =
  | Readonly<{
      type: 'course'
      courseId: CourseId
      fulfillment: PrerequisiteFulfillment
    }>
  | Readonly<{
      type: 'unresolvedCourse'
      fulfillment: PrerequisiteFulfillment
    }>
  | Readonly<{
      type: 'special'
      requirementType: SpecialRequirementType
      value: number
    }>

export type PrerequisiteItem = Readonly<{ target: PrerequisiteTarget }>

export function specialRequirementCode(
  type: SpecialRequirementType,
  value: number,
) {
  if (type === 'AUTHORIZATION') return 'AA200'
  return `AA4${String(value).padStart(2, '0')}`
}

export type PrerequisiteAlternative = Readonly<{
  key: string
  allOf: ReadonlyArray<PrerequisiteItem>
}>

export type CoursePrerequisiteRule = Readonly<{
  courseId: CourseId
  alternatives: ReadonlyArray<PrerequisiteAlternative>
}>

export type PrerequisiteItemStatus =
  | 'completed'
  | 'plannedBefore'
  | 'samePeriod'
  | 'plannedAfter'
  | 'unallocated'
  | 'missing'
  | 'notInCatalog'
  | 'unknown'

export type PrerequisiteItemEvaluation = Readonly<{
  item: PrerequisiteItem
  status: PrerequisiteItemStatus
  matchedCourseId?: CourseId
  matchedCourseCode?: string
}>

export type PrerequisiteAlternativeEvaluation = Readonly<{
  key: string
  items: ReadonlyArray<PrerequisiteItemEvaluation>
}>

export type CoursePrerequisiteEvaluation = Readonly<{
  courseId: CourseId
  automaticAlternativeKey: string | null
  selectedAlternativeKey: string | null
  alternatives: ReadonlyArray<PrerequisiteAlternativeEvaluation>
  issues: ReadonlyArray<'missing' | 'notInCatalog' | 'inverted'>
}>

export type PrerequisiteLink = Readonly<{
  prerequisiteCourseId: CourseId
  dependentCourseId: CourseId
  status: Extract<
    PrerequisiteItemStatus,
    'completed' | 'plannedBefore' | 'samePeriod' | 'plannedAfter'
  >
}>

export type PrerequisiteEvaluation = Readonly<{
  courses: ReadonlyMap<CourseId, CoursePrerequisiteEvaluation>
  links: ReadonlyArray<PrerequisiteLink>
}>

export function prerequisiteAlternativeKey(
  items: ReadonlyArray<PrerequisiteItem>,
) {
  return items
    .map((item) => {
      const target = item.target
      if (target.type === 'course')
        return `course:${target.courseId}:${target.fulfillment}`
      if (target.type === 'unresolvedCourse')
        return `unresolved-course:${target.fulfillment}`
      return `special:${target.requirementType}:${target.value}`
    })
    .sort()
    .join('+')
}

function plannedPositions(snapshot: CurriculumPlannerSnapshot) {
  const positions = new Map<CourseId, number>()
  snapshot.plan.periods.forEach((period, index) => {
    for (const item of period.items) positions.set(item.courseId, index)
  })
  return positions
}

function stateForCourse(
  courseId: CourseId,
  dependentPosition: number | undefined,
  completed: ReadonlySet<CourseId>,
  positions: ReadonlyMap<CourseId, number>,
  unallocated: ReadonlySet<CourseId>,
): PrerequisiteItemStatus {
  if (completed.has(courseId)) return 'completed'
  const position = positions.get(courseId)
  if (position !== undefined && dependentPosition !== undefined) {
    if (position < dependentPosition) return 'plannedBefore'
    if (position === dependentPosition) return 'samePeriod'
    return 'plannedAfter'
  }
  if (position !== undefined) return 'plannedBefore'
  if (unallocated.has(courseId)) return 'unallocated'
  return 'missing'
}

function evaluateItem(
  item: PrerequisiteItem,
  dependentPosition: number | undefined,
  coursesById: ReadonlyMap<CourseId, Course>,
  completed: ReadonlySet<CourseId>,
  positions: ReadonlyMap<CourseId, number>,
  unallocated: ReadonlySet<CourseId>,
  catalogCourseIds?: ReadonlySet<CourseId>,
): PrerequisiteItemEvaluation {
  const target = item.target
  if (target.type !== 'course') return { item, status: 'unknown' }
  if (catalogCourseIds) {
    if (!catalogCourseIds.has(target.courseId))
      return { item, status: 'notInCatalog' }
  }
  const matchedCourse = coursesById.get(target.courseId)
  if (!matchedCourse) return { item, status: 'missing' }
  return {
    item,
    status: stateForCourse(
      matchedCourse.id,
      dependentPosition,
      completed,
      positions,
      unallocated,
    ),
    matchedCourseId: matchedCourse.id,
    matchedCourseCode: matchedCourse.code,
  }
}

function alternativeScore(alternative: PrerequisiteAlternativeEvaluation) {
  const valid = alternative.items.filter((item) =>
    ['completed', 'plannedBefore'].includes(item.status),
  ).length
  const invalid = alternative.items.filter((item) =>
    ['samePeriod', 'plannedAfter'].includes(item.status),
  ).length
  const missing = alternative.items.filter((item) =>
    ['missing', 'unallocated'].includes(item.status),
  ).length
  const notInCatalog = alternative.items.filter(
    (item) => item.status === 'notInCatalog',
  ).length
  const unknown = alternative.items.filter(
    (item) => item.status === 'unknown',
  ).length
  const fullyValid = valid === alternative.items.length
  return {
    fullyValid,
    valid,
    invalid,
    missing: missing + notInCatalog,
    unknown,
  }
}

function chooseAutomaticAlternative(
  alternatives: ReadonlyArray<PrerequisiteAlternativeEvaluation>,
) {
  return [...alternatives]
    .sort((left, right) => {
      const a = alternativeScore(left)
      const b = alternativeScore(right)
      return (
        Number(b.fullyValid) - Number(a.fullyValid) ||
        b.valid - a.valid ||
        a.invalid - b.invalid ||
        a.missing - b.missing ||
        a.unknown - b.unknown ||
        left.key.localeCompare(right.key)
      )
    })
    .at(0)
}

export function evaluatePrerequisites({
  snapshot,
  courses,
  rules,
  preferredAlternatives = new Map(),
  courseIds,
  catalogCourseIds,
}: {
  snapshot: CurriculumPlannerSnapshot
  courses: ReadonlyArray<Course>
  rules: ReadonlyArray<CoursePrerequisiteRule>
  preferredAlternatives?: ReadonlyMap<CourseId, string>
  courseIds?: ReadonlySet<CourseId>
  catalogCourseIds?: ReadonlySet<CourseId>
}): PrerequisiteEvaluation {
  const completed = new Set(
    snapshot.academicRecord.completedCourses.map((course) => course.courseId),
  )
  const positions = plannedPositions(snapshot)
  const unallocated = new Set(snapshot.plan.unallocatedCourseIds ?? [])
  const coursesById = new Map(courses.map((course) => [course.id, course]))
  const evaluations = new Map<CourseId, CoursePrerequisiteEvaluation>()
  const links: Array<PrerequisiteLink> = []

  for (const rule of rules) {
    if (courseIds && !courseIds.has(rule.courseId)) continue
    const dependentPosition = positions.get(rule.courseId)
    const alternatives = rule.alternatives.map((alternative) => ({
      key: alternative.key,
      items: alternative.allOf.map((item) =>
        evaluateItem(
          item,
          dependentPosition,
          coursesById,
          completed,
          positions,
          unallocated,
          catalogCourseIds,
        ),
      ),
    }))
    const automatic = chooseAutomaticAlternative(alternatives)
    const preferred = preferredAlternatives.get(rule.courseId)
    const selected =
      alternatives.find((alternative) => alternative.key === preferred) ??
      automatic
    evaluations.set(rule.courseId, {
      courseId: rule.courseId,
      automaticAlternativeKey: automatic?.key ?? null,
      selectedAlternativeKey: selected?.key ?? null,
      alternatives,
      issues: [
        ...(selected?.items.some((item) =>
          ['missing', 'unallocated'].includes(item.status),
        )
          ? (['missing'] as const)
          : []),
        ...(selected?.items.some((item) => item.status === 'notInCatalog')
          ? (['notInCatalog'] as const)
          : []),
        ...(selected?.items.some((item) => item.status === 'plannedAfter')
          ? (['inverted'] as const)
          : []),
      ],
    })
    if (dependentPosition === undefined) continue
    for (const item of selected?.items ?? []) {
      if (
        item.matchedCourseId &&
        ['completed', 'plannedBefore', 'samePeriod', 'plannedAfter'].includes(
          item.status,
        )
      ) {
        links.push({
          prerequisiteCourseId: item.matchedCourseId,
          dependentCourseId: rule.courseId,
          status: item.status as PrerequisiteLink['status'],
        })
      }
    }
  }

  return { courses: evaluations, links }
}
