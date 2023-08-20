import type { ExecutionContext, ScheduledController } from '@cloudflare/workers-types';
import type { UnknownRecord } from '../../types';
import type { Logger } from './types';

interface IScheduledContext<ENV = UnknownRecord, DEPS = UnknownRecord> extends ExecutionContext {
	controller: ScheduledController;
	env: ENV;
	logger: Logger;
	deps: DEPS;
}

export class ScheduledContext<ENV = UnknownRecord, DEPS = UnknownRecord> implements IScheduledContext {
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
