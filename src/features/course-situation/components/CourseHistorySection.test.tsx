import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CourseHistorySection } from './CourseHistorySection'
import type { StudentCourseAttempt } from '@/features/student/data/studentApi'

vi.mock('./CourseAttemptRow', () => ({
  CourseAttemptRow: ({ attempt }: { attempt: StudentCourseAttempt }) => (
    <p>{attempt.course.name}</p>
  ),
}))
const props = {
  groups: [
    {
      key: '2026',
      label: '2026 · 1º semestre',
      attempts: [
        {
          id: 1,
          status: 'SUFFICIENT',
          course: { code: 'MC102', name: 'Algoritmos' },
        } as StudentCourseAttempt,
      ],
    },
    {
      key: '2025',
      label: '2025 · 2º semestre',
      attempts: [
        {
          id: 2,
          status: 'DROPPED',
          course: { code: 'MA111', name: 'Cálculo I' },
        } as StudentCourseAttempt,
      ],
    },
  ],
  fileInputRef: { current: null },
  importing: false,
  absenceCount: () => 0,
  onFileChange: vi.fn(),
  onNewAttempt: vi.fn(),
  onOpenAbsences: vi.fn(),
  onEvaluate: vi.fn(),
  onEdit: vi.fn(),
  onRemove: vi.fn(),
  onLambdaImport: vi.fn(),
}
describe('history consultation', () => {
  it('opens only the newest period and finds accent-insensitive matches in collapsed periods', () => {
    render(<CourseHistorySection {...props} />)
    expect(screen.getByText('Algoritmos')).toBeTruthy()
    expect(screen.queryByText('Cálculo I')).toBeNull()
    fireEvent.change(screen.getByLabelText('Buscar disciplina'), {
      target: { value: 'calculo' },
    })
    expect(screen.getByText('Cálculo I')).toBeTruthy()
    expect(screen.queryByText('Algoritmos')).toBeNull()
    fireEvent.change(screen.getByLabelText('Buscar disciplina'), {
      target: { value: '' },
    })
    expect(screen.queryByText('Cálculo I')).toBeNull()
  })
  it('expands and collapses all periods with semantic controls', () => {
    render(<CourseHistorySection {...props} />)
    fireEvent.click(screen.getByRole('button', { name: 'Expandir todos' }))
    expect(screen.getByText('Cálculo I')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Recolher todos' }))
    expect(screen.queryByText('Algoritmos')).toBeNull()
    expect(
      screen
        .getByRole('button', { name: /2026/ })
        .getAttribute('aria-expanded'),
    ).toBe('false')
  })
})
