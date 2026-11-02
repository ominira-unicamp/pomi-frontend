import { useState } from 'react'
import { catalogProgramVariantForSelection } from '@pomi/planner-domain/curriculum'
import type { CurriculumPlannerStaticData } from '@pomi/planner-domain/curriculum'
import type {
  StudentCourseAttempt,
  StudentProfile,
} from '@/features/student/data/studentApi'
import type { CatalogProgramDetailsSearch } from '@/features/catalog-program'
import {
  CatalogProgramDetails,
  CompletedCoursesToggle,
} from '@/features/catalog-program'
import { isApprovedStudentCourseAttempt } from '@/features/student/data/studentApi'
import { InlineMessage } from '@/components/patterns/InlineMessage'
import { EmptyState, ErrorState, LoadingState } from '@/components/PageLayout'

export function StudentProgramCurriculum({
  profile,
  data,
  isLoading,
  isError,
  onRetry,
  attempts,
  attemptsLoading,
}: {
  profile?: StudentProfile
  data?: CurriculumPlannerStaticData
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  attempts: ReadonlyArray<StudentCourseAttempt>
  attemptsLoading: boolean
}) {
  const [markCompleted, setMarkCompleted] = useState(false)
  const [search, setSearch] = useState<CatalogProgramDetailsSearch>({
    tab: 'full',
  })
  if (isLoading)
    return <LoadingState label="Carregando informações do programa" />
  if (isError || !data)
    return (
      <ErrorState
        title="Não foi possível carregar o programa"
        description="Tente novamente para consultar as informações curriculares."
        action={{ label: 'Tentar novamente', onClick: onRetry }}
      />
    )
  if (!profile?.catalogId || !profile.programId)
    return (
      <EmptyState
        title="Escolha seu programa"
        description="Selecione e salve o catálogo e o programa em Curso e ingresso para consultar o currículo pleno, a proposta de currículo e a árvore de dependências."
      />
    )
  const program = data.catalogPrograms.find(
    (item) =>
      Number(item.catalog.id) === profile.catalogId &&
      Number(item.program.id) === profile.programId,
  )
  if (!program)
    return (
      <EmptyState
        title="Programa não disponível neste catálogo"
        description="O catálogo e o programa salvos não estão disponíveis para consulta. Confira sua seleção em Curso e ingresso."
      />
    )
  const variant = catalogProgramVariantForSelection(
    program,
    profile.specializationId,
  )
  if (!variant && profile.specializationId !== null)
    return (
      <EmptyState
        title="Confira a modalidade do programa"
        description="Selecione e salve uma modalidade disponível em Curso e ingresso para consultar o currículo correspondente."
      />
    )
  const completedCourseIds = new Set<number>(
    attempts
      .filter(isApprovedStudentCourseAttempt)
      .map((attempt) => attempt.courseId),
  )
  return (
    <section
      aria-label="Informações do programa escolhido"
      className="mt-8 min-w-0"
    >
      {!variant && program.variants.length > 1 && (
        <InlineMessage className="mb-5">
          Selecione uma modalidade em Curso e ingresso para incluir seus
          requisitos específicos e consultar a proposta de currículo. O núcleo
          comum continua disponível abaixo.
        </InlineMessage>
      )}
      <CatalogProgramDetails
        key={`${program.id}-${variant?.id ?? 'base'}`}
        program={program}
        variant={variant}
        courses={data.courses}
        completedCourseIds={completedCourseIds}
        markCompleted={markCompleted}
        search={search}
        onSearchChange={setSearch}
        actions={
          <CompletedCoursesToggle
            checked={markCompleted}
            disabled={attemptsLoading}
            onClick={() => setMarkCompleted((current) => !current)}
          />
        }
      />
    </section>
  )
}
