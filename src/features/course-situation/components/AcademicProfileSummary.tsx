import type { ReactNode } from 'react'
import type { CurriculumPlannerStaticData } from '@pomi/planner-domain/curriculum'
import type { StudentProfile } from '@/features/student/data/studentApi'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/patterns/Section'

export function AcademicProfileSummary({
  profile,
  data,
  loading,
  onEdit,
  editDisabled,
  children,
}: {
  profile?: StudentProfile
  data?: CurriculumPlannerStaticData
  loading: boolean
  onEdit: () => void
  editDisabled?: boolean
  children: ReactNode
}) {
  const program = data?.catalogPrograms.find(
    (item) =>
      Number(item.catalog.id) === profile?.catalogId &&
      Number(item.program.id) === profile.programId,
  )
  const variant = program?.variants.find(
    (item) => item.specializationId === profile?.specializationId,
  )
  return (
    <Section variant="bordered" className="mb-6" aria-label="Vínculo acadêmico">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-extrabold">
            {program
              ? `${program.program.code} — ${program.program.name}`
              : loading
                ? 'Carregando vínculo acadêmico'
                : 'Defina seu curso e ingresso'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {program
              ? `Catálogo ${program.catalog.year}`
              : profile?.catalogId
                ? 'Catálogo salvo indisponível para consulta'
                : 'Catálogo não informado'}{' '}
            ·{' '}
            {profile?.entryYear
              ? `Ingresso ${profile.entryYear}`
              : 'Ingresso não informado'}
            {variant?.name ? ` · ${variant.code} — ${variant.name}` : ''}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={onEdit}
          disabled={loading || editDisabled}
        >
          Editar vínculo acadêmico
        </Button>
      </div>
      {children}
    </Section>
  )
}
