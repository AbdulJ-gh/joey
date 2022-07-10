import type { Req } from './req';
import type { Logger } from '../logger';
import { Res } from './res';


interface Context<ENV = unknown, DEPS = unknown, REQ = unknown> extends ExecutionContext {
	req: Req<REQ>;
	res: Res;
	logger: Logger|Console;
	env: ENV;
	deps?: DEPS;
}

class Context<ENV = unknown, DEPS = unknown, REQ = unknown> {
	constructor(
		ctx: ExecutionContext,
    public req: Req<REQ>,
    public env: ENV,
    public logger: Logger|Console = console
	) {
		this.init(ctx);
	}

	private init(ctx: ExecutionContext) {
		Object.setPrototypeOf(this, ctx);
		this.res = new Res();
	}
}

export default Context;
