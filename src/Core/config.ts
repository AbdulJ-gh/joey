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
  validationError: DefaultError;
	headers: Record<string, string>;
	prettifyJson: boolean;
	parseBody: RequestBodyStream | false;
	emitAllowHeader: boolean;
	maxUrlLength: number;
	maxQueryLength: number;
  validationErrors: false | 'plaintext' | 'json'
};
