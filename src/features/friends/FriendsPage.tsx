import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, Copy, Search, Trash2, UserPlus, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

import type {
  Friendship,
  PublicPerson,
  PublicProfile,
} from '@/features/friends/studentSocialApi'
import { useOptionalAuth } from '@/auth/AuthProvider'
import {
  EmptyState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  acceptFriendship,
  getPublicProfile,
  hasPublicProfileChanges,
  listFriendships,
  publicProfileUpdateInput,
  removeFriendship,
  requestFriendship,
  searchPeople,
  updatePublicProfile,
} from '@/features/friends/studentSocialApi'
import { useStudentProfile } from '@/features/student/hooks/useStudentProfile'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'

function PersonDetails({ person }: { person: PublicPerson }) {
  return (
    <div className="min-w-0">
      <p className="font-extrabold">{person.displayName}</p>
      {person.bio && (
        <p className="text-sm text-muted-foreground">{person.bio}</p>
      )}
      <p className="text-xs text-muted-foreground">
        {[person.program?.name, person.specialization?.name, person.entryYear]
          .filter(Boolean)
          .join(' · ')}
      </p>
    </div>
  )
}

function FriendshipCard({
  friendship,
  busy,
  onAccept,
  onRemove,
}: {
  friendship: Friendship
  busy: boolean
  onAccept: () => void
  onRemove: () => void
}) {
  return (
    <li className="flex items-center justify-between gap-4 rounded-md border-2 border-strong-border p-4">
      <PersonDetails person={friendship.friend} />
      <div className="flex shrink-0 gap-2">
        {friendship.direction === 'INCOMING' && (
          <Button size="sm" disabled={busy} onClick={onAccept}>
            <Check />
            Aceitar
          </Button>
        )}
        <Button size="sm" variant="outline" disabled={busy} onClick={onRemove}>
          <Trash2 />
          {friendship.status === 'ACCEPTED'
            ? 'Remover'
            : friendship.direction === 'INCOMING'
              ? 'Recusar'
              : 'Cancelar'}
        </Button>
      </div>
    </li>
  )
}

