import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CatalogProgramAbout } from './CatalogProgramAbout'
import type {
  CatalogProgramOption,
  CatalogProgramVariantOption,
} from '@pomi/planner-domain/curriculum'

const variant: CatalogProgramVariantOption = {
  id: '7' as CatalogProgramVariantOption['id'],
  specializationId: 1,
  code: 'AA',
  name: 'Sistemas de Computação',
  blocks: { mandatory: [], electives: [] },
  information: {
    integralizationCredits: 243,
    integralizationSupervisedHours: 3645,
    integralizationExtensionHours: 0,
    integralizationSemesters: 10,
    integralizationMaximumSemesters: 16,
    professionalDescription: 'Primeiro parágrafo.\n\nSegundo parágrafo.',
    recognitionDescription: '<strong>Portaria oficial</strong>',
  },
}
const program: CatalogProgramOption = {
  id: '1' as CatalogProgramOption['id'],
  title: 'Engenharia de Computação',
  catalog: { id: '1' as CatalogProgramOption['catalog']['id'], year: 2026 },
  program: {
    id: '34' as CatalogProgramOption['program']['id'],
    code: '34',
    name: 'Engenharia de Computação',
  },
  baseBlocks: { mandatory: [], electives: [] },
  variants: [variant],
  languages: [],
  information: {
    shift: 'DAYTIME',
    creditLimitType: 'FIXED',
    creditLimitFixedCredits: 30,
    creditLimitBeforeThresholdCredits: null,
    creditLimitThresholdCredits: null,
    creditLimitCrBase: null,
    creditLimitCrMultiplier: null,
    professionalPracticeDescription: 'Exercício profissional.',
  },
}

describe('CatalogProgramAbout', () => {
  it('shows catalog data, preserves zero and renders official text without HTML', () => {
    render(<CatalogProgramAbout program={program} variant={variant} />)
    expect(screen.getByText('243 créditos')).toBeTruthy()
    expect(screen.getByText('3.645 h')).toBeTruthy()
    expect(screen.getByText('0 h')).toBeTruthy()
    expect(screen.getByText('Integral')).toBeTruthy()
    expect(
      screen.getByText('Máximo de 30 créditos por período letivo.'),
    ).toBeTruthy()
    expect(
      screen
        .getByText('<strong>Portaria oficial</strong>')
        .querySelector('strong'),
    ).toBeNull()
  })

  it('keeps common information and requests a variant without selecting one implicitly', () => {
    render(<CatalogProgramAbout program={program} />)
    expect(screen.getByText(/Selecione uma modalidade/)).toBeTruthy()
    expect(screen.getByText('Exercício profissional.')).toBeTruthy()
    expect(screen.queryByText('243 créditos')).toBeNull()
  })

  it('shows missing values and never uses another catalog or variant', () => {
    const { rerender } = render(
      <CatalogProgramAbout program={program} variant={variant} />,
    )
    rerender(
      <CatalogProgramAbout
        program={{
          ...program,
          catalog: { ...program.catalog, year: 2025 },
          information: undefined,
        }}
        variant={{ ...variant, information: undefined }}
      />,
    )
    expect(screen.getByText(/Catálogo 2025/)).toBeTruthy()
    expect(screen.queryByText('243 créditos')).toBeNull()
    expect(
      screen.getAllByText('Não informado neste catálogo').length,
    ).toBeGreaterThan(5)
  })

  it('describes both stages of the CR rule without calculating a personal limit', () => {
    render(
      <CatalogProgramAbout
        program={{
          ...program,
          information: {
            ...program.information!,
            creditLimitType: 'CR_FORMULA',
            creditLimitFixedCredits: null,
            creditLimitBeforeThresholdCredits: 30,
            creditLimitThresholdCredits: 90,
            creditLimitCrBase: 20,
            creditLimitCrMultiplier: 20.5,
          },
        }}
        variant={variant}
      />,
    )
    expect(
      screen.getByText(/Até que tenha matrícula em 90 créditos/).textContent,
    ).toContain('20 + 20,5 × CR')
    expect(
      screen.getByText(/Até que tenha matrícula em 90 créditos/).textContent,
    ).toContain('período seguinte')
  })

  it('distinguishes no limit from an incomplete rule', () => {
    const { rerender } = render(
      <CatalogProgramAbout
        program={{
          ...program,
          information: { ...program.information!, creditLimitType: 'NONE' },
        }}
      />,
    )
    expect(screen.getByText(/Não há limite de créditos/)).toBeTruthy()
    rerender(
      <CatalogProgramAbout
        program={{
          ...program,
          information: {
            ...program.information!,
            creditLimitType: 'CR_FORMULA',
          },
        }}
      />,
    )
    expect(screen.getByText('Não informado neste catálogo')).toBeTruthy()
    expect(screen.queryByText(/× CR/)).toBeNull()
  })
})
