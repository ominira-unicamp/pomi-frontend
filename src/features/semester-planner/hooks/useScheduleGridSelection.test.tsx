import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useScheduleGridSelection } from '@/features/semester-planner/hooks/useScheduleGridSelection'

describe('useScheduleGridSelection', () => {
  it('leaves touch gestures available for native scrolling without changing filters', () => {
    const onFilterChange = vi.fn()
    const setPointerCapture = vi.fn()
    const { result } = renderHook(() =>
      useScheduleGridSelection({
        enabled: true,
        filterDays: [],
        filterStart: '',
        filterEnd: '',
        onFilterChange,
      }),
    )
    const element = document.createElement('div')
    element.setPointerCapture = setPointerCapture
    Object.defineProperty(result.current.ref, 'current', { value: element })
    const event = {
      button: 0,
      pointerType: 'touch',
      pointerId: 1,
      clientX: 100,
      clientY: 100,
      currentTarget: element,
    } as never

    act(() => result.current.onPointerDown(event))
    act(() => result.current.onPointerMove(event))
    act(() => result.current.onPointerUp(event))

    expect(setPointerCapture).not.toHaveBeenCalled()
    expect(result.current.isDragging).toBe(false)
    expect(onFilterChange).not.toHaveBeenCalled()
  })

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
    act(() =>
      result.current.onPointerCancel({
        currentTarget: {
          hasPointerCapture: () => false,
        },
      } as never),
    )
    expect(result.current.isDragging).toBe(false)
  })
})
