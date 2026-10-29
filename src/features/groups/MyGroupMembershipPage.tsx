import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { groupApi } from './data/groupApi'
import { canOrganizeEvents, groupWorkspaceDestination } from './groupNavigation'
import { formatEventDate, permissionLabels } from './presentation'
import { GroupAvatar } from '@/features/media/IdentityImages'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { AuthRequiredState } from '@/components/AuthRequiredState'
import {
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { buttonVariants } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useStudentProfile } from '@/features/student/hooks/useStudentProfile'

export function MyGroupMembershipPage({ groupId }: { groupId: number }) {
  const auth = useOptionalAuth()
  const { studentId, studentQuery } = useStudentProfile()
  const queryClient = useQueryClient()
  const memberships = useQuery({
    queryKey: ['private', auth.sessionSubject, 'groups', 'memberships'],
    queryFn: () => groupApi.ownMemberships(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId),
    retry: false,
  })
  const group = useQuery({
    queryKey: ['public', 'groups', groupId],
    queryFn: () => groupApi.get(groupId),
    enabled: groupId > 0,
    retry: false,
  })
  const own =
    memberships.data?.find(
      (item) => item.groupId === groupId && !item.leftAt,
    ) ?? memberships.data?.find((item) => item.groupId === groupId)
  const visibility = useMutation({
    mutationFn: (isPublic: boolean) =>
      groupApi.visibility(studentId!, own!.id, isPublic, auth.getAccessToken),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['private', auth.sessionSubject, 'groups', 'memberships'],
      })
      void queryClient.invalidateQueries({
        queryKey: ['public', 'groups', groupId, 'members'],
      })
      void queryClient.invalidateQueries({
        queryKey: ['public', 'group-memberships'],
      })
    },
  })
  if (!Number.isSafeInteger(groupId) || groupId <= 0)
    return (
      <PageContainer>
        <ErrorState
          title="Grupo inválido"
          description="Confira o endereço e tente novamente."
        />
      </PageContainer>
    )
  if (!auth.initialized || (auth.isAuthenticated && studentQuery.isPending))
    return (
      <PageContainer>
        <LoadingState label="Carregando participação" />
      </PageContainer>
    )
  if (!auth.isAuthenticated)
    return (
      <PageContainer>
        <AuthRequiredState
          title="Entre para ver sua participação"
          description="Seus vínculos são informações da sua conta."
          onLogin={() => void auth.login(window.location.href)}
        />
      </PageContainer>
    )
  if (!studentId)
    return (
      <PageContainer>
        <ErrorState
          title="Perfil necessário"
          description="No momento, participar de grupos exige um perfil de estudante."
        />
      </PageContainer>
    )
  if (memberships.isPending)
    return (
      <PageContainer>
        <LoadingState label="Carregando participação" />
      </PageContainer>
    )
  if (memberships.isError)
    return (
      <PageContainer>
        <ErrorState
          title="Não foi possível carregar sua participação"
          description="Tente novamente."
          action={{
            label: 'Tentar novamente',
            onClick: () => void memberships.refetch(),
          }}
        />
      </PageContainer>
    )
  if (!own)
    return (
      <PageContainer>
        <ErrorState
          title="Você não participa deste grupo"
          description="A participação acontece por convite."
        />
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
        eyebrow="Minha participação"
        title={
          <span className="flex items-center gap-4">
            <GroupAvatar
              mediaId={group.data?.avatarMediaId}
              name={group.data?.name ?? `Grupo #${groupId}`}
              size="large"
            />
            <span className="min-w-0 break-words">
              {group.data?.name ?? `Grupo #${groupId}`}
            </span>
          </span>
        }
        description={
          own.leftAt
            ? 'Seu vínculo com este grupo foi encerrado.'
            : 'Veja suas responsabilidades e escolha como aparecer no perfil público.'
        }
        actions={
          !group.isError && (
            <Link
              to="/grupos/$groupId"
              params={{ groupId: String(groupId) }}
              className={buttonVariants({ variant: 'outline' })}
            >
              Ver perfil público
            </Link>
          )
        }
      />
      <div className="space-y-8">
        <section
          aria-labelledby="visibility-title"
          className="rounded-md border-2 border-strong-border p-5"
        >
          <h2 id="visibility-title" className="text-xl font-extrabold">
            Meu nome no perfil público
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Quando ativado, seu nome e seus cargos aparecem na lista pública de
            membros. A opção começa desativada.
          </p>
          {own.leftAt ? (
            <p className="mt-4 text-sm font-bold">
              Este vínculo foi encerrado e não pode ser publicado.
            </p>
          ) : group.isError ? (
            <p className="mt-4 text-sm font-bold">
              O perfil público do grupo não está disponível. A visibilidade não
              pode ser alterada aqui agora.
            </p>
          ) : (
            <label className="mt-4 flex items-center gap-3 text-sm font-semibold">
              <Checkbox
                checked={own.isPublic}
                disabled={visibility.isPending}
                onCheckedChange={(checked) =>
                  visibility.mutate(checked === true)
                }
              />{' '}
              Mostrar meu nome e cargos
            </label>
          )}
          {visibility.isSuccess && (
            <p role="status" className="mt-3 text-sm">
              Preferência atualizada.
            </p>
          )}
          {visibility.isError && (
            <p role="alert" className="mt-3 text-sm text-destructive">
              Não foi possível atualizar a visibilidade.
            </p>
          )}
        </section>
        <section aria-labelledby="positions-title">
          <h2 id="positions-title" className="mb-3 text-xl font-extrabold">
            Cargos públicos
          </h2>
          {own.positions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum cargo registrado.
            </p>
          ) : (
            <ul className="space-y-2">
              {own.positions.map((position) => (
                <li
                  key={position.id}
                  className="rounded-md border border-border p-3"
                >
                  <strong>{position.title}</strong>
                  {(position.startedAt || position.endedAt) && (
                    <p className="text-sm text-muted-foreground">
                      {position.startedAt
                        ? formatEventDate(position.startedAt)
                        : 'Início não informado'}{' '}
                      até{' '}
                      {position.endedAt
                        ? formatEventDate(position.endedAt)
                        : 'Fim não informado'}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Cargos descrevem sua atuação e não concedem acesso administrativo.
          </p>
        </section>
        <section aria-labelledby="access-title">
          <h2 id="access-title" className="mb-3 text-xl font-extrabold">
            Acessos neste grupo
          </h2>
          <p className="text-sm">
            {own.roles.length > 0
              ? own.roles.map((role) => role.name).join(', ')
              : 'Sem funções de gestão atribuídas.'}
          </p>
          {own.permissions.length > 0 && (
            <ul className="mt-3 list-inside list-disc text-sm text-muted-foreground">
              {own.permissions.map((permission) => (
                <li key={permission}>{permissionLabels[permission]}</li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Os acessos dependem das funções de gestão recebidas neste grupo.
          </p>
        </section>
        {!own.leftAt && own.permissions.length > 0 && !group.isError && (
          <Link
            to={groupWorkspaceDestination(own.permissions)}
            params={{ groupId: String(groupId) }}
            className={buttonVariants()}
          >
            {canOrganizeEvents(own.permissions)
              ? 'Organizar eventos'
              : 'Abrir espaço de trabalho'}
          </Link>
        )}
      </div>
    </PageContainer>
  )
}
