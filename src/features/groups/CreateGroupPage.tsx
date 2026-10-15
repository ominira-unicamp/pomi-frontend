import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useBlocker } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'

import { groupApi } from './data/groupApi'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { AuthRequiredState } from '@/components/AuthRequiredState'
import {
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useStudentProfile } from '@/features/student/hooks/useStudentProfile'

export function CreateGroupPage() {
  const auth = useOptionalAuth()
  const { studentId, studentQuery } = useStudentProfile()
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const create = useMutation({
    mutationFn: () =>
      groupApi.create(
        studentId!,
        { name: name.trim(), description: description.trim() || null },
        auth.getAccessToken,
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['public', 'groups'] })
      void queryClient.invalidateQueries({
        queryKey: ['private', auth.sessionSubject, 'groups'],
      })
    },
  })
  const dirty = (name.length > 0 || description.length > 0) && !create.data
  useBlocker({
    disabled: !dirty,
    enableBeforeUnload: dirty,
    shouldBlockFn: () => !window.confirm('Descartar o grupo ainda não criado?'),
  })
  if (!auth.initialized || (auth.isAuthenticated && studentQuery.isPending))
    return (
      <PageContainer>
        <LoadingState label="Preparando criação" />
      </PageContainer>
    )
  if (!auth.isAuthenticated)
    return (
      <PageContainer>
        <AuthRequiredState
          title="Entre para criar um grupo"
          description="A criação precisa ser associada à sua conta."
          onLogin={() => void auth.login(window.location.href)}
        />
      </PageContainer>
    )
  if (!studentId)
    return (
      <PageContainer>
        <ErrorState
          title="Perfil necessário"
          description="No momento, criar um grupo exige um perfil de estudante associado à sua conta."
        />
      </PageContainer>
    )
  if (create.data)
    return (
      <PageContainer>
        <PageHeader
          eyebrow="Grupo criado"
          title="Seu grupo já está no ar"
          description="O perfil está público. Você recebeu acesso inicial para organizar as próximas atividades."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            to="/grupos/$groupId/gerenciar"
            params={{ groupId: String(create.data.id) }}
            className="pomi-focus rounded-md border-2 border-strong-border p-5 hover:border-primary"
          >
            <strong>Completar perfil e organizar</strong>
            <p className="mt-2 text-sm text-muted-foreground">
              Adicione contatos, links, assuntos, convide pessoas ou prepare um
              evento.
            </p>
          </Link>
          <Link
            to="/grupos/$groupId"
            params={{ groupId: String(create.data.id) }}
            className="pomi-focus rounded-md border-2 border-strong-border p-5 hover:border-primary"
          >
            <strong>Ver perfil público</strong>
            <p className="mt-2 text-sm text-muted-foreground">
              Confira como o grupo aparece para visitantes.
            </p>
          </Link>
        </div>
      </PageContainer>
    )
  return (
    <PageContainer>
      <Link
        to="/meus-grupos"
        className="pomi-focus mb-6 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> Meus grupos
      </Link>
      <PageHeader
        eyebrow="Comunidade"
        title="Criar grupo"
        description="Comece pelo essencial. Você poderá completar o perfil e organizar pessoas e eventos depois."
      />
      <form
        className="max-w-2xl space-y-6"
        onSubmit={(event) => {
          event.preventDefault()
          if (name.trim()) create.mutate()
        }}
      >
        <label className="block space-y-2 text-sm font-bold">
          <span>Nome do grupo</span>
          <Input
            value={name}
            maxLength={160}
            required
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label className="block space-y-2 text-sm font-bold">
          <span>
            Descrição{' '}
            <span className="font-normal text-muted-foreground">
              (opcional)
            </span>
          </span>
          <Textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
        <p className="rounded-md border border-border bg-muted p-4 text-sm">
          Ao criar, o grupo ficará imediatamente visível para todos. Você será
          membro e receberá as permissões iniciais de gestão.
        </p>
        {create.isError && (
          <p role="alert" className="text-sm text-destructive">
            Não foi possível criar o grupo. Confira os dados e tente novamente.
          </p>
        )}
        <Button type="submit" disabled={create.isPending || !name.trim()}>
          {create.isPending ? 'Criando…' : 'Criar grupo público'}
        </Button>
      </form>
    </PageContainer>
  )
}
