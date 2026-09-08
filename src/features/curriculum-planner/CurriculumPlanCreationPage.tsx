import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useRef, useState } from 'react'

import {
  planningFromSuggestion,
  suggestionForAcademicSelection,
} from '@pomi/planner-domain/curriculum'
import type {
  CatalogProgramId,
  CourseId,
  CurriculumPlannerState,
  CurriculumPlannerStaticData,
  PlannerRevision,
  PlanningPeriodId,
} from '@pomi/planner-domain/curriculum'
import type { InitialAcademicSelection } from '@/features/planning-shared/components/InitialAcademicSelectionFields'
import type { CurriculumDraftBootstrap } from '@/features/planning-shared/data/planningDraftBootstrap'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import { CreationWizard } from '@/components/CreationWizard'
import {
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { loadCurriculumCatalog } from '@/catalog/data/curriculumCatalogApi'
import { InitialAcademicSelectionFields } from '@/features/planning-shared/components/InitialAcademicSelectionFields'
import { persistCurriculumState } from '@/features/curriculum-planner/data/curriculumPersistenceAdapter'
import { curriculumDraftBootstrapKey } from '@/features/planning-shared/data/planningDraftBootstrap'
import { loadCurriculumSuggestions } from '@/features/curriculum-planner/data/curriculumSuggestionApi'
import {
  ensureCurrentStudent,
  isApprovedStudentCourseAttempt,
  listStudentCourseAttempts,
} from '@/features/student/data/studentApi'
import type { StudentCourseAttempt } from '@/features/student/data/studentApi'
import { useStudentProfile } from '@/features/student/hooks/useStudentProfile'
import {
  privateQueryKeys,
  publicQueryKeys,
} from '@/integrations/tanstack-query/queryKeys'

const steps = ['Base acadêmica', 'Identificação', 'Revisão']
const currentYear = new Date().getFullYear()
const semesterOptions = [
  { value: '1', label: '1º semestre' },
  { value: '2', label: '2º semestre' },
]

export function CurriculumPlanCreationPage() {
  const auth = useOptionalAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { profileQuery, studentId } = useStudentProfile()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('Meu planejamento')
  const [semesterNumber, setSemesterNumber] = useState(1)
  const [year, setYear] = useState(currentYear)
  const [semester, setSemester] = useState('1')
  const [selection, setSelection] = useState<InitialAcademicSelection>({
    catalogId: '',
    programId: '',
    catalogProgramId: '',
    specializationId: '',
    languageId: '',
  })
  const [source, setSource] = useState<'blank' | 'suggestion' | 'history'>(
    'blank',
  )
  const [error, setError] = useState<string>()
  const [submitting, setSubmitting] = useState(false)
  const profileSelectionInitialized = useRef(false)
  const planningStartTouched = useRef(false)
  const staticQuery = useQuery({
    queryKey: publicQueryKeys.curriculumCatalog(),
    queryFn: async () => {
      const result = await loadCurriculumCatalog()
      if (!result.ok) throw new Error(result.error.code)
      return result.value
    },
    staleTime: Infinity,
  })
  const sessionSubject = auth.sessionSubject ?? 'anonymous-session'
  const historyStudentId = studentId ?? undefined
  const attemptsQuery = useQuery({
    queryKey: privateQueryKeys.courseAttempts(sessionSubject, historyStudentId),
    queryFn: () =>
      listStudentCourseAttempts(historyStudentId!, auth.getAccessToken),
    enabled: auth.isAuthenticated && Boolean(historyStudentId),
  })
  const historyAttempts = useMemo(
    () =>
      (attemptsQuery.data ?? []).filter(
        (attempt) =>
          isApprovedStudentCourseAttempt(attempt) ||
          attempt.status === 'ENROLLED',
      ),
    [attemptsQuery.data],
  )
  const completedCourseIds = useMemo(
    () =>
      [
        ...new Set(
          historyAttempts
            .filter(isApprovedStudentCourseAttempt)
            .map((attempt) => String(attempt.courseId)),
        ),
      ].map((courseId) => courseId as CourseId),
    [historyAttempts],
  )
  const historyReady =
    auth.isAuthenticated && Boolean(historyStudentId) && attemptsQuery.isSuccess
  const suggestionsQuery = useQuery({
    queryKey: publicQueryKeys.plannerCreationSuggestions(
      selection.catalogProgramId,
    ),
    queryFn: () =>
      loadCurriculumSuggestions(selection.catalogProgramId as CatalogProgramId),
    enabled: source === 'suggestion' && Boolean(selection.catalogProgramId),
    retry: false,
  })
  const suggestions = suggestionsQuery.data ?? []
  const suggestion = suggestionForAcademicSelection(
    suggestions,
    selection.specializationId || undefined,
  )
  const selectedCatalogYear = staticQuery.data?.catalogPrograms.find(
    (item) => item.catalog.id === selection.catalogId,
  )?.catalog.year
  const historyStart =
    source === 'history' ? earliestHistoryPeriod(historyAttempts) : undefined
  const defaultPlanningYear =
    historyStart?.year ?? selectedCatalogYear ?? currentYear
  const defaultPlanningSemester = historyStart?.semester ?? 1

  useEffect(() => {
    const profile = profileQuery.data
    if (profileSelectionInitialized.current || !profile || !staticQuery.data)
      return
    profileSelectionInitialized.current = true
    const catalogProgram = staticQuery.data.catalogPrograms.find(
      (item) =>
        Number(item.catalog.id) === profile.catalogId &&
        Number(item.program.id) === profile.programId,
    )
    if (!catalogProgram) return
    setSelection({
      catalogId: catalogProgram.catalog.id,
      programId: catalogProgram.program.id,
      catalogProgramId: catalogProgram.id,
      specializationId: catalogProgram.specializations.some(
        (item) => Number(item.id) === profile.specializationId,
      )
        ? String(profile.specializationId)
        : '',
      languageId: catalogProgram.languages.some(
        (item) => Number(item.id) === profile.languageId,
      )
        ? String(profile.languageId)
        : '',
    })
  }, [profileQuery.data, staticQuery.data])

  useEffect(() => {
    if (planningStartTouched.current) return
    setYear(defaultPlanningYear)
    setSemester(String(defaultPlanningSemester))
  }, [defaultPlanningSemester, defaultPlanningYear])

  const generatedState = useMemo(
    () =>
      buildInitialState({
        year,
        semester: Number(semester) as 1 | 2,
        semesterNumber,
        selection,
        suggestion: source === 'suggestion' ? suggestion : undefined,
        completedCourseIds: source === 'history' ? completedCourseIds : [],
        historyAttempts: source === 'history' ? historyAttempts : [],
      }),
    [
      completedCourseIds,
      historyAttempts,
      semester,
      semesterNumber,
      selection,
      source,
      suggestion,
      year,
    ],
  )
  const state = generatedState
  const validIdentificationStep =
    Boolean(name.trim()) &&
    Number.isInteger(year) &&
    year >= 1900 &&
    year <= 9999 &&
    Number.isInteger(semesterNumber) &&
    semesterNumber > 0 &&
    (semester === '1' || semester === '2')
  const validAcademicStep =
    source === 'blank'
      ? true
      : source === 'history'
        ? historyReady
        : Boolean(selection.catalogProgramId && suggestion)
  const suggestionRequirementMessage =
    source !== 'suggestion'
      ? undefined
      : !selection.programId
        ? 'Selecione um programa para usar uma sugestão curricular.'
        : !selection.catalogId
          ? 'Selecione um catálogo para usar uma sugestão curricular.'
          : !selection.catalogProgramId
            ? 'O catálogo selecionado não possui o programa escolhido.'
            : suggestionsQuery.isLoading
              ? 'Carregando sugestões curriculares...'
              : suggestionsQuery.isError
                ? 'Não foi possível carregar as sugestões curriculares.'
                : suggestions.length === 0
                  ? 'Não há sugestões curriculares disponíveis para o programa selecionado.'
                  : !suggestion
                    ? selection.specializationId
                      ? 'Não foi possível deduzir uma sugestão para a habilitação selecionada.'
                      : 'Não foi possível deduzir uma sugestão para a base acadêmica selecionada.'
                    : undefined

  async function submit() {
    setSubmitting(true)
    setError(undefined)
    try {
      if (!auth.isAuthenticated) {
        queryClient.setQueryData<CurriculumDraftBootstrap>(
          curriculumDraftBootstrapKey,
          { name: name.trim(), state },
        )
        await navigate({
          to: '/planejamentos-de-curriculo/$planejamentoId',
          params: { planejamentoId: 'rascunho' },
        })
        return
      }
      const createdStudentId = await ensureCurrentStudent(
        String(
          auth.profile?.name ?? auth.profile?.preferred_username ?? 'Estudante',
        ),
        auth.getAccessToken,
      )
      const document = await persistCurriculumState({
        studentId: createdStudentId,
        state,
        name: name.trim(),
        getAccessToken: auth.getAccessToken,
      })
      await navigate({
        to: '/planejamentos-de-curriculo/$planejamentoId',
        params: { planejamentoId: String(document.id) },
      })
    } catch {
      setError(
        'Não foi possível criar o planejamento. Suas escolhas foram mantidas para uma nova tentativa.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (staticQuery.isLoading)
    return (
      <PageContainer>
        <LoadingState label="Carregando opções do planejamento" />
      </PageContainer>
    )
  if (!staticQuery.data)
    return (
      <PageContainer>
        <ErrorState
          title="Não foi possível iniciar o planejamento"
          description="Os dados de catálogo não estão disponíveis."
        />
      </PageContainer>
    )

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Planejamento acadêmico"
        title="Novo planejamento de currículo"
        description="Defina as informações iniciais. Todas as escolhas acadêmicas poderão ser ajustadas depois."
      />
      {error && (
        <p
          role="alert"
          className="mb-5 rounded-md border-2 border-destructive p-3 text-sm font-semibold text-destructive"
        >
          {error}
        </p>
      )}
      <CreationWizard
        step={step}
        steps={steps}
        canContinue={
          step === 0
            ? validAcademicStep
            : step === 1
              ? validIdentificationStep
              : true
        }
        isSubmitting={submitting}
        submitLabel={
          auth.isAuthenticated ? 'Criar planejamento' : 'Criar rascunho'
        }
        onBack={() => setStep((current) => current - 1)}
        onCancel={() => void navigate({ to: '/planejamentos-de-curriculo' })}
        onContinue={() =>
          step < 2 ? setStep((current) => current + 1) : void submit()
        }
      >
        {step === 1 && (
          <div className="space-y-5">
            <StepTitle
              title="Identificação e início"
              description="O início define como os semestres serão nomeados e ordenados; ele não marca disciplinas como concluídas."
            />
            <label className="block space-y-2 text-sm font-bold">
              <span>Nome</span>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <span className="block text-xs font-normal text-muted-foreground">
                Ajuda a diferenciar este planejamento das suas outras
                alternativas.
              </span>
            </label>
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField
                label="Número do semestre"
                description="Semestre curricular a partir do qual você começará a planejar."
                value={semesterNumber}
                min={1}
                onChange={setSemesterNumber}
              />
              <NumberField
                label="Ano"
                description="Ano do primeiro período que aparecerá no planejamento."
                value={year}
                min={1900}
                max={9999}
                onChange={(value) => {
                  planningStartTouched.current = true
                  setYear(value)
                }}
              />
              <label className="space-y-2 text-sm font-bold">
                <span>Período</span>
                <AutocompleteSelect
                  ariaLabel="Período inicial"
                  value={semester}
                  options={semesterOptions}
                  placeholder="Escolha o período"
                  onValueChange={(value) => {
                    planningStartTouched.current = true
                    setSemester(value)
                  }}
                />
                <span className="block text-xs font-normal text-muted-foreground">
                  Primeiro ou segundo semestre letivo do ano.
                </span>
              </label>
            </div>
          </div>
        )}
        {step === 0 && (
          <div className="space-y-6">
            <StepTitle
              title="Base acadêmica"
              description="Catálogo e programa ajudam a acompanhar requisitos, mas podem ser definidos depois."
            />
            <InitialAcademicSelectionFields
              staticData={staticQuery.data}
              value={selection}
              onChange={(next) => {
                profileSelectionInitialized.current = true
                setSelection(next)
              }}
            />
            <div className="space-y-3 border-t border-strong-border/30 pt-5">
              <h3 className="font-extrabold">Ponto de partida</h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <ChoiceButton
                  active={source === 'blank'}
                  title="Em branco"
                  description="Começa sem disciplinas e permite montar todos os semestres manualmente."
                  onClick={() => setSource('blank')}
                />
                <ChoiceButton
                  active={source === 'suggestion'}
                  title="Sugestão curricular"
                  description="Distribui automaticamente a sugestão compatível com a base acadêmica, que continuará totalmente editável."
                  onClick={() => setSource('suggestion')}
                />
                <ChoiceButton
                  active={source === 'history'}
                  title="Histórico do aluno"
                  description={
                    !auth.isAuthenticated
                      ? 'Disponível somente para alunos autenticados.'
                      : attemptsQuery.isError
                        ? 'Não foi possível carregar o histórico acadêmico do aluno.'
                        : !historyStudentId
                          ? 'A conta ainda não possui um estudante associado.'
                          : historyReady
                            ? 'Usa as disciplinas do histórico escolar do aluno como já concluídas no planejamento.'
                            : 'Carregando o histórico acadêmico do aluno.'
                  }
                  disabled={!historyReady}
                  onClick={() => setSource('history')}
                />
              </div>
              {suggestionRequirementMessage && (
                <p role="status" className="text-sm text-muted-foreground">
                  {suggestionRequirementMessage}
                </p>
              )}
            </div>
          </div>
        )}
        {step === 2 && (
          <CurriculumReview
            name={name}
            year={year}
            semester={semester}
            semesterNumber={semesterNumber}
            selection={selection}
            staticData={staticQuery.data}
            source={source}
            suggestionLabel={
              suggestion ? `${suggestion.code} — ${suggestion.name}` : undefined
            }
          />
        )}
      </CreationWizard>
    </PageContainer>
  )
}

export function buildInitialState({
  year,
  semester,
  semesterNumber,
  selection,
  suggestion,
  completedCourseIds,
  historyAttempts,
}: {
  year: number
  semester: 1 | 2
  semesterNumber: number
  selection: InitialAcademicSelection
  suggestion?: Awaited<ReturnType<typeof loadCurriculumSuggestions>>[number]
  completedCourseIds: ReadonlyArray<CourseId>
  historyAttempts: ReadonlyArray<StudentCourseAttempt>
}): CurriculumPlannerState {
  const planningStart = { year, semester, semesterNumber }
  const suggested = suggestion
    ? planningFromSuggestion(suggestion, planningStart)
    : undefined
  const historyPeriods = periodsFromStudentHistory(
    historyAttempts,
    planningStart,
  )
  const initialPeriods =
    suggested?.periods.map((period) => period.courses) ?? historyPeriods
  return {
    revision: crypto.randomUUID() as PlannerRevision,
    selection: {
      ...(selection.catalogProgramId
        ? { catalogProgramId: selection.catalogProgramId as CatalogProgramId }
        : {}),
      ...(selection.specializationId
        ? { specializationId: selection.specializationId as never }
        : {}),
      ...(selection.languageId
        ? { languageId: selection.languageId as never }
        : {}),
    },
    plan: {
      planningStart,
      periods: initialPeriods.map((courses) => ({
        id: crypto.randomUUID() as PlanningPeriodId,
        items: courses.map((courseId) => ({
          type: 'course' as const,
          courseId,
        })),
      })),
      unallocatedCourseIds: [],
    },
    academicRecord: {
      completedCourses: completedCourseIds.map((courseId) => ({ courseId })),
    },
  }
}

function periodsFromStudentHistory(
  attempts: ReadonlyArray<StudentCourseAttempt>,
  planningStart: NonNullable<CurriculumPlannerState['plan']['planningStart']>,
): ReadonlyArray<ReadonlyArray<CourseId>> {
  const seenCourseIds = new Set<CourseId>()
  const withoutPeriod: CourseId[] = []
  const grouped = new Map<
    string,
    { year: number; yearPeriod: string; courseIds: CourseId[] }
  >()

  for (const attempt of attempts) {
    const courseId = String(attempt.courseId) as CourseId
    if (seenCourseIds.has(courseId)) continue
    seenCourseIds.add(courseId)
    const period = attempt.studyPeriod
    if (!period) {
      withoutPeriod.push(courseId)
      continue
    }
    const key = `${period.year}:${period.yearPeriod}`
    const group = grouped.get(key) ?? {
      year: period.year,
      yearPeriod: period.yearPeriod,
      courseIds: [],
    }
    group.courseIds.push(courseId)
    grouped.set(key, group)
  }

  const periods = [...grouped.values()].sort(
    (left, right) =>
      left.year - right.year ||
      historyPeriodOrder(left.yearPeriod) -
        historyPeriodOrder(right.yearPeriod),
  )
  const alignedPeriods: Array<ReadonlyArray<CourseId>> = []
  let lastCalendarPeriod = planningStart.year * 2 + planningStart.semester - 2
  for (const period of periods) {
    const calendarPeriod = historyCalendarPeriodIndex(
      period.year,
      period.yearPeriod,
    )
    if (calendarPeriod !== undefined) {
      const emptyPeriods = calendarPeriod - lastCalendarPeriod - 1
      for (let index = 0; index < emptyPeriods; index += 1)
        alignedPeriods.push([])
      lastCalendarPeriod = Math.max(lastCalendarPeriod, calendarPeriod)
    }
    alignedPeriods.push(period.courseIds)
  }
  return [...(withoutPeriod.length ? [withoutPeriod] : []), ...alignedPeriods]
}

function historyCalendarPeriodIndex(year: number, yearPeriod: string) {
  if (yearPeriod === 'FIRST_SEMESTER') return year * 2
  if (yearPeriod === 'SECOND_SEMESTER') return year * 2 + 1
  return undefined
}

function historyPeriodOrder(yearPeriod: string) {
  return (
    {
      SUMMER: 0,
      FIRST_SEMESTER: 1,
      WINTER: 2,
      SECOND_SEMESTER: 3,
    }[yearPeriod] ?? 4
  )
}

function earliestHistoryPeriod(attempts: ReadonlyArray<StudentCourseAttempt>) {
  const period = attempts
    .map((attempt) => attempt.studyPeriod)
    .filter((value): value is NonNullable<typeof value> => Boolean(value))
    .sort(
      (left, right) =>
        left.year - right.year ||
        historyPeriodOrder(left.yearPeriod) -
          historyPeriodOrder(right.yearPeriod),
    )[0]
  if (!period) return undefined
  return {
    year: period.year,
    semester: period.yearPeriod === 'SECOND_SEMESTER' ? 2 : 1,
  } as const
}

function StepTitle({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div>
      <h2 className="text-xl font-extrabold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function NumberField({
  label,
  description,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  description: string
  value: number
  min: number
  max?: number
  onChange: (value: number) => void
}) {
  return (
    <label className="space-y-2 text-sm font-bold">
      <span>{label}</span>
      <Input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <span className="block text-xs font-normal text-muted-foreground">
        {description}
      </span>
    </label>
  )
}

function ChoiceButton({
  active,
  title,
  description,
  disabled = false,
  onClick,
}: {
  active: boolean
  title: string
  description: string
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <Button
      type="button"
      variant={active ? 'default' : 'outline'}
      disabled={disabled}
      className="h-auto items-start justify-start whitespace-normal p-4 text-left"
      onClick={onClick}
    >
      <span>
        <strong className="block">{title}</strong>
        <span className="mt-1 block text-xs font-normal">{description}</span>
      </span>
    </Button>
  )
}

function CurriculumReview({
  name,
  year,
  semester,
  semesterNumber,
  selection,
  staticData,
  source,
  suggestionLabel,
}: {
  name: string
  year: number
  semester: string
  semesterNumber: number
  selection: InitialAcademicSelection
  staticData: CurriculumPlannerStaticData
  source: 'blank' | 'suggestion' | 'history'
  suggestionLabel?: string
}) {
  const selected = staticData.catalogPrograms.find(
    (item) => item.id === selection.catalogProgramId,
  )
  const specialization = selected?.specializations.find(
    (item) => item.id === selection.specializationId,
  )
  const language = selected?.languages.find(
    (item) => item.id === selection.languageId,
  )
  const rows = [
    ['Nome', name],
    ['Início', `${semesterNumber}º sem - ${semester}s${year}`],
    ...(selected
      ? [
          ['Catálogo', `Catálogo ${selected.catalog.year}`],
          ['Programa', `${selected.program.code} — ${selected.program.name}`],
        ]
      : [['Base acadêmica', 'Definir depois']]),
    ...(specialization
      ? [['Habilitação', `${specialization.code} — ${specialization.name}`]]
      : []),
    ...(language ? [['Língua', language.name]] : []),
    [
      'Ponto de partida',
      source === 'suggestion'
        ? (suggestionLabel ?? 'Sugestão curricular')
        : source === 'history'
          ? 'Histórico escolar do aluno'
          : 'Em branco',
    ],
  ]
  return (
    <div className="space-y-5">
      <StepTitle
        title="Revise o planejamento"
        description="O planejamento será criado somente ao confirmar esta etapa."
      />
      <dl className="divide-y divide-strong-border/20">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr]">
            <dt className="text-sm font-bold">{label}</dt>
            <dd className="text-sm text-muted-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
