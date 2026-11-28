import { Laptop, Moon, Sun } from 'lucide-react'

import type { Theme } from '@/components/ThemeProvider'
import { useTheme } from '@/components/ThemeProvider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const labels: Record<Theme, string> = {
  light: 'Claro',
  dark: 'Escuro',
  system: 'Sistema',
}

export function ThemeMenu({
  surface = 'sidebar',
}: {
  surface?: 'sidebar' | 'page'
}) {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const Icon = resolvedTheme === 'dark' ? Moon : Sun

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={
            surface === 'page'
              ? 'text-foreground hover:bg-accent hover:text-accent-foreground'
              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          }
          aria-label={`Tema: ${labels[theme]}`}
        >
          <Icon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Tema</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => setTheme(value as Theme)}
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
