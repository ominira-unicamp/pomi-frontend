import { useEffect, useMemo, useState } from 'react'

import type { CatalogProgramOption } from '@pomi/planner-domain/curriculum'
import type { StudentProfile } from '@/features/student/data/studentApi'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import { Field, FieldError, FieldLabel } from '@/components/patterns/Field'
import { InlineMessage } from '@/components/patterns/InlineMessage'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

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
    <Card variant="flat" className="mb-6">
      <CardContent className="p-4">
        <p className="font-extrabold">Curso e ingresso</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Estas informações preenchem automaticamente os novos planejamentos.
        </p>
      </CardContent>
      <CardContent className="border-t-2 border-strong-border p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>Catálogo</FieldLabel>
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
          </Field>
          <Field>
            <FieldLabel>Programa</FieldLabel>
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
          </Field>
          {selectedProgram?.specializations.length ? (
            <Field>
              <FieldLabel>Habilitação</FieldLabel>
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
            </Field>
          ) : null}
          {selectedProgram?.languages.length ? (
            <Field>
              <FieldLabel>Língua</FieldLabel>
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
            </Field>
          ) : null}
          <Field>
            <FieldLabel htmlFor="course-profile-entry-year">
              Ano de ingresso
            </FieldLabel>
            <Input
              id="course-profile-entry-year"
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
              aria-describedby={
                entryYearValid ? undefined : 'course-profile-entry-year-error'
              }
            />
            <FieldError id="course-profile-entry-year-error">
              {!entryYearValid
                ? 'Informe um ano de ingresso entre 1900 e 9999.'
                : undefined}
            </FieldError>
          </Field>
        </div>
        {saveError && (
          <InlineMessage className="mt-3" variant="error">
            Não foi possível salvar as informações do curso.
          </InlineMessage>
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
