import { createFileRoute, notFound } from '@tanstack/react-router'
import { AlertCircle, CheckCircle2, Palette } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'

import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { useTheme } from '@/components/ThemeProvider'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import { ActionBar } from '@/components/patterns/ActionBar'
import { Badge } from '@/components/patterns/Badge'
import { DataList, DataRow } from '@/components/patterns/DataList'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/patterns/Field'
import { FilterPanel } from '@/components/patterns/FilterPanel'
import { InlineMessage } from '@/components/patterns/InlineMessage'
import { SearchableMultiSelect } from '@/components/patterns/SearchableMultiSelect'
import {
  Section as PatternSection,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from '@/components/patterns/Section'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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

export function DesignSystemPage() {
  const { theme, setTheme } = useTheme()
  const [required, setRequired] = useState(true)
  const [period, setPeriod] = useState('')
  const [course, setCourse] = useState('')
  const [places, setPlaces] = useState<ReadonlyArray<number>>([])
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
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="catalog-textarea">Observação</FieldLabel>
            <FieldDescription id="catalog-textarea-description">
              Contexto opcional para o planejamento.
            </FieldDescription>
            <Textarea
              id="catalog-textarea"
              aria-describedby="catalog-textarea-description"
              placeholder="Escreva uma observação"
            />
          </Field>
          <Field>
            <FieldLabel id="catalog-period-label">Período</FieldLabel>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger aria-labelledby="catalog-period-label">
                <SelectValue placeholder="Escolha o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026s1">2026s1</SelectItem>
                <SelectItem value="2026s2">2026s2</SelectItem>
              </SelectContent>
            </Select>
            <FieldError>Exemplo de mensagem de validação.</FieldError>
          </Field>
          <Field>
            <FieldLabel id="catalog-course-label">Disciplina</FieldLabel>
            <AutocompleteSelect
              ariaLabel="Disciplina"
              value={course}
              onValueChange={setCourse}
              options={[
                { value: 'mc102', label: 'MC102 — Algoritmos' },
                { value: 'ma111', label: 'MA111 — Cálculo I' },
              ]}
              placeholder="Busque por código ou nome"
            />
          </Field>
          <label className="flex items-center gap-3 text-sm font-bold">
            <Checkbox
              checked={required}
              onCheckedChange={(value) => setRequired(value === true)}
            />
            Disciplina obrigatória
          </label>
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
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <InlineMessage>Informação disponível durante a edição.</InlineMessage>
          <InlineMessage variant="success">Planejamento salvo.</InlineMessage>
          <InlineMessage variant="warning">
            Há pré-requisitos pendentes.
          </InlineMessage>
          <InlineMessage variant="error">
            Não foi possível concluir a ação.
          </InlineMessage>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge>Padrão</Badge>
          <Badge variant="secondary">Secundária</Badge>
          <Badge variant="success">Aprovada</Badge>
          <Badge variant="warning">Cursando</Badge>
          <Badge variant="destructive">Reprovada</Badge>
          <Badge variant="outline">Contorno</Badge>
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">Card padrão</CardContent>
          </Card>
          <Card variant="highlighted">
            <CardContent className="p-4">Destacado</CardContent>
          </Card>
          <Card variant="flat">
            <CardContent className="p-4">Plano</CardContent>
          </Card>
          <Card variant="interactive" tabIndex={0}>
            <CardContent className="p-4">Interativo</CardContent>
          </Card>
        </div>
      </Section>

      <Separator className="h-0.5 bg-strong-border" />

      <Section title="Composições">
        <div className="grid items-start gap-6 lg:grid-cols-2">
          <PatternSection variant="bordered">
            <SectionHeader>
              <div>
                <SectionTitle>Histórico acadêmico</SectionTitle>
                <SectionDescription>
                  Disciplinas agrupadas por período.
                </SectionDescription>
              </div>
              <Badge variant="success">24 créditos</Badge>
            </SectionHeader>
            <SectionContent>
              <DataList>
                <DataRow>
                  <strong>MC102 — Algoritmos</strong>
                  <Badge variant="success">Aprovada</Badge>
                </DataRow>
                <DataRow>
                  <strong>MA111 — Cálculo I</strong>
                  <Badge variant="warning">Cursando</Badge>
                </DataRow>
              </DataList>
              <ActionBar className="mt-4">
                <Button variant="outline">Editar</Button>
                <Button>Adicionar</Button>
              </ActionBar>
            </SectionContent>
          </PatternSection>
          <FilterPanel
            actions={
              <Button size="sm" variant="ghost">
                Limpar
              </Button>
            }
          >
            <Field>
              <FieldLabel htmlFor="filter-code">Código</FieldLabel>
              <Input id="filter-code" placeholder="MC102" />
            </Field>
            <Field>
              <FieldLabel id="filter-status-label">Situação</FieldLabel>
              <Select>
                <SelectTrigger aria-labelledby="filter-status-label">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Aprovada</SelectItem>
                  <SelectItem value="enrolled">Cursando</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Locais</FieldLabel>
              <SearchableMultiSelect
                label="Locais"
                selected={places}
                onChange={setPlaces}
                options={[
                  { value: 1, label: 'Alemanha' },
                  { value: 2, label: 'Argentina' },
                  { value: 3, label: 'Canadá' },
                  { value: 4, label: 'França' },
                ]}
              />
            </Field>
          </FilterPanel>
        </div>
      </Section>

      <Separator className="h-0.5 bg-strong-border" />

      <Section title="Sobreposições e navegação">
        <div className="flex flex-wrap gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Abrir dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar disciplina</DialogTitle>
                <DialogDescription>
                  Atualize os dados da tentativa.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button>Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Abrir sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Detalhes da disciplina</SheetTitle>
                <SheetDescription>Informações complementares.</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Abrir menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Editar</DropdownMenuItem>
              <DropdownMenuItem>Duplicar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost">Passe o mouse</Button>
              </TooltipTrigger>
              <TooltipContent>Informação contextual</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Tabs defaultValue="current" className="mt-6">
          <TabsList>
            <TabsTrigger value="current">Cursando</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>
          <TabsContent value="current">
            <InlineMessage>Conteúdo do período atual.</InlineMessage>
          </TabsContent>
          <TabsContent value="history">
            <InlineMessage>Conteúdo do histórico.</InlineMessage>
          </TabsContent>
        </Tabs>
      </Section>

      <Separator className="h-0.5 bg-strong-border" />

      <Section title="Temas e larguras">
        <div className="grid gap-5 lg:grid-cols-2">
          {(['light', 'dark'] as const).map((previewTheme) => (
            <div key={previewTheme} className={previewTheme}>
              <div className="rounded-lg border-2 border-strong-border bg-background p-5 text-foreground">
                <p className="mb-4 font-extrabold">
                  Tema {previewTheme === 'light' ? 'claro' : 'escuro'}
                </p>
                <Card variant="flat">
                  <CardContent className="p-4">
                    <Badge>MC102</Badge>
                    <p className="mt-3 text-sm text-muted-foreground">
                      Exemplo responsivo do POMI.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 max-w-sm rounded-lg border border-dashed border-border p-4">
          <p className="mb-3 text-xs font-black uppercase text-muted-foreground">
            Viewport estreita
          </p>
          <ActionBar align="start">
            <Button className="w-full">Ação principal</Button>
            <Button className="w-full" variant="outline">
              Secundária
            </Button>
          </ActionBar>
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
