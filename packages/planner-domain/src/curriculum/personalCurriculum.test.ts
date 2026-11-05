import { describe, expect, it } from 'vitest'
import { buildPersonalCurriculum } from './personalCurriculum'
import type {
  CatalogId,
  CatalogProgramId,
  CatalogProgramOption,
  CatalogProgramVariantId,
  Course,
  CourseId,
  CurriculumBlocks,
  LanguageId,
  ProgramId,
} from './curriculumPlanner'

const id = (value: string) => value as CourseId
const course = (value: string): Course => ({
  id: id(value),
  code: value,
  name: value,
  credits: 4,
})
const mandatory = (value: string): CurriculumBlocks => ({
  mandatory: [
    {
      type: 'course',
      source: { type: 'base' },
      selector: { type: 'specificCourse', courseId: id(value) },
    },
  ],
  electives: [],
})
const program: CatalogProgramOption = {
  id: '1' as CatalogProgramId,
  title: 'Computação',
  catalog: { id: '1' as CatalogId, year: 2023 },
  program: { id: '1' as ProgramId, code: '42', name: 'Computação' },
  baseBlocks: mandatory('MC102'),
  variants: [],
  languages: [],
}
const courses = [course('MC102'), course('MC202'), course('LA111')]

describe('personal curriculum projection', () => {
  it('preserves approval and enrollment independently across repeated attempts', () => {
    const result = buildPersonalCurriculum({
      program,
      courses,
      records: [
        { courseId: id('MC102'), approved: false, enrolled: false },
        { courseId: id('MC102'), approved: true, enrolled: false },
        { courseId: id('MC102'), approved: false, enrolled: true },
      ],
    })
    expect(result.groups[0].courses[0]).toMatchObject({
      approved: true,
      enrolled: true,
      attemptCount: 3,
    })
    expect(result.approvedMandatoryCount).toBe(1)
    expect(result.mandatoryCount).toBe(1)
  })

  it('aggregates an extensive history without duplicating required courses', () => {
    const result = buildPersonalCurriculum({
      program,
      courses,
      records: Array.from({ length: 10000 }, (_, index) => ({
        courseId: id('MC102'),
        approved: index === 9999,
        enrolled: index === 9998,
      })),
    })
    expect(result.groups[0].courses[0]).toMatchObject({
      approved: true,
      enrolled: true,
      attemptCount: 10000,
    })
    expect(result.approvedMandatoryCount).toBe(1)
    expect(result.mandatoryCount).toBe(1)
  })
  it('does not infer equivalence from an approval in another course', () => {
    const result = buildPersonalCurriculum({
      program,
      courses,
      records: [{ courseId: id('MC202'), approved: true, enrolled: false }],
    })
    expect(result.groups[0].courses[0]).toMatchObject({
      approved: false,
      attemptCount: 0,
    })
    expect(result.approvedMandatoryCount).toBe(0)
  })

  it('selects only the saved language and specialization without summing alternatives', () => {
    const selectedProgram: CatalogProgramOption = {
      ...program,
      variants: [
        {
          id: '2' as CatalogProgramVariantId,
          specializationId: 2,
          code: 'A',
          name: 'A',
          blocks: mandatory('MC202'),
        },
        {
          id: '3' as CatalogProgramVariantId,
          specializationId: 3,
          code: 'B',
          name: 'B',
          blocks: mandatory('LA111'),
        },
      ],
      languages: [
        { id: '1' as LanguageId, name: 'Língua 1', blocks: mandatory('LA111') },
        { id: '2' as LanguageId, name: 'Língua 2', blocks: mandatory('MC202') },
      ],
    }
    const result = buildPersonalCurriculum({
      program: selectedProgram,
      specializationId: 2,
      languageId: '1' as LanguageId,
      courses,
      records: [],
    })
    expect(result.groups.map((group) => group.key)).toEqual([
      'base-mandatory',
      'variant-2-mandatory',
      'language-1-mandatory',
    ])
    expect(result.missingVariant).toBe(false)
    expect(result.missingLanguage).toBe(false)
    const incomplete = buildPersonalCurriculum({
      program: selectedProgram,
      specializationId: 99,
      languageId: '99' as LanguageId,
      courses,
      records: [],
    })
    expect(incomplete.groups).toHaveLength(1)
    expect(incomplete.missingVariant).toBe(true)
    expect(incomplete.missingLanguage).toBe(true)
  })

  it('keeps overlapping elective options without allocating or summing their credits', () => {
    const result = buildPersonalCurriculum({
      program: {
        ...program,
        baseBlocks: {
          mandatory: program.baseBlocks.mandatory,
          electives: [
            {
              type: 'electiveCredits',
              source: { type: 'base' },
              requiredCredits: 8,
              eligibleCourses: [{ type: 'prefix', prefix: 'MC' }],
            },
            {
              type: 'electiveCredits',
              source: { type: 'base' },
              requiredCredits: 4,
              eligibleCourses: [{ type: 'anyCourse' }],
            },
          ],
        },
      },
      courses,
      records: [{ courseId: id('MC102'), approved: true, enrolled: false }],
    })
    expect(result.groups[1].courses).toHaveLength(2)
    expect(result.groups[2].courses).toHaveLength(3)
    expect(result.groups[1].requiredCredits).toBe(8)
    expect(result.groups[1]).not.toHaveProperty('earnedCredits')
    expect(result.groups[2]).not.toHaveProperty('remainingCredits')
    expect(result.approvedMandatoryCount).toBe(1)
  })

  it('does not expand broad mandatory selectors into individual obligations and reports missing metadata', () => {
    const result = buildPersonalCurriculum({
      program: {
        ...program,
        baseBlocks: {
          mandatory: [
            ...mandatory('UNKNOWN').mandatory,
            {
              type: 'course',
              source: { type: 'base' },
              selector: { type: 'prefix', prefix: 'MC' },
            },
          ],
          electives: [],
        },
      },
      courses,
      records: [],
    })
    expect(result.groups[0].courses).toEqual([])
    expect(result.groups[0].unresolvedSelectors).toHaveLength(2)
    expect(result.mandatoryCount).toBe(0)
  })

  it('deduplicates required courses across sources and catalog entries', () => {
    const result = buildPersonalCurriculum({
      program: {
        ...program,
        languages: [
          { id: '1' as LanguageId, name: 'Língua', blocks: mandatory('MC102') },
        ],
      },
      languageId: '1' as LanguageId,
      courses: [...courses, course('MC102')],
      records: [],
    })
    expect(result.groups).toHaveLength(2)
    expect(result.groups[0].courses).toHaveLength(1)
    expect(result.mandatoryCount).toBe(1)
  })
})
