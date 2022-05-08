import type { Req } from './Req';
import type { Logger } from './logger';
import { Res } from './res';
import type { Validator } from './types';


interface Context<ENV = unknown, DEPS = unknown, REQ = unknown> extends ExecutionContext {
	req: Req<REQ>;
	res: Res;
	logger: Logger;
	env: ENV;
	deps?: DEPS;
	validators: Validator[];
}

class Context<ENV = unknown, DEPS = unknown, REQ = unknown> {
	req: Req<REQ>;
	res: Res;
	env: ENV;
	deps?: DEPS;
	logger: Logger;
	validators: Validator[];

	constructor(ctx: ExecutionContext, req: Req<REQ>, env: ENV, validators: Validator[], logger?: Logger) {
		Object.setPrototypeOf(this, ctx);
		this.req = req;
		this.res = new Res();
		this.env = env;
		this.logger = (logger || console) as Logger;
		this.validators = validators;
	}
}


export default Context;
