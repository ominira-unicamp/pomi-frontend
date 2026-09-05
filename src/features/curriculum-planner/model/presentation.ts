import type { CurriculumSummary } from '@/features/curriculum-planner/data/curriculumPersistenceApi'
import type {
  CurriculumPlannerStaticData,
  PlannerError,
} from '@pomi/planner-domain/curriculum'

export function curriculumPlannerErrorText(error: PlannerError | string) {
  const code = typeof error === 'string' ? error : error.code
  if (typeof error !== 'string' && error.code === 'invalidInput') {
    const importReasons = {
      catalogProgram:
        'O catálogo/programa do arquivo não está disponível nos dados atuais.',
      specialization:
        'A habilitação do arquivo não pertence ao programa atual.',
      language: 'A língua do arquivo não pertence ao programa atual.',
      courses:
        'O arquivo contém uma ou mais disciplinas que não existem no catálogo atual.',
      periods: 'O arquivo coloca a mesma disciplina em mais de um semestre.',
      import: 'O formato interno do arquivo de planejamento não é válido.',
    } as const
    const field = error.details.field as keyof typeof importReasons
    return importReasons[field]
  }
  return (
    {
      conflict: 'O planejamento mudou. O estado mais recente foi carregado.',
      duplicateCourse: 'Essa disciplina já está planejada em outro semestre.',
      invalidInput: 'A informação fornecida não é válida.',
      invalidSelection: 'A opção não pertence ao currículo selecionado.',
      notFound: 'O item não existe mais no planejamento.',
      unavailable: 'Não foi possível acessar os dados do planejador.',
      unexpected: 'Os dados locais ou a resposta da API são incompatíveis.',
    }[code] ?? 'Não foi possível concluir a ação.'
  )
}

export function curriculumPlanningName(name: string | undefined, id?: number) {
  return name?.trim() || (id ? `Planejamento ${id}` : 'Planejamento sem nome')
}

export function curriculumSummaryDetails(
  summary: CurriculumSummary,
  catalogPrograms: CurriculumPlannerStaticData['catalogPrograms'],
) {
  const catalogProgram = catalogPrograms.find(
    (item) => Number(item.id) === summary.selection.catalogProgramId,
  )
  if (!catalogProgram) return []
  const specialization = catalogProgram.specializations.find(
    (item) => Number(item.id) === summary.selection.specializationId,
  )
  const language = catalogProgram.languages.find(
    (item) => Number(item.id) === summary.selection.languageId,
  )
  return [
    { label: 'Catálogo', value: `Catálogo ${catalogProgram.catalog.year}` },
    {
      label: 'Curso',
      value: `${catalogProgram.program.code} · ${catalogProgram.program.name}`,
    },
    ...(specialization
      ? [
          {
            label: 'Habilitação',
            value: `${specialization.code} · ${specialization.name}`,
          },
        ]
      : []),
    ...(language ? [{ label: 'Língua', value: language.name }] : []),
  ]
}

export function curriculumUpdatedAtLabel(value?: string) {
  if (!value) return 'Sem data de atualização'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Sem data de atualização'
  return `Atualizado em ${new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
  }).format(date)}`
}
