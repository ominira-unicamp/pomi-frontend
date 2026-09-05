import { useMemo, useRef, useState } from 'react'
import {
  scheduleDays,
  scheduleRowCount,
  scheduleStartHour,
  selectionFromScheduleFilters,
} from '@pomi/planner-domain/semester'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { GridSelection } from '@pomi/planner-domain/semester'

function clampGridIndex(value: number, max: number) {
  return Math.max(0, Math.min(max, value))
}

export function useScheduleGridSelection({
  enabled,
  filterDays,
  filterStart,
  filterEnd,
  onFilterChange,
}: {
  enabled: boolean
  filterDays: ReadonlyArray<string>
  filterStart: string
  filterEnd: string
  onFilterChange: (filters: {
    days: ReadonlyArray<string>
    start: string
    end: string
  }) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [draggedSelection, setDraggedSelection] = useState<GridSelection>()
  const [isDragging, setIsDragging] = useState(false)
  const filterSelection = useMemo(
    () => selectionFromScheduleFilters(filterDays, filterStart, filterEnd),
    [filterDays, filterEnd, filterStart],
  )
  const activeSelection = draggedSelection ?? filterSelection
  const highlightedDayIndexes = draggedSelection
    ? Array.from(
        { length: draggedSelection.endDay - draggedSelection.startDay + 1 },
        (_, index) => draggedSelection.startDay + index,
      )
    : filterDays.length
      ? filterDays
          .map((day) => scheduleDays.findIndex(([value]) => value === day))
          .filter((index) => index >= 0)
      : activeSelection
        ? Array.from({ length: scheduleDays.length }, (_, index) => index)
        : []

  const gridPoint = (event: ReactPointerEvent<HTMLDivElement>) => {
    const element = ref.current
    if (!element) return undefined
    const rect = element.getBoundingClientRect()
    return {
      day: clampGridIndex(
        Math.floor(
          ((event.clientX - rect.left) / rect.width) * scheduleDays.length,
        ),
        scheduleDays.length - 1,
      ),
      row: clampGridIndex(
        Math.floor(
          ((event.clientY - rect.top) / rect.height) * scheduleRowCount,
        ),
        scheduleRowCount - 1,
      ),
    }
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!enabled || event.button !== 0) return
    const point = gridPoint(event)
    if (!point) return
    event.currentTarget.setPointerCapture(event.pointerId)
    setIsDragging(true)
    setDraggedSelection({
      startDay: point.day,
      endDay: point.day,
      startRow: point.row,
      endRow: point.row + 1,
    })
  }
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging || !draggedSelection) return
    const point = gridPoint(event)
    if (!point) return
    setDraggedSelection({
      startDay: Math.min(draggedSelection.startDay, point.day),
      endDay: Math.max(draggedSelection.startDay, point.day),
      startRow: Math.min(draggedSelection.startRow, point.row),
      endRow: Math.max(draggedSelection.startRow, point.row + 1),
    })
  }
  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging || !draggedSelection) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    onFilterChange({
      days: scheduleDays
        .slice(draggedSelection.startDay, draggedSelection.endDay + 1)
        .map(([day]) => day),
      start: `${String(scheduleStartHour + draggedSelection.startRow).padStart(2, '0')}:00`,
      end: `${String(scheduleStartHour + draggedSelection.endRow).padStart(2, '0')}:00`,
    })
    setDraggedSelection(undefined)
    setIsDragging(false)
  }
  const onPointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    setDraggedSelection(undefined)
    setIsDragging(false)
  }

  return {
    ref,
    activeSelection,
    highlightedDayIndexes,
    isDragging,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
  }
}
