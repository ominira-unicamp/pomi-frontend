import type { PomiRequestContext } from '../../runtime/client.js'
import type { AuthenticationMode } from '../../runtime/operation.js'
import { operationDefinitions as definitions } from './operations.js'
import type { createStudentCourseAttemptsInput, createStudentCourseAttemptsOutput, createStudentPeriodPlanningsInput, createStudentPeriodPlanningsOutput, deleteStudentCourseAttemptsInput, deleteStudentCourseAttemptsOutput, deleteStudentPeriodPlanningsInput, deleteStudentPeriodPlanningsOutput, getStudentCourseAttemptsInput, getStudentCourseAttemptsOutput, getStudentPeriodPlanningsInput, getStudentPeriodPlanningsOutput, listStudentCourseAttemptsInput, listStudentCourseAttemptsOutput, listStudentPeriodPlanningsInput, listStudentPeriodPlanningsOutput, updateStudentCourseAttemptsInput, updateStudentCourseAttemptsOutput, updateStudentPeriodPlanningsInput, updateStudentPeriodPlanningsOutput } from './operations.js'
import { operationProblemTypes } from './problems.js'

type OperationFunction<Input, Output> = (input: Input, context?: PomiRequestContext) => Promise<Output>
type Operations = {
    createStudentCourseAttempts: OperationFunction<createStudentCourseAttemptsInput, createStudentCourseAttemptsOutput>
    createStudentPeriodPlannings: OperationFunction<createStudentPeriodPlanningsInput, createStudentPeriodPlanningsOutput>
    deleteStudentCourseAttempts: OperationFunction<deleteStudentCourseAttemptsInput, deleteStudentCourseAttemptsOutput>
    deleteStudentPeriodPlannings: OperationFunction<deleteStudentPeriodPlanningsInput, deleteStudentPeriodPlanningsOutput>
    getStudentCourseAttempts: OperationFunction<getStudentCourseAttemptsInput, getStudentCourseAttemptsOutput>
    getStudentPeriodPlannings: OperationFunction<getStudentPeriodPlanningsInput, getStudentPeriodPlanningsOutput>
    listStudentCourseAttempts: OperationFunction<listStudentCourseAttemptsInput, listStudentCourseAttemptsOutput>
    listStudentPeriodPlannings: OperationFunction<listStudentPeriodPlanningsInput, listStudentPeriodPlanningsOutput>
    updateStudentCourseAttempts: OperationFunction<updateStudentCourseAttemptsInput, updateStudentCourseAttemptsOutput>
    updateStudentPeriodPlannings: OperationFunction<updateStudentPeriodPlanningsInput, updateStudentPeriodPlanningsOutput>
}
type RequestPath = <T>(target: "app", path: string, authentication?: AuthenticationMode, context?: PomiRequestContext) => Promise<T>

function withMetadata<FunctionType extends (...args: any[]) => unknown, Definition, Problems>(fn: FunctionType, meta: Definition, problemTypes: Problems) {
    return Object.assign(fn, { meta, problemTypes })
}



export function bindResources(operations: Operations, requestPath: RequestPath) {
    void requestPath
    return {
        "courseAttempts": (() => {
            const create = withMetadata((studentId: number, body: createStudentCourseAttemptsInput['body'], context?: PomiRequestContext) => operations.createStudentCourseAttempts({ "sid": studentId, body } as unknown as createStudentCourseAttemptsInput, context), definitions.createStudentCourseAttempts, operationProblemTypes.createStudentCourseAttempts)
            const deleteOperation = withMetadata((studentId: number, courseAttemptId: number, context?: PomiRequestContext) => operations.deleteStudentCourseAttempts({ "sid": studentId, "id": courseAttemptId } as unknown as deleteStudentCourseAttemptsInput, context), definitions.deleteStudentCourseAttempts, operationProblemTypes.deleteStudentCourseAttempts)
            const get = withMetadata((studentId: number, courseAttemptId: number, context?: PomiRequestContext) => operations.getStudentCourseAttempts({ "sid": studentId, "id": courseAttemptId } as unknown as getStudentCourseAttemptsInput, context), definitions.getStudentCourseAttempts, operationProblemTypes.getStudentCourseAttempts)
            const list = withMetadata((studentId: number, input: Omit<listStudentCourseAttemptsInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentCourseAttempts({ "sid": studentId, ...input } as unknown as listStudentCourseAttemptsInput, context), definitions.listStudentCourseAttempts, operationProblemTypes.listStudentCourseAttempts)
            const update = withMetadata((studentId: number, courseAttemptId: number, body: updateStudentCourseAttemptsInput['body'], context?: PomiRequestContext) => operations.updateStudentCourseAttempts({ "sid": studentId, "id": courseAttemptId, body } as unknown as updateStudentCourseAttemptsInput, context), definitions.updateStudentCourseAttempts, operationProblemTypes.updateStudentCourseAttempts)
            return { create, delete: deleteOperation, get, list, update }
        })(),
        "periodPlannings": (() => {
            const create = withMetadata((studentId: number, body: createStudentPeriodPlanningsInput['body'], context?: PomiRequestContext) => operations.createStudentPeriodPlannings({ "sid": studentId, body } as unknown as createStudentPeriodPlanningsInput, context), definitions.createStudentPeriodPlannings, operationProblemTypes.createStudentPeriodPlannings)
            const deleteOperation = withMetadata((studentId: number, periodPlanningId: number, context?: PomiRequestContext) => operations.deleteStudentPeriodPlannings({ "sid": studentId, "id": periodPlanningId } as unknown as deleteStudentPeriodPlanningsInput, context), definitions.deleteStudentPeriodPlannings, operationProblemTypes.deleteStudentPeriodPlannings)
            const get = withMetadata((studentId: number, periodPlanningId: number, context?: PomiRequestContext) => operations.getStudentPeriodPlannings({ "sid": studentId, "id": periodPlanningId } as unknown as getStudentPeriodPlanningsInput, context), definitions.getStudentPeriodPlannings, operationProblemTypes.getStudentPeriodPlannings)
            const list = withMetadata((studentId: number, input: Omit<listStudentPeriodPlanningsInput, "sid"> = {}, context?: PomiRequestContext) => operations.listStudentPeriodPlannings({ "sid": studentId, ...input } as unknown as listStudentPeriodPlanningsInput, context), definitions.listStudentPeriodPlannings, operationProblemTypes.listStudentPeriodPlannings)
            const update = withMetadata((studentId: number, periodPlanningId: number, body: updateStudentPeriodPlanningsInput['body'], context?: PomiRequestContext) => operations.updateStudentPeriodPlannings({ "sid": studentId, "id": periodPlanningId, body } as unknown as updateStudentPeriodPlanningsInput, context), definitions.updateStudentPeriodPlannings, operationProblemTypes.updateStudentPeriodPlannings)
            return { create, delete: deleteOperation, get, list, update }
        })(),
    }
}

export type Resources = ReturnType<typeof bindResources>
