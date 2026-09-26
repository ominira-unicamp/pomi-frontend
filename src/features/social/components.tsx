import { Check, UserPlus } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import type {
  Friendship,
  PublicPerson,
} from '@/features/friends/studentSocialApi'
import type { RelationshipState } from './types'
import { Button } from '@/components/ui/button'

export function PersonSummary({ person }: { person: PublicPerson }) {
  return (
    <div className="min-w-0">
      <p className="font-extrabold">{person.displayName}</p>
      {person.bio && (
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {person.bio}
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        {[
          person.program?.name,
          person.specialization
            ? `${person.specialization.code} · ${person.specialization.name}`
            : null,
          person.entryYear,
        ]
          .filter(Boolean)
          .join(' · ')}
      </p>
    </div>
  )
}

export function RelationshipAction({
  state,
  busy,
  onAdd,
  onAccept,
}: {
  state: RelationshipState
  busy?: boolean
  onAdd?: () => void
  onAccept?: () => void
}) {
  if (state === 'NONE')
    return (
      <Button size="sm" disabled={busy} onClick={onAdd}>
        <UserPlus />
        Adicionar
      </Button>
    )
  if (state === 'INCOMING_PENDING')
    return (
      <Button size="sm" disabled={busy} onClick={onAccept}>
        <Check />
        Aceitar
      </Button>
    )
  return (
    <span className="rounded-md border-2 border-strong-border px-3 py-2 text-xs font-black">
      {state === 'ACCEPTED'
        ? 'Amigos'
        : state === 'OUTGOING_PENDING'
          ? 'Solicitação enviada'
          : 'Seu perfil'}
    </span>
  )
}

export function PersonLink({ person }: { person: PublicPerson }) {
  return (
    <Link
      to="/perfis/$publicId"
      params={{ publicId: person.publicId }}
      className="pomi-focus flex min-w-0 flex-1 items-center rounded-md"
    >
      <PersonSummary person={person} />
    </Link>
  )
}

export function friendshipFor(
  publicId: string,
  friendships: ReadonlyArray<Friendship>,
) {
  return friendships.find((item) => item.friend.publicId === publicId)
}
