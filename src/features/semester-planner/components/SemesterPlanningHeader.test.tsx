import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SemesterPlanningHeader } from '@/features/semester-planner/components/SemesterPlanningHeader'

const periods = [
  {
    id: 1,
    year: 2025,
    yearPeriod: 'SECOND_SEMESTER' as const,
    startDate: '2025-08-01',
  },
  {
    id: 2,
    year: 2026,
    yearPeriod: 'FIRST_SEMESTER' as const,
    startDate: '2026-03-01',
  },
]

function renderHeader(studyPeriodLocked = false, canExport = true) {
  const onExport = vi.fn()
  const onPeriodChange = vi.fn()
  render(
    <SemesterPlanningHeader
      name="Meu semestre"
      planningId="rascunho"
      studyPeriodId={2}
      studyPeriodLocked={studyPeriodLocked}
      studyPeriods={periods}
      guideMode="none"
      isSaving={false}
      onPeriodChange={onPeriodChange}
      onGuideModeChange={vi.fn()}
      onConfigureGuide={vi.fn()}
      visibility="PRIVATE"
      onConfigureVisibility={vi.fn()}
      onOpenSaveDraft={vi.fn()}
      onRename={vi.fn()}
      onRemove={vi.fn()}
      onExport={onExport}
      canExport={canExport}
    />,
  )
  return { onPeriodChange, onExport }
}

describe('SemesterPlanningHeader', () => {
  it('orders periods from most recent and allows changing an unlocked period', () => {
    const { onPeriodChange } = renderHeader()
    const period = screen.getByLabelText('Período letivo')
    expect(period.querySelectorAll('option')[0].textContent).toBe(
      '2026 · 1º semestre',
    )
    fireEvent.change(period, { target: { value: '1' } })
    expect(onPeriodChange).toHaveBeenCalledWith(1)
  })

  it('renders a locked period without an editable field', () => {
    renderHeader(true)
    expect(screen.queryByLabelText('Período letivo')).toBeNull()
    expect(screen.getByText('2026 · 1º semestre')).toBeTruthy()
  })

  it('offers PNG export for a draft', async () => {
    const { onExport } = renderHeader()
    fireEvent.keyDown(screen.getByRole('button', { name: /Ações/ }), {
      key: 'ArrowDown',
    })
    fireEvent.click(
      await screen.findByRole('menuitem', { name: 'Exportar PNG' }),
    )
    expect(onExport).toHaveBeenCalledOnce()
  })

  it('disables export when there are no selected classes', async () => {
    const { onExport } = renderHeader(false, false)
    fireEvent.keyDown(screen.getByRole('button', { name: /Ações/ }), {
      key: 'ArrowDown',
    })
    const action = await screen.findByRole('menuitem', { name: 'Exportar PNG' })
    expect(action.getAttribute('aria-disabled')).toBe('true')
    fireEvent.click(action)
    expect(onExport).not.toHaveBeenCalled()
  })
})
