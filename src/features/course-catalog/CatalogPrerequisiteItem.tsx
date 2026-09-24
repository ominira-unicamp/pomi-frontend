import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { specialRequirementCode } from '@pomi/planner-domain/curriculum'

import type { CatalogCourse } from '@/features/course-catalog/data/courseCatalogApi'
import { getCourse } from '@/features/course-catalog/data/courseCatalogApi'

type CatalogPrerequisite =
  CatalogCourse['prerequisites']['any'][number]['all'][number]
type CoursePrerequisite = Extract<
  CatalogPrerequisite,
  { fulfillment: 'FULL' | 'PARTIAL' }
>
type LinkedCoursePrerequisite = Omit<CoursePrerequisite, 'courseId'> & {
  courseId: number
}

const fulfillmentLabels = {
  FULL: 'integral',
  PARTIAL: 'parcial',
} as const

function hasCourseId(
  item: CoursePrerequisite,
): item is LinkedCoursePrerequisite {
  return item.courseId !== null
}

function specialRequirementLabel(
  type: CatalogPrerequisite extends infer Item
    ? Item extends { specialRequirementType: infer RequirementType }
      ? RequirementType
      : never
    : never,
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
  if ('specialRequirementType' in item) {
    return (
      <span className="font-semibold">
        {specialRequirementCode(
          item.specialRequirementType,
          item.specialRequirementValue,
        )}{' '}
        —{' '}
        {specialRequirementLabel(
          item.specialRequirementType,
          item.specialRequirementValue,
        )}
      </span>
    )
  }

  if (!hasCourseId(item)) {
    return (
      <span className="font-semibold text-muted-foreground">
        Disciplina histórica sem vínculo ({fulfillmentLabels[item.fulfillment]})
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
    queryKey: ['public', 'course-catalog', 'course', item.courseId],
    queryFn: () => getCourse(item.courseId),
    staleTime: Infinity,
  })
  const label = query.data
    ? `${query.data.code} — ${query.data.name}`
    : `Disciplina ${item.courseId}`

  return (
    <Link
      className="font-mono font-black text-primary underline-offset-4 hover:underline"
      to="/disciplinas/$courseId"
      params={{ courseId: String(item.courseId) }}
      search={{ catalogYear }}
      title={
        item.fulfillment === 'PARTIAL'
          ? 'Pré-requisito com integralização parcial'
          : 'Pré-requisito com integralização integral'
      }
    >
      {label}
      <span className="ml-1 text-xs font-sans font-semibold text-muted-foreground">
        ({fulfillmentLabels[item.fulfillment]})
      </span>
    </Link>
  )
}
