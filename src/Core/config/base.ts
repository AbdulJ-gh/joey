import type { Config, DefaultErrors, Options } from './types';

export const baseDefaultErrors: DefaultErrors = {
	notFound: { status: 404, body: 'Resource not found' },
	methodNotAllowed: { status: 405, body: 'Method not allowed' },
	internalServerError: { status: 500, body: 'An unexpected error occurred' },
	validationError: { status: 400, body: 'Bad request' }
};

export const baseOptions: Options = {
	headers: {},
	prettifyJson: true,
	cloneBody: false,
	parseBody: 'json',
	contentHeaderParseMap: {
		fallback: null,
		matchers: [
			{ query: 'text', bodyType: 'plaintext', matcher: 'inclusive' },
			{ query: 'json', bodyType: 'json', matcher: 'inclusive' },
			{ query: 'form-data', bodyType: 'formData', matcher: 'inclusive' },
			{ query: 'form-urlencoded', bodyType: 'urlEncodedFormData', matcher: 'inclusive' },
			{ query: 'octet-stream', bodyType: 'arrayBuffer', matcher: 'inclusive' }
		]
	},
	transformPathParams: true,
	transformQueryParams: true,
	emitAllowHeader: true, // global only
	validationErrors: true,
	allValidationErrors: true,
	passThroughOnException: true // global only
};

export const baseConfig: Config<DefaultErrors, Options> = {
	defaultErrors: baseDefaultErrors,
	options: baseOptions
};
