import { useMemo, useState } from 'react'

import type { CatalogProgramOption } from '@pomi/planner-domain/curriculum'
import type { StudentProfile } from '@/features/student/data/studentApi'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import { Field, FieldError, FieldLabel } from '@/components/patterns/Field'
import { InlineMessage } from '@/components/patterns/InlineMessage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { compareProgramCodes } from '@/features/planning-shared/data/programOrdering'

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
  onCancel,
}: {
  profile?: StudentProfile
  catalogPrograms: ReadonlyArray<CatalogProgramOption>
  onSave: (value: CourseProfileValues) => Promise<void>
  onCancel?: () => void
}) {
  const [catalogId, setCatalogId] = useState(() =>
    profile?.catalogId ? String(profile.catalogId) : '',
  )
  const [programId, setProgramId] = useState(() =>
    catalogPrograms.some(
      (item) =>
        Number(item.catalog.id) === profile?.catalogId &&
        Number(item.program.id) === profile.programId,
    )
      ? String(profile?.programId)
      : '',
  )
  const [specializationId, setSpecializationId] = useState(() =>
    profile?.specializationId ? String(profile.specializationId) : '',
  )
  const [languageId, setLanguageId] = useState(() =>
    profile?.languageId ? String(profile.languageId) : '',
  )
  const [entryYear, setEntryYear] = useState(() =>
    profile?.entryYear ? String(profile.entryYear) : '',
  )
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
        .sort((left, right) => compareProgramCodes(left.program, right.program))
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
  const specializationOptions = useMemo(
    () =>
      (selectedProgram?.variants ?? [])
        .filter(
          (variant): variant is typeof variant & { specializationId: number } =>
            variant.specializationId !== null,
        )
        .map((variant) => ({
          value: String(variant.specializationId),
          label: `${variant.code} — ${variant.name}`,
        })),
    [selectedProgram],
  )

  const values: CourseProfileValues = {
    catalogId: catalogId ? Number(catalogId) : null,
    programId: selectedProgram ? Number(selectedProgram.program.id) : null,
    specializationId: specializationOptions.some(
      (item) => item.value === specializationId,
    )
      ? Number(specializationId)
      : null,
    languageId: selectedProgram?.languages.some(
      (item) => item.id === languageId,
    )
      ? Number(languageId)
      : null,
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
    <form
      onSubmit={(event) => {
        event.preventDefault()
        void save()
      }}
    >
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel>Catálogo</FieldLabel>
          <AutocompleteSelect
            fitContainer
            listPlacement="overlay"
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
        <Field className="col-span-2">
          <FieldLabel>Programa</FieldLabel>
          <AutocompleteSelect
            fitContainer
            listPlacement="overlay"
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
        {specializationOptions.length ? (
          <Field className="col-span-2">
            <FieldLabel>Modalidade</FieldLabel>
            <AutocompleteSelect
              fitContainer
              listPlacement="overlay"
              ariaLabel="Modalidade"
              value={specializationId}
              emptyLabel="Sem modalidade"
              options={specializationOptions}
              placeholder="Escolha a modalidade"
              onValueChange={setSpecializationId}
            />
          </Field>
        ) : null}
        {selectedProgram?.languages.length ? (
          <Field className="col-span-2">
            <FieldLabel>Língua</FieldLabel>
            <AutocompleteSelect
              fitContainer
              listPlacement="overlay"
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
      </div>
      {saveError && (
        <InlineMessage className="mt-3" variant="error">
          Não foi possível salvar as informações do curso.
        </InlineMessage>
      )}
      <div className="sticky bottom-0 z-10 mt-6 flex justify-end gap-2 border-t border-border bg-card py-4">
        {onCancel && (
          <Button variant="outline" disabled={saving} onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button
          disabled={!hasChanges || !entryYearValid || saving}
          type="submit"
        >
          {saving ? 'Salvando…' : 'Salvar alterações'}
        </Button>
      </div>
    </form>
  )
}
