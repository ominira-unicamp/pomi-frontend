import { useNavigate } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { LayoutGrid, Table2 } from 'lucide-react'
import {
  buildGuideClassContext,
  createInMemorySemesterPlanner,
  scheduleDays as days,
  emptyGuide,
  guideFromApi,
  numericId,
  programGuideBlocks,
  selectorLabel,
} from '@pomi/planner-domain/semester'
import type {
  GuideChanges,
  GuideMode,
  SemesterCourse,
  SemesterPlanningDocument,
  SemesterPlanningGuide,
} from '@pomi/planner-domain/semester'
import type { SemesterDraftBootstrap } from '@/features/planning-shared/data/planningDraftBootstrap'
import type { SemesterPlanningVisibility } from '@/features/semester-planner/data/semesterPlanningApi'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LoadingState, PageContainer } from '@/components/PageLayout'
import { useOptionalAuth } from '@/auth/AuthProvider'
import {
  deleteSemesterPlanning,
  updateSemesterPlanningVisibility,
} from '@/features/semester-planner/data/semesterPlanningApi'
import { createApiSemesterPlanner } from '@/features/semester-planner/data/apiSemesterPlanner'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import { useSemesterPlannerQueries } from '@/features/semester-planner/hooks/useSemesterPlannerQueries'
import { isApprovedStudentCourseAttempt } from '@/features/student/data/studentApi'
import { ClassesGuidePanel } from '@/features/semester-planner/components/ClassesGuidePanel'
import { SemesterPlanningHeader } from '@/features/semester-planner/components/SemesterPlanningHeader'
import { SemesterScheduleGrid } from '@/features/semester-planner/components/SemesterScheduleGrid'
import { PlanningVisibilityDialog } from '@/features/semester-planner/components/PlanningVisibilityDialog'
import { SelectedClassDialog } from '@/features/semester-planner/components/SelectedClassDialog'
import { ClassesFilterToolbar } from '@/features/semester-planner/components/ClassesFilterToolbar'
import { PlannerSelectionTray } from '@/features/semester-planner/components/PlannerSelectionTray'
import {
  buildCourseClassAvailability,
  buildDetailedScheduleConflicts,
  buildSemesterPlannerSummary,
} from '@/features/semester-planner/model/semesterPlannerView'
import { semesterDraftBootstrapKey } from '@/features/planning-shared/data/planningDraftBootstrap'
import { saveDraftHandoff } from '@/features/planning-shared/data/planningDraftHandoff'
import { SaveDraftDialog } from '@/features/planning-shared/components/SaveDraftDialog'
import { mostRecentStudyPeriodsFirst } from '@/features/student/data/studyPeriodOrdering'
import { studyPeriodLabel } from '@/features/student/data/studyPeriod'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'
import { useScheduleGridSelection } from '@/features/semester-planner/hooks/useScheduleGridSelection'
import {
  filterClassesGuide,
  useClassesGuideFilters,
} from '@/features/semester-planner/hooks/useClassesGuideFilters'
import { compareProgramCodes } from '@/features/planning-shared/data/programOrdering'
import { CatalogProgramCourseDialog } from '@/features/catalog-program/CatalogProgramCourseDialog'

type GuideTab = 'disciplines' | 'classes'
type DisciplineView = 'cards' | 'table'

function courseColor() {
  return 'border-strong-border bg-background text-foreground'
}

