import type {
  Course,
  CourseId,
  CourseSelector,
  CurriculumBlocks,
  ElectiveCreditsRequirement,
} from './curriculumPlanner'

export type ElectiveCreditsBalance = Readonly<{
  requirement: ElectiveCreditsRequirement
  eligibleCourseIds: ReadonlyArray<CourseId>
  earnedCredits: number
  requiredCredits: number
  remainingCredits: number
}>

function matchesSelector(course: Course, selector: CourseSelector) {
  if (selector.type === 'anyCourse') return true
  if (selector.type === 'specificCourse') return course.id === selector.courseId
  return (
    course.prefix?.trim().toUpperCase() === selector.prefix.trim().toUpperCase()
  )
}

function matchesRequirement(
  course: Course,
  requirement: ElectiveCreditsRequirement,
) {
  return requirement.eligibleCourses.some((selector) =>
    matchesSelector(course, selector),
  )
}

function selectorSpecificity(selector: CourseSelector) {
  if (selector.type === 'specificCourse') return 3
  if (selector.type === 'prefix') return 2
  return 1
}

function requirementSpecificity(requirement: ElectiveCreditsRequirement) {
  return Math.min(...requirement.eligibleCourses.map(selectorSpecificity))
}

export function calculateElectiveCreditsBalances(
  courses: ReadonlyArray<Course>,
  blocks: CurriculumBlocks,
): ReadonlyArray<ElectiveCreditsBalance> {
  const distinctCourses = [
    ...new Map(courses.map((course) => [course.id, course])).values(),
  ]
  const mandatoryCourseIds = new Set(
    distinctCourses
      .filter((course) =>
        blocks.mandatory.some((requirement) =>
          matchesSelector(course, requirement.selector),
        ),
      )
      .map((course) => course.id),
  )
  const allocatedCourseIds = new Set<CourseId>()
  const balances = new Map<number, ElectiveCreditsBalance>()
  const requirements = blocks.electives
    .map((requirement, index) => ({ index, requirement }))
    .sort((left, right) => {
      const specificity =
        requirementSpecificity(right.requirement) -
        requirementSpecificity(left.requirement)
      if (specificity !== 0) return specificity
      const selectors =
        left.requirement.eligibleCourses.length -
        right.requirement.eligibleCourses.length
      return selectors !== 0 ? selectors : left.index - right.index
    })
  for (const { index, requirement } of requirements) {
    const eligibleCourses: Array<Course> = []
    let earnedCredits = 0
    for (const course of distinctCourses) {
      if (
        mandatoryCourseIds.has(course.id) ||
        allocatedCourseIds.has(course.id) ||
        !matchesRequirement(course, requirement) ||
        earnedCredits >= requirement.requiredCredits
      )
        continue
      allocatedCourseIds.add(course.id)
      eligibleCourses.push(course)
      earnedCredits += course.credits
    }
    balances.set(index, {
      requirement,
      eligibleCourseIds: eligibleCourses.map((course) => course.id),
      earnedCredits,
      requiredCredits: requirement.requiredCredits,
      remainingCredits: Math.max(
        0,
        requirement.requiredCredits - earnedCredits,
      ),
    })
  }
  return requirements.map(({ index }) => balances.get(index)!)
}
