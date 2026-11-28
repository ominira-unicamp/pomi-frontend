export function Failure({
  message = 'Não foi possível concluir a operação.',
}: {
  message?: string
}) {
  return (
    <p role="alert" className="text-sm font-semibold text-destructive">
      {message}
    </p>
  )
}
