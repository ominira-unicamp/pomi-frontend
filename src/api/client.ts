const configuredDataApiUrl = import.meta.env.VITE_DATA_API_URL?.trim()
const configuredAppApiUrl = import.meta.env.VITE_APP_API_URL?.trim()

if (import.meta.env.PROD && (!configuredDataApiUrl || !configuredAppApiUrl)) {
  throw new Error(
    'VITE_DATA_API_URL e VITE_APP_API_URL são obrigatórias em produção.',
  )
}

const dataApiUrl = configuredDataApiUrl || 'http://localhost:3000'
const appApiUrl = configuredAppApiUrl || 'http://localhost:3001'

export function dataApiUrlFor(path: string) {
  return new URL(path, dataApiUrl).href
}

export function dataApiRequest(path: string, init: RequestInit = {}) {
  return fetch(dataApiUrlFor(path), init)
}

export function appApiPublicRequest(path: string, init: RequestInit = {}) {
  return fetch(new URL(path, appApiUrl).href, {
    ...init,
    cache: 'no-store',
  })
}

export async function appApiRequest(
  path: string,
  getAccessToken: () => Promise<string>,
  init: RequestInit = {},
) {
  const token = await getAccessToken()
  const headers = new Headers(init.headers)
  headers.set('Authorization', `Bearer ${token}`)

  return fetch(new URL(path, appApiUrl).href, {
    ...init,
    headers,
    cache: 'no-store',
  })
}
