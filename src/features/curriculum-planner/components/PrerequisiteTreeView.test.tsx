import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { PrerequisiteTreeView } from './PrerequisiteTreeView'
import type {
  CourseId,
  CurriculumCourseState,
  PrerequisiteLink,
} from '@pomi/planner-domain/curriculum'

const id = (value: string) => value as CourseId
const state = (courseId: string, code: string): CurriculumCourseState => ({
  course: {
    id: id(courseId),
    code,
    name: code,
    credits: 4,
    prefix: code.slice(0, 2),
  },
  completed: false,
})

describe('PrerequisiteTreeView', () => {
  it('selects a discipline when selection mode is active', () => {
    const onOpenCourseDetails = vi.fn()
    const onToggleCourseSelection = vi.fn()
    const links: ReadonlyArray<PrerequisiteLink> = [
      {
        prerequisiteCourseId: id('course-1'),
        dependentCourseId: id('course-2'),
        status: 'plannedBefore',
      },
    ]

    render(
      <PrerequisiteTreeView
        states={[state('course-1', 'MC102'), state('course-2', 'MC202')]}
        links={links}
        onOpenCourseDetails={onOpenCourseDetails}
        selectedCourseIds={new Set()}
        selectionMode
        onToggleCourseSelection={onToggleCourseSelection}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Selecionar MC102' }))

    expect(onToggleCourseSelection).toHaveBeenCalledWith(id('course-1'))
    expect(onOpenCourseDetails).not.toHaveBeenCalled()
  })

  it('activates selection behavior when Shift is held', () => {
    const onOpenCourseDetails = vi.fn()
    const onToggleCourseSelection = vi.fn()
    const links: ReadonlyArray<PrerequisiteLink> = [
      {
        prerequisiteCourseId: id('course-1'),
        dependentCourseId: id('course-2'),
        status: 'plannedBefore',
      },
    ]

    render(
      <PrerequisiteTreeView
        states={[state('course-1', 'MC102'), state('course-2', 'MC202')]}
        links={links}
        onOpenCourseDetails={onOpenCourseDetails}
        onToggleCourseSelection={onToggleCourseSelection}
      />,
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'MC102, abrir detalhes da disciplina',
      }),
      { shiftKey: true },
    )

    expect(onToggleCourseSelection).toHaveBeenCalledWith(id('course-1'))
    expect(onOpenCourseDetails).not.toHaveBeenCalled()
  })
})
