import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'

export function CreationWizard({
  step,
  steps,
  children,
  canContinue = true,
  isSubmitting = false,
  submitLabel,
  onBack,
  onCancel,
  onContinue,
}: {
  step: number
  steps: ReadonlyArray<string>
  children: ReactNode
  canContinue?: boolean
  isSubmitting?: boolean
  submitLabel: string
  onBack: () => void
  onCancel: () => void
  onContinue: () => void
}) {
  const lastStep = step === steps.length - 1
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <ol className="grid gap-2 sm:grid-cols-3" aria-label="Etapas da criação">
        {steps.map((label, index) => (
          <li
            key={label}
            aria-current={index === step ? 'step' : undefined}
            className={`rounded-md border-2 px-3 py-2 text-sm font-bold ${index === step ? 'border-primary bg-primary/10' : 'border-strong-border/30 text-muted-foreground'}`}
          >
            {index + 1}. {label}
          </li>
        ))}
      </ol>
      <section className="rounded-md border-2 border-strong-border bg-card p-5 shadow-[4px_4px_0_var(--strong-border)] sm:p-7">
        {children}
      </section>
      <div className="flex flex-wrap justify-between gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <div className="flex gap-3">
          {step > 0 && (
            <Button variant="outline" onClick={onBack}>
              Voltar
            </Button>
          )}
          <Button
            disabled={!canContinue || isSubmitting}
            onClick={onContinue}
          >
            {lastStep ? submitLabel : 'Continuar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
