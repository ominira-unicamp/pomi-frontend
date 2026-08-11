import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AutocompleteSelect } from './AutocompleteSelect'

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
})
