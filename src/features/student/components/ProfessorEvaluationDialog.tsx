import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { useOptionalAuth } from '@/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  getProfessorEvaluation,
  putProfessorEvaluation,
} from '@/features/student/data/studentApi'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'

export type ProfessorEvaluationTarget = Readonly<{
  classId: number
  classCode: string
  courseCode: string
  courseName: string
  professorId: number
  professorName: string
}>

type Scores = Readonly<{
  wouldTakeAgain: number | null
  fairness: number | null
  clarity: number | null
  difficulty: number | null
}>

const initialScores: Scores = {
  wouldTakeAgain: null,
  fairness: null,
  clarity: null,
  difficulty: null,
}

const questions = [
  [
    'wouldTakeAgain',
    'Você cursaria novamente com este professor?',
    'Não cursaria',
    'Cursaria novamente',
  ],
  ['fairness', 'As avaliações foram justas?', 'Nada justas', 'Muito justas'],
  ['clarity', 'As explicações foram claras?', 'Nada claras', 'Muito claras'],
  [
    'difficulty',
    'Como foi a dificuldade de cursar com este professor?',
    'Muito baixa',
    'Muito alta',
  ],
] as const satisfies ReadonlyArray<
  readonly [keyof Scores, string, string, string]
>

export function ProfessorEvaluationDialog({
  open,
  onOpenChange,
  studentId,
  target,
  onSaved,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  studentId: number | undefined
  target: ProfessorEvaluationTarget | undefined
  onSaved?: () => void
}) {
  const auth = useOptionalAuth()
  const sessionSubject = auth.sessionSubject ?? 'unknown-session'
  const queryClient = useQueryClient()
  const [scores, setScores] = useState<Scores>(initialScores)
  const [error, setError] = useState<string>()
  const [saving, setSaving] = useState(false)
  const evaluationQuery = useQuery({
    queryKey: privateQueryKeys.professorEvaluation(
      sessionSubject,
      studentId,
      target?.classId,
      target?.professorId,
    ),
    queryFn: () =>
      getProfessorEvaluation(
        studentId!,
        target!.classId,
        target!.professorId,
        auth.getAccessToken,
      ),
    enabled: open && Boolean(studentId && target),
    retry: false,
  })

  useEffect(() => {
    if (!open) return
    const evaluation = evaluationQuery.data?.evaluation
    setScores(
      evaluation
        ? {
            wouldTakeAgain: evaluation.wouldTakeAgain,
            fairness: evaluation.fairness,
            clarity: evaluation.clarity,
            difficulty: evaluation.difficulty,
          }
        : initialScores,
    )
    setError(undefined)
  }, [evaluationQuery.data, open])

  const complete = Object.values(scores).every((score) => score !== null)

  async function save() {
    if (!studentId || !target || !complete) return
    setSaving(true)
    setError(undefined)
    try {
      await putProfessorEvaluation(
        studentId,
        target.classId,
        target.professorId,
        {
          wouldTakeAgain: scores.wouldTakeAgain!,
          fairness: scores.fairness!,
          clarity: scores.clarity!,
          difficulty: scores.difficulty!,
        },
        auth.getAccessToken,
      )
      await queryClient.invalidateQueries({
        queryKey: privateQueryKeys.professorEvaluation(
          sessionSubject,
          studentId,
          target.classId,
          target.professorId,
        ),
      })
      onOpenChange(false)
      onSaved?.()
    } catch {
      setError('Não foi possível salvar sua avaliação. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Avalie {target?.professorName}</DialogTitle>
          <DialogDescription>
            {target
              ? `${target.courseCode} — ${target.courseName} · Turma ${target.classCode}`
              : 'Compartilhe sua experiência com outros alunos.'}
          </DialogDescription>
        </DialogHeader>
        {evaluationQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando avaliação.</p>
        ) : evaluationQuery.isError ||
          evaluationQuery.data?.eligible === false ? (
          <p className="text-sm text-destructive">
            Esta avaliação não está disponível para esta turma.
          </p>
        ) : (
          <div className="space-y-5">
            {questions.map(([key, label, low, high]) => (
              <fieldset key={key}>
                <legend className="font-bold">{label}</legend>
                <div
                  className="mt-2 flex gap-2"
                  role="radiogroup"
                  aria-label={label}
                >
                  {[1, 2, 3, 4, 5].map((score) => (
                    <Button
                      key={score}
                      type="button"
                      size="sm"
                      variant={scores[key] === score ? 'default' : 'outline'}
                      aria-pressed={scores[key] === score}
                      onClick={() =>
                        setScores((current) => ({ ...current, [key]: score }))
                      }
                    >
                      {score}
                    </Button>
                  ))}
                </div>
                <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                  <span>{low}</span>
                  <span>{high}</span>
                </div>
              </fieldset>
            ))}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )}
        <DialogFooter>
          <Button
            onClick={() => void save()}
            disabled={
              !complete ||
              saving ||
              evaluationQuery.isLoading ||
              evaluationQuery.data?.eligible === false
            }
          >
            {saving ? 'Salvando' : 'Salvar avaliação'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
