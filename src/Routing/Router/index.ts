import { DefaultError } from '../../Utilities/general/statuses';
import { ResponseBody } from '../Res/types';

export declare interface JoeyConfig {
	notFound: DefaultError;
	unauthorized: DefaultError;
	methodNotAllowed: DefaultError;
	handlerDidNotReturn: DefaultError;
	serverError: DefaultError;
	emitAllowHeader: boolean;
	status: number;
	body: ResponseBody;
	headers: HeadersInit;
	prettifyJson: boolean;
}


export const baseConfig: JoeyConfig = {
	/** Default errors */
	notFound: 404,
	unauthorized: 401,
	methodNotAllowed: 405,
	handlerDidNotReturn: {
		status: 500,
		body: 'Server did not respond'
	},
	serverError: 500,
	emitAllowHeader: true,
	/** Default Response */
	status: 200,
	body: {},
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': '*',
		'Cache-Control': 'no-store',
		'Content-Type': 'application/json'
	},
	prettifyJson: true
};

export { default, Router } from './router';
