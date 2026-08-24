import { useEffect, useId, useLayoutEffect, useMemo, useState } from 'react'
import type { RefObject } from 'react'

import type { PrerequisiteLink } from '@pomi/planner-domain/curriculum'

import { cn } from '@/lib/utils'

type MeasuredPath = Readonly<{
  key: string
  d: string
  status: PrerequisiteLink['status']
  prerequisiteCourseId: PrerequisiteLink['prerequisiteCourseId']
  dependentCourseId: PrerequisiteLink['dependentCourseId']
}>

type VerticalCorridor = Readonly<{
  x: number
  minY: number
  maxY: number
}>

const lineSpacing = 8

function pathsAreEqual(
  left: ReadonlyArray<MeasuredPath>,
  right: ReadonlyArray<MeasuredPath>,
) {
  return (
    left.length === right.length &&
    left.every(
      (path, index) =>
        path.key === right[index]?.key &&
        path.d === right[index]?.d &&
        path.status === right[index]?.status &&
        path.prerequisiteCourseId === right[index]?.prerequisiteCourseId &&
        path.dependentCourseId === right[index]?.dependentCourseId,
    )
  )
}

function courseIdFromTarget(target: EventTarget | null) {
  return target instanceof Element
    ? target.closest<HTMLElement>('[data-course-id]')?.dataset.courseId
    : undefined
}

function prerequisiteTree(
  courseId: string | undefined,
  paths: ReadonlyArray<MeasuredPath>,
) {
  if (!courseId) return undefined
  const courseIds = new Set([courseId])
  const pathKeys = new Set<string>()
  const upstream = [courseId]
  const visitedUpstream = new Set<string>()
  while (upstream.length) {
    const dependentCourseId = upstream.pop()
    if (!dependentCourseId || visitedUpstream.has(dependentCourseId)) continue
    visitedUpstream.add(dependentCourseId)
    for (const path of paths) {
      if (path.dependentCourseId !== dependentCourseId) continue
      pathKeys.add(path.key)
      courseIds.add(path.prerequisiteCourseId)
      upstream.push(path.prerequisiteCourseId)
    }
  }
  const downstream = [courseId]
  const visitedDownstream = new Set<string>()
  while (downstream.length) {
    const prerequisiteCourseId = downstream.pop()
    if (!prerequisiteCourseId || visitedDownstream.has(prerequisiteCourseId))
      continue
    visitedDownstream.add(prerequisiteCourseId)
    for (const path of paths) {
      if (path.prerequisiteCourseId !== prerequisiteCourseId) continue
      pathKeys.add(path.key)
      courseIds.add(path.dependentCourseId)
      downstream.push(path.dependentCourseId)
    }
  }
  return { courseIds, pathKeys }
}

function pathClass(status: PrerequisiteLink['status']) {
  if (status === 'samePeriod') return 'stroke-destructive'
  if (status === 'plannedAfter') return 'stroke-chart-4'
  if (status === 'completed') return 'stroke-muted-foreground'
  return 'stroke-primary'
}

function lineCorridorPenalty(
  x: number,
  minY: number,
  maxY: number,
  occupied: ReadonlyArray<VerticalCorridor>,
) {
  return occupied.some(
    (corridor) =>
      corridor.minY < maxY &&
      corridor.maxY > minY &&
      Math.abs(corridor.x - x) < lineSpacing,
  )
    ? 200
    : 0
}

function corridorIsClear(
  x: number,
  minY: number,
  maxY: number,
  cards: ReadonlyArray<DOMRect>,
  clearance = 5,
) {
  return !cards.some(
    (card) =>
      card.top < maxY &&
      card.bottom > minY &&
      x > card.left - clearance &&
      x < card.right + clearance,
  )
}

function horizontalIsClear(
  y: number,
  startX: number,
  endX: number,
  cards: ReadonlyArray<DOMRect>,
) {
  const clearance = 5
  const minX = Math.min(startX, endX)
  const maxX = Math.max(startX, endX)
  return !cards.some(
    (card) =>
      y > card.top - clearance &&
      y < card.bottom + clearance &&
      minX < card.right + clearance &&
      maxX > card.left - clearance,
  )
}

