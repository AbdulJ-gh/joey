import type { CfExecutionContext } from '../../types';
import type { Logger } from './types';
import type { Req, ReqArgs } from './req';
import { Res } from './res';

interface IFetchContext<ENV = unknown, DEPS = unknown, REQ extends ReqArgs = ReqArgs> extends CfExecutionContext {
	req: Req<REQ>
	res: Res;
	env: ENV;
	logger: Logger;
	deps: DEPS;
}

export class FetchContext<ENV = unknown, DEPS = unknown, REQ extends ReqArgs = ReqArgs> implements IFetchContext {
	public res: Res = new Res();
	public deps = <DEPS>{};
	public waitUntil: ExecutionContext['waitUntil'] = (): void => {};

	constructor(
		ctx: ExecutionContext,
		public req: Req<REQ>,
		public env: ENV,
		public logger: Logger|'' = ''
	) {
		Object.setPrototypeOf(this, ctx);
	}
}
