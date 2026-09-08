import { Network } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

import type {
  CourseId,
  CurriculumCourseState,
} from '@pomi/planner-domain/curriculum'
import type { VisualPrerequisiteLink } from '@/features/curriculum-planner/prerequisiteTreeLayout'
import {
  buildPrerequisiteTreeGrid,
  buildPrerequisiteTreeLevels,
  combinedPrerequisiteTreeCourseIds,
  prerequisiteTreeCourseIds,
} from '@/features/curriculum-planner/prerequisiteTreeLayout'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type TreePath = Readonly<{
  key: string
  d: string
  prerequisiteCourseId: CourseId
  dependentCourseId: CourseId
  status: VisualPrerequisiteLink['status']
  alternative?: boolean
}>

type ViewTransitionDocument = Readonly<{
  startViewTransition?: (update: () => void) => unknown
}>

function pathClass(status: VisualPrerequisiteLink['status']) {
  if (status === 'samePeriod') return 'stroke-destructive'
  if (status === 'plannedAfter') return 'stroke-chart-4'
  if (status === 'completed') return 'stroke-muted-foreground'
  return 'stroke-primary'
}

export function PrerequisiteTreeView({
  states,
  links,
  onOpenCourseDetails,
  selectedCourseIds,
  selectionMode,
  onToggleCourseSelection,
}: {
  states: ReadonlyArray<CurriculumCourseState>
  links: ReadonlyArray<VisualPrerequisiteLink>
  onOpenCourseDetails: (courseId: CourseId) => void
  selectedCourseIds: ReadonlySet<CourseId>
  selectionMode: boolean
  onToggleCourseSelection: (courseId: CourseId) => void
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [paths, setPaths] = useState<ReadonlyArray<TreePath>>([])
  const [focusedCourseIds, setFocusedCourseIds] = useState<Set<CourseId>>(
    () => new Set(),
  )
  const [revealingAllCourses, setRevealingAllCourses] = useState(false)
  const [hideCompleted, setHideCompleted] = useState(false)
  const [hoveredCourseId, setHoveredCourseId] = useState<CourseId>()
  const stateById = useMemo(
    () => new Map(states.map((state) => [state.course.id, state])),
    [states],
  )
  const visibleCourseIds = useMemo(() => {
    if (!focusedCourseIds.size || revealingAllCourses) return undefined
    return combinedPrerequisiteTreeCourseIds(focusedCourseIds, links)
  }, [focusedCourseIds, links, revealingAllCourses])
  const treeCourseIds = useMemo(() => {
    const courseIds = new Set<CourseId>()
    for (const link of links) {
      courseIds.add(link.prerequisiteCourseId)
      courseIds.add(link.dependentCourseId)
    }
    if (visibleCourseIds)
      return new Set(
        [...courseIds].filter((courseId) => visibleCourseIds.has(courseId)),
      )
    return courseIds
  }, [links, visibleCourseIds])
  const layoutCourseIds = useMemo(() => {
    const candidateCourseIds = new Set(
      [...treeCourseIds].filter(
        (courseId) => !hideCompleted || !stateById.get(courseId)?.completed,
      ),
    )
    if (!hideCompleted) return candidateCourseIds
    const connectedCourseIds = new Set<CourseId>()
    for (const link of links) {
      if (
        !candidateCourseIds.has(link.prerequisiteCourseId) ||
        !candidateCourseIds.has(link.dependentCourseId)
      )
        continue
      connectedCourseIds.add(link.prerequisiteCourseId)
      connectedCourseIds.add(link.dependentCourseId)
    }
    return connectedCourseIds
  }, [hideCompleted, links, stateById, treeCourseIds])
  const visibleLinks = useMemo(
    () =>
      links.filter(
        (link) =>
          layoutCourseIds.has(link.prerequisiteCourseId) &&
          layoutCourseIds.has(link.dependentCourseId),
      ),
    [layoutCourseIds, links],
  )
  const hoveredTreeCourseIds = useMemo(
    () =>
      hoveredCourseId === undefined
        ? undefined
        : prerequisiteTreeCourseIds(hoveredCourseId, links),
    [hoveredCourseId, links],
  )
  const courseIdLevels = useMemo(
    () =>
      buildPrerequisiteTreeLevels(
        visibleLinks,
        (left, right) =>
          (stateById.get(left)?.course.code ?? String(left)).localeCompare(
            stateById.get(right)?.course.code ?? String(right),
          ),
        layoutCourseIds,
      ),
    [layoutCourseIds, stateById, visibleLinks],
  )
  const gridLevels = useMemo(
    () => buildPrerequisiteTreeGrid(courseIdLevels, visibleLinks),
    [courseIdLevels, visibleLinks],
  )
  const rowCount = Math.max(1, ...courseIdLevels.map((level) => level.length))
  const updateTreeSelection = (update: () => void) => {
    const startViewTransition = (document as unknown as ViewTransitionDocument)
      .startViewTransition
    if (!startViewTransition) {
      update()
      return
    }
    startViewTransition.call(document, () => flushSync(update))
  }
  const toggleFocusedCourse = (courseId: CourseId) => {
    updateTreeSelection(() => {
      setFocusedCourseIds((current) => {
        const next = new Set(current)
        if (next.has(courseId)) next.delete(courseId)
        else next.add(courseId)
        return next
      })
      setRevealingAllCourses(false)
    })
  }

  useEffect(() => {
    const root = rootRef.current
    if (!root || !visibleLinks.length) {
      setPaths([])
      return
    }
    let frame = 0
    const measure = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rootRect = root.getBoundingClientRect()
        const cards = new Map<string, DOMRect>()
        for (const card of root.querySelectorAll<HTMLElement>(
          '[data-course-id]',
        )) {
          const courseId = card.dataset.courseId
          if (courseId) cards.set(courseId, card.getBoundingClientRect())
        }
        setPaths(
          visibleLinks.flatMap((link, index) => {
            const source = cards.get(link.prerequisiteCourseId)
            const target = cards.get(link.dependentCourseId)
            if (!source || !target) return []
            const startX = source.right - rootRect.left
            const startY = source.top + source.height / 2 - rootRect.top
            const endX = target.left - rootRect.left
            const endY = target.top + target.height / 2 - rootRect.top
            const curve = Math.max(24, (endX - startX) / 2)
            return [
              {
                key: `${link.prerequisiteCourseId}:${link.dependentCourseId}:${index}`,
                d: `M ${startX} ${startY} C ${startX + curve} ${startY}, ${endX - curve} ${endY}, ${endX} ${endY}`,
                prerequisiteCourseId: link.prerequisiteCourseId,
                dependentCourseId: link.dependentCourseId,
                status: link.status,
                alternative: link.alternative,
              },
            ]
          }),
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
  }, [gridLevels, visibleLinks])

  return (
    <div
      role="region"
      aria-label="Árvore de pré-requisitos"
      className="rounded-md border-2 border-strong-border bg-card p-4"
    >
      <header className="sticky top-[4.5rem] z-30 -mx-4 -mt-4 mb-4 flex flex-wrap items-center justify-between gap-3 border-b-2 border-border bg-card px-4 py-3">
        <div>
          <h3 className="font-extrabold">Árvore de pré-requisitos</h3>
          <p className="text-xs text-muted-foreground">
            Clique nas disciplinas para organizar os caminhos relacionados.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {focusedCourseIds.size > 0 && (
            <>
              <p className="mr-2 text-sm font-bold">
                {revealingAllCourses
                  ? 'Clique em outra disciplina para adicionar sua árvore.'
                  : `${focusedCourseIds.size} ${focusedCourseIds.size === 1 ? 'árvore selecionada' : 'árvores selecionadas'}`}
              </p>
              {!revealingAllCourses && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    updateTreeSelection(() => setRevealingAllCourses(true))
                  }
                >
                  Adicionar outra árvore
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  updateTreeSelection(() => {
                    setFocusedCourseIds(new Set())
                    setRevealingAllCourses(false)
                  })
                }
              >
                Limpar árvores
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant={hideCompleted ? 'default' : 'outline'}
            aria-pressed={hideCompleted}
            onClick={() =>
              updateTreeSelection(() => setHideCompleted((current) => !current))
            }
          >
            {hideCompleted ? 'Mostrar concluídas' : 'Ocultar concluídas'}
          </Button>
        </div>
      </header>
      {gridLevels.length ? (
        <div className="overflow-x-auto">
          <div
            ref={rootRef}
            className="relative grid min-h-64 items-center justify-items-center gap-x-12 gap-y-6 py-3 transition-[grid-template-columns,grid-template-rows,min-width] duration-200 ease-out"
            style={{
              gridTemplateColumns: `repeat(${gridLevels.length}, minmax(7rem, 1fr))`,
              gridTemplateRows: `repeat(${rowCount}, minmax(3rem, 1fr))`,
              minWidth: `${gridLevels.length * 9 + Math.max(0, gridLevels.length - 1) * 3}rem`,
            }}
          >
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 size-full overflow-visible"
            >
              {paths.map((path) => (
                <path
                  key={path.key}
                  d={path.d}
                  fill="none"
                  strokeWidth="2"
                  className={cn(
                    'transition-opacity duration-200',
                    pathClass(path.status),
                    !hoveredTreeCourseIds
                      ? 'opacity-70'
                      : hoveredTreeCourseIds.has(path.prerequisiteCourseId) &&
                          hoveredTreeCourseIds.has(path.dependentCourseId)
                        ? 'opacity-100'
                        : 'opacity-10',
                  )}
                  strokeDasharray={path.alternative ? '6 4' : undefined}
                />
              ))}
            </svg>
            {gridLevels.flatMap((level, levelIndex) =>
              level.flatMap(({ courseId, row }) => {
                const state = stateById.get(courseId)
                return state
                  ? [
                      <div
                        key={state.course.id}
                        className={cn(
                          'relative z-20 rounded-sm transition-[opacity,transform] duration-200 ease-out',
                          hoveredTreeCourseIds &&
                            !hoveredTreeCourseIds.has(state.course.id) &&
                            'opacity-25',
                        )}
                        style={{
                          gridColumn: levelIndex + 1,
                          gridRow: row,
                          viewTransitionName: `prerequisite-${state.course.id}`,
                        }}
                        onMouseEnter={() =>
                          setHoveredCourseId(state.course.id)
                        }
                        onMouseLeave={() => setHoveredCourseId(undefined)}
                      >
                        <div
                          data-course-id={state.course.id}
                          className={cn(
                            'inline-flex h-8 overflow-hidden rounded-sm border-2 border-strong-border bg-background font-mono text-xs font-black text-foreground shadow-[2px_2px_0_var(--strong-border)]',
                            state.plannedPeriodId &&
                              !state.completed &&
                              'border-primary bg-primary/12',
                          )}
                        >
                          <button
                            type="button"
                            className={cn(
                              'pomi-focus min-w-[4rem] px-2 transition-colors hover:bg-accent',
                              selectedCourseIds.has(state.course.id) &&
                                'bg-primary text-primary-foreground hover:bg-primary/90',
                            )}
                            aria-label={`${selectedCourseIds.has(state.course.id) ? 'Desselecionar' : 'Selecionar'} ${state.course.code}`}
                            aria-pressed={selectedCourseIds.has(
                              state.course.id,
                            )}
                            onClick={() =>
                              selectionMode
                                ? onToggleCourseSelection(state.course.id)
                                : onOpenCourseDetails(state.course.id)
                            }
                          >
                            {state.course.code}
                          </button>
                          <button
                            type="button"
                            className={cn(
                              'pomi-focus grid w-8 place-items-center border-l-2 border-strong-border transition-colors hover:bg-accent',
                              focusedCourseIds.has(state.course.id) &&
                                'bg-primary text-primary-foreground hover:bg-primary/90',
                            )}
                            aria-label={`${focusedCourseIds.has(state.course.id) ? 'Remover' : 'Mostrar'} árvore de ${state.course.code}`}
                            aria-pressed={focusedCourseIds.has(state.course.id)}
                            onClick={() => toggleFocusedCourse(state.course.id)}
                          >
                            <Network className="size-4" />
                          </button>
                        </div>
                      </div>,
                    ]
                  : []
              }),
            )}
          </div>
        </div>
      ) : (
        <div className="grid min-h-36 place-items-center rounded-md border-2 border-border bg-card p-6 text-center">
          <div>
            <h3 className="font-extrabold">Nenhuma relação encontrada</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              As disciplinas do planejamento ainda não formam uma árvore de
              pré-requisitos.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
