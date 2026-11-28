import { useState } from 'react'
import type { ClassesGuideFilters } from '../model/classGuideFilters'

import { emptyFilters } from '@/features/semester-planner/model/classGuideFilters'

export function useClassesGuideFilters() {
  const [filters, setFilters] = useState<ClassesGuideFilters>(emptyFilters)

  function updateFilters(changes: Partial<ClassesGuideFilters>) {
    setFilters((current) => ({ ...current, ...changes }))
  }

  function toggleDay(day: string) {
    setFilters((current) => ({
      ...current,
      days: current.days.includes(day)
        ? current.days.filter((item) => item !== day)
        : [...current.days, day],
    }))
  }

  function clearFilters() {
    setFilters((current) => ({ ...emptyFilters, search: current.search }))
  }

  return { filters, updateFilters, toggleDay, clearFilters }
}
export {
  filterClassesGuide,
  timePeriodRanges,
} from '../model/classGuideFilters'
export type {
  ClassesGuideFilters,
  TimePeriod,
} from '../model/classGuideFilters'
