import type { Res } from '../Res';
import type { Router } from './router';

export declare interface Req extends Request {
	authData?: Record<string, unknown>;
}

export declare type Context = { req: Req; res: Res };
export declare type SyncHandler = (context: Context) => Response | Res | void;
export declare type AsyncHandler = (context: Context) => Promise<Response | Res | void>;
export declare type Handler = SyncHandler | AsyncHandler;
export declare type ResolvedHandler = {
	handler: Handler;
	authenticate: boolean;
	routerContext: Router;
};

// export declare type Method = 'CONNECT' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'TRACE';
export declare type Method = 'DELETE' | 'GET' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT';

// export declare type RegisteredRoutes = { route: string; handler: Handler }[];
// export declare type Methods = Record<string, RegisteredRoutes>;
