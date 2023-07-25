const { stderr, exit } = process;

const ERRORS = {
  NO_FILE: 'Expected a worker.yaml or worker.yml or worker.json file in project root',
  BAD_OUTPUT_FILE: 'Output file must end with .js',
  INVALID_WORKER_CONFIG: 'Invalid worker configuration, see the error above and check your configuration',
	MISSING_MIDDLEWARE_DECLARATION: 'Missing middleware declaration, ensure middleware is defined under `middleware` before being used in `baseConfig.middleware` or `handlers.${handlerName}.middleware`',
  DUPLICATE_HANDLER: (handler: string) => `Duplicate handler declared for "${handler}"`,
	CANNOT_FIND_SCHEMA: (schemaName: string) => `Cannot find schema with name "${schemaName}"`
}


function throwError(message: string) {
  stderr.write(`\x1b[33m[${new Date().toISOString()}]\x1b[0m 🦘 Build Error ❌ \n\t${message}\n`);
  exit(1);
}

export { ERRORS, throwError }



/**
 *
 * import * as module from './some-module'
 *
 * const array = [Object.values(module)]
 *
 * */
