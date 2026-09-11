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
import {
  bindResources as bindAppResources,
  type Resources as AppResources,
} from './generated/app/resources.js'
import {
  bindResources as bindDataResources,
  type Resources as DataResources,
} from './generated/data/resources.js'
import { sdkManifest } from './generated/manifest.js'
import {
  ApiError,
  isProblemType,
  UnexpectedResponseError,
  type ApiProblemDetails,
} from './errors.js'
import type { ProblemType as AppProblemType } from './generated/app/problems.js'
import type { ProblemType as DataProblemType } from './generated/data/problems.js'
import type {
  ApiTarget,
  AuthenticationMode,
  GeneratedOperationDefinition,
} from './runtime/operation.js'
import type { PomiRequestContext } from './runtime/client.js'
import { buildOperationUrl } from './runtime/query.js'

export type PomiFetch = typeof fetch
export type { PomiRequestContext } from './runtime/client.js'
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
  [Name in Names]: (
    input: Inputs[Name],
    context?: PomiRequestContext,
  ) => Promise<Outputs[Name]>
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
  data: DataOperationApi & DataResources
  app: AppOperationApi & AppResources
  metadata: typeof sdkManifest
  errors: Readonly<{
    is<TProblemType extends AppProblemType | DataProblemType>(
      value: unknown,
      type: TProblemType,
    ): value is ApiError & {
      problem: ApiProblemDetails & { type: TProblemType }
    }
  }>
  requestPath<T>(
    target: ApiTarget,
    path: string,
    authentication?: AuthenticationMode,
    context?: PomiRequestContext,
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
    context?: PomiRequestContext,
  ): Promise<DataOperationOutputs[Name]> {
    return this.execute<DataOperationOutputs[Name]>(
      dataOperationDefinitions[name],
      input as Record<string, unknown>,
      context,
    )
  }

  executeApp<Name extends AppOperationName>(
    name: Name,
    input: AppOperationInputs[Name],
    context?: PomiRequestContext,
  ): Promise<AppOperationOutputs[Name]> {
    return this.execute<AppOperationOutputs[Name]>(
      appOperationDefinitions[name],
      input as Record<string, unknown>,
      context,
    )
  }

  requestPath<T>(
    target: ApiTarget,
    path: string,
    authentication: AuthenticationMode = 'public',
    context?: PomiRequestContext,
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
        sdk: null,
        pagination: null,
      },
      {},
      false,
      context,
    )
  }

  private execute<T>(
    definition: GeneratedOperationDefinition,
    input: Record<string, unknown>,
    context?: PomiRequestContext,
  ) {
    return this.request<T>(definition, input, true, context)
  }

  private async request<T>(
    definition: GeneratedOperationDefinition,
    input: Record<string, unknown>,
    requireDocumentedSuccess: boolean,
    context?: PomiRequestContext,
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
    const init: RequestInit =
      definition.target === 'app' ? { cache: 'no-store' } : {}
    if (definition.method !== 'GET') init.method = definition.method
    if (definition.authentication === 'required') {
      const getAccessToken = context?.getAccessToken ?? this.getAccessToken
      if (!getAccessToken) throw new Error('Authentication is required.')
      headers.set('Authorization', `Bearer ${await getAccessToken()}`)
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
    if ([...headers].length > 0) init.headers = headers

    const response = await this.fetcher(url.href, init)
    const text = await response.clone().text()
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
    if (
      requireDocumentedSuccess &&
      !documented &&
      !context?.allowUndocumentedSuccess
    ) {
      throw new UnexpectedResponseError(definition.operationId, response.status)
    }
    if (!text || documented?.contents.length === 0) return undefined as T
    const actualContentType = responseContentType(response)
    const content =
      documented?.contents.find(
        (item) => item.contentType === actualContentType,
      ) ?? documented?.contents[0]
    return (
      content?.contentType.includes('json') || !documented
        ? (JSON.parse(text) as unknown)
        : text
    ) as T
  }
}

function bindDataOperations(client: PomiSdk) {
  return Object.fromEntries(
    (Object.keys(dataOperationDefinitions) as DataOperationName[]).map(
      (name) => [
        name,
        (
          input: DataOperationInputs[typeof name],
          context?: PomiRequestContext,
        ) => client.executeData(name, input, context),
      ],
    ),
  ) as unknown as DataOperationApi
}

function bindAppOperations(client: PomiSdk) {
  return Object.fromEntries(
    (Object.keys(appOperationDefinitions) as AppOperationName[]).map((name) => [
      name,
      (input: AppOperationInputs[typeof name], context?: PomiRequestContext) =>
        client.executeApp(name, input, context),
    ]),
  ) as unknown as AppOperationApi
}

export function createPomiSdk(options: PomiSdkOptions): PomiSdkClient {
  const client = new PomiSdk(options)
  const dataOperations = bindDataOperations(client)
  const appOperations = bindAppOperations(client)
  const requestPath: PomiSdkClient['requestPath'] = (
    target,
    path,
    authentication,
    context,
  ) => client.requestPath(target, path, authentication, context)
  return {
    data: {
      ...dataOperations,
      ...bindDataResources(dataOperations, requestPath),
    },
    app: {
      ...appOperations,
      ...bindAppResources(appOperations, requestPath),
    },
    metadata: sdkManifest,
    errors: { is: isProblemType },
    requestPath,
  }
}
