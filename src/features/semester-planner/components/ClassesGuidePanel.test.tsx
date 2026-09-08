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
      meetings={[]}
      selectedClassIds={new Set()}
      classFilterCourseId=""
      classFilterStart=""
      classFilterEnd=""
      classFilterDays={[]}
      guideClassContext={{ courseIds: new Set([1]), prefixes: [] }}
      guideClassContextKey=""
      professorEvaluationSummaries={professorEvaluationSummaries}
      onCourseFilterChange={vi.fn()}
      onStartChange={vi.fn()}
      onEndChange={vi.fn()}
      onDaysChange={vi.fn()}
      onDispatch={vi.fn()}
      onPreview={vi.fn()}
    />,
  )
}

describe('ClassesGuidePanel', () => {
  it('shows the global evaluation summary alongside its professor', () => {
    renderPanel()

    expect(screen.getByText('Ana Silva')).toBeTruthy()
    expect(
      screen.getByText(
        '8 avaliações · Voltaria 4.5 · Justiça 4.2 · Clareza 4.6 · Dificuldade 3.1',
      ),
    ).toBeTruthy()
  })

  it('keeps a professor without a summary selectable', () => {
    renderPanel(new Map())

    expect(screen.queryByText(/8 avaliações/)).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar' }))
    expect(screen.getByRole('button', { name: 'Adicionar' })).toBeTruthy()
  })

  it('lists only guide-eligible disciplines in the discipline filter', () => {
    render(
      <ClassesGuidePanel
        courses={[
          { id: 1, code: 'MC102', name: 'Algoritmos', credits: 6 },
          { id: 2, code: 'MA111', name: 'Cálculo', credits: 6 },
        ]}
        classes={[classItem]}
        meetings={[]}
        selectedClassIds={new Set()}
        classFilterCourseId=""
        classFilterStart=""
        classFilterEnd=""
        classFilterDays={[]}
        guideClassContext={{ courseIds: new Set([1]), prefixes: [] }}
        guideClassContextKey="eligible-course-1"
        professorEvaluationSummaries={new Map()}
        onCourseFilterChange={vi.fn()}
        onStartChange={vi.fn()}
        onEndChange={vi.fn()}
        onDaysChange={vi.fn()}
        onDispatch={vi.fn()}
        onPreview={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Disciplina' }))
    fireEvent.focus(screen.getByRole('combobox', { name: 'Filtrar turmas por disciplina' }))

    expect(screen.getByText('MC102 — Algoritmos')).toBeTruthy()
    expect(screen.queryByText('MA111 — Cálculo')).toBeNull()
  })
})
