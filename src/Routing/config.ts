import { ErrorBody } from './Res';

export declare type DefaultError =
	| number
	| {
	status: number;
	body: ErrorBody;
	headers?: HeadersInit;
}

export declare type Config = {
	notFound: DefaultError,
	methodNotAllowed: DefaultError,
	internalServerError: DefaultError
	handlerDidNotReturn: DefaultError;
	emitAllowHeader: boolean;
	defaultHeadersOnSystemErrors: boolean;
	/** Default Res via handler (Not independent Res) */
	prettifyJson: boolean;
	headers: HeadersInit;
};

const http = {
	notFound: {
		status: 404,
		body: { message: 'The requested resource does not exist' }
	},
	methodNotAllowed: {
		status: 405,
		body: { message: 'HTTP method not allowed' }
	},
	internalServerError: {
		status: 500,
		body: { message: 'An unexpected error occurred' }
	}
};

const res = {
	prettifyJson: false,
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': '*',
		'Cache-Control': 'no-store'
	}
};

export const baseConfig: Config = {
	...http,
	handlerDidNotReturn: http.internalServerError,
	emitAllowHeader: true,
	defaultHeadersOnSystemErrors: false,
	...res
};