function segmentedConnectionPath({
  startX,
  startY,
  endX,
  endY,
  exitY,
  approachY,
  cards,
  occupied,
  minX,
  maxX,
}: {
  startX: number
  startY: number
  endX: number
  endY: number
  exitY: number
  approachY: number
  cards: ReadonlyArray<DOMRect>
  occupied: Array<VerticalCorridor>
  minX: number
  maxX: number
}) {
  const minY = Math.min(exitY, approachY)
  const maxY = Math.max(exitY, approachY)
  const nearlyAligned = Math.abs(startX - endX) <= lineSpacing * 2
  if (nearlyAligned && corridorIsClear(startX, minY, maxY, cards)) {
    occupied.push({ x: startX, minY, maxY })
    return `M ${startX} ${startY} V ${endY}`
  }
  const clearance = 6
  const levels = [
    exitY,
    approachY,
    ...cards.flatMap((card) => [card.top - clearance, card.bottom + clearance]),
  ]
    .filter((y) => y >= minY && y <= maxY)
    .filter((y, index, values) => values.indexOf(y) === index)
    .sort((left, right) => left - right)
  if (exitY > approachY) levels.reverse()
  const candidates = [
    startX,
    endX,
    ...cards.flatMap((card) => [card.left - clearance, card.right + clearance]),
  ]
    .filter((x) => x >= minX && x <= maxX)
    .filter((x, index, values) => values.indexOf(x) === index)
    .sort((left, right) => left - right)
  type State = { cost: number; previousX?: number }
  const stages: Array<Map<number, State>> = []
  for (let index = 0; index < levels.length - 1; index += 1) {
    const fromY = levels[index]
    const toY = levels[index + 1]
    const stage = new Map<number, State>()
    for (const x of candidates) {
      if (!corridorIsClear(x, fromY, toY, cards)) continue
      const origins =
        index === 0
          ? ([[startX, { cost: 0 }]] as Array<[number, State]>)
          : [...stages[index - 1].entries()]
      for (const [previousX, previousState] of origins) {
        if (!horizontalIsClear(fromY, previousX, x, cards)) continue
        const changedCorridor = Math.abs(previousX - x) >= 1
        const cost =
          previousState.cost +
          Math.abs(previousX - x) +
          (changedCorridor ? 40 : 0) +
          lineCorridorPenalty(
            x,
            Math.min(fromY, toY),
            Math.max(fromY, toY),
            occupied,
          )
        if (cost < (stage.get(x)?.cost ?? Number.POSITIVE_INFINITY))
          stage.set(x, { cost, previousX })
      }
    }
    if (!stage.size) return undefined
    stages.push(stage)
  }
  const finalStage = stages.at(-1)
  if (!finalStage) return undefined
  const destination = [...finalStage.entries()]
    .filter(([x]) => horizontalIsClear(approachY, x, endX, cards))
    .map(([x, state]) => ({
      x,
      cost: state.cost + Math.abs(x - endX) + (x === endX ? 0 : 40),
    }))
    .sort((left, right) => left.cost - right.cost)
    .at(0)
  if (!destination) return undefined
  const routeXs = Array<number>(stages.length)
  let routeX = destination.x
  for (let index = stages.length - 1; index >= 0; index -= 1) {
    routeXs[index] = routeX
    routeX = stages[index].get(routeX)?.previousX ?? startX
  }
  const commands = [`M ${startX} ${startY}`, `V ${exitY}`]
  let currentX = startX
  routeXs.forEach((x, index) => {
    if (Math.abs(currentX - x) >= 1) commands.push(`H ${x}`)
    commands.push(`V ${levels[index + 1]}`)
    occupied.push({
      x,
      minY: Math.min(levels[index], levels[index + 1]),
      maxY: Math.max(levels[index], levels[index + 1]),
    })
    currentX = x
  })
  commands.push(`H ${endX}`)
  commands.push(`V ${endY}`)
  return commands.join(' ')
}

