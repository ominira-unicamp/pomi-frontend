import { LockKeyhole, LogIn } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function AuthRequiredState({
  title,
  description,
  onLogin,
}: {
  title: string
  description: string
  onLogin: () => void
}) {
  return (
    <section className="grid min-h-72 place-items-center rounded-lg border-2 border-dashed border-strong-border bg-card px-6 py-12 text-center">
      <div className="max-w-md">
        <span className="mx-auto mb-5 grid size-14 place-items-center rounded-sm bg-primary text-primary-foreground">
          <LockKeyhole className="size-6" />
        </span>
        <h2 className="text-xl font-extrabold">{title}</h2>
        <p className="mt-2 text-muted-foreground">{description}</p>
        <Button className="mt-6" onClick={onLogin}>
          <LogIn /> Entrar
        </Button>
      </div>
    </section>
  )
}
