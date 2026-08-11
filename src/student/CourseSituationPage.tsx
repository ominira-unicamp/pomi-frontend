import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'

import type { CourseProfileValues } from '@/student/components/CourseProfilePanel'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { EmptyState, PageContainer, PageHeader } from '@/components/PageLayout'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import { createApiCurriculumPlannerStaticDataSource } from '@/catalog/data/curriculumCatalogApi'
import {
  createStudentCourseAttempt,
  deleteStudentCourseAttempt,
  listStudentCourseAttempts,
  listStudyPeriods,
  patchStudentCourseAttempt,
  patchStudentProfile,
} from '@/student/data/studentApi'
import { useStudentProfile } from '@/student/hooks/useStudentProfile'
import {
  CourseProfilePanel,
} from '@/student/components/CourseProfilePanel'

const staticSource = createApiCurriculumPlannerStaticDataSource()
const statuses = [
  ['ENROLLED', 'Cursando'],
  ['COMPLETED', 'Concluída'],
  ['FAILED', 'Reprovada'],
  ['DROPPED', 'Desistida'],
] as const

type Status = (typeof statuses)[number][0]

function labelForStatus(status: Status) {
  return statuses.find(([value]) => value === status)?.[1] ?? status
}

export function CourseSituationPage() {
  const auth = useOptionalAuth()
  const queryClient = useQueryClient()
  const [attemptDialogOpen, setAttemptDialogOpen] = useState(false)
  const [editingAttemptId, setEditingAttemptId] = useState<number>()
  const [courseId, setCourseId] = useState('')
  const [studyPeriodId, setStudyPeriodId] = useState('')
  const [status, setStatus] = useState<Status>('ENROLLED')
  const [grade, setGrade] = useState('')

  const { studentId, profileQuery } = useStudentProfile()
  const attemptsQuery = useQuery({
    queryKey: ['course-situation', 'attempts', studentId],
    queryFn: () => listStudentCourseAttempts(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId),
  })
  const periodsQuery = useQuery({
    queryKey: ['course-situation', 'study-periods'],
    queryFn: listStudyPeriods,
    staleTime: Infinity,
  })
  const staticQuery = useQuery({
    queryKey: ['course-situation', 'static-data'],
    queryFn: async () => {
      const result = await staticSource.load()
      if (!result.ok) throw new Error(result.error.code)
      return result.value
    },
    staleTime: Infinity,
  })

  const programs = staticQuery.data?.catalogPrograms ?? []
  const attempts = attemptsQuery.data ?? []
  const enrolledAttempts = attempts.filter(
    (attempt) => attempt.status === 'ENROLLED',
  )
  const attemptsByPeriod = useMemo(() => {
    const entries = new Map<string, typeof attempts>()
    for (const attempt of attempts.filter(
      (item) => item.status !== 'ENROLLED',
    )) {
      const label = attempt.studyPeriod?.code ?? 'Período não informado'
      entries.set(label, [...(entries.get(label) ?? []), attempt])
    }
    return [...entries.entries()]
  }, [attempts])

  function resetAttempt() {
    setEditingAttemptId(undefined)
    setCourseId('')
    setStudyPeriodId('')
    setStatus('ENROLLED')
    setGrade('')
  }

  function openEdit(attempt: (typeof attempts)[number]) {
    setEditingAttemptId(attempt.id)
    setCourseId(String(attempt.courseId))
    setStudyPeriodId(attempt.studyPeriodId ? String(attempt.studyPeriodId) : '')
    setStatus(attempt.status)
    setGrade(attempt.grade === null ? '' : String(attempt.grade))
    setAttemptDialogOpen(true)
  }

  async function saveAttempt() {
    if (!studentId) return
    const numericGrade = grade.trim() === '' ? null : Number(grade)
    const body = {
      studyPeriodId: studyPeriodId ? Number(studyPeriodId) : null,
      status,
      grade: numericGrade,
    }
    if (editingAttemptId) {
      await patchStudentCourseAttempt(
        studentId,
        editingAttemptId,
        body,
        auth.getAccessToken,
      )
    } else if (courseId) {
      await createStudentCourseAttempt(
        studentId,
        { ...body, courseId: Number(courseId) },
        auth.getAccessToken,
      )
    }
    await queryClient.invalidateQueries({
      queryKey: ['course-situation', 'attempts'],
    })
    setAttemptDialogOpen(false)
    resetAttempt()
  }

  async function removeAttempt(attemptId: number) {
    if (!studentId || !window.confirm('Remover esta tentativa do histórico?'))
      return
    await deleteStudentCourseAttempt(studentId, attemptId, auth.getAccessToken)
    await queryClient.invalidateQueries({
      queryKey: ['course-situation', 'attempts'],
    })
  }

  async function saveProfile(value: CourseProfileValues) {
    if (!studentId) return
    await patchStudentProfile(
      studentId,
      value,
      auth.getAccessToken,
    )
    await queryClient.invalidateQueries({
      queryKey: ['student', 'profile'],
    })
  }

  function renderAttempt(attempt: (typeof attempts)[number]) {
    return (
      <article
        key={attempt.id}
        className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-strong-border p-3"
      >
        <div>
          <p className="font-bold">
            {attempt.course.code} — {attempt.course.name}
          </p>
          <p className="text-sm text-muted-foreground">
            {labelForStatus(attempt.status)} · {attempt.course.credits} créditos
            {attempt.grade !== null ? ` · Nota ${attempt.grade}` : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => openEdit(attempt)}>
            <Pencil /> Editar
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-destructive"
            onClick={() => void removeAttempt(attempt.id)}
          >
            <Trash2 /> Remover
          </Button>
        </div>
      </article>
    )
  }

  if (!auth.initialized || profileQuery.isLoading || attemptsQuery.isLoading)
    return <PageContainer>Carregando situação do curso…</PageContainer>
  if (!auth.isAuthenticated || !studentId)
    return (
      <PageContainer>
        Entre para gerenciar a situação do seu curso.
      </PageContainer>
    )

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Vida acadêmica"
        title="Situação do curso"
        description={
          profileQuery.data
            ? `${profileQuery.data.name} · acompanhe suas tentativas por período.`
            : undefined
        }
      />
      <CourseProfilePanel
        profile={profileQuery.data}
        catalogPrograms={programs}
        onSave={saveProfile}
      />
      <div className="mb-6 flex justify-end">
        <Button
          onClick={() => {
            resetAttempt()
            setAttemptDialogOpen(true)
          }}
        >
          <Plus /> Adicionar disciplina
        </Button>
      </div>
      {attempts.length === 0 ? (
        <EmptyState
          title="Nenhuma disciplina registrada"
          description="Adicione uma tentativa para começar seu histórico."
        />
      ) : (
        <div className="space-y-5">
          <section className="rounded-lg border-2 border-strong-border bg-card p-4">
            <h2 className="mb-3 font-extrabold">Cursando</h2>
            <div className="space-y-2">
              {enrolledAttempts.map(renderAttempt)}
              {!enrolledAttempts.length && (
                <p className="text-sm text-muted-foreground">
                  Nenhuma disciplina em andamento.
                </p>
              )}
            </div>
          </section>
          {attemptsByPeriod.length > 0 && (
            <h2 className="text-xl font-extrabold">Histórico</h2>
          )}
          {attemptsByPeriod.map(([period, entries]) => (
            <section
              key={period}
              className="rounded-lg border-2 border-strong-border bg-card p-4"
            >
              <h2 className="mb-3 font-extrabold">{period}</h2>
              <div className="space-y-2">{entries.map(renderAttempt)}</div>
            </section>
          ))}
        </div>
      )}
      <Dialog open={attemptDialogOpen} onOpenChange={setAttemptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAttemptId ? 'Editar tentativa' : 'Adicionar disciplina'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {!editingAttemptId && (
              <AutocompleteSelect
                ariaLabel="Disciplina"
                value={courseId}
                options={(staticQuery.data?.courses ?? []).map((course) => ({
                  value: String(course.id),
                  label: `${course.code} — ${course.name}`,
                }))}
                placeholder="Escolha a disciplina"
                onValueChange={setCourseId}
              />
            )}
            <AutocompleteSelect
              ariaLabel="Período letivo"
              value={studyPeriodId}
              options={(periodsQuery.data ?? []).map((period) => ({
                value: String(period.id),
                label: period.code,
              }))}
              placeholder="Escolha o período (opcional)"
              onValueChange={setStudyPeriodId}
            />
            <AutocompleteSelect
              ariaLabel="Situação"
              value={status}
              options={statuses.map(([value, label]) => ({ value, label }))}
              onValueChange={(value) => setStatus(value as Status)}
            />
            <label className="block text-sm font-bold">
              Nota (quando houver)
              <input
                value={grade}
                onChange={(event) => setGrade(event.target.value)}
                inputMode="decimal"
                className="mt-1 h-10 w-full rounded-md border-2 border-strong-border bg-background px-3"
              />
            </label>
            <Button
              className="w-full"
              disabled={!editingAttemptId && !courseId}
              onClick={() => void saveAttempt()}
            >
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
