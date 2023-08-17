import type { ExecutionContext } from '@cloudflare/workers-types';
import type { Req, ReqArgs } from './req';
import type { Logger } from '../Logger';
import { Res } from './res';


interface IContext<ENV = unknown, DEPS = unknown, REQ extends ReqArgs = ReqArgs> extends ExecutionContext {
	req: Req<REQ>;
	res: Res;
	env: ENV;
	logger: Logger|Console;
	deps?: DEPS;
}

class Context<ENV = unknown, DEPS = unknown, REQ extends ReqArgs = ReqArgs> implements IContext {
	public res: Res = new Res();
	public deps?: DEPS;
	public waitUntil = () => {};
	public passThroughOnException = () => {};

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
		// this.res = new Res(); // TOOD - Why was this here, will I have broken something by moving this to the public property?
	}
}

export default Context;
