import { useEffect, useState } from 'react'

const desktopLayoutQuery = '(min-width: 640px)'

function matchesDesktopLayout() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia(desktopLayoutQuery).matches
  )
}

export function useDesktopLayout() {
  const [desktop, setDesktop] = useState(matchesDesktopLayout)

  useEffect(() => {
    const media = window.matchMedia(desktopLayoutQuery)
    const update = () => setDesktop(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return desktop
}
