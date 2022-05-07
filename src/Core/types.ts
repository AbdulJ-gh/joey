import type Context from './context';
import type { Config } from './config';
import { Res, ResponseBody } from './res';

export type DeserialisedJson = Record<string, unknown> | unknown[];
export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS'; // Missing 'CONNECT' | 'HEAD' | 'TRACE';

/** Response */
export type ResponseObject = {
	status?: number; // defaults to 200 if handler found, or 204 if handler found with no body, else 404 or config value
	body?: ResponseBody; // defaults to null if handler found, else config
	headers?: Record<string, string>; // HeadersInit; // defaults to config headers if handler found, else empty + not found config + allow header config
};

export type ResponseLike = Response | ResponseObject | Res;

/** Handlers */
type SyncMiddlewareHandler<ENV = unknown, DEPS = unknown, REQ = unknown> =
	(ctx: Context<ENV, DEPS, REQ>) => ResponseLike | void;
export type AsyncMiddlewareHandler<ENV = unknown, DEPS = unknown, REQ = unknown> =
	(ctx: Context<ENV, DEPS, REQ>) => Promise<ResponseLike | void>;

export type MiddlewareHandler<ENV = unknown, DEPS = unknown, REQ = unknown> =
	| SyncMiddlewareHandler<ENV, DEPS, REQ>
	| AsyncMiddlewareHandler<ENV, DEPS, REQ>;

export type SyncHandler<ENV = unknown, DEPS = unknown, REQ = unknown> =
	(ctx: Context<ENV, DEPS, REQ>) => ResponseLike;
export type AsyncHandler<ENV = unknown, DEPS = unknown, REQ = unknown> =
	(ctx: Context<ENV, DEPS, REQ>) => Promise<ResponseLike>;

export type Handler<ENV = unknown, DEPS = unknown, REQ = unknown> =
	SyncHandler<ENV, DEPS, REQ> | AsyncHandler<ENV, DEPS, REQ>;

export type ResolvedHandler = {
	handler: Handler;
	path: string;
	config: Partial<Config>;
	middleware: MiddlewareHandler[];
};
