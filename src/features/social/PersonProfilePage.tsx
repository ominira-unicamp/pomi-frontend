import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  Tags,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react'

import { friendshipFor } from './components'
import { relationshipFor } from './types'
import type { WeeklyScheduleMeeting } from '@/features/student/components/StudentWeeklySchedule'
import { StudentWeeklySchedule } from '@/features/student/components/StudentWeeklySchedule'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { AuthRequiredState } from '@/components/AuthRequiredState'
import {
  EmptyState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  acceptFriendship,
  getPerson,
  getPublicProfile,
  listFriendships,
  removeFriendship,
  requestFriendship,
} from '@/features/friends/studentSocialApi'
import { groupApi } from '@/features/groups/data/groupApi'
import { listSharedPeriodPlanningsForPerson } from '@/features/planning-shared/data/sharedPeriodPlanningApi'
import { useStudentProfile } from '@/features/student/hooks/useStudentProfile'
import { studyPeriodLabel } from '@/features/student/data/studyPeriod'
import { GroupAvatar, PersonAvatar } from '@/features/media/IdentityImages'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'

function visibilityLabel(visibility: 'FRIENDS' | 'PUBLIC') {
  return visibility === 'PUBLIC' ? 'Público' : 'Amigos'
}

function participationDate(value?: string | null) {
  if (!value) return undefined
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined
  return date.toLocaleDateString('pt-BR', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function positionPeriod(startedAt?: string | null, endedAt?: string | null) {
  const start = participationDate(startedAt)
  const end = participationDate(endedAt)
  if (start && end) return `${start} – ${end}`
  if (end) return `até ${end}`
  if (start)
    return `${new Date(startedAt!).getTime() > Date.now() ? 'a partir de' : 'desde'} ${start}`
  return undefined
}

export function PersonProfilePage({ publicId }: { publicId: string }) {
  const [confirmRemoval, setConfirmRemoval] = useState(false)
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
    enabled: Boolean(studentId),
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
  const publicProfileAvailable = Boolean(
    personQuery.data ||
    (ownProfileQuery.data?.publicId === publicId &&
      ownProfileQuery.data.enabled),
  )
  const groupMembershipsQuery = useQuery({
    queryKey: ['public', 'group-memberships', 'profile', publicId],
    queryFn: () => groupApi.membersForPublicProfile(publicId),
    enabled: publicProfileAvailable,
  })
  const groupsQuery = useQuery({
    queryKey: ['public', 'groups'],
    queryFn: groupApi.list,
    enabled: Boolean(groupMembershipsQuery.data?.length),
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
    onSuccess: async () => {
      setConfirmRemoval(false)
      await refresh()
    },
  })
  if (!auth.initialized)
    return (
      <PageContainer>
        <LoadingState label="Carregando perfil" />
      </PageContainer>
    )
  if (!auth.isAuthenticated)
    return (
      <PageContainer>
        <PageHeader
          eyebrow="Comunidade"
          title="Perfil de estudante"
          description="Conheça pessoas da comunidade POMI."
        />
        <AuthRequiredState
          title="Entre para visualizar este perfil"
          description="Perfis de estudantes ficam disponíveis somente para a comunidade autenticada."
          onLogin={() => void auth.login(window.location.href)}
        />
      </PageContainer>
    )
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
  const membershipsByGroup = new Map(
    (groupMembershipsQuery.data ?? []).map((membership) => [
      membership.groupId,
      membership,
    ]),
  )
  const groupIds = new Set(membershipsByGroup.keys())
  const publicGroups = (groupsQuery.data ?? [])
    .filter((group) => groupIds.has(group.id))
    .sort((left, right) => left.name.localeCompare(right.name, 'pt-BR'))
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
    <PageContainer className="min-w-0 space-y-6">
      <header className="grid gap-x-6 border-b border-border/35 pb-5 xl:grid-cols-[minmax(0,1fr)_auto]">
        <p className="mb-3 text-xs font-black uppercase tracking-widest text-primary xl:col-span-2">
          Comunidade
        </p>
        <div className="flex items-start gap-4">
          <PersonAvatar
            mediaId={person.avatarMediaId}
            name={person.displayName}
            access={isSelf ? 'private' : 'public'}
            size="large"
          />
          <div className="min-w-0 flex-1 space-y-1.5">
            <h1 className="break-words text-2xl font-extrabold tracking-tight sm:text-3xl">
              {person.displayName}
            </h1>
            {(person.program || person.specialization || person.entryYear) && (
              <p className="break-words text-sm font-semibold text-muted-foreground">
                {[
                  person.program?.name,
                  person.specialization
                    ? `${person.specialization.code} · ${person.specialization.name}`
                    : null,
                  person.entryYear ? `Ingresso em ${person.entryYear}` : null,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            )}
            {person.bio && (
              <p className="max-w-2xl whitespace-pre-line break-words text-sm leading-relaxed">
                {person.bio}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 xl:mt-0 xl:justify-end xl:self-start">
          {isSelf ? (
            <>
              <span className="self-center text-sm text-muted-foreground">
                Seu perfil
              </span>
              <Link
                to="/perfil"
                className={buttonVariants({ variant: 'ghost', size: 'sm' })}
              >
                Editar perfil
              </Link>
            </>
          ) : friendshipsQuery.isPending ? (
            <p className="text-sm text-muted-foreground">
              Carregando amizade...
            </p>
          ) : friendshipsQuery.isError || ownProfileQuery.isError ? (
            <p role="alert" className="text-sm text-destructive">
              Não foi possível carregar a amizade.
            </p>
          ) : (
            <>
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
              {state === 'OUTGOING_PENDING' && (
                <span className="text-sm font-bold text-muted-foreground">
                  Solicitação enviada
                </span>
              )}
              {state === 'ACCEPTED' && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" disabled={remove.isPending}>
                      <Check /> Amigos <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      disabled={!friendship}
                      onSelect={() => setConfirmRemoval(true)}
                    >
                      <Trash2 /> Remover amizade
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </>
          )}
        </div>
        {(add.isError ||
          accept.isError ||
          (remove.isError && !confirmRemoval)) && (
          <p
            role="alert"
            className="mt-2 text-sm text-destructive xl:col-span-2"
          >
            Não foi possível atualizar a amizade. Tente novamente.
          </p>
        )}
      </header>
      <div className="grid min-w-0 items-start gap-5 xl:grid-cols-2">
        {publicProfileAvailable && (
          <section aria-labelledby="profile-groups" className="min-w-0">
            <h2
              id="profile-groups"
              className="flex items-center gap-2 text-xl font-extrabold"
            >
              <Users aria-hidden="true" className="size-5 shrink-0" /> Grupos de
              que participa
            </h2>
            {groupMembershipsQuery.isPending ||
            (groupIds.size > 0 && groupsQuery.isPending) ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Carregando grupos...
              </p>
            ) : groupMembershipsQuery.isError || groupsQuery.isError ? (
              <p role="alert" className="mt-3 text-sm text-destructive">
                Não foi possível carregar os grupos desta pessoa.
              </p>
            ) : publicGroups.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Nenhum grupo com participação pública.
              </p>
            ) : (
              <ul className="mt-2 space-y-1">
                {publicGroups.map((group) => {
                  const membership = membershipsByGroup.get(group.id)
                  const positions =
                    membership?.positions.filter((position) =>
                      position.title.trim(),
                    ) ?? []
                  const joined = participationDate(membership?.joinedAt)
                  return (
                    <li key={group.id} className="min-w-0">
                      <Link
                        to="/grupos/$groupId"
                        params={{ groupId: String(group.id) }}
                        className="pomi-focus group flex min-h-12 items-center gap-3 rounded-md py-1.5 transition-colors hover:bg-muted/40 active:bg-muted/60"
                      >
                        <GroupAvatar
                          mediaId={group.avatarMediaId}
                          name={group.name}
                          size="compact"
                        />
                        <div className="min-w-0">
                          <p className="break-words text-sm font-semibold group-hover:underline group-hover:decoration-primary group-hover:underline-offset-4">
                            {group.name}
                          </p>
                          {positions.map((position) => {
                            const period = positionPeriod(
                              position.startedAt,
                              position.endedAt,
                            )
                            return (
                              <p
                                key={position.id}
                                className="mt-0.5 break-words text-xs leading-relaxed text-muted-foreground"
                              >
                                {position.title}
                                {period && ` · ${period}`}
                              </p>
                            )
                          })}
                          {positions.length === 0 && joined && (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              Desde {joined}
                            </p>
                          )}
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        )}
        <section aria-labelledby="profile-interests">
          <h2
            id="profile-interests"
            className="flex items-center gap-2 text-xl font-extrabold"
          >
            <Tags aria-hidden="true" className="size-5" /> Interesses
          </h2>
          {interests.length ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {interests.map((interest) => (
                <li key={interest.id} className="max-w-full">
                  <Link
                    to="/disciplinas"
                    search={{ tagId: interest.id, page: 1 }}
                    className="pomi-focus inline-flex max-w-full rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-85"
                  >
                    <span className="min-w-0 break-words">{interest.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Nenhum interesse informado.
            </p>
          )}
        </section>
      </div>
      <section
        aria-labelledby="profile-schedule"
        className="min-w-0 border-t border-border/35 pt-5"
      >
        <h2 id="profile-schedule" className="text-xl font-extrabold">
          Agenda das aulas
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Horários compartilhados das turmas que esta pessoa está cursando.
        </p>
        {scheduleMeetings.length ? (
          <div className="mt-4">
            <StudentWeeklySchedule meetings={scheduleMeetings} tone="subtle" />
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Não há horários compartilhados disponíveis.
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
                  key={`${course.courseCode}-${course.classCode}`}
                  className="rounded-md border-2 border-border bg-background p-3"
                >
                  <p className="break-words font-extrabold">
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
      </section>
      <section
        aria-labelledby="profile-plans"
        className="border-t border-border/35 pt-5"
      >
        <h2
          id="profile-plans"
          className="flex items-center gap-2 text-xl font-extrabold"
        >
          <BookOpen aria-hidden="true" className="size-5 shrink-0" />{' '}
          Planejamentos compartilhados
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Planejamentos públicos e, quando aplicável, visíveis para amigos.
        </p>
        {plansQuery.isPending ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Carregando planejamentos...
          </p>
        ) : plansQuery.isError ? (
          <p role="alert" className="mt-3 text-sm text-destructive">
            Não foi possível carregar os planejamentos compartilhados.
          </p>
        ) : sharedPlans.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Nenhum planejamento compartilhado.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {sharedPlans.map((plan) => (
              <li key={plan.shareId}>
                <Link
                  to="/planejamentos-de-semestre/compartilhado/$shareId"
                  params={{ shareId: plan.shareId }}
                  className="pomi-focus flex flex-wrap items-center justify-between gap-2 rounded-md py-3 hover:bg-muted"
                >
                  <div className="min-w-0">
                    <h3 className="break-words font-bold">
                      {plan.name || 'Planejamento de semestre'}
                    </h3>
                    <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                      <CalendarDays aria-hidden="true" className="size-4" />
                      {studyPeriodLabel({
                        year: plan.studyPeriodYear,
                        yearPeriod: plan.studyPeriodYearPeriod,
                      })}{' '}
                      · {plan.classes.length} disciplina
                      {plan.classes.length === 1 ? '' : 's'}
                    </p>
                  </div>
                  <span className="rounded-full bg-muted px-2 py-1 text-xs font-semibold">
                    {visibilityLabel(plan.visibility)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <Dialog open={confirmRemoval} onOpenChange={setConfirmRemoval}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover amizade?</DialogTitle>
            <DialogDescription>
              Você deixará de ser amigo de {person.displayName}. Conteúdos
              restritos a amigos poderão ficar indisponíveis.
            </DialogDescription>
          </DialogHeader>
          {remove.isError && (
            <p role="alert" className="text-sm text-destructive">
              Não foi possível remover a amizade. Tente novamente.
            </p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmRemoval(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={remove.isPending || !friendship}
              onClick={() => friendship && remove.mutate(friendship.id)}
            >
              Remover amizade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