export function FriendsPage() {
  const auth = useOptionalAuth()
  const sessionSubject = auth.sessionSubject ?? 'unknown-session'
  const queryClient = useQueryClient()
  const { studentId, studentQuery } = useStudentProfile()
  const [search, setSearch] = useState('')
  const [form, setForm] = useState<PublicProfile>()
  const profile = useQuery({
    queryKey: privateQueryKeys.studentSocialProfile(sessionSubject, studentId),
    queryFn: () => getPublicProfile(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId),
  })
  const friendships = useQuery({
    queryKey: privateQueryKeys.studentSocialFriendships(
      sessionSubject,
      studentId,
    ),
    queryFn: () => listFriendships(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId),
  })
  const people = useQuery({
    queryKey: privateQueryKeys.studentSocialPeople(
      sessionSubject,
      studentId,
      search.trim(),
    ),
    queryFn: () => searchPeople(studentId!, search.trim(), auth.getAccessToken),
    enabled: Boolean(studentId && search.trim().length >= 3),
  })
  useEffect(() => {
    if (profile.data) setForm(profile.data)
  }, [profile.data])
  const refresh = () =>
    queryClient.invalidateQueries({
      queryKey: privateQueryKeys.studentSocial(sessionSubject, studentId),
    })
  const save = useMutation({
    mutationFn: () =>
      updatePublicProfile(
        studentId!,
        publicProfileUpdateInput(form!),
        auth.getAccessToken,
      ),
    onSuccess: (value) => {
      setForm(value)
      void refresh()
    },
  })
  const add = useMutation({
    mutationFn: (publicId: string) =>
      requestFriendship(studentId!, publicId, auth.getAccessToken),
    onSuccess: () => void refresh(),
  })
  const accept = useMutation({
    mutationFn: (id: number) =>
      acceptFriendship(studentId!, id, auth.getAccessToken),
    onSuccess: () => void refresh(),
  })
  const remove = useMutation({
    mutationFn: (id: number) =>
      removeFriendship(studentId!, id, auth.getAccessToken),
    onSuccess: () => void refresh(),
  })
  if (studentQuery.isLoading || (studentId && profile.isLoading))
    return (
      <PageContainer>
        <LoadingState label="Carregando perfil e amizades" />
      </PageContainer>
    )
  if (!studentId)
    return (
      <PageContainer>
        <EmptyState
          title="Perfil acadêmico necessário"
          description="Conclua seu cadastro de estudante antes de usar a área de amigos."
        />
      </PageContainer>
    )
  const groups = {
    incoming:
      friendships.data?.filter(
        (item) => item.status === 'PENDING' && item.direction === 'INCOMING',
      ) ?? [],
    outgoing:
      friendships.data?.filter(
        (item) => item.status === 'PENDING' && item.direction === 'OUTGOING',
      ) ?? [],
    accepted:
      friendships.data?.filter((item) => item.status === 'ACCEPTED') ?? [],
  }
  const hasProfileChanges = hasPublicProfileChanges(form, profile.data)
  return (
    <PageContainer size="wide">
      <PageHeader
        eyebrow="Comunidade"
        title="Amigos"
        description="Controle o que aparece no seu perfil e encontre outros estudantes."
      />
      {form && (
        <Card>
          <CardHeader>
            <CardTitle>Seu perfil público</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1 text-sm font-bold">
              Nome público
              <Input
                value={form.displayName}
                onChange={(event) =>
                  setForm({ ...form, displayName: event.target.value })
                }
              />
            </label>
            <label className="grid gap-1 text-sm font-bold">
              Código público
              <div className="flex gap-2">
                <Input readOnly value={form.publicId} />
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Copiar código público"
                  onClick={() =>
                    void navigator.clipboard.writeText(form.publicId)
                  }
                >
                  <Copy />
                </Button>
              </div>
            </label>
            <label className="grid gap-1 text-sm font-bold md:col-span-2">
              Bio
              <textarea
                className="pomi-focus min-h-24 rounded-md border-2 border-input bg-background p-3 font-medium"
                maxLength={280}
                value={form.bio ?? ''}
                onChange={(event) =>
                  setForm({ ...form, bio: event.target.value || null })
                }
              />
            </label>
            <div className="flex flex-wrap gap-4 md:col-span-2">
              {(
                [
                  ['enabled', 'Perfil encontrável'],
                  ['showProgram', 'Mostrar curso'],
                  ['showSpecialization', 'Mostrar modalidade'],
                  ['showEntryYear', 'Mostrar ano de ingresso'],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 font-bold">
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(event) =>
                      setForm({ ...form, [key]: event.target.checked })
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
            <div className="md:col-span-2">
              <Button
                disabled={save.isPending || !hasProfileChanges}
                onClick={() => save.mutate()}
              >
                Salvar perfil
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Encontrar pessoas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 size-5 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Nome ou código público (mínimo 3 caracteres)"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <ul className="mt-4 grid gap-3">
              {people.data?.items.map((person) => (
                <li
                  key={person.publicId}
                  className="flex items-center justify-between gap-4 rounded-md border p-3"
                >
                  <PersonDetails person={person} />
                  <Button
                    size="sm"
                    disabled={add.isPending}
                    onClick={() => add.mutate(person.publicId)}
                  >
                    <UserPlus />
                    Adicionar
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <Users className="mr-2 inline size-5" />
              Suas conexões
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            {(
              [
                ['Solicitações recebidas', groups.incoming],
                ['Solicitações enviadas', groups.outgoing],
                ['Amigos', groups.accepted],
              ] as const
            ).map(([title, items]) => (
              <section key={title}>
                <h3 className="mb-2 font-black">{title}</h3>
                {items.length ? (
                  <ul className="grid gap-2">
                    {items.map((item) => (
                      <FriendshipCard
                        key={item.id}
                        friendship={item}
                        busy={accept.isPending || remove.isPending}
                        onAccept={() => accept.mutate(item.id)}
                        onRemove={() => remove.mutate(item.id)}
                      />
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhum item.</p>
                )}
              </section>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
