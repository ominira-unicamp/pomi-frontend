import { Rows3, Table2 } from 'lucide-react'
import { memo, useMemo, useState } from 'react'

import {
  buildCurriculumGroups,
  calculateElectiveCreditsBalances,
  curriculumAvailabilityKey,
} from '@pomi/planner-domain/curriculum'
import { CurriculumBlockCourses } from './CurriculumBlockCourses'
import { CourseSearchDialog } from './CourseSearchDialog'
import type {
  CourseId,
  CurriculumPlannerSnapshot,
  CurriculumPlannerStaticData,
  ElectiveCreditsRequirement,
  PlanningPeriod,
} from '@pomi/planner-domain/curriculum'
import type { PlannerDispatch } from '@/features/curriculum-planner/types'
import { Button } from '@/components/ui/button'

const emptyPeriods: ReadonlyArray<PlanningPeriod> = []

function roman(value: number) {
  return ['I', 'II', 'III', 'IV', 'V', 'VI'][value - 1] ?? String(value)
}

function RequirementHeading({
  title,
  subtitle,
  requiredCredits,
  remainingCredits,
}: {
  title: string
  subtitle?: string
  requiredCredits?: number
  remainingCredits?: number
}) {
  return (
    <div>
      <h4 className="text-base font-extrabold">{title}</h4>
      {subtitle ? (
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      ) : requiredCredits !== undefined ? (
        <p className="text-xs text-muted-foreground">
          Exigência: {requiredCredits} créditos · Faltam:{' '}
          {remainingCredits ?? requiredCredits} créditos
        </p>
      ) : null}
    </div>
  )
}

function CurriculumGroupBlocks({
  group,
  view,
  periods,
  planningStart,
  remainingCreditsByRequirement,
  disabled,
  onOpenCourseDetails,
  onOpenCourseSearch,
  selectedCourseIds,
  selectionMode,
  onToggleCourseSelection,
}: {
  group: ReturnType<typeof buildCurriculumGroups>[number]
  view: 'snip' | 'table'
  periods: ReadonlyArray<PlanningPeriod>
  planningStart: CurriculumPlannerSnapshot['plan']['planningStart']
  remainingCreditsByRequirement: ReadonlyMap<ElectiveCreditsRequirement, number>
  disabled: boolean
  onOpenCourseDetails: (courseId: CourseId) => void
  onOpenCourseSearch: (prefix?: string) => void
  selectedCourseIds: ReadonlySet<CourseId>
  selectionMode: boolean
  onToggleCourseSelection: (courseId: CourseId) => void
}) {
  return (
    <div className="space-y-6">
      {group.mandatory && (
        <section className="space-y-3">
          <RequirementHeading
            title={
              group.id === 'base'
                ? 'Disciplinas obrigatórias'
                : group.mandatory.title
            }
            requiredCredits={group.mandatory.requiredCredits}
            remainingCredits={
              group.mandatory.requirement
                ? remainingCreditsByRequirement.get(group.mandatory.requirement)
                : undefined
            }
          />
          <CurriculumBlockCourses
            block={group.mandatory}
            groupId={group.id}
            view={view}
            periods={periods}
            planningStart={planningStart}
            disabled={disabled}
            onOpenCourseDetails={onOpenCourseDetails}
            onOpenCourseSearch={onOpenCourseSearch}
            selectedCourseIds={selectedCourseIds}
            selectionMode={selectionMode}
            onToggleCourseSelection={onToggleCourseSelection}
          />
        </section>
      )}
      {group.electives.map((block, index) => (
        <section key={block.id} className="space-y-3">
          <RequirementHeading
            title={
              group.id === 'base'
                ? `Disciplinas eletivas ${roman(index + 1)}`
                : block.title
            }
            subtitle={
              group.id === 'base'
                ? `Obtenha ${block.requiredCredits} créditos dentre as opções abaixo.`
                : undefined
            }
            requiredCredits={block.requiredCredits}
            remainingCredits={
              block.requirement
                ? remainingCreditsByRequirement.get(block.requirement)
                : undefined
            }
          />
          <CurriculumBlockCourses
            block={block}
            groupId={group.id}
            view={view}
            periods={periods}
            planningStart={planningStart}
            disabled={disabled}
            onOpenCourseDetails={onOpenCourseDetails}
            onOpenCourseSearch={onOpenCourseSearch}
            selectedCourseIds={selectedCourseIds}
            selectionMode={selectionMode}
            onToggleCourseSelection={onToggleCourseSelection}
          />
        </section>
      ))}
    </div>
  )
}

