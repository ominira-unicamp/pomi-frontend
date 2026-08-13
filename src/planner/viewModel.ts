import type {
  Course,
  CurriculumCourseState,
  CurriculumPlannerSnapshot,
  CurriculumPlannerStaticData,
  PlanningPeriod,
} from '@pomi/planner-domain/curriculum'

export type CourseOption = Readonly<{
  value: string
  label: string
}>

export type SemesterViewModel = Readonly<{
  period: PlanningPeriod
  courses: ReadonlyArray<CurriculumCourseState>
  credits: number
  current: boolean
}>

export type PlannerViewModel = Readonly<{
  periods: ReadonlyArray<PlanningPeriod>
  semesters: ReadonlyArray<SemesterViewModel>
  completedCourses: ReadonlyArray<Course>
  completedCredits: number
  courseOptions: ReadonlyArray<CourseOption>
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
  const plannedIds = new Set(
    snapshot.plan.periods.flatMap((period) =>
      period.items.map((item) => item.courseId),
    ),
  )
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
  const completedCourses = staticData.courses.filter((course) =>
    snapshot.plan.unallocatedCourseIds
      ? unallocatedIds.has(course.id)
      : completedIds.has(course.id) && !plannedIds.has(course.id),
  )
  return {
    periods: snapshot.plan.periods,
    semesters,
    completedCourses,
    completedCredits: completedCourses.reduce(
      (total, course) => total + course.credits,
      0,
    ),
    courseOptions: staticData.courses.map((course) => ({
      value: course.id,
      label: `${course.code} — ${course.name} (${String(course.credits).padStart(2, '0')} créditos)`,
    })),
  }
}
