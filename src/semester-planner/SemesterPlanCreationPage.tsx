import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { Upload } from 'lucide-react'

import {
  parseSemesterPlanning,
  resolveSemesterPlanningImport,
} from '@pomi/planner-domain/transfer'
import type { CatalogProgramId } from '@pomi/planner-domain/curriculum'
import type { InitialAcademicSelection } from '@/planner/components/InitialAcademicSelectionFields'
import type { SemesterDraftBootstrap } from '@/planner/data/planningDraftBootstrap'
import type { SemesterPlanningDocument } from '@pomi/planner-domain/semester'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { loadCurriculumCatalog } from '@/catalog/data/curriculumCatalogApi'
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
import { InitialAcademicSelectionFields } from '@/planner/components/InitialAcademicSelectionFields'
import { listCurricula } from '@/planner/data/curriculumPersistenceApi'
import { semesterDraftBootstrapKey } from '@/planner/data/planningDraftBootstrap'
import { loadCurriculumSuggestions } from '@/planner/data/curriculumSuggestionApi'
import {
  createSemesterPlanning,
  loadSemesterPlannerStaticData,
} from '@/semester-planner/data/semesterPlanningApi'
import { ensureCurrentStudent } from '@/student/data/studentApi'
import { mostRecentStudyPeriodsFirst } from '@/student/data/studyPeriodOrdering'
import { useStudentProfile } from '@/student/hooks/useStudentProfile'

const steps = ['Identificação', 'Guia de disciplinas', 'Revisão']

