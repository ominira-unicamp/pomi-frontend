import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import {
  InitialAcademicSelectionFields,
} from './InitialAcademicSelectionFields'
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
      specializations: [],
      languages: [],
    },
    {
      id: 'full' as CatalogProgramId,
      title: 'Com opções',
      catalog: { id: 'catalog' as never, year: 2025 },
      program: { id: 'program-2' as never, code: '20', name: 'Com opções' },
      baseBlocks: { mandatory: [], electives: [] },
      specializations: [
        { id: 'specialization' as never, code: 'H', name: 'Habilitação', blocks: { mandatory: [], electives: [] } },
      ],
      languages: [
        { id: 'language' as never, name: 'Inglês', blocks: { mandatory: [], electives: [] } },
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
        value={{ catalogId: 'catalog', catalogProgramId: 'plain', specializationId: '', languageId: '' }}
        onChange={onChange}
      />,
    )

    expect(screen.queryByRole('combobox', { name: 'Habilitação inicial' })).toBeNull()
    expect(screen.queryByRole('combobox', { name: 'Língua inicial' })).toBeNull()

    rerender(
      <InitialAcademicSelectionFields
        staticData={staticData}
        value={{ catalogId: 'catalog', catalogProgramId: 'full', specializationId: '', languageId: '' }}
        onChange={onChange}
      />,
    )

    expect(screen.getByRole('combobox', { name: 'Habilitação inicial' })).toBeTruthy()
    expect(screen.getByRole('combobox', { name: 'Língua inicial' })).toBeTruthy()
  })

  it('clears dependent values when the catalog changes', () => {
    const onChange = vi.fn()
    render(
      <InitialAcademicSelectionFields
        staticData={staticData}
        value={{ catalogId: 'catalog', catalogProgramId: 'full', specializationId: 'specialization', languageId: 'language' }}
        onChange={onChange}
      />,
    )

    fireEvent.change(screen.getByRole('combobox', { name: 'Catálogo inicial' }), {
      target: { value: '' },
    })
    expect(onChange).toHaveBeenCalledWith({
      catalogId: '',
      catalogProgramId: '',
      specializationId: '',
      languageId: '',
    })
  })
})
