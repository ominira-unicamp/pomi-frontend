import { Link } from '@tanstack/react-router'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  House,
  Info,
  LogIn,
  LogOut,
  Menu,
  PanelsTopLeft,
  UserRound,
} from 'lucide-react'
import type { ReactNode } from 'react'

import { useAuth } from '@/auth/AuthProvider'
import { Brand } from '@/components/Brand'
import { SiteFooter } from '@/components/SiteFooter'
import { ThemeMenu } from '@/components/ThemeMenu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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

function Navigation({ compact = false }: { compact?: boolean }) {
  const { setMobileOpen } = useSidebar()
  return (
    <nav aria-label="Navegação principal">
      <Link
        to="/"
        onClick={() => setMobileOpen(false)}
        activeProps={{ 'aria-current': 'page' }}
        className={cn(
          'pomi-focus flex min-h-11 items-center gap-3 rounded-md border-2 border-transparent px-3 py-2 text-sm font-bold text-sidebar-foreground transition-colors hover:bg-sidebar-accent aria-[current=page]:border-primary aria-[current=page]:bg-sidebar-accent',
          compact && 'justify-center px-0',
        )}
      >
        <House className="size-5 shrink-0" />
        <span className={cn(compact && 'sr-only')}>Início</span>
      </Link>
      <Link
        to="/planejamentos-de-curriculo"
        onClick={() => setMobileOpen(false)}
        activeProps={{ 'aria-current': 'page' }}
        className={cn(
          'pomi-focus flex min-h-11 items-center gap-3 rounded-md border-2 border-transparent px-3 py-2 text-sm font-bold text-sidebar-foreground transition-colors hover:bg-sidebar-accent aria-[current=page]:border-primary aria-[current=page]:bg-sidebar-accent',
          compact && 'justify-center px-0',
        )}
      >
        <PanelsTopLeft className="size-5 shrink-0" />
        <span className={cn(compact && 'sr-only')}>Currículo</span>
      </Link>
      <Link
        to="/planejamentos-de-semestre"
        onClick={() => setMobileOpen(false)}
        activeProps={{ 'aria-current': 'page' }}
        className={cn(
          'pomi-focus flex min-h-11 items-center gap-3 rounded-md border-2 border-transparent px-3 py-2 text-sm font-bold text-sidebar-foreground transition-colors hover:bg-sidebar-accent aria-[current=page]:border-primary aria-[current=page]:bg-sidebar-accent',
          compact && 'justify-center px-0',
        )}
      >
        <CalendarDays className="size-5 shrink-0" />
        <span className={cn(compact && 'sr-only')}>Horários</span>
      </Link>
      <Link
        to="/situacao-do-curso"
        onClick={() => setMobileOpen(false)}
        activeProps={{ 'aria-current': 'page' }}
        className={cn(
          'pomi-focus flex min-h-11 items-center gap-3 rounded-md border-2 border-transparent px-3 py-2 text-sm font-bold text-sidebar-foreground transition-colors hover:bg-sidebar-accent aria-[current=page]:border-primary aria-[current=page]:bg-sidebar-accent',
          compact && 'justify-center px-0',
        )}
      >
        <GraduationCap className="size-5 shrink-0" />
        <span className={cn(compact && 'sr-only')}>Situação do curso</span>
      </Link>
    </nav>
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
        <Link
          to="/sobre"
          aria-label="Sobre nós"
          className="pomi-focus inline-flex size-10 items-center justify-center rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground sm:w-auto sm:gap-2 sm:px-3"
        >
          <Info className="size-4" />
          <span className="hidden text-sm font-bold sm:inline">Sobre nós</span>
        </Link>
        <ThemeMenu />
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
