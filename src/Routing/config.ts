import { ErrorBody, ResponseBody } from './Res';

export declare type DefaultError =
	| number
	| {
	status: number;
	body: ErrorBody;
}

export declare type Config = {
	notFound: DefaultError,
	methodNotAllowed: DefaultError,
	internalServerError: DefaultError
	handlerDidNotReturn: DefaultError;
	emitAllowHeader: boolean;
	/** Default Res via handler (Not independent Res) */
	status: number;
	body: ResponseBody;
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
	status: 404,
	body: null,
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
	...res
};
