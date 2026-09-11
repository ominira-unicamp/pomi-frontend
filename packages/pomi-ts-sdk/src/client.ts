import { expectApiResponse } from './errors'
import {
  buildEndpointPath,
  buildEndpointQuery,
} from './endpoint'
import { translateLegacyQuery } from './legacyQuery'
import type {
  EndpointDefinition,
  EndpointInput,
  EndpointOutput,
  EndpointRequestContext,
} from './endpoint'

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

  async execute<TInput, TOutput>(
    definition: EndpointDefinition<TInput, TOutput>,
    input: TInput,
    context: EndpointRequestContext = {},
  ): Promise<TOutput> {
    const path = buildEndpointPath(definition.path, input)
    const rawQuery = definition.query?.(input)
    const query = rawQuery
      ? buildEndpointQuery(
          translateLegacyQuery(
            definition as EndpointDefinition<unknown, unknown>,
            rawQuery,
          ),
        )
      : ''
    const urlPath = query
      ? `${path}${path.includes('?') ? '&' : '?'}${query}`
      : path
    const init: RequestInit = {}
    if (definition.method !== 'GET') init.method = definition.method
    if (definition.body) {
      init.body = JSON.stringify(definition.body(input))
      init.headers = { 'Content-Type': 'application/json' }
    }

    let response: Response
    if (definition.target === 'data') {
      response = await this.dataApiRequest(urlPath, init)
    } else if (definition.authentication === 'required') {
      response = context.getAccessToken
        ? await this.appApiRequest(urlPath, context.getAccessToken, init)
        : await this.appApiRequest(urlPath, init)
    } else {
      response = await this.appApiPublicRequest(urlPath, init)
    }

    await expectApiResponse(response)
    if (definition.response.kind === 'empty') return undefined as TOutput
    const value: unknown = await response.json()
    return definition.response.decode
      ? definition.response.decode(value)
      : (value as TOutput)
  }

  bind<TDefinitions extends Record<string, EndpointDefinition<any, any>>>(
    definitions: TDefinitions,
  ): {
    [Name in keyof TDefinitions]: (
      input: EndpointInput<TDefinitions[Name]>,
      context?: EndpointRequestContext,
    ) => Promise<EndpointOutput<TDefinitions[Name]>>
  } {
    return Object.fromEntries(
      Object.entries(definitions).map(([name, definition]) => [
        name,
        (input: unknown, context?: EndpointRequestContext) =>
          this.execute<any, any>(definition, input, context),
      ]),
    ) as {
      [Name in keyof TDefinitions]: (
        input: EndpointInput<TDefinitions[Name]>,
        context?: EndpointRequestContext,
      ) => Promise<EndpointOutput<TDefinitions[Name]>>
    }
  }
}

export function createPomiClient(options: PomiClientOptions) {
  return new PomiClient(options)
}
