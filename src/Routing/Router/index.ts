import { DefaultResponse } from '../../Utilities/general/statuses';

export declare interface JoeyConfig {
	defaultNotFound: DefaultResponse;
	defaultUnauthorized: DefaultResponse;
	defaultMethodNotAllowed: DefaultResponse;
	defaultHandlerDidNotReturn: DefaultResponse;
	defaultServerError: DefaultResponse;
	emitAllowHeader: boolean;
	defaultHeaders: HeadersInit;
}

export const baseConfig: JoeyConfig = {
	defaultNotFound: 404,
	defaultUnauthorized: 401,
	defaultMethodNotAllowed: 405,
	defaultHandlerDidNotReturn: {
		status: 500,
		message: 'Server did not respond'
	},
	defaultServerError: 500,
	emitAllowHeader: true,
	defaultHeaders: {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': '*',
		'Cache-Control': 'no-store',
		'Content-Type': 'application/json'
	}
};

export { default, Router } from './Router';
