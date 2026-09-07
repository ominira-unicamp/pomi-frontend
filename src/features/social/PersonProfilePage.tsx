import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  BookOpen,
  CalendarDays,
  Check,
  Tags,
  Trash2,
  UserPlus,
} from 'lucide-react'

import { friendshipFor } from './components'
import { relationshipFor } from './types'
import type { WeeklyScheduleMeeting } from '@/features/student/components/StudentWeeklySchedule'
import { StudentWeeklySchedule } from '@/features/student/components/StudentWeeklySchedule'
import { useOptionalAuth } from '@/auth/AuthProvider'
import {
  EmptyState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  acceptFriendship,
  getPerson,
  getPublicProfile,
  listFriendships,
  removeFriendship,
  requestFriendship,
} from '@/features/friends/studentSocialApi'
import { listSharedPeriodPlanningsForPerson } from '@/features/planning-shared/data/sharedPeriodPlanningApi'
import { useStudentProfile } from '@/features/student/hooks/useStudentProfile'
import { studyPeriodLabel } from '@/features/student/data/studyPeriod'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'

function visibilityLabel(visibility: 'FRIENDS' | 'PUBLIC') {
  return visibility === 'PUBLIC' ? 'Público' : 'Amigos'
}

export function PersonProfilePage({ publicId }: { publicId: string }) {
  const auth = useOptionalAuth()
  const sessionSubject = auth.sessionSubject ?? 'unknown-session'
  const queryClient = useQueryClient()
  const { studentId, studentQuery } = useStudentProfile()
  const personQuery = useQuery({
    queryKey: privateQueryKeys.studentSocialPerson(
      sessionSubject,
      studentId,
      publicId,
    ),
    queryFn: () => getPerson(studentId!, publicId, auth.getAccessToken),
    enabled: Boolean(studentId),
  })
  const ownProfileQuery = useQuery({
    queryKey: privateQueryKeys.studentSocialProfile(sessionSubject, studentId),
    queryFn: () => getPublicProfile(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId) && personQuery.isError,
  })
  const friendshipsQuery = useQuery({
    queryKey: privateQueryKeys.studentSocialFriendships(
      sessionSubject,
      studentId,
    ),
    queryFn: () => listFriendships(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId),
  })
  const plansQuery = useQuery({
    queryKey: privateQueryKeys.studentSharedPeriodPlannings(
      sessionSubject,
      studentId,
      publicId,
    ),
    queryFn: () =>
      listSharedPeriodPlanningsForPerson(
        studentId!,
        publicId,
        auth.getAccessToken,
      ),
    enabled: Boolean(studentId),
  })
  const refresh = () =>
    queryClient.invalidateQueries({
      queryKey: privateQueryKeys.studentSocial(sessionSubject, studentId),
    })
  const add = useMutation({
    mutationFn: () =>
      requestFriendship(studentId!, publicId, auth.getAccessToken),
    onSuccess: refresh,
  })
  const accept = useMutation({
    mutationFn: (id: number) =>
      acceptFriendship(studentId!, id, auth.getAccessToken),
    onSuccess: refresh,
  })
  const remove = useMutation({
    mutationFn: (id: number) =>
      removeFriendship(studentId!, id, auth.getAccessToken),
    onSuccess: refresh,
  })
  if (
    studentQuery.isLoading ||
    personQuery.isLoading ||
    ownProfileQuery.isLoading
  )
    return (
      <PageContainer>
        <LoadingState label="Carregando perfil" />
      </PageContainer>
    )
  const ownProfile = ownProfileQuery.data
  const person =
    personQuery.data ??
    (ownProfile?.publicId === publicId ? ownProfile : undefined)
  if (!studentId || !person)
    return (
      <PageContainer>
        <EmptyState
          title="Perfil não encontrado"
          description="Este perfil pode estar oculto ou não existe mais."
        />
      </PageContainer>
    )
  const friendships = friendshipsQuery.data ?? []
  const isSelf = ownProfile?.publicId === publicId
  const interests = person.interests
  const sharedPlans = plansQuery.data?.items ?? []
  const scheduleMeetings: ReadonlyArray<WeeklyScheduleMeeting> =
    person.currentCourses.flatMap((course) =>
      course.schedules.map((schedule) => ({
        ...schedule,
        courseCode: course.courseCode,
        classCode: course.classCode ?? 'Sem turma',
      })),
    )
  const coursesWithoutSchedule = person.currentCourses.filter(
    (course) => course.schedules.length === 0,
  )
  const state = isSelf
    ? ('SELF' as const)
    : relationshipFor(person, studentId, friendships)
  const friendship = friendshipFor(publicId, friendships)
  return (
    <PageContainer className="pt-4 sm:pt-5">
      <PageHeader
        eyebrow="Comunidade"
        title={person.displayName}
        description={person.bio ?? undefined}
        className="mb-5 pb-3"
      />
      <div className="space-y-6">
        <Card
          variant="flat"
          className="w-full border-2 border-border bg-card/80"
        >
          <CardContent className="grid gap-6 p-6 sm:grid-cols-[auto_minmax(0,1fr)]">
            <span className="grid size-20 place-items-center rounded-full bg-primary text-3xl font-black text-primary-foreground">
              {person.displayName.slice(0, 1).toUpperCase()}
            </span>
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black tracking-[0.14em] text-primary uppercase">
                    Estudante
                  </p>
                  <p className="mt-1 font-bold">
                    {[
                      person.program?.name,
                      person.specialization
                        ? `${person.specialization.code} · ${person.specialization.name}`
                        : null,
                      person.entryYear,
                    ]
                      .filter(Boolean)
                      .join(' · ') || 'Informações acadêmicas não informadas'}
                  </p>
                </div>
                {state === 'SELF' && (
                  <span className="rounded-md border-2 border-strong-border px-3 py-2 text-sm font-black">
                    Seu perfil
                  </span>
                )}
                {state === 'NONE' && (
                  <Button disabled={add.isPending} onClick={() => add.mutate()}>
                    <UserPlus /> Adicionar aos amigos
                  </Button>
                )}
                {state === 'INCOMING_PENDING' && friendship && (
                  <Button
                    disabled={accept.isPending}
                    onClick={() => accept.mutate(friendship.id)}
                  >
                    <Check /> Aceitar amizade
                  </Button>
                )}
                {state === 'ACCEPTED' && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md border-2 border-strong-border px-3 py-2 text-sm font-black">
                      Amigos
                    </span>
                    {friendship && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={remove.isPending}
                        onClick={() => remove.mutate(friendship.id)}
                      >
                        <Trash2 /> Remover amizade
                      </Button>
                    )}
                  </div>
                )}
                {state === 'OUTGOING_PENDING' && (
                  <span className="rounded-md border-2 border-strong-border px-3 py-2 text-sm font-black">
                    Solicitação enviada
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="flat" className="border-2 border-border bg-card/80">
          <CardContent className="p-6">
            <h2 className="text-xl font-extrabold">Agenda das aulas</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Horários das turmas que esta pessoa está cursando.
            </p>
            {scheduleMeetings.length > 0 ? (
              <div className="mt-4">
                <StudentWeeklySchedule
                  meetings={scheduleMeetings}
                  tone="subtle"
                />
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Nenhum horário disponível para as disciplinas cursando.
              </p>
            )}
            {coursesWithoutSchedule.length > 0 && (
              <div className="mt-5">
                <h3 className="text-sm font-extrabold">
                  Disciplinas sem horário cadastrado
                </h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {coursesWithoutSchedule.map((course) => (
                    <li
                      key={`${course.courseCode}-${course.classCode ?? 'sem-turma'}`}
                      className="rounded-md border-2 border-border bg-background p-3"
                    >
                      <p className="font-extrabold">
                        {course.courseCode} · {course.courseName}
                      </p>
                      {course.classCode && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          Turma {course.classCode}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="grid content-start gap-6">
            <section className="px-1 py-2">
              <h2 className="flex items-center gap-2 text-xl font-extrabold">
                <Tags className="size-5" /> Interesses
              </h2>
              {interests.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <span
                      key={interest.id}
                      className="rounded-full border-2 border-strong-border bg-muted px-3 py-1.5 text-sm font-bold"
                    >
                      {interest.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  Nenhum interesse informado.
                </p>
              )}
            </section>
          </div>
          <section className="px-1 py-2">
            <h2 className="flex items-center gap-2 text-xl font-extrabold">
              <BookOpen className="size-5" /> Planejamentos compartilhados
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Planejamentos públicos e, quando aplicável, visíveis para amigos.
            </p>
            {plansQuery.isLoading ? (
              <p className="mt-5 text-sm text-muted-foreground">
                Carregando planejamentos...
              </p>
            ) : sharedPlans.length === 0 ? (
              <p className="mt-5 text-sm text-muted-foreground">
                Nenhum planejamento compartilhado.
              </p>
            ) : (
              <div className="mt-5 grid gap-3">
                {sharedPlans.map((plan) => (
                  <article
                    key={plan.shareId}
                    className="rounded-lg border-2 border-border bg-card p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h3 className="font-extrabold">
                        {plan.name || 'Planejamento de semestre'}
                      </h3>
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-black">
                        {visibilityLabel(plan.visibility)}
                      </span>
                    </div>
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <CalendarDays className="size-4" />
                      {studyPeriodLabel({
                        year: plan.studyPeriodYear,
                        yearPeriod: plan.studyPeriodYearPeriod,
                      })}{' '}
                      · {plan.classes.length} disciplina
                      {plan.classes.length === 1 ? '' : 's'}
                    </p>
                    {plan.classes.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {plan.classes.map((classItem) => (
                          <span
                            key={classItem.id}
                            className="rounded-sm bg-muted px-2 py-1 text-xs font-bold"
                          >
                            {classItem.courseCode} · {classItem.code}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </PageContainer>
  )
}
