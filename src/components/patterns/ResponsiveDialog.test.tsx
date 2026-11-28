import { act, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { ResponsiveDialog } from './ResponsiveDialog'

function mockLayout(initialMatches: boolean) {
  let matches = initialMatches
  let listener: (() => void) | undefined
  const media = {
    get matches() {
      return matches
    },
    media: '(min-width: 640px)',
    onchange: null,
    addEventListener: vi.fn((_event: string, nextListener: () => void) => {
      listener = nextListener
    }),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as unknown as MediaQueryList
  vi.mocked(window.matchMedia).mockReturnValue(media)

  return {
    setMatches(nextMatches: boolean) {
      matches = nextMatches
      act(() => listener?.())
    },
  }
}

describe('ResponsiveDialog', () => {
  it('opens one centered dialog from its desktop trigger', () => {
    mockLayout(true)
    render(<Harness />)

    fireEvent.click(screen.getByRole('button', { name: 'Abrir detalhes' }))

    const dialog = screen.getByRole('dialog', { name: 'Detalhes' })
    expect(dialog.className).toContain('top-1/2')
    expect(screen.getAllByText('Conteúdo compartilhado')).toHaveLength(1)
  })

  it('uses an accessible bottom sheet on mobile', () => {
    mockLayout(false)
    const onOpenChange = vi.fn()
    render(
      <ResponsiveDialog
        open
        onOpenChange={onOpenChange}
        title="Detalhes"
        description="Descrição"
      >
        <p>Conteúdo compartilhado</p>
      </ResponsiveDialog>,
    )

    const dialog = screen.getByRole('dialog', { name: 'Detalhes' })
    expect(dialog.className).toContain('bottom-0')
    expect(dialog.className).toContain('slide-in-from-bottom')
    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('switches surfaces when the layout media query changes', () => {
    const layout = mockLayout(false)
    render(
      <ResponsiveDialog open onOpenChange={vi.fn()} title="Detalhes">
        <p>Conteúdo compartilhado</p>
      </ResponsiveDialog>,
    )

    expect(screen.getByRole('dialog').className).toContain('bottom-0')
    layout.setMatches(true)
    expect(screen.getByRole('dialog').className).toContain('top-1/2')
  })
})

function Harness() {
  const [open, setOpen] = useState(false)
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      title="Detalhes"
      description="Descrição"
      trigger={<button>Abrir detalhes</button>}
    >
      <p>Conteúdo compartilhado</p>
    </ResponsiveDialog>
  )
}
