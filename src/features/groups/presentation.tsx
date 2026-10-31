import { Link } from '@tanstack/react-router'
import { CalendarDays, MapPin } from 'lucide-react'

import type { GroupEvent } from '@ominira/pomi-sdk/generated/app'

export const permissionLabels = {
  GROUP_EDIT: 'Editar perfil e contatos',
  GROUP_TAG_MANAGE: 'Organizar tags',
  MEMBER_MANAGE: 'Convidar e gerenciar pessoas',
  ROLE_MANAGE: 'Gerenciar acessos',
  EVENT_CREATE: 'Criar eventos',
  EVENT_EDIT: 'Editar eventos',
  EVENT_PUBLISH: 'Publicar e cancelar eventos',
} as const

export function formatGroupDate(value: string | null) {
  return value
    ? new Date(value).toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Data a confirmar'
}

export function formatEventDate(value: string | null) {
  return value
    ? new Date(value).toLocaleString('pt-BR', {
        dateStyle: 'long',
        timeStyle: 'short',
      })
    : 'Data a confirmar'
}

export function localDateTime(value: string | null) {
  if (!value) return ''
  const date = new Date(value)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16)
}

export function EventCard({
  event,
  groupName,
}: {
  event: GroupEvent
  groupName?: string
}) {
  return (
    <article className="flex h-full flex-col rounded-md border-2 border-strong-border bg-card p-5">
      <p className="flex items-start gap-2 text-sm font-bold text-primary">
        <CalendarDays aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <span>{formatEventDate(event.startsAt)}</span>
      </p>
      <h3 className="mt-3 text-xl font-extrabold leading-tight">
        <Link
          to="/eventos/$eventId"
          params={{ eventId: String(event.id) }}
          className="pomi-focus hover:text-primary"
        >
          {event.name}
        </Link>
      </h3>
      {event.description && (
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
          {event.description}
        </p>
      )}
      {event.location && (
        <p className="mt-3 flex items-start gap-2 text-sm">
          <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>{event.location}</span>
        </p>
      )}
      {groupName && (
        <p className="mt-auto pt-4 text-sm text-muted-foreground">
          Por{' '}
          <Link
            to="/grupos/$groupId"
            params={{ groupId: String(event.groupId) }}
            className="pomi-focus font-bold text-primary hover:underline"
          >
            {groupName}
          </Link>
        </p>
      )}
      {event.tags.length > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          {event.tags.map((tag) => tag.name).join(' · ')}
        </p>
      )}
    </article>
  )
}
