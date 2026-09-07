import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ExternalLink, LogIn, MessageSquareWarning, Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import type { ReactNode } from 'react'

import type {
  CatalogCourse,
  Course,
  Tag,
} from '@/features/course-catalog/data/courseCatalogApi'
import { ContextBackLink } from '@/components/ContextBackLink'
import { useOptionalAuth } from '@/auth/AuthProvider'
import {
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFeedbackReport } from '@/features/feedback/FeedbackReportProvider'
import {
  deleteCourseTag,
  getCourse,
  listCatalogCourses,
  listCourseTags,
  listRelatedCourses,
  listTags,
  putCourseTag,
} from '@/features/course-catalog/data/courseCatalogApi'

export type CourseDetailsSearch = Readonly<{
  catalogYear?: number
}>

export function CourseDetailsPage({
  courseId,
  search,
  onSearchChange,
}: {
  courseId: number
  search: CourseDetailsSearch
  onSearchChange: (search: CourseDetailsSearch) => void
}) {
  const auth = useOptionalAuth()
  const queryClient = useQueryClient()
  const feedback = useFeedbackReport()
  const courseQuery = useQuery({
    queryKey: ['public', 'course-catalog', 'course', courseId],
    queryFn: () => getCourse(courseId),
  })
  const catalogQuery = useQuery({
    queryKey: ['public', 'course-catalog', 'catalogs', courseId],
    queryFn: () => listCatalogCourses(courseId),
    enabled: courseQuery.isSuccess,
  })
  const tagsQuery = useQuery({
    queryKey: ['public', 'course-catalog', 'course-tags', courseId],
    queryFn: () => listCourseTags(courseId),
    enabled: courseQuery.isSuccess,
  })
  const allTagsQuery = useQuery({
    queryKey: ['public', 'course-catalog', 'tags'],
    queryFn: listTags,
    staleTime: 30 * 60 * 1000,
  })

  const catalogCourses = catalogQuery.data ?? []
  const selectedCatalog = selectCatalog(catalogCourses, search.catalogYear)
  const courseTags = tagsQuery.data ?? []
  const relatedQuery = useQuery({
    queryKey: [
      'public',
      'course-catalog',
      'related',
      courseId,
      courseTags.map((tag) => tag.id),
    ],
    queryFn: async () => {
      const related = await Promise.all(
        courseTags.map((tag) => listRelatedCourses(tag.id)),
      )
      const counts = new Map<number, { course: Course; count: number }>()
      for (const courses of related) {
        for (const relatedCourse of courses) {
          if (relatedCourse.id === courseId) continue
          const current = counts.get(relatedCourse.id)
          counts.set(relatedCourse.id, {
            course: relatedCourse,
            count: (current?.count ?? 0) + 1,
          })
        }
      }
      return [...counts.values()]
        .sort(
          (left, right) =>
            right.count - left.count ||
            left.course.code.localeCompare(right.course.code, 'pt-BR'),
        )
        .slice(0, 8)
        .map((entry) => entry.course)
    },
    enabled: tagsQuery.isSuccess,
  })

  useEffect(() => {
    if (selectedCatalog && search.catalogYear !== selectedCatalog.catalogYear) {
      onSearchChange({
        ...search,
        catalogYear: selectedCatalog.catalogYear,
      })
    }
  }, [onSearchChange, search, selectedCatalog])

  const tagMutation = useMutation({
    mutationFn: async (input: { tagId: number; action: 'add' | 'remove' }) => {
      if (input.action === 'add')
        return putCourseTag(courseId, input.tagId, auth.getAccessToken)
      return deleteCourseTag(courseId, input.tagId, auth.getAccessToken)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['public', 'course-catalog', 'course-tags', courseId],
      })
    },
  })

  if (courseQuery.isLoading) {
    return <LoadingState label="Carregando disciplina" />
  }
  if (courseQuery.isError || !courseQuery.data) {
    return (
      <PageContainer>
        <ErrorState
          title="Disciplina não encontrada"
          description="Não foi possível carregar esta disciplina."
        />
      </PageContainer>
    )
  }

  const course = courseQuery.data

  return (
    <PageContainer size="wide">
      <ContextBackLink to="/disciplinas" label="Voltar para disciplinas" />
      <PageHeader
        title={`${course.code} — ${course.name}`}
        description={`${course.credits} créditos${course.unitCode ? ` · ${course.unitCode}` : ''}`}
        actions={
          <Button
            variant="outline"
            onClick={() =>
              feedback.openFeedback({
                kind: 'DATA_ISSUE',
                target: {
                  type: 'ACADEMIC_RESOURCE',
                  academicResourceType: 'COURSE',
                  academicResourceId: course.id,
                },
                title: `Informação de ${course.code}`,
              })
            }
          >
            <MessageSquareWarning /> Reportar dado incorreto
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <main className="space-y-6">
          {selectedCatalog?.syllabus && (
            <SyllabusSection text={selectedCatalog.syllabus} />
          )}
          <PrerequisitesSection course={course} catalog={selectedCatalog} />
          {selectedCatalog && <CatalogDetails course={selectedCatalog} />}
          <RelatedSection
            courses={relatedQuery.data ?? []}
            loading={relatedQuery.isLoading}
          />
        </main>
        <aside className="space-y-6">
          <CompactCatalogSelector
            courses={catalogCourses}
            selected={selectedCatalog}
            loading={catalogQuery.isLoading}
            onChange={(year) =>
              onSearchChange({ ...search, catalogYear: year })
            }
          />
          <TagsSection
            tags={tagsQuery.data ?? []}
            allTags={allTagsQuery.data ?? []}
            authenticated={auth.isAuthenticated}
            onLogin={() => void auth.login(window.location.href)}
            onChange={(tagId, action) => tagMutation.mutate({ tagId, action })}
            pending={tagMutation.isPending}
          />
        </aside>
      </div>
    </PageContainer>
  )
}

