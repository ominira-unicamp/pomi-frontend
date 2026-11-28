import { LayoutGrid, Table2 } from 'lucide-react'
import {
  scheduleDays as days,
  numericId,
  selectorLabel,
} from '@pomi/planner-domain/semester'
import {
  catalogProgramVariantForSelection,
  suggestionLabel,
} from '@pomi/planner-domain/curriculum'

import {
  SemesterEligibilityDetails,
  SemesterPrerequisiteDetails,
} from './components/SemesterEligibilityDetails'

import type { SemesterCourse } from '@pomi/planner-domain/semester'

import type { useSemesterPlanner } from './useSemesterPlanner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LoadingState, PageContainer } from '@/components/PageLayout'

import { PendingPlanningChanges } from '@/components/planning/PendingPlanningChanges'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'

import { ClassesGuidePanel } from '@/features/semester-planner/components/ClassesGuidePanel'
import { SemesterPlanningHeader } from '@/features/semester-planner/components/SemesterPlanningHeader'
import { SemesterPlanningExportDialog } from '@/features/semester-planner/components/SemesterPlanningExportDialog'
import { SemesterScheduleGrid } from '@/features/semester-planner/components/SemesterScheduleGrid'
import { PlanningVisibilityDialog } from '@/features/semester-planner/components/PlanningVisibilityDialog'
import { SelectedClassDialog } from '@/features/semester-planner/components/SelectedClassDialog'
import { ClassesFilterToolbar } from '@/features/semester-planner/components/ClassesFilterToolbar'
import { PlannerSelectionTray } from '@/features/semester-planner/components/PlannerSelectionTray'

import { SaveDraftDialog } from '@/planning-drafts/components/SaveDraftDialog'
import { mostRecentStudyPeriodsFirst } from '@/catalog/model/studyPeriodOrdering'

import { CatalogProgramCourseDialog } from '@/catalog/components/CatalogProgramCourseDialog'

