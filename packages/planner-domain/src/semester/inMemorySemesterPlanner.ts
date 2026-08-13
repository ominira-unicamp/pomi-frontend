import { classMeetings, scheduleConflicts } from './semesterPlanner'
import type {
  ClassEvaluation,
  SemesterPlanner,
  SemesterPlannerCommand,
  SemesterPlannerResult,
  SemesterPlannerSnapshot,
  SemesterPlannerStaticData,
  SemesterPlanningDocument,
} from './semesterPlanner'

const ok = <T>(value: T): SemesterPlannerResult<T> => ({ ok: true, value })
const fail = <T = never>(
  error: Extract<SemesterPlannerResult<T>, { ok: false }>['error'],
): SemesterPlannerResult<T> => ({ ok: false, error })

export function createInMemorySemesterPlanner({
  staticData,
  initialDocument = {
    name: 'Novo planejamento de semestre',
    studyPeriodId: null,
    curriculumId: null,
    classIds: [],
    guide: {
      mode: 'none',
      curriculum: {
        source: null,
        curriculumId: null,
        suggestionId: null,
        suggestionCatalogProgramId: null,
      },
      program: {
        catalogProgramId: null,
        specializationId: null,
        languageId: null,
      },
      manualCourseIds: [],
    },
  },
}: Readonly<{
  staticData: SemesterPlannerStaticData
  initialDocument?: SemesterPlanningDocument
}>): SemesterPlanner {
  let document = structuredClone(initialDocument)

  function snapshot(): SemesterPlannerSnapshot {
    const selectedClasses = document.classIds
      .map((id) => staticData.classes.find((item) => item.id === id))
      .filter((item): item is SemesterPlannerStaticData['classes'][number] =>
        Boolean(item),
      )
    return {
      document: structuredClone(document),
      selectedClasses,
      conflicts: scheduleConflicts(staticData, document.classIds),
    }
  }

  function evaluateClass(
    classId: number,
  ): Promise<SemesterPlannerResult<ClassEvaluation>> {
    const classItem = staticData.classes.find((item) => item.id === classId)
    if (!classItem)
      return Promise.resolve(
        fail({ code: 'notFound', entity: 'class', id: String(classId) }),
      )
    if (document.studyPeriodId === null)
      return Promise.resolve(
        fail({ code: 'notFound', entity: 'studyPeriod', id: '' }),
      )
    const offered = staticData.classes.some((item) => item.id === classId)
    if (!offered)
      return Promise.resolve(fail({ code: 'classOutsideStudyPeriod', classId }))
    const replacesClassId = document.classIds.find(
      (selectedId) =>
        staticData.classes.find((item) => item.id === selectedId)?.courseId ===
        classItem.courseId,
    )
    const classIds = replacesClassId
      ? document.classIds.map((id) => (id === replacesClassId ? classId : id))
      : [...document.classIds, classId]
    return Promise.resolve(
      ok({
        classItem,
        meetings: classMeetings(staticData, classId),
        conflicts: scheduleConflicts(staticData, classIds),
        ...(replacesClassId ? { replacesClassId } : {}),
      }),
    )
  }

  async function dispatch(
    command: SemesterPlannerCommand,
  ): Promise<SemesterPlannerResult> {
    switch (command.type) {
      case 'selectStudyPeriod':
        if (
          !staticData.studyPeriods.some(
            (period) => period.id === command.studyPeriodId,
          )
        )
          return fail({
            code: 'notFound',
            entity: 'studyPeriod',
            id: String(command.studyPeriodId),
          })
        if (
          document.classIds.length > 0 &&
          document.studyPeriodId !== command.studyPeriodId
        )
          return fail({
            code: 'classOutsideStudyPeriod',
            classId: document.classIds[0],
          })
        document = { ...document, studyPeriodId: command.studyPeriodId }
        return ok(undefined)
      case 'rename':
        document = { ...document, name: command.name.trim() || document.name }
        return ok(undefined)
      case 'selectCurriculum':
        document = {
          ...document,
          curriculumId: command.curriculumId,
          guide: {
            ...document.guide,
            mode: command.curriculumId === null ? 'none' : 'curriculum',
            curriculum: {
              ...document.guide.curriculum,
              source: command.curriculumId === null ? null : 'saved',
              curriculumId: command.curriculumId,
              suggestionId: null,
              suggestionCatalogProgramId: null,
            },
          },
        }
        return ok(undefined)
      case 'setGuide':
        document = {
          ...document,
          guide: structuredClone(command.guide),
          curriculumId: command.guide.curriculum.curriculumId,
        }
        return ok(undefined)
      case 'clearPlanning':
        document = { ...document, classIds: [] }
        return ok(undefined)
      case 'removeClass':
        document = {
          ...document,
          classIds: document.classIds.filter((id) => id !== command.classId),
        }
        return ok(undefined)
      case 'importPlanning':
        document = structuredClone(command.data)
        return ok(undefined)
      case 'addClass': {
        const evaluation = await evaluateClass(command.classId)
        if (!evaluation.ok) return evaluation
        if (evaluation.value.replacesClassId)
          return fail({
            code: 'courseAlreadyHasClass',
            currentClassId: evaluation.value.replacesClassId,
          })
        document = {
          ...document,
          classIds: [...document.classIds, command.classId],
        }
        return ok(undefined)
      }
      case 'replaceClass': {
        const evaluation = await evaluateClass(command.classId)
        if (!evaluation.ok) return evaluation
        document = {
          ...document,
          classIds: evaluation.value.replacesClassId
            ? document.classIds.map((id) =>
                id === evaluation.value.replacesClassId ? command.classId : id,
              )
            : [...document.classIds, command.classId],
        }
        return ok(undefined)
      }
    }
  }

  return {
    getStaticData: () => Promise.resolve(ok(staticData)),
    getSnapshot: () => Promise.resolve(ok(snapshot())),
    evaluateClass,
    dispatch,
  }
}
