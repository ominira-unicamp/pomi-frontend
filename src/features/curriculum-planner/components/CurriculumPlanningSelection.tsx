import { Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowRight,
  Clock3,
  GraduationCap,
  Plus,
  Star,
  Upload,
} from 'lucide-react'
import type { ChangeEvent, RefObject } from 'react'
import type { ResolvedPlanningImport } from '@pomi/planner-domain/transfer'

import type { CurriculumPlannerContextValue } from '@/features/curriculum-planner/CurriculumPlannerProvider'
import { EmptyState, PageContainer, PageHeader } from '@/components/PageLayout'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ActionTooltip } from '@/features/curriculum-planner/components/ActionTooltip'
import { PlanningImportReviewDialog } from '@/features/curriculum-planner/components/PlanningImportReviewDialog'
import {
  curriculumSummaryDetails,
  curriculumUpdatedAtLabel,
} from '@/features/curriculum-planner/model/presentation'

export function CurriculumPlanningSelection({
  planner,
  importInputRef,
  pendingImport,
  importError,
  selectionError,
  onImport,
  onConfirmImport,
  onDismissImport,
  onStartImport,
}: {
  planner: CurriculumPlannerContextValue
  importInputRef: RefObject<HTMLInputElement | null>
  pendingImport?: ResolvedPlanningImport
  importError?: 'parse' | 'dispatch'
  selectionError: boolean
  onImport: (file?: File) => void
  onConfirmImport: () => void
  onDismissImport: () => void
  onStartImport: () => void
}) {
  const navigate = useNavigate()
  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    onImport(event.target.files?.[0])
    event.target.value = ''
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Planejamento acadêmico"
        title="Planejamentos de currículo"
        description={
          planner.isAuthenticated
            ? 'Organize sua trajetória acadêmica, período a período.'
            : 'Comece um rascunho nesta sessão ou importe um currículo existente.'
        }
        actions={
          <>
            <ActionTooltip content="Importe um currículo salvo em um arquivo JSON.">
              <Button variant="outline" onClick={onStartImport}>
                <Upload /> Importar currículo
              </Button>
            </ActionTooltip>
            <ActionTooltip
              content={
                planner.isAuthenticated
                  ? 'Crie um currículo salvo para organizar seus próximos semestres.'
                  : 'Comece um currículo temporário nesta sessão.'
              }
            >
              <Button
                onClick={() =>
                  void navigate({ to: '/planejamentos-de-curriculo/novo' })
                }
              >
                <Plus />
                {planner.isAuthenticated ? 'Novo planejamento' : 'Novo rascunho'}
              </Button>
            </ActionTooltip>
          </>
        }
      />
      {planner.isAuthenticated && planner.curricula.length > 0 && (
        <section aria-labelledby="curricula-title">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 id="curricula-title" className="text-xl font-extrabold">
                Seus planejamentos
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Retome um planejamento ou acompanhe sua configuração atual.
              </p>
            </div>
            <span className="shrink-0 text-sm font-bold text-muted-foreground">
              {planner.curricula.length} salvo
              {planner.curricula.length === 1 ? '' : 's'}
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {planner.curricula.map((curriculum) => {
              const details = curriculumSummaryDetails(
                curriculum,
                planner.staticData?.catalogPrograms ?? [],
              )
              return (
                <Card
                  key={curriculum.id}
                  className="overflow-hidden transition-colors hover:border-primary"
                >
                  <div className="relative h-full">
                    <ActionTooltip
                      content={
                        curriculum.isFavorite
                          ? 'Remova este planejamento da Home.'
                          : 'Mostre este planejamento como principal na Home.'
                      }
                    >
                      <Button
                        aria-label={
                          curriculum.isFavorite
                            ? 'Remover dos favoritos'
                            : 'Favoritar planejamento'
                        }
                        aria-pressed={curriculum.isFavorite}
                        className="absolute top-4 right-4 z-10"
                        disabled={planner.isDispatching}
                        size="icon"
                        variant={curriculum.isFavorite ? 'default' : 'outline'}
                        onClick={() =>
                          void planner.setCurriculumFavorite(
                            curriculum.id,
                            !curriculum.isFavorite,
                          )
                        }
                      >
                        <Star
                          className={
                            curriculum.isFavorite ? 'fill-current' : undefined
                          }
                        />
                      </Button>
                    </ActionTooltip>
                    <Link
                      className="pomi-focus flex h-full min-h-44 w-full flex-col p-5 pr-16 text-left"
                      to="/planejamentos-de-curriculo/$planejamentoId"
                      params={{ planejamentoId: String(curriculum.id) }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span className="grid size-10 shrink-0 place-items-center rounded-md bg-secondary text-secondary-foreground">
                          <GraduationCap className="size-5" />
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-primary">
                          Abrir <ArrowRight className="size-4" />
                        </span>
                      </div>
                      <h3 className="mt-5 text-lg font-extrabold">
                        {curriculum.name}
                      </h3>
                      {curriculum.isFavorite && (
                        <p className="mt-1 text-xs font-bold text-primary">
                          Planejamento favorito
                        </p>
                      )}
                      {details.length > 0 && (
                        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm">
                          {details.map((detail) => (
                            <div key={detail.label} className="min-w-32">
                              <dt className="text-xs font-bold tracking-[0.08em] text-muted-foreground uppercase">
                                {detail.label}
                              </dt>
                              <dd className="mt-0.5 font-semibold">
                                {detail.value}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      )}
                      <div className="mt-auto flex items-center gap-1.5 border-t border-strong-border/30 pt-4 text-xs font-semibold text-muted-foreground">
                        <Clock3 className="size-3.5" />
                        {curriculumUpdatedAtLabel(curriculum.updatedAt)}
                      </div>
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>
      )}
      {planner.isAuthenticated && planner.curricula.length === 0 && (
        <EmptyState
          title="Nenhum planejamento salvo"
          description="Crie seu primeiro planejamento de currículo para organizar os próximos semestres."
        />
      )}
      {!planner.isAuthenticated && (
        <EmptyState
          title="Comece um rascunho"
          description="Você pode planejar nesta sessão ou importar um currículo para retomar o trabalho depois."
        />
      )}
      <input
        ref={importInputRef}
        className="hidden"
        type="file"
        accept="application/json"
        onChange={handleFile}
      />
      <PlanningImportReviewDialog
        disabled={planner.isDispatching}
        importResult={pendingImport}
        onConfirm={onConfirmImport}
        onOpenChange={(open) => {
          if (!open) onDismissImport()
        }}
      />
      {importError && (
        <Alert className="mt-6" variant="destructive">
          <AlertTitle>Não foi possível importar</AlertTitle>
          <AlertDescription>
            O arquivo não é um currículo válido ou é incompatível com os dados
            atuais.
          </AlertDescription>
        </Alert>
      )}
      {selectionError && (
        <Alert className="mt-6" variant="destructive">
          <AlertTitle>Não foi possível criar o planejamento</AlertTitle>
          <AlertDescription>
            {planner.actionError ?? 'Verifique sua sessão e tente novamente.'}
          </AlertDescription>
        </Alert>
      )}
    </PageContainer>
  )
}
