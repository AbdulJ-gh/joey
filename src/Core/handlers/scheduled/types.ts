import type { ExportedHandlerScheduledHandler } from '@cloudflare/workers-types';
import type { ScheduledContext } from './context';

export type ScheduledHandler<ENV = unknown, DEPS = unknown> = (
	context: ScheduledContext<ENV, DEPS>
) => Promise<void>|void;

export type CronJobs = Record<string, ScheduledHandler>
export type Logger = string

type ScheduledProvider = {
	jobs: CronJobs,
	logger?: Logger
}

export type Scheduled = (provider: ScheduledProvider) => ExportedHandlerScheduledHandler
