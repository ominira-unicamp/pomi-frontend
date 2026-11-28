import { Link } from '@tanstack/react-router'
import { Failure } from '@/features/groups/EditorFeedback'
import { useGroupManagement } from '@/features/groups/GroupManagementLayout'
import { PersonAvatar } from '@/media/IdentityImages'
import { ErrorState, LoadingState } from '@/components/PageLayout'
import { buttonVariants } from '@/components/ui/button'
import { useManagedInvitations, useManagedMembers } from '@/features/groups/peopleManagementQueries'

import { SentInvitations } from '@/features/groups/SentInvitations'

export function GroupPeopleManagementPage() {
  const { group, own } = useGroupManagement()
  const { query, allowed } = useManagedMembers()
  const invitations = useManagedInvitations()
  if (!allowed)
    return (
      <ErrorState
        title="Acesso insuficiente"
        description="Você não tem permissão para consultar os vínculos deste grupo."
      />
    )
  const active = query.data?.filter((member) => !member.leftAt) ?? []
  const history = query.data?.filter((member) => member.leftAt) ?? []
  return (
    <section className="space-y-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold">Pessoas e convites</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Cargos públicos descrevem a atuação. Funções de gestão definem
            acessos.
          </p>
        </div>
        {own.permissions.includes('MEMBER_MANAGE') && (
          <Link
            to="/grupos/$groupId/gerenciar/pessoas/convidar"
            params={{ groupId: String(group.id) }}
            className={buttonVariants()}
          >
            Convidar pessoa
          </Link>
        )}
      </div>
      {own.permissions.includes('MEMBER_MANAGE') && (
        <SentInvitations invitations={invitations} />
      )}
      {query.isPending ? (
        <LoadingState label="Carregando membros" />
      ) : query.isError ? (
        <Failure message="Não foi possível carregar os membros." />
      ) : (
        <>
          <h3 className="text-lg font-extrabold">Participações ativas</h3>
          {active.length ? (
            <ul className="divide-y divide-border rounded-md border border-border">
              {active.map((member) => (
                <li
                  key={member.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-4"
                >
                  <div>
                    <p className="flex items-center gap-3 font-bold">
                      <PersonAvatar
                        mediaId={member.avatarMediaId}
                        name={member.studentName}
                        size="small"
                      />
                      {member.studentName}
                    </p>
                    {member.positions.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {member.positions
                          .map((position) => position.title)
                          .join(' · ')}
                      </p>
                    )}
                  </div>
                  <Link
                    to="/grupos/$groupId/gerenciar/pessoas/$membershipId"
                    params={{
                      groupId: String(group.id),
                      membershipId: String(member.id),
                    }}
                    className={buttonVariants({
                      variant: 'outline',
                      size: 'sm',
                    })}
                  >
                    Ver vínculo
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhuma participação ativa.
            </p>
          )}
          {history.length > 0 && (
            <section className="border-t border-border pt-6">
              <h3 className="mb-3 text-lg font-extrabold">
                Histórico de vínculos
              </h3>
              <ul className="space-y-2">
                {history.map((member) => (
                  <li key={member.id}>
                    <Link
                      to="/grupos/$groupId/gerenciar/pessoas/$membershipId"
                      params={{
                        groupId: String(group.id),
                        membershipId: String(member.id),
                      }}
                      className="pomi-focus text-sm font-bold text-primary hover:underline"
                    >
                      <PersonAvatar
                        mediaId={member.avatarMediaId}
                        name={member.studentName}
                        size="small"
                      />{' '}
                      {member.studentName} · Vínculo encerrado
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </section>
  )
}

export { GroupInvitePage } from './GroupInvitePage'

export { GroupMemberDetailPage } from './GroupMemberDetailPage'
