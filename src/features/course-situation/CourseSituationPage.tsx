import { useQuery, useQueryClient } from '@tanstack/react-query'
import { BookOpenCheck, Check, LogIn, Plus } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import type { CourseProfileValues } from '@/features/student/components/CourseProfilePanel'
import type { ProfessorEvaluationTarget } from '@/features/student/components/ProfessorEvaluationDialog'
import type { CourseAttemptFormState } from '@/features/course-situation/components/CourseAttemptDialog'
import type {
  StudentCourseAttempt,
  StudentCourseAttemptStatus,
  StudentHistoryImportSummary,
} from '@/features/student/data/studentApi'
import type { StudyPeriodYearPeriod } from '@/features/student/data/studyPeriod'
import type { StudentHistoryParseResult } from '@/features/student/historyImport/studentHistoryParser'
import {
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  privateQueryKeys,
  publicQueryKeys,
} from '@/integrations/tanstack-query/queryKeys'
import { StudentAbsencePanel } from '@/features/student/absences/StudentAbsencePanel'
import { useStudentAbsences } from '@/features/student/absences/useStudentAbsences'
import { CourseProfilePanel } from '@/features/student/components/CourseProfilePanel'
import { ProfessorEvaluationDialog } from '@/features/student/components/ProfessorEvaluationDialog'
import { CourseAttemptDialog } from '@/features/course-situation/components/CourseAttemptDialog'
import { CourseHistorySection } from '@/features/course-situation/components/CourseHistorySection'
import { EnrolledCoursesSection } from '@/features/course-situation/components/EnrolledCoursesSection'
import { HistoryImportDialog } from '@/features/course-situation/components/HistoryImportDialog'
import {
  groupCourseHistory,
  parseGrade,
} from '@/features/course-situation/model/model'
import { useCourseSituationQueries } from '@/features/course-situation/hooks/useCourseSituationQueries'
import {
  createStudentCourseAttempt,
  deleteStudentCourseAttempt,
  importStudentHistory,
  listClassSchedulesByStudyPeriod,
  patchStudentCourseAttempt,
  patchStudentProfile,
} from '@/features/student/data/studentApi'
import { mostRecentStudyPeriodsFirst } from '@/features/student/data/studyPeriodOrdering'
import { parseStudentHistoryPdf } from '@/features/student/historyImport/studentHistoryParser'

type SituationTab = 'course' | 'enrolled' | 'history'

function TabCount({ value }: { value: number }) {
  return (
    <span className="inline-flex min-w-5 items-center justify-center rounded-full border border-current/25 bg-background px-1.5 py-0.5 text-xs leading-none tabular-nums">
      {value}
    </span>
  )
}

const emptyAttemptForm: CourseAttemptFormState = {
  courseId: '',
  studyPeriodId: '',
  classId: '',
  evaluationMode: '',
  status: '',
  grade: '',
}

