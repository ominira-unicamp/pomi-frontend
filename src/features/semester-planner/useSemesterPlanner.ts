import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'

import {
  emptyGuide,
  guideFromApi,
  numericId,
} from '@pomi/planner-domain/semester'
import { catalogProgramVariantForSelection } from '@pomi/planner-domain/curriculum'
import { buildSemesterGuideView } from './model/semesterGuideView'

import { useSemesterEligibility } from './hooks/useSemesterEligibility'
import { useSemesterPlanningSession } from './hooks/useSemesterPlanningSession'
import type {
  GuideChanges,
  GuideMode,
  SemesterPlannerCommand,
  SemesterPlanningDocument,
  SemesterPlanningGuide,
} from '@pomi/planner-domain/semester'
import type { SemesterDraftBootstrap } from '@/planning-drafts/data/planningDraftBootstrap'
import type { SemesterPlanningVisibility } from '@/features/semester-planner/data/semesterPlanningApi'
import type { SemesterPlanningExportData } from '@/features/semester-planner/model/semesterPlanningExport'

import { useOptionalAuth } from '@/auth/AuthProvider'
import {
  deleteSemesterPlanning,
  updateSemesterPlanningVisibility,
} from '@/features/semester-planner/data/semesterPlanningApi'

import { useSemesterPlannerQueries } from '@/features/semester-planner/hooks/useSemesterPlannerQueries'
import { isApprovedStudentCourseAttempt } from '@/academic-record/data/studentApi'

import { semesterDraftBootstrapKey } from '@/planning-drafts/data/planningDraftBootstrap'
import { saveDraftHandoff } from '@/planning-drafts/data/planningDraftHandoff'

import { mostRecentStudyPeriodsFirst } from '@/catalog/model/studyPeriodOrdering'
import { studyPeriodLabel } from '@/catalog/model/studyPeriod'
import { useScheduleGridSelection } from '@/features/semester-planner/hooks/useScheduleGridSelection'
import { useClassesGuideFilters } from '@/features/semester-planner/hooks/useClassesGuideFilters'
import { compareProgramCodes } from '@/catalog/model/programOrdering'

import { useTheme } from '@/components/ThemeProvider'

