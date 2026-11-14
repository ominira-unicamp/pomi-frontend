import { ErrorState } from '@/components/PageLayout'

export function UserIdentityState({
  query,
}: {
  query: { isError: boolean; refetch: () => unknown }
}) {
  return (
    <ErrorState
      title={
        query.isError
          ? 'Não foi possível identificar sua conta'
          : 'Conta de usuário necessária'
      }
      description={
        query.isError
          ? 'Tente novamente para acessar suas informações.'
          : 'Esta operação exige uma identidade associada a uma conta de usuário.'
      }
      action={{
        label: 'Tentar novamente',
        onClick: () => {
          void query.refetch()
        },
      }}
    />
  )
}
