import type {
  Course,
  CourseId,
  CurriculumPlannerSnapshot,
} from './curriculumPlanner'

export type PrerequisiteKind = 'FULL' | 'PARTIAL' | 'SPECIAL'

export type PrerequisiteTarget =
  | Readonly<{ type: 'course'; courseId: CourseId; code: string }>
  | Readonly<{ type: 'prefix'; prefix: string }>
  | Readonly<{ type: 'special'; code: string }>

export type PrerequisiteItem = Readonly<{
  kind: PrerequisiteKind
  target: PrerequisiteTarget
}>

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
  issues: ReadonlyArray<'missing' | 'inverted'>
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
        return `${item.kind}:course:${target.courseId}:${target.code}`
      if (target.type === 'prefix')
        return `${item.kind}:prefix:${target.prefix}`
      return `${item.kind}:special:${target.code}`
    })
    .sort()
    .join('+')
}

function normalizePrefix(value: string) {
  return value.toUpperCase().replace(/[\s-]/g, '')
}

function plannedPositions(snapshot: CurriculumPlannerSnapshot) {
  const positions = new Map<CourseId, number>()
  snapshot.plan.periods.forEach((period, index) => {
    for (const item of period.items) positions.set(item.courseId, index)
  })
  return positions
}

function targetPosition(
  snapshot: CurriculumPlannerSnapshot,
  courseId: CourseId,
) {
  const period = snapshot.plan.periods.find((candidate) =>
    candidate.items.some((item) => item.courseId === courseId),
  )
  return period
    ? snapshot.plan.periods.findIndex((candidate) => candidate.id === period.id)
    : undefined
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

function candidateForPrefix(
  prefix: string,
  courses: ReadonlyArray<Course>,
  completed: ReadonlySet<CourseId>,
  positions: ReadonlyMap<CourseId, number>,
  unallocated: ReadonlySet<CourseId>,
) {
  const normalized = normalizePrefix(prefix)
  return courses
    .filter((course) =>
      normalizePrefix(course.prefix ?? course.code).startsWith(normalized),
    )
    .filter(
      (course) =>
        completed.has(course.id) ||
        positions.has(course.id) ||
        unallocated.has(course.id),
    )
    .sort((left, right) => {
      const leftCompleted = completed.has(left.id) ? 0 : 1
      const rightCompleted = completed.has(right.id) ? 0 : 1
      if (leftCompleted !== rightCompleted)
        return leftCompleted - rightCompleted
      const leftPosition = positions.get(left.id) ?? Number.MAX_SAFE_INTEGER
      const rightPosition = positions.get(right.id) ?? Number.MAX_SAFE_INTEGER
      return (
        leftPosition - rightPosition ||
        left.code.localeCompare(right.code, 'pt-BR')
      )
    })[0]
}

function evaluateItem(
  item: PrerequisiteItem,
  dependentPosition: number | undefined,
  courses: ReadonlyArray<Course>,
  completed: ReadonlySet<CourseId>,
  positions: ReadonlyMap<CourseId, number>,
  unallocated: ReadonlySet<CourseId>,
): PrerequisiteItemEvaluation {
  const target = item.target
  if (target.type === 'special') return { item, status: 'unknown' }
  const matchedCourse =
    target.type === 'course'
      ? courses.find((course) => course.id === target.courseId)
      : candidateForPrefix(
          target.prefix,
          courses,
          completed,
          positions,
          unallocated,
        )
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
  const unknown = alternative.items.filter(
    (item) => item.status === 'unknown',
  ).length
  const fullyValid = valid === alternative.items.length
  return { fullyValid, valid, invalid, missing, unknown }
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
}: {
  snapshot: CurriculumPlannerSnapshot
  courses: ReadonlyArray<Course>
  rules: ReadonlyArray<CoursePrerequisiteRule>
  preferredAlternatives?: ReadonlyMap<CourseId, string>
}): PrerequisiteEvaluation {
  const completed = new Set(
    snapshot.academicRecord.completedCourses.map((course) => course.courseId),
  )
  const positions = plannedPositions(snapshot)
  const unallocated = new Set(snapshot.plan.unallocatedCourseIds ?? [])
  const evaluations = new Map<CourseId, CoursePrerequisiteEvaluation>()
  const links: Array<PrerequisiteLink> = []

  for (const rule of rules) {
    const dependentPosition = targetPosition(snapshot, rule.courseId)
    const alternatives = rule.alternatives.map((alternative) => ({
      key: alternative.key,
      items: alternative.allOf.map((item) =>
        evaluateItem(
          item,
          dependentPosition,
          courses,
          completed,
          positions,
          unallocated,
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
