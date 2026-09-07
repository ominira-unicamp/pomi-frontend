import { Link, useRouterState } from '@tanstack/react-router'
import {
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileSearch,
  GraduationCap,
  House,
  Info,
  Laptop,
  LockKeyhole,
  LogIn,
  LogOut,
  Menu,
  MessageSquarePlus,
  MessageSquareText,
  Moon,
  MoreHorizontal,
  PanelsTopLeft,
  Sun,
  Tags,
  UserRound,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { useAuth } from '@/auth/AuthProvider'
import { Brand } from '@/components/Brand'
import { SiteFooter } from '@/components/SiteFooter'
import { ThemeMenu } from '@/components/ThemeMenu'
import { useTheme } from '@/components/ThemeProvider'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarProvider,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useFeedbackReport } from '@/features/feedback/FeedbackReportProvider'

function displayName(profile: ReturnType<typeof useAuth>['profile']) {
  return String(
    profile?.name ||
      profile?.preferred_username ||
      profile?.email ||
      'Conta POMI',
  )
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

type NavigationItem = Readonly<{
  label: string
  to:
    | '/'
    | '/planejamentos-de-curriculo'
    | '/planejamentos-de-semestre'
    | '/situacao-do-curso'
    | '/disciplinas'
    | '/perfil'
    | '/pessoas'
    | '/taxonomia'
    | '/editais-de-intercambio'
    | '/minhas-solicitacoes'
  icon: LucideIcon
  matches: ReadonlyArray<string>
  requiresAuth?: boolean
}>

const navigationGroups: ReadonlyArray<
  Readonly<{ label?: string; items: ReadonlyArray<NavigationItem> }>
> = [
  {
    items: [{ label: 'Início', to: '/', icon: House, matches: ['/'] }],
  },
  {
    label: 'Planejamento',
    items: [
      {
        label: 'Currículo',
        to: '/planejamentos-de-curriculo',
        icon: PanelsTopLeft,
        matches: ['/planejamentos-de-curriculo'],
      },
      {
        label: 'Horários',
        to: '/planejamentos-de-semestre',
        icon: CalendarDays,
        matches: ['/planejamentos-de-semestre'],
      },
    ],
  },
  {
    label: 'Vida acadêmica',
    items: [
      {
        label: 'Situação do curso',
        to: '/situacao-do-curso',
        icon: GraduationCap,
        matches: ['/situacao-do-curso'],
        requiresAuth: true,
      },
      {
        label: 'Disciplinas',
        to: '/disciplinas',
        icon: BookOpen,
        matches: ['/disciplinas'],
      },
    ],
  },
  {
    label: 'Comunidade',
    items: [
      {
        label: 'Meu perfil',
        to: '/perfil',
        icon: UserRound,
        matches: ['/perfil'],
        requiresAuth: true,
      },
      {
        label: 'Pessoas',
        to: '/pessoas',
        icon: Users,
        matches: ['/pessoas', '/perfis'],
        requiresAuth: true,
      },
    ],
  },
  {
    label: 'Recursos',
    items: [
      {
        label: 'Taxonomia',
        to: '/taxonomia',
        icon: Tags,
        matches: ['/taxonomia'],
      },
      {
        label: 'Intercâmbio',
        to: '/editais-de-intercambio',
        icon: FileSearch,
        matches: ['/editais-de-intercambio'],
      },
      {
        label: 'Meus feedbacks',
        to: '/minhas-solicitacoes',
        icon: MessageSquareText,
        matches: ['/minhas-solicitacoes'],
        requiresAuth: true,
      },
    ],
  },
]

function matchesNavigationItem(pathname: string, item: NavigationItem) {
  return item.matches.some((path) =>
    path === '/'
      ? pathname === '/'
      : pathname === path || pathname.startsWith(`${path}/`),
  )
}

function Navigation({ compact = false }: { compact?: boolean }) {
  const { setMobileOpen } = useSidebar()
  const { isAuthenticated } = useAuth()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  return (
    <nav aria-label="Navegação principal" className="space-y-3">
      {navigationGroups.map((group, groupIndex) => (
        <section
          key={group.label ?? 'inicio'}
          aria-label={group.label}
          className={cn(
            groupIndex > 0 && 'border-t border-sidebar-border pt-3',
          )}
        >
          {group.label && (
            <p
              className={cn(
                'mb-1 px-3 text-[0.68rem] font-black tracking-[0.16em] text-sidebar-foreground/55 uppercase',
                compact && 'sr-only',
              )}
            >
              {group.label}
            </p>
          )}
          <div className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon
              const active = matchesNavigationItem(pathname, item)
              const locked = Boolean(item.requiresAuth && !isAuthenticated)
              const link = (
                <Link
                  to={item.to}
                  search={item.to === '/disciplinas' ? { page: 1 } : undefined}
                  aria-current={active ? 'page' : undefined}
                  aria-label={
                    compact
                      ? `${item.label}${locked ? ', requer conta' : ''}`
                      : undefined
                  }
                  data-active={active}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'pomi-focus relative flex min-h-11 items-center gap-3 rounded-md border-2 border-transparent px-3 py-2 text-sm font-bold text-sidebar-foreground transition-colors hover:bg-sidebar-accent data-[active=true]:border-primary data-[active=true]:bg-sidebar-accent',
                    compact && 'justify-center px-0',
                  )}
                >
                  <Icon className="size-5 shrink-0" />
                  <span className={cn('min-w-0 flex-1', compact && 'sr-only')}>
                    {item.label}
                  </span>
                  {locked && (
                    <LockKeyhole
                      aria-hidden="true"
                      className={cn(
                        'size-3.5 shrink-0 text-sidebar-foreground/60',
                        compact && 'absolute right-1.5 bottom-1.5 size-3',
                      )}
                    />
                  )}
                </Link>
              )
              return compact ? (
                <Tooltip key={item.to}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">
                    {item.label}
                    {locked && ' · Requer conta'}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <div key={item.to}>{link}</div>
              )
            })}
          </div>
        </section>
      ))}
    </nav>
  )
}

