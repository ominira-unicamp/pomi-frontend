import { useEffect, useMemo, useState } from 'react'

import type { CatalogProgramOption } from '@/planner/domain/curriculumPlanner'
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
  const [editing, setEditing] = useState(false)
  const [catalogProgramId, setCatalogProgramId] = useState('')
  const [specializationId, setSpecializationId] = useState('')
  const [languageId, setLanguageId] = useState('')
  const [entryYear, setEntryYear] = useState('')

  const selectedProgram = useMemo(
    () => catalogPrograms.find((item) => item.id === catalogProgramId),
    [catalogProgramId, catalogPrograms],
  )

  const beginEditing = () => {
    const current = catalogPrograms.find(
      (item) =>
        Number(item.catalog.id) === profile?.catalogId &&
        Number(item.program.id) === profile.programId,
    )
    setCatalogProgramId(current?.id ?? '')
    setSpecializationId(profile?.specializationId ? String(profile.specializationId) : '')
    setLanguageId(profile?.languageId ? String(profile.languageId) : '')
    setEntryYear(profile?.entryYear ? String(profile.entryYear) : '')
    setEditing(true)
  }

  useEffect(() => {
    if (!editing) return
    if (selectedProgram) return
    setSpecializationId('')
    setLanguageId('')
  }, [editing, selectedProgram])

  const save = async () => {
    await onSave({
      catalogId: selectedProgram ? Number(selectedProgram.catalog.id) : null,
      programId: selectedProgram ? Number(selectedProgram.program.id) : null,
      specializationId: specializationId ? Number(specializationId) : null,
      languageId: languageId ? Number(languageId) : null,
      entryYear: entryYear ? Number(entryYear) : null,
    })
    setEditing(false)
  }

  return (
    <Card className="mb-6 shadow-none">
      <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <p className="text-sm font-bold">Curso e ingresso</p>
          <p className="text-sm text-muted-foreground">
            {profile?.entryYear
              ? `Ingresso em ${profile.entryYear}`
              : 'Informe seu curso e ano de ingresso para preencher os planejamentos.'}
          </p>
        </div>
        <Button variant="outline" onClick={beginEditing}>
          Configurar
        </Button>
      </CardContent>
      {editing && (
        <CardContent className="border-t-2 border-strong-border p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <AutocompleteSelect
              ariaLabel="Catálogo e programa"
              value={catalogProgramId}
              options={catalogPrograms.map((item) => ({
                value: item.id,
                label: `Catálogo ${item.catalog.year} — ${item.program.code} ${item.program.name}`,
              }))}
              placeholder="Escolha catálogo e programa"
              onValueChange={(value) => {
                setCatalogProgramId(value)
                setSpecializationId('')
                setLanguageId('')
              }}
            />
            <AutocompleteSelect
              ariaLabel="Habilitação"
              value={specializationId}
              disabled={!selectedProgram}
              emptyLabel="Sem habilitação"
              options={(selectedProgram?.specializations ?? []).map((item) => ({
                value: item.id,
                label: `${item.code} — ${item.name}`,
              }))}
              placeholder="Escolha a habilitação"
              onValueChange={setSpecializationId}
            />
            <AutocompleteSelect
              ariaLabel="Língua"
              value={languageId}
              disabled={!selectedProgram}
              emptyLabel="Sem língua adicional"
              options={(selectedProgram?.languages ?? []).map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              placeholder="Escolha a língua"
              onValueChange={setLanguageId}
            />
            <label className="block space-y-2 text-sm font-bold">
              <span>Ano de ingresso</span>
              <input
                type="number"
                min="1900"
                max="9999"
                value={entryYear}
                placeholder="Ex.: 2024"
                onChange={(event) => setEntryYear(event.target.value)}
                className="h-10 w-full rounded-md border-2 border-strong-border bg-background px-3"
              />
            </label>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
            <Button onClick={() => void save()}>Salvar</Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
