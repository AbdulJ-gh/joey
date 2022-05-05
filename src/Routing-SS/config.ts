import type { BodyType } from './Req/types';
import type { ErrorBody } from './Res';

export declare type DefaultError =
	| number
	| {
			status: number;
			body: ErrorBody;
			headers?: HeadersInit;
	};

export declare type Config = {
	notFound?: DefaultError;
	methodNotAllowed?: DefaultError;
	internalServerError?: DefaultError;
	urlTooLong?: DefaultError;
	queryTooLong?: DefaultError;
	emitAllowHeader?: boolean;
	defaultHeadersOnErrors?: boolean;
	extractPathParams?: boolean;
	extractQueryParams?: boolean;
	extractBody?: BodyType | 'content-type' | false;
	/** Default Res via handler (Not independent Res) */
	prettifyJson?: boolean;
	// Only used when handlers are hit
	headers?: HeadersInit;
	maxUrlLength?: number;
	maxQueryLength?: number;
	middlewareOnNotFound?: boolean;
	authOnNotFound?: boolean;
	baseHeadersOnNotFound?: boolean;
};

export const baseConfig: Required<Config> = {
	notFound: {
		status: 404,
		body: { message: 'The requested resource does not exist' }, // These should default to something less opinionated such a string
		headers: { 'cache-control': 'max-age=3600' } // 1 hr
	},
	methodNotAllowed: {
		status: 405,
		body: { message: 'HTTP method not allowed' },
		headers: { 'cache-control': 'max-age=3600' } // 1 hr
	},
	urlTooLong: {
		status: 414,
		body: { message: 'Request-URI too long' },
		headers: { 'cache-control': 'max-age=86400' } // 24 hrs
	},
	queryTooLong: {
		status: 414,
		body: { message: 'Request query too long' },
		headers: { 'cache-control': 'max-age=86400' } // 24 hrs
	},
	internalServerError: {
		status: 500,
		body: { message: 'An unexpected error occurred' }
	},
	emitAllowHeader: true,
	defaultHeadersOnErrors: false,
	extractPathParams: true,
	extractQueryParams: true,
	extractBody: null,
	prettifyJson: false,
	maxUrlLength: 2048,
	maxQueryLength: 1024,
	middlewareOnNotFound: false,
	authOnNotFound: false,
	baseHeadersOnNotFound: false,
	headers: {
		'access-control-allow-origin': '*',
		'access-control-allow-methods': '*',
		'cache-control': 'no-store'
	}
};
