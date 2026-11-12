import { LogIn } from 'lucide-react'
import { InlineMessage } from '@/components/patterns/InlineMessage'

import { ResponsiveDialog } from '@/components/patterns/ResponsiveDialog'
import { Button } from '@/components/ui/button'

export function SaveDraftDialog({
  open,
  onOpenChange,
  onLogin,
  error,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  error?: string
  onLogin: () => void
}) {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Salve este planejamento"
      description="Para salvar o planejamento na sua conta e acessá-lo depois, entre ou crie uma conta."
      bodyClassName="flex flex-col items-end gap-3"
    >
      {error && <InlineMessage variant="error">{error}</InlineMessage>}
      <Button onClick={onLogin}>
        <LogIn /> Entrar e salvar
      </Button>
    </ResponsiveDialog>
  )
}