export function SemesterPlannerPage({
  planningId = 'rascunho',
}: {
  planningId?: string
}) {
  const auth = useOptionalAuth()
  const sessionSubject = auth.sessionSubject ?? 'anonymous-session'
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [draftBootstrap] = useState(() =>
    planningId === 'rascunho'
      ? queryClient.getQueryData<SemesterDraftBootstrap>(
          semesterDraftBootstrapKey,
        )
      : undefined,
  )
  const [studyPeriodId, setStudyPeriodId] = useState<number | undefined>(
    draftBootstrap?.studyPeriodId ?? undefined,
  )
  const [studyPeriodLocked, setStudyPeriodLocked] = useState(
    Boolean(draftBootstrap?.studyPeriodId),
  )
  const [activePlanId, setActivePlanId] = useState<number>()
  const [visibility, setVisibility] =
    useState<SemesterPlanningVisibility>('PRIVATE')
  const [visibilityDraft, setVisibilityDraft] =
    useState<SemesterPlanningVisibility>('PRIVATE')
  const [visibilityDialogOpen, setVisibilityDialogOpen] = useState(false)
  const [previewClassId, setPreviewClassId] = useState<number>()
  const [selectedClassDetailsId, setSelectedClassDetailsId] = useState<number>()
  const [selectedCourseDetailsId, setSelectedCourseDetailsId] =
    useState<number>()
  const [mobileView, setMobileView] = useState<
    'builder' | 'schedule' | 'selection'
  >('builder')
  const [isSaving, setIsSaving] = useState(false)
  const [saveDraftDialogOpen, setSaveDraftDialogOpen] = useState(false)
  const [guideMode, setGuideMode] = useState<GuideMode>('none')
  const [guideCurriculumId, setGuideCurriculumId] = useState<number | null>()
  const [guideCurriculumTouched, setGuideCurriculumTouched] = useState(false)
  const [guideSource, setGuideSource] = useState<'saved' | 'suggestion'>(
    'suggestion',
  )
  const [guideConfigurationOpen, setGuideConfigurationOpen] = useState(false)
  const [configurationMode, setConfigurationMode] = useState<
    'curriculum' | 'program'
  >('curriculum')
  const [guideTab, setGuideTab] = useState<GuideTab>('disciplines')
  const [disciplineView, setDisciplineView] = useState<DisciplineView>('cards')
  const [manualCourseIds, setManualCourseIds] = useState<ReadonlyArray<number>>(
    [],
  )
  const [manualCourseDialogOpen, setManualCourseDialogOpen] = useState(false)
  const [manualCourseId, setManualCourseId] = useState('')
  const [openedCourseId, setOpenedCourseId] = useState<number>()
  const [addingClass, setAddingClass] = useState(false)
  const [classPickerCourseId, setClassPickerCourseId] = useState('')
  const { filters, updateFilters } = useClassesGuideFilters()
  const {
    ref: gridSelectionRef,
    activeSelection: activeGridSelection,
    highlightedDayIndexes,
    isDragging: isDraggingGridSelection,
    onPointerDown: handleGridPointerDown,
    onPointerMove: handleGridPointerMove,
    onPointerUp: finishGridSelection,
    onPointerCancel: cancelGridSelection,
  } = useScheduleGridSelection({
    enabled: guideTab === 'classes',
    filterDays: filters.days,
    filterStart: filters.start,
    filterEnd: filters.end,
    onFilterChange: ({ days: nextDays, start, end }) => {
      updateFilters({ days: nextDays, start, end, timePeriods: [] })
    },
  })
  const [anonymousCatalogId, setAnonymousCatalogId] = useState('')
  const [anonymousCatalogProgramId, setAnonymousCatalogProgramId] = useState('')
  const [anonymousSuggestionId, setAnonymousSuggestionId] = useState('')
  const [programCatalogId, setProgramCatalogId] = useState('')
  const [programCatalogTouched, setProgramCatalogTouched] = useState(false)
  const [programCatalogProgramId, setProgramCatalogProgramId] = useState('')
  const [programSpecializationId, setProgramSpecializationId] = useState('')
  const [programLanguageId, setProgramLanguageId] = useState('')
  const [anonymousSuggestionCourseIds, setAnonymousSuggestionCourseIds] =
    useState<
      ReadonlyArray<
        Readonly<{ semester: number; courseIds: ReadonlyArray<number> }>
      >
    >()
  const [document, setDocument] = useState<SemesterPlanningDocument>(
    draftBootstrap ?? {
      name: 'Novo planejamento de semestre',
      studyPeriodId: null,
      curriculumId: null,
      classIds: [],
      guide: emptyGuide(),
    },
  )
  const [error, setError] = useState<string>()
  const {
    studentId,
    studentProfileQuery,
    query,
    plansQuery,
    courseAttemptsQuery,
    professorEvaluationSummariesQuery,
    curriculaQuery,
    curriculumQuery,
    anonymousCurriculumDataQuery,
    anonymousSuggestionsQuery,
    planQuery,
  } = useSemesterPlannerQueries({
    getAccessToken: auth.getAccessToken,
    authInitialized: auth.initialized,
    studyPeriodId,
    guideCurriculumId,
    anonymousCatalogProgramId,
    planningId,
  })

  const professorEvaluationSummaries = useMemo(
    () =>
      new Map(
        (professorEvaluationSummariesQuery.data ?? []).map((summary) => [
          summary.professor.id,
          summary,
        ]),
      ),
    [professorEvaluationSummariesQuery.data],
  )
  const completedCourseIds = useMemo(
    () =>
      new Set(
        (courseAttemptsQuery.data ?? [])
          .filter(isApprovedStudentCourseAttempt)
          .map((attempt) => attempt.courseId),
      ),
    [courseAttemptsQuery.data],
  )

  useEffect(() => {
    if (draftBootstrap)
      queryClient.removeQueries({ queryKey: semesterDraftBootstrapKey })
  }, [draftBootstrap, queryClient])

  useEffect(() => {
    const first = query.data
      ? mostRecentStudyPeriodsFirst(query.data.studyPeriods).at(0)
      : undefined
    if (!studyPeriodId && first) setStudyPeriodId(first.id)
  }, [query.data?.studyPeriods, studyPeriodId])

  useEffect(() => {
    if (!guideCurriculumTouched) {
      setGuideCurriculumId(document.curriculumId)
      if (document.curriculumId) setGuideSource('saved')
    }
  }, [document.curriculumId, guideCurriculumTouched])

  useEffect(() => {
    const guide = document.guide
    setGuideMode(guide.mode)
    setGuideCurriculumId(guide.curriculum.curriculumId)
    setGuideSource(guide.curriculum.source ?? 'suggestion')
    setAnonymousSuggestionId(
      guide.curriculum.suggestionId
        ? String(guide.curriculum.suggestionId)
        : '',
    )
    setAnonymousCatalogProgramId(
      guide.curriculum.suggestionCatalogProgramId
        ? String(guide.curriculum.suggestionCatalogProgramId)
        : '',
    )
    setProgramCatalogProgramId(
      guide.program.catalogProgramId
        ? String(guide.program.catalogProgramId)
        : '',
    )
    setProgramSpecializationId(
      guide.program.specializationId
        ? String(guide.program.specializationId)
        : '',
    )
    setProgramLanguageId(
      guide.program.languageId ? String(guide.program.languageId) : '',
    )
    setManualCourseIds(guide.manualCourseIds)
  }, [document.guide])

  const anonymousCatalogPrograms = useMemo(
    () => anonymousCurriculumDataQuery.data?.catalogPrograms ?? [],
    [anonymousCurriculumDataQuery.data?.catalogPrograms],
  )
  const anonymousCatalogs = useMemo(
    () =>
      [
        ...new Map(
          anonymousCatalogPrograms.map((catalogProgram) => [
            catalogProgram.catalog.id,
            {
              value: catalogProgram.catalog.id,
              label: `Catálogo ${catalogProgram.catalog.year}`,
            },
          ]),
        ).values(),
      ].sort((left, right) => right.label.localeCompare(left.label)),
    [anonymousCatalogPrograms],
  )
  const anonymousPrograms = useMemo(
    () =>
      anonymousCatalogPrograms
        .filter(
          (catalogProgram) => catalogProgram.catalog.id === anonymousCatalogId,
        )
        .sort((left, right) =>
          compareProgramCodes(left.program, right.program),
        ),
    [anonymousCatalogId, anonymousCatalogPrograms],
  )
  const programCatalogPrograms = useMemo(
    () =>
      anonymousCatalogPrograms
        .filter(
          (catalogProgram) => catalogProgram.catalog.id === programCatalogId,
        )
        .sort((left, right) =>
          compareProgramCodes(left.program, right.program),
        ),
    [anonymousCatalogPrograms, programCatalogId],
  )
  const selectedProgramCatalog = useMemo(
    () =>
      anonymousCatalogPrograms.find(
        (catalogProgram) => catalogProgram.id === programCatalogProgramId,
      ),
    [anonymousCatalogPrograms, programCatalogProgramId],
  )
  useEffect(() => {
    const profile = studentProfileQuery.data
    if (!profile) return
    const catalogProgram = anonymousCatalogPrograms.find(
      (item) =>
        Number(item.catalog.id) === profile.catalogId &&
        Number(item.program.id) === profile.programId,
    )
    if (!catalogProgram) return
    if (!anonymousCatalogProgramId) {
      setAnonymousCatalogId(String(catalogProgram.catalog.id))
      setAnonymousCatalogProgramId(String(catalogProgram.id))
    }
    if (!programCatalogTouched && !programCatalogProgramId) {
      setProgramCatalogId(String(catalogProgram.catalog.id))
      setProgramCatalogProgramId(String(catalogProgram.id))
      setProgramSpecializationId(
        profile.specializationId ? String(profile.specializationId) : '',
      )
      setProgramLanguageId(profile.languageId ? String(profile.languageId) : '')
    }
  }, [
    anonymousCatalogPrograms,
    anonymousCatalogProgramId,
    programCatalogTouched,
    programCatalogProgramId,
    studentProfileQuery.data,
  ])
  const anonymousSuggestions = anonymousSuggestionsQuery.data ?? []
  const selectedAnonymousSuggestion = anonymousSuggestions.find(
    (suggestion) => suggestion.id === anonymousSuggestionId,
  )

  useEffect(() => {
    const suggestionProgramId =
      document.guide.curriculum.suggestionCatalogProgramId
    if (suggestionProgramId) {
      const program = anonymousCatalogPrograms.find(
        (item) => Number(item.id) === suggestionProgramId,
      )
      setAnonymousCatalogProgramId(String(suggestionProgramId))
      if (program) setAnonymousCatalogId(String(program.catalog.id))
    }
    if (document.guide.program.catalogProgramId) {
      const program = anonymousCatalogPrograms.find(
        (item) => Number(item.id) === document.guide.program.catalogProgramId,
      )
      if (program) setProgramCatalogId(String(program.catalog.id))
    }
  }, [anonymousCatalogPrograms, document.guide])

  useEffect(() => {
    if (!selectedAnonymousSuggestion) return
    setAnonymousSuggestionCourseIds(
      selectedAnonymousSuggestion.semesters.map((semester) => ({
        semester: semester.semester,
        courseIds: semester.courses.map((course) => Number(course.id)),
      })),
    )
  }, [selectedAnonymousSuggestion])

  function updateGuide(next: SemesterPlanningGuide) {
    setGuideMode(next.mode)
    setGuideCurriculumId(next.curriculum.curriculumId)
    setGuideSource(next.curriculum.source ?? 'suggestion')
    setAnonymousSuggestionId(
      next.curriculum.suggestionId ? String(next.curriculum.suggestionId) : '',
    )
    setProgramCatalogProgramId(
      next.program.catalogProgramId
        ? String(next.program.catalogProgramId)
        : '',
    )
    setProgramSpecializationId(
      next.program.specializationId
        ? String(next.program.specializationId)
        : '',
    )
    setProgramLanguageId(
      next.program.languageId ? String(next.program.languageId) : '',
    )
    setManualCourseIds(next.manualCourseIds)
    void dispatch({ type: 'setGuide', guide: next })
  }

  function guideWith(changes: GuideChanges): SemesterPlanningGuide {
    return {
      ...document.guide,
      ...changes,
      curriculum: { ...document.guide.curriculum, ...changes.curriculum },
      program: { ...document.guide.program, ...changes.program },
    }
  }

  useEffect(() => {
    if (anonymousSuggestions.length === 1) {
      setAnonymousSuggestionId(anonymousSuggestions[0].id)
    } else if (
      !anonymousSuggestions.some(
        (suggestion) => suggestion.id === anonymousSuggestionId,
      )
    ) {
      setAnonymousSuggestionId('')
    }
  }, [anonymousSuggestionId, anonymousSuggestions])

  const planner = useMemo(() => {
    if (!query.data) return undefined
    const inMemory = createInMemorySemesterPlanner({
      staticData: query.data,
      initialDocument: document,
    })
    return createApiSemesterPlanner({
      planner: inMemory,
      studentId: studentId ?? undefined,
      planningId: activePlanId,
      getAccessToken: auth.getAccessToken,
      onSavingChange: setIsSaving,
    })
  }, [activePlanId, auth.getAccessToken, document, query.data, studentId])

  const snapshotQuery = useQuery({
    queryKey: privateQueryKeys.semesterPlannerSnapshot(
      sessionSubject,
      planningId,
      document,
    ),
    queryFn: async () => {
      if (!planner) return undefined
      const result = await planner.getSnapshot()
      return result.ok ? result.value : undefined
    },
    enabled: Boolean(planner),
    placeholderData: (previous) => previous,
  })
  const snapshot = snapshotQuery.data

  const loadedView = useMemo(() => {
    if (!query.data || !snapshot) return undefined

    const selectedIds = new Set(document.classIds)
    const selectedClassIdsWithConflict = new Set(
      snapshot.conflicts.flatMap((conflict) => [
        conflict.classId,
        conflict.conflictingClassId,
      ]),
    )
    const courseById = new Map<number, (typeof query.data.courses)[number]>(
      query.data.courses.map((course) => [course.id, course]),
    )
    for (const course of anonymousCurriculumDataQuery.data?.courses ?? []) {
      const courseId = Number(course.id)
      if (!courseById.has(courseId)) {
        courseById.set(courseId, {
          id: courseId,
          code: course.code,
          name: course.name,
          credits: course.credits,
        })
      }
    }
    const classById = new Map(query.data.classes.map((item) => [item.id, item]))
    const plannerSummary = buildSemesterPlannerSummary({
      selectedClasses: snapshot.selectedClasses,
      coursesById: courseById,
      meetings: query.data.meetings,
      conflicts: snapshot.conflicts,
    })
    const detailedConflicts = buildDetailedScheduleConflicts({
      conflicts: snapshot.conflicts,
      classesById: classById,
      meetings: query.data.meetings,
    })
    const curriculumPeriodPositions = new Map(
      curriculumQuery.data?.periods.map((period) => [
        String(period.id),
        period.position,
      ]) ?? [],
    )
    const curriculumGuideCourses =
      guideSource === 'saved' && guideCurriculumId
        ? (curriculumQuery.data?.courses ?? []).flatMap((item) => {
            const course = courseById.get(Number(item.courseId))
            if (!course) return []
            return [
              {
                course,
                semester: item.periodId
                  ? (curriculumPeriodPositions.get(String(item.periodId)) ?? 0)
                  : 0,
              },
            ]
          })
        : guideSource === 'suggestion' && anonymousSuggestionCourseIds
          ? anonymousSuggestionCourseIds.flatMap((semester) =>
              semester.courseIds.flatMap((courseId) => {
                const course = courseById.get(courseId)
                return course ? [{ course, semester: semester.semester }] : []
              }),
            )
          : []
    const guideCourses = curriculumGuideCourses.filter(
      (item, index, items) =>
        items.findIndex((other) => other.course.id === item.course.id) ===
        index,
    )
    const scheduledCourseIds = new Set(
      document.classIds.flatMap((classId) => {
        const courseId = classById.get(classId)?.courseId
        return courseId === undefined ? [] : [courseId]
      }),
    )
    const selectedProgramBlocks = programGuideBlocks(
      selectedProgramCatalog,
      programSpecializationId,
      programLanguageId,
    )
    const guideClassContext = buildGuideClassContext(
      guideMode,
      guideCourses,
      selectedProgramBlocks,
      manualCourseIds,
      courseById,
    )
    const filteredGuideClasses = filterClassesGuide({
      filters,
      courses: query.data.courses,
      classes: query.data.classes,
      meetings: query.data.meetings,
      selectedClassIds: selectedIds,
      completedCourseIds,
      guideClassContext,
    })
    const disciplineGuideClasses = filterClassesGuide({
      filters: { ...filters, courseId: '' },
      courses: query.data.courses,
      classes: query.data.classes,
      meetings: query.data.meetings,
      selectedClassIds: selectedIds,
      completedCourseIds,
      guideClassContext,
    })
    const courseClassAvailability = buildCourseClassAvailability({
      classes: query.data.classes,
      matchingClasses: disciplineGuideClasses,
    })
    const matchingCourseIds = new Set(
      disciplineGuideClasses.map((classItem) => classItem.courseId),
    )
    const selectedCourseIds = new Set(
      query.data.classes
        .filter((classItem) => selectedIds.has(classItem.id))
        .map((classItem) => classItem.courseId),
    )
    const normalizedDisciplineSearch = filters.search
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('pt-BR')
    const hasRestrictiveGuideFilters = Boolean(
      filters.search ||
      filters.start ||
      filters.end ||
      filters.timePeriods.length ||
      filters.days.length ||
      filters.withoutConflict ||
      filters.withoutCompleted ||
      filters.withoutIncluded,
    )
    const disciplineMatchesFilters = (course: SemesterCourse) => {
      if (matchingCourseIds.has(course.id)) return true
      if (filters.withoutCompleted && completedCourseIds.has(course.id))
        return false
      if (filters.withoutIncluded && selectedCourseIds.has(course.id))
        return false
      if (
        normalizedDisciplineSearch &&
        !`${course.code} ${course.name}`
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLocaleLowerCase('pt-BR')
          .includes(normalizedDisciplineSearch)
      )
        return false
      const totalClasses = courseClassAvailability.get(course.id)?.total ?? 0
      if (totalClasses === 0) return !filters.withoutUnavailable
      return hasRestrictiveGuideFilters
    }
    const disciplineResultCount = [...matchingCourseIds].filter(
      (courseId) => !scheduledCourseIds.has(courseId),
    ).length
    const manualCourseIdSet = new Set(manualCourseIds)
    function coursesForElectiveRequirement(
      requirement: (typeof selectedProgramBlocks)[number]['blocks']['electives'][number],
    ) {
      const courseIds = new Set<number>()
      for (const selector of requirement.eligibleCourses) {
        if (selector.type === 'specificCourse') {
          courseIds.add(Number(selector.courseId))
          continue
        }
        if (selector.type === 'prefix') {
          const prefix = selector.prefix.toUpperCase()
          for (const course of courseById.values()) {
            if (course.code.toUpperCase().startsWith(prefix))
              courseIds.add(course.id)
          }
        }
      }
      return [...courseIds]
        .flatMap((courseId) => {
          const course = courseById.get(courseId)
          return course &&
            !scheduledCourseIds.has(course.id) &&
            !manualCourseIdSet.has(course.id) &&
            disciplineMatchesFilters(course)
            ? [course]
            : []
        })
        .sort((left, right) => left.code.localeCompare(right.code, 'pt-BR'))
    }
    const visibleManualCourses = manualCourseIds.flatMap((courseId) => {
      const course = courseById.get(courseId)
      return course &&
        !scheduledCourseIds.has(course.id) &&
        disciplineMatchesFilters(course)
        ? [{ course, semester: 0 }]
        : []
    })
    const visibleDisciplineGroups = guideCourses
      .filter(
        ({ course }) =>
          !scheduledCourseIds.has(course.id) &&
          !manualCourseIdSet.has(course.id) &&
          disciplineMatchesFilters(course),
      )
      .reduce<Array<{ semester: number; courses: typeof guideCourses }>>(
        (groups, item) => {
          const group = groups.at(-1)
          if (group?.semester === item.semester) group.courses.push(item)
          else {
            const existing = groups.find(
              (candidate) => candidate.semester === item.semester,
            )
            if (existing) existing.courses.push(item)
            else groups.push({ semester: item.semester, courses: [item] })
          }
          return groups
        },
        [],
      )
      .sort((left, right) => left.semester - right.semester)
      .map((group) => ({
        ...group,
        courses: [...group.courses].sort((left, right) =>
          left.course.code.localeCompare(right.course.code),
        ),
      }))

    return {
      classById,
      courseById,
      courseClassAvailability,
      coursesForElectiveRequirement,
      detailedConflicts,
      disciplineMatchesFilters,
      disciplineResultCount,
      filteredGuideClasses,
      guideClassContext,
      hasRestrictiveGuideFilters,
      manualCourseIdSet,
      plannerSummary,
      scheduledCourseIds,
      selectedClassIdsWithConflict,
      selectedIds,
      selectedProgramBlocks,
      visibleDisciplineGroups,
      visibleManualCourses,
    }
  }, [
    anonymousCurriculumDataQuery.data,
    anonymousSuggestionCourseIds,
    completedCourseIds,
    curriculumQuery.data,
    document.classIds,
    filters,
    guideCurriculumId,
    guideMode,
    guideSource,
    manualCourseIds,
    programLanguageId,
    programSpecializationId,
    query.data,
    selectedProgramCatalog,
    snapshot,
  ])

  async function dispatch(
    command: Parameters<NonNullable<typeof planner>['dispatch']>[0],
  ) {
    if (!planner) return
    const result = await planner.dispatch(command)
    if (!result.ok) {
      setError(
        result.error.code === 'courseAlreadyHasClass'
          ? 'Esta disciplina já possui uma turma no planejamento. Escolha “Trocar turma” para substituí-la.'
          : 'Não foi possível concluir a operação.',
      )
      return
    }
    const next = await planner.getSnapshot()
    if (next.ok) {
      setDocument(next.value.document)
      if (activePlanId) await plansQuery.refetch()
    }
    setError(undefined)
  }

  function applyAnonymousSuggestion() {
    if (!selectedAnonymousSuggestion) {
      setError('Escolha uma sugestão curricular antes de aplicá-la.')
      return
    }
    const nextGuide = selectedAnonymousSuggestion.semesters.map((semester) => ({
      semester: semester.semester,
      courseIds: semester.courses.map((course) => Number(course.id)),
    }))
    setAnonymousSuggestionCourseIds(nextGuide)
    setOpenedCourseId(undefined)
    setError(undefined)
    updateGuide(
      guideWith({
        mode: 'curriculum',
        curriculum: {
          source: 'suggestion',
          suggestionId: numericId(selectedAnonymousSuggestion.id),
          suggestionCatalogProgramId: numericId(
            selectedAnonymousSuggestion.catalogProgramId,
          ),
        },
      }),
    )
    setGuideConfigurationOpen(false)
  }

  function changePeriod(nextId: number) {
    if (studyPeriodLocked && nextId !== studyPeriodId) {
      setError(
        'O período do planejamento já foi definido e não pode ser alterado.',
      )
      return
    }
    if (document.classIds.length > 0 && nextId !== studyPeriodId) {
      setError('Remova as turmas atuais antes de trocar o período letivo.')
      return
    }
    if (nextId !== studyPeriodId) setStudyPeriodLocked(true)
    setStudyPeriodId(nextId)
    setDocument((current) => ({ ...current, studyPeriodId: nextId }))
  }

  function saveDraft() {
    if (!studyPeriodId) return
    saveDraftHandoff({
      version: 1,
      kind: 'semester',
      document: {
        ...document,
        studyPeriodId,
        name:
          document.name.trim() ||
          `Planejamento ${(() => {
            const period = query.data?.studyPeriods.find(
              (item) => item.id === studyPeriodId,
            )
            return period ? studyPeriodLabel(period) : ''
          })()}`,
      },
    })
    void auth.login(window.location.href)
  }

  function selectPlan(planId: number) {
    const plan =
      plansQuery.data?.find((item) => item.id === planId) ??
      (planQuery.data?.id === planId ? planQuery.data : undefined)
    if (!plan) return
    setActivePlanId(plan.id)
    setVisibility(plan.visibility)
    setStudyPeriodLocked(true)
    setStudyPeriodId(plan.studyPeriodId)
    const nextGuide = guideFromApi(plan.guide)
    setGuideMode(nextGuide.mode)
    setGuideCurriculumId(nextGuide.curriculum.curriculumId)
    setGuideSource(nextGuide.curriculum.source ?? 'suggestion')
    setAnonymousSuggestionId(
      nextGuide.curriculum.suggestionId
        ? String(nextGuide.curriculum.suggestionId)
        : '',
    )
    setProgramCatalogTouched(false)
    setProgramCatalogProgramId(
      nextGuide.program.catalogProgramId
        ? String(nextGuide.program.catalogProgramId)
        : '',
    )
    setProgramSpecializationId(
      nextGuide.program.specializationId
        ? String(nextGuide.program.specializationId)
        : '',
    )
    setProgramLanguageId(
      nextGuide.program.languageId ? String(nextGuide.program.languageId) : '',
    )
    setManualCourseIds(nextGuide.manualCourseIds)
    setManualCourseId('')
    setDocument({
      name: plan.name,
      studyPeriodId: plan.studyPeriodId,
      curriculumId: plan.curriculumId,
      classIds: plan.classes.map((item) => item.id),
      guide: nextGuide,
    })
    setError(undefined)
  }

  async function renamePlan() {
    const name = window.prompt('Nome do planejamento', document.name)?.trim()
    if (!name || name === document.name) return
    await dispatch({ type: 'rename', name })
  }

  function openVisibilityDialog() {
    setVisibilityDraft(visibility)
    setVisibilityDialogOpen(true)
  }

  async function saveVisibility() {
    if (!activePlanId || !studentId) return
    try {
      setIsSaving(true)
      const updated = await updateSemesterPlanningVisibility(
        studentId,
        activePlanId,
        visibilityDraft,
        auth.getAccessToken,
      )
      setVisibility(updated.visibility)
      await plansQuery.refetch()
      setVisibilityDialogOpen(false)
      setError(undefined)
    } catch {
      setError('Não foi possível atualizar a publicidade do planejamento.')
    } finally {
      setIsSaving(false)
    }
  }

  async function removePlan() {
    if (!activePlanId || !studentId) return
    if (
      !window.confirm(
        `Apagar “${document.name}”? Esta ação não pode ser desfeita.`,
      )
    )
      return
    try {
      setIsSaving(true)
      await deleteSemesterPlanning(studentId, activePlanId, auth.getAccessToken)
      await plansQuery.refetch()
      await navigate({ to: '/planejamentos-de-semestre', replace: true })
    } catch {
      setError('Não foi possível apagar o planejamento.')
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    if (planningId === 'rascunho') return
    const targetId = Number(planningId)
    if (!Number.isInteger(targetId) || activePlanId === targetId) return
    selectPlan(targetId)
  }, [activePlanId, planningId, planQuery.data, plansQuery.data])

  if (query.isLoading) {
    return (
      <PageContainer size="wide">
        <LoadingState label="Carregando planejamento de semestre" />
      </PageContainer>
    )
  }
  if (
    planningId !== 'rascunho' &&
    !activePlanId &&
    !planQuery.data &&
    (planQuery.isLoading || plansQuery.isLoading)
  ) {
    return (
      <PageContainer size="wide">
        <LoadingState label="Carregando planejamento de semestre" />
      </PageContainer>
    )
  }
  if (query.isError || !query.data) {
    return (
      <PageContainer size="wide">
        Não foi possível carregar as ofertas do período.
      </PageContainer>
    )
  }
  if (!snapshot) {
    return (
      <PageContainer size="wide">
        <LoadingState label="Preparando o planejamento" />
      </PageContainer>
    )
  }

  const {
    classById,
    courseById,
    courseClassAvailability,
    coursesForElectiveRequirement,
    detailedConflicts,
    disciplineMatchesFilters,
    disciplineResultCount,
    filteredGuideClasses,
    guideClassContext,
    hasRestrictiveGuideFilters,
    manualCourseIdSet,
    plannerSummary,
    scheduledCourseIds,
    selectedClassIdsWithConflict,
    selectedIds,
    selectedProgramBlocks,
    visibleDisciplineGroups,
    visibleManualCourses,
  } = loadedView!
  const selectedClassDetails = selectedClassDetailsId
    ? classById.get(selectedClassDetailsId)
    : undefined
  const selectedCourseDetails = selectedCourseDetailsId
    ? courseById.get(selectedCourseDetailsId)
    : undefined
  const courseDetailsCatalogYear =
    query.data.studyPeriods.find((period) => period.id === studyPeriodId)
      ?.year ??
    mostRecentStudyPeriodsFirst(query.data.studyPeriods).at(0)?.year ??
    new Date().getFullYear()

  const suggestionSelector = (
    <div className="space-y-3">
      <label className="block text-xs font-extrabold">
        Catálogo
        <AutocompleteSelect
          ariaLabel="Catálogo do guia curricular"
          value={anonymousCatalogId}
          options={anonymousCatalogs}
          placeholder="Escolha o catálogo"
          onValueChange={(value) => {
            setAnonymousCatalogId(value)
            setAnonymousCatalogProgramId('')
            setAnonymousSuggestionId('')
          }}
        />
      </label>
      <label className="block text-xs font-extrabold">
        Programa
        <AutocompleteSelect
          ariaLabel="Programa do guia curricular"
          value={anonymousCatalogProgramId}
          disabled={!anonymousCatalogId}
          options={anonymousPrograms.map((catalogProgram) => ({
            value: catalogProgram.id,
            label: `${catalogProgram.program.code} — ${catalogProgram.program.name}`,
          }))}
          placeholder={
            anonymousCatalogId
              ? 'Escolha o programa'
              : 'Escolha um catálogo primeiro'
          }
          onValueChange={(value) => {
            setAnonymousCatalogProgramId(value)
            setAnonymousSuggestionId('')
          }}
        />
      </label>
      <label className="block text-xs font-extrabold">
        Sugestão
        <AutocompleteSelect
          ariaLabel="Sugestão do guia curricular"
          value={anonymousSuggestionId}
          disabled={
            !anonymousCatalogProgramId ||
            anonymousSuggestionsQuery.isLoading ||
            anonymousSuggestions.length === 1
          }
          options={anonymousSuggestions.map((suggestion) => ({
            value: suggestion.id,
            label: `${suggestion.code} — ${suggestion.name}`,
          }))}
          placeholder={
            anonymousSuggestionsQuery.isLoading
              ? 'Carregando sugestões'
              : anonymousCatalogProgramId
                ? 'Escolha a sugestão'
                : 'Escolha um programa primeiro'
          }
          onValueChange={setAnonymousSuggestionId}
        />
      </label>
      <Button
        className="w-full"
        size="sm"
        disabled={!selectedAnonymousSuggestion}
        onClick={applyAnonymousSuggestion}
      >
        Usar sugestão
      </Button>
      {(anonymousCurriculumDataQuery.isError ||
        anonymousSuggestionsQuery.isError) && (
        <p className="text-xs font-semibold text-destructive">
          Não foi possível carregar os dados do currículo.
        </p>
      )}
    </div>
  )
  const curriculumGuideConfiguration = (
    <div className="space-y-4">
      {auth.isAuthenticated && (
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant={guideSource === 'saved' ? 'default' : 'outline'}
            onClick={() =>
              updateGuide(
                guideWith({
                  curriculum: {
                    source: 'saved',
                    suggestionId: null,
                    suggestionCatalogProgramId: null,
                  },
                }),
              )
            }
          >
            Currículo planejado
          </Button>
          <Button
            size="sm"
            variant={guideSource === 'suggestion' ? 'default' : 'outline'}
            onClick={() =>
              updateGuide(
                guideWith({
                  curriculum: { source: 'suggestion', curriculumId: null },
                }),
              )
            }
          >
            Currículo sugerido
          </Button>
        </div>
      )}
      {guideSource === 'saved' && auth.isAuthenticated ? (
        <label className="block text-xs font-extrabold">
          Currículo planejado
          <AutocompleteSelect
            ariaLabel="Currículo planejado do guia"
            value={guideCurriculumId ? String(guideCurriculumId) : ''}
            emptyLabel="Sem currículo"
            options={(curriculaQuery.data ?? []).map((curriculum) => ({
              value: String(curriculum.id),
              label: curriculum.name,
            }))}
            placeholder="Escolha um currículo"
            onValueChange={(value) => {
              setGuideCurriculumTouched(true)
              updateGuide(
                guideWith({
                  mode: 'curriculum',
                  curriculum: {
                    source: 'saved',
                    curriculumId: value ? Number(value) : null,
                    suggestionId: null,
                  },
                }),
              )
              setGuideConfigurationOpen(false)
            }}
          />
        </label>
      ) : (
        suggestionSelector
      )}
    </div>
  )
  const programGuideConfiguration = (
    <div className="space-y-3">
      <label className="block text-xs font-extrabold">
        Catálogo
        <AutocompleteSelect
          ariaLabel="Catálogo do programa"
          value={programCatalogId}
          options={anonymousCatalogs}
          placeholder="Escolha o catálogo"
          onValueChange={(value) => {
            setProgramCatalogTouched(true)
            setProgramCatalogId(value)
            const currentProgram = selectedProgramCatalog?.program
            const nextCatalogProgram = currentProgram
              ? anonymousCatalogPrograms.find(
                  (item) =>
                    item.catalog.id === value &&
                    (item.program.id === currentProgram.id ||
                      item.program.code === currentProgram.code),
                )
              : undefined
            const nextProgramId =
              nextCatalogProgram?.id ?? programCatalogProgramId
            setProgramCatalogProgramId(nextProgramId)
            updateGuide(
              guideWith({
                mode: 'program',
                program: {
                  catalogProgramId: nextCatalogProgram
                    ? numericId(nextCatalogProgram.id)
                    : document.guide.program.catalogProgramId,
                },
              }),
            )
          }}
        />
      </label>
      <label className="block text-xs font-extrabold">
        Programa
        <AutocompleteSelect
          ariaLabel="Programa do guia"
          value={programCatalogProgramId}
          disabled={!programCatalogId}
          options={programCatalogPrograms.map((catalogProgram) => ({
            value: catalogProgram.id,
            label: `${catalogProgram.program.code} — ${catalogProgram.program.name}`,
          }))}
          placeholder={
            programCatalogId
              ? 'Escolha o programa'
              : 'Escolha um catálogo primeiro'
          }
          onValueChange={(value) => {
            setProgramCatalogTouched(true)
            setProgramCatalogProgramId(value)
            setProgramSpecializationId('')
            setProgramLanguageId('')
            updateGuide(
              guideWith({
                mode: 'program',
                program: {
                  catalogProgramId: numericId(value),
                  specializationId: null,
                  languageId: null,
                },
              }),
            )
          }}
        />
      </label>
      <label className="block text-xs font-extrabold">
        Habilitação
        <AutocompleteSelect
          ariaLabel="Habilitação do programa"
          value={programSpecializationId}
          disabled={!selectedProgramCatalog}
          emptyLabel="Sem habilitação"
          options={(selectedProgramCatalog?.specializations ?? []).map(
            (specialization) => ({
              value: specialization.id,
              label: `${specialization.code} — ${specialization.name}`,
            }),
          )}
          placeholder={
            selectedProgramCatalog
              ? 'Escolha a habilitação'
              : 'Escolha um programa primeiro'
          }
          onValueChange={(value) => {
            setProgramSpecializationId(value)
            updateGuide(
              guideWith({
                mode: 'program',
                program: { specializationId: numericId(value) },
              }),
            )
          }}
        />
      </label>
      <label className="block text-xs font-extrabold">
        Língua
        <AutocompleteSelect
          ariaLabel="Língua do programa"
          value={programLanguageId}
          disabled={!selectedProgramCatalog}
          emptyLabel="Sem língua"
          options={(selectedProgramCatalog?.languages ?? []).map(
            (language) => ({ value: language.id, label: language.name }),
          )}
          placeholder={
            selectedProgramCatalog
              ? 'Escolha a língua'
              : 'Escolha um programa primeiro'
          }
          onValueChange={(value) => {
            setProgramLanguageId(value)
            updateGuide(
              guideWith({
                mode: 'program',
                program: { languageId: numericId(value) },
              }),
            )
          }}
        />
      </label>
    </div>
  )
  const curriculumGuideConfigured =
    guideSource === 'saved'
      ? Boolean(guideCurriculumId && curriculumQuery.data)
      : Boolean(anonymousSuggestionCourseIds)
  const programGuideConfigured = Boolean(programCatalogProgramId)
  const guideSetup = (
    <section className="space-y-3 rounded-md border-2 border-dashed border-strong-border p-3">
      <p className="text-sm font-semibold">
        {guideMode === 'curriculum'
          ? 'Escolha um currículo para preencher este guia.'
          : 'Escolha um programa para preencher este guia.'}
      </p>
      {guideMode === 'curriculum'
        ? curriculumGuideConfiguration
        : programGuideConfiguration}
    </section>
  )
  const classAvailabilityStatus = (courseId: number) => {
    const availability = courseClassAvailability.get(courseId) ?? {
      matching: 0,
      total: 0,
    }
    if (availability.total === 0) return 'Sem turmas no semestre'
    if (hasRestrictiveGuideFilters && availability.matching === 0)
      return 'Nenhuma turma atende aos filtros'
    return undefined
  }
  const showCourseClasses = (courseId: number) => {
    updateFilters({ courseId: String(courseId) })
    setGuideTab('classes')
  }
  const showCourseDetails = (courseId: number) => {
    setSelectedCourseDetailsId(courseId)
  }
  const renderDisciplineCollection = (
    courses: ReadonlyArray<SemesterCourse>,
  ) => {
    if (!courses.length) return null

    if (disciplineView === 'cards') {
      return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-2">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`rounded border-2 px-2 py-2 text-xs ${courseColor()}`}
            >
              <button
                type="button"
                className="pomi-focus block rounded-sm font-black text-primary hover:text-primary/80"
                onClick={() => showCourseDetails(course.id)}
              >
                {course.code}
              </button>
              <button
                type="button"
                className="block w-full text-left"
                onClick={() => showCourseClasses(course.id)}
              >
                <span className="block truncate text-muted-foreground">
                  {course.name}
                </span>
                <span className="block text-muted-foreground">
                  {course.credits} créditos
                </span>
                {classAvailabilityStatus(course.id) && (
                  <span className="block font-semibold text-muted-foreground">
                    {classAvailabilityStatus(course.id)}
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="-mx-3 w-[calc(100%+1.5rem)] overflow-hidden border-y border-border">
        <table className="w-full table-fixed border-collapse text-left text-xs">
          <colgroup>
            <col className="w-16" />
            <col />
            <col className="w-14" />
            <col className="w-20" />
          </colgroup>
          <thead className="bg-muted/60 text-muted-foreground">
            <tr>
              <th className="px-2 py-1.5 font-bold">Código</th>
              <th className="px-2 py-1.5 font-bold">Disciplina</th>
              <th className="px-2 py-1.5 font-bold">Créditos</th>
              <th className="px-2 py-1.5 text-right font-bold">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-muted/40">
                <td className="px-2 py-2 font-black whitespace-nowrap">
                  <button
                    type="button"
                    className="pomi-focus rounded-sm text-primary hover:text-primary/80"
                    onClick={() => showCourseDetails(course.id)}
                  >
                    {course.code}
                  </button>
                </td>
                <td className="min-w-0 px-2 py-2 text-muted-foreground">
                  <span className="block truncate" title={course.name}>
                    {course.name}
                  </span>
                  {classAvailabilityStatus(course.id) && (
                    <span className="block truncate font-semibold">
                      {classAvailabilityStatus(course.id)}
                    </span>
                  )}
                </td>
                <td className="px-2 py-2 whitespace-nowrap">
                  {course.credits}
                </td>
                <td className="px-2 py-1 text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => showCourseClasses(course.id)}
                  >
                    Turmas
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  const renderManualDiscipline = (course: SemesterCourse) => (
    <div
      key={`manual-${course.id}`}
      className="flex items-center rounded border-2 border-strong-border"
    >
      <div className={`rounded-l px-2 py-1 text-xs ${courseColor()}`}>
        <button
          type="button"
          className="pomi-focus block rounded-sm font-black text-primary hover:text-primary/80"
          onClick={() => showCourseDetails(course.id)}
        >
          {course.code}
        </button>
        <button
          type="button"
          className="block text-left font-semibold text-muted-foreground"
          title={`${course.name} · ${course.credits} créditos`}
          onClick={() => showCourseClasses(course.id)}
        >
          <span className="block">Ver turmas</span>
          {classAvailabilityStatus(course.id) && (
            <span className="block">{classAvailabilityStatus(course.id)}</span>
          )}
        </button>
      </div>
      <button
        type="button"
        className="self-stretch border-l-2 border-strong-border px-2 py-1 text-xs font-black text-destructive hover:bg-destructive/10"
        aria-label={`Remover ${course.code} das disciplinas manuais`}
        onClick={() => {
          const nextManualCourseIds = document.guide.manualCourseIds.filter(
            (courseId) => courseId !== course.id,
          )
          updateGuide(guideWith({ manualCourseIds: nextManualCourseIds }))
        }}
      >
        Remover
      </button>
    </div>
  )
  const renderManualDisciplineCollection = (
    courses: ReadonlyArray<SemesterCourse>,
  ) => {
    if (disciplineView === 'cards') {
      return (
        <div className="flex flex-wrap gap-2">
          {courses.map(renderManualDiscipline)}
        </div>
      )
    }

    return (
      <div className="-mx-3 w-[calc(100%+1.5rem)] overflow-hidden border-y border-border">
        <table className="w-full table-fixed border-collapse text-left text-xs">
          <colgroup>
            <col className="w-16" />
            <col />
            <col className="w-14" />
            <col className="w-28" />
          </colgroup>
          <thead className="bg-muted/60 text-muted-foreground">
            <tr>
              <th className="px-2 py-1.5 font-bold">Código</th>
              <th className="px-2 py-1.5 font-bold">Disciplina</th>
              <th className="px-2 py-1.5 font-bold">Créditos</th>
              <th className="px-2 py-1.5 text-right font-bold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-muted/40">
                <td className="px-2 py-2 font-black whitespace-nowrap">
                  <button
                    type="button"
                    className="pomi-focus rounded-sm text-primary hover:text-primary/80"
                    onClick={() => showCourseDetails(course.id)}
                  >
                    {course.code}
                  </button>
                </td>
                <td className="min-w-0 px-2 py-2 text-muted-foreground">
                  <span className="block truncate" title={course.name}>
                    {course.name}
                  </span>
                  {classAvailabilityStatus(course.id) && (
                    <span className="block truncate font-semibold">
                      {classAvailabilityStatus(course.id)}
                    </span>
                  )}
                </td>
                <td className="px-2 py-2 whitespace-nowrap">
                  {course.credits}
                </td>
                <td className="px-1 py-1 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      className="h-7 px-1.5"
                      size="sm"
                      variant="ghost"
                      onClick={() => showCourseClasses(course.id)}
                    >
                      Turmas
                    </Button>
                    <Button
                      className="h-7 px-1.5 text-destructive"
                      size="sm"
                      variant="ghost"
                      aria-label={`Remover ${course.code} das disciplinas manuais`}
                      onClick={() => {
                        updateGuide(
                          guideWith({
                            manualCourseIds:
                              document.guide.manualCourseIds.filter(
                                (courseId) => courseId !== course.id,
                              ),
                          }),
                        )
                      }}
                    >
                      Remover
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  function showCourseAlternatives(courseId: number) {
    updateFilters({ courseId: String(courseId) })
    setGuideTab('classes')
    setMobileView('builder')
    setSelectedClassDetailsId(undefined)
  }

  return (
    <PageContainer size="wide" className="pt-5 pb-8">
      <SemesterPlanningHeader
        name={document.name}
        planningId={planningId}
        activePlanId={activePlanId}
        studyPeriodId={studyPeriodId}
        studyPeriodLocked={studyPeriodLocked}
        studyPeriods={query.data.studyPeriods}
        guideMode={guideMode}
        isSaving={isSaving}
        onPeriodChange={changePeriod}
        onGuideModeChange={(mode) => updateGuide({ ...document.guide, mode })}
        onConfigureGuide={() => {
          setConfigurationMode(
            guideMode === 'program' ? 'program' : 'curriculum',
          )
          setGuideConfigurationOpen(true)
        }}
        onOpenSaveDraft={() => setSaveDraftDialogOpen(true)}
        onRename={() => void renamePlan()}
        visibility={visibility}
        onConfigureVisibility={openVisibilityDialog}
        onRemove={() => void removePlan()}
      />
      {error && (
        <Alert variant="destructive" className="mb-5">
          <AlertTitle>Não foi possível atualizar o planejamento</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="xl:flex xl:h-[calc(100svh-4.5rem)] xl:min-h-0 xl:flex-col xl:pb-5">
        <div
          className={mobileView === 'selection' ? 'hidden xl:block' : undefined}
        >
          <ClassesFilterToolbar
            mode={guideTab}
            filters={filters}
            courses={query.data.courses}
            guideClassContext={guideClassContext}
            onChange={updateFilters}
          />
        </div>
        <div className="mb-3 grid grid-cols-3 rounded-md border-2 border-strong-border p-1 xl:hidden">
          <Button
            size="sm"
            variant={mobileView === 'builder' ? 'default' : 'ghost'}
            onClick={() => setMobileView('builder')}
          >
            Montar
          </Button>
          <Button
            size="sm"
            variant={mobileView === 'schedule' ? 'default' : 'ghost'}
            onClick={() => setMobileView('schedule')}
          >
            Horário
          </Button>
          <Button
            size="sm"
            variant={mobileView === 'selection' ? 'default' : 'ghost'}
            onClick={() => setMobileView('selection')}
          >
            Minhas ({snapshot.selectedClasses.length})
          </Button>
        </div>
        <div
          className={`${mobileView === 'selection' ? 'hidden xl:grid' : 'grid'} min-h-0 flex-1 gap-5 xl:grid-cols-[minmax(0,1fr)_28rem]`}
        >
          <div
            className={`${mobileView === 'schedule' ? 'block' : 'hidden'} min-h-0 xl:block`}
          >
            <SemesterScheduleGrid
              selectedClasses={snapshot.selectedClasses}
              meetings={query.data.meetings}
              coursesById={courseById}
              conflictingClassIds={selectedClassIdsWithConflict}
              previewClass={
                previewClassId ? classById.get(previewClassId) : undefined
              }
              selection={{
                ref: gridSelectionRef,
                activeSelection: activeGridSelection,
                highlightedDayIndexes,
                isDragging: isDraggingGridSelection,
                onPointerDown: handleGridPointerDown,
                onPointerMove: handleGridPointerMove,
                onPointerUp: finishGridSelection,
                onPointerCancel: cancelGridSelection,
              }}
              isClassSelectionEnabled={guideTab === 'classes'}
              onSelectedClassClick={setSelectedClassDetailsId}
            />
            {!snapshot.selectedClasses.length && (
              <p className="mt-3 text-center text-sm font-semibold text-muted-foreground">
                Encontre uma turma em Montar para começar seu horário.
              </p>
            )}
          </div>
          <aside
            className={`${mobileView === 'builder' ? 'flex' : 'hidden'} min-h-0 flex-col rounded-lg border-2 border-strong-border bg-card lg:h-full xl:flex`}
          >
            <div className="flex items-center gap-2 border-b-2 border-strong-border p-2">
              <div className="grid min-w-0 flex-1 grid-cols-2">
                <Button
                  size="sm"
                  variant={guideTab === 'disciplines' ? 'default' : 'ghost'}
                  onClick={() => setGuideTab('disciplines')}
                >
                  Disciplinas
                </Button>
                <Button
                  size="sm"
                  variant={guideTab === 'classes' ? 'default' : 'ghost'}
                  onClick={() => setGuideTab('classes')}
                >
                  Turmas
                </Button>
              </div>
              {guideTab === 'disciplines' && (
                <div
                  className="flex shrink-0 rounded border border-strong-border p-0.5"
                  role="group"
                  aria-label="Visualização das disciplinas"
                >
                  <Button
                    className="size-7 p-0"
                    size="icon"
                    variant={disciplineView === 'cards' ? 'default' : 'ghost'}
                    aria-label="Visualizar disciplinas em cards"
                    aria-pressed={disciplineView === 'cards'}
                    title="Cards"
                    onClick={() => setDisciplineView('cards')}
                  >
                    <LayoutGrid className="size-4" aria-hidden="true" />
                  </Button>
                  <Button
                    className="size-7 p-0"
                    size="icon"
                    variant={disciplineView === 'table' ? 'default' : 'ghost'}
                    aria-label="Visualizar disciplinas em tabela"
                    aria-pressed={disciplineView === 'table'}
                    title="Tabela"
                    onClick={() => setDisciplineView('table')}
                  >
                    <Table2 className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              )}
            </div>
            {guideTab === 'classes' && filters.courseId && (
              <div className="flex items-center gap-3 border-b border-border px-3 py-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold">
                    Turmas de{' '}
                    {courseById.get(Number(filters.courseId))?.code ??
                      filters.courseId}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {courseById.get(Number(filters.courseId))?.name}
                  </p>
                </div>
                <Button
                  className="size-8 p-0"
                  size="icon"
                  variant="ghost"
                  aria-label="Mostrar turmas de todas as disciplinas"
                  onClick={() => updateFilters({ courseId: '' })}
                >
                  ×
                </Button>
              </div>
            )}
            <Dialog
              open={guideConfigurationOpen}
              onOpenChange={setGuideConfigurationOpen}
            >
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Configurar guia</DialogTitle>
                </DialogHeader>
                <div className="mb-4 grid grid-cols-2 rounded-md border-2 border-strong-border p-0.5">
                  <Button
                    size="sm"
                    variant={
                      configurationMode === 'curriculum' ? 'default' : 'ghost'
                    }
                    onClick={() => setConfigurationMode('curriculum')}
                  >
                    Currículo
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      configurationMode === 'program' ? 'default' : 'ghost'
                    }
                    onClick={() => setConfigurationMode('program')}
                  >
                    Programa
                  </Button>
                </div>
                {configurationMode === 'curriculum'
                  ? curriculumGuideConfiguration
                  : programGuideConfiguration}
              </DialogContent>
            </Dialog>
            <Dialog
              open={manualCourseDialogOpen}
              onOpenChange={setManualCourseDialogOpen}
            >
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar disciplina ao guia</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <AutocompleteSelect
                    ariaLabel="Disciplina manual"
                    value={manualCourseId}
                    options={[...courseById.values()]
                      .sort((left, right) =>
                        left.code.localeCompare(right.code),
                      )
                      .map((course) => ({
                        value: String(course.id),
                        label: `${course.code} — ${course.name} (${course.credits} créditos)`,
                      }))}
                    placeholder="Escolha uma disciplina"
                    onValueChange={setManualCourseId}
                  />
                  <Button
                    className="w-full"
                    disabled={
                      !manualCourseId ||
                      manualCourseIds.includes(Number(manualCourseId))
                    }
                    onClick={() => {
                      const courseId = Number(manualCourseId)
                      if (!Number.isInteger(courseId)) return
                      updateGuide(
                        guideWith({
                          manualCourseIds:
                            document.guide.manualCourseIds.includes(courseId)
                              ? document.guide.manualCourseIds
                              : [...document.guide.manualCourseIds, courseId],
                        }),
                      )
                      setManualCourseId('')
                      setManualCourseDialogOpen(false)
                    }}
                  >
                    Adicionar ao guia
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3">
              {guideTab === 'classes' ? (
                <ClassesGuidePanel
                  courses={query.data.courses}
                  classes={filteredGuideClasses}
                  allClasses={query.data.classes}
                  meetings={query.data.meetings}
                  selectedClassIds={new Set(document.classIds)}
                  professorEvaluationSummaries={professorEvaluationSummaries}
                  onDispatch={(command) => void dispatch(command)}
                  onPreview={setPreviewClassId}
                  onSelectedClassClick={setSelectedClassDetailsId}
                />
              ) : openedCourseId || addingClass ? (
                (() => {
                  const selectedCourseId = openedCourseId ?? 0
                  const course = courseById.get(selectedCourseId)
                  const classes = query.data.classes.filter(
                    (classItem) => classItem.courseId === selectedCourseId,
                  )
                  return (
                    <section className="space-y-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setOpenedCourseId(undefined)
                          setPreviewClassId(undefined)
                          setAddingClass(false)
                        }}
                      >
                        ← Voltar ao guia
                      </Button>
                      {addingClass && (
                        <AutocompleteSelect
                          ariaLabel="Disciplina da turma"
                          value={classPickerCourseId}
                          options={[...courseById.values()].map((item) => ({
                            value: String(item.id),
                            label: `${item.code} — ${item.name} (${item.credits} créditos)`,
                          }))}
                          placeholder="Escolha a disciplina"
                          onValueChange={(value) => {
                            setClassPickerCourseId(value)
                            setOpenedCourseId(value ? Number(value) : undefined)
                          }}
                        />
                      )}
                      {!course && (
                        <p className="text-sm text-muted-foreground">
                          Escolha uma disciplina para ver as turmas disponíveis.
                        </p>
                      )}
                      {course && (
                        <>
                          <div>
                            <h3 className="font-extrabold">{course.code}</h3>
                            <p className="text-sm text-muted-foreground">
                              {course.name} · {course.credits} créditos
                            </p>
                          </div>
                          {classes.map((classItem) => {
                            const meetings = query.data.meetings.filter(
                              (meeting) => meeting.classId === classItem.id,
                            )
                            const selected = selectedIds.has(classItem.id)
                            const selectedClass = document.classIds.find(
                              (classId) =>
                                classById.get(classId)?.courseId === course.id,
                            )
                            return (
                              <article
                                key={classItem.id}
                                className="space-y-2 border-b border-border py-3 last:border-b-0"
                                onMouseEnter={() =>
                                  setPreviewClassId(classItem.id)
                                }
                                onMouseLeave={() =>
                                  setPreviewClassId(undefined)
                                }
                                onFocus={() => setPreviewClassId(classItem.id)}
                                onBlur={() => setPreviewClassId(undefined)}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h4 className="text-sm font-extrabold">
                                      Turma {classItem.code}
                                    </h4>
                                    <p className="text-xs text-muted-foreground">
                                      {classItem.professors
                                        .map((professor) => professor.name)
                                        .join(', ') ||
                                        'Professor não informado'}
                                    </p>
                                  </div>
                                  {selected ? (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() =>
                                        dispatch({
                                          type: 'removeClass',
                                          classId: classItem.id,
                                        })
                                      }
                                    >
                                      Remover
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        dispatch({
                                          type: selectedClass
                                            ? 'replaceClass'
                                            : 'addClass',
                                          classId: classItem.id,
                                        })
                                      }
                                    >
                                      {selectedClass ? 'Trocar' : 'Adicionar'}
                                    </Button>
                                  )}
                                </div>
                                <ul className="space-y-1 text-xs text-muted-foreground">
                                  {meetings.map((meeting) => (
                                    <li key={meeting.id}>
                                      {
                                        days.find(
                                          ([day]) => day === meeting.dayOfWeek,
                                        )?.[1]
                                      }{' '}
                                      {meeting.start}–{meeting.end} ·{' '}
                                      {meeting.roomCode}
                                    </li>
                                  ))}
                                </ul>
                              </article>
                            )
                          })}
                          {!classes.length && (
                            <p className="text-sm text-muted-foreground">
                              Sem turmas disponíveis neste período.
                            </p>
                          )}
                        </>
                      )}
                    </section>
                  )
                })()
              ) : guideMode === 'curriculum' ? (
                <>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => setManualCourseDialogOpen(true)}
                  >
                    + Adicionar disciplina ao guia
                  </Button>
                  {visibleManualCourses.length > 0 && (
                    <section>
                      <h3 className="mb-2 text-xs font-black tracking-[0.12em] text-muted-foreground uppercase">
                        Adicionadas manualmente
                      </h3>
                      {renderManualDisciplineCollection(
                        visibleManualCourses.map(({ course }) => course),
                      )}
                    </section>
                  )}
                  {visibleDisciplineGroups.map((group) => (
                    <section key={group.semester}>
                      <h3 className="mb-2 text-xs font-black tracking-[0.12em] text-muted-foreground uppercase">
                        {group.semester > 0
                          ? `${group.semester}º semestre`
                          : 'Adicionadas manualmente'}
                      </h3>
                      {renderDisciplineCollection(
                        group.courses.map(({ course }) => course),
                      )}
                    </section>
                  ))}
                  {!visibleDisciplineGroups.length &&
                    !visibleManualCourses.length &&
                    (curriculumGuideConfigured ? (
                      <p className="p-3 text-sm text-muted-foreground">
                        {hasRestrictiveGuideFilters
                          ? 'Nenhuma disciplina atende aos filtros aplicados.'
                          : 'Todas as disciplinas do currículo já estão planejadas.'}
                      </p>
                    ) : (
                      guideSetup
                    ))}
                </>
              ) : guideMode === 'program' ? (
                <>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => setManualCourseDialogOpen(true)}
                  >
                    + Adicionar disciplina ao guia
                  </Button>
                  {visibleManualCourses.length > 0 && (
                    <section>
                      <h3 className="mb-2 text-xs font-black tracking-[0.12em] text-muted-foreground uppercase">
                        Adicionadas manualmente
                      </h3>
                      {renderManualDisciplineCollection(
                        visibleManualCourses.map(({ course }) => course),
                      )}
                    </section>
                  )}
                  {selectedProgramBlocks.map((group) => (
                    <section key={group.title} className="space-y-2">
                      <h3 className="text-xs font-black tracking-[0.12em] text-muted-foreground uppercase">
                        {group.title}
                      </h3>
                      {renderDisciplineCollection(
                        group.blocks.mandatory.flatMap((requirement) => {
                          const course =
                            requirement.selector.type === 'specificCourse'
                              ? courseById.get(
                                  Number(requirement.selector.courseId),
                                )
                              : undefined
                          if (course && manualCourseIdSet.has(course.id))
                            return []
                          if (course) {
                            if (
                              scheduledCourseIds.has(course.id) ||
                              manualCourseIdSet.has(course.id) ||
                              !disciplineMatchesFilters(course)
                            )
                              return []
                            return [course]
                          }
                          return []
                        }),
                      )}
                      {group.blocks.mandatory.map((requirement, index) =>
                        requirement.selector.type !== 'specificCourse' ||
                        !courseById.has(
                          Number(requirement.selector.courseId),
                        ) ? (
                          <span
                            key={`${group.title}-mandatory-${index}`}
                            className="inline-block rounded border-2 border-muted-foreground/50 px-2 py-1 text-xs font-bold text-muted-foreground"
                          >
                            {selectorLabel(requirement.selector)}
                          </span>
                        ) : null,
                      )}
                      {group.blocks.electives.map((requirement, index) => {
                        const courses =
                          coursesForElectiveRequirement(requirement)
                        const broadSelectors =
                          requirement.eligibleCourses.filter(
                            (selector) => selector.type !== 'specificCourse',
                          )
                        return (
                          <section
                            key={`${group.title}-elective-${index}`}
                            className="space-y-2 border-t border-border pt-2"
                          >
                            <h4 className="text-xs font-black tracking-wide text-muted-foreground uppercase">
                              Eletiva: {requirement.requiredCredits} créditos
                              {broadSelectors.length
                                ? ` · ${broadSelectors.map((selector) => selectorLabel(selector)).join(', ')}`
                                : ''}
                            </h4>
                            {courses.length > 0 &&
                              renderDisciplineCollection(courses)}
                          </section>
                        )
                      })}
                    </section>
                  ))}
                  {!selectedProgramBlocks.length &&
                    !visibleManualCourses.length &&
                    (programGuideConfigured ? (
                      <p className="p-3 text-sm text-muted-foreground">
                        Nenhum bloco disponível para este programa.
                      </p>
                    ) : (
                      guideSetup
                    ))}
                  {selectedProgramBlocks.length > 0 &&
                    disciplineResultCount === 0 &&
                    filters.withoutUnavailable &&
                    hasRestrictiveGuideFilters && (
                      <p className="p-3 text-sm text-muted-foreground">
                        Nenhuma disciplina atende aos filtros aplicados.
                      </p>
                    )}
                </>
              ) : (
                <>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => setManualCourseDialogOpen(true)}
                  >
                    + Adicionar disciplina ao guia
                  </Button>
                  {visibleManualCourses.length > 0 ? (
                    <section>
                      <h3 className="mb-2 text-xs font-black tracking-[0.12em] text-muted-foreground uppercase">
                        Adicionadas manualmente
                      </h3>
                      {renderManualDisciplineCollection(
                        visibleManualCourses.map(({ course }) => course),
                      )}
                    </section>
                  ) : (
                    <p className="p-3 text-sm text-muted-foreground">
                      Adicione uma disciplina manualmente para encontrar suas
                      turmas.
                    </p>
                  )}
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
      <div className={mobileView === 'selection' ? 'block' : 'hidden xl:block'}>
        <PlannerSelectionTray
          summary={plannerSummary}
          conflicts={detailedConflicts}
          selectedClasses={snapshot.selectedClasses}
          coursesById={courseById}
          meetings={query.data.meetings}
          onOpen={setSelectedClassDetailsId}
          onShowAlternatives={showCourseAlternatives}
          onShowInSchedule={(classId) => {
            setPreviewClassId(classId)
            setMobileView('schedule')
          }}
          onRemove={(classId) =>
            void dispatch({ type: 'removeClass', classId })
          }
        />
      </div>
      <SaveDraftDialog
        open={saveDraftDialogOpen}
        onOpenChange={setSaveDraftDialogOpen}
        onLogin={saveDraft}
      />
      <PlanningVisibilityDialog
        open={visibilityDialogOpen}
        value={visibilityDraft}
        isSaving={isSaving}
        onOpenChange={setVisibilityDialogOpen}
        onValueChange={setVisibilityDraft}
        onSave={() => void saveVisibility()}
      />
      <SelectedClassDialog
        classItem={selectedClassDetails}
        course={
          selectedClassDetails
            ? courseById.get(selectedClassDetails.courseId)
            : undefined
        }
        meetings={
          selectedClassDetails
            ? query.data.meetings.filter(
                (meeting) => meeting.classId === selectedClassDetails.id,
              )
            : []
        }
        professorEvaluationSummaries={professorEvaluationSummaries}
        onOpenChange={(open) => {
          if (!open) setSelectedClassDetailsId(undefined)
        }}
        onShowAlternatives={showCourseAlternatives}
        onRemove={(classId) => {
          setSelectedClassDetailsId(undefined)
          void dispatch({ type: 'removeClass', classId })
        }}
      />
      <CatalogProgramCourseDialog
        course={selectedCourseDetails}
        catalogYear={courseDetailsCatalogYear}
        onOpenChange={(open) => {
          if (!open) setSelectedCourseDetailsId(undefined)
        }}
      />
    </PageContainer>
  )
}
