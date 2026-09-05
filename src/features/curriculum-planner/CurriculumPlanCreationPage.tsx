import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Upload } from 'lucide-react'

import { planningFromSuggestion } from '@pomi/planner-domain/curriculum'
import {
  parsePlanning,
  resolvePlanningImport,
} from '@pomi/planner-domain/transfer'
import type {
  CatalogProgramId,
  CurriculumPlannerImport,
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
import { ensureCurrentStudent } from '@/features/student/data/studentApi'
import { useStudentProfile } from '@/features/student/hooks/useStudentProfile'
import { publicQueryKeys } from '@/integrations/tanstack-query/queryKeys'

const steps = ['Identificação', 'Base acadêmica', 'Revisão']
const semesterOptions = [
  { value: '1', label: '1º semestre' },
  { value: '2', label: '2º semestre' },
]

export function CurriculumPlanCreationPage() {
  const auth = useOptionalAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { profileQuery } = useStudentProfile()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('Meu planejamento')
  const [semesterNumber, setSemesterNumber] = useState(1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [semester, setSemester] = useState('1')
  const [selection, setSelection] = useState<InitialAcademicSelection>({
    catalogId: '',
    catalogProgramId: '',
    specializationId: '',
    languageId: '',
  })
  const [source, setSource] = useState<'blank' | 'suggestion'>('blank')
  const [suggestionId, setSuggestionId] = useState('')
  const [error, setError] = useState<string>()
  const [submitting, setSubmitting] = useState(false)
  const [importedState, setImportedState] = useState<CurriculumPlannerState>()
  const importInputRef = useRef<HTMLInputElement>(null)
  const profileSelectionInitialized = useRef(false)
  const staticQuery = useQuery({
    queryKey: publicQueryKeys.curriculumCatalog(),
    queryFn: async () => {
      const result = await loadCurriculumCatalog()
      if (!result.ok) throw new Error(result.error.code)
      return result.value
    },
    staleTime: Infinity,
  })
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
  const suggestion = suggestions.find((item) => item.id === suggestionId)

  useEffect(() => {
    if (suggestions.length === 1) setSuggestionId(suggestions[0].id)
    else if (!suggestions.some((item) => item.id === suggestionId))
      setSuggestionId('')
  }, [suggestionId, suggestions])

  useEffect(() => {
    const profile = profileQuery.data
    if (
      profileSelectionInitialized.current ||
      !profile ||
      importedState ||
      !staticQuery.data
    )
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
  }, [importedState, profileQuery.data, staticQuery.data])

  const generatedState = useMemo(
    () =>
      buildInitialState({
        year,
        semester: Number(semester) as 1 | 2,
        semesterNumber,
        selection,
        suggestion: source === 'suggestion' ? suggestion : undefined,
      }),
    [semester, semesterNumber, selection, source, suggestion, year],
  )
  const state = importedState ?? generatedState
  const validFirstStep =
    Boolean(name.trim()) &&
    Number.isInteger(year) &&
    year >= 1900 &&
    year <= 9999 &&
    Number.isInteger(semesterNumber) &&
    semesterNumber > 0 &&
    (semester === '1' || semester === '2')
  const validAcademicStep =
    source === 'blank' || Boolean(selection.catalogProgramId && suggestion)

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
      const studentId = await ensureCurrentStudent(
        String(
          auth.profile?.name ?? auth.profile?.preferred_username ?? 'Estudante',
        ),
        auth.getAccessToken,
      )
      const document = await persistCurriculumState({
        studentId,
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

  async function importPlanning(file: File | undefined) {
    if (!file || !staticQuery.data) return
    try {
      if (file.size > 2 * 1024 * 1024) throw new Error('invalid')
      const parsed = parsePlanning(JSON.parse(await file.text()))
      if (!parsed) throw new Error('invalid')
      const resolved = resolvePlanningImport(parsed, staticQuery.data)
      setImportedState(stateFromImport(resolved.data))
      if (resolved.name) setName(resolved.name)
      const catalogProgram = staticQuery.data.catalogPrograms.find(
        (item) => item.id === resolved.data.selection.catalogProgramId,
      )
      setSelection({
        catalogId: catalogProgram?.catalog.id ?? '',
        catalogProgramId: resolved.data.selection.catalogProgramId ?? '',
        specializationId: resolved.data.selection.specializationId ?? '',
        languageId: resolved.data.selection.languageId ?? '',
      })
      if (resolved.data.planningStart) {
        setYear(resolved.data.planningStart.year)
        setSemester(String(resolved.data.planningStart.semester))
        setSemesterNumber(resolved.data.planningStart.semesterNumber ?? 1)
      }
      setError(undefined)
      setStep(2)
    } catch {
      setError(
        'Não foi possível importar o currículo. Verifique se o arquivo foi exportado pelo POMI.',
      )
    } finally {
      if (importInputRef.current) importInputRef.current.value = ''
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
      <div className="-mt-4 mb-5 flex justify-end">
        <input
          ref={importInputRef}
          className="hidden"
          type="file"
          accept="application/json,.json"
          onChange={(event) => void importPlanning(event.target.files?.[0])}
        />
        <Button
          variant="outline"
          onClick={() => importInputRef.current?.click()}
        >
          <Upload /> Importar currículo
        </Button>
      </div>
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
          step === 0 ? validFirstStep : step === 1 ? validAcademicStep : true
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
        {step === 0 && (
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
                onChange={setYear}
              />
              <label className="space-y-2 text-sm font-bold">
                <span>Período</span>
                <AutocompleteSelect
                  ariaLabel="Período inicial"
                  value={semester}
                  options={semesterOptions}
                  placeholder="Escolha o período"
                  onValueChange={setSemester}
                />
                <span className="block text-xs font-normal text-muted-foreground">
                  Primeiro ou segundo semestre letivo do ano.
                </span>
              </label>
            </div>
          </div>
        )}
        {step === 1 && (
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
                setSuggestionId('')
              }}
            />
            <div className="space-y-3 border-t border-strong-border/30 pt-5">
              <h3 className="font-extrabold">Ponto de partida</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <ChoiceButton
                  active={source === 'blank'}
                  title="Em branco"
                  description="Começa sem disciplinas e permite montar todos os semestres manualmente."
                  onClick={() => setSource('blank')}
                />
                <ChoiceButton
                  active={source === 'suggestion'}
                  title="Sugestão curricular"
                  description="Distribui uma sugestão oficial de disciplinas, que continuará totalmente editável."
                  onClick={() => setSource('suggestion')}
                />
              </div>
              {source === 'suggestion' && (
                <label className="block space-y-2 text-sm font-bold">
                  <span>Sugestão</span>
                  <AutocompleteSelect
                    ariaLabel="Sugestão inicial"
                    value={suggestionId}
                    disabled={
                      !selection.catalogProgramId ||
                      suggestionsQuery.isLoading ||
                      suggestions.length === 1
                    }
                    options={suggestions.map((item) => ({
                      value: item.id,
                      label: `${item.code} — ${item.name}`,
                    }))}
                    placeholder={
                      selection.catalogProgramId
                        ? 'Escolha a sugestão'
                        : 'Escolha catálogo e programa primeiro'
                    }
                    onValueChange={setSuggestionId}
                  />
                  <span className="block text-xs font-normal text-muted-foreground">
                    A sugestão organiza disciplinas por semestre, sem impedir
                    alterações posteriores.
                  </span>
                </label>
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

function buildInitialState({
  year,
  semester,
  semesterNumber,
  selection,
  suggestion,
}: {
  year: number
  semester: 1 | 2
  semesterNumber: number
  selection: InitialAcademicSelection
  suggestion?: Awaited<ReturnType<typeof loadCurriculumSuggestions>>[number]
}): CurriculumPlannerState {
  const planningStart = { year, semester, semesterNumber }
  const suggested = suggestion
    ? planningFromSuggestion(suggestion, planningStart)
    : undefined
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
      periods:
        suggested?.periods.map((period) => ({
          id: crypto.randomUUID() as PlanningPeriodId,
          items: period.courses.map((courseId) => ({
            type: 'course' as const,
            courseId,
          })),
        })) ?? [],
      unallocatedCourseIds: [],
    },
    academicRecord: { completedCourses: [] },
  }
}

function stateFromImport(
  data: CurriculumPlannerImport,
): CurriculumPlannerState {
  const periods = data.periods.map((period) => ({
    id: crypto.randomUUID() as PlanningPeriodId,
    items: period.courses.map((courseId) => ({
      type: 'course' as const,
      courseId,
    })),
  }))
  return {
    revision: crypto.randomUUID() as PlannerRevision,
    selection: data.selection,
    plan: {
      planningStart: data.planningStart,
      currentPeriodId: data.currentPeriodPosition
        ? periods[data.currentPeriodPosition - 1]?.id
        : undefined,
      periods,
      unallocatedCourseIds: data.unallocatedCourses ?? [],
    },
    academicRecord: { completedCourses: [] },
  }
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
  onClick,
}: {
  active: boolean
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <Button
      type="button"
      variant={active ? 'default' : 'outline'}
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
  source: 'blank' | 'suggestion'
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
