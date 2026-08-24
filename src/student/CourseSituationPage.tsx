import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AlertCircle,
  BookOpenCheck,
  CalendarDays,
  Check,
  LoaderCircle,
  LogIn,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import type { CourseProfileValues } from '@/student/components/CourseProfilePanel'
import type { StudyPeriodYearPeriod } from '@/student/data/studyPeriod'
import type {
  StudentCourseAttemptStatus,
  StudentCourseEvaluationMode,
} from '@/student/data/studentApi'
import type { ProfessorEvaluationTarget } from '@/student/components/ProfessorEvaluationDialog'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  EmptyState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import { createCurriculumCatalogDataSource } from '@/catalog/data/curriculumCatalogApi'
import {
  createStudentCourseAttempt,
  deleteStudentCourseAttempt,
  getCourseEvaluationForStudyPeriod,
  listClassSchedulesByStudyPeriod,
  listClassesForStudentCourseAttempt,
  listStudentCourseAttempts,
  listStudyPeriods,
  patchStudentCourseAttempt,
  patchStudentProfile,
} from '@/student/data/studentApi'
import { useStudentProfile } from '@/student/hooks/useStudentProfile'
import { mostRecentStudyPeriodsFirst } from '@/student/data/studyPeriodOrdering'
import { studyPeriodLabel } from '@/student/data/studyPeriod'
import { CourseProfilePanel } from '@/student/components/CourseProfilePanel'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { StudentWeeklySchedule } from '@/student/components/StudentWeeklySchedule'
import { StudentAbsencePanel } from '@/student/absences/StudentAbsencePanel'
import { useStudentAbsences } from '@/student/absences/useStudentAbsences'
import { ProfessorEvaluationDialog } from '@/student/components/ProfessorEvaluationDialog'

const staticSource = createCurriculumCatalogDataSource()
const evaluationModes = [
  ['GRADE_AND_ATTENDANCE', 'Nota e frequência'],
  ['ATTENDANCE', 'Frequência'],
  ['CONCEPT', 'Conceito'],
] as const satisfies ReadonlyArray<
  readonly [StudentCourseEvaluationMode, string]
>

const statusesByEvaluationMode = {
  GRADE_AND_ATTENDANCE: [
    ['ENROLLED', 'Cursando'],
    ['DROPPED', 'Desistida'],
    ['APPROVED', 'Aprovada'],
    ['FAILED_BY_GRADE', 'Reprovada por nota'],
    ['FAILED_BY_ATTENDANCE', 'Reprovada por frequência'],
  ],
  ATTENDANCE: [
    ['ENROLLED', 'Cursando'],
    ['DROPPED', 'Desistida'],
    ['APPROVED_BY_ATTENDANCE', 'Aprovada por frequência'],
    ['FAILED_BY_ATTENDANCE', 'Reprovada por frequência'],
  ],
  CONCEPT: [
    ['ENROLLED', 'Cursando'],
    ['DROPPED', 'Desistida'],
    ['SUFFICIENT', 'Suficiente'],
    ['INSUFFICIENT', 'Insuficiente'],
  ],
} as const satisfies Record<
  StudentCourseEvaluationMode,
  ReadonlyArray<readonly [StudentCourseAttemptStatus, string]>
>

type SituationTab = 'course' | 'enrolled' | 'history'

function labelForStatus(status: StudentCourseAttemptStatus) {
  return (
    Object.values(statusesByEvaluationMode)
      .flat()
      .find(([value]) => value === status)?.[1] ?? status
  )
}

function TabCount({ value }: { value: number }) {
  return (
    <span className="inline-flex min-w-5 items-center justify-center rounded-full border border-current/25 bg-background px-1.5 py-0.5 text-xs leading-none tabular-nums">
      {value}
    </span>
  )
}

