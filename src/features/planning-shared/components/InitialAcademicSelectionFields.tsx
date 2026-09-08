import type { CurriculumPlannerStaticData } from '@pomi/planner-domain/curriculum'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import { compareProgramCodes } from '@/features/planning-shared/data/programOrdering'

export type InitialAcademicSelection = Readonly<{
  catalogId: string
  programId: string
  catalogProgramId: string
  specializationId: string
  languageId: string
}>

export function InitialAcademicSelectionFields({
  staticData,
  value,
  onChange,
  showSpecialization = true,
  showLanguage = true,
}: {
  staticData: CurriculumPlannerStaticData
  value: InitialAcademicSelection
  onChange: (value: InitialAcademicSelection) => void
  showSpecialization?: boolean
  showLanguage?: boolean
}) {
  const catalogs = [
    ...new Map(
      staticData.catalogPrograms.map((item) => [
        item.catalog.id,
        { value: item.catalog.id, label: `Catálogo ${item.catalog.year}` },
      ]),
    ).values(),
  ].sort((left, right) => right.label.localeCompare(left.label))
  const programs = [
    ...new Map(
      staticData.catalogPrograms.map((item) => [item.program.id, item.program]),
    ).values(),
  ].sort(compareProgramCodes)
  const selectedProgramId =
    value.programId ||
    staticData.catalogPrograms.find(
      (item) => item.id === value.catalogProgramId,
    )?.program.id ||
    ''
  const selected = staticData.catalogPrograms.find(
    (item) => item.id === value.catalogProgramId,
  )
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <CreationSelect
        label="Programa"
        description="Define as disciplinas obrigatórias e os blocos de eletivas do curso."
        ariaLabel="Programa inicial"
        value={selectedProgramId}
        emptyLabel="Definir depois"
        placeholder="Escolha o programa"
        options={programs.map((item) => ({
          value: item.id,
          label: `${item.code} — ${item.name}`,
        }))}
        onValueChange={(programId) => {
          const catalogProgram = staticData.catalogPrograms.find(
            (item) =>
              item.catalog.id === value.catalogId &&
              item.program.id === programId,
          )
          onChange({
            ...value,
            programId,
            catalogProgramId: catalogProgram?.id ?? '',
            specializationId: '',
            languageId: '',
          })
        }}
      />
      <CreationSelect
        label="Catálogo"
        description="Define a edição das regras acadêmicas que será usada como referência."
        ariaLabel="Catálogo inicial"
        value={value.catalogId}
        emptyLabel="Definir depois"
        placeholder="Escolha o catálogo"
        options={catalogs}
        onValueChange={(catalogId) =>
          onChange({
            ...value,
            catalogId,
            catalogProgramId:
              staticData.catalogPrograms.find(
                (item) =>
                  item.catalog.id === catalogId &&
                  item.program.id === selectedProgramId,
              )?.id ?? '',
            specializationId: '',
            languageId: '',
          })
        }
      />
      {showSpecialization &&
        selected &&
        selected.specializations.length > 0 && (
          <CreationSelect
            label="Habilitação"
            description="Acrescenta os requisitos específicos da habilitação escolhida."
            ariaLabel="Habilitação inicial"
            value={value.specializationId}
            emptyLabel="Sem habilitação"
            placeholder="Escolha a habilitação"
            options={selected.specializations.map((item) => ({
              value: item.id,
              label: `${item.code} — ${item.name}`,
            }))}
            onValueChange={(specializationId) =>
              onChange({ ...value, specializationId })
            }
          />
        )}
      {showLanguage && selected && selected.languages.length > 0 && (
        <CreationSelect
          label="Língua"
          description="Inclui o bloco de disciplinas de língua quando ele fizer parte do programa."
          ariaLabel="Língua inicial"
          value={value.languageId}
          emptyLabel="Sem língua adicional"
          placeholder="Escolha a língua"
          options={selected.languages.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
          onValueChange={(languageId) => onChange({ ...value, languageId })}
        />
      )}
    </div>
  )
}

function CreationSelect({
  label,
  description,
  ...props
}: Parameters<typeof AutocompleteSelect>[0] & {
  label: string
  description: string
}) {
  return (
    <label className="space-y-2 text-sm font-bold">
      <span>{label}</span>
      <AutocompleteSelect {...props} />
      <span className="block text-xs font-normal leading-relaxed text-muted-foreground">
        {description}
      </span>
    </label>
  )
}
