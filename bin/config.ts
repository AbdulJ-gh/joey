export const defaultConfig = {
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
