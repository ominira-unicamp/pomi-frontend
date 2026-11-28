import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { ResponsiveFilterSurface } from './ResponsiveFilterSurface'

function mockDesktop(matches: boolean) {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    () =>
      ({
        matches,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList,
  )
}

describe('ResponsiveFilterSurface', () => {
  it('opens a modal dialog from its desktop trigger', () => {
    mockDesktop(true)
    render(<SurfaceHarness />)

    expect(screen.queryByText('Lista de propriedades')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Abrir filtros' }))

    expect(screen.getByText('Lista de propriedades')).toBeTruthy()
    expect(screen.getByRole('dialog')).toBeTruthy()
  })

  it('uses one bottom sheet on mobile', () => {
    mockDesktop(false)
    render(
      <ResponsiveFilterSurface
        open
        onOpenChange={vi.fn()}
        title="Nenhum filtro"
        trigger={<button>Abrir filtros</button>}
      >
        <p>Lista de propriedades</p>
      </ResponsiveFilterSurface>,
    )

    expect(screen.getByRole('dialog', { name: 'Nenhum filtro' })).toBeTruthy()
  })
})

function SurfaceHarness() {
  const [open, setOpen] = useState(false)
  return (
    <ResponsiveFilterSurface
      open={open}
      onOpenChange={setOpen}
      title="Filtros"
      trigger={<button>Abrir filtros</button>}
    >
      <p>Lista de propriedades</p>
    </ResponsiveFilterSurface>
  )
}
