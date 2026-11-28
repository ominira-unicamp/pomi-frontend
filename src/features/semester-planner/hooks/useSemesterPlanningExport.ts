import { useEffect, useRef, useState } from 'react'
import type { ResolvedTheme } from '@/components/ThemeProvider'

export function useSemesterPlanningExport(initialTheme: ResolvedTheme) {
  const [{ theme, attempt }, setRequest] = useState({
    theme: initialTheme,
    attempt: 0,
  })
  const captureRef = useRef<HTMLDivElement>(null)
  const [result, setResult] = useState<{
    url?: string
    error?: string
    theme: ResolvedTheme
    attempt: number
  }>()
  useEffect(() => {
    const controller = new AbortController()
    const isCancelled = () => controller.signal.aborted
    let objectUrl: string | undefined
    async function generate() {
      try {
        const { toBlob } = await import('html-to-image')
        await document.fonts.ready
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => resolve()),
        )
        if (isCancelled() || !captureRef.current) return
        const blob = await toBlob(captureRef.current, {
          pixelRatio: 2,
          width: 1200,
        })
        if (isCancelled()) return
        if (!blob) throw new Error('Empty image')
        objectUrl = URL.createObjectURL(blob)
        setResult({ url: objectUrl, theme, attempt })
      } catch {
        if (!isCancelled())
          setResult({
            error: 'Não foi possível gerar o PNG. Tente novamente.',
            theme,
            attempt,
          })
      }
    }
    void generate()
    return () => {
      controller.abort()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [theme, attempt])
  const current =
    result?.theme === theme && result.attempt === attempt ? result : undefined
  return {
    captureRef,
    url: current?.url,
    error: current?.error,
    isGenerating: !current,
    theme,
    setTheme: (nextTheme: ResolvedTheme) =>
      setRequest((value) => ({ theme: nextTheme, attempt: value.attempt + 1 })),
    retry: () =>
      setRequest((value) => ({ ...value, attempt: value.attempt + 1 })),
  }
}
