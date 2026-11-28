import type { useManagedInvitations } from '@/features/groups/peopleManagementQueries'
import { Failure } from '@/features/groups/EditorFeedback'
import { formatGroupDate } from '@/features/groups/presentation'
import { PersonAvatar } from '@/media/IdentityImages'
import { LoadingState } from '@/components/PageLayout'
import { Button } from '@/components/ui/button'
import { hasPendingInvitation, invitationStatus } from '@/features/groups/peopleManagementQueries'

export function SentInvitations({
  invitations,
}: {
  invitations: ReturnType<typeof useManagedInvitations>
}) {
  const pending = invitations.data?.filter(hasPendingInvitation) ?? []
  const history =
    invitations.data?.filter(
      (invitation) => !hasPendingInvitation(invitation),
    ) ?? []
  return (
    <section className="border-t border-border pt-6">
      <h3 className="mb-3 text-lg font-extrabold">Convites enviados</h3>
      {invitations.isPending ? (
        <LoadingState label="Carregando convites enviados" />
      ) : invitations.isError ? (
        <div className="space-y-2">
          <Failure message="Não foi possível carregar os convites enviados." />
          <Button variant="outline" onClick={() => void invitations.refetch()}>
            Tentar novamente
          </Button>
        </div>
      ) : invitations.data.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum convite enviado.</p>
      ) : (
        <>
          <p className="mb-3 text-sm text-muted-foreground">
            {pending.length}{' '}
            {pending.length === 1 ? 'convite pendente' : 'convites pendentes'}
          </p>
          <ul className="divide-y divide-border rounded-md border border-border">
            {[...pending, ...history].map((invitation) => (
              <li key={invitation.id} className="p-4">
                <p className="flex items-center gap-3 font-bold">
                  <PersonAvatar
                    mediaId={invitation.recipientAvatarMediaId}
                    name={invitation.recipientName}
                    size="small"
                  />
                  {invitation.recipientName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {invitationStatus(invitation)} · Enviado em{' '}
                  {formatGroupDate(invitation.createdAt)}
                  {hasPendingInvitation(invitation) &&
                    ` · Válido até ${formatGroupDate(invitation.expiresAt)}`}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
