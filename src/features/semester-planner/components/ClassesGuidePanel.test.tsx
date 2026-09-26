import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ClassesGuidePanel } from '@/features/semester-planner/components/ClassesGuidePanel'

const classItem = {
  id: 10,
  code: 'A',
  courseId: 1,
  courseCode: 'MC102',
  professors: [{ id: 3, name: 'Ana Silva' }],
} as const

function renderPanel(
  professorEvaluationSummaries = new Map([
    [
      3,
      {
        professor: { id: 3, name: 'Ana Silva' },
        responseCount: 8,
        wouldTakeAgain: 4.5,
        fairness: 4.2,
        clarity: 4.6,
        difficulty: 3.1,
      },
    ],
  ]),
) {
  return render(
    <ClassesGuidePanel
      courses={[{ id: 1, code: 'MC102', name: 'Algoritmos', credits: 6 }]}
      classes={[classItem]}
      allClasses={[classItem]}
      meetings={[]}
      selectedClassIds={new Set()}
      professorEvaluationSummaries={professorEvaluationSummaries}
      onDispatch={vi.fn()}
      onPreview={vi.fn()}
    />,
  )
}

describe('ClassesGuidePanel', () => {
  it('shows the global evaluation summary alongside its professor', () => {
    renderPanel()

    expect(screen.getByText('Ana Silva')).toBeTruthy()
    expect(screen.getByText('8 avaliações · Voltaria 4.5')).toBeTruthy()
    expect(
      screen.getByText('Justiça 4.2 · Clareza 4.6 · Dificuldade 3.1'),
    ).toBeTruthy()
  })

  it('keeps a professor without a summary selectable', () => {
    renderPanel(new Map())

    expect(screen.queryByText(/8 avaliações/)).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar' }))
    expect(screen.getByRole('button', { name: 'Adicionar' })).toBeTruthy()
  })

  it('renders only the classes received from the filter toolbar', () => {
    render(
      <ClassesGuidePanel
        courses={[
          { id: 1, code: 'MC102', name: 'Algoritmos', credits: 6 },
          { id: 2, code: 'MA111', name: 'Cálculo', credits: 6 },
        ]}
        classes={[classItem]}
        allClasses={[classItem]}
        meetings={[]}
        selectedClassIds={new Set()}
        professorEvaluationSummaries={new Map()}
        onDispatch={vi.fn()}
        onPreview={vi.fn()}
      />,
    )

    expect(screen.getByText(/MC102 · Turma/)).toBeTruthy()
    expect(screen.queryByText(/MA111 · Turma/)).toBeNull()
    expect(screen.queryByText(/Página 1 de 1/)).toBeNull()
  })

  it('groups rooms from meetings with the same day and time', () => {
    render(
      <ClassesGuidePanel
        courses={[{ id: 1, code: 'MC102', name: 'Algoritmos', credits: 6 }]}
        classes={[classItem]}
        allClasses={[classItem]}
        meetings={[
          {
            id: 1,
            classId: 10,
            dayOfWeek: 'MONDAY',
            start: '10:00',
            end: '12:00',
            roomCode: 'PB01',
          },
          {
            id: 2,
            classId: 10,
            dayOfWeek: 'MONDAY',
            start: '10:00',
            end: '12:00',
            roomCode: 'PB02',
          },
        ]}
        selectedClassIds={new Set()}
        professorEvaluationSummaries={new Map()}
        onDispatch={vi.fn()}
        onPreview={vi.fn()}
      />,
    )

    expect(screen.getByText('Seg 10:00–12:00 · PB01, PB02')).toBeTruthy()
  })
})
