import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { LogIn, MessageSquareWarning, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import type {
  CourseId,
  CoursePrerequisiteRule,
  Course as PlannerCourse,
} from '@pomi/planner-domain/curriculum'
import type { VisualPrerequisiteLink } from '@/features/curriculum-planner/prerequisiteTreeLayout'
import type {
  Course,
  Tag,
} from '@/features/course-catalog/data/courseCatalogApi'
import { ContextBackLink } from '@/components/ContextBackLink'
import { CatalogProgramCourseDialog } from '@/features/catalog-program/CatalogProgramCourseDialog'
import { loadCurriculumCatalog } from '@/catalog/data/curriculumCatalogApi'
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
  CatalogCourseAcademicCard,
  CatalogCoursePrerequisites,
  CatalogCourseSelector,
  CatalogCourseSyllabus,
  selectCatalog,
} from '@/features/course-catalog/CatalogCourseDetails'
import { prerequisiteCourseIds } from '@/features/curriculum-planner/prerequisiteTreeLayout'
import { useFeedbackReport } from '@/features/feedback/FeedbackReportProvider'
import { PrerequisiteTreeView } from '@/features/curriculum-planner/components/PrerequisiteTreeView'
import { loadCatalogPrerequisites } from '@/features/curriculum-planner/data/curriculumPrerequisiteApi'
import { publicQueryKeys } from '@/integrations/tanstack-query/queryKeys'
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
  const [selectedDependencyCourse, setSelectedDependencyCourse] =
    useState<PlannerCourse>()
  const curriculumCatalogQuery = useQuery({
    queryKey: publicQueryKeys.curriculumCatalog(),
    queryFn: async () => {
      const result = await loadCurriculumCatalog()
      if (!result.ok) throw new Error(result.error.code)
      return result.value
    },
    staleTime: Infinity,
  })
  const prerequisitesQuery = useQuery({
    queryKey: publicQueryKeys.curriculumPrerequisites(
      selectedCatalog?.catalogYear ?? 0,
    ),
    queryFn: () => loadCatalogPrerequisites(selectedCatalog!.catalogYear),
    enabled: Boolean(selectedCatalog),
    staleTime: Infinity,
  })
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
            <CatalogCourseSyllabus text={selectedCatalog.syllabus} />
          )}
          <CatalogCoursePrerequisites
            course={course}
            catalog={selectedCatalog}
          />
          {selectedCatalog && (
            <CatalogCourseAcademicCard course={selectedCatalog} />
          )}
          <RelatedSection
            courses={relatedQuery.data ?? []}
            loading={relatedQuery.isLoading}
          />
        </main>
        <aside className="space-y-6">
          <CatalogCourseSelector
            courses={catalogCourses}
            selected={selectedCatalog}
            loading={catalogQuery.isLoading}
            compact
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
      <CourseDependencyTree
        courseId={course.id}
        catalogYear={selectedCatalog?.catalogYear}
        courses={curriculumCatalogQuery.data?.courses ?? []}
        rules={prerequisitesQuery.data?.rules ?? []}
        loading={
          Boolean(selectedCatalog) &&
          (curriculumCatalogQuery.isLoading || prerequisitesQuery.isLoading)
        }
        error={curriculumCatalogQuery.isError || prerequisitesQuery.isError}
        onOpenCourse={setSelectedDependencyCourse}
      />
      {selectedCatalog && (
        <CatalogProgramCourseDialog
          course={selectedDependencyCourse}
          catalogYear={selectedCatalog.catalogYear}
          onOpenChange={(open) => {
            if (!open) setSelectedDependencyCourse(undefined)
          }}
        />
      )}
    </PageContainer>
  )
}

function CourseDependencyTree({
  courseId,
  catalogYear,
  courses,
  rules,
  loading,
  error,
  onOpenCourse,
}: {
  courseId: number
  catalogYear?: number
  courses: ReadonlyArray<PlannerCourse>
  rules: ReadonlyArray<CoursePrerequisiteRule>
  loading: boolean
  error: boolean
  onOpenCourse: (course: PlannerCourse) => void
}) {
  const [showDependents, setShowDependents] = useState(false)
  const focusedCourseId = String(courseId) as CourseId
  const courseIds = useMemo(
    () => new Set(courses.map((course) => course.id)),
    [courses],
  )
  const links = useMemo(() => {
    const result = new Map<string, VisualPrerequisiteLink>()
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
          result.set(key, {
            prerequisiteCourseId: item.target.courseId,
            dependentCourseId: rule.courseId,
            status: 'plannedBefore',
            alternative: rule.alternatives.length > 1,
          })
        }
      }
    }
    return [...result.values()]
  }, [courseIds, rules])
  const visibleLinks = useMemo(() => {
    if (showDependents) return links
    const visibleCourseIds = prerequisiteCourseIds(focusedCourseId, links)
    return links.filter(
      (link) =>
        visibleCourseIds.has(link.prerequisiteCourseId) &&
        visibleCourseIds.has(link.dependentCourseId),
    )
  }, [focusedCourseId, links, showDependents])

  if (!catalogYear) return null
  if (loading) return <LoadingState label="Carregando árvore de dependências" />
  if (error) {
    return (
      <ErrorState
        title="Não foi possível carregar a árvore de dependências"
        description="As demais informações da disciplina continuam disponíveis."
      />
    )
  }

  return (
    <div className="mt-6">
      <PrerequisiteTreeView
        key={`${courseId}:${catalogYear}`}
        states={courses.map((course) => ({ course, completed: false }))}
        links={visibleLinks}
        initialFocusedCourseIds={[focusedCourseId]}
        allowTreeSelection={false}
        showPlanningLegend={false}
        showCompletedToggle={false}
        title="Árvore de dependências"
        description="Veja os pré-requisitos desta disciplina e as disciplinas que dependem dela."
        headerAction={
          <Button
            size="sm"
            variant={showDependents ? 'default' : 'outline'}
            role="switch"
            aria-checked={showDependents}
            onClick={() => setShowDependents((current) => !current)}
          >
            Mostrar dependentes
          </Button>
        }
        onOpenCourseDetails={(selectedCourseId) =>
          onOpenCourse(
            courses.find((course) => course.id === selectedCourseId)!,
          )
        }
      />
    </div>
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
