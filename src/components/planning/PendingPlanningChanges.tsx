import { useState } from 'react'
import { useBlocker, useRouter } from '@tanstack/react-router'
import { Button } from '../ui/button'
import { ResponsiveDialog } from '../patterns/ResponsiveDialog'

function PlanningChangesBlocker({
  pending,
  flush,
  discard,
}: {
  pending: boolean
  flush: () => Promise<boolean>
  discard: () => void
}) {
  const [saving, setSaving] = useState(false)
  const [failed, setFailed] = useState(false)
  const blocker = useBlocker({
    shouldBlockFn: () => pending,
    enableBeforeUnload: pending,
    withResolver: true,
  })
  return (
    <ResponsiveDialog
      open={blocker.status === 'blocked'}
      onOpenChange={(open) => {
        if (!open && !saving) blocker.reset?.()
      }}
      title="Alterações não salvas"
      description="Você tem alterações pendentes. Uma gravação já enviada ainda pode concluir mesmo se você sair."
    >
      {failed && (
        <p role="alert" className="mb-3 text-sm text-destructive">
          Não foi possível salvar. Continue editando ou tente novamente.
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          disabled={saving}
          onClick={() => blocker.reset?.()}
        >
          Continuar editando
        </Button>
        <Button
          disabled={saving}
          onClick={() => {
            setSaving(true)
            setFailed(false)
            void flush()
              .then((saved) => {
                if (saved) blocker.proceed?.()
                else setFailed(true)
              })
              .catch(() => setFailed(true))
              .finally(() => setSaving(false))
          }}
        >
          Salvar e sair
        </Button>
        <Button
          variant="outline"
          disabled={saving}
          onClick={() => {
            discard()
            blocker.proceed?.()
          }}
        >
          Sair sem esperar
        </Button>
      </div>
    </ResponsiveDialog>
  )
}

export function PendingPlanningChanges(
  props: Parameters<typeof PlanningChangesBlocker>[0],
) {
  const router = useRouter({ warn: false }) as
    | ReturnType<typeof useRouter>
    | undefined
  return router ? <PlanningChangesBlocker {...props} /> : null
}
