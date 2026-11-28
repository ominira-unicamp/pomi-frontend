import { useMutation, useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { SentInvitations } from './SentInvitations'
import { groupApi } from '@/features/groups/data/groupApi'
import { Failure } from '@/features/groups/EditorFeedback'
import { useGroupManagement } from '@/features/groups/GroupManagementLayout'
import { PersonAvatar } from '@/media/IdentityImages'
import { ApiError } from '@/api/errors'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { ErrorState, LoadingState } from '@/components/PageLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { searchPeople } from '@/social-profile/data/userSocialApi'
import { hasPendingInvitation, inviteConflict, peoplePath, useManagedInvitations } from '@/features/groups/peopleManagementQueries'

export function GroupInvitePage() {
  const { group, own, userId, refresh } = useGroupManagement()
  const auth = useOptionalAuth()
  const invitations = useManagedInvitations()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<{
    publicId: string
    displayName: string
    avatarMediaId: string | null
  }>()
  const people = useQuery({
    queryKey: [
      'private',
      auth.sessionSubject,
      'group-invite-people',
      search.trim(),
    ],
    queryFn: () => searchPeople(userId, search.trim(), auth.getAccessToken),
    enabled:
      own.permissions.includes('MEMBER_MANAGE') && search.trim().length >= 2,
  })
  const invite = useMutation({
    mutationFn: async (recipientPublicId: string) => {
      const current = await invitations.refetch()
      if (current.isError || !current.data)
        throw new Error('Não foi possível verificar os convites enviados.')
      if (
        current.data.some(
          (invitation) =>
            invitation.recipientPublicId === recipientPublicId &&
            hasPendingInvitation(invitation),
        )
      )
        throw new ApiError(409, {
          type: 'urn:pomi:problem:conflict',
          title: 'Conflito ao concluir a ação',
          status: 409,
          detail: 'Já existe convite pendente.',
        })
      return groupApi.invite(
        userId,
        group.id,
        recipientPublicId,
        auth.getAccessToken,
      )
    },
    onSuccess: () => {
      setSelected(undefined)
      setSearch('')
      void invitations.refetch()
      refresh()
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 409)
        void invitations.refetch()
    },
  })
  const conflict = invite.isError ? inviteConflict(invite.error) : undefined
  const pendingRecipients = new Set(
    (invitations.data ?? [])
      .filter(hasPendingInvitation)
      .map((invitation) => invitation.recipientPublicId),
  )
  const selectedHasPendingInvitation = selected
    ? pendingRecipients.has(selected.publicId)
    : false
  const selectedHasConflict =
    Boolean(conflict) && invite.variables === selected?.publicId
  if (!own.permissions.includes('MEMBER_MANAGE'))
    return (
      <ErrorState
        title="Acesso insuficiente"
        description="Você não pode enviar convites para este grupo."
      />
    )
  return (
    <section className="max-w-2xl space-y-5">
      <Link
        to={peoplePath}
        params={{ groupId: String(group.id) }}
        className="pomi-focus text-sm font-bold text-primary hover:underline"
      >
        ← Pessoas e convites
      </Link>
      <h2 className="text-2xl font-extrabold">Convidar pessoa</h2>
      <p className="text-sm text-muted-foreground">
        A pessoa poderá aceitar ou recusar o convite. Ao aceitar, seu vínculo
        começa privado.
      </p>
      <SentInvitations invitations={invitations} />
      <label className="block text-sm font-bold">
        Buscar pessoa pelo nome
        <Input
          value={search}
          placeholder="Digite pelo menos 2 letras"
          onChange={(e) => {
            setSearch(e.target.value)
            setSelected(undefined)
            invite.reset()
          }}
        />
      </label>
      {people.isPending && search.trim().length >= 2 && (
        <LoadingState label="Buscando pessoas" />
      )}
      {people.isError && <Failure message="Não foi possível buscar pessoas." />}
      {people.data && (
        <ul className="divide-y divide-border rounded-md border border-border">
          {people.data.items.length === 0 && (
            <li className="p-4 text-sm text-muted-foreground">
              Nenhuma pessoa encontrada.
            </li>
          )}
          {people.data.items.map((person) => (
            <li
              key={person.publicId}
              className="flex items-center justify-between gap-3 p-3"
            >
              <span className="flex items-center gap-3 font-semibold">
                <PersonAvatar
                  mediaId={person.avatarMediaId}
                  name={person.displayName}
                  size="small"
                />
                {person.displayName}
              </span>
              {pendingRecipients.has(person.publicId) && (
                <span className="text-sm text-muted-foreground">
                  Convite pendente
                </span>
              )}
              <Button
                type="button"
                size="sm"
                disabled={
                  invitations.isPending ||
                  invitations.isFetching ||
                  invitations.isError ||
                  pendingRecipients.has(person.publicId)
                }
                variant={
                  selected?.publicId === person.publicId ? 'default' : 'outline'
                }
                aria-pressed={selected?.publicId === person.publicId}
                onClick={() => {
                  setSelected({
                    publicId: person.publicId,
                    displayName: person.displayName,
                    avatarMediaId: person.avatarMediaId,
                  })
                  if (selected?.publicId !== person.publicId) invite.reset()
                }}
              >
                {selected?.publicId === person.publicId
                  ? 'Selecionada'
                  : 'Selecionar'}
              </Button>
            </li>
          ))}
        </ul>
      )}
      {selected && (
        <div className="space-y-3 rounded-md border border-border p-4">
          <p>
            <PersonAvatar
              mediaId={selected.avatarMediaId}
              name={selected.displayName}
            />{' '}
            Convidar <strong>{selected.displayName}</strong>?
          </p>
          <Button
            disabled={
              invite.isPending ||
              invitations.isPending ||
              invitations.isFetching ||
              invitations.isError ||
              selectedHasPendingInvitation ||
              selectedHasConflict
            }
            onClick={() => invite.mutate(selected.publicId)}
          >
            {invite.isPending ? 'Enviando...' : 'Enviar convite'}
          </Button>
        </div>
      )}
      {invite.isSuccess && (
        <p role="status">
          Convite enviado. A pessoa poderá responder antes do prazo de
          expiração.
        </p>
      )}
      {invite.isError && (
        <Failure
          message={
            conflict ?? 'Não foi possível enviar o convite. Tente novamente.'
          }
        />
      )}
    </section>
  )
}
