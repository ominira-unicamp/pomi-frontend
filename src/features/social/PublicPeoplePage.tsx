import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Search, Users } from 'lucide-react'
import { useState } from 'react'

import { PersonLink, RelationshipAction } from './components'
import { relationshipFor } from './types'
import { UserIdentityState } from '@/features/identity/UserIdentityState'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { AuthRequiredState } from '@/components/AuthRequiredState'
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
} from '@/features/friends/userSocialApi'
import { useUserContext } from '@/features/identity'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'

export function PublicPeoplePage() {
  const auth = useOptionalAuth()
  const sessionSubject = auth.sessionSubject ?? 'unknown-session'
  const queryClient = useQueryClient()
  const { userId, userQuery } = useUserContext()
  const [search, setSearch] = useState('')
  const friendshipsQuery = useQuery({
    queryKey: privateQueryKeys.userSocialFriendships(sessionSubject, userId),
    queryFn: () => listFriendships(userId!, auth.getAccessToken),
    enabled: Boolean(userId),
  })
  const peopleQuery = useQuery({
    queryKey: privateQueryKeys.userSocialPeople(
      sessionSubject,
      userId,
      search.trim(),
    ),
    queryFn: () =>
      searchPeople(userId!, search.trim() || undefined, auth.getAccessToken),
    enabled: Boolean(userId),
  })
  const refresh = () =>
    queryClient.invalidateQueries({
      queryKey: privateQueryKeys.userSocial(sessionSubject, userId),
    })
  const add = useMutation({
    mutationFn: (publicId: string) =>
      requestFriendship(userId!, publicId, auth.getAccessToken),
    onSuccess: refresh,
  })
  const accept = useMutation({
    mutationFn: (id: number) =>
      acceptFriendship(userId!, id, auth.getAccessToken),
    onSuccess: refresh,
  })
  if (!auth.initialized || userQuery.isLoading)
    return (
      <PageContainer>
        <LoadingState label="Carregando comunidade" />
      </PageContainer>
    )
  if (!auth.isAuthenticated)
    return (
      <PageContainer>
        <PageHeader
          eyebrow="Comunidade"
          title="Pessoas"
          description="Encontre pessoas que optaram por tornar seu perfil público."
        />
        <AuthRequiredState
          title="Entre para encontrar pessoas"
          description="A comunidade é reservada a usuários autenticados e respeita as escolhas de privacidade de cada perfil."
          onLogin={() => void auth.login(window.location.href)}
        />
      </PageContainer>
    )
  if (!userId)
    return (
      <PageContainer>
        <UserIdentityState query={userQuery} />
      </PageContainer>
    )
  const people = peopleQuery.data?.items ?? []
  const friendships = friendshipsQuery.data ?? []
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Comunidade"
        title="Pessoas"
        description="Encontre pessoas que optaram por tornar seu perfil público."
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
            const state = relationshipFor(person, userId, friendships)
            const friendship = friendships.find(
              (item) => item.friend.publicId === person.publicId,
            )
            return (
              <Card key={person.publicId} variant="flat" className="h-full">
                <CardContent className="grid h-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4">
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
        informações autorizadas pela própria pessoa.
      </p>
    </PageContainer>
  )
}