export const CurriculumBlocksPanel = memo(function CurriculumBlocksPanel({
  staticData,
  snapshot,
  disabled,
  dispatch,
  onOpenCourseDetails,
  selectedCourseIds,
  selectionMode,
  onToggleCourseSelection,
}: {
  staticData: CurriculumPlannerStaticData
  snapshot: CurriculumPlannerSnapshot
  disabled: boolean
  dispatch: PlannerDispatch
  onOpenCourseDetails: (courseId: CourseId) => void
  selectedCourseIds: ReadonlySet<CourseId>
  selectionMode: boolean
  onToggleCourseSelection: (courseId: CourseId) => void
}) {
  const [baseView, setBaseView] = useState<'snip' | 'table'>('snip')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchPrefix, setSearchPrefix] = useState<string>()
  const catalogYear = staticData.catalogPrograms.find(
    (program) => program.id === snapshot.selection.catalogProgramId,
  )?.catalog.year
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
  const openCourseSearch = (prefix?: string) => {
    setSearchPrefix(prefix)
    setSearchOpen(true)
  }
  return (
    <section aria-labelledby="curriculum-blocks-title">
      <div className="flex flex-row items-center justify-between gap-4 p-4">
        <div>
          <h2 id="curriculum-blocks-title" className="text-lg font-extrabold">
            Blocos da grade
          </h2>
          <p className="text-sm text-muted-foreground">
            {count} disciplinas não concluídas
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <div
            className="flex rounded-md border-2 border-border p-0.5"
            role="group"
            aria-label="Visualização da base curricular"
          >
            <Button
              size="sm"
              className="shadow-none hover:shadow-none"
              variant={baseView === 'snip' ? 'default' : 'ghost'}
              aria-pressed={baseView === 'snip'}
              onClick={() => setBaseView('snip')}
            >
              <Rows3 /> Snip
            </Button>
            <Button
              size="sm"
              className="shadow-none hover:shadow-none"
              variant={baseView === 'table' ? 'default' : 'ghost'}
              aria-pressed={baseView === 'table'}
              onClick={() => setBaseView('table')}
            >
              <Table2 /> Tabela
            </Button>
          </div>
        </div>
      </div>
      <div className="border-t-2 border-border p-4">
        <div className="space-y-5">
          {groups.map((group) => (
            <section key={group.id} aria-labelledby={`group-${group.id}`}>
              <h3
                id={`group-${group.id}`}
                className="mb-3 border-b-2 border-primary pb-2 text-sm font-black tracking-[0.08em] uppercase"
              >
                {group.title}
              </h3>
              <CurriculumGroupBlocks
                group={group}
                view={group.id === 'base' ? baseView : 'snip'}
                periods={emptyPeriods}
                planningStart={undefined}
                remainingCreditsByRequirement={remainingCreditsByRequirement}
                disabled={disabled}
                onOpenCourseDetails={onOpenCourseDetails}
                onOpenCourseSearch={openCourseSearch}
                selectedCourseIds={selectedCourseIds}
                selectionMode={selectionMode}
                onToggleCourseSelection={onToggleCourseSelection}
              />
            </section>
          ))}
        </div>
      </div>
      <CourseSearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        courses={staticData.courses}
        excludedCourseIds={availableCourseIds}
        initialPrefix={searchPrefix}
        catalogYear={catalogYear}
        title={
          searchPrefix ? `Adicionar disciplina ${searchPrefix}---` : undefined
        }
        description={
          searchPrefix
            ? `Escolha uma disciplina que atenda ao prefixo ${searchPrefix}---.`
            : 'Escolha uma disciplina para adicionar como não alocada.'
        }
        searchLabel="Buscar disciplina para o planejamento"
        disabled={disabled}
        onAdd={(courseId) =>
          dispatch({ type: 'addCourseToUnallocated', courseId })
        }
      />
    </section>
  )
})
