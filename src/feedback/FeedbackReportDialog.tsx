import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

import type { FeedbackDraft } from '@/feedback/FeedbackReportProvider'
import type {
  FeedbackReportInput,
  FeedbackTarget,
} from '@/feedback/feedbackReportApi'
import { ApiError } from '@/api/errors'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { feedbackFeatureKeys } from '@/feedback/feedbackReportApi'

type Props = Readonly<{
  open: boolean
  onOpenChange: (open: boolean) => void
  initialDraft?: FeedbackDraft
  authenticated: boolean
  studentId?: number
  submitting: boolean
  submitted: boolean
  error: Error | null
  onSubmit: (draft: FeedbackDraft) => Promise<void>
  onLogin: (draft: FeedbackDraft) => void
}>

function useDesktopLayout() {
  const [desktop, setDesktop] = useState(
    () => window.matchMedia('(min-width: 640px)').matches,
  )

  useEffect(() => {
    const media = window.matchMedia('(min-width: 640px)')
    const update = () => setDesktop(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return desktop
}

function defaultInput(): FeedbackReportInput {
  return {
    kind: 'BUG',
    target: { type: 'GENERAL' },
    title: '',
    description: '',
    sourcePath: window.location.pathname,
  }
}

function featureLabel(feature: (typeof feedbackFeatureKeys)[number]) {
  return {
    home: 'Início',
    'curriculum-planner': 'Planejamento de currículo',
    'semester-planner': 'Planejamento de semestre',
    'course-situation': 'Situação do curso',
    agenda: 'Agenda',
    social: 'Amigos',
    'academic-data': 'Dados acadêmicos',
  }[feature]
}

function reportError(error: Error | null) {
  if (error instanceof ApiError) return error.problem?.detail ?? error.message
  return error?.message ?? ''
}

function Form({
  initialDraft,
  authenticated,
  studentId,
  submitting,
  submitted,
  error,
  onSubmit,
  onLogin,
  onClose,
}: Omit<Props, 'open' | 'onOpenChange'> & { onClose: () => void }) {
  const [input, setInput] = useState<FeedbackReportInput>(
    () => initialDraft?.input ?? defaultInput(),
  )
  const [identified, setIdentified] = useState(
    () => initialDraft?.identified ?? false,
  )
  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    setInput(initialDraft?.input ?? defaultInput())
    setIdentified(initialDraft?.identified ?? false)
    setValidationError('')
  }, [initialDraft])

  const academicTarget = input.target.type === 'ACADEMIC_RESOURCE'
  const setTarget = (target: FeedbackTarget) =>
    setInput((current) => ({ ...current, target }))
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (input.title.trim().length < 5) {
      setValidationError('Descreva o assunto em pelo menos 5 caracteres.')
      return
    }
    if (input.description.trim().length < 20) {
      setValidationError(
        'Descreva a sugestão ou problema em pelo menos 20 caracteres.',
      )
      return
    }
    const draft = { input, identified }
    if (identified && !authenticated) {
      onLogin(draft)
      return
    }
    if (identified && !studentId) {
      setValidationError(
        'Não foi possível identificar seu perfil de estudante.',
      )
      return
    }
    setValidationError('')
    await onSubmit(draft)
  }

  if (submitted) {
    return (
      <div className="space-y-5">
        <p className="text-sm text-muted-foreground">
          Obrigado. Seu feedback foi recebido.
        </p>
        <Button className="w-full" onClick={onClose}>
          Fechar
        </Button>
      </div>
    )
  }

  return (
    <form className="space-y-5" onSubmit={(event) => void submit(event)}>
      <fieldset className="space-y-2">
        <legend className="text-sm font-bold">Quero enviar</legend>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['BUG', 'Um problema'],
              ['SUGGESTION', 'Uma sugestão'],
              ['DATA_ISSUE', 'Um dado incorreto'],
            ] as const
          ).map(([kind, label]) => (
            <Button
              key={kind}
              type="button"
              size="sm"
              variant={input.kind === kind ? 'default' : 'outline'}
              onClick={() =>
                setInput((current) => ({
                  ...current,
                  kind: kind,
                }))
              }
            >
              {label}
            </Button>
          ))}
        </div>
      </fieldset>
      {academicTarget ? (
        <div className="rounded-sm border-2 border-border bg-muted/50 p-3 text-sm">
          <p className="font-bold">Dado acadêmico selecionado</p>
          <p className="mt-1 text-muted-foreground">
            Este relato ficará vinculado à informação aberta nesta tela.
          </p>
        </div>
      ) : (
        <fieldset className="space-y-2">
          <legend className="text-sm font-bold">Sobre</legend>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={input.target.type === 'GENERAL' ? 'default' : 'outline'}
              onClick={() => setTarget({ type: 'GENERAL' })}
            >
              O POMI em geral
            </Button>
            <Button
              type="button"
              size="sm"
              variant={input.target.type === 'FEATURE' ? 'default' : 'outline'}
              onClick={() => setTarget({ type: 'FEATURE', featureKey: 'home' })}
            >
              Uma funcionalidade
            </Button>
          </div>
          {input.target.type === 'FEATURE' && (
            <AutocompleteSelect
              ariaLabel="Funcionalidade relacionada"
              value={input.target.featureKey}
              onValueChange={(featureKey) => {
                if (
                  feedbackFeatureKeys.includes(
                    featureKey as (typeof feedbackFeatureKeys)[number],
                  )
                ) {
                  setTarget({
                    type: 'FEATURE',
                    featureKey:
                      featureKey as (typeof feedbackFeatureKeys)[number],
                  })
                }
              }}
              options={feedbackFeatureKeys.map((feature) => ({
                value: feature,
                label: featureLabel(feature),
              }))}
            />
          )}
        </fieldset>
      )}
      <label className="block space-y-2 text-sm font-bold">
        <span>Assunto</span>
        <input
          className="pomi-focus h-10 w-full rounded-md border-2 border-input bg-background px-3 text-sm font-medium"
          value={input.title}
          maxLength={160}
          onChange={(event) =>
            setInput((current) => ({ ...current, title: event.target.value }))
          }
        />
      </label>
      <label className="block space-y-2 text-sm font-bold">
        <span>Conte o que aconteceu ou o que você sugere</span>
        <textarea
          className="pomi-focus min-h-32 w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm font-medium"
          value={input.description}
          maxLength={5000}
          onChange={(event) =>
            setInput((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
        />
      </label>
      <fieldset className="space-y-2">
        <legend className="text-sm font-bold">Identificação</legend>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={!identified ? 'default' : 'outline'}
            onClick={() => setIdentified(false)}
          >
            Enviar anonimamente
          </Button>
          <Button
            type="button"
            size="sm"
            variant={identified ? 'default' : 'outline'}
            onClick={() => setIdentified(true)}
          >
            Identificar-me
          </Button>
        </div>
        {identified && !authenticated && (
          <p className="text-sm text-muted-foreground">
            Você entrará antes de concluir o envio.
          </p>
        )}
      </fieldset>
      {(validationError || error) && (
        <p role="alert" className="text-sm font-semibold text-destructive">
          {validationError || reportError(error)}
        </p>
      )}
      <Button className="w-full" disabled={submitting} type="submit">
        {submitting
          ? 'Enviando...'
          : identified && !authenticated
            ? 'Entrar e enviar'
            : 'Enviar feedback'}
      </Button>
    </form>
  )
}

export function FeedbackReportDialog(props: Props) {
  const desktop = useDesktopLayout()
  const content = <Form {...props} onClose={() => props.onOpenChange(false)} />
  const title = 'Enviar feedback'
  const description =
    'Relate um problema, uma sugestão ou uma informação acadêmica incorreta.'

  if (!desktop) {
    return (
      <Sheet open={props.open} onOpenChange={props.onOpenChange}>
        <SheetContent
          side="bottom"
          className="max-h-[90dvh] overflow-y-auto bg-card text-card-foreground"
        >
          <SheetHeader className="pr-12">
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          <div className="px-5 pb-5">{content}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent onOpenAutoFocus={(event) => event.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}
