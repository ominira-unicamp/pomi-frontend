import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { buildPersonalCurriculum } from '@pomi/planner-domain/curriculum'
import { labelForStatus } from '../model/model'
import type {
  CatalogProgramOption,
  CatalogProgramVariantOption,
  Course,
  CourseId,
  LanguageId,
} from '@pomi/planner-domain/curriculum'
import type {
  StudentCourseAttempt,
  StudentProfile,
} from '@/features/student/data/studentApi'
import type { CatalogProgramDetailsSearch } from '@/features/catalog-program'
import { isApprovedStudentCourseAttempt } from '@/features/student/data/studentApi'
import { studyPeriodLabel } from '@/features/student/data/studyPeriod'
import {
  CatalogProgramDetails,
  CompletedCoursesToggle,
} from '@/features/catalog-program'
import { ErrorState, LoadingState } from '@/components/PageLayout'
import { Badge } from '@/components/patterns/Badge'
import { DataList, DataRow } from '@/components/patterns/DataList'
import { InlineMessage } from '@/components/patterns/InlineMessage'
import { Button } from '@/components/ui/button'

export function PersonalCurriculumExplorer({
  program,
  variant,
  courses,
  profile,
  attempts,
  attemptsLoading,
  attemptsError,
  onRetryAttempts,
  onOpenHistory,
}: {
  program: CatalogProgramOption
  variant?: CatalogProgramVariantOption
  courses: ReadonlyArray<Course>
  profile: StudentProfile
  attempts: ReadonlyArray<StudentCourseAttempt>
  attemptsLoading: boolean
  attemptsError: boolean
  onRetryAttempts?: () => void
  onOpenHistory?: () => void
}) {
  const [search, setSearch] = useState<CatalogProgramDetailsSearch>({
    tab: 'full',
  })
  const [hideCompleted, setHideCompleted] = useState(false)
  const projection = useMemo(
    () =>
      buildPersonalCurriculum({
        program,
        specializationId: profile.specializationId,
        languageId:
          profile.languageId == null
            ? undefined
            : (String(profile.languageId) as LanguageId),
        courses,
        records: attempts.map((attempt) => ({
          courseId: String(attempt.courseId) as CourseId,
          approved: isApprovedStudentCourseAttempt(attempt),
          enrolled: attempt.status === 'ENROLLED',
        })),
      }),
    [program, profile.specializationId, profile.languageId, courses, attempts],
  )
  const approvedIds = useMemo(
    () =>
      new Set(
        attempts
          .filter(isApprovedStudentCourseAttempt)
          .map((attempt) => attempt.courseId),
      ),
    [attempts],
  )
  const personalContext = (course: Course, closeDetails: () => void) => {
    const courseAttempts = attempts.filter(
      (attempt) => String(attempt.courseId) === course.id,
    )
    return (
      <section aria-label="Registros desta disciplina" className="space-y-3">
        <h3 className="font-bold">Seus registros nesta disciplina</h3>
        <p className="text-sm text-muted-foreground">
          Correspondência pelo identificador da disciplina. Equivalências e
          pré-requisitos não são avaliados automaticamente nesta consulta.
        </p>
        {courseAttempts.length ? (
          <DataList>
            {courseAttempts.map((attempt) => (
              <DataRow key={attempt.id}>
                <span className="text-sm">
                  {attempt.studyPeriod
                    ? studyPeriodLabel(attempt.studyPeriod)
                    : 'Período não informado'}
                </span>
                <Badge
                  variant={
                    isApprovedStudentCourseAttempt(attempt)
                      ? 'success'
                      : 'secondary'
                  }
                >
                  {labelForStatus(attempt.status)}
                </Badge>
              </DataRow>
            ))}
          </DataList>
        ) : (
          <p className="text-sm">
            Nenhuma tentativa registrada para esta disciplina.
          </p>
        )}
        {onOpenHistory && (
          <Button
            variant="outline"
            onClick={() => {
              closeDetails()
              onOpenHistory()
            }}
          >
            Consultar histórico
          </Button>
        )}
      </section>
    )
  }
  return (
    <div className="min-w-0 space-y-5">
      {attemptsLoading && (
        <LoadingState label="Carregando registros da trajetória" />
      )}
      {attemptsError && (
        <ErrorState
          title="Não foi possível consultar sua trajetória"
          description="O currículo do catálogo permanece disponível. Tente carregar os registros novamente para ver sua situação pessoal."
          action={
            onRetryAttempts
              ? { label: 'Tentar novamente', onClick: onRetryAttempts }
              : undefined
          }
        />
      )}
      {!attemptsLoading && !attemptsError && (
        <>
          {!attempts.length && (
            <InlineMessage>
              Nenhuma tentativa registrada. Consulte ou importe seu histórico
              para relacioná-lo ao currículo; ausência de registro não significa
              reprovação.
            </InlineMessage>
          )}
          {projection.missingLanguage && (
            <InlineMessage>
              Escolha uma língua no vínculo acadêmico para identificar seus
              requisitos pessoais. O currículo pleno apresenta todas as
              alternativas.
            </InlineMessage>
          )}
        </>
      )}
      <div className="flex justify-end">
        <CompletedCoursesToggle
          checked={!hideCompleted}
          disabled={attemptsLoading || attemptsError}
          onClick={() => setHideCompleted((current) => !current)}
        />
      </div>
      <CatalogProgramDetails
        program={program}
        variant={variant}
        courses={courses}
        completedCourseIds={
          attemptsLoading || attemptsError ? new Set() : approvedIds
        }
        markCompleted={!attemptsLoading && !attemptsError}
        hideCompleted={hideCompleted && !attemptsLoading && !attemptsError}
        search={search}
        onSearchChange={setSearch}
        embedded
        personalContext={
          !attemptsLoading && !attemptsError ? personalContext : undefined
        }
      />
      <Link
        className="pomi-focus text-sm font-bold hover:text-primary"
        to="/planejamentos-de-curriculo"
      >
        Ir aos planejamentos de currículo
      </Link>
    </div>
  )
}
