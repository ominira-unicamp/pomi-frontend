import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { ClassesGuidePanel } from './ClassesGuidePanel'
import { ClassesFilterToolbar } from './ClassesFilterToolbar'
import type { ClassesGuideFilters } from '../hooks/useClassesGuideFilters'

it('explains unmet prerequisites and reservations without blocking class selection', () => {
  const onDispatch = vi.fn()
  const classItem = {
    id: 10,
    code: 'A',
    courseId: 2,
    courseCode: 'MC202',
    professors: [],
    reservationPrograms: [{ id: 20, code: 34, name: 'Computação' }],
  }
  render(
    <ClassesGuidePanel
      courses={[]}
      classes={[classItem]}
      allClasses={[classItem]}
      meetings={[]}
      selectedClassIds={new Set()}
      professorEvaluationSummaries={new Map()}
      onDispatch={onDispatch}
      onPreview={vi.fn()}
      eligibility={{
        prerequisites: new Map([
          [
            2,
            {
              status: 'pending',
              label: 'Pré-requisitos pendentes no histórico',
              alternatives: [[{ label: 'MC102', status: 'pending' }]],
            },
          ],
        ]),
        reservations: new Map([
          [
            10,
            {
              status: 'mismatch',
              label: 'Seu curso não consta nas reservas informadas',
            },
          ],
        ]),
      }}
    />,
  )
  expect(screen.getByText('Pré-requisitos pendentes no histórico')).toBeTruthy()
  expect(screen.getByText('MC102: Pendente no histórico')).toBeTruthy()
  expect(screen.getByText(/34 · Computação/)).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Adicionar' }))
  expect(onDispatch).toHaveBeenCalledWith({ type: 'addClass', classId: 10 })
})

it('omits unavailable academic filters from the filter picker', () => {
  render(
    <ClassesFilterToolbar
      mode="classes"
      filters={{
        timePeriods: [],
        search: '',
        courseId: '',
        start: '',
        end: '',
        days: [],
        withoutConflict: false,
        withoutCompleted: false,
        withoutIncluded: false,
        withoutUnavailable: false,
      }}
      courses={[]}
      guideClassContext={{ courseIds: new Set(), prefixes: [] }}
      onChange={vi.fn()}
      eligibility={{
        prerequisitesReady: false,
        reservationsReady: false,
        prerequisiteHint: 'Histórico indisponível.',
        reservationHint: 'Defina seu curso.',
      }}
    />,
  )
  expect(
    screen.queryByRole('button', { name: 'Pré-requisitos atendidos' }),
  ).toBeNull()
  expect(
    screen.queryByRole('button', { name: 'Reserva contempla meu curso' }),
  ).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Filtros' }))
  expect(screen.queryByText('Pré-requisitos atendidos')).toBeNull()
  expect(screen.queryByText('Reserva contempla meu curso')).toBeNull()
})

it.each(['Pré-requisitos atendidos', 'Reserva contempla meu curso'] as const)(
  'adds and removes %s through the filter picker',
  (label) => {
    function Toolbar() {
      const [filters, setFilters] = useState<ClassesGuideFilters>({
        timePeriods: [],
        search: '',
        courseId: '',
        start: '',
        end: '',
        days: [],
        withoutConflict: false,
        withoutCompleted: false,
        withoutIncluded: false,
        withoutUnavailable: false,
        prerequisitesSatisfied: false,
        reservationMatched: false,
      })
      return (
        <ClassesFilterToolbar
          mode="classes"
          filters={filters}
          courses={[]}
          guideClassContext={{ courseIds: new Set(), prefixes: [] }}
          onChange={(changes) =>
            setFilters((current) => ({ ...current, ...changes }))
          }
          eligibility={{
            prerequisitesReady: true,
            reservationsReady: true,
            prerequisiteHint: 'Pré-requisitos do catálogo.',
            reservationHint: 'Comparação de reservas por curso.',
          }}
        />
      )
    }
    render(<Toolbar />)
    expect(screen.queryByRole('button', { name: label })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Filtros' }))
    fireEvent.click(
      screen.getByRole('button', {
        name: new RegExp(`${label}\\s*Não aplicado`),
      }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Desativado' }))
    expect(screen.getByRole('button', { name: 'Ativado' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Fechar filtros' }))
    expect(
      screen.getByRole('button', { name: `Remover filtro ${label}` }),
    ).toBeTruthy()
    fireEvent.click(
      screen.getByRole('button', { name: `Remover filtro ${label}` }),
    )
    expect(
      screen.queryByRole('button', { name: `Remover filtro ${label}` }),
    ).toBeNull()
    expect(screen.getByRole('button', { name: 'Filtros' })).toBeTruthy()
  },
)
