function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function list(value: unknown, validate: (item: unknown) => boolean) {
  return Array.isArray(value) && value.every(validate)
}

function entity(value: unknown) {
  return (
    record(value) &&
    (typeof value.id === 'string' || typeof value.id === 'number')
  )
}

function course(value: unknown) {
  return (
    entity(value) &&
    record(value) &&
    typeof value.code === 'string' &&
    typeof value.name === 'string' &&
    typeof value.credits === 'number'
  )
}

function blocks(value: unknown): boolean {
  return (
    record(value) &&
    list(value.mandatory, (item) => record(item) && record(item.selector)) &&
    list(
      value.electives,
      (item) =>
        record(item) &&
        typeof item.requiredCredits === 'number' &&
        list(item.eligibleCourses, record),
    )
  )
}

function program(value: unknown) {
  return (
    entity(value) &&
    record(value) &&
    record(value.catalog) &&
    record(value.program) &&
    blocks(value.baseBlocks) &&
    list(value.variants, (item) => record(item) && blocks(item.blocks)) &&
    list(value.languages, (item) => record(item) && blocks(item.blocks))
  )
}

export function isCompatiblePublicStaticData(
  key: string,
  value: unknown,
): boolean {
  if (key === 'curriculum-planner:static-data')
    return (
      record(value) &&
      list(value.courses, course) &&
      list(value.catalogPrograms, program)
    )
  if (key === 'semester-planner:study-periods')
    return list(
      value,
      (item) =>
        entity(item) &&
        record(item) &&
        typeof item.year === 'number' &&
        typeof item.yearPeriod === 'string',
    )
  if (key === 'semester-planner:courses') return list(value, course)
  if (key.startsWith('semester-planner:classes:'))
    return list(
      value,
      (item) =>
        entity(item) &&
        record(item) &&
        typeof item.code === 'string' &&
        typeof item.courseId === 'number' &&
        typeof item.courseCode === 'string' &&
        list(
          item.professors,
          (professor) =>
            entity(professor) &&
            record(professor) &&
            typeof professor.name === 'string',
        ),
    )
  if (key.startsWith('semester-planner:meetings:'))
    return list(
      value,
      (item) =>
        entity(item) &&
        record(item) &&
        typeof item.classId === 'number' &&
        typeof item.dayOfWeek === 'string' &&
        typeof item.start === 'string' &&
        typeof item.end === 'string' &&
        typeof item.roomCode === 'string',
    )
  if (key === 'semester-planner:professor-evaluation-summaries')
    return list(
      value,
      (item) =>
        record(item) &&
        entity(item.professor) &&
        record(item.professor) &&
        typeof item.professor.name === 'string' &&
        [
          'responseCount',
          'wouldTakeAgain',
          'fairness',
          'clarity',
          'difficulty',
        ].every((field) => typeof item[field] === 'number'),
    )
  return true
}
