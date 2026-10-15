import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useBlocker, useNavigate } from '@tanstack/react-router'
import { useRef, useState } from 'react'

import { groupApi } from './data/groupApi'
import { Failure } from './EditorFeedback'
import { useGroupManagement } from './GroupManagementLayout'
import { permissionLabels } from './presentation'
import type { GroupRole } from '@ominira/pomi-sdk/generated/app'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { ErrorState, LoadingState } from '@/components/PageLayout'
import { Button, buttonVariants } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

type Permission = keyof typeof permissionLabels
const accessPath = '/grupos/$groupId/gerenciar/acessos'
const permissionGroups = [
  { title: 'Perfil', keys: ['GROUP_EDIT', 'GROUP_TAG_MANAGE'] },
  { title: 'Pessoas', keys: ['MEMBER_MANAGE'] },
  { title: 'Acessos', keys: ['ROLE_MANAGE'] },
  { title: 'Eventos', keys: ['EVENT_CREATE', 'EVENT_EDIT', 'EVENT_PUBLISH'] },
] as const

function useAccessData() {
  const { group, own, studentId } = useGroupManagement()
  const auth = useOptionalAuth()
  const allowed = own.permissions.includes('ROLE_MANAGE')
  const roles = useQuery({
    queryKey: ['private', auth.sessionSubject, 'groups', group.id, 'roles'],
    queryFn: () => groupApi.roles(studentId, group.id, auth.getAccessToken),
    enabled: allowed,
    retry: false,
  })
  const members = useQuery({
    queryKey: ['private', auth.sessionSubject, 'groups', group.id, 'members'],
    queryFn: () =>
      groupApi.managedMembers(studentId, group.id, auth.getAccessToken),
    enabled: allowed,
    retry: false,
  })
  return { roles, members, allowed }
}