function courseColor() {
  return 'border-strong-border bg-background text-foreground'
}
export function SemesterPlannerWorkspace({
  controller,
}: {
  controller: ReturnType<typeof useSemesterPlanner>
}) {
  const {
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
  } = controller.session
  const {
    auth,
    query,
    plansQuery,
    curriculaQuery,
    curriculumQuery,
    anonymousCurriculumDataQuery,
    anonymousSuggestionsQuery,
    planQuery,
  } = controller.resources
  const {
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
  } = controller.guide
  const {
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
  } = controller.selection
  const {
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
  } = controller.filters
  const {
    exportData,
    setExportData,
    visibilityDialogOpen,
    setVisibilityDialogOpen,
    saveDraftDialogOpen,
    setSaveDraftDialogOpen,
    manualCourseDialogOpen,
    setManualCourseDialogOpen,
    draftStorageError,
  } = controller.dialogs
  const {
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
  } = controller.actions
  const {
    resolvedTheme,
    configurationMode,
    setConfigurationMode,
    disciplineView,
    setDisciplineView,
    eligibility,
    professorEvaluationSummaries,
    loadedView,
  } = controller.presentation
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
            label: suggestionLabel(suggestion),
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
            const nextVariant = nextCatalogProgram
              ? catalogProgramVariantForSelection(nextCatalogProgram)
              : undefined
            setProgramCatalogProgramId(nextCatalogProgram?.id ?? '')
            setProgramCatalogProgramVariantId(nextVariant?.id ?? '')
            setProgramLanguageId('')
            if (!nextCatalogProgram) return
            updateGuide(
              guideWith({
                mode: 'program',
                program: {
                  catalogProgramId: numericId(nextCatalogProgram.id),
                  catalogProgramVariantId: numericId(nextVariant?.id ?? ''),
                  languageId: null,
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
            const catalogProgram = anonymousCatalogPrograms.find(
              (item) => item.id === value,
            )
            const variant = catalogProgram
              ? catalogProgramVariantForSelection(catalogProgram)
              : undefined
            setProgramCatalogTouched(true)
            setProgramCatalogProgramId(value)
            setProgramCatalogProgramVariantId(variant?.id ?? '')
            setProgramLanguageId('')
            updateGuide(
              guideWith({
                mode: 'program',
                program: {
                  catalogProgramId: numericId(value),
                  catalogProgramVariantId: numericId(variant?.id ?? ''),
                  languageId: null,
                },
              }),
            )
          }}
        />
      </label>
      {selectedProgramCatalog && selectedProgramCatalog.variants.length > 1 ? (
        <label className="block text-xs font-extrabold">
          Modalidade
          <AutocompleteSelect
            ariaLabel="Modalidade do programa"
            value={programCatalogProgramVariantId}
            emptyLabel="Definir depois"
            options={selectedProgramCatalog.variants.map((variant) => ({
              value: variant.id,
              label:
                variant.specializationId === null
                  ? variant.name
                  : `${variant.code} — ${variant.name}`,
            }))}
            placeholder="Escolha a modalidade"
            onValueChange={(value) => {
              setProgramCatalogProgramVariantId(value)
              updateGuide(
                guideWith({
                  mode: 'program',
                  program: { catalogProgramVariantId: numericId(value) },
                }),
              )
            }}
          />
        </label>
      ) : null}
      {Boolean(selectedProgramCatalog?.languages.length) && (
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
      )}
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
              <SemesterPrerequisiteDetails
                result={eligibility.prerequisites.get(course.id)}
              />
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
                  <SemesterPrerequisiteDetails
                    result={eligibility.prerequisites.get(course.id)}
                  />
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
        <SemesterPrerequisiteDetails
          result={eligibility.prerequisites.get(course.id)}
        />
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
                  <SemesterPrerequisiteDetails
                    result={eligibility.prerequisites.get(course.id)}
                  />
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
      {session && (
        <PendingPlanningChanges
          pending={session.hasPending()}
          flush={() => session.flush()}
          discard={() => session.dispose()}
        />
      )}
      {activePlanId && (
        <div
          role="status"
          className="mb-3 flex items-center gap-3 text-sm text-muted-foreground"
        >
          {sessionState?.saveStatus === 'error'
            ? 'Não foi possível salvar. Suas alterações continuam nesta tela.'
            : sessionState?.saveStatus === 'clean'
              ? 'Todas as alterações foram salvas.'
              : 'Salvando alterações…'}
          {sessionState?.saveStatus === 'error' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                void session?.flush()
              }}
            >
              Tentar novamente
            </Button>
          )}
        </div>
      )}

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
        onGuideModeChange={(mode) => {
          setGuideMode(mode)
          void dispatch({
            type: 'setGuide',
            guide: { ...document.guide, mode },
          })
        }}
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
        canExport={
          snapshot.selectedClasses.length > 0 &&
          query.data.studyPeriods.some(
            (period) => period.id === studyPeriodId,
          ) &&
          !query.isFetching
        }
        onExport={() => {
          const period = query.data.studyPeriods.find(
            (item) => item.id === studyPeriodId,
          )
          if (!period) return
          setExportData(
            structuredClone({
              name: document.name,
              period,
              classes: snapshot.selectedClasses,
              courses: [...courseById.values()],
              meetings: query.data.meetings,
            }),
          )
        }}
      />
      {exportData && (
        <SemesterPlanningExportDialog
          data={exportData}
          initialTheme={resolvedTheme}
          onClose={() => setExportData(undefined)}
        />
      )}
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
            eligibility={eligibility}
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
            className={`${mobileView === 'schedule' ? 'block' : 'hidden'} min-h-0 min-w-0 xl:block`}
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
                {configurationMode === 'program' && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      updateGuide(
                        guideWith({
                          program: {
                            catalogProgramId: null,
                            catalogProgramVariantId: null,
                            languageId: null,
                          },
                        }),
                      )
                    }
                  >
                    Remover configuração de programa
                  </Button>
                )}
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
                  eligibility={eligibility}
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
                                <SemesterEligibilityDetails
                                  prerequisite={eligibility.prerequisites.get(
                                    classItem.courseId,
                                  )}
                                  reservation={eligibility.reservations.get(
                                    classItem.id,
                                  )}
                                  programs={classItem.reservationPrograms}
                                />
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
        error={draftStorageError}
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
        eligibility={eligibility}
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
