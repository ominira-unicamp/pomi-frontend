import {
  buildGuideClassContext,
  programGuideBlocks,
} from '@pomi/planner-domain/semester'
import { filterClassesGuide } from './classGuideFilters'
import {
  buildCourseClassAvailability,
  buildDetailedScheduleConflicts,
  buildSemesterPlannerSummary,
} from './semesterPlannerView'
import type {
  GuideMode,
  SemesterCourse,
  SemesterPlannerSnapshot,
  SemesterPlannerStaticData,
  SemesterPlanningDocument,
} from '@pomi/planner-domain/semester'
import type {
  CatalogProgramOption,
  CurriculumPlannerStaticData,
} from '@pomi/planner-domain/curriculum'
import type { getCurriculum } from '../data/../../curriculum-planner/data/curriculumPersistenceApi'
import type { useSemesterEligibility } from '../hooks/useSemesterEligibility'
import type { useClassesGuideFilters } from '../hooks/useClassesGuideFilters'

export function buildSemesterGuideView({
  data,
  snapshot,
  document,
  anonymousData,
  curriculum,
  anonymousSuggestionCourseIds,
  completedCourseIds,
  eligibility,
  filters,
  guideCurriculumId,
  guideMode,
  guideSource,
  manualCourseIds,
  programLanguageId,
  programCatalogProgramVariantId,
  selectedProgramCatalog,
}: {
  data?: SemesterPlannerStaticData
  snapshot?: SemesterPlannerSnapshot
  document: SemesterPlanningDocument
  anonymousData?: CurriculumPlannerStaticData
  curriculum?: Awaited<ReturnType<typeof getCurriculum>>
  anonymousSuggestionCourseIds?: ReadonlyArray<
    Readonly<{ semester: number; courseIds: ReadonlyArray<number> }>
  >
  completedCourseIds: ReadonlySet<number>
  eligibility: ReturnType<typeof useSemesterEligibility>
  filters: ReturnType<typeof useClassesGuideFilters>['filters']
  guideCurriculumId?: number | null
  guideMode: GuideMode
  guideSource: 'saved' | 'suggestion'
  manualCourseIds: ReadonlyArray<number>
  programLanguageId: string
  programCatalogProgramVariantId: string
  selectedProgramCatalog?: CatalogProgramOption
}) {
  if (!data || !snapshot) return undefined

  const selectedIds = new Set(document.classIds)
  const selectedClassIdsWithConflict = new Set(
    snapshot.conflicts.flatMap((conflict) => [
      conflict.classId,
      conflict.conflictingClassId,
    ]),
  )
  const courseById = new Map<number, (typeof data.courses)[number]>(
    data.courses.map((course) => [course.id, course]),
  )
  for (const course of anonymousData?.courses ?? []) {
    const courseId = Number(course.id)
    if (!courseById.has(courseId)) {
      courseById.set(courseId, {
        id: courseId,
        code: course.code,
        name: course.name,
        credits: course.credits,
      })
    }
  }
  const classById = new Map(data.classes.map((item) => [item.id, item]))
  const plannerSummary = buildSemesterPlannerSummary({
    selectedClasses: snapshot.selectedClasses,
    coursesById: courseById,
    meetings: data.meetings,
    conflicts: snapshot.conflicts,
  })
  const detailedConflicts = buildDetailedScheduleConflicts({
    conflicts: snapshot.conflicts,
    classesById: classById,
    meetings: data.meetings,
  })
  const curriculumPeriodPositions = new Map(
    curriculum?.periods.map((period) => [String(period.id), period.position]) ??
      [],
  )
  const curriculumGuideCourses =
    guideSource === 'saved' && guideCurriculumId
      ? (curriculum?.courses ?? []).flatMap((item) => {
          const course = courseById.get(Number(item.courseId))
          if (!course) return []
          return [
            {
              course,
              semester: item.periodId
                ? (curriculumPeriodPositions.get(String(item.periodId)) ?? 0)
                : 0,
            },
          ]
        })
      : guideSource === 'suggestion' && anonymousSuggestionCourseIds
        ? anonymousSuggestionCourseIds.flatMap((semester) =>
            semester.courseIds.flatMap((courseId) => {
              const course = courseById.get(courseId)
              return course ? [{ course, semester: semester.semester }] : []
            }),
          )
        : []
  const guideCourses = curriculumGuideCourses.filter(
    (item, index, items) =>
      items.findIndex((other) => other.course.id === item.course.id) === index,
  )
  const scheduledCourseIds = new Set(
    document.classIds.flatMap((classId) => {
      const courseId = classById.get(classId)?.courseId
      return courseId === undefined ? [] : [courseId]
    }),
  )
  const selectedProgramBlocks = programGuideBlocks(
    selectedProgramCatalog,
    programCatalogProgramVariantId,
    programLanguageId,
  )
  const guideClassContext = buildGuideClassContext(
    guideMode,
    guideCourses,
    selectedProgramBlocks,
    manualCourseIds,
    courseById,
  )
  const filteredGuideClasses = filterClassesGuide({
    filters,
    courses: data.courses,
    classes: data.classes,
    meetings: data.meetings,
    selectedClassIds: selectedIds,
    completedCourseIds,
    guideClassContext,
    eligibility,
  })
  const disciplineGuideClasses = filterClassesGuide({
    filters: { ...filters, courseId: '' },
    courses: data.courses,
    classes: data.classes,
    meetings: data.meetings,
    selectedClassIds: selectedIds,
    completedCourseIds,
    guideClassContext,
    eligibility,
  })
  const courseClassAvailability = buildCourseClassAvailability({
    classes: data.classes,
    matchingClasses: disciplineGuideClasses,
  })
  const matchingCourseIds = new Set(
    disciplineGuideClasses.map((classItem) => classItem.courseId),
  )
  const selectedCourseIds = new Set(
    data.classes
      .filter((classItem) => selectedIds.has(classItem.id))
      .map((classItem) => classItem.courseId),
  )
  const normalizedDisciplineSearch = filters.search
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
  const hasRestrictiveGuideFilters = Boolean(
    filters.search ||
    filters.start ||
    filters.end ||
    filters.timePeriods.length ||
    filters.days.length ||
    filters.withoutConflict ||
    filters.withoutCompleted ||
    filters.withoutIncluded ||
    filters.prerequisitesSatisfied ||
    filters.reservationMatched,
  )
  const disciplineMatchesFilters = (course: SemesterCourse) => {
    if (
      filters.prerequisitesSatisfied &&
      eligibility.prerequisitesReady &&
      !eligibility.acceptedCourseIds.has(course.id)
    )
      return false
    if (
      filters.reservationMatched &&
      eligibility.reservationsReady &&
      !matchingCourseIds.has(course.id)
    )
      return false
    if (matchingCourseIds.has(course.id)) return true
    if (filters.withoutCompleted && completedCourseIds.has(course.id))
      return false
    if (filters.withoutIncluded && selectedCourseIds.has(course.id))
      return false
    if (
      normalizedDisciplineSearch &&
      !`${course.code} ${course.name}`
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('pt-BR')
        .includes(normalizedDisciplineSearch)
    )
      return false
    const totalClasses = courseClassAvailability.get(course.id)?.total ?? 0
    if (totalClasses === 0) return !filters.withoutUnavailable
    return hasRestrictiveGuideFilters
  }
  const disciplineResultCount = [...matchingCourseIds].filter(
    (courseId) => !scheduledCourseIds.has(courseId),
  ).length
  const manualCourseIdSet = new Set(manualCourseIds)
  function coursesForElectiveRequirement(
    requirement: (typeof selectedProgramBlocks)[number]['blocks']['electives'][number],
  ) {
    const courseIds = new Set<number>()
    for (const selector of requirement.eligibleCourses) {
      if (selector.type === 'specificCourse') {
        courseIds.add(Number(selector.courseId))
        continue
      }
      if (selector.type === 'prefix') {
        const prefix = selector.prefix.toUpperCase()
        for (const course of courseById.values()) {
          if (course.code.toUpperCase().startsWith(prefix))
            courseIds.add(course.id)
        }
      }
    }
    return [...courseIds]
      .flatMap((courseId) => {
        const course = courseById.get(courseId)
        return course &&
          !scheduledCourseIds.has(course.id) &&
          !manualCourseIdSet.has(course.id) &&
          disciplineMatchesFilters(course)
          ? [course]
          : []
      })
      .sort((left, right) => left.code.localeCompare(right.code, 'pt-BR'))
  }
  const visibleManualCourses = manualCourseIds.flatMap((courseId) => {
    const course = courseById.get(courseId)
    return course &&
      !scheduledCourseIds.has(course.id) &&
      disciplineMatchesFilters(course)
      ? [{ course, semester: 0 }]
      : []
  })
  const visibleDisciplineGroups = guideCourses
    .filter(
      ({ course }) =>
        !scheduledCourseIds.has(course.id) &&
        !manualCourseIdSet.has(course.id) &&
        disciplineMatchesFilters(course),
    )
    .reduce<Array<{ semester: number; courses: typeof guideCourses }>>(
      (groups, item) => {
        const group = groups.at(-1)
        if (group?.semester === item.semester) group.courses.push(item)
        else {
          const existing = groups.find(
            (candidate) => candidate.semester === item.semester,
          )
          if (existing) existing.courses.push(item)
          else groups.push({ semester: item.semester, courses: [item] })
        }
        return groups
      },
      [],
    )
    .sort((left, right) => left.semester - right.semester)
    .map((group) => ({
      ...group,
      courses: [...group.courses].sort((left, right) =>
        left.course.code.localeCompare(right.course.code),
      ),
    }))

  return {
    classById,
    courseById,
    courseClassAvailability,
    coursesForElectiveRequirement,
    detailedConflicts,
    disciplineMatchesFilters,
    disciplineResultCount,
    filteredGuideClasses,
    guideClassContext,
    hasRestrictiveGuideFilters,
    manualCourseIdSet,
    plannerSummary,
    scheduledCourseIds,
    selectedClassIdsWithConflict,
    selectedIds,
    selectedProgramBlocks,
    visibleDisciplineGroups,
    visibleManualCourses,
  }
}
