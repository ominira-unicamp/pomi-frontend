import { useMutation, useQuery } from '@tanstack/react-query'
import { useBlocker, useNavigate } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import type { ManagedGroupEvent, Tag } from '@ominira/pomi-sdk/generated/app'
import { ContextLink as Link, useNavigationContext } from '@/app/navigation/NavigationContext'
import { readReturnTo } from '@/lib/navigation'
import { groupApi } from '@/features/groups/data/groupApi'
import { displayLocalDateTime, preserveUnchangedInstant } from '@/features/groups/dateFields'
import { Failure } from '@/features/groups/EditorFeedback'
import { useGroupManagement } from '@/features/groups/GroupManagementLayout'
import { LocalDateTimeField } from '@/features/groups/LocalDateTimeField'
import { pomiSdk } from '@/api/client'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { ErrorState } from '@/components/PageLayout'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { EventBack, eventsPath } from '@/features/groups/eventManagementQueries'

export function EventForm({ event }: { event?: ManagedGroupEvent }) {
  const navigation = useNavigationContext()
  const returnTo = readReturnTo(navigation.search.returnTo, navigation.pathname)
  const { group, own, userId, refresh } = useGroupManagement()
  const auth = useOptionalAuth()
  const navigate = useNavigate()
  const originalStart = displayLocalDateTime(event?.startsAt ?? null)
  const originalEnd = displayLocalDateTime(event?.endsAt ?? null)
  const [name, setName] = useState(event?.name ?? '')
  const [description, setDescription] = useState(event?.description ?? '')
  const [startDate, setStartDate] = useState(originalStart.date)
  const [startTime, setStartTime] = useState(originalStart.time)
  const [endDate, setEndDate] = useState(originalEnd.date)
  const [endTime, setEndTime] = useState(originalEnd.time)
  const [location, setLocation] = useState(event?.location ?? '')
  const [tagIds, setTagIds] = useState(event?.tags.map((tag) => tag.id) ?? [])
  const [error, setError] = useState('')
  const [savedId, setSavedId] = useState<number>()
  const savedRef = useRef(false)
  const canEdit = own.permissions.includes('EVENT_EDIT')
  const allowed = event
    ? canEdit && event.status !== 'CANCELLED'
    : own.permissions.includes('EVENT_CREATE')
  const tags = useQuery({
    queryKey: ['public', 'group-tags'],
    queryFn: () => pomiSdk.app.tags.listAll({}),
    enabled: allowed,
  })
  const dirty =
    !savedId &&
    (event
      ? name !== event.name ||
        description !== event.description ||
        startDate !== originalStart.date ||
        startTime !== originalStart.time ||
        endDate !== originalEnd.date ||
        endTime !== originalEnd.time ||
        location !== (event.location ?? '') ||
        tagIds.join(',') !== event.tags.map((tag) => tag.id).join(',')
      : Boolean(
          name ||
          description ||
          startDate ||
          startTime ||
          endDate ||
          endTime ||
          location ||
          tagIds.length,
        ))
  useBlocker({
    disabled: !dirty,
    enableBeforeUnload: dirty,
    shouldBlockFn: () =>
      !savedRef.current &&
      !window.confirm('Descartar alterações não salvas do evento?'),
  })
  const save = useMutation({
    mutationFn: (body: Parameters<typeof groupApi.createEvent>[2]) =>
      event
        ? groupApi.updateEvent(
            userId,
            group.id,
            event.id,
            body,
            auth.getAccessToken,
          )
        : groupApi.createEvent(userId, group.id, body, auth.getAccessToken),
    onSuccess: (result) => {
      savedRef.current = true
      setSavedId(result.id)
      refresh()
      if (event)
        void navigate({
          to: '/grupos/$groupId/gerenciar/eventos/$eventId',
          search: { returnTo },
          params: { groupId: String(group.id), eventId: String(event.id) },
        })
    },
  })
  if (!allowed)
    return (
      <ErrorState
        title="Acesso insuficiente"
        description="Você não tem permissão para esta tarefa."
      />
    )
  if (savedId)
    return (
      <section className="space-y-4">
        <EventBack groupId={group.id} />
        <h2 className="text-2xl font-extrabold">Rascunho criado</h2>
        <p role="status">
          O evento foi salvo e continua visível apenas para a gestão do grupo.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to={eventsPath}
            params={{ groupId: String(group.id) }}
            className={buttonVariants()}
          >
            Ver eventos do grupo
          </Link>
          {(canEdit || own.permissions.includes('EVENT_PUBLISH')) && (
            <Link
              to="/grupos/$groupId/gerenciar/eventos/$eventId"
              params={{ groupId: String(group.id), eventId: String(savedId) }}
              className={buttonVariants({ variant: 'outline' })}
            >
              Ver detalhes do rascunho
            </Link>
          )}
        </div>
      </section>
    )
  return (
    <section className="max-w-3xl space-y-5">
      <EventBack groupId={group.id} />
      <h2 className="text-2xl font-extrabold">
        {event ? 'Editar evento' : 'Novo evento'}
      </h2>
      <p className="text-sm text-muted-foreground">
        {event
          ? 'Revise os dados antes de salvar.'
          : 'O evento será salvo como rascunho e não aparecerá na página pública.'}
      </p>
      <form
        className="space-y-7"
        onSubmit={(submit) => {
          submit.preventDefault()
          const start = preserveUnchangedInstant(
            startDate,
            startTime,
            event?.startsAt ?? null,
          )
          const end = preserveUnchangedInstant(
            endDate,
            endTime,
            event?.endsAt ?? null,
          )
          if (start.error || end.error) {
            setError(
              start.error ? `Início: ${start.error}` : `Fim: ${end.error}`,
            )
            return
          }
          if (
            start.value &&
            end.value &&
            new Date(end.value) < new Date(start.value)
          ) {
            setError('O fim não pode anteceder o início.')
            return
          }
          setError('')
          save.mutate({
            name: name.trim(),
            description: description.trim(),
            startsAt: start.value,
            endsAt: end.value,
            location: location.trim() || null,
            ...(event
              ? {
                  tags: {
                    add: tagIds.filter(
                      (id) => !event.tags.some((tag) => tag.id === id),
                    ),
                    remove: event.tags
                      .filter((tag) => !tagIds.includes(tag.id))
                      .map((tag) => tag.id),
                  },
                }
              : { tagIds }),
          })
        }}
      >
        <fieldset className="space-y-3 rounded-md border border-border p-4">
          <legend className="px-1 font-extrabold">Informações básicas</legend>
          <label className="block text-sm font-bold">
            Nome
            <Input
              value={name}
              maxLength={160}
              required
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="block text-sm font-bold">
            Descrição
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </fieldset>
        <fieldset className="space-y-4 rounded-md border border-border p-4">
          <legend className="px-1 font-extrabold">Data, hora e local</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <LocalDateTimeField
              label="Início"
              date={startDate}
              time={startTime}
              onDateChange={setStartDate}
              onTimeChange={setStartTime}
            />
            <LocalDateTimeField
              label="Fim (opcional)"
              date={endDate}
              time={endTime}
              onDateChange={setEndDate}
              onTimeChange={setEndTime}
            />
          </div>
          <label className="block text-sm font-bold">
            Local (opcional)
            <Input
              value={location}
              maxLength={320}
              onChange={(e) => setLocation(e.target.value)}
            />
          </label>
        </fieldset>
        <fieldset className="space-y-3 rounded-md border border-border p-4">
          <legend className="px-1 font-extrabold">Assuntos</legend>
          <label className="block text-sm font-bold">
            Adicionar assunto
            <select
              className="pomi-focus mt-1 min-h-10 w-full rounded-md border-2 border-input bg-background px-3"
              value=""
              onChange={(e) => {
                const id = Number(e.target.value)
                if (id) setTagIds((current) => [...current, id])
              }}
            >
              <option value="">Escolha um assunto</option>
              {(tags.data ?? [])
                .filter((tag: Tag) => !tagIds.includes(tag.id))
                .map((tag: Tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
            </select>
          </label>
          {tags.isError && (
            <Failure message="Não foi possível carregar os assuntos." />
          )}
          {tagIds.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tagIds.map((id) => (
                <Button
                  key={id}
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setTagIds((current) =>
                      current.filter((value) => value !== id),
                    )
                  }
                >
                  Remover{' '}
                  {tags.data?.find((tag: Tag) => tag.id === id)?.name ??
                    event?.tags.find((tag) => tag.id === id)?.name ??
                    'assunto'}
                </Button>
              ))}
            </div>
          )}
        </fieldset>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        {save.isError && (
          <Failure message="Não foi possível salvar o evento. Confira os dados e tente novamente." />
        )}
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={save.isPending || !name.trim()}>
            {save.isPending
              ? 'Salvando...'
              : event
                ? 'Salvar evento'
                : 'Salvar rascunho'}
          </Button>
          <Link
            to={
              event ? '/grupos/$groupId/gerenciar/eventos/$eventId' : eventsPath
            }
            params={
              event
                ? { groupId: String(group.id), eventId: String(event.id) }
                : { groupId: String(group.id) }
            }
            className={buttonVariants({ variant: 'outline' })}
          >
            {event ? 'Cancelar edição' : 'Voltar sem criar'}
          </Link>
        </div>
      </form>
    </section>
  )
}