function MobileActionsMenu() {
  const { openFeedback } = useFeedbackReport()
  const { theme, setTheme } = useTheme()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:hidden"
          aria-label="Abrir ações"
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onSelect={() => openFeedback()}>
          <MessageSquarePlus /> Enviar feedback
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {theme === 'dark' ? <Moon /> : <Sun />} Tema
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={theme}
              onValueChange={(value) =>
                setTheme(value as 'light' | 'dark' | 'system')
              }
            >
              <DropdownMenuRadioItem value="light">
                <Sun /> Claro
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">
                <Moon /> Escuro
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">
                <Laptop /> Sistema
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/sobre">
            <Info /> Sobre nós
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AccountMenu() {
  const { initialized, isAuthenticated, profile, login, logout } = useAuth()
  const name = displayName(profile)

  if (!initialized) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        className="text-sidebar-foreground"
        aria-label="Inicializando sessão"
      >
        <UserRound />
      </Button>
    )
  }

  if (!isAuthenticated) {
    return (
      <Button
        variant="ghost"
        className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        onClick={() => void login()}
      >
        <LogIn />
        <span className="hidden sm:inline">Entrar</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-11 gap-3 px-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          aria-label={`Abrir menu de ${name}`}
        >
          <Avatar>
            <AvatarFallback>{initials(name)}</AvatarFallback>
          </Avatar>
          <span className="hidden max-w-40 truncate text-sm sm:inline">
            {name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/perfil">
            <UserRound /> Meu perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => void logout()}>
          <LogOut /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function EmailVerificationDialog() {
  const { emailVerificationRequired, logout } = useAuth()
  return (
    <Dialog open={emailVerificationRequired}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verifique seu e-mail</DialogTitle>
          <DialogDescription>
            Para acessar o POMI, confirme o endereço de e-mail da sua conta.
            Verifique sua caixa de entrada e a pasta de spam, depois entre
            novamente.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => void logout()}>Sair e tentar novamente</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AppHeader() {
  const { collapsed, mobileOpen, setMobileOpen, toggle } = useSidebar()
  const { openFeedback } = useFeedbackReport()
  return (
    <header className="sticky top-0 z-40 flex h-18 shrink-0 items-center border-b-4 border-primary bg-sidebar px-4 text-sidebar-foreground sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="mr-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:hidden"
        aria-label="Abrir menu"
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen(true)}
      >
        <Menu />
      </Button>
      <Brand />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="ml-5 hidden text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:inline-flex"
            aria-label={collapsed ? 'Expandir navegação' : 'Recolher navegação'}
            aria-expanded={!collapsed}
            onClick={toggle}
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {collapsed ? 'Expandir navegação' : 'Recolher navegação'}
        </TooltipContent>
      </Tooltip>
      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="ghost"
          className="hidden text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:inline-flex"
          aria-label="Enviar feedback"
          onClick={() => openFeedback()}
        >
          <MessageSquarePlus className="size-4" />
          <span className="hidden text-sm font-bold sm:inline">Feedback</span>
        </Button>
        <div className="hidden md:block">
          <ThemeMenu />
        </div>
        <MobileActionsMenu />
        <AccountMenu />
      </div>
    </header>
  )
}

function AppSidebar() {
  const { collapsed, mobileOpen, setMobileOpen } = useSidebar()
  return (
    <>
      <Sidebar aria-label="Navegação lateral">
        <SidebarContent>
          <Navigation compact={collapsed} />
        </SidebarContent>
        <SidebarFooter>
          <p
            className={cn(
              'text-xs text-sidebar-foreground/60',
              collapsed && 'sr-only',
            )}
          >
            Feito por Ominira
          </p>
        </SidebarFooter>
      </Sidebar>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent className="w-72" side="left">
          <SheetHeader className="border-b border-sidebar-border pr-12">
            <Brand />
            <SheetTitle className="sr-only">Navegação do POMI</SheetTitle>
            <SheetDescription className="sr-only">
              Acesse as áreas do planejador.
            </SheetDescription>
          </SheetHeader>
          <div className="p-3">
            <Navigation />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />
      <div className="flex min-h-0 flex-1 items-stretch">
        <AppSidebar />
        <div className="min-w-0 flex-1">
          <main
            id="main-content"
            className="min-h-[calc(100svh-4.5rem)] overflow-x-hidden"
          >
            {children}
          </main>
          <SiteFooter />
        </div>
      </div>
      <EmailVerificationDialog />
    </div>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider delayDuration={300}>
      <SidebarProvider>
        <Shell>{children}</Shell>
      </SidebarProvider>
    </TooltipProvider>
  )
}