export function CourseSituationPage() {
  const auth = useOptionalAuth()
  const queryClient = useQueryClient()
  const [attemptDialogOpen, setAttemptDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<SituationTab>('enrolled')
  const [selectedSchedulePeriodId, setSelectedSchedulePeriodId] = useState('')
  const [editingAttemptId, setEditingAttemptId] = useState<number>()
  const [courseId, setCourseId] = useState('')
  const [studyPeriodId, setStudyPeriodId] = useState('')
  const [classId, setClassId] = useState('')
  const [evaluationMode, setEvaluationMode] = useState<
    StudentCourseEvaluationMode | ''
  >('')
  const [status, setStatus] = useState<StudentCourseAttemptStatus | ''>('')
  const [grade, setGrade] = useState('')
  const [attemptError, setAttemptError] = useState<string>()
  const [absenceAttemptId, setAbsenceAttemptId] = useState<number>()
  const [evaluationTarget, setEvaluationTarget] = useState<ProfessorEvaluationTarget>()

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
    enabled: auth.isAuthenticated,
  })
  const staticQuery = useQuery({
    queryKey: ['course-situation', 'static-data'],
    queryFn: async () => {
      const result = await staticSource.load()
      if (!result.ok) throw new Error(result.error.code)
      return result.value
    },
    staleTime: Infinity,
    enabled: auth.isAuthenticated,
  })
  const classesQuery = useQuery({
    queryKey: ['course-situation', 'classes', courseId, studyPeriodId],
    queryFn: () =>
      listClassesForStudentCourseAttempt(
        Number(courseId),
        Number(studyPeriodId),
      ),
    enabled: attemptDialogOpen && Boolean(courseId && studyPeriodId),
    staleTime: 5 * 60_000,
  })
  const selectedAttemptPeriod = periodsQuery.data?.find(
    (period) => String(period.id) === studyPeriodId,
  )
  const evaluationModeQuery = useQuery({
    queryKey: [
      'course-situation',
      'course-evaluation',
      courseId,
      selectedAttemptPeriod?.year,
    ],
    queryFn: () =>
      getCourseEvaluationForStudyPeriod(
        Number(courseId),
        selectedAttemptPeriod!.year,
      ),
    enabled: attemptDialogOpen && Boolean(courseId && selectedAttemptPeriod),
    staleTime: Infinity,
  })

  useEffect(() => {
    if (!studyPeriodId) return
    if (evaluationModeQuery.isSuccess) {
      setEvaluationMode(evaluationModeQuery.data ?? '')
      setStatus('')
      setGrade('')
    }
  }, [evaluationModeQuery.data, evaluationModeQuery.isSuccess, studyPeriodId])

  const programs = staticQuery.data?.catalogPrograms ?? []
  const attempts = attemptsQuery.data ?? []
  const absenceController = useStudentAbsences(
    studentId ?? undefined,
    auth.getAccessToken,
    attempts.some((attempt) => attempt.status === 'ENROLLED'),
  )
  const absenceAttempt = attempts.find(
    (attempt) => attempt.id === absenceAttemptId,
  )
  const absencePeriodStartDate = periodsQuery.data?.find(
    (period) => period.id === absenceAttempt?.studyPeriodId,
  )?.startDate
  const enrolledAttempts = attempts.filter(
    (attempt) => attempt.status === 'ENROLLED',
  )
  const enrolledPeriods = useMemo(() => {
    const availablePeriods = new Map(
      (periodsQuery.data ?? []).map((period) => [period.id, period]),
    )
    const periods = new Map<
      number,
      {
        id: number
        year: number
        yearPeriod: StudyPeriodYearPeriod
        startDate: string
      }
    >()
    for (const attempt of attempts) {
      if (attempt.status !== 'ENROLLED' || !attempt.studyPeriodId) continue
      periods.set(
        attempt.studyPeriodId,
        availablePeriods.get(attempt.studyPeriodId) ?? {
          id: attempt.studyPeriodId,
          year: attempt.studyPeriod?.year ?? 0,
          yearPeriod: attempt.studyPeriod?.yearPeriod ?? 'FIRST_SEMESTER',
          startDate: '',
        },
      )
    }
    return mostRecentStudyPeriodsFirst([...periods.values()])
  }, [attempts, periodsQuery.data])

  useEffect(() => {
    setSelectedSchedulePeriodId((current) =>
      enrolledPeriods.some((period) => String(period.id) === current)
        ? current
        : enrolledPeriods[0]
          ? String(enrolledPeriods[0].id)
          : '',
    )
  }, [enrolledPeriods])

  const scheduleQuery = useQuery({
    queryKey: ['course-situation', 'class-schedules', selectedSchedulePeriodId],
    queryFn: () =>
      listClassSchedulesByStudyPeriod(Number(selectedSchedulePeriodId)),
    enabled:
      activeTab === 'enrolled' &&
      Boolean(selectedSchedulePeriodId && studentId),
    staleTime: Infinity,
  })
  const selectedPeriodAttempts = enrolledAttempts.filter(
    (attempt) =>
      String(attempt.studyPeriodId ?? '') === selectedSchedulePeriodId,
  )
  const selectedClassIds = new Set(
    selectedPeriodAttempts.flatMap((attempt) =>
      attempt.classId ? [attempt.classId] : [],
    ),
  )
  const scheduleMeetings = (scheduleQuery.data ?? []).filter((meeting) =>
    selectedClassIds.has(meeting.classId),
  )
  const classesWithSchedule = new Set(
    scheduleMeetings.map((meeting) => meeting.classId),
  )
  const attemptsWithoutPeriod = enrolledAttempts.filter(
    (attempt) => !attempt.studyPeriodId,
  ).length
  const attemptsOutsideSchedule =
    attemptsWithoutPeriod +
    selectedPeriodAttempts.filter(
      (attempt) =>
        !attempt.classId ||
        (scheduleQuery.isSuccess && !classesWithSchedule.has(attempt.classId)),
    ).length
  const attemptsByPeriod = useMemo(() => {
    const entries = new Map<string, typeof attempts>()
    for (const attempt of attempts.filter(
      (item) => item.status !== 'ENROLLED',
    )) {
      const label = attempt.studyPeriod
        ? studyPeriodLabel(attempt.studyPeriod)
        : 'Período não informado'
      entries.set(label, [...(entries.get(label) ?? []), attempt])
    }
    return [...entries.entries()]
  }, [attempts])
  const normalizedGrade = grade.trim().replace(',', '.')
  const numericGrade = normalizedGrade ? Number(normalizedGrade) : null
  const availableStatuses = evaluationMode
    ? statusesByEvaluationMode[evaluationMode]
    : []
  const acceptsGrade = evaluationMode === 'GRADE_AND_ATTENDANCE'
  const gradeError =
    numericGrade !== null &&
    (!Number.isFinite(numericGrade) || numericGrade < 0 || numericGrade > 10)
      ? 'Informe uma nota entre 0 e 10.'
      : undefined

  function resetAttempt() {
    setEditingAttemptId(undefined)
    setCourseId('')
    setStudyPeriodId('')
    setClassId('')
    setEvaluationMode('')
    setStatus('')
    setGrade('')
    setAttemptError(undefined)
  }

  function openEdit(attempt: (typeof attempts)[number]) {
    setEditingAttemptId(attempt.id)
    setCourseId(String(attempt.courseId))
    setStudyPeriodId(attempt.studyPeriodId ? String(attempt.studyPeriodId) : '')
    setClassId(attempt.classId ? String(attempt.classId) : '')
    setEvaluationMode(attempt.evaluationMode)
    setStatus(attempt.status)
    setGrade(attempt.grade === null ? '' : String(attempt.grade))
    setAttemptDialogOpen(true)
  }

  function openNewAttempt(initialStatus?: StudentCourseAttemptStatus) {
    resetAttempt()
    setStatus(initialStatus ?? '')
    setAttemptDialogOpen(true)
  }

  async function saveAttempt() {
    if (
      !studentId ||
      !status ||
      !evaluationMode ||
      gradeError
    )
      return
    const body = {
      studyPeriodId: studyPeriodId ? Number(studyPeriodId) : null,
      classId: classId ? Number(classId) : null,
      evaluationMode,
      status,
      grade: acceptsGrade ? numericGrade : null,
    }
    setAttemptError(undefined)
    try {
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
      setActiveTab(status === 'ENROLLED' ? 'enrolled' : 'history')
      setAttemptDialogOpen(false)
      resetAttempt()
    } catch {
      setAttemptError(
        'Não foi possível salvar a tentativa. Verifique os dados e tente novamente.',
      )
    }
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
    await patchStudentProfile(studentId, value, auth.getAccessToken)
    await queryClient.invalidateQueries({
      queryKey: ['student', 'profile'],
    })
  }

  function renderAttempt(attempt: (typeof attempts)[number]) {
    const absenceCount = absenceController.absences.filter(
      (absence) => absence.studentCourseAttemptId === attempt.id,
    ).length
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
            {attempt.class ? ` · Turma ${attempt.class.code}` : ''}
            {attempt.class?.professors.length
              ? ` · ${attempt.class.professors.map((professor) => professor.name).join(', ')}`
              : ''}
            {attempt.status === 'ENROLLED'
              ? ` · ${absenceCount} ${absenceCount === 1 ? 'falta' : 'faltas'}`
              : ''}
          </p>
        </div>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          {attempt.status === 'ENROLLED' && (
            <Button
              className="flex-1 sm:flex-none"
              size="sm"
              variant="outline"
              onClick={() => setAbsenceAttemptId(attempt.id)}
            >
              <CalendarDays /> Aulas e faltas
            </Button>
          )}
          {attempt.status !== 'ENROLLED' &&
            attempt.class?.professors.map((professor) => (
              <Button
                key={professor.id}
                className="flex-1 sm:flex-none"
                size="sm"
                onClick={() =>
                  setEvaluationTarget({
                    classId: attempt.class!.id,
                    classCode: attempt.class!.code,
                    courseCode: attempt.course.code,
                    courseName: attempt.course.name,
                    professorId: professor.id,
                    professorName: professor.name,
                  })
                }
              >
                Avaliar {professor.name}
              </Button>
            ))}
          <Button
            className="flex-1 sm:flex-none"
            size="sm"
            variant="outline"
            onClick={() => openEdit(attempt)}
          >
            <Pencil /> Editar
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-destructive sm:flex-none"
            onClick={() => void removeAttempt(attempt.id)}
          >
            <Trash2 /> Remover
          </Button>
        </div>
      </article>
    )
  }

  if (!auth.initialized || profileQuery.isLoading || attemptsQuery.isLoading)
    return (
      <PageContainer>
        <LoadingState label="Carregando situação do curso" />
      </PageContainer>
    )
  if (!auth.isAuthenticated)
    return (
      <PageContainer>
        <PageHeader
          eyebrow="Vida acadêmica"
          title="Situação do curso"
          description="Registre seu percurso acadêmico e use essas informações para orientar seus planejamentos."
        />
        <Card className="mx-auto max-w-3xl overflow-hidden">
          <div className="border-b-2 border-strong-border bg-secondary/60 p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
                <BookOpenCheck className="size-5" />
              </span>
              <div>
                <h2 className="text-xl font-extrabold">
                  Guarde sua trajetória em um só lugar
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Entre para manter seus dados vinculados à sua conta e
                  continuar de qualquer dispositivo.
                </p>
              </div>
            </div>
          </div>
          <div className="p-5 sm:p-6">
            <p className="font-bold">Com uma conta, você pode:</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                'Informar curso e ano de ingresso',
                'Acompanhar disciplinas cursando',
                'Registrar conclusões e tentativas',
              ].map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm text-muted-foreground"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <Button
              className="mt-6 w-full sm:w-auto"
              onClick={() => void auth.login('/situacao-do-curso')}
            >
              <LogIn /> Entrar para acompanhar meu curso
            </Button>
          </div>
        </Card>
      </PageContainer>
    )
  if (!studentId)
    return (
      <PageContainer>
        <LoadingState label="Preparando sua situação do curso" />
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
        actions={
          <Button onClick={() => openNewAttempt()}>
            <Plus /> Adicionar disciplina
          </Button>
        }
      />
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as SituationTab)}
      >
        <TabsList aria-label="Seções da situação do curso">
          <TabsTrigger value="course">Curso</TabsTrigger>
          <TabsTrigger value="enrolled">
            Cursando
            <TabCount value={enrolledAttempts.length} />
          </TabsTrigger>
          <TabsTrigger value="history">
            Histórico
            <TabCount value={attempts.length - enrolledAttempts.length} />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="course">
          <CourseProfilePanel
            profile={profileQuery.data}
            catalogPrograms={programs}
            onSave={saveProfile}
          />
        </TabsContent>

        <TabsContent value="enrolled">
          {enrolledAttempts.length ? (
            <div className="space-y-8">
              <section
                aria-labelledby="student-schedule-title"
                className="space-y-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2
                      id="student-schedule-title"
                      className="flex items-center gap-2 text-xl font-extrabold"
                    >
                      <CalendarDays className="size-5 text-primary" />
                      Agenda das aulas
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Horários das turmas vinculadas às disciplinas cursando.
                    </p>
                  </div>
                  {enrolledPeriods.length > 1 ? (
                    <div className="w-full sm:w-64">
                      <AutocompleteSelect
                        ariaLabel="Período da agenda"
                        value={selectedSchedulePeriodId}
                        options={enrolledPeriods.map((period) => ({
                          value: String(period.id),
                          label: studyPeriodLabel(period),
                        }))}
                        placeholder="Escolha o período"
                        onValueChange={setSelectedSchedulePeriodId}
                      />
                    </div>
                  ) : (
                    enrolledPeriods[0] && (
                      <p className="rounded-md border-2 border-strong-border bg-card px-3 py-2 text-sm font-bold">
                        {studyPeriodLabel(enrolledPeriods[0])}
                      </p>
                    )
                  )}
                </div>

                {attemptsOutsideSchedule > 0 && (
                  <Alert>
                    <AlertCircle />
                    <AlertTitle>Agenda parcial</AlertTitle>
                    <AlertDescription>
                      {attemptsOutsideSchedule}{' '}
                      {attemptsOutsideSchedule === 1
                        ? 'disciplina ficou'
                        : 'disciplinas ficaram'}{' '}
                      fora da agenda por não possuir período, turma ou horário
                      cadastrado.
                    </AlertDescription>
                  </Alert>
                )}

                {!selectedSchedulePeriodId ? (
                  <Card className="grid min-h-40 place-items-center p-6 text-center">
                    <div>
                      <h3 className="font-extrabold">
                        Nenhum período informado
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Edite as disciplinas cursando e informe período e turma
                        para montar sua agenda.
                      </p>
                    </div>
                  </Card>
                ) : scheduleQuery.isLoading ? (
                  <Card
                    className="flex min-h-40 items-center justify-center gap-3 p-6"
                    role="status"
                  >
                    <LoaderCircle className="size-5 animate-spin text-primary" />
                    <span className="font-bold">Carregando horários</span>
                  </Card>
                ) : scheduleQuery.isError ? (
                  <Alert variant="destructive">
                    <AlertCircle />
                    <AlertTitle>Não foi possível carregar a agenda</AlertTitle>
                    <AlertDescription>
                      A lista de disciplinas continua disponível abaixo.
                    </AlertDescription>
                  </Alert>
                ) : scheduleMeetings.length ? (
                  <StudentWeeklySchedule meetings={scheduleMeetings} />
                ) : (
                  <Card className="grid min-h-40 place-items-center p-6 text-center">
                    <div>
                      <h3 className="font-extrabold">
                        Nenhum horário disponível
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Vincule turmas com horários cadastrados para preencher a
                        agenda.
                      </p>
                    </div>
                  </Card>
                )}
              </section>

              <section aria-labelledby="enrolled-courses-title">
                <h2
                  id="enrolled-courses-title"
                  className="mb-3 text-xl font-extrabold"
                >
                  Disciplinas cursando
                </h2>
                <div className="space-y-2">
                  {enrolledAttempts.map(renderAttempt)}
                </div>
              </section>
            </div>
          ) : (
            <EmptyState
              title="Nenhuma disciplina em andamento"
              description="Adicione as disciplinas que você está cursando neste período."
              action={{
                label: 'Adicionar disciplina cursando',
                onClick: () => openNewAttempt('ENROLLED'),
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="history">
          {attemptsByPeriod.length ? (
            <div className="space-y-5">
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
          ) : (
            <EmptyState
              title="Nenhuma tentativa no histórico"
              description="Registre disciplinas concluídas, reprovadas ou desistidas."
              action={{
                label: 'Registrar tentativa anterior',
                onClick: () => openNewAttempt(),
              }}
            />
          )}
        </TabsContent>
      </Tabs>
      {absenceAttempt && (
        <StudentAbsencePanel
          open
          onOpenChange={(open) => {
            if (!open) setAbsenceAttemptId(undefined)
          }}
          attempt={absenceAttempt}
          periodStartDate={absencePeriodStartDate}
          controller={absenceController}
        />
      )}
      <Dialog open={attemptDialogOpen} onOpenChange={setAttemptDialogOpen}>
        <DialogContent onOpenAutoFocus={(event) => event.preventDefault()}>
          <DialogHeader>
            <DialogTitle>
              {editingAttemptId ? 'Editar tentativa' : 'Adicionar disciplina'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <AutocompleteSelect
              ariaLabel="Período letivo"
              value={studyPeriodId}
              options={mostRecentStudyPeriodsFirst(periodsQuery.data ?? []).map(
                (period) => ({
                  value: String(period.id),
                  label: studyPeriodLabel(period),
                }),
              )}
              placeholder="Escolha o período (opcional)"
              onValueChange={(value) => {
                setStudyPeriodId(value)
                setClassId('')
                setEvaluationMode('')
                setStatus('')
                setGrade('')
              }}
            />
            {!editingAttemptId && (
              <AutocompleteSelect
                ariaLabel="Disciplina"
                value={courseId}
                options={(staticQuery.data?.courses ?? []).map((course) => ({
                  value: String(course.id),
                  label: `${course.code} — ${course.name}`,
                }))}
                placeholder="Escolha a disciplina"
                onValueChange={(value) => {
                  setCourseId(value)
                  setClassId('')
                  if (studyPeriodId) {
                    setEvaluationMode('')
                    setStatus('')
                    setGrade('')
                  }
                }}
              />
            )}
            <AutocompleteSelect
              ariaLabel="Turma (opcional)"
              value={classId}
              options={(classesQuery.data ?? []).map((classData) => ({
                value: String(classData.id),
                label: `Turma ${classData.code}${classData.professors.length ? ` — ${classData.professors.map((professor) => professor.name).join(', ')}` : ''}`,
              }))}
              emptyLabel="Sem turma"
              placeholder={
                courseId && studyPeriodId
                  ? 'Escolha a turma (opcional)'
                  : 'Escolha disciplina e período primeiro'
              }
              disabled={!courseId || !studyPeriodId || classesQuery.isLoading}
              onValueChange={setClassId}
            />
            <AutocompleteSelect
              ariaLabel="Modalidade de avaliação"
              value={evaluationMode}
              options={evaluationModes.map(([value, label]) => ({
                value,
                label,
              }))}
              placeholder={
                evaluationModeQuery.isLoading
                  ? 'Carregando modalidade do catálogo'
                  : studyPeriodId
                    ? 'Modalidade não encontrada no catálogo'
                    : 'Escolha a modalidade de avaliação'
              }
              disabled={Boolean(studyPeriodId) || evaluationModeQuery.isLoading}
              onValueChange={(value) => {
                setEvaluationMode(value as StudentCourseEvaluationMode)
                setStatus('')
                setGrade('')
              }}
            />
            {studyPeriodId &&
              !evaluationModeQuery.isLoading &&
              !evaluationMode && (
                <p className="text-sm text-muted-foreground">
                  Não há modalidade de avaliação cadastrada para esta disciplina
                  no catálogo do período escolhido.
                </p>
              )}
            <AutocompleteSelect
              ariaLabel="Resultado da tentativa"
              value={status}
              options={availableStatuses.map(([value, label]) => ({
                value,
                label,
              }))}
              placeholder={
                evaluationMode
                  ? 'Escolha o resultado'
                  : 'Aguarde a modalidade de avaliação'
              }
              disabled={!evaluationMode}
              onValueChange={(value) => {
                setStatus(value as StudentCourseAttemptStatus)
                if (!acceptsGrade) setGrade('')
              }}
            />
            {acceptsGrade && (
              <label className="block text-sm font-bold">
                Nota final (opcional)
                <input
                  value={grade}
                  onChange={(event) => {
                    setGrade(event.target.value)
                    setAttemptError(undefined)
                  }}
                  inputMode="decimal"
                  aria-invalid={Boolean(gradeError)}
                  className="mt-1 h-10 w-full rounded-md border-2 border-strong-border bg-background px-3"
                />
              </label>
            )}
            {gradeError && (
              <p
                className="text-sm font-semibold text-destructive"
                role="alert"
              >
                {gradeError}
              </p>
            )}
            {attemptError && (
              <p
                className="text-sm font-semibold text-destructive"
                role="alert"
              >
                {attemptError}
              </p>
            )}
            <Button
              className="w-full"
              disabled={
                !status ||
                !evaluationMode ||
                Boolean(gradeError) ||
                (!editingAttemptId && !courseId)
              }
              onClick={() => void saveAttempt()}
            >
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <ProfessorEvaluationDialog
        open={Boolean(evaluationTarget)}
        onOpenChange={(open) => {
          if (!open) setEvaluationTarget(undefined)
        }}
        studentId={studentId}
        target={evaluationTarget}
      />
    </PageContainer>
  )
}
