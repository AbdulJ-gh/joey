import { RequestBodyStream } from './req';

type DefaultError = {
	status: number;
	body?: null | string | Record<string, string>;
	headers?: Record<string, string>;
};

export type Config = {
	notFound: DefaultError;
	methodNotAllowed: DefaultError;
	urlTooLong: DefaultError;
	queryTooLong: DefaultError;
	internalServerError: DefaultError;
	headers: Record<string, string>;
	prettifyJson: boolean;
	parseBody: RequestBodyStream | false;
	emitAllowHeader: boolean;
	maxUrlLength: number;
	maxQueryLength: number;
};

export const defaultConfig: Config = {
	notFound: {
		status: 404,
		body: 'Resource not found',
		headers: {}
	},
	methodNotAllowed: {
		status: 405,
		body: 'HTTP method not allowed',
		headers: {}
	},
	urlTooLong: {
		status: 414,
		body: 'Request URI too long',
		headers: {}
	},
	queryTooLong: {
		status: 414,
		body: 'Request query too long',
		headers: {}
	},
	internalServerError: {
		status: 500,
		body: 'An unexpected error occurred',
		headers: {}
	},
	headers: {},
	prettifyJson: false,
	parseBody: 'json',
	emitAllowHeader: true,
	maxUrlLength: 2048,
	maxQueryLength: 1024
};
