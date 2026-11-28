import type {
  Course,
  CurriculumCourseState,
  CurriculumPlannerSnapshot,
  CurriculumPlannerStaticData,
  PlanningPeriod,
} from '@pomi/planner-domain/curriculum'

export type SemesterViewModel = Readonly<{
  period: PlanningPeriod
  courses: ReadonlyArray<CurriculumCourseState>
  credits: number
  current: boolean
}>

export type PlannerViewModel = Readonly<{
  periods: ReadonlyArray<PlanningPeriod>
  semesters: ReadonlyArray<SemesterViewModel>
  unallocatedCourses: ReadonlyArray<Course>
  unallocatedCredits: number
}>

export function buildPlannerViewModel(
  staticData: CurriculumPlannerStaticData,
  snapshot: CurriculumPlannerSnapshot,
): PlannerViewModel {
  const courseById = new Map(
    staticData.courses.map((course) => [course.id, course]),
  )
  const completedIds = new Set(
    snapshot.academicRecord.completedCourses.map((course) => course.courseId),
  )
  const unallocatedIds = new Set(snapshot.plan.unallocatedCourseIds ?? [])
  const semesters = snapshot.plan.periods.map((period) => {
    const courses = period.items.flatMap((item) => {
      const course = courseById.get(item.courseId)
      return course
        ? [
            {
              course,
              plannedPeriodId: period.id,
              completed: completedIds.has(course.id),
            },
          ]
        : []
    })
    return {
      period,
      courses,
      credits: courses.reduce(
        (total, state) => total + state.course.credits,
        0,
      ),
      current: snapshot.plan.currentPeriodId === period.id,
    }
  })
  const unallocatedCourses = staticData.courses.filter((course) =>
    unallocatedIds.has(course.id),
  )
  return {
    periods: snapshot.plan.periods,
    semesters,
    unallocatedCourses,
    unallocatedCredits: unallocatedCourses.reduce(
      (total, course) => total + course.credits,
      0,
    ),
  }
}
