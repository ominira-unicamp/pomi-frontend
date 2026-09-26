import { matchesGuideCourse, scheduleDays } from '@pomi/planner-domain/semester'
import type {
  GuideClassContext,
  SemesterCourse,
} from '@pomi/planner-domain/semester'

import type { AnyFilterDefinition } from '@/components/filters'
import type {
  ClassesGuideFilters,
  TimePeriod,
} from '@/features/semester-planner/hooks/useClassesGuideFilters'
import { defineFilter } from '@/components/filters'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'

const periodLabels: Record<TimePeriod, string> = {
  morning: 'Manhã',
  afternoon: 'Tarde',
  evening: 'Noite',
}

export function classesGuideFilterDefinitions({
  mode,
  courses,
  guideClassContext,
}: {
  mode: 'disciplines' | 'classes'
  courses: ReadonlyArray<SemesterCourse>
  guideClassContext: GuideClassContext
}): ReadonlyArray<AnyFilterDefinition<ClassesGuideFilters>> {
  const courseById = new Map(courses.map((course) => [course.id, course]))
  const courseOptions = courses
    .filter((course) => matchesGuideCourse(course, guideClassContext))
    .map((course) => ({
      value: String(course.id),
      label: `${course.code} — ${course.name}`,
    }))

  return [
    defineFilter<ClassesGuideFilters, string>({
      key: 'discipline',
      label: 'Disciplina',
      source: 'local',
      operators: ['eq'],
      isAvailable: () => mode === 'classes',
      editor: {
        type: 'custom',
        render: ({ value, onChange }) => (
          <AutocompleteSelect
            ariaLabel="Filtrar turmas por disciplina"
            value={value}
            emptyLabel="Todas as disciplinas"
            options={courseOptions}
            placeholder="Disciplina"
            onValueChange={onChange}
          />
        ),
      },
      read: (state) => state.courseId,
      update: (state, courseId) => ({ ...state, courseId }),
      clear: (state) => ({ ...state, courseId: '' }),
      isActive: Boolean,
      summarize: (courseId) =>
        courseById.get(Number(courseId))?.code ?? courseId,
    }),
    defineFilter<
      ClassesGuideFilters,
      Readonly<{
        minimum: string
        maximum: string
        periods: ReadonlyArray<TimePeriod>
      }>
    >({
      key: 'time',
      label: 'Horário',
      source: 'local',
      operators: ['gte', 'lte', 'in'],
      editor: {
        type: 'range',
        inputType: 'time',
        minimumLabel: 'A partir de',
        maximumLabel: 'Até',
      },
      read: (state) => ({
        minimum: state.start,
        maximum: state.end,
        periods: state.timePeriods,
      }),
      update: (state, value) => ({
        ...state,
        start: value.minimum,
        end: value.maximum,
        timePeriods: value.minimum || value.maximum ? [] : value.periods,
      }),
      clear: (state) => ({
        ...state,
        start: '',
        end: '',
        timePeriods: [],
      }),
      isActive: (value) =>
        Boolean(value.minimum || value.maximum || value.periods.length),
      summarize: (value) =>
        value.periods.length
          ? value.periods.map((period) => periodLabels[period]).join(', ')
          : `${value.minimum || '00:00'}–${value.maximum || '24:00'}`,
    }),
    defineFilter<ClassesGuideFilters, ReadonlyArray<string>>({
      key: 'days',
      label: 'Dias',
      source: 'local',
      operators: ['in'],
      editor: {
        type: 'multiSelect',
        options: scheduleDays.map(([value, label]) => ({ value, label })),
      },
      read: (state) => state.days,
      update: (state, days) => ({ ...state, days }),
      clear: (state) => ({ ...state, days: [] }),
      isActive: (days) => days.length > 0,
      summarize: (selected) =>
        selected
          .map(
            (value) =>
              scheduleDays.find(([day]) => day === value)?.[1] ?? value,
          )
          .join(', '),
    }),
    ...(
      [
        ['withoutConflict', 'Sem conflitos'],
        ['withoutCompleted', 'Só pendentes'],
        ['withoutIncluded', 'Ocultar adicionadas'],
        ['withoutUnavailable', 'Ocultar sem turmas'],
      ] as const
    ).map(([key, label]) =>
      defineFilter<ClassesGuideFilters, boolean>({
        key,
        label,
        source: 'local',
        operators: ['eq'],
        isAvailable: () =>
          key !== 'withoutUnavailable' || mode === 'disciplines',
        editor: { type: 'boolean' },
        read: (state) => state[key],
        update: (state, value) => ({ ...state, [key]: value }),
        clear: (state) => ({ ...state, [key]: false }),
        isActive: Boolean,
        summarize: () => 'Ativado',
      }),
    ),
  ]
}

export function toggleTimePeriod(
  filters: ClassesGuideFilters,
  period: TimePeriod,
): ClassesGuideFilters {
  return {
    ...filters,
    timePeriods: filters.timePeriods.includes(period)
      ? filters.timePeriods.filter((item) => item !== period)
      : [...filters.timePeriods, period],
    start: '',
    end: '',
  }
}