type GuideTab = 'disciplines' | 'classes'
type DisciplineView = 'cards' | 'table'
export function useSemesterPlanner({
  planningId = 'rascunho',
}: {
  planningId?: string
}) {
  const { resolvedTheme } = useTheme()
  const [exportData, setExportData] = useState<SemesterPlanningExportData>()
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
  const [programCatalogProgramVariantId, setProgramCatalogProgramVariantId] =
    useState('')
  const [programLanguageId, setProgramLanguageId] = useState('')
  const [anonymousSuggestionCourseIds, setAnonymousSuggestionCourseIds] =
    useState<
      ReadonlyArray<
        Readonly<{ semester: number; courseIds: ReadonlyArray<number> }>
      >
    >()
  const [initialDocument, setDocument] = useState<SemesterPlanningDocument>(
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
    userId,
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
  const { session, state: sessionState } = useSemesterPlanningSession({
    data: query.data,
    initialDocument,
    identity: `${sessionSubject}:${planningId}`,
    userId,
    planningId: activePlanId,
    getAccessToken: auth.getAccessToken,
    onConfirmed: () => {
      void plansQuery.refetch()
    },
  })
  const document = sessionState?.snapshot?.document ?? initialDocument
  const snapshot = sessionState?.snapshot
  useEffect(() => {
    if (studyPeriodId && snapshot && !snapshot.document.studyPeriodId)
      void session?.dispatch({ type: 'selectStudyPeriod', studyPeriodId })
  }, [session, studyPeriodId, snapshot?.document.studyPeriodId])
  const eligibility = useSemesterEligibility({
    data: query.data,
    catalogId: studentProfileQuery.isError
      ? undefined
      : studentProfileQuery.data?.catalogId,
    programId: studentProfileQuery.isError
      ? undefined
      : studentProfileQuery.data?.programId,
    attempts: courseAttemptsQuery.isError
      ? undefined
      : courseAttemptsQuery.data,
    studyPeriodId,
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
    setProgramCatalogProgramVariantId(
      guide.program.catalogProgramVariantId
        ? String(guide.program.catalogProgramVariantId)
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
      setProgramCatalogProgramVariantId(
        catalogProgramVariantForSelection(
          catalogProgram,
          profile.specializationId,
        )?.id ?? '',
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
    setProgramCatalogProgramVariantId(
      next.program.catalogProgramVariantId
        ? String(next.program.catalogProgramVariantId)
        : '',
    )
    setProgramLanguageId(
      next.program.languageId ? String(next.program.languageId) : '',
    )
    setManualCourseIds(next.manualCourseIds)
    const programPartial =
      next.program.catalogProgramId !== null &&
      next.program.catalogProgramVariantId === null
    const curriculumPartial =
      next.curriculum.source === 'saved'
        ? next.curriculum.curriculumId === null
        : next.curriculum.source === 'suggestion' &&
          next.curriculum.suggestionId === null
    if (programPartial || curriculumPartial) return
    void dispatch({ type: 'setGuide', guide: next })
  }
  function guideWith(changes: GuideChanges): SemesterPlanningGuide {
    return {
      ...document.guide,
      ...changes,
      curriculum: { ...document.guide.curriculum, ...changes.curriculum },
      program: {
        catalogProgramId: numericId(programCatalogProgramId),
        catalogProgramVariantId: numericId(programCatalogProgramVariantId),
        languageId: numericId(programLanguageId),
        ...changes.program,
      },
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
  const loadedView = useMemo(
    () =>
      buildSemesterGuideView({
        data: query.data,
        snapshot,
        document,
        anonymousData: anonymousCurriculumDataQuery.data,
        curriculum: curriculumQuery.data,
        anonymousSuggestionCourseIds,
        completedCourseIds,
        eligibility,
        filters,
        guideCurriculumId,
        guideMode,
        guideSource,
        manualCourseIds,
        programLanguageId,
        programCatalogProgramVariantId,
        selectedProgramCatalog,
      }),
    [
      anonymousCurriculumDataQuery.data,
      anonymousSuggestionCourseIds,
      completedCourseIds,
      eligibility,
      curriculumQuery.data,
      document.classIds,
      filters,
      guideCurriculumId,
      guideMode,
      guideSource,
      manualCourseIds,
      programLanguageId,
      programCatalogProgramVariantId,
      query.data,
      selectedProgramCatalog,
      snapshot,
    ],
  )
  async function dispatch(command: SemesterPlannerCommand) {
    if (!session) return
    const result = await session.dispatch(command)
    if (!result.ok) {
      setError(
        result.error.code === 'courseAlreadyHasClass'
          ? 'Esta disciplina já possui uma turma no planejamento. Escolha “Trocar turma” para substituí-la.'
          : 'Não foi possível concluir a operação.',
      )
      return
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
    void dispatch({ type: 'selectStudyPeriod', studyPeriodId: nextId })
  }
  const [draftStorageError, setDraftStorageError] = useState<string>()
  function saveDraft() {
    if (!studyPeriodId) return
    setDraftStorageError(undefined)
    try {
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
    } catch {
      setDraftStorageError(
        'Não foi possível guardar o rascunho neste navegador. Suas escolhas continuam nesta aba; libere o armazenamento e tente novamente.',
      )
    }
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
    setProgramCatalogProgramVariantId(
      nextGuide.program.catalogProgramVariantId
        ? String(nextGuide.program.catalogProgramVariantId)
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
    if (!activePlanId || !userId) return
    try {
      if (session && !(await session.flush())) return
      setIsSaving(true)
      const updated = await updateSemesterPlanningVisibility(
        userId,
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
    if (!activePlanId || !userId) return
    if (
      !window.confirm(
        `Apagar “${document.name}”? Esta ação não pode ser desfeita.`,
      )
    )
      return
    try {
      if (session && !(await session.flush())) return
      setIsSaving(true)
      await deleteSemesterPlanning(userId, activePlanId, auth.getAccessToken)
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
  return {
    session: {
      studyPeriodId,
      studyPeriodLocked,
      activePlanId,
      visibility,
      visibilityDraft,
      setVisibilityDraft,
      isSaving,
      error,
      session,
      sessionState,
      document,
      snapshot,
      planningId,
    },
    resources: {
      auth,
      query,
      plansQuery,
      curriculaQuery,
      curriculumQuery,
      anonymousCurriculumDataQuery,
      anonymousSuggestionsQuery,
      planQuery,
    },
    guide: {
      guideMode,
      setGuideMode,
      guideCurriculumId,
      setGuideCurriculumTouched,
      guideSource,
      guideConfigurationOpen,
      setGuideConfigurationOpen,
      guideTab,
      setGuideTab,
      manualCourseIds,
      manualCourseId,
      setManualCourseId,
      anonymousCatalogId,
      setAnonymousCatalogId,
      anonymousCatalogProgramId,
      setAnonymousCatalogProgramId,
      anonymousSuggestionId,
      setAnonymousSuggestionId,
      programCatalogId,
      setProgramCatalogId,
      setProgramCatalogTouched,
      programCatalogProgramId,
      setProgramCatalogProgramId,
      programCatalogProgramVariantId,
      setProgramCatalogProgramVariantId,
      programLanguageId,
      setProgramLanguageId,
      anonymousSuggestionCourseIds,
      anonymousCatalogPrograms,
      anonymousCatalogs,
      anonymousPrograms,
      programCatalogPrograms,
      selectedProgramCatalog,
      anonymousSuggestions,
      selectedAnonymousSuggestion,
    },
    selection: {
      previewClassId,
      setPreviewClassId,
      selectedClassDetailsId,
      setSelectedClassDetailsId,
      selectedCourseDetailsId,
      setSelectedCourseDetailsId,
      mobileView,
      setMobileView,
      openedCourseId,
      setOpenedCourseId,
      addingClass,
      setAddingClass,
      classPickerCourseId,
      setClassPickerCourseId,
    },
    filters: {
      filters,
      updateFilters,
      gridSelectionRef,
      activeGridSelection,
      highlightedDayIndexes,
      isDraggingGridSelection,
      handleGridPointerDown,
      handleGridPointerMove,
      finishGridSelection,
      cancelGridSelection,
    },
    dialogs: {
      exportData,
      setExportData,
      visibilityDialogOpen,
      setVisibilityDialogOpen,
      saveDraftDialogOpen,
      setSaveDraftDialogOpen,
      manualCourseDialogOpen,
      setManualCourseDialogOpen,
      draftStorageError,
    },
    actions: {
      updateGuide,
      guideWith,
      dispatch,
      applyAnonymousSuggestion,
      changePeriod,
      saveDraft,
      renamePlan,
      openVisibilityDialog,
      saveVisibility,
      removePlan,
    },
    presentation: {
      resolvedTheme,
      configurationMode,
      setConfigurationMode,
      disciplineView,
      setDisciplineView,
      eligibility,
      professorEvaluationSummaries,
      loadedView,
    },
  }
}
