import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SearchableMultiSelect } from './SearchableMultiSelect'

describe('SearchableMultiSelect', () => {
  it('opens a searchable list and changes the selected values', () => {
    const onChange = vi.fn()
    render(
      <SearchableMultiSelect
        label="Locais"
        options={[
          { value: 1, label: 'Argentina' },
          { value: 2, label: 'Alemanha' },
        ]}
        selected={[]}
        onChange={onChange}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Selecionar locais' }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Buscar Locais' }), {
      target: { value: 'alemanha' },
    })
    expect(screen.getByText('Alemanha')).toBeTruthy()
    expect(screen.queryByText('Argentina')).toBeNull()

    fireEvent.click(screen.getByRole('checkbox', { name: 'Alemanha' }))
    expect(onChange).toHaveBeenCalledWith([2])
  })

  it('closes when the pointer leaves the component', () => {
    render(
      <SearchableMultiSelect
        label="Locais"
        options={[{ value: 1, label: 'Argentina' }]}
        selected={[]}
        onChange={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Selecionar locais' }))
    expect(
      screen.getByRole('dialog', { name: 'Selecionar Locais' }),
    ).toBeTruthy()

    fireEvent.pointerDown(document.body)
    expect(
      screen.queryByRole('dialog', { name: 'Selecionar Locais' }),
    ).toBeNull()
  })
})
