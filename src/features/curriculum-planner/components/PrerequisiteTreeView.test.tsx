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
  it.each([false, true])(
    'preserves non-completed courses after filtering with includeIsolated=%s',
    (includeIsolated) => {
      const states = [
        { ...state('course-1', 'MC102'), completed: true },
        state('course-2', 'MC202'),
        state('course-3', 'MC999'),
      ]
      render(
        <PrerequisiteTreeView
          states={states}
          links={[
            {
              prerequisiteCourseId: id('course-1'),
              dependentCourseId: id('course-2'),
              status: 'completed',
            },
          ]}
          onOpenCourseDetails={vi.fn()}
          includeIsolated={includeIsolated}
        />,
      )
      fireEvent.click(
        screen.getByRole('button', { name: 'Ocultar concluídas' }),
      )
      expect(
        screen.queryByRole('button', {
          name: 'MC102, abrir detalhes da disciplina',
        }),
      ).toBeNull()
      expect(
        screen.getByRole('button', {
          name: 'MC202, abrir detalhes da disciplina',
        }),
      ).toBeTruthy()
      expect(
        Boolean(
          screen.queryByRole('button', {
            name: 'MC999, abrir detalhes da disciplina',
          }),
        ),
      ).toBe(includeIsolated)
      fireEvent.click(
        screen.getByRole('button', { name: 'Mostrar concluídas' }),
      )
      expect(
        screen.getByRole('button', {
          name: 'MC102, abrir detalhes da disciplina',
        }),
      ).toBeTruthy()
    },
  )

  it('preserves the focused dependency path when completed courses are hidden externally', () => {
    const props = {
      states: [
        { ...state('course-1', 'MC102'), completed: true },
        state('course-2', 'MC202'),
        state('course-3', 'MC302'),
        state('course-4', 'MC999'),
      ],
      links: [
        {
          prerequisiteCourseId: id('course-1'),
          dependentCourseId: id('course-2'),
          status: 'completed' as const,
        },
        {
          prerequisiteCourseId: id('course-2'),
          dependentCourseId: id('course-3'),
          status: 'plannedBefore' as const,
        },
      ],
      onOpenCourseDetails: vi.fn(),
      initialFocusedCourseIds: [id('course-2')],
      showCompletedToggle: false,
    }
    const view = render(<PrerequisiteTreeView {...props} hideCompleted />)
    expect(
      screen.queryByRole('button', {
        name: 'MC102, abrir detalhes da disciplina',
      }),
    ).toBeNull()
    expect(
      screen.getByRole('button', {
        name: 'MC202, abrir detalhes da disciplina',
      }),
    ).toBeTruthy()
    expect(
      screen.getByRole('button', {
        name: 'MC302, abrir detalhes da disciplina',
      }),
    ).toBeTruthy()
    expect(
      screen.queryByRole('button', {
        name: 'MC999, abrir detalhes da disciplina',
      }),
    ).toBeNull()
    view.rerender(<PrerequisiteTreeView {...props} hideCompleted={false} />)
    expect(
      screen.getByRole('button', {
        name: 'MC102, abrir detalhes da disciplina',
      }),
    ).toBeTruthy()
  })
})
