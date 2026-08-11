import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import {
  Download,
  MoreHorizontal,
  Pencil,
  Save,
  Trash2,
  Upload,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

import type {
  CatalogProgramId,
} from '@/planner/domain/curriculumPlanner'
import type {
  ClassMeeting,
  SemesterClass,
  SemesterCourse,
  SemesterPlannerCommand,
  SemesterPlanningDocument,
  SemesterPlanningGuide,
} from '@/semester-planner/domain/semesterPlanner'
import type {
  GuideChanges,
  GuideClassContext,
  GuideMode,
} from '@/semester-planner/domain/guide'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PageContainer, PageHeader } from '@/components/PageLayout'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { getCurriculum, listCurricula } from '@/planner/data/curriculumPersistenceApi'
import { useStudentProfile } from '@/student/hooks/useStudentProfile'
import {
  createSemesterPlanning,
  deleteSemesterPlanning,
  listSemesterPlannings,
  loadSemesterPlannerStaticData,
} from '@/semester-planner/data/semesterPlanningApi'
import { createApiSemesterPlanner } from '@/semester-planner/data/apiSemesterPlanner'
import { createInMemorySemesterPlanner } from '@/semester-planner/domain/inMemorySemesterPlanner'
import {
  downloadSemesterPlanning,
  parseSemesterPlanning,
  resolveSemesterPlanningImport,
  serializeSemesterPlanning,
} from '@/semester-planner/domain/semesterPlanningTransfer'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import { createApiCurriculumPlannerStaticDataSource } from '@/catalog/data/curriculumCatalogApi'
import { loadCurriculumSuggestions } from '@/planner/data/curriculumSuggestionApi'
import {
  buildGuideClassContext,
  emptyGuide,
  guideFromApi,
  matchesGuideClass,
  numericId,
  programGuideBlocks,
  selectorLabel,
} from '@/semester-planner/domain/guide'

const days = [
  ['MONDAY', 'Seg'],
  ['TUESDAY', 'Ter'],
  ['WEDNESDAY', 'Qua'],
  ['THURSDAY', 'Qui'],
  ['FRIDAY', 'Sex'],
  ['SATURDAY', 'Sáb'],
] as const

const startHour = 7
const endHour = 23
const curriculumStaticDataSource = createApiCurriculumPlannerStaticDataSource()

type GuideTab = 'disciplines' | 'classes'

function minutes(value: string) {
  const [hours, minute] = value.split(':').map(Number)
  return hours * 60 + minute
}

type GridSelection = Readonly<{
  startDay: number
  endDay: number
  startRow: number
  endRow: number
}>

const gridRowCount = endHour - startHour

function clampGridIndex(value: number, max: number) {
  return Math.max(0, Math.min(max, value))
}

function selectionFromFilters(
  selectedDays: ReadonlyArray<string>,
  start: string,
  end: string,
): GridSelection | undefined {
  if (!selectedDays.length && !start && !end) return undefined
  const dayIndexes = selectedDays
    .map((day) => days.findIndex(([value]) => value === day))
    .filter((index) => index >= 0)
  const startRow = start
    ? clampGridIndex(minutes(start) / 60 - startHour, gridRowCount - 1)
    : 0
  const endRow = end
    ? clampGridIndex(minutes(end) / 60 - startHour, gridRowCount)
    : gridRowCount
  return {
    startDay: dayIndexes.length ? Math.min(...dayIndexes) : 0,
    endDay: dayIndexes.length ? Math.max(...dayIndexes) : days.length - 1,
    startRow: Math.min(startRow, endRow),
    endRow: Math.max(startRow + 1, endRow),
  }
}

function courseColor(code: string) {
  const colors = [
    'border-primary bg-primary/10',
    'border-chart-2 bg-chart-2/10',
    'border-chart-3 bg-chart-3/10',
    'border-chart-4 bg-chart-4/10',
  ]
  return colors[
    [...code].reduce((total, char) => total + char.charCodeAt(0), 0) %
      colors.length
  ]
}