export function PrerequisiteGraph({
  rootRef,
  links,
  visible,
}: {
  rootRef: RefObject<HTMLDivElement | null>
  links: ReadonlyArray<PrerequisiteLink>
  visible: boolean
}) {
  const markerId = useId().replace(/:/g, '')
  const [paths, setPaths] = useState<ReadonlyArray<MeasuredPath>>([])
  const [hoveredCourseId, setHoveredCourseId] = useState<string>()
  const [focusedCourseId, setFocusedCourseId] = useState<string>()
  const [selectedCourseId, setSelectedCourseId] = useState<string>()
  const activeCourseId = hoveredCourseId ?? focusedCourseId ?? selectedCourseId
  const activeTree = useMemo(
    () => prerequisiteTree(activeCourseId, paths),
    [activeCourseId, paths],
  )

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const cards = root.querySelectorAll<HTMLElement>('[data-course-id]')
    for (const card of cards) {
      const courseId = card.dataset.courseId
      if (courseId && activeTree?.courseIds.has(courseId))
        card.setAttribute('data-prerequisite-tree', 'true')
      else card.removeAttribute('data-prerequisite-tree')
      if (courseId && courseId === activeCourseId)
        card.setAttribute('data-prerequisite-active', 'true')
      else card.removeAttribute('data-prerequisite-active')
    }
    return () => {
      for (const card of cards) {
        card.removeAttribute('data-prerequisite-tree')
        card.removeAttribute('data-prerequisite-active')
      }
    }
  }, [activeCourseId, activeTree, rootRef])

  useEffect(() => {
    const root = rootRef.current
    if (!root || !visible) return
    const handlePointerOver = (event: PointerEvent) =>
      setHoveredCourseId(courseIdFromTarget(event.target))
    const handlePointerOut = (event: PointerEvent) =>
      setHoveredCourseId(courseIdFromTarget(event.relatedTarget))
    const handleFocusIn = (event: FocusEvent) =>
      setFocusedCourseId(courseIdFromTarget(event.target))
    const handleFocusOut = (event: FocusEvent) =>
      setFocusedCourseId(courseIdFromTarget(event.relatedTarget))
    const handleClick = (event: MouseEvent) =>
      setSelectedCourseId(courseIdFromTarget(event.target))
    root.addEventListener('pointerover', handlePointerOver)
    root.addEventListener('pointerout', handlePointerOut)
    root.addEventListener('focusin', handleFocusIn)
    root.addEventListener('focusout', handleFocusOut)
    root.addEventListener('click', handleClick)
    return () => {
      root.removeEventListener('pointerover', handlePointerOver)
      root.removeEventListener('pointerout', handlePointerOut)
      root.removeEventListener('focusin', handleFocusIn)
      root.removeEventListener('focusout', handleFocusOut)
      root.removeEventListener('click', handleClick)
    }
  }, [rootRef, visible])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || !visible) {
      setPaths([])
      return
    }
    let frame = 0
    const measure = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rootRect = root.getBoundingClientRect()
        const cardsById = new Map<string, DOMRect>()
        const obstacles: Array<DOMRect> = []
        for (const card of root.querySelectorAll<HTMLElement>(
          '[data-course-id]',
        )) {
          const courseId = card.dataset.courseId
          if (!courseId) continue
          const measured = card.getBoundingClientRect()
          const relative = new DOMRect(
            measured.left - rootRect.left,
            measured.top - rootRect.top,
            measured.width,
            measured.height,
          )
          obstacles.push(relative)
          if (!cardsById.has(courseId)) cardsById.set(courseId, relative)
        }
        const routeMinX = obstacles.length
          ? Math.min(...obstacles.map((card) => card.left))
          : 5
        const routeMaxX = obstacles.length
          ? Math.max(...obstacles.map((card) => card.right))
          : rootRect.width - 5
        const occupied: Array<VerticalCorridor> = []
        const measured = links.flatMap((link, index) => {
          const sourceRect = cardsById.get(link.prerequisiteCourseId)
          const targetRect = cardsById.get(link.dependentCourseId)
          if (!sourceRect || !targetRect) return []
          const downward = sourceRect.top <= targetRect.top
          const startX = sourceRect.left + sourceRect.width / 2
          const startY = downward ? sourceRect.bottom : sourceRect.top
          const endX = targetRect.left + targetRect.width / 2
          const endY = downward ? targetRect.top : targetRect.bottom
          const exitY = startY + (downward ? 10 : -10)
          const approachY = endY + (downward ? -16 : 16)
          const connectionEndY = endY + (downward ? -1 : 1)
          const d = segmentedConnectionPath({
            startX,
            startY,
            endX,
            endY: connectionEndY,
            exitY,
            approachY,
            cards: obstacles,
            occupied,
            minX: routeMinX,
            maxX: routeMaxX,
          })
          if (!d) return []
          return [
            {
              key: `${link.prerequisiteCourseId}:${link.dependentCourseId}:${link.status}:${index}`,
              d,
              status: link.status,
              prerequisiteCourseId: link.prerequisiteCourseId,
              dependentCourseId: link.dependentCourseId,
            },
          ]
        })
        setPaths((current) =>
          pathsAreEqual(current, measured) ? current : measured,
        )
      })
    }
    const observer =
      typeof ResizeObserver === 'undefined'
        ? undefined
        : new ResizeObserver(measure)
    observer?.observe(root)
    window.addEventListener('resize', measure)
    measure()
    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [links, rootRef, visible])

  if (!visible || !activeTree) return null
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 hidden size-full overflow-visible lg:block"
    >
      <defs>
        <marker
          id={markerId}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M 0 0 L 6 3 L 0 6 z" fill="context-stroke" />
        </marker>
      </defs>
      {paths
        .filter((path) => activeTree.pathKeys.has(path.key))
        .map((path) => (
          <path
            key={path.key}
            d={path.d}
            fill="none"
            strokeWidth="2"
            markerEnd={`url(#${markerId})`}
            className={cn('opacity-90', pathClass(path.status))}
          />
        ))}
    </svg>
  )
}
