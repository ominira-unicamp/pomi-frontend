import { useMemo, useState } from 'react'

import type {
  Course,
  CourseId,
  CoursePrerequisiteRule,
  CurriculumPlannerStaticData,
} from '@pomi/planner-domain/curriculum'
import type { VisualPrerequisiteLink } from '@/features/curriculum-planner/prerequisiteTreeLayout'
import { PrerequisiteTreeView } from '@/features/curriculum-planner/components/PrerequisiteTreeView'
import { Button } from '@/components/ui/button'

function curriculumBlocks(
  program: CurriculumPlannerStaticData['catalogPrograms'][number],
  specialization?: CurriculumPlannerStaticData['catalogPrograms'][number]['specializations'][number],
) {
  return [
    program.baseBlocks,
    ...program.languages.map((language) => language.blocks),
    ...(specialization ? [specialization.blocks] : []),
  ]
}

export function catalogProgramTreeCourseIds(
  program: CurriculumPlannerStaticData['catalogPrograms'][number],
  specialization:
    | CurriculumPlannerStaticData['catalogPrograms'][number]['specializations'][number]
    | undefined,
  includeElectives: boolean,
) {
  const blocks = curriculumBlocks(program, specialization)
  const courseIds = new Set<CourseId>()
  for (const block of blocks) {
    for (const requirement of block.mandatory) {
      if (requirement.selector.type === 'specificCourse')
        courseIds.add(requirement.selector.courseId)
    }
    if (!includeElectives) continue
    for (const elective of block.electives) {
      for (const selector of elective.eligibleCourses) {
        if (selector.type === 'specificCourse') courseIds.add(selector.courseId)
      }
    }
  }
  return courseIds
}

function dependencyLinks(
  rules: ReadonlyArray<CoursePrerequisiteRule>,
  courseIds: ReadonlySet<CourseId>,
) {
  const links = new Map<string, VisualPrerequisiteLink>()
  for (const rule of rules) {
    if (!courseIds.has(rule.courseId)) continue
    for (const alternative of rule.alternatives) {
      for (const item of alternative.allOf) {
        if (
          item.target.type !== 'course' ||
          !courseIds.has(item.target.courseId)
        )
          continue
        const key = `${item.target.courseId}:${rule.courseId}`
        links.set(key, {
          prerequisiteCourseId: item.target.courseId,
          dependentCourseId: rule.courseId,
          status: 'plannedBefore',
          alternative: rule.alternatives.length > 1,
        })
      }
    }
  }
  return [...links.values()]
}

export function CatalogProgramDependencyTree({
  program,
  specialization,
  courses,
  rules,
  completedCourseIds,
  focusedCourseId,
  onOpenCourseDetails,
}: {
  program: CurriculumPlannerStaticData['catalogPrograms'][number]
  specialization?: CurriculumPlannerStaticData['catalogPrograms'][number]['specializations'][number]
  courses: ReadonlyArray<Course>
  rules: ReadonlyArray<CoursePrerequisiteRule>
  completedCourseIds: ReadonlySet<number>
  focusedCourseId?: CourseId
  onOpenCourseDetails: (course: Course) => void
}) {
  const mandatoryCourseIds = useMemo(
    () => catalogProgramTreeCourseIds(program, specialization, false),
    [program, specialization],
  )
  const [showElectives, setShowElectives] = useState(
    () =>
      focusedCourseId !== undefined && !mandatoryCourseIds.has(focusedCourseId),
  )
  const courseIds = useMemo(
    () => catalogProgramTreeCourseIds(program, specialization, showElectives),
    [program, showElectives, specialization],
  )
  const visibleCourses = useMemo(
    () => courses.filter((course) => courseIds.has(course.id)),
    [courseIds, courses],
  )
  const courseById = useMemo(
    () => new Map(visibleCourses.map((course) => [course.id, course])),
    [visibleCourses],
  )
  const links = useMemo(
    () => dependencyLinks(rules, courseIds),
    [courseIds, rules],
  )

  return (
    <PrerequisiteTreeView
      states={visibleCourses.map((course) => ({
        course,
        completed: completedCourseIds.has(Number(course.id)),
      }))}
      links={links}
      initialFocusedCourseIds={focusedCourseId ? [focusedCourseId] : []}
      showPlanningLegend={false}
      title="Árvore de dependências"
      description="Visualize as relações entre as disciplinas deste currículo."
      onOpenCourseDetails={(courseId) => {
        const course = courseById.get(courseId)
        if (course) onOpenCourseDetails(course)
      }}
      headerAction={
        <Button
          size="sm"
          variant={showElectives ? 'default' : 'outline'}
          role="switch"
          aria-checked={showElectives}
          onClick={() => setShowElectives((current) => !current)}
        >
          Mostrar eletivas
        </Button>
      }
    />
  )
}
