import type { ExecutionContext, MessageBatch, Request, ScheduledController } from '@cloudflare/workers-types';
import type { FetchCoordinator, QueueCoordinator, ScheduleCoordinator } from './handlers';

export type UnknownRecord = Record<string, unknown>

export type CfExecutionContext = Omit<ExecutionContext, 'passThroughOnException'>


export type FetchArgs = [Request<unknown, IncomingRequestCfProperties<unknown>>, unknown, ExecutionContext]
export type QueueArgs = [MessageBatch, unknown, ExecutionContext]
export type ScheduledArgs = [ScheduledController, unknown, ExecutionContext]

export type Coordinators = {
	fetch: FetchCoordinator,
	queue: QueueCoordinator,
	scheduled: ScheduleCoordinator
}
