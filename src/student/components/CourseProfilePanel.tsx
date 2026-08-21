import { useEffect, useMemo, useState } from 'react'

import type { CatalogProgramOption } from '@pomi/planner-domain/curriculum'
import type { StudentProfile } from '@/student/data/studentApi'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export type CourseProfileValues = Readonly<{
  catalogId: number | null
  programId: number | null
  specializationId: number | null
  languageId: number | null
  entryYear: number | null
}>

export function CourseProfilePanel({
  profile,
  catalogPrograms,
  onSave,
}: {
  profile?: StudentProfile
  catalogPrograms: ReadonlyArray<CatalogProgramOption>
  onSave: (value: CourseProfileValues) => Promise<void>
}) {
  const [catalogId, setCatalogId] = useState('')
  const [programId, setProgramId] = useState('')
  const [specializationId, setSpecializationId] = useState('')
  const [languageId, setLanguageId] = useState('')
  const [entryYear, setEntryYear] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(false)

  const catalogOptions = useMemo(
    () =>
      [...catalogPrograms]
        .sort((left, right) => right.catalog.year - left.catalog.year)
        .filter(
          (item, index, items) =>
            items.findIndex(
              (candidate) => candidate.catalog.id === item.catalog.id,
            ) === index,
        )
        .map((item) => ({
          value: item.catalog.id,
          label: `Catálogo ${item.catalog.year}`,
        })),
    [catalogPrograms],
  )
  const programOptions = useMemo(
    () =>
      catalogPrograms
        .filter((item) => item.catalog.id === catalogId)
        .sort((left, right) =>
          left.program.name.localeCompare(right.program.name, 'pt-BR'),
        )
        .filter(
          (item, index, items) =>
            items.findIndex(
              (candidate) => candidate.program.id === item.program.id,
            ) === index,
        )
        .map((item) => ({
          value: item.program.id,
          label: `${item.program.code} — ${item.program.name}`,
        })),
    [catalogId, catalogPrograms],
  )
  const selectedProgram = useMemo(
    () =>
      catalogPrograms.find(
        (item) =>
          item.catalog.id === catalogId && item.program.id === programId,
      ),
    [catalogId, catalogPrograms, programId],
  )

  useEffect(() => {
    setCatalogId(profile?.catalogId ? String(profile.catalogId) : '')
    const current = profile
      ? catalogPrograms.find(
          (item) =>
            Number(item.catalog.id) === profile.catalogId &&
            Number(item.program.id) === profile.programId,
        )
      : undefined
    setProgramId(current ? String(current.program.id) : '')
    setSpecializationId(
      profile?.specializationId ? String(profile.specializationId) : '',
    )
    setLanguageId(profile?.languageId ? String(profile.languageId) : '')
    setEntryYear(profile?.entryYear ? String(profile.entryYear) : '')
  }, [catalogPrograms, profile])

  const values: CourseProfileValues = {
    catalogId: catalogId ? Number(catalogId) : null,
    programId: selectedProgram ? Number(selectedProgram.program.id) : null,
    specializationId:
      selectedProgram && specializationId ? Number(specializationId) : null,
    languageId: selectedProgram && languageId ? Number(languageId) : null,
    entryYear: entryYear ? Number(entryYear) : null,
  }
  const hasChanges =
    values.catalogId !== (profile?.catalogId ?? null) ||
    values.programId !== (profile?.programId ?? null) ||
    values.specializationId !== (profile?.specializationId ?? null) ||
    values.languageId !== (profile?.languageId ?? null) ||
    values.entryYear !== (profile?.entryYear ?? null)
  const parsedEntryYear = values.entryYear
  const entryYearValid =
    !entryYear ||
    (parsedEntryYear !== null &&
      Number.isInteger(parsedEntryYear) &&
      parsedEntryYear >= 1900 &&
      parsedEntryYear <= 9999)

  const save = async () => {
    if (!hasChanges || !entryYearValid) return
    setSaving(true)
    setSaveError(false)
    try {
      await onSave(values)
    } catch {
      setSaveError(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="mb-6 shadow-none">
      <CardContent className="p-4">
        <p className="font-extrabold">Curso e ingresso</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Estas informações preenchem automaticamente os novos planejamentos.
        </p>
      </CardContent>
      <CardContent className="border-t-2 border-strong-border p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-2 text-sm font-bold">
            <span>Catálogo</span>
            <AutocompleteSelect
              ariaLabel="Catálogo"
              value={catalogId}
              options={catalogOptions}
              placeholder="Escolha o catálogo"
              onValueChange={(value) => {
                setSaveError(false)
                setCatalogId(value)
                setProgramId('')
                setSpecializationId('')
                setLanguageId('')
              }}
            />
          </label>
          <label className="block space-y-2 text-sm font-bold">
            <span>Programa</span>
            <AutocompleteSelect
              ariaLabel="Programa"
              value={programId}
              options={programOptions}
              disabled={!catalogId}
              placeholder="Escolha o programa"
              onValueChange={(value) => {
                setSaveError(false)
                setProgramId(value)
                setSpecializationId('')
                setLanguageId('')
              }}
            />
          </label>
          {selectedProgram?.specializations.length ? (
            <label className="block space-y-2 text-sm font-bold">
              <span>Habilitação</span>
              <AutocompleteSelect
                ariaLabel="Habilitação"
                value={specializationId}
                emptyLabel="Sem habilitação"
                options={selectedProgram.specializations.map((item) => ({
                  value: item.id,
                  label: `${item.code} — ${item.name}`,
                }))}
                placeholder="Escolha a habilitação"
                onValueChange={setSpecializationId}
              />
            </label>
          ) : null}
          {selectedProgram?.languages.length ? (
            <label className="block space-y-2 text-sm font-bold">
              <span>Língua</span>
              <AutocompleteSelect
                ariaLabel="Língua"
                value={languageId}
                emptyLabel="Sem língua adicional"
                options={selectedProgram.languages.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                placeholder="Escolha a língua"
                onValueChange={setLanguageId}
              />
            </label>
          ) : null}
          <label className="block space-y-2 text-sm font-bold">
            <span>Ano de ingresso</span>
            <input
              type="number"
              min="1900"
              max="9999"
              value={entryYear}
              placeholder="Ex.: 2024"
              onChange={(event) => {
                setSaveError(false)
                setEntryYear(event.target.value)
              }}
              aria-invalid={!entryYearValid}
              className="h-10 w-full rounded-md border-2 border-strong-border bg-background px-3"
            />
          </label>
        </div>
        {!entryYearValid && (
          <p
            className="mt-3 text-sm font-semibold text-destructive"
            role="alert"
          >
            Informe um ano de ingresso entre 1900 e 9999.
          </p>
        )}
        {saveError && (
          <p
            className="mt-3 text-sm font-semibold text-destructive"
            role="alert"
          >
            Não foi possível salvar as informações do curso.
          </p>
        )}
        <div className="mt-5 flex justify-end">
          <Button
            disabled={!hasChanges || !entryYearValid || saving}
            onClick={() => void save()}
          >
            {saving ? 'Salvando…' : 'Salvar alterações'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
