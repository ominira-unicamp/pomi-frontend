import type {
  CatalogProgramInformation,
  CatalogProgramOption,
  CatalogProgramVariantOption,
} from '@pomi/planner-domain/curriculum'
import { InlineMessage } from '@/components/patterns/InlineMessage'
import { Section, SectionTitle } from '@/components/patterns/Section'

const missing = 'Não informado neste catálogo'
const formatNumber = (value: number) => value.toLocaleString('pt-BR')

function creditLimitDescription(information?: CatalogProgramInformation) {
  if (!information) return missing
  switch (information.creditLimitType) {
    case 'NONE':
      return 'Não há limite de créditos para matrícula semestral informado pelo catálogo.'
    case 'FIXED':
      return information.creditLimitFixedCredits == null
        ? missing
        : `Máximo de ${formatNumber(information.creditLimitFixedCredits)} créditos por período letivo.`
    case 'CR_FORMULA': {
      const {
        creditLimitBeforeThresholdCredits: before,
        creditLimitThresholdCredits: threshold,
        creditLimitCrBase: base,
        creditLimitCrMultiplier: multiplier,
      } = information
      if (
        before == null ||
        threshold == null ||
        base == null ||
        multiplier == null
      )
        return missing
      return `Até que tenha matrícula em ${formatNumber(threshold)} créditos: máximo de ${formatNumber(before)} créditos por período letivo.\n\nA partir do período seguinte em que tenha totalizado matrícula em ${formatNumber(threshold)} créditos: máximo de ${formatNumber(base)} + ${formatNumber(multiplier)} × CR créditos por período letivo. CR é o coeficiente de rendimento.`
    }
    default:
      return missing
  }
}

function InformationText({
  title,
  text,
}: {
  title: string
  text?: string | null
}) {
  return (
    <Section>
      <SectionTitle className="mb-3">{title}</SectionTitle>
      <p className="whitespace-pre-line break-words text-sm leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">
        {text?.trim() || missing}
      </p>
    </Section>
  )
}

export function CatalogProgramAbout({
  program,
  variant,
}: {
  program: CatalogProgramOption
  variant?: CatalogProgramVariantOption
}) {
  const information = program.information
  const variantInformation = variant?.information
  const shift =
    information?.shift === 'DAYTIME'
      ? 'Integral'
      : information?.shift === 'NIGHT'
        ? 'Noturno'
        : missing
  const metrics = [
    [
      'Créditos exigidos',
      variantInformation?.integralizationCredits,
      'créditos',
    ],
    [
      'Duração prevista',
      variantInformation?.integralizationSemesters,
      'semestres',
    ],
    [
      'Prazo máximo',
      variantInformation?.integralizationMaximumSemesters,
      'semestres',
    ],
    [
      'Atividades supervisionadas',
      variantInformation?.integralizationSupervisedHours,
      'h',
    ],
    ['Extensão', variantInformation?.integralizationExtensionHours, 'h'],
  ] as const

  return (
    <div className="space-y-8">
      <Section className="border-b border-border pb-5">
        <SectionTitle>Sobre o curso</SectionTitle>
        <p className="mt-2 text-sm text-muted-foreground">
          Catálogo {program.catalog.year}
          {variant ? ` · ${variant.code} — ${variant.name}` : ''}
        </p>
        <p className="mt-2 text-sm">
          <span className="font-bold">Turno:</span> {shift}
        </p>
      </Section>
      {variant ? (
        <Section>
          <SectionTitle className="mb-4">Integralização</SectionTitle>
          <dl className="grid gap-x-6 gap-y-5 min-[480px]:grid-cols-2 lg:grid-cols-3">
            {metrics.map(([label, value, unit]) => (
              <div key={label} className="min-w-0 border-t border-border pt-3">
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd
                  className={
                    value == null
                      ? 'mt-1 text-sm'
                      : 'mt-1 text-xl font-extrabold'
                  }
                >
                  {value == null ? missing : `${formatNumber(value)} ${unit}`}
                </dd>
              </div>
            ))}
          </dl>
        </Section>
      ) : (
        <InlineMessage>
          Selecione uma modalidade para consultar a integralização, o perfil
          profissional e o reconhecimento.
        </InlineMessage>
      )}
      <InformationText
        title="Matrícula semestral"
        text={creditLimitDescription(information)}
      />
      {variant && (
        <InformationText
          title="O profissional"
          text={variantInformation?.professionalDescription}
        />
      )}
      {information?.professionalPracticeDescription?.trim() && (
        <InformationText
          title="Exercício profissional"
          text={information.professionalPracticeDescription}
        />
      )}
      {variant && (
        <InformationText
          title="Reconhecimento"
          text={variantInformation?.recognitionDescription}
        />
      )}
    </div>
  )
}