function CompactCatalogSelector({
  courses,
  selected,
  loading,
  onChange,
}: {
  courses: ReadonlyArray<CatalogCourse>
  selected?: CatalogCourse
  loading: boolean
  onChange: (year: number) => void
}) {
  if (loading || courses.length === 0) return null
  return (
    <Card variant="flat" className="p-4">
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
    </Card>
  )
}

function CatalogDetails({ course }: { course: CatalogCourse }) {
  const offeringLabels = {
    ALL_PERIODS: 'Todos os períodos',
    ODD_PERIODS: 'Semestres ímpares',
    EVEN_PERIODS: 'Semestres pares',
    UNIT_DISCRETION: 'A critério da unidade',
  } as const
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
        <CardTitle>Informações acadêmicas</CardTitle>
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

function SyllabusSection({ text }: { text: string }) {
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

function PrerequisitesSection({
  course,
  catalog,
}: {
  course: Course
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

function TagsSection({
  tags,
  allTags,
  authenticated,
  onLogin,
  onChange,
  pending,
}: {
  tags: ReadonlyArray<Tag>
  allTags: ReadonlyArray<Tag>
  authenticated: boolean
  onLogin: () => void
  onChange: (tagId: number, action: 'add' | 'remove') => void
  pending: boolean
}) {
  const available = allTags.filter(
    (tag) => !tags.some((courseTag) => courseTag.id === tag.id),
  )
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tags comunitárias</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 rounded-sm border-2 border-border bg-muted px-2 py-1 text-sm font-bold"
              >
                {tag.name}
                {authenticated && (
                  <button
                    type="button"
                    className="pomi-focus rounded-sm text-muted-foreground hover:text-destructive"
                    disabled={pending}
                    onClick={() => onChange(tag.id, 'remove')}
                    aria-label={`Remover tag ${tag.name}`}
                  >
                    <Trash2 className="size-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Nenhuma tag associada.
          </p>
        )}
        {authenticated ? (
          <AutocompleteSelect
            ariaLabel="Buscar tag para adicionar"
            value=""
            options={available.map((tag) => ({
              value: String(tag.id),
              label: tag.name,
            }))}
            placeholder={
              available.length > 0
                ? 'Buscar tag para adicionar'
                : 'Todas as tags já foram adicionadas'
            }
            disabled={pending || available.length === 0}
            onValueChange={(value) => {
              if (value) onChange(Number(value), 'add')
            }}
          />
        ) : (
          <Button variant="outline" className="w-full" onClick={onLogin}>
            <LogIn /> Entrar para editar
          </Button>
        )}
        <p className="text-xs text-muted-foreground">
          Tags são metadados compartilhados e não substituem as informações
          oficiais do catálogo.
        </p>
      </CardContent>
    </Card>
  )
}

function RelatedSection({
  courses,
  loading,
}: {
  courses: ReadonlyArray<Course>
  loading: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Disciplinas relacionadas</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">
            Carregando relações...
          </p>
        ) : courses.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Ainda não há disciplinas relacionadas por tags.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {courses.map((course) => (
              <Link
                key={course.id}
                to="/disciplinas/$courseId"
                params={{ courseId: String(course.id) }}
                search={{}}
                className="pomi-focus rounded-sm border-2 border-border p-3 hover:border-primary"
              >
                <span className="font-mono text-sm font-black text-primary">
                  {course.code}
                </span>
                <span className="mt-1 block text-sm font-bold">
                  {course.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
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

function selectCatalog(
  courses: ReadonlyArray<CatalogCourse>,
  year?: number,
): CatalogCourse | undefined {
  if (courses.length === 0) return undefined
  return (
    courses
      .slice()
      .sort((left, right) => right.catalogYear - left.catalogYear)
      .find((course) => course.catalogYear === year) ??
    courses
      .slice()
      .sort((left, right) => right.catalogYear - left.catalogYear)[0]
  )
}
