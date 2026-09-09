import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AutocompleteSelect } from './AutocompleteSelect'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'

describe('AutocompleteSelect', () => {
  it('matches options without requiring accents', () => {
    render(
      <AutocompleteSelect
        ariaLabel="Programa"
        value=""
        options={[
          { value: '1', label: 'Ciência da Computação' },
          { value: '2', label: 'Engenharia Mecânica' },
        ]}
        onValueChange={vi.fn()}
      />,
    )

    const input = screen.getByRole('combobox', { name: 'Programa' })
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'ciencia' } })

    expect(screen.getByText('Ciência da Computação')).toBeTruthy()
    expect(screen.queryByText('Engenharia Mecânica')).toBeNull()
  })

  it('selects an option inside a modal', async () => {
    const onValueChange = vi.fn()
    const onOpenChange = vi.fn()

    render(
      <Dialog open onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle>Selecionar programa</DialogTitle>
          <AutocompleteSelect
            ariaLabel="Programa"
            value=""
            options={[{ value: '1', label: 'Ciência da Computação' }]}
            onValueChange={onValueChange}
          />
        </DialogContent>
      </Dialog>,
    )

    fireEvent.focus(screen.getByRole('combobox', { name: 'Programa' }))
    const option = screen.getByRole('option', {
      name: 'Ciência da Computação',
    })
    await new Promise((resolve) => setTimeout(resolve, 10))
    fireEvent.pointerDown(option)
    fireEvent.click(option)

    expect(onValueChange).toHaveBeenCalledWith('1')
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('scrolls its options inside a modal', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Selecionar programa</DialogTitle>
          <AutocompleteSelect
            ariaLabel="Programa"
            value=""
            options={Array.from({ length: 20 }, (_, index) => ({
              value: String(index),
              label: `Programa ${index}`,
            }))}
            onValueChange={vi.fn()}
          />
        </DialogContent>
      </Dialog>,
    )

    fireEvent.focus(screen.getByRole('combobox', { name: 'Programa' }))
    const list = screen.getByRole('listbox')

    fireEvent.wheel(list, { deltaY: 80 })

    expect(list.scrollTop).toBe(80)
  })
})
