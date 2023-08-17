import type Context from './context';
import type { Res, ResponseObject } from './res';
import type { RequestBodyStream, ReqArgs } from './req';
import type { Params } from '../Utilities';

export type DeserialisedJson = Record<string, unknown> | unknown[];
export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS'; // Missing 'CONNECT' | 'HEAD' | 'TRACE';

export enum BodyType {
	NoContent = 'noContent',
	Plaintext =	'plaintext',
	JSON = 'json',
	ArrayBuffer = 'arrayBuffer',
	TypedArray = 'typedArray',
	Blob = 'blob',
	UrlEncodedFormData = 'urlEncodedFormData',
	FormData = 'formData'
}

export type ResponseLike = Response | ResponseObject | Res;

/** Config */
type DefaultError = {
	status: number;
	body?: null | string | Record<string, string>;
	headers?: Record<string, string>;
};

type ContentHeaderParseMap = {
	matchers: { query: string, bodyType: RequestBodyStream, matcher: 'inclusive'|'exact' }[];
	fallback: BodyType;
}

export type Config = {
	notFound: DefaultError;
	methodNotAllowed: DefaultError;
	exceededUrlLimit: DefaultError;
	exceededQueryLimit: DefaultError;
	internalServerError: DefaultError;
	validationError: DefaultError;
	allValidationErrors: boolean;
	headers: Record<string, string>;
	prettifyJson: boolean;
	parseBody: RequestBodyStream | false | 'content-type-header';
	contentHeaderParseMap: ContentHeaderParseMap;
	transformPathParams: boolean;
	transformQueryParams: boolean;
	emitAllowHeader: boolean;
	maxUrlLength: number;
	maxQueryLength: number;
	validationErrors: false | 'plaintext' | 'json'
};

/** Handlers */
type SyncMiddlewareHandler<ENV = unknown, DEPS = unknown, REQ extends ReqArgs = ReqArgs> =
	(ctx: Context<ENV, DEPS, REQ>) => ResponseLike | void;
type AsyncMiddlewareHandler<ENV = unknown, DEPS = unknown, REQ extends ReqArgs = ReqArgs> =
	(ctx: Context<ENV, DEPS, REQ>) => Promise<ResponseLike | void>;

export type MiddlewareHandler<ENV = unknown, DEPS = unknown, REQ extends ReqArgs = ReqArgs> =
	| SyncMiddlewareHandler<ENV, DEPS, REQ>
	| AsyncMiddlewareHandler<ENV, DEPS, REQ>;

export type SyncHandler<ENV = unknown, DEPS = unknown, REQ extends ReqArgs = ReqArgs> =
	(ctx: Context<ENV, DEPS, REQ>) => ResponseLike;

export type AsyncHandler<ENV = unknown, DEPS = unknown, REQ extends ReqArgs = ReqArgs> =
	(ctx: Context<ENV, DEPS, REQ>) => Promise<ResponseLike>;

export type Handler<ENV = unknown, DEPS = unknown, REQ extends ReqArgs = ReqArgs> =
	SyncHandler<ENV, DEPS, REQ> | AsyncHandler<ENV, DEPS, REQ>;

type ValidatorFn<DATA> = (data: DATA) => boolean; // Validator returns a boolean but create an errors property within the function

export type Validator = {
	path?: ValidatorFn<Params>,
	query?: ValidatorFn<Params>,
	body?: ValidatorFn<DeserialisedJson>, // Only supports JSON body validation, and maybe form data as key value pairs only?
}

export type RegisteredHandler<CONFIG = Partial<Config>> = {
	handler: Handler;
	path: string;
	config: CONFIG;
	middleware: MiddlewareHandler[];
	validator?: Validator;
};
