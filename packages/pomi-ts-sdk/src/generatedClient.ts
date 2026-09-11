import {
  operationDefinitions as appOperationDefinitions,
  type OperationInputs as AppOperationInputs,
  type OperationName as AppOperationName,
  type OperationOutputs as AppOperationOutputs,
} from './generated/app/operations.js'
import {
  operationDefinitions as dataOperationDefinitions,
  type OperationInputs as DataOperationInputs,
  type OperationName as DataOperationName,
  type OperationOutputs as DataOperationOutputs,
} from './generated/data/operations.js'
import { sdkManifest } from './generated/manifest.js'
import {
  ApiError,
  UnexpectedResponseError,
  type ApiProblemDetails,
} from './errors.js'
import type {
  ApiTarget,
  AuthenticationMode,
  GeneratedOperationDefinition,
} from './runtime/operation.js'
import { buildOperationUrl } from './runtime/query.js'

export type PomiFetch = typeof fetch
export type PomiSdkOptions = Readonly<{
  dataApiUrl: string
  appApiUrl: string
  getAccessToken?: () => Promise<string>
  fetch?: PomiFetch
}>

type OperationApi<
  Names extends PropertyKey,
  Inputs extends Record<Names, unknown>,
  Outputs extends Record<Names, unknown>,
> = {
  [Name in Names]: (input: Inputs[Name]) => Promise<Outputs[Name]>
}

export type DataOperationApi = OperationApi<
  DataOperationName,
  DataOperationInputs,
  DataOperationOutputs
>
export type AppOperationApi = OperationApi<
  AppOperationName,
  AppOperationInputs,
  AppOperationOutputs
>

export type PomiSdkClient = Readonly<{
  data: DataOperationApi
  app: AppOperationApi
  metadata: typeof sdkManifest
  requestPath<T>(
    target: ApiTarget,
    path: string,
    authentication?: AuthenticationMode,
  ): Promise<T>
}>

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, '')
}

function responseContentType(response: Response) {
  return response.headers.get('content-type')?.split(';')[0]?.trim() ?? ''
}

function httpBody(text: string) {
  if (!text) return undefined
  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

export class PomiSdk {
  private readonly dataApiUrl: string
  private readonly appApiUrl: string
  private readonly fetcher: PomiFetch
  private readonly getAccessToken?: () => Promise<string>

  constructor(options: PomiSdkOptions) {
    this.dataApiUrl = normalizeBaseUrl(options.dataApiUrl)
    this.appApiUrl = normalizeBaseUrl(options.appApiUrl)
    this.fetcher = options.fetch ?? ((input, init) => fetch(input, init))
    this.getAccessToken = options.getAccessToken
  }

  executeData<Name extends DataOperationName>(
    name: Name,
    input: DataOperationInputs[Name],
  ): Promise<DataOperationOutputs[Name]> {
    return this.execute<DataOperationOutputs[Name]>(
      dataOperationDefinitions[name],
      input as Record<string, unknown>,
    )
  }

  executeApp<Name extends AppOperationName>(
    name: Name,
    input: AppOperationInputs[Name],
  ): Promise<AppOperationOutputs[Name]> {
    return this.execute<AppOperationOutputs[Name]>(
      appOperationDefinitions[name],
      input as Record<string, unknown>,
    )
  }

  requestPath<T>(
    target: ApiTarget,
    path: string,
    authentication: AuthenticationMode = 'public',
  ): Promise<T> {
    return this.request<T>(
      {
        operationId: 'requestPath',
        target,
        method: 'GET',
        path,
        authentication,
        tags: [],
        summary: null,
        description: null,
        deprecated: false,
        pathParameters: [],
        queryParameters: [],
        headerParameters: [],
        cookieParameters: [],
        requestBody: null,
        responses: [],
        query: { parameters: [], filter: null },
      },
      {},
      false,
    )
  }

  private execute<T>(
    definition: GeneratedOperationDefinition,
    input: Record<string, unknown>,
  ) {
    return this.request<T>(definition, input, true)
  }

  private async request<T>(
    definition: GeneratedOperationDefinition,
    input: Record<string, unknown>,
    requireDocumentedSuccess: boolean,
  ): Promise<T> {
    const path = buildOperationUrl(definition, input)
    const url = new URL(
      path,
      definition.target === 'data' ? this.dataApiUrl : this.appApiUrl,
    )
    const headers = new Headers(
      typeof input.headers === 'object' && input.headers !== null
        ? (input.headers as HeadersInit)
        : undefined,
    )
    const init: RequestInit = { method: definition.method, headers }
    if (definition.authentication === 'required') {
      if (!this.getAccessToken) throw new Error('Authentication is required.')
      headers.set('Authorization', `Bearer ${await this.getAccessToken()}`)
    }
    if (definition.requestBody?.required && input.body === undefined) {
      throw new TypeError(
        `Operation ${definition.operationId} requires a request body.`,
      )
    }
    if (definition.requestBody && input.body !== undefined) {
      headers.set('Content-Type', definition.requestBody.contentType)
      init.body =
        definition.requestBody.contentType === 'application/json'
          ? JSON.stringify(input.body)
          : String(input.body)
    }

    const response = await this.fetcher(url, init)
    const text = await response.text()
    if (!response.ok) {
      const body = httpBody(text)
      throw new ApiError(
        response.status,
        typeof body === 'object' && body !== null
          ? (body as ApiProblemDetails)
          : undefined,
        body,
      )
    }

    const documented = definition.responses.find(
      (item) => item.success && item.status === response.status,
    )
    if (requireDocumentedSuccess && !documented) {
      throw new UnexpectedResponseError(definition.operationId, response.status)
    }
    if (!text || documented?.contents.length === 0) return undefined as T
    const actualContentType = responseContentType(response)
    const content =
      documented?.contents.find((item) => item.contentType === actualContentType) ??
      documented?.contents[0]
    return (content?.contentType.includes('json')
      ? (JSON.parse(text) as unknown)
      : text) as T
  }
}

function bindDataOperations(client: PomiSdk) {
  return Object.fromEntries(
    (Object.keys(dataOperationDefinitions) as DataOperationName[]).map((name) => [
      name,
      (input: DataOperationInputs[typeof name]) => client.executeData(name, input),
    ]),
  ) as unknown as DataOperationApi
}

function bindAppOperations(client: PomiSdk) {
  return Object.fromEntries(
    (Object.keys(appOperationDefinitions) as AppOperationName[]).map((name) => [
      name,
      (input: AppOperationInputs[typeof name]) => client.executeApp(name, input),
    ]),
  ) as unknown as AppOperationApi
}

export function createPomiSdk(options: PomiSdkOptions): PomiSdkClient {
  const client = new PomiSdk(options)
  return {
    data: bindDataOperations(client),
    app: bindAppOperations(client),
    metadata: sdkManifest,
    requestPath: (target, path, authentication) =>
      client.requestPath(target, path, authentication),
  }
}
