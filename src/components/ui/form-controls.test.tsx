import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'

import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

function SelectExample() {
  const [value, setValue] = useState('')
  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger aria-label="Semestre">
        <SelectValue placeholder="Escolha" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="first">Primeiro semestre</SelectItem>
        <SelectItem value="second">Segundo semestre</SelectItem>
      </SelectContent>
    </Select>
  )
}

describe('form controls', () => {
  it('selects a Radix option with accessible semantics', () => {
    render(<SelectExample />)

    fireEvent.click(screen.getByRole('combobox', { name: 'Semestre' }))
    fireEvent.click(screen.getByRole('option', { name: 'Segundo semestre' }))

    expect(
      screen.getByRole('combobox', { name: 'Semestre' }).textContent,
    ).toContain('Segundo semestre')
  })

  it('supports checked and disabled checkbox states', () => {
    const view = render(<Checkbox aria-label="Obrigatória" />)
    const checkbox = screen.getByRole('checkbox', { name: 'Obrigatória' })

    fireEvent.click(checkbox)
    expect(checkbox.getAttribute('data-state')).toBe('checked')

    view.rerender(<Checkbox aria-label="Obrigatória" disabled />)
    expect(checkbox.hasAttribute('disabled')).toBe(true)
  })

  it('forwards textarea validation attributes', () => {
    render(<Textarea aria-label="Observação" aria-invalid />)
    expect(
      screen
        .getByRole('textbox', { name: 'Observação' })
        .getAttribute('aria-invalid'),
    ).toBe('true')
  })
})
