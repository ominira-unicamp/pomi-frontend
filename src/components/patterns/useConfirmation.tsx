import { useCallback, useEffect, useRef, useState } from 'react'
import { ActionBar } from './ActionBar'
import { ResponsiveDialog } from './ResponsiveDialog'
import { Button } from '@/components/ui/button'

type ConfirmationOptions = Readonly<{
  title: string
  description: string
  confirmLabel: string
  destructive?: boolean
}>

export function useConfirmation() {
  const origin = useRef<HTMLElement | null>(null)
  const cancelButton = useRef<HTMLButtonElement>(null)
  const [options, setOptions] = useState<ConfirmationOptions>()
  const resolver = useRef<((confirmed: boolean) => void) | undefined>(undefined)
  const settle = useCallback((confirmed: boolean) => {
    const resolve = resolver.current
    resolver.current = undefined
    setOptions(undefined)
    resolve?.(confirmed)
  }, [])
  useEffect(() => () => resolver.current?.(false), [])
  const confirm = useCallback((next: ConfirmationOptions) => {
    resolver.current?.(false)
    origin.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    setOptions(next)
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve
    })
  }, [])
  const confirmation = options ? (
    <ResponsiveDialog
      open
      onOpenChange={(open) => {
        if (!open) settle(false)
      }}
      title={options.title}
      description={options.description}
      onCloseAutoFocus={(event) => {
        event.preventDefault()
        if (origin.current?.isConnected) origin.current.focus()
      }}
      onOpenAutoFocus={(event) => {
        event.preventDefault()
        cancelButton.current?.focus()
      }}
    >
      <ActionBar className="mt-5">
        <Button
          ref={cancelButton}
          variant="outline"
          onClick={() => settle(false)}
        >
          Continuar aqui
        </Button>
        <Button
          variant={options.destructive ? 'destructive' : 'default'}
          onClick={() => settle(true)}
        >
          {options.confirmLabel}
        </Button>
      </ActionBar>
    </ResponsiveDialog>
  ) : null
  return { request: confirm, dialog: confirmation }
}
