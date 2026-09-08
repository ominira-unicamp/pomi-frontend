import type {
  CourseId,
  PrerequisiteLink,
} from '@pomi/planner-domain/curriculum'

export type PrerequisiteTreeLevel = ReadonlyArray<CourseId>
export type VisualPrerequisiteLink = PrerequisiteLink &
  Readonly<{ alternative?: boolean }>
export type PrerequisiteTreeGridPosition = Readonly<{
  courseId: CourseId
  row: number
}>

export function prerequisiteTreeCourseIds(
  courseId: CourseId,
  links: ReadonlyArray<PrerequisiteLink>,
) {
  const courseIds = new Set<CourseId>([courseId])
  const upstream = [courseId]
  const visitedUpstream = new Set<CourseId>()
  while (upstream.length) {
    const dependentCourseId = upstream.pop()!
    if (visitedUpstream.has(dependentCourseId)) continue
    visitedUpstream.add(dependentCourseId)
    for (const link of links) {
      if (link.dependentCourseId !== dependentCourseId) continue
      courseIds.add(link.prerequisiteCourseId)
      upstream.push(link.prerequisiteCourseId)
    }
  }
  const downstream = [courseId]
  const visitedDownstream = new Set<CourseId>()
  while (downstream.length) {
    const prerequisiteCourseId = downstream.pop()!
    if (visitedDownstream.has(prerequisiteCourseId)) continue
    visitedDownstream.add(prerequisiteCourseId)
    for (const link of links) {
      if (link.prerequisiteCourseId !== prerequisiteCourseId) continue
      courseIds.add(link.dependentCourseId)
      downstream.push(link.dependentCourseId)
    }
  }
  return courseIds
}

export function combinedPrerequisiteTreeCourseIds(
  focusedCourseIds: Iterable<CourseId>,
  links: ReadonlyArray<PrerequisiteLink>,
) {
  const courseIds = new Set<CourseId>()
  for (const focusedCourseId of focusedCourseIds) {
    for (const courseId of prerequisiteTreeCourseIds(focusedCourseId, links))
      courseIds.add(courseId)
  }
  return courseIds
}

function optimizeLevelOrder(
  levels: Array<Array<CourseId>>,
  incoming: ReadonlyMap<CourseId, ReadonlySet<CourseId>>,
  outgoing: ReadonlyMap<CourseId, ReadonlySet<CourseId>>,
  compareCourseIds: (left: CourseId, right: CourseId) => number,
) {
  const positions = new Map<CourseId, number>()
  const updatePositions = (level: ReadonlyArray<CourseId>) => {
    const divisor = Math.max(1, level.length - 1)
    level.forEach((courseId, index) => positions.set(courseId, index / divisor))
  }
  const neighborPosition = (
    courseId: CourseId,
    relations: ReadonlyMap<CourseId, ReadonlySet<CourseId>>,
  ) => {
    const relatedPositions = [...(relations.get(courseId) ?? [])].flatMap(
      (relatedCourseId) => positions.get(relatedCourseId) ?? [],
    )
    if (!relatedPositions.length) return undefined
    return (
      relatedPositions.reduce((total, position) => total + position, 0) /
      relatedPositions.length
    )
  }
  const sortByRelations = (
    level: Array<CourseId>,
    relations: ReadonlyMap<CourseId, ReadonlySet<CourseId>>,
  ) => {
    level.sort((left, right) => {
      const leftPosition = neighborPosition(left, relations)
      const rightPosition = neighborPosition(right, relations)
      if (leftPosition === undefined && rightPosition === undefined)
        return compareCourseIds(left, right)
      if (leftPosition === undefined) return 1
      if (rightPosition === undefined) return -1
      return leftPosition - rightPosition || compareCourseIds(left, right)
    })
    updatePositions(level)
  }

  for (const level of levels) updatePositions(level)
  for (let iteration = 0; iteration < 4; iteration += 1) {
    for (let index = 1; index < levels.length; index += 1)
      sortByRelations(levels[index], incoming)
    for (let index = levels.length - 2; index >= 0; index -= 1)
      sortByRelations(levels[index], outgoing)
  }
  return levels
}

