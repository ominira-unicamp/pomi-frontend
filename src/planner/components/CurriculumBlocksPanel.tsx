import { ChevronDown, ChevronUp } from 'lucide-react'
import { memo, useMemo, useState } from 'react'

import {
  buildCurriculumGroups,
  calculateElectiveCreditsBalances,
  curriculumAvailabilityKey,
} from '@pomi/planner-domain/curriculum'
import { CompactCourseCard } from './CourseCard'
import type {
  CourseId,
  CurriculumBlockView,
  CurriculumPlannerSnapshot,
  CurriculumPlannerStaticData,
  PlanningPeriod,
} from '@pomi/planner-domain/curriculum'
import { Button } from '@/components/ui/button'
import { ActionTooltip } from '@/planner/components/ActionTooltip'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const emptyPeriods: ReadonlyArray<PlanningPeriod> = []

const CurriculumBlock = memo(function CurriculumBlock({
  block,
  groupId,
  periods,
  planningStart,
  remainingCredits,
  disabled,
  onOpenCourseDetails,
}: {
  block: CurriculumBlockView
  groupId: string
  periods: ReadonlyArray<PlanningPeriod>
  planningStart: CurriculumPlannerSnapshot['plan']['planningStart']
  remainingCredits?: number
  disabled: boolean
  onOpenCourseDetails: (courseId: CourseId) => void
}) {
  const visibleCourses = block.courses
  return (
    <section className="rounded-md border-2 border-border bg-background/60 p-3">
      <div className="mb-3">
        <h4 className="text-sm font-extrabold">{block.title}</h4>
        {block.requiredCredits !== undefined && (
          <p className="text-xs text-muted-foreground">
            Exigência: {block.requiredCredits} créditos · Faltam:{' '}
            {remainingCredits ?? block.requiredCredits} créditos
          </p>
        )}
      </div>
      {block.selectorLabels.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground">
            Elegíveis:
          </span>
          {block.selectorLabels.map((label) => (
            <span
              key={label}
              className="rounded-sm border-2 border-strong-border bg-muted px-2 py-1 font-mono text-xs font-black"
            >
              {label}
            </span>
          ))}
        </div>
      )}
      {visibleCourses.length ? (
        <div className="flex flex-wrap gap-2">
          {visibleCourses.map((state) => (
            <CompactCourseCard
              key={`${block.id}:${state.course.id}`}
              dragId={`block:${groupId}:${block.id}:course:${state.course.id}`}
              state={state}
              periods={periods}
              planningStart={planningStart}
              disabled={disabled}
              onOpenDetails={onOpenCourseDetails}
            />
          ))}
        </div>
      ) : !block.selectorLabels.length ? (
        <p className="text-sm text-muted-foreground">
          Nenhuma disciplina não concluída neste bloco.
        </p>
      ) : null}
    </section>
  )
})

export const CurriculumBlocksPanel = memo(function CurriculumBlocksPanel({
  staticData,
  snapshot,
  disabled,
  onOpenCourseDetails,
}: {
  staticData: CurriculumPlannerStaticData
  snapshot: CurriculumPlannerSnapshot
  disabled: boolean
  onOpenCourseDetails: (courseId: CourseId) => void
}) {
  const [collapsed, setCollapsed] = useState(false)
  const availabilityKey = curriculumAvailabilityKey(snapshot)
  const groups = useMemo(
    () => buildCurriculumGroups(staticData, snapshot),
    [availabilityKey, snapshot, staticData],
  )
  const availableCourseIds = useMemo(
    () =>
      new Set([
        ...snapshot.academicRecord.completedCourses.map(
          (course) => course.courseId,
        ),
        ...snapshot.plan.periods.flatMap((period) =>
          period.items.map((item) => item.courseId),
        ),
        ...(snapshot.plan.unallocatedCourseIds ?? []),
      ]),
    [availabilityKey],
  )
  const electiveBalances = useMemo(() => {
    const courses = staticData.courses.filter((course) =>
      availableCourseIds.has(course.id),
    )
    return calculateElectiveCreditsBalances(courses, {
      mandatory: [],
      electives: groups.flatMap((group) =>
        group.electives.flatMap((block) =>
          block.requirement ? [block.requirement] : [],
        ),
      ),
    })
  }, [groups, availableCourseIds, staticData.courses])
  const remainingCreditsByRequirement = new Map(
    electiveBalances.map((balance) => [
      balance.requirement,
      balance.remainingCredits,
    ]),
  )
  const count = groups.reduce(
    (total, group) =>
      total +
      (group.mandatory?.courses.length ?? 0) +
      group.electives.reduce((sum, block) => sum + block.courses.length, 0),
    0,
  )
  return (
    <Card className="mb-7 overflow-hidden shadow-none">
      <CardHeader className="flex-row items-center justify-between gap-4 p-4">
        <div>
          <CardTitle className="text-lg">Blocos da grade</CardTitle>
          <p className="text-sm text-muted-foreground">
            {count} disciplinas não concluídas
          </p>
        </div>
        <ActionTooltip
          content={
            collapsed
              ? 'Mostre as disciplinas organizadas por bloco curricular.'
              : 'Oculte a lista de blocos curriculares.'
          }
        >
          <Button
            size="sm"
            variant="ghost"
            aria-expanded={!collapsed}
            onClick={() => setCollapsed((value) => !value)}
          >
            {collapsed ? <ChevronDown /> : <ChevronUp />}
            {collapsed ? 'Expandir' : 'Recolher'}
          </Button>
        </ActionTooltip>
      </CardHeader>
      {!collapsed && (
        <CardContent className="border-t-2 border-border p-4">
          <div className="max-h-[30rem] space-y-5 overflow-y-auto pr-1">
            {groups.map((group) => (
              <section key={group.id} aria-labelledby={`group-${group.id}`}>
                <h3
                  id={`group-${group.id}`}
                  className="mb-3 border-b-2 border-primary pb-2 text-sm font-black tracking-[0.08em] uppercase"
                >
                  {group.title}
                </h3>
                <div className="space-y-3">
                  {group.mandatory && (
                    <CurriculumBlock
                      block={group.mandatory}
                      groupId={group.id}
                      periods={emptyPeriods}
                      planningStart={undefined}
                      remainingCredits={
                        group.mandatory.requirement
                          ? remainingCreditsByRequirement.get(
                              group.mandatory.requirement,
                            )
                          : undefined
                      }
                      disabled={disabled}
                      onOpenCourseDetails={onOpenCourseDetails}
                    />
                  )}
                  {group.electives.map((block) => (
                    <CurriculumBlock
                      key={block.id}
                      block={block}
                      groupId={group.id}
                      periods={emptyPeriods}
                      planningStart={undefined}
                      remainingCredits={
                        block.requirement
                          ? remainingCreditsByRequirement.get(block.requirement)
                          : undefined
                      }
                      disabled={disabled}
                      onOpenCourseDetails={onOpenCourseDetails}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
})
