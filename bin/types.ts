export type Import = { name: string, path: string };

export type ProcessMode = 'aggregate' | 'isolate' | 'manual';

type RouteRecord = {
	[key: string]: {
		handler: string;
		route: string;
		config: Record<string, unknown>;
		middleware: string[];
		validator?: string;
	};
}

type QueueRecord = {
	handler: string,
	processMode: ProcessMode,
	validator?: string,
	deadLetterQueue?: string // Service binding, e.g. env.
}

export type FetchRoutes = Record<string, RouteRecord> // Aligns with type Register<RouteInfo> in `src/core/handlers/fetch/types.ts`
export type CronJobs = Record<string, string> // Aligns with type CronJobs in `src/core/handlers/scheduled/types.ts`
export type QueueTasks = Record<string, QueueRecord> // Aligns with type QueueTasks in `src/core/handlers/queue/types.ts`
