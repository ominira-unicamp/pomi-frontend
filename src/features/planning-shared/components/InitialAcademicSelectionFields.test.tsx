import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { InitialAcademicSelectionFields } from './InitialAcademicSelectionFields'
import type {
  CatalogProgramId,
  CurriculumPlannerStaticData,
} from '@pomi/planner-domain/curriculum'

const staticData: CurriculumPlannerStaticData = {
  courses: [],
  catalogPrograms: [
    {
      id: 'plain' as CatalogProgramId,
      title: 'Sem opções',
      catalog: { id: 'catalog' as never, year: 2025 },
      program: { id: 'program' as never, code: '10', name: 'Sem opções' },
      baseBlocks: { mandatory: [], electives: [] },
      variants: [],
      languages: [],
    },
    {
      id: 'full' as CatalogProgramId,
      title: 'Com opções',
      catalog: { id: 'catalog' as never, year: 2025 },
      program: { id: 'program-2' as never, code: '20', name: 'Com opções' },
      baseBlocks: { mandatory: [], electives: [] },
      variants: [
        {
          id: 'specialization' as never,
          specializationId: 30,
          code: 'H',
          name: 'Opção A',
          blocks: { mandatory: [], electives: [] },
        },
        {
          id: 'specialization-2' as never,
          specializationId: 31,
          code: 'H2',
          name: 'Opção B',
          blocks: { mandatory: [], electives: [] },
        },
      ],
      languages: [
        {
          id: 'language' as never,
          name: 'Inglês',
          blocks: { mandatory: [], electives: [] },
        },
      ],
    },
  ],
}

describe('InitialAcademicSelectionFields', () => {
  it('only exposes specialization and language when the selected program has them', () => {
    const onChange = vi.fn()
    const { rerender } = render(
      <InitialAcademicSelectionFields
        staticData={staticData}
        value={{
          catalogId: 'catalog',
          programId: 'program',
          catalogProgramId: 'plain',
          catalogProgramVariantId: '',
          languageId: '',
        }}
        onChange={onChange}
      />,
    )

    expect(
      screen.queryByRole('combobox', { name: 'Modalidade inicial' }),
    ).toBeNull()
    expect(
      screen.queryByRole('combobox', { name: 'Língua inicial' }),
    ).toBeNull()

    rerender(
      <InitialAcademicSelectionFields
        staticData={staticData}
        value={{
          catalogId: 'catalog',
          programId: 'program-2',
          catalogProgramId: 'full',
          catalogProgramVariantId: '',
          languageId: '',
        }}
        onChange={onChange}
      />,
    )

    expect(
      screen.getByRole('combobox', { name: 'Modalidade inicial' }),
    ).toBeTruthy()
    expect(
      screen.getByRole('combobox', { name: 'Língua inicial' }),
    ).toBeTruthy()
  })

  it('keeps the program when the catalog changes', () => {
    const onChange = vi.fn()
    render(
      <InitialAcademicSelectionFields
        staticData={staticData}
        value={{
          catalogId: 'catalog',
          programId: 'program-2',
          catalogProgramId: 'full',
          catalogProgramVariantId: 'specialization',
          languageId: 'language',
        }}
        onChange={onChange}
      />,
    )

    fireEvent.change(
      screen.getByRole('combobox', { name: 'Catálogo inicial' }),
      {
        target: { value: '' },
      },
    )
    expect(onChange).toHaveBeenCalledWith({
      catalogId: '',
      programId: 'program-2',
      catalogProgramId: '',
      catalogProgramVariantId: '',
      languageId: '',
    })
  })

  it('keeps the catalog when the program changes', async () => {
    const onChange = vi.fn()
    render(
      <InitialAcademicSelectionFields
        staticData={staticData}
        value={{
          catalogId: 'catalog',
          programId: 'program',
          catalogProgramId: 'plain',
          catalogProgramVariantId: '',
          languageId: '',
        }}
        onChange={onChange}
      />,
    )

    fireEvent.focus(screen.getByRole('combobox', { name: 'Programa inicial' }))
    fireEvent.click(await screen.findByText('20 — Com opções'))
    expect(onChange).toHaveBeenCalledWith({
      catalogId: 'catalog',
      programId: 'program-2',
      catalogProgramId: 'full',
      catalogProgramVariantId: '',
      languageId: '',
    })
  })
})
