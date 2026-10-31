import { useMutation } from '@tanstack/react-query'
import { Navigate, useNavigate } from '@tanstack/react-router'

import { groupApi } from './data/groupApi'
import { ProfileEditor } from './GroupProfileEditor'
import { useGroupManagement } from './GroupManagementLayout'
import { groupWorkspaceDestination } from './groupNavigation'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { ErrorState } from '@/components/PageLayout'
import { Button } from '@/components/ui/button'

const allowed = {
  profile: ['GROUP_EDIT', 'GROUP_TAG_MANAGE'],
  people: ['MEMBER_MANAGE', 'ROLE_MANAGE'],
  access: ['ROLE_MANAGE'],
  events: ['EVENT_CREATE', 'EVENT_EDIT', 'EVENT_PUBLISH'],
} as const

type Section = keyof typeof allowed
function Denied({ section }: { section: Section }) {
  const { own } = useGroupManagement()
  return own.permissions.some((permission) =>
    (allowed[section] as ReadonlyArray<string>).includes(permission),
  ) ? null : (
    <ErrorState
      title="Acesso insuficiente"
      description="Você não tem permissão para esta tarefa neste grupo."
    />
  )
}

export function GroupManagementHome() {
  const { group, own } = useGroupManagement()
  return (
    <Navigate
      to={groupWorkspaceDestination(own.permissions)}
      params={{ groupId: String(group.id) }}
      replace
    />
  )
}

export function GroupProfileManagementPage() {
  const { group, own, studentId, refresh } = useGroupManagement()
  const auth = useOptionalAuth()
  const navigate = useNavigate()
  const archive = useMutation({
    mutationFn: () =>
      groupApi.archive(studentId, group.id, auth.getAccessToken),
    onSuccess: () => {
      refresh()
      void navigate({ to: '/meus-grupos' })
    },
  })
  if (
    !own.permissions.includes('GROUP_EDIT') &&
    !own.permissions.includes('GROUP_TAG_MANAGE')
  )
    return <Denied section="profile" />
  return (
    <section className="space-y-10">
      <div>
        <h2 className="text-2xl font-extrabold">
          Perfil e informações públicas
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          O que você salvar aqui aparece no perfil público do grupo.
        </p>
      </div>
      <ProfileEditor
        group={group}
        studentId={studentId}
        permissions={own.permissions}
        refresh={refresh}
      />
      {own.permissions.includes('GROUP_EDIT') && (
        <section className="border-t border-border pt-8">
          <h3 className="text-lg font-extrabold">Arquivar grupo</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            O grupo, seus membros públicos e eventos deixarão de aparecer nas
            consultas públicas. Não há restauração disponível.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            disabled={archive.isPending}
            onClick={() => {
              if (
                window.confirm(
                  `Arquivar ${group.name}? Esta ação não pode ser desfeita pela interface.`,
                )
              )
                archive.mutate()
            }}
          >
            Arquivar grupo
          </Button>
          {archive.isError && (
            <p role="alert" className="mt-2 text-sm text-destructive">
              Não foi possível arquivar o grupo.
            </p>
          )}
        </section>
      )}
    </section>
  )
}
