import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useScheduleGridSelection } from '@/features/semester-planner/hooks/useScheduleGridSelection'

describe('useScheduleGridSelection', () => {
  it('derives the visible selection from schedule filters', () => {
    const { result } = renderHook(() =>
      useScheduleGridSelection({
        enabled: true,
        filterDays: ['MONDAY', 'TUESDAY'],
        filterStart: '08:00',
        filterEnd: '10:00',
        onFilterChange: vi.fn(),
      }),
    )

    expect(result.current.activeSelection).toBeDefined()
    expect(result.current.highlightedDayIndexes).toHaveLength(2)
    act(() => result.current.onPointerCancel({ currentTarget: {
      hasPointerCapture: () => false,
    } } as never))
    expect(result.current.isDragging).toBe(false)
  })
})
