import type {
	Response,
	ExecutionContext,
	ExportedHandler,
	ExportedHandlerFetchHandler,
	ExportedHandlerQueueHandler,
	ExportedHandlerScheduledHandler
} from '@cloudflare/workers-types';

import type { RouteInfo, Middleware, CronJobs, MessageQueueTasks } from './handlers';
import type { Coordinators, FetchArgs, QueueArgs, ScheduledArgs } from './types';

import Register, { type Routes } from './handlers/fetch/register';
import { ConfigInstance, type Config } from './config';

export default class Joey implements ExportedHandler {
	public readonly register: Register<RouteInfo>;

	constructor(
		config: Partial<Config> = {},
		routes: Routes<RouteInfo> = {},
		public middleware: Middleware,
		public cronJobs: CronJobs,
		public messageQueueTasks: MessageQueueTasks,
		public coordinators: Coordinators
	) {
		this.register = new Register<RouteInfo>(routes);
		ConfigInstance.initGlobal(config);
	}


	public fetch: ExportedHandlerFetchHandler = async (...args: FetchArgs): Promise<Response> => {
		this.passThroughOnException(args[2]);
		return (await this.coordinators.fetch({
			register: this.register,
			globalMiddleware: this.middleware,
			logger: 'placeholder'
		})(...args));
	};

	public queue: ExportedHandlerQueueHandler = async (...args: QueueArgs): Promise<void> => {
		this.passThroughOnException(args[2]);
		await this.coordinators.queue({
			tasks: this.messageQueueTasks,
			logger: 'placeholder'
		})(...args);
	};

	public scheduled: ExportedHandlerScheduledHandler = async (...args: ScheduledArgs): Promise<void> => {
		this.passThroughOnException(args[2]);
		await this.coordinators.scheduled({
			jobs: this.cronJobs,
			logger: 'placeholder'
		})(...args);
	};

	private passThroughOnException(ctx: ExecutionContext): void {
		if (ConfigInstance.options.passThroughOnException) {
			ctx.passThroughOnException();
		}
	}
}
