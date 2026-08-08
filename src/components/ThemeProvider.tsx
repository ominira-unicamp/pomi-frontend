import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = Exclude<Theme, 'system'>

type ThemeContextValue = {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const availableThemes: ReadonlyArray<Theme> = ['light', 'dark', 'system']

function isTheme(value: string | null): value is Theme {
  return value !== null && availableThemes.includes(value as Theme)
}

function systemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'pomi-theme',
}: {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
}) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = window.localStorage.getItem(storageKey)
    return isTheme(stored) ? stored : defaultTheme
  })
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    theme === 'system' ? systemTheme() : theme,
  )

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const applyTheme = () => {
      const resolved = theme === 'system' ? systemTheme() : theme
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(resolved)
      setResolvedTheme(resolved)
    }

    applyTheme()
    if (theme === 'system') media.addEventListener('change', applyTheme)
    return () => media.removeEventListener('change', applyTheme)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme: (nextTheme: Theme) => {
        window.localStorage.setItem(storageKey, nextTheme)
        setThemeState(nextTheme)
      },
    }),
    [resolvedTheme, storageKey, theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider.')
  return context
}
