import { describe, expect, it, vi } from 'vitest'
import { emptyGuide } from '@pomi/planner-domain/semester'
import { createSemesterPlanningSession } from './semesterPlanningSession'
import type { SemesterPlanningDocument } from '@pomi/planner-domain/semester'

const document: SemesterPlanningDocument = {
  name: 'Original',
  studyPeriodId: null,
  curriculumId: null,
  classIds: [],
  guide: emptyGuide(),
}
const data = { courses: [], studyPeriods: [], classes: [], meetings: [] }
function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason: Error) => void
  const promise = new Promise<T>((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}
describe('semester planning session', () => {
  it('retains edits after failure and retries the latest document explicitly', async () => {
    const save = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockImplementation((value: SemesterPlanningDocument) =>
        Promise.resolve(value),
      )
    const session = createSemesterPlanningSession({ data, document, save })
    await session.dispatch({ type: 'rename', name: 'Primeira' })
    await vi.waitFor(() => expect(session.getState().saveStatus).toBe('error'))
    await session.dispatch({ type: 'rename', name: 'Segunda' })
    expect(save).toHaveBeenCalledTimes(1)
    expect(session.getState().confirmed.name).toBe('Original')
    expect(session.getState().snapshot?.document.name).toBe('Segunda')
    expect(await session.flush()).toBe(true)
    expect(save.mock.calls[1][0].name).toBe('Segunda')
    expect(session.getState().saveStatus).toBe('clean')
  })
  it('does not confirm a newer edit with an older response and serializes writes', async () => {
    const first = deferred<SemesterPlanningDocument>()
    const second = deferred<SemesterPlanningDocument>()
    const save = vi
      .fn()
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise)
    const session = createSemesterPlanningSession({ data, document, save })
    await session.dispatch({ type: 'rename', name: 'Primeira' })
    await session.dispatch({ type: 'rename', name: 'Segunda' })
    expect(save).toHaveBeenCalledTimes(1)
    first.resolve({ ...document, name: 'Primeira' })
    await vi.waitFor(() => expect(save).toHaveBeenCalledTimes(2))
    expect(session.getState().confirmed.name).toBe('Primeira')
    expect(session.hasPending()).toBe(true)
    second.resolve({ ...document, name: 'Segunda' })
    await session.flush()
    expect(session.getState().confirmed.name).toBe('Segunda')
    expect(session.hasPending()).toBe(false)
  })
  it('ignores a response after the session is disposed', async () => {
    const request = deferred<SemesterPlanningDocument>()
    const session = createSemesterPlanningSession({
      data,
      document,
      save: () => request.promise,
    })
    await session.dispatch({ type: 'rename', name: 'Pendente' })
    session.dispose()
    request.resolve({ ...document, name: 'Pendente' })
    expect(await session.flush()).toBe(false)
    expect(session.getState().confirmed.name).toBe('Original')
  })
})

it('updates schedule data without discarding pending edits', async () => {
  const save = vi.fn().mockRejectedValue(new Error('offline'))
  const session = createSemesterPlanningSession({
    data,
    document: { ...document, studyPeriodId: 1 },
    save,
  })
  await session.dispatch({ type: 'rename', name: 'Em edição' })
  await vi.waitFor(() => expect(session.getState().saveStatus).toBe('error'))
  await session.updateData({
    ...data,
    courses: [{ id: 1, code: 'MC102', name: 'Algoritmos', credits: 6 }],
    classes: [
      { id: 10, code: 'A', courseId: 1, courseCode: 'MC102', professors: [] },
    ],
  })
  expect((await session.dispatch({ type: 'addClass', classId: 10 })).ok).toBe(
    true,
  )
  expect(session.getState().snapshot?.document.classIds).toEqual([10])
  expect(session.getState().snapshot?.document.name).toBe('Em edição')
  expect(session.getState().confirmed.name).toBe('Original')
  expect(save).toHaveBeenCalledOnce()
})
