import { useState } from 'react'
import type { ReactNode } from 'react'

import type { PlannerDispatch } from '@/planner/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function ClearPlanningDialog({
  disabled,
  dispatch,
  onCleared,
  trigger,
}: {
  disabled: boolean
  dispatch: PlannerDispatch
  onCleared: () => void
  trigger?: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const submit = async () => {
    const succeeded = await dispatch({ type: 'clearPlanning' })
    if (succeeded) {
      setOpen(false)
      onCleared()
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" disabled={disabled}>
            Limpar planejamento
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Limpar planejamento?</DialogTitle>
          <DialogDescription>
            Todos os semestres, disciplinas planejadas, concluídas e o início do
            planejamento serão removidos. Catálogo e programa selecionados serão
            preservados.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            variant="destructive"
            disabled={disabled}
            onClick={() => void submit()}
          >
            Limpar planejamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
