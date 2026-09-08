import { Link } from '@tanstack/react-router'
import { ExternalLink } from 'lucide-react'
import type { ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CatalogCourse } from '@/features/course-catalog/data/courseCatalogApi'

const offeringLabels = {
  ALL_PERIODS: 'Todos os períodos',
  ODD_PERIODS: 'Semestres ímpares',
  EVEN_PERIODS: 'Semestres pares',
  UNIT_DISCRETION: 'A critério da unidade',
} as const

export function CatalogCourseSelector({
  courses,
  selected,
  loading,
  onChange,
  compact = false,
}: {
  courses: ReadonlyArray<CatalogCourse>
  selected?: CatalogCourse
  loading: boolean
  onChange: (year: number) => void
  compact?: boolean
}) {
  if (loading || courses.length === 0) return null
  const content = (
    <>
      <label className="space-y-2 text-sm font-bold">
        <span>Catálogo consultado</span>
        <Select
          value={selected ? String(selected.catalogYear) : undefined}
          onValueChange={(value) => onChange(Number(value))}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Selecionar ano" />
          </SelectTrigger>
          <SelectContent>
            {courses
              .slice()
              .sort((left, right) => right.catalogYear - left.catalogYear)
              .map((catalog) => (
                <SelectItem
                  key={catalog.catalogYear}
                  value={String(catalog.catalogYear)}
                >
                  {catalog.catalogYear}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </label>
      {selected?.sourceUrl && (
        <a
          href={selected.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-primary underline"
        >
          Ver fonte institucional <ExternalLink className="size-4" />
        </a>
      )}
    </>
  )
  return compact ? (
    <Card variant="flat" className="p-4">
      {content}
    </Card>
  ) : (
    <div className="space-y-3 rounded-sm border-2 border-border p-4">
      {content}
    </div>
  )
}

export function CatalogCourseAcademicCard({
  course,
  title = 'Informações acadêmicas',
}: {
  course: CatalogCourse
  title?: string
}) {
  const workload = [
    ['Teóricas', course.workload.theoreticalHours],
    ['Práticas', course.workload.practicalHours],
    ['Laboratório', course.workload.laboratoryHours],
    ['Atividades orientadas', course.workload.guidedActivityHours],
    ['A distância', course.workload.distanceHours],
    ['Extensão orientada', course.workload.guidedExtensionHours],
    ['Extensão prática', course.workload.practicalExtensionHours],
    ['Semanas', course.workload.weeks],
    ['Horas semanais', course.workload.weeklyClassHours],
    ['Sala de aula', course.workload.classroomHours],
  ].filter((item): item is [string, number] => item[1] !== null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <Definition label="Oferecimento">
            {course.offeringPeriod
              ? offeringLabels[course.offeringPeriod]
              : 'Não informado'}
          </Definition>
          <Definition label="Avaliação">
            {course.evaluation ?? 'Não informado'}
          </Definition>
          <Definition label="Exame final">
            {course.finalExam === null
              ? 'Não informado'
              : course.finalExam
                ? 'Sim'
                : 'Não'}
          </Definition>
          <Definition label="Frequência mínima">
            {course.minimumAttendancePercent === null
              ? 'Não informado'
              : `${course.minimumAttendancePercent}%`}
          </Definition>
          <Definition label="Coordenador">
            {course.coordinator?.name ?? 'Não informado'}
          </Definition>
        </dl>
        {workload.length > 0 && (
          <div>
            <h3 className="mb-3 font-extrabold">Carga horária</h3>
            <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {workload.map(([label, value]) => (
                <Definition key={label} label={label}>
                  {value}h
                </Definition>
              ))}
            </dl>
          </div>
        )}
        {course.bibliography && (
          <ExpandableText title="Bibliografia" text={course.bibliography} />
        )}
      </CardContent>
    </Card>
  )
}

export function CatalogCourseSyllabus({ text }: { text: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ementa</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line text-sm text-muted-foreground">
          {text}
        </p>
      </CardContent>
    </Card>
  )
}

export function CatalogCoursePrerequisites({
  course,
  catalog,
}: {
  course: Readonly<{ id: string | number }>
  catalog?: CatalogCourse
}) {
  if (!catalog) return null
  const groups = catalog.prerequisites.any
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pré-requisitos · {catalog.catalogYear}</CardTitle>
      </CardHeader>
      <CardContent>
        {groups.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum pré-requisito informado neste catálogo.
          </p>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Qualquer uma das alternativas abaixo deve ser atendida.
            </p>
            {groups.map((group, index) => (
              <div
                key={`${course.id}-${index}`}
                className="rounded-sm border-2 border-border p-3"
              >
                <span className="mr-2 text-xs font-black text-muted-foreground">
                  ALTERNATIVA {index + 1}
                </span>
                {group.all.map((item, itemIndex) => (
                  <span key={`${item.code}-${itemIndex}`}>
                    {itemIndex > 0 && <span className="mx-2">e</span>}
                    {item.courseId ? (
                      <Link
                        to="/disciplinas/$courseId"
                        params={{ courseId: String(item.courseId) }}
                        search={{}}
                        className="font-mono font-black text-primary underline"
                      >
                        {item.kind === 'PARTIAL' ? '*' : ''}
                        {item.code}
                      </Link>
                    ) : (
                      <span className="font-mono font-black">
                        {item.kind === 'PARTIAL' ? '*' : ''}
                        {item.code}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function selectCatalog(
  courses: ReadonlyArray<CatalogCourse>,
  year?: number,
) {
  if (courses.length === 0) return undefined
  const sorted = courses
    .slice()
    .sort((left, right) => right.catalogYear - left.catalogYear)
  return sorted.find((course) => course.catalogYear === year) ?? sorted[0]
}

function Definition({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div>
      <dt className="font-bold">{label}</dt>
      <dd className="mt-1 text-muted-foreground">{children}</dd>
    </div>
  )
}

function ExpandableText({ title, text }: { title: string; text: string }) {
  return (
    <details className="rounded-sm border-2 border-border p-3" open>
      <summary className="cursor-pointer font-bold">{title}</summary>
      <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">
        {text}
      </p>
    </details>
  )
}