export function GroupAccessManagementPage() {
  const { group } = useGroupManagement()
  const { roles, members, allowed } = useAccessData()
  if (!allowed)
    return (
      <ErrorState
        title="Acesso insuficiente"
        description="Você não pode gerenciar funções deste grupo."
      />
    )
  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold">Acessos e permissões</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Uma pessoa pode acumular funções. As permissões concedidas por elas
            valem somente neste grupo.
          </p>
        </div>
        <Link
          to="/grupos/$groupId/gerenciar/acessos/nova"
          params={{ groupId: String(group.id) }}
          className={buttonVariants()}
        >
          Criar função
        </Link>
      </div>
      <section className="space-y-3">
        <h3 className="text-lg font-extrabold">Funções</h3>
        {roles.isPending ? (
          <LoadingState label="Carregando funções" />
        ) : roles.isError ? (
          <Failure message="Não foi possível carregar as funções." />
        ) : roles.data.length ? (
          <ul className="divide-y divide-border rounded-md border border-border">
            {roles.data.map((role) => (
              <li
                key={role.id}
                className="flex flex-wrap items-center justify-between gap-3 p-4"
              >
                <div>
                  <p className="font-bold">{role.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {role.permissions.length}{' '}
                    {role.permissions.length === 1 ? 'permissão' : 'permissões'}{' '}
                    ·{' '}
                    {members.data?.filter(
                      (member) =>
                        !member.leftAt &&
                        member.roles.some(
                          (assigned) => assigned.id === role.id,
                        ),
                    ).length ?? '—'}{' '}
                    integrantes
                  </p>
                </div>
                <Link
                  to="/grupos/$groupId/gerenciar/acessos/$roleId"
                  params={{
                    groupId: String(group.id),
                    roleId: String(role.id),
                  }}
                  className={buttonVariants({ variant: 'outline', size: 'sm' })}
                >
                  Ver função
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Nenhuma função cadastrada.
          </p>
        )}
      </section>
      <section className="space-y-3 border-t border-border pt-6">
        <h3 className="text-lg font-extrabold">Atribuir funções a pessoas</h3>
        <p className="text-sm text-muted-foreground">
          Escolha uma pessoa para alterar suas funções, sem editar a definição
          de cada função.
        </p>
        {members.isPending ? (
          <LoadingState label="Carregando pessoas" />
        ) : members.isError ? (
          <Failure message="Não foi possível carregar as pessoas." />
        ) : (
          <ul className="divide-y divide-border rounded-md border border-border">
            {members.data
              .filter((member) => !member.leftAt)
              .map((member) => (
                <li
                  key={member.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-4"
                >
                  <div>
                    <p className="font-bold">{member.studentName}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.roles.map((role) => role.name).join(', ') ||
                        'Sem função de gestão'}
                    </p>
                  </div>
                  <Link
                    to="/grupos/$groupId/gerenciar/acessos/atribuicoes/$membershipId"
                    params={{
                      groupId: String(group.id),
                      membershipId: String(member.id),
                    }}
                    className={buttonVariants({
                      variant: 'outline',
                      size: 'sm',
                    })}
                  >
                    Gerenciar funções
                  </Link>
                </li>
              ))}
          </ul>
        )}
      </section>
    </section>
  )
}

function RoleForm({ role }: { role?: GroupRole }) {
  const { group, studentId, refresh } = useGroupManagement()
  const auth = useOptionalAuth()
  const navigate = useNavigate()
  const { members } = useAccessData()
  const [name, setName] = useState(role?.name ?? '')
  const [permissions, setPermissions] = useState<Array<Permission>>(
    role ? (role.permissions as Array<Permission>) : [],
  )
  const [saved, setSaved] = useState(false)
  const savedRef = useRef(false)
  const assigned =
    members.data?.some(
      (member) =>
        !member.leftAt && member.roles.some((item) => item.id === role?.id),
    ) ?? false
  const dirty =
    !saved &&
    (name !== (role?.name ?? '') ||
      permissions.join(',') !== (role?.permissions.join(',') ?? ''))
  useBlocker({
    disabled: !dirty,
    enableBeforeUnload: dirty,
    shouldBlockFn: () =>
      !savedRef.current &&
      !window.confirm('Descartar alterações não salvas da função?'),
  })
  const save = useMutation({
    mutationFn: () =>
      role
        ? groupApi.updateRole(
            studentId,
            role.id,
            {
              name: name.trim(),
              permissions: {
                add: permissions.filter(
                  (item) => !role.permissions.includes(item),
                ),
                remove: role.permissions.filter(
                  (item) => !permissions.includes(item as Permission),
                ) as Array<Permission>,
              },
            },
            auth.getAccessToken,
          )
        : groupApi.createRole(
            studentId,
            group.id,
            { name: name.trim(), permissions },
            auth.getAccessToken,
          ),
    onSuccess: (result) => {
      savedRef.current = true
      setSaved(true)
      refresh()
      void navigate({
        to: '/grupos/$groupId/gerenciar/acessos/$roleId',
        params: { groupId: String(group.id), roleId: String(result.id) },
      })
    },
  })
  const remove = useMutation({
    mutationFn: () =>
      groupApi.deleteRole(studentId, role!.id, auth.getAccessToken),
    onSuccess: () => {
      refresh()
      void navigate({ to: accessPath, params: { groupId: String(group.id) } })
    },
  })
  return (
    <section className="max-w-2xl space-y-6">
      <Link
        to={accessPath}
        params={{ groupId: String(group.id) }}
        className="pomi-focus text-sm font-bold text-primary hover:underline"
      >
        ← Acessos e permissões
      </Link>
      <h2 className="text-2xl font-extrabold">
        {role ? `Função: ${role.name}` : 'Criar função'}
      </h2>
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault()
          save.mutate()
        }}
      >
        <label className="block text-sm font-bold">
          Nome da função
          <Input
            value={name}
            maxLength={80}
            required
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <div className="space-y-5">
          {permissionGroups.map((permissionGroup) => (
            <fieldset
              key={permissionGroup.title}
              className="space-y-2 rounded-md border border-border p-4"
            >
              <legend className="px-1 font-extrabold">
                {permissionGroup.title}
              </legend>
              {permissionGroup.keys.map((key) => (
                <label
                  key={key}
                  className="flex min-h-10 items-center gap-3 text-sm"
                >
                  <Checkbox
                    checked={permissions.includes(key)}
                    onCheckedChange={(checked) =>
                      setPermissions((current) =>
                        checked
                          ? [...current, key]
                          : current.filter((item) => item !== key),
                      )
                    }
                  />
                  <span>{permissionLabels[key]}</span>
                </label>
              ))}
            </fieldset>
          ))}
        </div>
        {save.isError && (
          <Failure message="Não foi possível salvar a função. Confira os dados e preserve ao menos uma pessoa com permissão para gerenciar acessos." />
        )}
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={save.isPending || !name.trim()}>
            Salvar função
          </Button>
          <Link
            to={accessPath}
            params={{ groupId: String(group.id) }}
            className={buttonVariants({ variant: 'outline' })}
          >
            Voltar
          </Link>
        </div>
      </form>
      {role && (
        <section className="border-t border-border pt-6">
          <h3 className="font-extrabold">Excluir função</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Uma função atribuída a alguém precisa ser removida dessa pessoa
            antes da exclusão.
          </p>
          <Button
            className="mt-3"
            variant="outline"
            disabled={
              assigned ||
              members.isPending ||
              members.isError ||
              remove.isPending
            }
            onClick={() => {
              if (window.confirm(`Excluir a função ${role.name}?`))
                remove.mutate()
            }}
          >
            Excluir função
          </Button>
          {assigned && (
            <p className="mt-2 text-sm text-muted-foreground">
              Esta função está atribuída a integrantes.
            </p>
          )}
          {remove.isError && (
            <Failure message="Não foi possível excluir a função. Confira se não há atribuições ativas." />
          )}
        </section>
      )}
    </section>
  )
}

export function GroupRoleCreatePage() {
  const { allowed } = useAccessData()
  return allowed ? (
    <RoleForm />
  ) : (
    <ErrorState
      title="Acesso insuficiente"
      description="Você não pode criar funções."
    />
  )
}
export function GroupRoleDetailPage({ roleId }: { roleId: number }) {
  const { roles, allowed } = useAccessData()
  if (!allowed)
    return (
      <ErrorState
        title="Acesso insuficiente"
        description="Você não pode consultar funções."
      />
    )
  if (roles.isPending) return <LoadingState label="Carregando função" />
  if (roles.isError)
    return <Failure message="Não foi possível carregar a função." />
  const role = roles.data.find((item) => item.id === roleId)
  return role ? (
    <RoleForm key={role.id} role={role} />
  ) : (
    <ErrorState
      title="Função indisponível"
      description="Confira o endereço e tente novamente."
    />
  )
}

export function GroupRoleAssignmentPage({
  membershipId,
}: {
  membershipId: number
}) {
  const { group, studentId, refresh } = useGroupManagement()
  const auth = useOptionalAuth()
  const { roles, members, allowed } = useAccessData()
  const member = members.data?.find(
    (item) => item.id === membershipId && !item.leftAt,
  )
  const update = useMutation({
    mutationFn: ({ id, assigned }: { id: number; assigned: boolean }) =>
      groupApi.updateMember(
        studentId,
        membershipId,
        { roles: assigned ? { remove: [id] } : { add: [id] } },
        auth.getAccessToken,
      ),
    onSuccess: refresh,
  })
  if (!allowed)
    return (
      <ErrorState
        title="Acesso insuficiente"
        description="Você não pode atribuir funções."
      />
    )
  if (roles.isPending || members.isPending)
    return <LoadingState label="Carregando atribuições" />
  if (roles.isError || members.isError || !member)
    return (
      <ErrorState
        title="Pessoa indisponível"
        description="Confira o endereço ou sua permissão."
      />
    )
  return (
    <section className="max-w-2xl space-y-5">
      <Link
        to={accessPath}
        params={{ groupId: String(group.id) }}
        className="pomi-focus text-sm font-bold text-primary hover:underline"
      >
        ← Acessos e permissões
      </Link>
      <h2 className="text-2xl font-extrabold">
        Funções de {member.studentName}
      </h2>
      <p className="text-sm text-muted-foreground">
        Uma pessoa pode ter várias funções. Cargos públicos são administrados no
        vínculo.
      </p>
      <ul className="divide-y divide-border rounded-md border border-border">
        {roles.data.map((role) => {
          const assigned = member.roles.some((item) => item.id === role.id)
          return (
            <li
              key={role.id}
              className="flex flex-wrap items-center justify-between gap-2 p-4"
            >
              <div>
                <p className="font-bold">{role.name}</p>
                <p className="text-sm text-muted-foreground">
                  {role.permissions.length}{' '}
                  {role.permissions.length === 1 ? 'permissão' : 'permissões'}
                </p>
              </div>
              <Button
                size="sm"
                variant={assigned ? 'outline' : 'default'}
                disabled={update.isPending}
                onClick={() => {
                  if (
                    assigned &&
                    !window.confirm(
                      `Retirar ${role.name} de ${member.studentName}?`,
                    )
                  )
                    return
                  update.mutate({ id: role.id, assigned })
                }}
              >
                {assigned ? 'Remover função' : 'Atribuir função'}
              </Button>
            </li>
          )
        })}
      </ul>
      {update.isSuccess && <p role="status">Funções atualizadas.</p>}
      {update.isError && (
        <Failure message="Não foi possível alterar as funções. A última pessoa capaz de gerenciar acessos precisa manter essa capacidade." />
      )}
    </section>
  )
}
