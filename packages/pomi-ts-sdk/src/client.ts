export type PomiFetch = typeof fetch

export type PomiClientOptions = Readonly<{
  dataApiUrl: string
  appApiUrl: string
  getAccessToken?: () => Promise<string>
  fetch?: PomiFetch
}>

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, '')
}

export class PomiClient {
  private readonly dataApiBaseUrl: string
  private readonly appApiBaseUrl: string
  private readonly fetcher: PomiFetch
  private readonly getAccessToken?: () => Promise<string>

  constructor(options: PomiClientOptions) {
    this.dataApiBaseUrl = normalizeBaseUrl(options.dataApiUrl)
    this.appApiBaseUrl = normalizeBaseUrl(options.appApiUrl)
    this.fetcher = options.fetch ?? ((input, init) => fetch(input, init))
    this.getAccessToken = options.getAccessToken
  }

  dataApiUrlFor(path: string) {
    return new URL(path, this.dataApiBaseUrl).href
  }

  dataApiRequest(path: string, init: RequestInit = {}) {
    return this.fetcher(this.dataApiUrlFor(path), init)
  }

  appApiPublicRequest(path: string, init: RequestInit = {}) {
    return this.fetcher(new URL(path, this.appApiBaseUrl).href, {
      ...init,
      cache: 'no-store',
    })
  }

  async appApiRequest(
    path: string,
    initOrGetAccessToken: RequestInit | (() => Promise<string>) = {},
    authenticatedInit: RequestInit = {},
  ) {
    const getAccessToken =
      typeof initOrGetAccessToken === 'function'
        ? initOrGetAccessToken
        : this.getAccessToken
    const init =
      typeof initOrGetAccessToken === 'function'
        ? authenticatedInit
        : initOrGetAccessToken

    if (!getAccessToken) {
      throw new Error('Authentication is required.')
    }

    const token = await getAccessToken()
    const headers = new Headers(init.headers)
    headers.set('Authorization', `Bearer ${token}`)

    return this.fetcher(new URL(path, this.appApiBaseUrl).href, {
      ...init,
      headers,
      cache: 'no-store',
    })
  }
}

export function createPomiClient(options: PomiClientOptions) {
  return new PomiClient(options)
}
