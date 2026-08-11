const staleChunkPattern =
  /dynamically imported module|failed to fetch dynamically imported module/i
const reloadKey = 'pomi:stale-chunk-reload'

function reloadForStaleChunk(reason: unknown) {
  if (!staleChunkPattern.test(String(reason))) return false
  const currentLocation = window.location.href
  if (window.sessionStorage.getItem(reloadKey) === currentLocation) return false
  window.sessionStorage.setItem(reloadKey, currentLocation)
  window.location.reload()
  return true
}

export function recoverStaleChunks() {
  window.addEventListener('unhandledrejection', (event) => {
    if (reloadForStaleChunk(event.reason)) event.preventDefault()
  })
  window.addEventListener('error', (event) => {
    reloadForStaleChunk(event.error ?? event.message)
  })
}
