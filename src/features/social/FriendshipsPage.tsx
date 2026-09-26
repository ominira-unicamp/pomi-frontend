import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, Trash2, Users } from 'lucide-react'

import { PersonLink } from './components'
import { useOptionalAuth } from '@/auth/AuthProvider'
import {
  EmptyState,
  LoadingState,
  PageContainer,
} from '@/components/PageLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  acceptFriendship,
  listFriendships,
  removeFriendship,
} from '@/features/friends/studentSocialApi'
import { useStudentProfile } from '@/features/student/hooks/useStudentProfile'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'

type FriendshipsPageProps = {
  view: 'friends' | 'requests'
}

export function FriendshipsPage({ view }: FriendshipsPageProps) {
  const auth = useOptionalAuth()
  const sessionSubject = auth.sessionSubject ?? 'unknown-session'
  const queryClient = useQueryClient()
  const { studentId, studentQuery } = useStudentProfile()
  const friendshipsQuery = useQuery({
    queryKey: privateQueryKeys.studentSocialFriendships(
      sessionSubject,
      studentId,
    ),
    queryFn: () => listFriendships(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId),
  })
  const refresh = () =>
    queryClient.invalidateQueries({
      queryKey: privateQueryKeys.studentSocial(sessionSubject, studentId),
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
  if (studentQuery.isLoading || friendshipsQuery.isLoading)
    return (
      <PageContainer>
        <LoadingState label="Carregando amizades" />
      </PageContainer>
    )
  if (!studentId)
    return (
      <PageContainer>
        <EmptyState
          title="Perfil acadêmico necessário"
          description="Conclua seu cadastro de estudante antes de gerenciar amizades."
        />
      </PageContainer>
    )
  const items = friendshipsQuery.data ?? []
  const incoming = items.filter(
    (item) => item.status === 'PENDING' && item.direction === 'INCOMING',
  )
  const outgoing = items.filter(
    (item) => item.status === 'PENDING' && item.direction === 'OUTGOING',
  )
  const accepted = items.filter((item) => item.status === 'ACCEPTED')
  const hasRequests = incoming.length > 0 || outgoing.length > 0
  const requestGroups = [
    { title: 'Recebidas', items: incoming },
    { title: 'Enviadas', items: outgoing },
  ].filter((group) => group.items.length > 0)
  const showRequests = view === 'requests'
  const showFriends = view === 'friends'
  return (
    <div className="grid gap-6">
      {showRequests && hasRequests && (
        <Card variant="flat">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle>Solicitações</CardTitle>
            <p className="text-sm text-muted-foreground">
              Gerencie quem quer se conectar com você.
            </p>
          </CardHeader>
          <CardContent className="grid gap-6 pt-5">
            {requestGroups.map(({ title, items: requests }) => {
              return (
                <section key={title} className="grid gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-black">{title}</h3>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-black">
                      {requests.length}
                    </span>
                  </div>
                  <ul className="grid gap-2">
                    {requests.map((item) => (
                      <li
                        key={item.id}
                        className="grid gap-3 rounded-md border border-border bg-background p-3"
                      >
                        <PersonLink person={item.friend} />
                        <div className="flex flex-wrap gap-2">
                          {item.direction === 'INCOMING' && (
                            <Button
                              size="sm"
                              disabled={accept.isPending}
                              onClick={() => accept.mutate(item.id)}
                            >
                              <Check /> Aceitar
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={remove.isPending}
                            onClick={() => remove.mutate(item.id)}
                          >
                            <Trash2 />
                            {item.direction === 'INCOMING'
                              ? 'Recusar'
                              : 'Cancelar'}
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )
            })}
          </CardContent>
        </Card>
      )}
      {showFriends && accepted.length > 0 && (
        <Card variant="flat">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="flex items-center justify-between gap-3">
              <span>Amigos</span>
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-black">
                {accepted.length}
              </span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Pessoas com quem você já se conectou.
            </p>
          </CardHeader>
          <CardContent className="pt-5">
            <ul className="grid gap-3 sm:grid-cols-2">
              {accepted.map((item) => (
                <li
                  key={item.id}
                  className="grid gap-3 rounded-md border border-border bg-background p-3"
                >
                  <PersonLink person={item.friend} />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      {((view === 'friends' && accepted.length === 0) ||
        (view === 'requests' && !hasRequests)) && (
        <p className="mt-6 rounded-md border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">
          {view === 'friends'
            ? 'Você ainda não possui amizades.'
            : 'Você não possui solicitações de amizade.'}
        </p>
      )}
      {view !== 'friends' && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="size-4" /> Abra um perfil para conhecer melhor uma
          pessoa antes de enviar uma solicitação.
        </p>
      )}
    </div>
  )
}
