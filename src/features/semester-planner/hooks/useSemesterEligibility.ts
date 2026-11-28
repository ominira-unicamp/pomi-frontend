import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { SemesterPlannerStaticData } from '@pomi/planner-domain/semester'
import type { StudentCourseAttempt } from '@/academic-record/data/studentApi'
import {
  evaluateSemesterPrerequisites,
  evaluateSemesterReservations,
} from '@/features/semester-planner/model/semesterEligibility'
import { pomiSdk } from '@/api/client'
import { ruleFromApi } from '@/catalog/data/curriculumPrerequisiteApi'

export function useSemesterEligibility({
  data,
  catalogId,
  programId,
  attempts,
  studyPeriodId,
}: {
  data?: SemesterPlannerStaticData
  catalogId?: number | null
  programId?: number | null
  attempts?: ReadonlyArray<StudentCourseAttempt>
  studyPeriodId?: number
}) {
  const catalogQuery = useQuery({
    queryKey: ['semester-prerequisites', catalogId ?? 'none'],
    queryFn: async () => {
      const [catalog, courses] = await Promise.all([
        pomiSdk.data.catalogs.get(catalogId!),
        pomiSdk.data.catalogCourses.listAll({
          page: 1,
          pageSize: 1000,
          filter: { catalogId: catalogId! },
        }),
      ])
      return { catalog, courses }
    },
    enabled: catalogId != null,
    staleTime: 5 * 60_000,
    retry: false,
  })
  const catalogData = catalogQuery.isError ? undefined : catalogQuery.data
  return useMemo(() => {
    const labels = new Map(
      data?.courses.map((course) => [course.id, course.code]),
    )
    const period = data?.studyPeriods.find((item) => item.id === studyPeriodId)
    const entries = new Map(
      catalogData?.courses.map((course) => [course.courseId, course]),
    )
    const prerequisites = new Map(
      (data?.courses ?? []).map((course) => {
        const entry = entries.get(course.id)
        const result = evaluateSemesterPrerequisites({
          found: Boolean(entry),
          rule: entry ? ruleFromApi(entry) : undefined,
          attempts,
          period,
          courseLabels: labels,
        })
        if (!catalogData)
          return [
            course.id,
            {
              ...result,
              label:
                catalogId == null
                  ? 'Defina seu catálogo no vínculo acadêmico'
                  : catalogQuery.isError
                    ? 'Pré-requisitos indisponíveis'
                    : 'Carregando pré-requisitos…',
            },
          ] as const
        return [course.id, result] as const
      }),
    )
    const reservations = new Map(
      (data?.classes ?? []).map((item) => [
        item.id,
        evaluateSemesterReservations(item.reservationPrograms, programId),
      ]),
    )
    const prerequisitesReady = Boolean(catalogData && attempts && period)
    const reservationsReady =
      programId != null &&
      Boolean(
        data?.classes.some((item) => item.reservationPrograms !== undefined),
      )
    return {
      prerequisites,
      reservations,
      prerequisitesReady,
      reservationsReady,
      prerequisiteHint:
        catalogId == null
          ? 'Defina o catálogo no vínculo acadêmico para verificar os pré-requisitos.'
          : catalogQuery.isError
            ? 'Não foi possível carregar os pré-requisitos do catálogo.'
            : !catalogData
              ? 'Carregando pré-requisitos do catálogo…'
              : attempts === undefined
                ? 'Histórico indisponível ou ainda não carregado.'
                : `Pré-requisitos do catálogo ${catalogData.catalog.year}.`,
      reservationHint:
        programId == null
          ? 'Defina seu curso no vínculo acadêmico para comparar reservas.'
          : !reservationsReady
            ? 'Reservas indisponíveis para comparar neste semestre.'
            : 'Comparação de reservas por curso; não garante matrícula.',
      acceptedCourseIds: new Set(
        [...prerequisites]
          .filter(([, value]) => value.status === 'satisfied')
          .map(([id]) => id),
      ),
      matchedClassIds: new Set(
        [...reservations]
          .filter(([, value]) => value.status === 'matched')
          .map(([id]) => id),
      ),
    }
  }, [
    data,
    catalogId,
    programId,
    attempts,
    studyPeriodId,
    catalogData,
    catalogQuery.isError,
  ])
}
