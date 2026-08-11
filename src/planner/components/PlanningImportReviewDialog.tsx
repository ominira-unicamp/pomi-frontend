import type { ResolvedPlanningImport } from '@/planner/domain/planningTransfer'
import { Button } from '@/components/ui/button'
import { ActionTooltip } from '@/planner/components/ActionTooltip'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function PlanningImportReviewDialog({
  disabled,
  importResult,
  onConfirm,
  onOpenChange,
}: {
  disabled: boolean
  importResult?: ResolvedPlanningImport
  onConfirm: () => void
  onOpenChange: (open: boolean) => void
}) {
  const courseCount = importResult
    ? importResult.data.periods.reduce(
        (total, period) => total + period.courses.length,
        importResult.data.unallocatedCourses?.length ?? 0,
      )
    : 0
  return (
    <Dialog open={Boolean(importResult)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Revisar importação</DialogTitle>
          <DialogDescription>
            O currículo atual será substituído somente depois da confirmação.
          </DialogDescription>
        </DialogHeader>
        {importResult && (
          <div className="space-y-4 text-sm">
            <p>
              {importResult.data.periods.length} semestres e {courseCount}{' '}
              disciplinas serão importados.
            </p>
            {importResult.name && (
              <p>
                Nome do planejamento: <strong>{importResult.name}</strong>
              </p>
            )}
            {importResult.issues.length > 0 && (
              <div className="rounded-md border-2 border-border bg-muted/45 p-3">
                <p className="mb-2 font-bold">Ajustes necessários</p>
                <ul className="list-disc space-y-1 pl-5">
                  {importResult.issues.map((issue, index) => (
                    <li key={`${issue.type}-${index}`}>{issue.message}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-muted-foreground">
              Disciplinas concluídas não fazem parte da importação.
            </p>
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <ActionTooltip content="Feche sem importar o currículo selecionado.">
              <Button variant="outline">Cancelar</Button>
            </ActionTooltip>
          </DialogClose>
          <ActionTooltip content="Confirme a importação deste currículo.">
            <Button disabled={disabled} onClick={onConfirm}>
              Importar currículo
            </Button>
          </ActionTooltip>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