export function buildPrerequisiteTreeGrid(
  levels: ReadonlyArray<PrerequisiteTreeLevel>,
  links: ReadonlyArray<PrerequisiteLink>,
): ReadonlyArray<ReadonlyArray<PrerequisiteTreeGridPosition>> {
  const rowCount = Math.max(1, ...levels.map((level) => level.length))
  const rows = new Map<CourseId, number>()
  const incoming = new Map<CourseId, Set<CourseId>>()
  const outgoing = new Map<CourseId, Set<CourseId>>()
  for (const link of links) {
    const prerequisites = incoming.get(link.dependentCourseId) ?? new Set()
    prerequisites.add(link.prerequisiteCourseId)
    incoming.set(link.dependentCourseId, prerequisites)
    const dependents = outgoing.get(link.prerequisiteCourseId) ?? new Set()
    dependents.add(link.dependentCourseId)
    outgoing.set(link.prerequisiteCourseId, dependents)
  }
  for (const level of levels) {
    level.forEach((courseId, index) => {
      const row =
        level.length === 1
          ? Math.round((rowCount + 1) / 2)
          : Math.round(1 + (index * (rowCount - 1)) / (level.length - 1))
      rows.set(courseId, row)
    })
  }
  const positionLevel = (
    level: PrerequisiteTreeLevel,
    relations: ReadonlyMap<CourseId, ReadonlySet<CourseId>>,
  ) => {
    let previousRow = 0
    level.forEach((courseId, index) => {
      const relatedRows = [...(relations.get(courseId) ?? [])].flatMap(
        (relatedCourseId) => rows.get(relatedCourseId) ?? [],
      )
      const desiredRow = relatedRows.length
        ? relatedRows.reduce((total, row) => total + row, 0) /
          relatedRows.length
        : (rows.get(courseId) ?? Math.round((rowCount + 1) / 2))
      const latestAvailableRow = rowCount - (level.length - index - 1)
      const row = Math.min(
        latestAvailableRow,
        Math.max(previousRow + 1, Math.round(desiredRow)),
      )
      rows.set(courseId, row)
      previousRow = row
    })
  }
  for (let iteration = 0; iteration < 4; iteration += 1) {
    for (let index = 1; index < levels.length; index += 1)
      positionLevel(levels[index], incoming)
    for (let index = levels.length - 2; index >= 0; index -= 1)
      positionLevel(levels[index], outgoing)
  }
  return levels.map((level) =>
    level.map((courseId) => ({ courseId, row: rows.get(courseId) ?? 1 })),
  )
}

export function buildPrerequisiteTreeLevels(
  links: ReadonlyArray<PrerequisiteLink>,
  compareCourseIds: (left: CourseId, right: CourseId) => number,
  includedCourseIds?: ReadonlySet<CourseId>,
): ReadonlyArray<PrerequisiteTreeLevel> {
  const nodes = new Set<CourseId>(includedCourseIds)
  const incoming = new Map<CourseId, Set<CourseId>>()
  const outgoing = new Map<CourseId, Set<CourseId>>()

  for (const link of links) {
    nodes.add(link.prerequisiteCourseId)
    nodes.add(link.dependentCourseId)
    const prerequisites = incoming.get(link.dependentCourseId) ?? new Set()
    prerequisites.add(link.prerequisiteCourseId)
    incoming.set(link.dependentCourseId, prerequisites)
    const dependents = outgoing.get(link.prerequisiteCourseId) ?? new Set()
    dependents.add(link.dependentCourseId)
    outgoing.set(link.prerequisiteCourseId, dependents)
  }

  const remainingIncoming = new Map(
    [...nodes].map((courseId) => [courseId, incoming.get(courseId)?.size ?? 0]),
  )
  const levels = new Map<CourseId, number>()
  const ready = [...nodes]
    .filter((courseId) => remainingIncoming.get(courseId) === 0)
    .sort(compareCourseIds)

  while (ready.length) {
    const courseId = ready.shift()!
    const level = levels.get(courseId) ?? 0
    for (const dependentId of outgoing.get(courseId) ?? []) {
      levels.set(dependentId, Math.max(levels.get(dependentId) ?? 0, level + 1))
      const count = (remainingIncoming.get(dependentId) ?? 1) - 1
      remainingIncoming.set(dependentId, count)
      if (count === 0) {
        ready.push(dependentId)
        ready.sort(compareCourseIds)
      }
    }
  }

  for (const courseId of [...nodes].sort(compareCourseIds)) {
    if (!levels.has(courseId)) levels.set(courseId, 0)
  }

  const result: Array<Array<CourseId>> = []
  for (const [courseId, level] of levels) {
    if (!result[level]) result[level] = []
    result[level].push(courseId)
  }
  return optimizeLevelOrder(
    result.filter(Boolean).map((level) => level.sort(compareCourseIds)),
    incoming,
    outgoing,
    compareCourseIds,
  )
}
