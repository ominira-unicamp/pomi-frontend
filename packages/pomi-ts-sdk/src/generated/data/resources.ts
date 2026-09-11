import type { PomiRequestContext } from '../../runtime/client.js'
import type { AuthenticationMode } from '../../runtime/operation.js'
import { operationDefinitions as definitions } from './operations.js'
import type { getCoursesInput, getCoursesOutput, listCoursesInput, listCoursesOutput } from './operations.js'
import { operationProblemTypes } from './problems.js'

type OperationFunction<Input, Output> = (input: Input, context?: PomiRequestContext) => Promise<Output>
type Operations = {
    getCourses: OperationFunction<getCoursesInput, getCoursesOutput>
    listCourses: OperationFunction<listCoursesInput, listCoursesOutput>
}
type RequestPath = <T>(target: "data", path: string, authentication?: AuthenticationMode, context?: PomiRequestContext) => Promise<T>

function withMetadata<FunctionType extends (...args: any[]) => unknown, Definition, Problems>(fn: FunctionType, meta: Definition, problemTypes: Problems) {
    return Object.assign(fn, { meta, problemTypes })
}

function withPaginationDefaults<Input extends { page?: number; pageSize?: number }>(input: Input, pageSize: number) {
    return { ...input, page: input.page ?? 1, pageSize: input.pageSize ?? pageSize }
}

function valueAtPath(value: unknown, path: string) {
    return path.split('.').reduce<unknown>((current, key) => typeof current === 'object' && current !== null ? (current as Record<string, unknown>)[key] : undefined, value)
}

async function* paginate<Page>(firstPage: Promise<Page>, target: "data", authentication: AuthenticationMode, nextField: string, requestPath: RequestPath, context?: PomiRequestContext): AsyncIterable<Page> {
    let page = await firstPage
    yield page
    let next = valueAtPath(page, nextField)
    while (typeof next === 'string' && next.length > 0) {
        page = await requestPath<Page>(target, next, authentication, context)
        yield page
        next = valueAtPath(page, nextField)
    }
}


export function bindResources(operations: Operations, requestPath: RequestPath) {

    return {
        "courses": (() => {
            const get = withMetadata((courseId: number, context?: PomiRequestContext) => operations.getCourses({ "id": courseId } as unknown as getCoursesInput, context), definitions.getCourses, operationProblemTypes.getCourses)
            const list = withMetadata((input: Omit<listCoursesInput, never> = {}, context?: PomiRequestContext) => operations.listCourses({ ...input } as unknown as listCoursesInput, context), definitions.listCourses, operationProblemTypes.listCourses)
            const pages = (input: Omit<listCoursesInput, never> = {}, context?: PomiRequestContext) => paginate<listCoursesOutput>(operations.listCourses({ ...withPaginationDefaults(input, 20) } as unknown as listCoursesInput, context), "data", definitions.listCourses.authentication, "_paths.next", requestPath, context)
            const listAll = async (input: Omit<listCoursesInput, never> = {}, context?: PomiRequestContext) => { const items: Array<listCoursesOutput["data"][number]> = []; for await (const page of pages(input, context)) items.push(...page["data"]); return items }
            return { get, list, pages, listAll }
        })(),
    }
}

export type Resources = ReturnType<typeof bindResources>
