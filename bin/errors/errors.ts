type ErrorList = {
	NO_FILE: string;
	PARSING_FAILURE: string;
	BAD_OUTPUT_FILE: string;
	INVALID_WORKER_CONFIG: string;
	MISSING_HANDLER: string;
	GET_HANDLER_HAS_BODY: string;
	MISSING_MIDDLEWARE_DECLARATION: string;
	DUPLICATE_HANDLER_NAME: (handler: string) => string;
	DUPLICATE_CAMEL_CASE_HANDLER_NAME: (handler: string) => string;
	ROUTE_PARAM_EXIST: (handler: string) => string;
	ROUTE_PARAM_DOES_NOT_HAVE_A_KEY: (handler: string) => string;
	DUPLICATE_HANDLER: (handler: string) => string;
	CANNOT_FIND_SCHEMA: (schemaName: string) => string;
	DUPLICATE_CRON_JOB: (crontab: string) => string;
};

export const ERRORS: ErrorList = {
	NO_FILE: 'Expected a worker.yaml or worker.yml or worker.json file in project root',
	PARSING_FAILURE: 'Failed to parse worker config file. See additional error details above or user a parser to' +
		'check for formatting issues.',
	BAD_OUTPUT_FILE: 'Output file must end with .js',
	INVALID_WORKER_CONFIG: 'Invalid worker config: Check your config',
	MISSING_HANDLER: 'Invalid worker config: Must include at least one handler of type fetch, scheduled or queue',
	GET_HANDLER_HAS_BODY: 'Invalid worker config: GET method cannot have a body',
	MISSING_MIDDLEWARE_DECLARATION: 'Invalid worker config: Missing middleware declaration, ensure middleware is' +
		'defined under "middleware.handler" before being used in "baseConfig.middleware" or' +
		'"handlers.fetch.{HANDLER_NAME}.middleware"',
	DUPLICATE_HANDLER_NAME: (handler: string) => `Invalid worker config: Duplicate handler name "${handler}".  All ` +
		'handler names must be unique, including middleware handlers.',
	DUPLICATE_CAMEL_CASE_HANDLER_NAME: (handler: string) => 'Invalid worker config: Found duplicate handler name' +
		`${handler} when transforming to camelCase. Ensure handler names don't conflict when transformed to camelCase` +
		', including middleware handlers',
	ROUTE_PARAM_EXIST: (handler: string) => `Invalid worker config. Fetch handler "${handler}" has a duplicate ` +
		'route parameter. Params must have unique keys.',
	ROUTE_PARAM_DOES_NOT_HAVE_A_KEY: (handler: string) => `Invalid worker config. Fetch handler "${handler}" has a ` +
		'missing key',
	DUPLICATE_HANDLER: (handler: string) => `Invalid worker config. Duplicate handler declared for "${handler}"`,
	CANNOT_FIND_SCHEMA: (schemaName: string) => `Invalid worker config. Cannot find schema with name "${schemaName}"`,
	DUPLICATE_CRON_JOB: (crontab: string) => `Invalid worker config. Scheduled job with pattern "${crontab}}" is ` +
		'defined multiple times'
};
