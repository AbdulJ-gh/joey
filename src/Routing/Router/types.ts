import type { Logger } from '../../Logger';
import type { Res } from '../Res';
import type { Req } from '../Req';
import type { Router } from './router';
import { Config } from '../config';

export declare type Middleware = Handler;

export declare type WaitUntil = (promise: Promise<unknown>) => void;

export declare type Context = {
	req: Req;
	res: Res;
	waitUntil: WaitUntil
};

export declare type SyncHandler = (ctx: Context, logger: Logger) => Response | Res | void;
export declare type AsyncHandler = (ctx: Context, logger: Logger) => Promise<Response | Res | void>;
export declare type Handler = SyncHandler | AsyncHandler;
export declare type ResolvedHandler = {
	handler: Handler;
	authenticate: boolean;
	routerContext: Router;
	// Absolute path is figured out on event trigger, as a handler is not aware of it's context during instantiation.
	absolutePath?: string;
	config?: Config;
	middleware?: Middleware;
};

// Not included 'CONNECT' | 'HEAD' | 'TRACE';
export declare type Method = 'DELETE' | 'GET' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT';
