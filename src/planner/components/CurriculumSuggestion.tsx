import { useQuery } from '@tanstack/react-query'
import { Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

import type { ReactNode } from 'react'
import type {
  CatalogProgramId,
  CurriculumPlannerSnapshot,
  CurriculumPlannerStaticData,
} from '@/planner/domain/curriculumPlanner'
import type { PlannerDispatch } from '@/planner/types'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { loadCurriculumSuggestions } from '@/planner/data/curriculumSuggestionApi'
import {
  planningFromSuggestion,
  suggestionTypeLabel,
} from '@/planner/domain/suggestionPlanning'

type Dispatch = PlannerDispatch

export function SuggestionOnboardingPanel({
  staticData,
  snapshot,
  disabled,
  dispatch,
  onDismiss,
}: {
  staticData: CurriculumPlannerStaticData
  snapshot: CurriculumPlannerSnapshot
  disabled: boolean
  dispatch: Dispatch
  onDismiss: () => void
}) {
  const selectedCatalogProgram = staticData.catalogPrograms.find(
    (program) => program.id === snapshot.selection.catalogProgramId,
  )
  const [catalogId, setCatalogId] = useState(
    selectedCatalogProgram?.catalog.id ?? '',
  )
  const [catalogProgramId, setCatalogProgramId] = useState(
    snapshot.selection.catalogProgramId ?? '',
  )
  const [suggestionId, setSuggestionId] = useState('')
  const [applyError, setApplyError] = useState<string>()
  const catalogs = [
    ...new Map(
      staticData.catalogPrograms.map((program) => [
        program.catalog.id,
        {
          value: program.catalog.id,
          label: `Catálogo ${program.catalog.year}`,
        },
      ]),
    ).values(),
  ].sort((left, right) => right.label.localeCompare(left.label))
  const programs = staticData.catalogPrograms
    .filter((program) => program.catalog.id === catalogId)
    .sort((left, right) => left.program.name.localeCompare(right.program.name))
  const suggestionsQuery = useQuery({
    queryKey: ['curriculum-suggestions', catalogProgramId],
    queryFn: () =>
      loadCurriculumSuggestions(catalogProgramId as CatalogProgramId),
    enabled: Boolean(catalogProgramId),
    retry: false,
  })
  const suggestions = suggestionsQuery.data ?? []
  const selectedSuggestion = suggestions.find(
    (suggestion) => suggestion.id === suggestionId,
  )
  useEffect(() => {
    if (suggestions.length === 1) {
      setSuggestionId(suggestions[0].id)
    } else if (
      !suggestions.some((suggestion) => suggestion.id === suggestionId)
    ) {
      setSuggestionId('')
    }
  }, [suggestionId, suggestions])

  const planningStart = snapshot.plan.planningStart ?? {
    year: new Date().getFullYear(),
    semester: 1 as const,
    semesterNumber: 1,
  }
  const submit = async () => {
    if (!selectedSuggestion) return
    const data = planningFromSuggestion(selectedSuggestion, planningStart)
    if (!data) {
      setApplyError(
        'A sugestão não possui semestres a partir do início escolhido.',
      )
      return
    }
    const succeeded = await dispatch({ type: 'importPlanning', data })
    if (succeeded) onDismiss()
    else
      setApplyError(
        'A sugestão contém disciplinas incompatíveis com os dados atuais.',
      )
  }

  return (
    <Card className="mb-7 border-primary shadow-[4px_4px_0_color-mix(in_srgb,var(--primary)_25%,transparent)]">
      <CardHeader className="border-b-2 border-border p-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="text-primary" /> Comece por uma sugestão
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Escolha seu currículo e use a distribuição recomendada como ponto de
          partida.
        </p>
      </CardHeader>
      <CardContent className="space-y-5 p-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label className="space-y-2 text-sm font-bold">
            <span>Catálogo</span>
            <AutocompleteSelect
              ariaLabel="Catálogo da sugestão"
              value={catalogId}
              disabled={disabled}
              options={catalogs}
              placeholder="Digite o ano do catálogo"
              onValueChange={(value) => {
                setCatalogId(value)
                setCatalogProgramId('')
                setSuggestionId('')
                setApplyError(undefined)
              }}
            />
          </label>
          <label className="space-y-2 text-sm font-bold">
            <span>Programa</span>
            <AutocompleteSelect
              ariaLabel="Programa da sugestão"
              value={catalogProgramId}
              disabled={disabled || !catalogId}
              options={programs.map((program) => ({
                value: program.id,
                label: `${program.program.code} — ${program.program.name}`,
              }))}
              placeholder={
                catalogId ? 'Digite o programa' : 'Escolha um catálogo primeiro'
              }
              onValueChange={(value) => {
                setCatalogProgramId(value)
                setSuggestionId('')
                setApplyError(undefined)
              }}
            />
          </label>
          <label className="space-y-2 text-sm font-bold">
            <span>Sugestão</span>
            <AutocompleteSelect
              ariaLabel="Sugestão curricular"
              value={suggestionId}
              onValueChange={setSuggestionId}
              disabled={
                !catalogProgramId ||
                suggestionsQuery.isLoading ||
                suggestions.length === 1
              }
              options={suggestions.map((suggestion) => ({
                value: suggestion.id,
                label: `${suggestion.code} — ${suggestion.name} (${suggestionTypeLabel(suggestion.type)})`,
              }))}
              placeholder={
                suggestionsQuery.isLoading
                  ? 'Carregando sugestões'
                  : catalogProgramId
                    ? 'Escolha uma sugestão'
                    : 'Escolha um programa primeiro'
              }
            />
          </label>
        </div>
        {suggestionsQuery.isError && (
          <Alert variant="destructive">
            <AlertTitle>Não foi possível carregar as sugestões</AlertTitle>
            <AlertDescription className="flex items-center justify-between gap-3">
              Tente novamente para consultar a API.
              <Button
                size="sm"
                variant="outline"
                onClick={() => void suggestionsQuery.refetch()}
              >
                Tentar novamente
              </Button>
            </AlertDescription>
          </Alert>
        )}
        {catalogProgramId &&
          !suggestionsQuery.isLoading &&
          !suggestionsQuery.isError &&
          !suggestions.length && (
            <p className="text-sm font-semibold text-muted-foreground">
              Nenhuma sugestão compatível está disponível para esta seleção.
            </p>
          )}
        {selectedSuggestion && (
          <p className="rounded-md border-2 border-border bg-muted/45 p-3 text-sm">
            {selectedSuggestion.semesters.length} semestres e{' '}
            {selectedSuggestion.semesters.reduce(
              (total, item) => total + item.courses.length,
              0,
            )}{' '}
            disciplinas na sugestão.
          </p>
        )}
        {applyError && (
          <p className="text-sm font-bold text-destructive">{applyError}</p>
        )}
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={onDismiss}>
            Planejar manualmente
          </Button>
          <Button
            disabled={disabled || !selectedSuggestion}
            onClick={() => void submit()}
          >
            <Sparkles /> Criar planejamento
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function ChangeSuggestionDialog({
  staticData,
  snapshot,
  disabled,
  dispatch,
  label = 'Trocar sugestão',
  trigger,
}: {
  staticData: CurriculumPlannerStaticData
  snapshot: CurriculumPlannerSnapshot
  disabled: boolean
  dispatch: Dispatch
  label?: string
  trigger?: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [catalogId, setCatalogId] = useState('')
  const [catalogProgramId, setCatalogProgramId] = useState('')
  const [suggestionId, setSuggestionId] = useState('')
  const [applyError, setApplyError] = useState<string>()
  const planningStart = snapshot.plan.planningStart ?? {
    year: new Date().getFullYear(),
    semester: 1 as const,
    semesterNumber: 1,
  }
  const selectedCatalogProgram = staticData.catalogPrograms.find(
    (program) => program.id === snapshot.selection.catalogProgramId,
  )
  const catalogs = [
    ...new Map(
      staticData.catalogPrograms.map((program) => [
        program.catalog.id,
        {
          value: program.catalog.id,
          label: `Catálogo ${program.catalog.year}`,
        },
      ]),
    ).values(),
  ].sort((left, right) => right.label.localeCompare(left.label))
  const programs = staticData.catalogPrograms
    .filter((program) => program.catalog.id === catalogId)
    .sort((left, right) => left.program.name.localeCompare(right.program.name))

  useEffect(() => {
    if (!open) return
    setCatalogId(selectedCatalogProgram?.catalog.id ?? '')
    setCatalogProgramId(snapshot.selection.catalogProgramId ?? '')
    setSuggestionId('')
    setApplyError(undefined)
  }, [
    open,
    selectedCatalogProgram?.catalog.id,
    snapshot.selection.catalogProgramId,
  ])
  const suggestionsQuery = useQuery({
    queryKey: ['curriculum-suggestions', catalogProgramId],
    queryFn: () =>
      loadCurriculumSuggestions(catalogProgramId as CatalogProgramId),
    enabled: open && Boolean(catalogProgramId),
    retry: false,
  })
  const suggestions = suggestionsQuery.data ?? []
  const selected = suggestions.find(
    (suggestion) => suggestion.id === suggestionId,
  )
  useEffect(() => {
    if (suggestions.length === 1) {
      setSuggestionId(suggestions[0].id)
    } else if (
      suggestionId &&
      !suggestions.some((suggestion) => suggestion.id === suggestionId)
    ) {
      setSuggestionId('')
    }
  }, [suggestionId, suggestions])
  const submit = async () => {
    if (!selected) return
    const data = planningFromSuggestion(selected, planningStart)
    if (!data) {
      setApplyError(
        'A sugestão não possui semestres a partir do início escolhido.',
      )
      return
    }
    const succeeded = await dispatch({ type: 'importPlanning', data })
    if (succeeded) {
      setOpen(false)
      setSuggestionId('')
      setApplyError(undefined)
    } else
      setApplyError(
        'A sugestão contém disciplinas incompatíveis com os dados atuais.',
      )
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" disabled={disabled}>
            <Sparkles /> {label}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Usar sugestão curricular</DialogTitle>
          <DialogDescription>
            A sugestão substituirá todo o planejamento atual, incluindo as
            disciplinas concluídas e as escolhas de currículo.
          </DialogDescription>
        </DialogHeader>
        {suggestionsQuery.isError ? (
          <Alert variant="destructive">
            <AlertTitle>Não foi possível carregar as sugestões</AlertTitle>
            <AlertDescription>
              <Button
                size="sm"
                variant="outline"
                onClick={() => void suggestionsQuery.refetch()}
              >
                Tentar novamente
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid gap-4">
            <label className="space-y-2 text-sm font-bold">
              <span>Catálogo</span>
              <AutocompleteSelect
                ariaLabel="Catálogo da sugestão"
                value={catalogId}
                disabled={disabled}
                options={catalogs}
                placeholder="Digite o ano do catálogo"
                onValueChange={(value) => {
                  setCatalogId(value)
                  setCatalogProgramId('')
                  setSuggestionId('')
                }}
              />
            </label>
            <label className="space-y-2 text-sm font-bold">
              <span>Programa</span>
              <AutocompleteSelect
                ariaLabel="Programa da sugestão"
                value={catalogProgramId}
                disabled={disabled || !catalogId}
                options={programs.map((program) => ({
                  value: program.id,
                  label: `${program.program.code} — ${program.program.name}`,
                }))}
                placeholder={
                  catalogId
                    ? 'Digite o programa'
                    : 'Escolha um catálogo primeiro'
                }
                onValueChange={(value) => {
                  setCatalogProgramId(value)
                  setSuggestionId('')
                }}
              />
            </label>
            <label className="space-y-2 text-sm font-bold">
              <span>Sugestão</span>
              <AutocompleteSelect
                ariaLabel="Nova sugestão curricular"
                value={suggestionId}
                onValueChange={setSuggestionId}
                disabled={
                  disabled ||
                  !catalogProgramId ||
                  suggestionsQuery.isLoading ||
                  suggestions.length === 1
                }
                options={suggestions.map((suggestion) => ({
                  value: suggestion.id,
                  label: `${suggestion.code} — ${suggestion.name} (${suggestionTypeLabel(suggestion.type)}${suggestion.specialization ? ` — ${suggestion.specialization.code} — ${suggestion.specialization.name}` : ''})`,
                }))}
                placeholder={
                  suggestionsQuery.isLoading
                    ? 'Carregando sugestões'
                    : catalogProgramId
                      ? 'Escolha uma sugestão'
                      : 'Escolha um programa primeiro'
                }
              />
            </label>
          </div>
        )}
        {applyError && (
          <p className="text-sm font-bold text-destructive">{applyError}</p>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            disabled={disabled || !selected}
            onClick={() => void submit()}
          >
            Substituir planejamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
