import { Download, LogIn } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function SaveDraftDialog({
  open,
  onOpenChange,
  onExport,
  onLogin,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onExport: () => void
  onLogin: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Salve este planejamento</DialogTitle>
          <DialogDescription>
            Para salvar o planejamento na sua conta e acessá-lo depois, entre
            ou crie uma conta. Você também pode exportar o arquivo e importá-lo
            quando quiser.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onExport}>
            <Download /> Exportar arquivo
          </Button>
          <Button onClick={onLogin}>
            <LogIn /> Entrar e salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
