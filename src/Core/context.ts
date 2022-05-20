import type { Req } from './req';
import type { Logger } from '../logger';
import { Res } from './res';
import type { Validators } from './types';


interface Context<ENV = unknown, DEPS = unknown, REQ = unknown> extends ExecutionContext {
	req: Req<REQ>;
	res: Res;
	logger: Logger;
	env: ENV;
	deps?: DEPS;
	validators: Validators;
}

class Context<ENV = unknown, DEPS = unknown, REQ = unknown> {
	req: Req<REQ>;
	res: Res;
	env: ENV;
	deps?: DEPS;
	logger: Logger;
	validators: Validators;

	constructor(ctx: ExecutionContext, req: Req<REQ>, env: ENV, validators: Validators, logger?: Logger) {
		Object.setPrototypeOf(this, ctx);
		this.req = req;
		this.res = new Res();
		this.env = env;
		this.logger = (logger || console) as Logger;
		this.validators = validators;
	}
}


export default Context;
