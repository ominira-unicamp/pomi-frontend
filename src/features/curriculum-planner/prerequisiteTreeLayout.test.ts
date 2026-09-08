import { describe, expect, it } from 'vitest'

import {
  buildPrerequisiteTreeGrid,
  buildPrerequisiteTreeLevels,
  combinedPrerequisiteTreeCourseIds,
  prerequisiteTreeCourseIds,
} from './prerequisiteTreeLayout'
import type {
  CourseId,
  PrerequisiteLink,
} from '@pomi/planner-domain/curriculum'

const id = (value: string) => value as CourseId
const link = (
  prerequisiteCourseId: string,
  dependentCourseId: string,
): PrerequisiteLink => ({
  prerequisiteCourseId: id(prerequisiteCourseId),
  dependentCourseId: id(dependentCourseId),
  status: 'plannedBefore',
})
const compare = (left: CourseId, right: CourseId) =>
  String(left).localeCompare(String(right))

describe('buildPrerequisiteTreeLevels', () => {
  it('places a prerequisite chain in successive levels', () => {
    expect(
      buildPrerequisiteTreeLevels(
        [link('MC102', 'MC202'), link('MC202', 'MC302')],
        compare,
      ),
    ).toEqual([[id('MC102')], [id('MC202')], [id('MC302')]])
  })

  it('keeps branches in the same level with stable ordering', () => {
    expect(
      buildPrerequisiteTreeLevels(
        [link('MC102', 'MC302'), link('MC102', 'MC202')],
        compare,
      ),
    ).toEqual([[id('MC102')], [id('MC202'), id('MC302')]])
  })

  it('groups dependents next to their respective prerequisites', () => {
    expect(
      buildPrerequisiteTreeLevels(
        [link('P1', 'B'), link('P1', 'D'), link('P2', 'A'), link('P2', 'C')],
        compare,
      ),
    ).toEqual([
      [id('P1'), id('P2')],
      [id('B'), id('D'), id('A'), id('C')],
    ])
  })

  it('renders cyclic data without losing courses', () => {
    expect(
      buildPrerequisiteTreeLevels(
        [link('MC102', 'MC202'), link('MC202', 'MC102')],
        compare,
      ),
    ).toEqual([[id('MC102'), id('MC202')]])
  })
})

describe('buildPrerequisiteTreeGrid', () => {
  it('places dependents on the rows closest to their prerequisites', () => {
    const levels = [
      [id('P1'), id('P2')],
      [id('B'), id('D'), id('A'), id('C')],
    ]
    const links = [
      link('P1', 'B'),
      link('P1', 'D'),
      link('P2', 'A'),
      link('P2', 'C'),
    ]

    expect(buildPrerequisiteTreeGrid(levels, links)).toEqual([
      [
        { courseId: id('P1'), row: 2 },
        { courseId: id('P2'), row: 4 },
      ],
      [
        { courseId: id('B'), row: 1 },
        { courseId: id('D'), row: 2 },
        { courseId: id('A'), row: 3 },
        { courseId: id('C'), row: 4 },
      ],
    ])
  })
})

describe('prerequisiteTreeCourseIds', () => {
  it('keeps only the connected prerequisite branch', () => {
    const links = [
      link('MC102', 'MC202'),
      link('MC202', 'MC302'),
      link('MC102', 'MC222'),
      link('MA111', 'MA211'),
    ]

    expect([...prerequisiteTreeCourseIds(id('MC202'), links)].sort()).toEqual([
      id('MC102'),
      id('MC202'),
      id('MC302'),
    ])
  })

  it('does not include sibling branches reached through a shared prerequisite', () => {
    const links = [
      link('MC102', 'MC202'),
      link('MC102', 'MC222'),
      link('MC222', 'MC322'),
    ]

    expect([...prerequisiteTreeCourseIds(id('MC202'), links)].sort()).toEqual([
      id('MC102'),
      id('MC202'),
    ])
  })

  it('combines multiple selected trees', () => {
    const links = [
      link('MC102', 'MC202'),
      link('MC202', 'MC302'),
      link('MA111', 'MA211'),
    ]

    expect(
      [
        ...combinedPrerequisiteTreeCourseIds([id('MC202'), id('MA111')], links),
      ].sort(),
    ).toEqual([id('MA111'), id('MA211'), id('MC102'), id('MC202'), id('MC302')])
  })
})
