import type {
  OperationInputs as AppOperationInputs,
  OperationName as AppOperationName,
  OperationOutputs as AppOperationOutputs,
} from './generated/app/operations.js'
import type {
  OperationInputs as DataOperationInputs,
  OperationName as DataOperationName,
  OperationOutputs as DataOperationOutputs,
} from './generated/data/operations.js'
import { runtimeOperationDefinitions as appRuntimeOperationDefinitions } from './generated/app/runtime.js'
import { runtimeOperationDefinitions as dataRuntimeOperationDefinitions } from './generated/data/runtime.js'
import {
  bindOperations as bindAppOperations,
  type OperationApi as GeneratedAppOperationApi,
} from './generated/app/bindings.js'
import {
  bindOperations as bindDataOperations,
  type OperationApi as GeneratedDataOperationApi,
} from './generated/data/bindings.js'
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
  RuntimeOperationDefinition,
  RuntimeOperationTuple,
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

export type DataOperationApi = GeneratedDataOperationApi
export type AppOperationApi = GeneratedAppOperationApi

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

function runtimeOperationDefinition(
  operationId: string,
  target: ApiTarget,
  tuple: RuntimeOperationTuple,
): RuntimeOperationDefinition {
  const [
    method,
    path,
    authentication,
    pathParameters,
    queryParameters,
    requestBody,
    responses,
  ] = tuple
  return {
    operationId,
    target,
    method,
    path,
    authentication,
    pathParameters,
    queryParameters,
    requestBody: requestBody
      ? { required: requestBody[0], contentType: requestBody[1] }
      : null,
    responses: responses.map(([status, contentTypes]) => ({
      status,
      success: true,
      contentTypes,
    })),
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
      runtimeOperationDefinition(
        name,
        'data',
        dataRuntimeOperationDefinitions[name],
      ),
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
      runtimeOperationDefinition(
        name,
        'app',
        appRuntimeOperationDefinitions[name],
      ),
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
        pathParameters: [],
        queryParameters: [],
        requestBody: null,
        responses: [],
      },
      {},
      false,
      context,
    )
  }

  private execute<T>(
    definition: RuntimeOperationDefinition,
    input: Record<string, unknown>,
    context?: PomiRequestContext,
  ) {
    return this.request<T>(definition, input, true, context)
  }

  private async request<T>(
    definition: RuntimeOperationDefinition,
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
    if (!text || documented?.contentTypes.length === 0) return undefined as T
    const actualContentType = responseContentType(response)
    const content =
      documented?.contentTypes.find(
        (contentType) => contentType === actualContentType,
      ) ?? documented?.contentTypes[0]
    return (
      content?.includes('json') || !documented
        ? (JSON.parse(text) as unknown)
        : text
    ) as T
  }
}

export function createPomiSdk(options: PomiSdkOptions): PomiSdkClient {
  const client = new PomiSdk(options)
  const dataOperations = bindDataOperations(
    <Name extends DataOperationName>(
      name: Name,
      input: DataOperationInputs[Name],
      context?: PomiRequestContext,
    ) => client.executeData(name, input, context),
  )
  const appOperations = bindAppOperations(
    <Name extends AppOperationName>(
      name: Name,
      input: AppOperationInputs[Name],
      context?: PomiRequestContext,
    ) => client.executeApp(name, input, context),
  )
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
