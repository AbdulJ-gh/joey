import type { ExportedHandlerFetchHandler, Response, FormData, Blob } from '@cloudflare/workers-types';
import type { FetchContext } from './context';
import type { Config } from '../../config';
import type Register from './register';
import type { ReqArgs } from './req';
import type { Res, ResponseObject } from './res';
import type { Validator } from './validator';

export type DeserialisedJson = Record<string, unknown> | unknown[] | number | string | boolean | null;
export type HandlerBodyType = null | 'plaintext' | 'json' | 'formData' | 'urlEncodedFormData' | 'arrayBuffer' | 'blob'
export type BodyType =
	| null
	| string
	| DeserialisedJson
	| FormData
	| URLSearchParams
	| ArrayBuffer
	| ArrayBufferView
	| Blob;

export type ResponseLike = Response | ResponseObject | Res

export type FetchMiddlewareHandler<
	ENV = unknown,
	DEPS = unknown,
	REQ extends ReqArgs = ReqArgs
> = (context: FetchContext<ENV, DEPS, REQ>) => Promise<ResponseLike | void> | ResponseLike | void;

export type FetchHandler<
	ENV = unknown,
	DEPS = unknown,
	REQ extends ReqArgs = ReqArgs
> = (context: FetchContext<ENV, DEPS, REQ>) => Promise<ResponseLike>|ResponseLike;

export type RouteInfo = {
	handler: FetchHandler;
	route: string;
	config: Config;
	middleware: FetchMiddlewareHandler[];
	validator?: Validator;
}

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';

export type Middleware = FetchMiddlewareHandler[];

export type Logger = string;

type FetchProvider = {
	register: Register<RouteInfo>;
	globalMiddleware: Middleware;
	logger?: Logger;
}

export type FetchCoordinator = (provider: FetchProvider) => ExportedHandlerFetchHandler;
