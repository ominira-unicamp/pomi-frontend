import { fireEvent, render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { PrerequisiteGraph } from './PrerequisiteGraph'
import type {
  CourseId,
  PrerequisiteLink,
} from '@pomi/planner-domain/curriculum'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('PrerequisiteGraph', () => {
  it('observes only the board and measures each card once', async () => {
    const observe = vi.fn()
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe = observe
        disconnect() {}
      },
    )
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0)
      return 1
    })
    const measuredCourseIds: Array<string> = []
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLElement) {
        const courseId = this.dataset.courseId
        if (courseId) measuredCourseIds.push(courseId)
        if (!courseId) return new DOMRect(0, 0, 300, 300)
        if (courseId === '0') return new DOMRect(20, 0, 100, 30)
        if (courseId === '1') return new DOMRect(20, 80, 100, 30)
        if (courseId === '2') return new DOMRect(20, 200, 100, 30)
        if (courseId === '3') return new DOMRect(20, 280, 100, 30)
        if (courseId === '4') return new DOMRect(160, 120, 100, 30)
        return new DOMRect(40, 140, 40, 30)
      },
    )
    const links: ReadonlyArray<PrerequisiteLink> = [
      {
        prerequisiteCourseId: '0' as CourseId,
        dependentCourseId: '1' as CourseId,
        status: 'plannedBefore',
      },
      {
        prerequisiteCourseId: '1' as CourseId,
        dependentCourseId: '2' as CourseId,
        status: 'plannedBefore',
      },
      {
        prerequisiteCourseId: '2' as CourseId,
        dependentCourseId: '3' as CourseId,
        status: 'plannedBefore',
      },
      {
        prerequisiteCourseId: '4' as CourseId,
        dependentCourseId: '2' as CourseId,
        status: 'plannedBefore',
      },
    ]

    const root = document.createElement('div')
    for (const courseId of ['0', '1', '2', '3', '4', 'unrelated']) {
      const card = document.createElement('button')
      card.dataset.courseId = courseId
      root.append(card)
    }
    const { container } = render(
      <PrerequisiteGraph rootRef={{ current: root }} links={links} visible />,
    )

    await waitFor(() => expect(observe).toHaveBeenCalledTimes(1))
    expect(measuredCourseIds).toEqual(['0', '1', '2', '3', '4', 'unrelated'])
    expect(container.querySelectorAll('path[marker-end]')).toHaveLength(0)

    const selectedCard = root.querySelector<HTMLElement>('[data-course-id="1"]')
    fireEvent.pointerOver(selectedCard!)
    await waitFor(() =>
      expect(container.querySelectorAll('path[marker-end]')).toHaveLength(3),
    )
    expect(
      container.querySelectorAll('path[marker-end]')[0].getAttribute('d'),
    ).not.toContain(' H ')
    expect(
      [...container.querySelectorAll('path[marker-end]')].every(
        (connection) => !connection.getAttribute('d')?.includes(' L '),
      ),
    ).toBe(true)
    const path = container.querySelectorAll('path[marker-end]')[1]
    expect(path).not.toBeNull()
    const routeX = Number(path.getAttribute('d')?.match(/H ([\d.]+) V/)?.[1])
    expect(routeX).toBeGreaterThanOrEqual(85)
    expect(routeX).toBeLessThanOrEqual(115)
    const finalSegment = path
      .getAttribute('d')
      ?.match(/V ([\d.]+) H [\d.]+ V ([\d.]+)$/)
    expect(
      Math.abs(Number(finalSegment?.[2]) - Number(finalSegment?.[1])),
    ).toBeGreaterThanOrEqual(15)

    await waitFor(() =>
      expect(
        [...root.querySelectorAll('[data-prerequisite-tree]')].map((card) =>
          card.getAttribute('data-course-id'),
        ),
      ).toEqual(['0', '1', '2', '3']),
    )
    fireEvent.click(selectedCard!)
    fireEvent.pointerOut(selectedCard!, { relatedTarget: root })
    expect(root.querySelectorAll('[data-prerequisite-tree]')).toHaveLength(4)
    expect(
      root
        .querySelector<HTMLElement>('[data-course-id="3"]')
        ?.hasAttribute('data-prerequisite-tree'),
    ).toBe(true)
    expect(
      root
        .querySelector<HTMLElement>('[data-course-id="4"]')
        ?.hasAttribute('data-prerequisite-tree'),
    ).toBe(false)
    expect(selectedCard?.hasAttribute('data-prerequisite-active')).toBe(true)
  })

  it('keeps an inverted prerequisite route around intermediate cards', async () => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    )
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0)
      return 1
    })
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLElement) {
        if (!this.dataset.courseId) return new DOMRect(0, 0, 320, 300)
        if (this.dataset.courseId === 'source')
          return new DOMRect(180, 220, 90, 30)
        if (this.dataset.courseId === 'target')
          return new DOMRect(20, 0, 90, 30)
        return new DOMRect(80, 100, 100, 30)
      },
    )
    const root = document.createElement('div')
    for (const courseId of ['source', 'target', 'obstacle']) {
      const card = document.createElement('button')
      card.dataset.courseId = courseId
      root.append(card)
    }
    const { container } = render(
      <PrerequisiteGraph
        rootRef={{ current: root }}
        visible
        links={[
          {
            prerequisiteCourseId: 'source' as CourseId,
            dependentCourseId: 'target' as CourseId,
            status: 'plannedAfter',
          },
        ]}
      />,
    )

    fireEvent.pointerOver(
      root.querySelector<HTMLElement>('[data-course-id="target"]')!,
    )
    await waitFor(() =>
      expect(container.querySelector('path[marker-end]')).not.toBeNull(),
    )
    const route = container.querySelector('path[marker-end]')?.getAttribute('d')
    expect(route).toMatch(/^M 225 220/)
    expect(route).toMatch(/V 31$/)
    expect(route).not.toContain(' L ')
  })
})
