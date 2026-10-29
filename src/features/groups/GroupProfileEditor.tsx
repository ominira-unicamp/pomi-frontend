import { useMutation, useQuery } from '@tanstack/react-query'
import { useBlocker } from '@tanstack/react-router'
import { useState } from 'react'

import { groupApi } from './data/groupApi'
import { Failure } from './EditorFeedback'
import type {
  Group,
  OwnGroupMembership,
  Tag,
} from '@ominira/pomi-sdk/generated/app'
import { pomiSdk } from '@/api/client'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { MediaEditor } from '@/features/media/MediaEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function ProfileEditor({
  group,
  studentId,
  permissions,
  refresh,
}: {
  group: Group
  studentId: number
  permissions: OwnGroupMembership['permissions']
  refresh: () => void
}) {
  const auth = useOptionalAuth()
  const [name, setName] = useState(group.name)
  const [description, setDescription] = useState(group.description ?? '')
  const [contactType, setContactType] = useState('email')
  const [contactValue, setContactValue] = useState('')
  const [linkLabel, setLinkLabel] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [selectedTagId, setSelectedTagId] = useState('')
  const [editingContactId, setEditingContactId] = useState<number>()
  const [editingContactType, setEditingContactType] = useState('')
  const [editingContactLabel, setEditingContactLabel] = useState('')
  const [editingContactValue, setEditingContactValue] = useState('')
  const [editingLinkId, setEditingLinkId] = useState<number>()
  const [editingLinkLabel, setEditingLinkLabel] = useState('')
  const [editingLinkUrl, setEditingLinkUrl] = useState('')
  const dirty =
    name !== group.name ||
    description !== (group.description ?? '') ||
    contactValue.length > 0 ||
    linkLabel.length > 0 ||
    linkUrl.length > 0 ||
    editingContactId !== undefined ||
    editingLinkId !== undefined
  useBlocker({
    disabled: !dirty,
    enableBeforeUnload: dirty,
    shouldBlockFn: () => !window.confirm('Descartar alterações não salvas?'),
  })
  const tagsQuery = useQuery({
    queryKey: ['public', 'group-tags'],
    queryFn: () => pomiSdk.app.tags.listAll({}),
  })
  const update = useMutation({
    mutationFn: (body: Parameters<typeof groupApi.update>[2]) =>
      groupApi.update(studentId, group.id, body, auth.getAccessToken),
    onSuccess: (updated) => {
      setName(updated.name)
      setDescription(updated.description ?? '')
      refresh()
    },
  })
  return (
    <div className="space-y-6">
      {permissions.includes('GROUP_EDIT') && (
        <section className="grid gap-5 border-b border-border pb-6 sm:grid-cols-2">
          <MediaEditor
            label="Avatar do grupo"
            target={{ kind: 'groupAvatar', studentId, groupId: group.id }}
            mediaId={group.avatarMediaId}
            preset="avatarLarge"
            onChanged={refresh}
          />
          <MediaEditor
            label="Banner do grupo"
            target={{ kind: 'groupBanner', studentId, groupId: group.id }}
            mediaId={group.bannerMediaId}
            preset="banner"
            onChanged={refresh}
          />
        </section>
      )}
      {permissions.includes('GROUP_EDIT') && (
        <form
          className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end"
          onSubmit={(event) => {
            event.preventDefault()
            update.mutate({
              name: name.trim(),
              description: description.trim() || null,
            })
          }}
        >
          <h3 className="font-extrabold sm:col-span-2">Nome e descrição</h3>
          <div className="space-y-3">
            <label className="block text-sm font-bold">
              Nome
              <Input
                className="mt-1"
                value={name}
                maxLength={160}
                required
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <label className="block text-sm font-bold">
              Descrição
              <Textarea
                className="mt-1"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </label>
          </div>
          <Button type="submit" disabled={update.isPending || !name.trim()}>
            Salvar nome e descrição
          </Button>
        </form>
      )}
      {permissions.includes('GROUP_EDIT') && (
        <div>
          <h3 className="mb-2 font-extrabold">Contatos</h3>
          {group.contacts.length === 0 && (
            <p className="mb-3 text-sm text-muted-foreground">
              Nenhum contato informado.
            </p>
          )}
          {group.contacts.map((contact) => (
            <div
              key={contact.id}
              className="mb-3 rounded-md border border-border p-3 text-sm"
            >
              {editingContactId === contact.id ? (
                <form
                  className="grid gap-2"
                  onSubmit={(event) => {
                    event.preventDefault()
                    update.mutate(
                      {
                        contacts: {
                          update: [
                            {
                              id: contact.id,
                              type: editingContactType.trim(),
                              label: editingContactLabel.trim() || null,
                              value: editingContactValue.trim(),
                            },
                          ],
                        },
                      },
                      { onSuccess: () => setEditingContactId(undefined) },
                    )
                  }}
                >
                  <label className="font-bold">
                    Tipo
                    <Input
                      value={editingContactType}
                      required
                      onChange={(event) =>
                        setEditingContactType(event.target.value)
                      }
                    />
                  </label>
                  <label className="font-bold">
                    Rótulo opcional
                    <Input
                      value={editingContactLabel}
                      onChange={(event) =>
                        setEditingContactLabel(event.target.value)
                      }
                    />
                  </label>
                  <label className="font-bold">
                    Contato
                    <Input
                      value={editingContactValue}
                      required
                      onChange={(event) =>
                        setEditingContactValue(event.target.value)
                      }
                    />
                  </label>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={
                        update.isPending ||
                        !editingContactType.trim() ||
                        !editingContactValue.trim()
                      }
                    >
                      Salvar contato
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingContactId(undefined)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span>
                    <strong>{contact.label || contact.type}:</strong>{' '}
                    {contact.value}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingContactId(contact.id)
                        setEditingContactType(contact.type)
                        setEditingContactLabel(contact.label ?? '')
                        setEditingContactValue(contact.value)
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={update.isPending}
                      onClick={() => {
                        if (
                          window.confirm(`Remover o contato ${contact.value}?`)
                        )
                          update.mutate({ contacts: { remove: [contact.id] } })
                      }}
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <form
            className="grid gap-2 sm:grid-cols-[8rem_1fr_auto]"
            onSubmit={(event) => {
              event.preventDefault()
              update.mutate(
                {
                  contacts: {
                    add: [
                      { type: contactType.trim(), value: contactValue.trim() },
                    ],
                  },
                },
                { onSuccess: () => setContactValue('') },
              )
            }}
          >
            <Input
              aria-label="Tipo do contato"
              value={contactType}
              required
              placeholder="Tipo"
              onChange={(event) => setContactType(event.target.value)}
            />
            <Input
              aria-label="Valor do contato"
              value={contactValue}
              required
              placeholder="E-mail, telefone ou outro contato"
              onChange={(event) => setContactValue(event.target.value)}
            />
            <Button
              type="submit"
              disabled={update.isPending || !contactValue.trim()}
            >
              Adicionar
            </Button>
          </form>
        </div>
      )}
      {permissions.includes('GROUP_EDIT') && (
        <div>
          <h3 className="mb-2 font-extrabold">Links</h3>
          {group.externalLinks.length === 0 && (
            <p className="mb-3 text-sm text-muted-foreground">
              Nenhum link informado.
            </p>
          )}
          {group.externalLinks.map((link) => (
            <div
              key={link.id}
              className="mb-3 rounded-md border border-border p-3 text-sm"
            >
              {editingLinkId === link.id ? (
                <form
                  className="grid gap-2"
                  onSubmit={(event) => {
                    event.preventDefault()
                    update.mutate(
                      {
                        externalLinks: {
                          update: [
                            {
                              id: link.id,
                              label: editingLinkLabel.trim(),
                              url: editingLinkUrl.trim(),
                            },
                          ],
                        },
                      },
                      { onSuccess: () => setEditingLinkId(undefined) },
                    )
                  }}
                >
                  <label className="font-bold">
                    Nome
                    <Input
                      value={editingLinkLabel}
                      required
                      onChange={(event) =>
                        setEditingLinkLabel(event.target.value)
                      }
                    />
                  </label>
                  <label className="font-bold">
                    Endereço
                    <Input
                      type="url"
                      value={editingLinkUrl}
                      required
                      onChange={(event) =>
                        setEditingLinkUrl(event.target.value)
                      }
                    />
                  </label>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={
                        update.isPending ||
                        !editingLinkLabel.trim() ||
                        !editingLinkUrl.trim()
                      }
                    >
                      Salvar link
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingLinkId(undefined)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="break-all">
                    <strong>{link.label}:</strong> {link.url}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingLinkId(link.id)
                        setEditingLinkLabel(link.label)
                        setEditingLinkUrl(link.url)
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={update.isPending}
                      onClick={() => {
                        if (window.confirm(`Remover o link ${link.label}?`))
                          update.mutate({
                            externalLinks: { remove: [link.id] },
                          })
                      }}
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <form
            className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]"
            onSubmit={(event) => {
              event.preventDefault()
              update.mutate(
                {
                  externalLinks: {
                    add: [{ label: linkLabel.trim(), url: linkUrl.trim() }],
                  },
                },
                {
                  onSuccess: () => {
                    setLinkLabel('')
                    setLinkUrl('')
                  },
                },
              )
            }}
          >
            <Input
              aria-label="Nome do link"
              value={linkLabel}
              required
              placeholder="Nome"
              onChange={(event) => setLinkLabel(event.target.value)}
            />
            <Input
              aria-label="Endereço do link"
              type="url"
              value={linkUrl}
              required
              placeholder="https://"
              onChange={(event) => setLinkUrl(event.target.value)}
            />
            <Button
              type="submit"
              disabled={
                update.isPending || !linkLabel.trim() || !linkUrl.trim()
              }
            >
              Adicionar
            </Button>
          </form>
        </div>
      )}
      {permissions.includes('GROUP_TAG_MANAGE') && (
        <div>
          <h3 className="mb-2 font-extrabold">Tags</h3>
          <div className="mb-3 flex flex-wrap gap-2">
            {group.tags.map((tag) => (
              <Button
                key={tag.id}
                size="sm"
                variant="outline"
                disabled={update.isPending}
                onClick={() => update.mutate({ tags: { remove: [tag.id] } })}
              >
                {tag.name} ×
              </Button>
            ))}
          </div>
          <form
            className="flex flex-wrap gap-2"
            onSubmit={(event) => {
              event.preventDefault()
              if (selectedTagId)
                update.mutate(
                  { tags: { add: [Number(selectedTagId)] } },
                  { onSuccess: () => setSelectedTagId('') },
                )
            }}
          >
            <select
              className="pomi-focus min-h-10 min-w-48 rounded-md border-2 border-input bg-background px-3 text-sm"
              aria-label="Escolher tag"
              value={selectedTagId}
              onChange={(event) => setSelectedTagId(event.target.value)}
            >
              <option value="">Escolha uma tag</option>
              {(tagsQuery.data ?? [])
                .filter(
                  (tag: Tag) => !group.tags.some((item) => item.id === tag.id),
                )
                .map((tag: Tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
            </select>
            <Button type="submit" disabled={update.isPending || !selectedTagId}>
              Adicionar tag
            </Button>
          </form>
        </div>
      )}
      {update.isError && (
        <Failure message="Não foi possível salvar. Verifique suas permissões e os dados informados." />
      )}
      {update.isSuccess && (
        <p role="status" className="text-sm font-semibold">
          Alterações salvas.
        </p>
      )}
    </div>
  )
}
