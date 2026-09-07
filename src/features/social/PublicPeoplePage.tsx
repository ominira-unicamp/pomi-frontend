import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Search, Users } from 'lucide-react'
import { useState } from 'react'

import { PersonLink, RelationshipAction } from './components'
import { relationshipFor } from './types'
import { useOptionalAuth } from '@/auth/AuthProvider'
import {
  EmptyState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  acceptFriendship,
  listFriendships,
  requestFriendship,
  searchPeople,
} from '@/features/friends/studentSocialApi'
import { useStudentProfile } from '@/features/student/hooks/useStudentProfile'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'

export function PublicPeoplePage() {
  const auth = useOptionalAuth()
  const sessionSubject = auth.sessionSubject ?? 'unknown-session'
  const queryClient = useQueryClient()
  const { studentId, studentQuery } = useStudentProfile()
  const [search, setSearch] = useState('')
  const friendshipsQuery = useQuery({
    queryKey: privateQueryKeys.studentSocialFriendships(
      sessionSubject,
      studentId,
    ),
    queryFn: () => listFriendships(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId),
  })
  const peopleQuery = useQuery({
    queryKey: privateQueryKeys.studentSocialPeople(
      sessionSubject,
      studentId,
      search.trim(),
    ),
    queryFn: () =>
      searchPeople(studentId!, search.trim() || undefined, auth.getAccessToken),
    enabled: Boolean(studentId),
  })
  const refresh = () =>
    queryClient.invalidateQueries({
      queryKey: privateQueryKeys.studentSocial(sessionSubject, studentId),
    })
  const add = useMutation({
    mutationFn: (publicId: string) =>
      requestFriendship(studentId!, publicId, auth.getAccessToken),
    onSuccess: refresh,
  })
  const accept = useMutation({
    mutationFn: (id: number) =>
      acceptFriendship(studentId!, id, auth.getAccessToken),
    onSuccess: refresh,
  })
  if (studentQuery.isLoading)
    return (
      <PageContainer>
        <LoadingState label="Carregando comunidade" />
      </PageContainer>
    )
  if (!studentId)
    return (
      <PageContainer>
        <EmptyState
          title="Perfil acadêmico necessário"
          description="Entre com uma conta de estudante para encontrar perfis públicos."
        />
      </PageContainer>
    )
  const people = peopleQuery.data?.items ?? []
  const friendships = friendshipsQuery.data ?? []
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Comunidade"
        title="Pessoas"
        description="Encontre estudantes que optaram por tornar seu perfil público."
      />
      <label className="relative mb-6 block max-w-xl">
        <span className="sr-only">Buscar pessoas</span>
        <Search className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="h-11 pl-10"
          placeholder="Buscar por nome ou código público"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </label>
      {peopleQuery.isLoading ? (
        <LoadingState label="Buscando perfis" />
      ) : people.length === 0 ? (
        <EmptyState
          title="Nenhum perfil encontrado"
          description="Tente buscar por outro nome ou código público."
        />
      ) : (
        <section className="grid gap-4 sm:grid-cols-2">
          {people.map((person) => {
            const state = relationshipFor(person, studentId, friendships)
            const friendship = friendships.find(
              (item) => item.friend.publicId === person.publicId,
            )
            return (
              <Card key={person.publicId} variant="flat" className="h-full">
                <CardContent className="grid h-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-lg font-black text-primary-foreground">
                    {person.displayName.slice(0, 1).toUpperCase()}
                  </span>
                  <PersonLink person={person} />
                  <RelationshipAction
                    state={state}
                    busy={add.isPending || accept.isPending}
                    onAdd={() => add.mutate(person.publicId)}
                    onAccept={() => friendship && accept.mutate(friendship.id)}
                  />
                </CardContent>
              </Card>
            )
          })}
        </section>
      )}
      <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="size-4" /> Perfis públicos mostram somente as
        informações autorizadas pelo próprio estudante.
      </p>
    </PageContainer>
  )
}