export function CourseSituationPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<SituationTab>('enrolled')
  const [selectedSchedulePeriodId, setSelectedSchedulePeriodId] = useState('')
  const [attemptDialogOpen, setAttemptDialogOpen] = useState(false)
  const [attemptForm, setAttemptFormState] =
    useState<CourseAttemptFormState>(emptyAttemptForm)
  const [attemptError, setAttemptError] = useState<string>()
  const [attemptSaving, setAttemptSaving] = useState(false)
  const [absenceAttemptId, setAbsenceAttemptId] = useState<number>()
  const [evaluationTarget, setEvaluationTarget] =
    useState<ProfessorEvaluationTarget>()
  const historyFileInput = useRef<HTMLInputElement>(null)
  const [historyImporting, setHistoryImporting] = useState(false)
  const [historyImportError, setHistoryImportError] = useState<string>()
  const [pendingHistoryImport, setPendingHistoryImport] =
    useState<StudentHistoryParseResult>()
  const [historyImportSummary, setHistoryImportSummary] =
    useState<StudentHistoryImportSummary>()

  const {
    auth,
    sessionSubject,
    studentId,
    profileQuery,
    attemptsQuery,
    periodsQuery,
    staticQuery,
    classesQuery,
    evaluationModeQuery,
  } = useCourseSituationQueries({
    attemptDialogOpen,
    courseId: attemptForm.courseId,
    studyPeriodId: attemptForm.studyPeriodId,
  })

  useEffect(() => {
    if (!attemptForm.studyPeriodId || !evaluationModeQuery.isSuccess) return
    setAttemptFormState((current) => ({
      ...current,
      evaluationMode: evaluationModeQuery.data ?? '',
      status: '',
      grade: '',
    }))
  }, [
    attemptForm.studyPeriodId,
    evaluationModeQuery.data,
    evaluationModeQuery.isSuccess,
  ])

  const attempts = attemptsQuery.data ?? []
  const enrolledAttempts = attempts.filter(
    (attempt) => attempt.status === 'ENROLLED',
  )
  const historyGroups = useMemo(() => groupCourseHistory(attempts), [attempts])
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
    for (const attempt of enrolledAttempts) {
      if (!attempt.studyPeriodId) continue
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
  }, [enrolledAttempts, periodsQuery.data])

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
    queryKey: publicQueryKeys.classSchedules(selectedSchedulePeriodId),
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
  const attemptsOutsideSchedule =
    enrolledAttempts.filter((attempt) => !attempt.studyPeriodId).length +
    selectedPeriodAttempts.filter(
      (attempt) =>
        !attempt.classId ||
        (scheduleQuery.isSuccess && !classesWithSchedule.has(attempt.classId)),
    ).length
  const absenceController = useStudentAbsences(
    studentId ?? undefined,
    auth.getAccessToken,
    enrolledAttempts.length > 0,
  )
  const absenceAttempt = attempts.find(
    (attempt) => attempt.id === absenceAttemptId,
  )
  const absencePeriodStartDate = periodsQuery.data?.find(
    (period) => period.id === absenceAttempt?.studyPeriodId,
  )?.startDate
  const { numeric: numericGrade, error: gradeError } = parseGrade(
    attemptForm.grade,
  )

  function setAttemptForm(form: CourseAttemptFormState) {
    setAttemptError(undefined)
    setAttemptFormState(form)
  }

  function openNewAttempt(initialStatus?: StudentCourseAttemptStatus) {
    setAttemptForm({ ...emptyAttemptForm, status: initialStatus ?? '' })
    setAttemptDialogOpen(true)
  }

  function openEdit(attempt: StudentCourseAttempt) {
    setAttemptForm({
      editingAttemptId: attempt.id,
      courseId: String(attempt.courseId),
      studyPeriodId: attempt.studyPeriodId ? String(attempt.studyPeriodId) : '',
      classId: attempt.classId ? String(attempt.classId) : '',
      evaluationMode: attempt.evaluationMode,
      status: attempt.status,
      grade: attempt.grade === null ? '' : String(attempt.grade),
    })
    setAttemptDialogOpen(true)
  }

  async function saveAttempt() {
    if (attemptSaving || !studentId || gradeError) return
    const { editingAttemptId, courseId, studyPeriodId, classId } = attemptForm
    const evaluationMode = attemptForm.evaluationMode
    const status = attemptForm.status
    if (!status || !evaluationMode) return
    const body = {
      studyPeriodId: studyPeriodId ? Number(studyPeriodId) : null,
      classId: classId ? Number(classId) : null,
      evaluationMode,
      status,
      grade: evaluationMode === 'GRADE_AND_ATTENDANCE' ? numericGrade : null,
    }
    setAttemptError(undefined)
    setAttemptSaving(true)
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
        queryKey: privateQueryKeys.courseAttempts(sessionSubject, studentId),
      })
      setActiveTab(status === 'ENROLLED' ? 'enrolled' : 'history')
      setAttemptDialogOpen(false)
      setAttemptForm(emptyAttemptForm)
    } catch {
      setAttemptError(
        'Não foi possível salvar a tentativa. Verifique os dados e tente novamente.',
      )
    } finally {
      setAttemptSaving(false)
    }
  }

  async function removeAttempt(attemptId: number) {
    if (!studentId || !window.confirm('Remover esta tentativa do histórico?'))
      return
    await deleteStudentCourseAttempt(studentId, attemptId, auth.getAccessToken)
    await queryClient.invalidateQueries({
      queryKey: privateQueryKeys.courseAttempts(sessionSubject, studentId),
    })
  }

  async function saveProfile(value: CourseProfileValues) {
    if (!studentId) return
    await patchStudentProfile(studentId, value, auth.getAccessToken)
    await queryClient.invalidateQueries({
      queryKey: privateQueryKeys.studentProfile(sessionSubject, studentId),
    })
  }

  async function parseHistoryFile(file: File) {
    if (!studentId || historyImporting) return
    setHistoryImporting(true)
    setHistoryImportError(undefined)
    setHistoryImportSummary(undefined)
    try {
      setPendingHistoryImport(await parseStudentHistoryPdf(file))
    } catch (error) {
      setHistoryImportError(
        error instanceof Error
          ? error.message
          : 'Não foi possível ler o histórico escolar.',
      )
    } finally {
      setHistoryImporting(false)
    }
  }

  async function confirmHistoryImport() {
    if (!studentId || !pendingHistoryImport || historyImporting) return
    setHistoryImporting(true)
    setHistoryImportError(undefined)
    try {
      setHistoryImportSummary(
        await importStudentHistory(
          studentId,
          pendingHistoryImport.value,
          auth.getAccessToken,
        ),
      )
      setPendingHistoryImport(undefined)
      await queryClient.invalidateQueries({
        queryKey: privateQueryKeys.courseAttempts(sessionSubject, studentId),
      })
    } catch (error) {
      setHistoryImportError(
        error instanceof Error
          ? error.message
          : 'Não foi possível salvar o histórico escolar.',
      )
    } finally {
      setHistoryImporting(false)
    }
  }

  const absenceCount = (attemptId: number) =>
    absenceController.absences.filter(
      (absence) => absence.studentCourseAttemptId === attemptId,
    ).length

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
            Cursando <TabCount value={enrolledAttempts.length} />
          </TabsTrigger>
          <TabsTrigger value="history">
            Histórico{' '}
            <TabCount value={attempts.length - enrolledAttempts.length} />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="course">
          <CourseProfilePanel
            profile={profileQuery.data}
            catalogPrograms={staticQuery.data?.catalogPrograms ?? []}
            onSave={saveProfile}
          />
        </TabsContent>
        <TabsContent value="enrolled">
          <EnrolledCoursesSection
            attempts={enrolledAttempts}
            periods={enrolledPeriods}
            selectedPeriodId={selectedSchedulePeriodId}
            meetings={scheduleMeetings}
            scheduleLoading={scheduleQuery.isLoading}
            scheduleError={scheduleQuery.isError}
            attemptsOutsideSchedule={attemptsOutsideSchedule}
            absenceCount={absenceCount}
            onPeriodChange={setSelectedSchedulePeriodId}
            onNewAttempt={() => openNewAttempt('ENROLLED')}
            onOpenAbsences={setAbsenceAttemptId}
            onEvaluate={setEvaluationTarget}
            onEdit={openEdit}
            onRemove={(attemptId) => void removeAttempt(attemptId)}
          />
        </TabsContent>
        <TabsContent value="history">
          <CourseHistorySection
            groups={historyGroups}
            fileInputRef={historyFileInput}
            importing={historyImporting}
            importError={historyImportError}
            importSummary={historyImportSummary}
            absenceCount={absenceCount}
            onFileChange={(event) => {
              const file = event.target.files?.[0]
              event.target.value = ''
              if (file) void parseHistoryFile(file)
            }}
            onNewAttempt={() => openNewAttempt()}
            onOpenAbsences={setAbsenceAttemptId}
            onEvaluate={setEvaluationTarget}
            onEdit={openEdit}
            onRemove={(attemptId) => void removeAttempt(attemptId)}
          />
        </TabsContent>
      </Tabs>
      <HistoryImportDialog
        value={pendingHistoryImport}
        importing={historyImporting}
        onOpenChange={(open) => {
          if (!open && !historyImporting) setPendingHistoryImport(undefined)
        }}
        onConfirm={() => void confirmHistoryImport()}
      />
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
      <CourseAttemptDialog
        open={attemptDialogOpen}
        form={attemptForm}
        periods={periodsQuery.data ?? []}
        courses={staticQuery.data?.courses ?? []}
        classes={classesQuery.data ?? []}
        classesLoading={classesQuery.isLoading}
        evaluationModeLoading={evaluationModeQuery.isLoading}
        gradeError={gradeError}
        operationError={attemptError}
        saving={attemptSaving}
        onOpenChange={setAttemptDialogOpen}
        onFormChange={setAttemptForm}
        onSave={() => void saveAttempt()}
      />
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
