import type { ScheduledController } from '@cloudflare/workers-types';
import type { CfExecutionContext } from '../../types';
import type { Logger } from './types';

interface IScheduleContext<ENV = unknown, DEPS = unknown> extends CfExecutionContext {
	controller: ScheduledController;
	env: ENV;
	logger: Logger;
	deps: DEPS;
}

export class ScheduleContext<	ENV = unknown, DEPS = unknown> implements IScheduleContext {
	public deps = <DEPS>{};
	public waitUntil: ExecutionContext['waitUntil'] = (): void => {};

	constructor(
		ctx: ExecutionContext,
		public controller: ScheduledController,
		public env: ENV,
		public logger: Logger|'' = ''
	) {
		Object.setPrototypeOf(this, ctx);
	}
}
