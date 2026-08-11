import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

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
import { Input } from '@/components/ui/input'

export function RenameCurriculumDialog({
  disabled,
  initialName,
  onRename,
  onOpenChange,
  open,
}: {
  disabled: boolean
  initialName: string
  onRename: (name: string) => Promise<boolean>
  onOpenChange: (open: boolean) => void
  open: boolean
}) {
  const [name, setName] = useState(initialName)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!open) return
    setName(initialName)
    setFailed(false)
  }, [initialName, open])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const succeeded = await onRename(name.trim())
    setFailed(!succeeded)
    if (succeeded) onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar nome do planejamento</DialogTitle>
          <DialogDescription>
            Escolha um nome para identificar este planejamento.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-3" onSubmit={(event) => void submit(event)}>
          <label className="space-y-2 text-sm font-bold">
            <span>Nome</span>
            <Input
              autoFocus
              disabled={disabled}
              maxLength={120}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          {failed && (
            <p className="text-sm font-bold text-destructive">
              Não foi possível alterar o nome. Tente novamente.
            </p>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <ActionTooltip content="Feche sem alterar o nome do currículo.">
                <Button variant="outline">Cancelar</Button>
              </ActionTooltip>
            </DialogClose>
            <ActionTooltip content="Salve o novo nome deste currículo.">
              <Button disabled={disabled || !name.trim()} type="submit">
                Salvar nome
              </Button>
            </ActionTooltip>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function DeleteCurriculumDialog({
  disabled,
  onDelete,
  onOpenChange,
  open,
}: {
  disabled: boolean
  onDelete: () => Promise<boolean>
  onOpenChange: (open: boolean) => void
  open: boolean
}) {
  const [failed, setFailed] = useState(false)

  const submit = async () => {
    const succeeded = await onDelete()
    setFailed(!succeeded)
    if (succeeded) onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apagar planejamento?</DialogTitle>
          <DialogDescription>
            Esta ação remove permanentemente este planejamento da sua conta.
          </DialogDescription>
        </DialogHeader>
        {failed && (
          <p className="text-sm font-bold text-destructive">
            Não foi possível apagar o planejamento. Tente novamente.
          </p>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <ActionTooltip content="Feche sem apagar o currículo.">
              <Button variant="outline">Cancelar</Button>
            </ActionTooltip>
          </DialogClose>
          <ActionTooltip content="Confirme a exclusão permanente deste currículo.">
            <Button
              disabled={disabled}
              variant="destructive"
              onClick={() => void submit()}
            >
              Apagar planejamento
            </Button>
          </ActionTooltip>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
