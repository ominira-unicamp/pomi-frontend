import { LogIn } from 'lucide-react'

import { ResponsiveDialog } from '@/components/patterns/ResponsiveDialog'
import { Button } from '@/components/ui/button'

export function SaveDraftDialog({
  open,
  onOpenChange,
  onLogin,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLogin: () => void
}) {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Salve este planejamento"
      description="Para salvar o planejamento na sua conta e acessá-lo depois, entre ou crie uma conta."
      bodyClassName="flex justify-end"
    >
      <Button onClick={onLogin}>
        <LogIn /> Entrar e salvar
      </Button>
    </ResponsiveDialog>
  )
}