export function SemesterPlanCreationPage() {
  const auth = useOptionalAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { studentId, profileQuery } = useStudentProfile()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('Novo planejamento de semestre')
  const [studyPeriodId, setStudyPeriodId] = useState('')
  const [guideMode, setGuideMode] = useState<'none' | 'curriculum' | 'program'>(
    'none',
  )
  const [curriculumSource, setCurriculumSource] = useState<
    'saved' | 'suggestion'
  >('suggestion')
  const [curriculumId, setCurriculumId] = useState('')
  const [selection, setSelection] = useState<InitialAcademicSelection>({
    catalogId: '',
    catalogProgramId: '',
    specializationId: '',
    languageId: '',
  })
  const [suggestionId, setSuggestionId] = useState('')
  const [error, setError] = useState<string>()
  const [submitting, setSubmitting] = useState(false)
  const [importedDocument, setImportedDocument] =
    useState<SemesterPlanningDocument>()
  const importInputRef = useRef<HTMLInputElement>(null)
  const staticQuery = useQuery({
    queryKey: ['semester-planner', 'creation-static-data'],
    queryFn: () => loadSemesterPlannerStaticData(),
    staleTime: Infinity,
  })
  const catalogQuery = useQuery({
    queryKey: ['semester-planner', 'creation-catalog'],
    queryFn: async () => {
      const result = await loadCurriculumCatalog()
      if (!result.ok) throw new Error(result.error.code)
      return result.value
    },
    staleTime: Infinity,
  })
  const curriculaQuery = useQuery({
    queryKey: ['semester-planner', 'creation-curricula', studentId],
    queryFn: () => listCurricula(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId),
    retry: false,
  })
  const suggestionsQuery = useQuery({
    queryKey: [
      'semester-planner',
      'creation-suggestions',
      selection.catalogProgramId,
    ],
    queryFn: () =>
      loadCurriculumSuggestions(selection.catalogProgramId as CatalogProgramId),
    enabled:
      guideMode === 'curriculum' &&
      curriculumSource === 'suggestion' &&
      Boolean(selection.catalogProgramId),
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
      !profile ||
      selection.catalogProgramId ||
      importedDocument ||
      !catalogQuery.data
    )
      return
    const catalogProgram = catalogQuery.data.catalogPrograms.find(
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
  }, [
    catalogQuery.data,
    importedDocument,
    profileQuery.data,
    selection.catalogProgramId,
  ])

  const validFirstStep = Boolean(name.trim() && studyPeriodId)
  const validGuideStep =
    guideMode === 'none' ||
    (guideMode === 'program' && Boolean(selection.catalogProgramId)) ||
    (guideMode === 'curriculum' &&
      (curriculumSource === 'saved'
        ? Boolean(curriculumId)
        : Boolean(suggestion)))
  const generatedDocument: SemesterPlanningDocument = {
    name: name.trim(),
    studyPeriodId: studyPeriodId ? Number(studyPeriodId) : null,
    curriculumId:
      guideMode === 'curriculum' && curriculumSource === 'saved' && curriculumId
        ? Number(curriculumId)
        : null,
    classIds: [],
    guide: {
      mode: guideMode,
      curriculum: {
        source: guideMode === 'curriculum' ? curriculumSource : null,
        curriculumId:
          guideMode === 'curriculum' &&
          curriculumSource === 'saved' &&
          curriculumId
            ? Number(curriculumId)
            : null,
        suggestionId:
          guideMode === 'curriculum' &&
          curriculumSource === 'suggestion' &&
          suggestion
            ? Number(suggestion.id)
            : null,
        suggestionCatalogProgramId:
          guideMode === 'curriculum' &&
          curriculumSource === 'suggestion' &&
          selection.catalogProgramId
            ? Number(selection.catalogProgramId)
            : null,
      },
      program: {
        catalogProgramId:
          guideMode === 'program' && selection.catalogProgramId
            ? Number(selection.catalogProgramId)
            : null,
        specializationId:
          guideMode === 'program' && selection.specializationId
            ? Number(selection.specializationId)
            : null,
        languageId:
          guideMode === 'program' && selection.languageId
            ? Number(selection.languageId)
            : null,
      },
      manualCourseIds: [],
    },
  }
  const document = importedDocument ?? generatedDocument

  async function submit() {
    if (!document.studyPeriodId) return
    setSubmitting(true)
    setError(undefined)
    try {
      if (!auth.isAuthenticated) {
        queryClient.setQueryData<SemesterDraftBootstrap>(
          semesterDraftBootstrapKey,
          document,
        )
        await navigate({
          to: '/planejamentos-de-semestre/$planejamentoId',
          params: { planejamentoId: 'rascunho' },
        })
        return
      }
      const currentStudentId = await ensureCurrentStudent(
        String(
          auth.profile?.name ?? auth.profile?.preferred_username ?? 'Estudante',
        ),
        auth.getAccessToken,
      )
      const created = await createSemesterPlanning(
        currentStudentId,
        {
          ...document,
          studyPeriodId: document.studyPeriodId,
        },
        auth.getAccessToken,
      )
      await navigate({
        to: '/planejamentos-de-semestre/$planejamentoId',
        params: { planejamentoId: String(created.id) },
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
      const parsed = parseSemesterPlanning(JSON.parse(await file.text()))
      if (!parsed) throw new Error('invalid')
      const studyPeriod = staticQuery.data.studyPeriods.find(
        (item) =>
          item.id === parsed.semesterPlanning.studyPeriod.id ||
          item.code === parsed.semesterPlanning.studyPeriod.code,
      )
      if (!studyPeriod) throw new Error('study-period')
      const data = await loadSemesterPlannerStaticData(studyPeriod.id)
      const resolved = resolveSemesterPlanningImport(parsed, data)
      if (!resolved) throw new Error('invalid')
      setImportedDocument(resolved.document)
      setName(resolved.document.name)
      setStudyPeriodId(String(resolved.document.studyPeriodId))
      setError(undefined)
      setStep(2)
    } catch {
      setError(
        'Não foi possível importar o planejamento. Verifique se o arquivo foi exportado pelo POMI.',
      )
    } finally {
      if (importInputRef.current) importInputRef.current.value = ''
    }
  }

  if (staticQuery.isLoading || catalogQuery.isLoading)
    return (
      <PageContainer>
        <LoadingState label="Carregando opções do planejamento" />
      </PageContainer>
    )
  if (!staticQuery.data || !catalogQuery.data)
    return (
      <PageContainer>
        <ErrorState
          title="Não foi possível iniciar o planejamento"
          description="Períodos e dados acadêmicos não estão disponíveis."
        />
      </PageContainer>
    )

  const selectedPeriod = staticQuery.data.studyPeriods.find(
    (item) => String(item.id) === studyPeriodId,
  )
  const selectedCatalogProgram = catalogQuery.data.catalogPrograms.find(
    (item) => item.id === selection.catalogProgramId,
  )
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Planejamento acadêmico"
        title="Novo planejamento de semestre"
        description="Escolha o período e como o guia deve apresentar as disciplinas disponíveis."
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
          <Upload /> Importar planejamento
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
          step === 0 ? validFirstStep : step === 1 ? validGuideStep : true
        }
        isSubmitting={submitting}
        submitLabel={
          auth.isAuthenticated ? 'Criar planejamento' : 'Criar rascunho'
        }
        onBack={() => setStep((current) => current - 1)}
        onCancel={() => void navigate({ to: '/planejamentos-de-semestre' })}
        onContinue={() =>
          step < 2 ? setStep((current) => current + 1) : void submit()
        }
      >
        {step === 0 && (
          <div className="space-y-5">
            <StepTitle
              title="Identificação e período"
              description="O período determina quais turmas e horários estarão disponíveis e ficará fixo depois da criação."
            />
            <label className="block space-y-2 text-sm font-bold">
              <span>Nome</span>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <span className="block text-xs font-normal text-muted-foreground">
                Use um nome que ajude a comparar esta alternativa com outros
                horários.
              </span>
            </label>
            <label className="block space-y-2 text-sm font-bold">
              <span>Período letivo</span>
              <AutocompleteSelect
                ariaLabel="Período letivo do planejamento"
                value={studyPeriodId}
                options={mostRecentStudyPeriodsFirst(
                  staticQuery.data.studyPeriods,
                ).map((item) => ({ value: String(item.id), label: item.code }))}
                placeholder="Escolha o período"
                onValueChange={setStudyPeriodId}
              />
              <span className="block text-xs font-normal text-muted-foreground">
                Somente turmas oferecidas neste período poderão ser adicionadas.
              </span>
            </label>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-6">
            <StepTitle
              title="Guia de disciplinas"
              description="O guia filtra o que aparece como opção; ele não adiciona nenhuma turma automaticamente."
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <GuideChoice
                active={guideMode === 'curriculum'}
                title="Currículo"
                description="Mostra disciplinas de um currículo salvo ou de uma sugestão oficial."
                onClick={() => setGuideMode('curriculum')}
              />
              <GuideChoice
                active={guideMode === 'program'}
                title="Programa"
                description="Mostra disciplinas que atendem aos blocos do programa escolhido."
                onClick={() => setGuideMode('program')}
              />
              <GuideChoice
                active={guideMode === 'none'}
                title="Nenhum"
                description="Começa com seleção livre para adicionar disciplinas manualmente."
                onClick={() => setGuideMode('none')}
              />
            </div>
            {guideMode === 'curriculum' && (
              <div className="space-y-5 border-t border-strong-border/30 pt-5">
                {auth.isAuthenticated &&
                  (curriculaQuery.data?.length ?? 0) > 0 && (
                    <div className="flex gap-2">
                      <Button
                        variant={
                          curriculumSource === 'saved' ? 'default' : 'outline'
                        }
                        onClick={() => setCurriculumSource('saved')}
                      >
                        Currículo salvo
                      </Button>
                      <Button
                        variant={
                          curriculumSource === 'suggestion'
                            ? 'default'
                            : 'outline'
                        }
                        onClick={() => setCurriculumSource('suggestion')}
                      >
                        Sugestão curricular
                      </Button>
                    </div>
                  )}
                {curriculumSource === 'saved' && auth.isAuthenticated ? (
                  <label className="block space-y-2 text-sm font-bold">
                    <span>Currículo salvo</span>
                    <AutocompleteSelect
                      ariaLabel="Currículo inicial do guia"
                      value={curriculumId}
                      options={(curriculaQuery.data ?? []).map((item) => ({
                        value: String(item.id),
                        label: item.name,
                      }))}
                      placeholder="Escolha o currículo"
                      onValueChange={setCurriculumId}
                    />
                    <span className="block text-xs font-normal text-muted-foreground">
                      O guia usa as disciplinas já organizadas nesse
                      planejamento curricular.
                    </span>
                  </label>
                ) : (
                  <>
                    <InitialAcademicSelectionFields
                      staticData={catalogQuery.data}
                      value={selection}
                      showSpecialization={false}
                      showLanguage={false}
                      onChange={(next) => {
                        setSelection(next)
                        setSuggestionId('')
                      }}
                    />
                    <label className="block space-y-2 text-sm font-bold">
                      <span>Sugestão</span>
                      <AutocompleteSelect
                        ariaLabel="Sugestão inicial do guia"
                        value={suggestionId}
                        disabled={
                          !selection.catalogProgramId ||
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
                        A sugestão define quais disciplinas aparecem organizadas
                        por semestre.
                      </span>
                    </label>
                  </>
                )}
              </div>
            )}
            {guideMode === 'program' && (
              <div className="border-t border-strong-border/30 pt-5">
                <InitialAcademicSelectionFields
                  staticData={catalogQuery.data}
                  value={selection}
                  onChange={setSelection}
                />
              </div>
            )}
          </div>
        )}
        {step === 2 && (
          <div className="space-y-5">
            <StepTitle
              title="Revise o planejamento"
              description="O planejamento será criado somente ao confirmar esta etapa."
            />
            <dl className="divide-y divide-strong-border/20">
              <ReviewRow label="Nome" value={name} />
              <ReviewRow label="Período" value={selectedPeriod?.code ?? ''} />
              <ReviewRow
                label="Guia"
                value={
                  guideMode === 'none'
                    ? 'Nenhum — seleção livre'
                    : guideMode === 'program'
                      ? `Programa${selectedCatalogProgram ? ` — ${selectedCatalogProgram.program.code} ${selectedCatalogProgram.program.name}` : ''}`
                      : curriculumSource === 'saved'
                        ? `Currículo salvo — ${curriculaQuery.data?.find((item) => String(item.id) === curriculumId)?.name ?? ''}`
                        : `Sugestão curricular — ${suggestion ? `${suggestion.code} ${suggestion.name}` : ''}`
                }
              />
            </dl>
          </div>
        )}
      </CreationWizard>
    </PageContainer>
  )
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

function GuideChoice({
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

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr]">
      <dt className="text-sm font-bold">{label}</dt>
      <dd className="text-sm text-muted-foreground">{value}</dd>
    </div>
  )
}
