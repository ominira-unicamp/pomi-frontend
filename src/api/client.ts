const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()

if (import.meta.env.PROD && !configuredApiUrl) {
  throw new Error('VITE_API_URL é obrigatória em produção.')
}

const apiUrl = configuredApiUrl || 'http://localhost:3000'

export function publicApiUrl(path: string) {
  return new URL(path, apiUrl).href
}

export function publicApiRequest(path: string, init: RequestInit = {}) {
  return fetch(publicApiUrl(path), init)
}

export async function apiRequest(
  path: string,
  getAccessToken: () => Promise<string>,
  init: RequestInit = {},
) {
  const token = await getAccessToken()
  const headers = new Headers(init.headers)
  headers.set('Authorization', `Bearer ${token}`)

  return fetch(publicApiUrl(path), {
    ...init,
    headers,
    cache: 'no-store',
  })
}
