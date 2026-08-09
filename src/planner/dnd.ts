import type { PlannerDragData } from './components/CourseCard'
import type {
  CurriculumPlannerCommand,
  PlanningPeriodId,
} from './domain/curriculumPlanner'

export function commandForCourseDrop(
  data: PlannerDragData,
  overId: string,
): CurriculumPlannerCommand | undefined {
  if (overId === 'unallocated') {
    return data.currentPeriodId
      ? { type: 'moveCourseToUnallocated', courseId: data.course.id }
      : undefined
  }
  if (overId === 'completed') {
    return data.completed
      ? undefined
      : { type: 'markCourseCompleted', courseId: data.course.id }
  }
  if (!overId.startsWith('period:')) return undefined
  const periodId = overId.slice('period:'.length) as PlanningPeriodId
  if (data.currentPeriodId === periodId) return undefined
  return data.currentPeriodId
    ? { type: 'moveCourseToPeriod', courseId: data.course.id, periodId }
    : { type: 'addCourseToPeriod', courseId: data.course.id, periodId }
}
