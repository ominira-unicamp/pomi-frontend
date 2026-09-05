import {
  Download,
  MoreHorizontal,
  Pencil,
  Save,
  Trash2,
  Upload,
} from 'lucide-react'
import type { ChangeEvent, RefObject } from 'react'
import type { GuideMode, StudyPeriod } from '@pomi/planner-domain/semester'

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

export function SemesterPlanningHeader({
  name,
  planningId,
  activePlanId,
  studyPeriodId,
  studyPeriodLocked,
  studyPeriods,
  guideMode,
  isSaving,
  importInputRef,
  onPeriodChange,
  onGuideModeChange,
  onConfigureGuide,
  onOpenSaveDraft,
  onRename,
  onExport,
  onImport,
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
  importInputRef: RefObject<HTMLInputElement | null>
  onPeriodChange: (periodId: number) => void
  onGuideModeChange: (mode: GuideMode) => void
  onConfigureGuide: () => void
  onOpenSaveDraft: () => void
  onRename: () => void
  onExport: () => void
  onImport: (file?: File) => void
  onRemove: () => void
}) {
  const selectedStudyPeriod = studyPeriods.find(
    (period) => period.id === studyPeriodId,
  )
  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    onImport(event.target.files?.[0])
  }

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
                {selectedStudyPeriod ? studyPeriodLabel(selectedStudyPeriod) : ''}
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
              <DropdownMenuItem onSelect={onExport}>
                <Download className="size-4" /> Exportar
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => importInputRef.current?.click()}>
                <Upload className="size-4" /> Importar
              </DropdownMenuItem>
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
          <input
            ref={importInputRef}
            className="hidden"
            type="file"
            accept="application/json,.json"
            onChange={handleImport}
          />
        </>
      }
    />
  )
}
