import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CourseSearchDialog } from './CourseSearchDialog'
import type { Course } from '@pomi/planner-domain/curriculum'

const courses = Array.from({ length: 6 }, (_, index) => ({
  id: `course-${index + 1}`,
  code: `MC${String(index + 1).padStart(3, '0')}`,
  name: `Disciplina ${index + 1}`,
  credits: 4,
})) as Array<Course>

describe('CourseSearchDialog', () => {
  it('shows five rows per page and keeps the table five rows tall', () => {
    render(
      <CourseSearchDialog
        open
        onOpenChange={vi.fn()}
        courses={courses}
        excludedCourseIds={new Set()}
        description="Escolha uma disciplina."
        searchLabel="Disciplina"
        disabled={false}
        onAdd={vi.fn(() => Promise.resolve(true))}
      />,
    )

    const table = screen.getByRole('table')
    expect(table.querySelectorAll('tbody tr')).toHaveLength(5)
    expect(screen.getByText('1 / 2')).toBeTruthy()
    expect(
      screen.getByRole('button', { name: /Anterior/ }).hasAttribute('disabled'),
    ).toBe(true)
    expect(
      screen.getByRole('button', { name: /Próxima/ }).hasAttribute('disabled'),
    ).toBe(false)
  })

  it('keeps five body rows when fewer disciplines match', () => {
    render(
      <CourseSearchDialog
        open
        onOpenChange={vi.fn()}
        courses={courses.slice(0, 2)}
        excludedCourseIds={new Set()}
        description="Escolha uma disciplina."
        searchLabel="Disciplina"
        disabled={false}
        onAdd={vi.fn(() => Promise.resolve(true))}
      />,
    )

    const table = screen.getByRole('table')
    expect(table.querySelectorAll('tbody tr')).toHaveLength(5)
    expect(
      screen.getByRole('button', { name: /Anterior/ }).hasAttribute('disabled'),
    ).toBe(true)
    expect(
      screen.getByRole('button', { name: /Próxima/ }).hasAttribute('disabled'),
    ).toBe(true)
  })

  it('shows courses already in the plan without allowing duplicates', () => {
    render(
      <CourseSearchDialog
        open
        onOpenChange={vi.fn()}
        courses={courses.slice(0, 2)}
        excludedCourseIds={new Set([courses[0].id])}
        description="Escolha uma disciplina."
        searchLabel="Disciplina"
        disabled={false}
        onAdd={vi.fn(() => Promise.resolve(true))}
      />,
    )

    expect(screen.getByText('Já adicionada')).toBeTruthy()
    expect(
      screen
        .getByRole('button', {
          name: /Selecionar MC001, Disciplina 1/,
        })
        .getAttribute('aria-disabled'),
    ).toBe('true')
    expect(
      screen
        .getByRole('button', { name: 'Adicionar' })
        .hasAttribute('disabled'),
    ).toBe(true)
  })
})
