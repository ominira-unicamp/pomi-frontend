import { createFileRoute, notFound } from '@tanstack/react-router'
import { AlertCircle, CheckCircle2, Palette } from 'lucide-react'
import type { ReactNode } from 'react'

import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { useTheme } from '@/components/ThemeProvider'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/_design-system')({
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound()
  },
  component: DesignSystemPage,
})

const colors = [
  ['Primária', 'bg-primary text-primary-foreground'],
  ['Fundo', 'bg-background text-foreground'],
  ['Superfície', 'bg-card text-card-foreground'],
  ['Secundária', 'bg-secondary text-secondary-foreground'],
  ['Muted', 'bg-muted text-muted-foreground'],
] as const

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="py-7">
      <h2 className="mb-5 text-xl font-extrabold">{title}</h2>
      {children}
    </section>
  )
}

function DesignSystemPage() {
  const { theme, setTheme } = useTheme()
  return (
    <PageContainer size="wide">
      <PageHeader
        eyebrow="Ambiente de desenvolvimento"
        title="Design system POMI"
        description="Tokens, componentes e estados disponíveis para compor as páginas do planejador."
      />

      <Section title="Temas e cores">
        <div className="mb-5 flex flex-wrap gap-2" aria-label="Selecionar tema">
          {(['light', 'dark', 'system'] as const).map((item) => (
            <Button
              key={item}
              variant={theme === item ? 'default' : 'outline'}
              onClick={() => setTheme(item)}
            >
              {item === 'light'
                ? 'Claro'
                : item === 'dark'
                  ? 'Escuro'
                  : 'Sistema'}
            </Button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {colors.map(([label, className]) => (
            <div
              key={label}
              className={`rounded-md border-2 border-strong-border p-5 ${className}`}
            >
              <Palette className="mb-6 size-5" />
              <strong>{label}</strong>
            </div>
          ))}
        </div>
      </Section>

      <Separator className="h-0.5 bg-strong-border" />

      <Section title="Ações e campos">
        <div className="flex flex-wrap gap-3">
          <Button>Primária</Button>
          <Button variant="secondary">Secundária</Button>
          <Button variant="outline">Contorno</Button>
          <Button variant="ghost">Discreta</Button>
          <Button variant="destructive">Destrutiva</Button>
          <Button disabled>Desabilitada</Button>
        </div>
        <div className="mt-6 max-w-md space-y-2">
          <label htmlFor="catalog-input" className="text-sm font-bold">
            Disciplina
          </label>
          <Input id="catalog-input" placeholder="Buscar por código ou nome" />
        </div>
      </Section>

      <Separator className="h-0.5 bg-strong-border" />

      <Section title="Mensagens e superfícies">
        <div className="grid gap-5 lg:grid-cols-2">
          <Alert>
            <CheckCircle2 />
            <AlertTitle>Planejamento salvo</AlertTitle>
            <AlertDescription>
              As alterações estão disponíveis nesta sessão.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Não foi possível carregar</AlertTitle>
            <AlertDescription>
              Tente novamente antes de continuar.
            </AlertDescription>
          </Alert>
          <Card>
            <CardHeader>
              <CardTitle>Período 1</CardTitle>
              <CardDescription>
                Composição de superfície para conteúdo relacionado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="mt-3 h-5 w-1/2" />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Separator className="h-0.5 bg-strong-border" />

      <Section title="Estados de página">
        <div className="grid gap-6 xl:grid-cols-3">
          <EmptyState
            title="Sem itens"
            description="Adicione um item para começar."
          />
          <ErrorState
            title="Falha ao carregar"
            description="Não foi possível obter os dados."
          />
          <div className="rounded-lg border-2 border-strong-border bg-card">
            <LoadingState />
          </div>
        </div>
      </Section>
    </PageContainer>
  )
}
