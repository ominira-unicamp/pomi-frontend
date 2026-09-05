import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CourseProfilePanel } from './CourseProfilePanel'

describe('CourseProfilePanel', () => {
  it('shows the profile fields with labels without requiring configuration mode', async () => {
    render(
      <CourseProfilePanel
        profile={{
          id: 1,
          name: 'Estudante',
          catalogId: 10,
          programId: 20,
          specializationId: 30,
          languageId: 40,
          entryYear: 2024,
        }}
        catalogPrograms={[
          {
            id: '50' as never,
            title: 'Computação',
            catalog: { id: '10' as never, year: 2024 },
            program: {
              id: '20' as never,
              code: '42',
              name: 'Ciência da Computação',
            },
            baseBlocks: { mandatory: [], electives: [] },
            specializations: [
              {
                id: '30' as never,
                code: 'AA',
                name: 'Sistemas',
                blocks: { mandatory: [], electives: [] },
              },
            ],
            languages: [
              {
                id: '40' as never,
                name: 'Inglês',
                blocks: { mandatory: [], electives: [] },
              },
            ],
          },
        ]}
        onSave={vi.fn()}
      />,
    )

    expect(
      await screen.findByRole('combobox', { name: 'Catálogo' }),
    ).toBeTruthy()
    expect(screen.getByRole('combobox', { name: 'Programa' })).toBeTruthy()
    expect(screen.getByRole('combobox', { name: 'Habilitação' })).toBeTruthy()
    expect(screen.getByRole('combobox', { name: 'Língua' })).toBeTruthy()
    expect(
      screen
        .getAllByText('Catálogo', { selector: 'label' })
        .some((element) => element.classList.contains('block')),
    ).toBe(true)
    expect(
      screen
        .getAllByText('Programa', { selector: 'label' })
        .some((element) => element.classList.contains('block')),
    ).toBe(true)
    expect(screen.queryByRole('button', { name: 'Configurar' })).toBeNull()
    expect(
      screen.getByRole<HTMLInputElement>('spinbutton', {
        name: 'Ano de ingresso',
      }).value,
    ).toBe('2024')
    const saveButton = screen.getByRole<HTMLButtonElement>('button', {
      name: 'Salvar alterações',
    })
    expect(saveButton.disabled).toBe(true)

    fireEvent.change(
      screen.getByRole('spinbutton', { name: 'Ano de ingresso' }),
      { target: { value: '2025' } },
    )
    expect(saveButton.disabled).toBe(false)
  })
})
