import { Handler, Req } from '../Core';
import { Logger } from '../Logger';
import functionName from './exampleHandler';

// 	req: Req;
// 	headers: Headers;
// 	logger: Logger;
// 	env: ENV;
// 	deps: DEPS;

const defaults = {
	req: new Req(new Request('hello')),
	headers: new Headers(),
	logger: new Logger(),
	env: {},
	deps: {},
	passThroughOnException: () => {},
	waitUntil: () => {}
};

type Inputs = {
	req?: Req;
	header?: Headers;
	logger?: Logger;
	env?: unknown;
	deps?: unknown;
	passThroughOnException?: () => void;
	waitUntil?: (promise: Promise<any>) => void;
};

const mockAsyncHandler = (handler: Handler<any, any>, inputs?: Inputs) => async () =>
	await handler({ ...defaults, ...inputs });

const mockSyncHandler = (handler: Handler<any, any>, inputs?: Inputs) => () =>
	handler({ ...defaults, ...inputs });

const mockFunctionName = mockAsyncHandler(functionName, { env: { fauna: 'string', cache: 'string' } });

const mockFunctionName2 = mockSyncHandler(functionName);
