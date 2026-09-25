import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { specialRequirementCode } from '@pomi/planner-domain/curriculum'

import type { CatalogCourse } from '@/features/course-catalog/data/courseCatalogApi'
import { getCourse } from '@/features/course-catalog/data/courseCatalogApi'

type CatalogPrerequisite =
  CatalogCourse['prerequisites']['any'][number]['all'][number]
type CoursePrerequisite = Extract<CatalogPrerequisite, { type: 'COURSE' }>
type LinkedCoursePrerequisite = CoursePrerequisite & {
  course: Omit<CoursePrerequisite['course'], 'courseId'> & { courseId: number }
}

const fulfillmentLabels = {
  FULL: 'integral',
  PARTIAL: 'parcial',
} as const

function hasCourseId(
  item: CoursePrerequisite,
): item is LinkedCoursePrerequisite {
  return item.course.courseId !== null
}

function specialRequirementLabel(
  type: 'AUTHORIZATION' | 'PROGRESSION_COEFFICIENT',
  value: number,
) {
  if (type === 'AUTHORIZATION') return 'Autorização necessária'
  return `Coeficiente de progressão: ${value}`
}

export function CatalogPrerequisiteItemView({
  item,
  catalogYear,
}: {
  item: CatalogPrerequisite
  catalogYear: number
}) {
  if (item.type === 'SPECIAL_REQUIREMENT') {
    const specialRequirement = item.specialRequirement
    const type = specialRequirement.type
    const value =
      type === 'AUTHORIZATION'
        ? 0
        : specialRequirement.progressionCoefficient.value
    return (
      <span className="font-semibold">
        {specialRequirementCode(type, value)} —{' '}
        {specialRequirementLabel(type, value)}
      </span>
    )
  }

  if (!hasCourseId(item)) {
    return (
      <span className="font-semibold text-muted-foreground">
        Disciplina histórica sem vínculo (
        {fulfillmentLabels[item.course.fulfillment]})
      </span>
    )
  }

  return <LinkedCatalogPrerequisite item={item} catalogYear={catalogYear} />
}

function LinkedCatalogPrerequisite({
  item,
  catalogYear,
}: {
  item: LinkedCoursePrerequisite
  catalogYear: number
}) {
  const query = useQuery({
    queryKey: ['public', 'course-catalog', 'course', item.course.courseId],
    queryFn: () => getCourse(item.course.courseId),
    staleTime: Infinity,
  })
  const label = query.data
    ? `${query.data.code} — ${query.data.name}`
    : `Disciplina ${item.course.courseId}`

  return (
    <Link
      className="font-mono font-black text-primary underline-offset-4 hover:underline"
      to="/disciplinas/$courseId"
      params={{ courseId: String(item.course.courseId) }}
      search={{ catalogYear }}
      title={
        item.course.fulfillment === 'PARTIAL'
          ? 'Pré-requisito com integralização parcial'
          : 'Pré-requisito com integralização integral'
      }
    >
      {label}
      <span className="ml-1 text-xs font-sans font-semibold text-muted-foreground">
        ({fulfillmentLabels[item.course.fulfillment]})
      </span>
    </Link>
  )
}