function ClassesGuidePanel({
  courses,
  classes,
  meetings,
  selectedClassIds,
  classFilterCourseId,
  classFilterStart,
  classFilterEnd,
  classFilterDays,
  onCourseFilterChange,
  onStartChange,
  onEndChange,
  onDaysChange,
  guideClassContext,
  guideClassContextKey,
  onDispatch,
  onPreview,
}: {
  courses: ReadonlyArray<SemesterCourse>
  classes: ReadonlyArray<SemesterClass>
  meetings: ReadonlyArray<ClassMeeting>
  selectedClassIds: ReadonlySet<number>
  classFilterCourseId: string
  classFilterStart: string
  classFilterEnd: string
  classFilterDays: ReadonlyArray<string>
  onCourseFilterChange: (value: string) => void
  onStartChange: (value: string) => void
  onEndChange: (value: string) => void
  onDaysChange: (day: string) => void
  guideClassContext: GuideClassContext
  guideClassContextKey: string
  onDispatch: (command: SemesterPlannerCommand) => void
  onPreview: (classId: number | undefined) => void
}) {
  const [disciplineFilterOpen, setDisciplineFilterOpen] = useState(
    Boolean(classFilterCourseId),
  )
  const [timeFilterOpen, setTimeFilterOpen] = useState(false)
  const [daysFilterOpen, setDaysFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const courseById = new Map(courses.map((course) => [course.id, course]))
  const filterStart = classFilterStart ? minutes(classFilterStart) : undefined
  const filterEnd = classFilterEnd ? minutes(classFilterEnd) : undefined
  const filteredClasses = classes.filter((classItem) => {
    if (!matchesGuideClass(classItem, guideClassContext)) return false
    if (
      disciplineFilterOpen &&
      classFilterCourseId &&
      classItem.courseId !== Number(classFilterCourseId)
    )
      return false
    const classMeetings = meetings.filter(
      (meeting) => meeting.classId === classItem.id,
    )
    if (
      daysFilterOpen &&
      classFilterDays.length > 0 &&
      !classMeetings.some((meeting) =>
        classFilterDays.includes(meeting.dayOfWeek),
      )
    )
      return false
    if (
      timeFilterOpen &&
      (filterStart !== undefined || filterEnd !== undefined)
    ) {
      const start = filterStart ?? 0
      const end = filterEnd ?? 24 * 60
      if (
        !classMeetings.some(
          (meeting) =>
            minutes(meeting.start) < end && minutes(meeting.end) > start,
        )
      )
        return false
    }
    return true
  })
  const courseOptions = courses.map((course) => ({
    value: String(course.id),
    label: `${course.code} — ${course.name}`,
  }))
  const hourOptions = Array.from(
    { length: endHour - startHour + 1 },
    (_, index) => `${String(startHour + index).padStart(2, '0')}:00`,
  )
  const pageSize = 20
  const pageCount = Math.max(1, Math.ceil(filteredClasses.length / pageSize))
  const visibleClasses = filteredClasses.slice(
    (page - 1) * pageSize,
    page * pageSize,
  )

  useEffect(() => {
    setPage(1)
  }, [
    guideClassContextKey,
    classFilterCourseId,
    classFilterStart,
    classFilterEnd,
    classFilterDays,
  ])

  useEffect(() => {
    if (classFilterCourseId) setDisciplineFilterOpen(true)
  }, [classFilterCourseId])

  useEffect(() => {
    if (classFilterStart || classFilterEnd) setTimeFilterOpen(true)
  }, [classFilterStart, classFilterEnd])

  useEffect(() => {
    if (classFilterDays.length) setDaysFilterOpen(true)
  }, [classFilterDays])

  return (
    <section className="space-y-3">
      <div className="space-y-2 rounded-md border-2 border-strong-border p-3">
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={disciplineFilterOpen ? 'default' : 'outline'}
            onClick={() => setDisciplineFilterOpen((current) => !current)}
          >
            Disciplina
          </Button>
          <Button
            size="sm"
            variant={timeFilterOpen ? 'default' : 'outline'}
            onClick={() => setTimeFilterOpen((current) => !current)}
          >
            Horário
          </Button>
          <Button
            size="sm"
            variant={daysFilterOpen ? 'default' : 'outline'}
            onClick={() => setDaysFilterOpen((current) => !current)}
          >
            Dias
          </Button>
        </div>
        {disciplineFilterOpen && (
          <AutocompleteSelect
            ariaLabel="Filtrar turmas por disciplina"
            value={classFilterCourseId}
            emptyLabel="Todas as disciplinas"
            options={courseOptions}
            placeholder="Disciplina"
            onValueChange={onCourseFilterChange}
          />
        )}
        {timeFilterOpen && (
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-bold">
              A partir de
              <select
                value={classFilterStart}
                onChange={(event) => onStartChange(event.target.value)}
                className="mt-1 h-9 w-full rounded-md border-2 border-input bg-background px-2 text-sm"
              >
                <option value="">Qualquer</option>
                {hourOptions.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-bold">
              Até
              <select
                value={classFilterEnd}
                onChange={(event) => onEndChange(event.target.value)}
                className="mt-1 h-9 w-full rounded-md border-2 border-input bg-background px-2 text-sm"
              >
                <option value="">Qualquer</option>
                {hourOptions.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
        {daysFilterOpen && (
          <div className="flex flex-wrap gap-1">
            {days.map(([day, label]) => (
              <button
                key={day}
                type="button"
                className={`rounded border px-2 py-1 text-xs font-bold ${classFilterDays.includes(day) ? 'border-primary bg-primary text-primary-foreground' : 'border-strong-border'}`}
                onClick={() => onDaysChange(day)}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="text-xs font-semibold text-muted-foreground">
        {filteredClasses.length} turma{filteredClasses.length === 1 ? '' : 's'}{' '}
        encontrada{filteredClasses.length === 1 ? '' : 's'}
      </p>
      {visibleClasses.map((classItem) => {
        const course = courseById.get(classItem.courseId)
        const classMeetings = meetings.filter(
          (meeting) => meeting.classId === classItem.id,
        )
        const selected = selectedClassIds.has(classItem.id)
        const currentClass = classes.find(
          (item) =>
            item.courseId === classItem.courseId &&
            selectedClassIds.has(item.id),
        )
        return (
          <article
            key={classItem.id}
            className="space-y-2 rounded-md border-2 border-strong-border p-3"
            onMouseEnter={() => onPreview(classItem.id)}
            onMouseLeave={() => onPreview(undefined)}
            onFocus={() => onPreview(classItem.id)}
            onBlur={() => onPreview(undefined)}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-extrabold">
                  {course?.code ?? classItem.courseCode} · Turma{' '}
                  {classItem.code}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {classItem.professors.join(', ') || 'Professor não informado'}
                </p>
              </div>
              <Button
                size="sm"
                variant={selected ? 'ghost' : 'outline'}
                onClick={() =>
                  onDispatch({
                    type: selected
                      ? 'removeClass'
                      : currentClass
                        ? 'replaceClass'
                        : 'addClass',
                    classId: classItem.id,
                  })
                }
              >
                {selected ? 'Remover' : currentClass ? 'Trocar' : 'Adicionar'}
              </Button>
            </div>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {classMeetings.map((meeting) => (
                <li key={meeting.id}>
                  {days.find(([day]) => day === meeting.dayOfWeek)?.[1]}{' '}
                  {meeting.start}–{meeting.end} · {meeting.roomCode}
                </li>
              ))}
            </ul>
          </article>
        )
      })}
      {!filteredClasses.length && (
        <p className="p-3 text-sm text-muted-foreground">
          Nenhuma turma atende aos filtros atuais.
        </p>
      )}
      {filteredClasses.length > 0 && (
        <div className="flex items-center justify-between gap-3 border-t border-strong-border pt-3">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Anterior
          </Button>
          <span className="text-xs font-semibold text-muted-foreground">
            Página {page} de {pageCount}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={page === pageCount}
            onClick={() =>
              setPage((current) => Math.min(pageCount, current + 1))
            }
          >
            Próxima
          </Button>
        </div>
      )}
    </section>
  )
}

export function SemesterPlannerPage({
  planningId = 'rascunho',
}: {
  planningId?: string
}) {
  const auth = useOptionalAuth()
  const navigate = useNavigate()
  const [studyPeriodId, setStudyPeriodId] = useState<number>()
  const [studyPeriodLocked, setStudyPeriodLocked] = useState(false)
  const [activePlanId, setActivePlanId] = useState<number>()
  const [previewClassId, setPreviewClassId] = useState<number>()
  const gridSelectionRef = useRef<HTMLDivElement>(null)
  const [draggedGridSelection, setDraggedGridSelection] =
    useState<GridSelection>()
  const [isDraggingGridSelection, setIsDraggingGridSelection] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
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
  const [manualCourseIds, setManualCourseIds] = useState<ReadonlyArray<number>>(
    [],
  )
  const [manualCourseDialogOpen, setManualCourseDialogOpen] = useState(false)
  const [manualCourseId, setManualCourseId] = useState('')
  const [openedCourseId, setOpenedCourseId] = useState<number>()
  const [addingClass, setAddingClass] = useState(false)
  const [classPickerCourseId, setClassPickerCourseId] = useState('')
  const [classFilterCourseId, setClassFilterCourseId] = useState('')
  const [classFilterStart, setClassFilterStart] = useState('')
  const [classFilterEnd, setClassFilterEnd] = useState('')
  const [classFilterDays, setClassFilterDays] = useState<ReadonlyArray<string>>(
    [],
  )
  const [anonymousCatalogId, setAnonymousCatalogId] = useState('')
  const [anonymousCatalogProgramId, setAnonymousCatalogProgramId] = useState('')
  const [anonymousSuggestionId, setAnonymousSuggestionId] = useState('')
  const [programCatalogId, setProgramCatalogId] = useState('')
  const [programCatalogProgramId, setProgramCatalogProgramId] = useState('')
  const [programSpecializationId, setProgramSpecializationId] = useState('')
  const [programLanguageId, setProgramLanguageId] = useState('')
  const [anonymousSuggestionCourseIds, setAnonymousSuggestionCourseIds] =
    useState<
      ReadonlyArray<
        Readonly<{ semester: number; courseIds: ReadonlyArray<number> }>
      >
    >()
  const importInput = useRef<HTMLInputElement>(null)
  const [document, setDocument] = useState<SemesterPlanningDocument>({
    name: 'Novo planejamento de semestre',
    studyPeriodId: null,
    curriculumId: null,
    classIds: [],
    guide: emptyGuide(),
  })
  const [error, setError] = useState<string>()
  const query = useQuery({
    queryKey: ['semester-planner', 'static-data', studyPeriodId ?? 'none'],
    queryFn: () => loadSemesterPlannerStaticData(studyPeriodId),
    staleTime: 5 * 60_000,
  })
  const { studentId, profileQuery: studentProfileQuery } = useStudentProfile()
  const plansQuery = useQuery({
    queryKey: ['semester-planner', 'plans', studentId],
    queryFn: () =>
      listSemesterPlannings(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId),
    retry: false,
  })
  const curriculaQuery = useQuery({
    queryKey: ['semester-planner', 'curricula', studentId],
    queryFn: () =>
      listCurricula(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId),
    retry: false,
  })
  const curriculumQuery = useQuery({
    queryKey: [
      'semester-planner',
      'curriculum',
      studentId,
      guideCurriculumId,
    ],
    queryFn: () =>
      getCurriculum(
        studentId!,
        guideCurriculumId!,
        auth.getAccessToken,
      ),
    enabled: Boolean(studentId && guideCurriculumId),
    retry: false,
  })
  const anonymousCurriculumDataQuery = useQuery({
    queryKey: ['semester-planner', 'anonymous-curriculum-data'],
    queryFn: async () => {
      const result = await curriculumStaticDataSource.load()
      if (!result.ok) throw new Error(result.error.code)
      return result.value
    },
    enabled: auth.initialized,
    staleTime: 5 * 60_000,
  })

  useEffect(() => {
    const first = query.data?.studyPeriods.at(0)
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

  const anonymousCatalogPrograms =
    anonymousCurriculumDataQuery.data?.catalogPrograms ?? []
  const anonymousCatalogs = [
    ...new Map(
      anonymousCatalogPrograms.map((catalogProgram) => [
        catalogProgram.catalog.id,
        {
          value: catalogProgram.catalog.id,
          label: `Catálogo ${catalogProgram.catalog.year}`,
        },
      ]),
    ).values(),
  ].sort((left, right) => left.label.localeCompare(right.label))
  const anonymousPrograms = anonymousCatalogPrograms
    .filter(
      (catalogProgram) => catalogProgram.catalog.id === anonymousCatalogId,
    )
    .sort((left, right) => left.program.name.localeCompare(right.program.name))
  const programCatalogPrograms = anonymousCatalogPrograms
    .filter((catalogProgram) => catalogProgram.catalog.id === programCatalogId)
    .sort((left, right) => left.program.name.localeCompare(right.program.name))
  const selectedProgramCatalog = anonymousCatalogPrograms.find(
    (catalogProgram) => catalogProgram.id === programCatalogProgramId,
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
    if (!programCatalogProgramId) {
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
    programCatalogProgramId,
    studentProfileQuery.data,
  ])
  const anonymousSuggestionsQuery = useQuery({
    queryKey: [
      'semester-planner',
      'anonymous-curriculum-suggestions',
      anonymousCatalogProgramId,
    ],
    queryFn: () =>
      loadCurriculumSuggestions(anonymousCatalogProgramId as CatalogProgramId),
    enabled: Boolean(anonymousCatalogProgramId),
    retry: false,
  })
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
  }, [
    activePlanId,
    auth.getAccessToken,
    document,
    query.data,
    studentId,
  ])

  const snapshotQuery = useQuery({
    queryKey: ['semester-planner', 'snapshot', document, Boolean(planner)],
    queryFn: async () => {
      if (!planner) return undefined
      const result = await planner.getSnapshot()
      return result.ok ? result.value : undefined
    },
    enabled: Boolean(planner),
    placeholderData: (previous) => previous,
  })
  const snapshot = snapshotQuery.data

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

  async function createPlan() {
    if (!studyPeriodId) return
    if (!auth.isAuthenticated || !studentId) {
      setError(
        'Entre na sua conta para salvar este planejamento. Visitantes podem montar um rascunho e exportá-lo depois.',
      )
      return
    }
    try {
      setIsSaving(true)
      const created = await createSemesterPlanning(
        studentId,
        {
          ...document,
          studyPeriodId,
          name:
            document.name.trim() ||
            `Planejamento ${query.data?.studyPeriods.find((period) => period.id === studyPeriodId)?.code ?? ''}`,
        },
        auth.getAccessToken,
      )
      setActivePlanId(created.id)
      setDocument((current) => ({
        ...current,
        name: created.name,
        studyPeriodId: created.studyPeriodId,
        curriculumId: created.curriculumId,
        classIds: created.classes.map((item) => item.id),
        guide: guideFromApi(created.guide),
      }))
      await plansQuery.refetch()
      await navigate({
        to: '/planejamentos-de-semestre/$planejamentoId',
        params: { planejamentoId: String(created.id) },
        replace: true,
      })
    } catch {
      setError('Não foi possível criar o planejamento na sua conta.')
    } finally {
      setIsSaving(false)
    }
  }

  function selectPlan(planId: number) {
    const plan = plansQuery.data?.find((item) => item.id === planId)
    if (!plan) return
    setActivePlanId(plan.id)
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
      await deleteSemesterPlanning(
        studentId,
        activePlanId,
        auth.getAccessToken,
      )
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
  }, [activePlanId, planningId, plansQuery.data])

  function exportPlanning() {
    const file = serializeSemesterPlanning(document, query.data!)
    if (!file) {
      setError('Escolha um período letivo antes de exportar o planejamento.')
      return
    }
    downloadSemesterPlanning(file)
  }

  async function importPlanning(file: File | undefined) {
    if (!file) return
    try {
      const parsed = parseSemesterPlanning(JSON.parse(await file.text()))
      if (!parsed) throw new Error('invalid')
      const resolved = resolveSemesterPlanningImport(parsed, query.data!)
      if (!resolved) {
        setError(
          'O período do arquivo não está disponível nos dados carregados.',
        )
        return
      }
      if (resolved.document.studyPeriodId !== studyPeriodId) {
        setError(
          'Selecione o mesmo período do arquivo antes de importar. Isso garante que as turmas sejam resolvidas corretamente.',
        )
        return
      }
      if (
        resolved.issues.length > 0 &&
        !window.confirm(
          `Algumas turmas não serão importadas:\n\n${resolved.issues.join('\n')}\n\nContinuar?`,
        )
      )
        return
      if (
        !window.confirm(
          'Importar substituirá as turmas deste planejamento. Continuar?',
        )
      )
        return
      setManualCourseIds([])
      setManualCourseId('')
      await dispatch({ type: 'importPlanning', data: resolved.document })
    } catch {
      setError(
        'O arquivo não é compatível com o planejamento de semestre do POMI.',
      )
    } finally {
      if (importInput.current) importInput.current.value = ''
    }
  }

  if (query.isLoading) {
    return (
      <PageContainer size="wide">
        Carregando planejamento de semestre…
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
    return <PageContainer size="wide">Preparando o planejamento…</PageContainer>
  }

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
      items.findIndex((other) => other.course.id === item.course.id) === index,
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
  )
  const manualCourseIdSet = new Set(manualCourseIds)
  const visibleManualCourses = manualCourseIds.flatMap((courseId) => {
    const course = courseById.get(courseId)
    return course && !scheduledCourseIds.has(course.id)
      ? [{ course, semester: 0 }]
      : []
  })
  const guideClassContextKey = `${[...guideClassContext.courseIds].sort((a, b) => a - b).join(',')}|${guideClassContext.prefixes.join(',')}`
  const filterGridSelection = selectionFromFilters(
    classFilterDays,
    classFilterStart,
    classFilterEnd,
  )
  const activeGridSelection = draggedGridSelection ?? filterGridSelection
  const highlightedDayIndexes = draggedGridSelection
    ? Array.from(
        {
          length:
            draggedGridSelection.endDay - draggedGridSelection.startDay + 1,
        },
        (_, index) => draggedGridSelection.startDay + index,
      )
    : classFilterDays.length
      ? classFilterDays
          .map((day) => days.findIndex(([value]) => value === day))
          .filter((index) => index >= 0)
      : activeGridSelection
        ? Array.from({ length: days.length }, (_, index) => index)
        : []

  function gridPoint(event: ReactPointerEvent<HTMLDivElement>) {
    const element = gridSelectionRef.current
    if (!element) return undefined
    const rect = element.getBoundingClientRect()
    return {
      day: clampGridIndex(
        Math.floor(((event.clientX - rect.left) / rect.width) * days.length),
        days.length - 1,
      ),
      row: clampGridIndex(
        Math.floor(((event.clientY - rect.top) / rect.height) * gridRowCount),
        gridRowCount - 1,
      ),
    }
  }

  function handleGridPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (guideTab !== 'classes' || event.button !== 0) return
    const point = gridPoint(event)
    if (!point) return
    event.currentTarget.setPointerCapture(event.pointerId)
    setIsDraggingGridSelection(true)
    setDraggedGridSelection({
      startDay: point.day,
      endDay: point.day,
      startRow: point.row,
      endRow: point.row + 1,
    })
  }

  function handleGridPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!isDraggingGridSelection || !draggedGridSelection) return
    const point = gridPoint(event)
    if (!point) return
    setDraggedGridSelection({
      startDay: Math.min(draggedGridSelection.startDay, point.day),
      endDay: Math.max(draggedGridSelection.startDay, point.day),
      startRow: Math.min(draggedGridSelection.startRow, point.row),
      endRow: Math.max(draggedGridSelection.startRow, point.row + 1),
    })
  }

  function finishGridSelection(event: ReactPointerEvent<HTMLDivElement>) {
    if (!isDraggingGridSelection || !draggedGridSelection) return
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId)
    const selection = draggedGridSelection
    setClassFilterDays(
      days.slice(selection.startDay, selection.endDay + 1).map(([day]) => day),
    )
    setClassFilterStart(
      `${String(startHour + selection.startRow).padStart(2, '0')}:00`,
    )
    setClassFilterEnd(
      `${String(startHour + selection.endRow).padStart(2, '0')}:00`,
    )
    setDraggedGridSelection(undefined)
    setIsDraggingGridSelection(false)
  }

  function cancelGridSelection(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId)
    setDraggedGridSelection(undefined)
    setIsDraggingGridSelection(false)
  }
  const visibleDisciplineGroups = guideCourses
    .filter(
      ({ course }) =>
        !scheduledCourseIds.has(course.id) && !manualCourseIdSet.has(course.id),
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
            setProgramCatalogId(value)
            updateGuide(
              guideWith({
                mode: 'program',
                program: {
                  catalogProgramId: null,
                  specializationId: null,
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
  const renderManualDiscipline = (course: SemesterCourse) => (
    <div
      key={`manual-${course.id}`}
      className="flex items-center rounded border-2 border-strong-border"
    >
      <button
        type="button"
        className={`rounded-l px-2 py-1 text-xs font-black ${courseColor(course.code)}`}
        onClick={() => {
          setClassFilterCourseId(String(course.id))
          setGuideTab('classes')
        }}
      >
        {course.code} ({String(course.credits).padStart(2, '0')})
      </button>
      <button
        type="button"
        className="border-l-2 border-strong-border px-2 py-1 text-xs font-black text-destructive"
        aria-label={`Remover ${course.code} das disciplinas manuais`}
        onClick={() => {
          const nextManualCourseIds = document.guide.manualCourseIds.filter(
            (courseId) => courseId !== course.id,
          )
          updateGuide(guideWith({ manualCourseIds: nextManualCourseIds }))
        }}
      >
        ×
      </button>
    </div>
  )

  return (
    <PageContainer
      size="wide"
      className="flex min-h-0 flex-col py-5 lg:h-[calc(100svh-4.5rem)] lg:overflow-hidden"
    >
      <PageHeader
        compact
        eyebrow="Planejamento acadêmico"
        title={document.name}
        description="Monte seu horário a partir das turmas oferecidas."
        actions={
          <>
            <select
              className="h-10 rounded-md border-2 border-strong-border bg-background px-3 font-semibold"
              value={studyPeriodId ?? ''}
              disabled={studyPeriodLocked}
              onChange={(event) => changePeriod(Number(event.target.value))}
            >
              {query.data.studyPeriods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.code}
                </option>
              ))}
            </select>
            {planningId === 'rascunho' && (
              <Button
                variant="outline"
                onClick={createPlan}
                disabled={isSaving || !studyPeriodId}
              >
                <Save className="size-4" />
                Salvar
              </Button>
            )}
            <select
              aria-label="Modo do guia curricular"
              className="h-10 rounded-md border-2 border-strong-border bg-background px-3 font-semibold"
              value={guideMode}
              onChange={(event) =>
                updateGuide({
                  ...document.guide,
                  mode: event.target.value as GuideMode,
                })
              }
            >
              <option value="curriculum">Currículo</option>
              <option value="program">Programa</option>
              <option value="none">Nenhum</option>
            </select>
            {guideMode !== 'none' && (
              <Button
                variant="outline"
                onClick={() => {
                  setConfigurationMode(
                    guideMode === 'program' ? 'program' : 'curriculum',
                  )
                  setGuideConfigurationOpen(true)
                }}
              >
                Configurar
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreHorizontal className="size-4" />
                  Ações
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {activePlanId && (
                  <DropdownMenuItem onSelect={renamePlan}>
                    <Pencil className="size-4" />
                    Editar nome
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onSelect={exportPlanning}>
                  <Download className="size-4" />
                  Exportar
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => importInput.current?.click()}>
                  <Upload className="size-4" />
                  Importar
                </DropdownMenuItem>
                {activePlanId && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onSelect={removePlan}
                    >
                      <Trash2 className="size-4" />
                      Apagar planejamento
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <input
              ref={importInput}
              className="hidden"
              type="file"
              accept="application/json,.json"
              onChange={(event) => void importPlanning(event.target.files?.[0])}
            />
            {activePlanId && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground">
                <Save className="size-3" />
                {isSaving ? 'Salvando' : 'Salvo'}
              </span>
            )}
          </>
        }
      />
      {error && (
        <Alert variant="destructive" className="mb-5">
          <AlertTitle>Não foi possível atualizar o planejamento</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {snapshot.conflicts.length > 0 && (
        <Alert className="mb-5 border-chart-4">
          <AlertTitle>Há conflitos de horário</AlertTitle>
          <AlertDescription>
            As turmas conflitantes continuam visíveis na grade para que você
            possa decidir qual manter.
          </AlertDescription>
        </Alert>
      )}
      <div className="grid min-h-0 flex-1 gap-5 xl:grid-cols-[minmax(0,1fr)_28rem]">
        <section className="h-[32rem] overflow-auto rounded-lg border-2 border-strong-border bg-card lg:h-full lg:overflow-hidden">
          <div className="flex h-full min-w-[46rem] flex-col">
            <div className="grid shrink-0 grid-cols-[3.5rem_repeat(6,minmax(6.5rem,1fr))]">
              <div className="sticky left-0 z-20 border-b border-strong-border bg-card" />
              {days.map(([, label]) => (
                <div
                  key={label}
                  className="border-b border-l border-strong-border py-1 text-center text-sm font-extrabold"
                >
                  {label}
                </div>
              ))}
            </div>
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="relative grid min-h-0 flex-1 grid-cols-[3.5rem_repeat(6,minmax(6.5rem,1fr))]">
                <div
                  className="relative sticky left-0 z-10 grid bg-card"
                  style={{
                    gridTemplateRows: `repeat(${endHour - startHour}, minmax(0, 1fr))`,
                  }}
                >
                  {Array.from({ length: endHour - startHour }, (_, index) => (
                    <div
                      key={index}
                      className="border-b border-strong-border/40 pr-2 pt-1 text-right text-xs text-muted-foreground"
                    >
                      {String(startHour + index).padStart(2, '0')}:00
                    </div>
                  ))}
                </div>
                {days.map(([day]) => (
                  <div
                    key={day}
                    className="grid border-l border-strong-border/50"
                    style={{
                      gridTemplateRows: `repeat(${endHour - startHour}, minmax(0, 1fr))`,
                    }}
                  >
                    {Array.from({ length: endHour - startHour }, (_, index) => (
                      <div
                        key={index}
                        className="border-b border-strong-border/30"
                      />
                    ))}
                  </div>
                ))}
                {guideTab === 'classes' && (
                  <div
                    ref={gridSelectionRef}
                    className={`absolute inset-y-0 left-[3.5rem] right-0 z-[1] touch-none select-none ${isDraggingGridSelection ? 'cursor-crosshair' : ''}`}
                    onPointerDown={handleGridPointerDown}
                    onPointerMove={handleGridPointerMove}
                    onPointerUp={finishGridSelection}
                    onPointerCancel={cancelGridSelection}
                  >
                    {activeGridSelection &&
                      highlightedDayIndexes.map((dayIndex) => (
                        <div
                          key={dayIndex}
                          className="pointer-events-none absolute rounded border border-primary/35 bg-primary/5"
                          style={{
                            left: `${(dayIndex / days.length) * 100}%`,
                            width: `${(1 / days.length) * 100}%`,
                            top: `${(activeGridSelection.startRow / gridRowCount) * 100}%`,
                            height: `${((activeGridSelection.endRow - activeGridSelection.startRow) / gridRowCount) * 100}%`,
                          }}
                        />
                      ))}
                  </div>
                )}
                {snapshot.selectedClasses.flatMap((classItem) =>
                  query.data.meetings
                    .filter((meeting) => meeting.classId === classItem.id)
                    .map((meeting) => {
                      const dayIndex = days.findIndex(
                        ([day]) => day === meeting.dayOfWeek,
                      )
                      const top =
                        ((minutes(meeting.start) - startHour * 60) /
                          ((endHour - startHour) * 60)) *
                        100
                      const height =
                        ((minutes(meeting.end) - minutes(meeting.start)) /
                          ((endHour - startHour) * 60)) *
                        100
                      const course = courseById.get(classItem.courseId)
                      return (
                        <button
                          key={meeting.id}
                          className={`absolute z-10 overflow-hidden rounded border-2 border-primary bg-primary/10 p-1 text-left text-[11px] font-bold shadow-sm ${selectedClassIdsWithConflict.has(classItem.id) ? 'ring-2 ring-destructive' : ''}`}
                          style={{
                            left: `calc(3.5rem + ${dayIndex} * (100% - 3.5rem) / 6 + 3px)`,
                            width: 'calc((100% - 3.5rem) / 6 - 6px)',
                            top: `${top}%`,
                            height: `${height}%`,
                          }}
                          title={`${course?.name ?? classItem.courseCode} — Turma ${classItem.code}`}
                          onClick={() =>
                            dispatch({
                              type: 'removeClass',
                              classId: classItem.id,
                            })
                          }
                        >
                          <span className="block truncate">
                            {classItem.courseCode} · {classItem.code}
                          </span>
                          <span className="block truncate font-medium">
                            {meeting.roomCode}
                          </span>
                        </button>
                      )
                    }),
                )}
                {previewClassId &&
                  classById.get(previewClassId) &&
                  query.data.meetings
                    .filter((meeting) => meeting.classId === previewClassId)
                    .map((meeting) => {
                      const classItem = classById.get(previewClassId)!
                      const dayIndex = days.findIndex(
                        ([day]) => day === meeting.dayOfWeek,
                      )
                      const top =
                        ((minutes(meeting.start) - startHour * 60) /
                          ((endHour - startHour) * 60)) *
                        100
                      const height =
                        ((minutes(meeting.end) - minutes(meeting.start)) /
                          ((endHour - startHour) * 60)) *
                        100
                      return (
                        <div
                          key={`preview-${meeting.id}`}
                          className="pointer-events-none absolute z-20 overflow-hidden rounded border-2 border-dashed border-primary bg-primary/10 p-1 text-[11px] font-bold opacity-45"
                          style={{
                            left: `calc(3.5rem + ${dayIndex} * (100% - 3.5rem) / 6 + 3px)`,
                            width: 'calc((100% - 3.5rem) / 6 - 6px)',
                            top: `${top}%`,
                            height: `${height}%`,
                          }}
                        >
                          {classItem.courseCode} · {classItem.code}
                        </div>
                      )
                    })}
              </div>
              <div className="grid shrink-0 grid-cols-[3.5rem_repeat(6,minmax(6.5rem,1fr))]">
                <div className="border-b border-strong-border/40 pr-2 text-right text-xs text-muted-foreground">
                  {String(endHour).padStart(2, '0')}:00
                </div>
                {days.map(([day]) => (
                  <div
                    key={day}
                    className="border-b border-l border-strong-border/30"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
        <aside className="flex min-h-0 flex-col rounded-lg border-2 border-strong-border bg-card lg:h-full">
          <div className="grid grid-cols-2 border-b-2 border-strong-border p-2">
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
                <DialogTitle>Adicionar disciplina</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <AutocompleteSelect
                  ariaLabel="Disciplina manual"
                  value={manualCourseId}
                  options={[...courseById.values()]
                    .sort((left, right) => left.code.localeCompare(right.code))
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
                  Adicionar disciplina
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3">
            {guideTab === 'classes' ? (
              <ClassesGuidePanel
                courses={query.data.courses}
                classes={query.data.classes}
                meetings={query.data.meetings}
                selectedClassIds={new Set(document.classIds)}
                classFilterCourseId={classFilterCourseId}
                classFilterStart={classFilterStart}
                classFilterEnd={classFilterEnd}
                classFilterDays={classFilterDays}
                guideClassContext={guideClassContext}
                guideClassContextKey={guideClassContextKey}
                onCourseFilterChange={setClassFilterCourseId}
                onStartChange={setClassFilterStart}
                onEndChange={setClassFilterEnd}
                onDaysChange={(day) =>
                  setClassFilterDays((current) =>
                    current.includes(day)
                      ? current.filter((item) => item !== day)
                      : [...current, day],
                  )
                }
                onDispatch={(command) => void dispatch(command)}
                onPreview={setPreviewClassId}
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
                              className="space-y-2 rounded-md border-2 border-strong-border p-3"
                              onMouseEnter={() =>
                                setPreviewClassId(classItem.id)
                              }
                              onMouseLeave={() => setPreviewClassId(undefined)}
                              onFocus={() => setPreviewClassId(classItem.id)}
                              onBlur={() => setPreviewClassId(undefined)}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="text-sm font-extrabold">
                                    Turma {classItem.code}
                                  </h4>
                                  <p className="text-xs text-muted-foreground">
                                    {classItem.professors.join(', ') ||
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
                  + Adicionar disciplina
                </Button>
                {visibleDisciplineGroups.map((group) => (
                  <section key={group.semester}>
                    <h3 className="mb-2 text-xs font-black tracking-[0.12em] text-muted-foreground uppercase">
                      {group.semester > 0
                        ? `${group.semester}º semestre`
                        : 'Adicionadas manualmente'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {group.courses.map(({ course }) => (
                        <button
                          key={course.id}
                          className={`rounded border-2 px-2 py-1 text-xs font-black ${courseColor(course.code)}`}
                          onClick={() => {
                            setClassFilterCourseId(String(course.id))
                            setGuideTab('classes')
                          }}
                        >
                          {course.code} (
                          {String(course.credits).padStart(2, '0')})
                        </button>
                      ))}
                    </div>
                  </section>
                ))}
                {!visibleDisciplineGroups.length &&
                  (curriculumGuideConfigured ? (
                    <p className="p-3 text-sm text-muted-foreground">
                      Todas as disciplinas do currículo já estão planejadas.
                    </p>
                  ) : (
                    guideSetup
                  ))}
                {visibleManualCourses.length > 0 && (
                  <section>
                    <h3 className="mb-2 text-xs font-black tracking-[0.12em] text-muted-foreground uppercase">
                      Adicionadas manualmente
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {visibleManualCourses.map(({ course }) =>
                        renderManualDiscipline(course),
                      )}
                    </div>
                  </section>
                )}
              </>
            ) : guideMode === 'program' ? (
              <>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => setManualCourseDialogOpen(true)}
                >
                  + Adicionar disciplina
                </Button>
                {selectedProgramBlocks.map((group) => (
                  <section key={group.title} className="space-y-2">
                    <h3 className="text-xs font-black tracking-[0.12em] text-muted-foreground uppercase">
                      {group.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {group.blocks.mandatory.map((requirement, index) => {
                        const course =
                          requirement.selector.type === 'specificCourse'
                            ? courseById.get(
                                Number(requirement.selector.courseId),
                              )
                            : undefined
                        if (course && manualCourseIdSet.has(course.id))
                          return null
                        if (
                          course &&
                          !scheduledCourseIds.has(course.id) &&
                          !manualCourseIdSet.has(course.id)
                        )
                          return (
                            <button
                              key={`${group.title}-mandatory-${index}`}
                              className={`rounded border-2 px-2 py-1 text-xs font-black ${courseColor(course.code)}`}
                              onClick={() => {
                                setClassFilterCourseId(String(course.id))
                                setGuideTab('classes')
                              }}
                            >
                              {course.code} (
                              {String(course.credits).padStart(2, '0')})
                            </button>
                          )
                        return (
                          <span
                            key={`${group.title}-mandatory-${index}`}
                            className="rounded border-2 border-muted-foreground/50 px-2 py-1 text-xs font-bold text-muted-foreground"
                          >
                            {selectorLabel(requirement.selector, course?.code)}
                          </span>
                        )
                      })}
                    </div>
                    {group.blocks.electives.map((requirement, index) => (
                      <p
                        key={`${group.title}-elective-${index}`}
                        className="rounded-md border border-strong-border bg-muted/40 p-2 text-xs font-semibold"
                      >
                        Eletiva: {requirement.requiredCredits} créditos ·{' '}
                        {requirement.eligibleCourses
                          .map((selector) => selectorLabel(selector))
                          .join(', ')}
                      </p>
                    ))}
                  </section>
                ))}
                {!selectedProgramBlocks.length &&
                  (programGuideConfigured ? (
                    <p className="p-3 text-sm text-muted-foreground">
                      Nenhum bloco disponível para este programa.
                    </p>
                  ) : (
                    guideSetup
                  ))}
                {visibleManualCourses.length > 0 && (
                  <section>
                    <h3 className="mb-2 text-xs font-black tracking-[0.12em] text-muted-foreground uppercase">
                      Adicionadas manualmente
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {visibleManualCourses.map(({ course }) =>
                        renderManualDiscipline(course),
                      )}
                    </div>
                  </section>
                )}
              </>
            ) : (
              <>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => setManualCourseDialogOpen(true)}
                >
                  + Adicionar disciplina
                </Button>
                {visibleManualCourses.length > 0 ? (
                  <section>
                    <h3 className="mb-2 text-xs font-black tracking-[0.12em] text-muted-foreground uppercase">
                      Adicionadas manualmente
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {visibleManualCourses.map(({ course }) =>
                        renderManualDiscipline(course),
                      )}
                    </div>
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
    </PageContainer>
  )
}
