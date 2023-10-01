import type { ExportedHandlerScheduledHandler } from '@cloudflare/workers-types';
import type { ScheduleContext } from './context';

export type ScheduledHandler<ENV = unknown, DEPS = unknown> = (
	context: ScheduleContext<ENV, DEPS>
) => Promise<void>|void;

export type CronJobs = Record<string, ScheduledHandler>;
export type Logger = string;

type ScheduleProvider = {
	jobs: CronJobs;
	logger?: Logger;
};

export type ScheduleCoordinator = (provider: ScheduleProvider) => ExportedHandlerScheduledHandler;
