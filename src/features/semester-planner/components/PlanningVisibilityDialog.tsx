import type { SemesterPlanningVisibility } from '@/features/semester-planner/data/semesterPlanningApi'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const visibilityOptions: ReadonlyArray<{
  value: SemesterPlanningVisibility
  label: string
  description: string
}> = [
  {
    value: 'PRIVATE',
    label: 'Privado',
    description: 'Somente você pode visualizar este planejamento.',
  },
  {
    value: 'FRIENDS',
    label: 'Amigos',
    description: 'Apenas seus amigos podem visualizar este planejamento.',
  },
  {
    value: 'PUBLIC',
    label: 'Público',
    description: 'Qualquer pessoa com o link pode visualizar este planejamento.',
  },
]

export function PlanningVisibilityDialog({
  open,
  value,
  isSaving,
  onOpenChange,
  onValueChange,
  onSave,
}: {
  open: boolean
  value: SemesterPlanningVisibility
  isSaving: boolean
  onOpenChange: (open: boolean) => void
  onValueChange: (value: SemesterPlanningVisibility) => void
  onSave: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurar publicidade</DialogTitle>
          <DialogDescription>
            Escolha quem poderá visualizar este planejamento de semestre.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2" role="radiogroup" aria-label="Publicidade">
          {visibilityOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={value === option.value}
              className={`pomi-focus rounded-md border-2 p-3 text-left transition-colors ${
                value === option.value
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:bg-muted'
              }`}
              onClick={() => onValueChange(option.value)}
            >
              <span className="block font-black">{option.label}</span>
              <span className="mt-1 block text-sm text-muted-foreground">
                {option.description}
              </span>
            </button>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button disabled={isSaving} onClick={onSave}>
            Salvar publicidade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
