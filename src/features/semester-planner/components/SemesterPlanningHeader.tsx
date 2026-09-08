import { MoreHorizontal, Pencil, Save, Share2, Trash2 } from 'lucide-react'
import type { GuideMode, StudyPeriod } from '@pomi/planner-domain/semester'

import type { SemesterPlanningVisibility } from '@/features/semester-planner/data/semesterPlanningApi'
import { PageHeader } from '@/components/PageLayout'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { mostRecentStudyPeriodsFirst } from '@/features/student/data/studyPeriodOrdering'
import { studyPeriodLabel } from '@/features/student/data/studyPeriod'

function visibilityLabel(visibility: SemesterPlanningVisibility) {
  if (visibility === 'FRIENDS') return 'Amigos'
  if (visibility === 'PUBLIC') return 'Público'
  return 'Privado'
}

export function SemesterPlanningHeader({
  name,
  planningId,
  activePlanId,
  studyPeriodId,
  studyPeriodLocked,
  studyPeriods,
  guideMode,
  isSaving,
  onPeriodChange,
  onGuideModeChange,
  onConfigureGuide,
  visibility,
  onConfigureVisibility,
  onOpenSaveDraft,
  onRename,
  onRemove,
}: {
  name: string
  planningId: string
  activePlanId?: number
  studyPeriodId?: number
  studyPeriodLocked: boolean
  studyPeriods: ReadonlyArray<StudyPeriod>
  guideMode: GuideMode
  isSaving: boolean
  onPeriodChange: (periodId: number) => void
  onGuideModeChange: (mode: GuideMode) => void
  onConfigureGuide: () => void
  visibility: SemesterPlanningVisibility
  onConfigureVisibility: () => void
  onOpenSaveDraft: () => void
  onRename: () => void
  onRemove: () => void
}) {
  const selectedStudyPeriod = studyPeriods.find(
    (period) => period.id === studyPeriodId,
  )
  return (
    <PageHeader
      compact
      eyebrow="Planejamento acadêmico"
      title={name}
      description="Monte seu horário a partir das turmas oferecidas."
      actions={
        <>
          {studyPeriodLocked ? (
            <div className="flex h-10 items-center gap-2 text-sm font-bold text-muted-foreground">
              <span className="text-xs tracking-[0.08em] uppercase">
                Período
              </span>
              <span className="text-foreground">
                {selectedStudyPeriod
                  ? studyPeriodLabel(selectedStudyPeriod)
                  : ''}
              </span>
            </div>
          ) : (
            <select
              aria-label="Período letivo"
              className="h-10 rounded-md border-2 border-strong-border bg-background px-3 font-semibold"
              value={studyPeriodId ?? ''}
              onChange={(event) => onPeriodChange(Number(event.target.value))}
            >
              {mostRecentStudyPeriodsFirst(studyPeriods).map((period) => (
                <option key={period.id} value={period.id}>
                  {studyPeriodLabel(period)}
                </option>
              ))}
            </select>
          )}
          {planningId === 'rascunho' && (
            <Button
              variant="outline"
              onClick={onOpenSaveDraft}
              disabled={isSaving || !studyPeriodId}
            >
              <Save className="size-4" /> Salvar
            </Button>
          )}
          <select
            aria-label="Modo do guia curricular"
            className="h-10 rounded-md border-2 border-strong-border bg-background px-3 font-semibold"
            value={guideMode}
            onChange={(event) =>
              onGuideModeChange(event.target.value as GuideMode)
            }
          >
            <option value="curriculum">Currículo</option>
            <option value="program">Programa</option>
            <option value="none">Nenhum</option>
          </select>
          {guideMode !== 'none' && (
            <Button variant="outline" onClick={onConfigureGuide}>
              Configurar
            </Button>
          )}
          {activePlanId && (
            <Button
              variant="outline"
              disabled={isSaving}
              title="Alterar a publicidade do planejamento"
              onClick={onConfigureVisibility}
            >
              <Share2 className="size-4" /> {visibilityLabel(visibility)}
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="size-4" /> Ações
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {activePlanId && (
                <DropdownMenuItem onSelect={onRename}>
                  <Pencil className="size-4" /> Editar nome
                </DropdownMenuItem>
              )}
              {activePlanId && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onSelect={onRemove}
                  >
                    <Trash2 className="size-4" /> Apagar planejamento
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      }
    />
  )
}
