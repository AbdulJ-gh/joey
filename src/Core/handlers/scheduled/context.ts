import type { ExecutionContext, ScheduledController } from '@cloudflare/workers-types';
import type { Logger } from './types';

interface IScheduledContext<ENV = unknown, DEPS = unknown> extends ExecutionContext {
	controller: ScheduledController;
	env: ENV;
	logger: Logger;
	deps: DEPS;
}

export class ScheduledContext<ENV = unknown, DEPS = unknown> implements IScheduledContext {
	public deps = <DEPS>{};
	public waitUntil = () => {};
	public passThroughOnException = () => {};

	constructor(
		ctx: ExecutionContext,
		public controller: ScheduledController,
		public env: ENV,
		public logger: Logger|'' = ''
	) {
		Object.setPrototypeOf(this, ctx);
	}
}
