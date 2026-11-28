import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useConfirmation } from './useConfirmation'
import { Button } from '@/components/ui/button'

function Harness({ onResult }: { onResult: (confirmed: boolean) => void }) {
  const { request, dialog } = useConfirmation()
  return (
    <>
      <Button
        onClick={async () =>
          onResult(
            await request({
              title: 'Excluir termo?',
              description: 'A exclusão afeta toda a comunidade.',
              confirmLabel: 'Excluir',
              destructive: true,
            }),
          )
        }
      >
        Abrir confirmação
      </Button>
      {dialog}
    </>
  )
}

describe('shared confirmation', () => {
  it('focuses the safe action, cancels and restores the initiating focus', async () => {
    const onResult = vi.fn()
    render(<Harness onResult={onResult} />)
    const trigger = screen.getByRole('button', { name: 'Abrir confirmação' })
    trigger.focus()
    fireEvent.click(trigger)
    const cancel = await screen.findByRole('button', { name: 'Continuar aqui' })
    await waitFor(() => expect(document.activeElement).toBe(cancel))
    fireEvent.click(cancel)
    await waitFor(() => expect(onResult).toHaveBeenCalledWith(false))
    await waitFor(() => expect(document.activeElement).toBe(trigger))
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('requires an explicit destructive action and resolves confirmation once', async () => {
    const onResult = vi.fn()
    render(<Harness onResult={onResult} />)
    fireEvent.click(screen.getByRole('button', { name: 'Abrir confirmação' }))
    expect(
      await screen.findByRole('dialog', { name: 'Excluir termo?' }),
    ).toBeTruthy()
    expect(onResult).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }))
    await waitFor(() => expect(onResult).toHaveBeenCalledExactlyOnceWith(true))
  })

  it('keeps the operation cancelled when the dialog is dismissed', async () => {
    const onResult = vi.fn()
    render(<Harness onResult={onResult} />)
    fireEvent.click(screen.getByRole('button', { name: 'Abrir confirmação' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Fechar' }))
    await waitFor(() => expect(onResult).toHaveBeenCalledExactlyOnceWith(false))
  })
})
