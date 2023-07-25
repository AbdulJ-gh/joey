import { mkdtempSync } from 'fs';
import { join, sep } from 'path';
import { tmpdir } from 'os';
import _ from 'lodash';

import { Composer, TempFile, getWorkerConfig, validateWorker, throwError, ERRORS, finalBuild, generateValidators } from './helpers/index.js';
import type { Worker } from './types.js'

export default async function main() {
	/** Get and validate worker configuration */
	const worker = <Worker>getWorkerConfig();
	const tempDir = mkdtempSync(tmpdir() + sep);
	const {
		handlerNames,
		middlewareNames
	} = validateWorker(worker, tempDir);
	const {
		handlersRoot,
		middlewareRoot,
		logger,
		schemas,
		build,
		handlers,
		middleware,
		baseConfig
	} = worker;

	/** Generate handler lists for imports  */
	const handlersList = handlerNames.map((name) => ({
		name: _.camelCase(name), path: './' + join(handlersRoot, handlers[name].src)
	}))
	const middlewareList = middlewareNames.map((name) => ({
		name: _.camelCase(name), path: './' + join(middlewareRoot, middleware[name])
	}))
	const config = { ...baseConfig.options, ...baseConfig.defaultResponses }
	const globalMiddleware = baseConfig.middleware.map(Composer.unsafeMiddlewareDeclaration)

	/** Generate Validators */
	const { schemaNames, validatorsFile } = await generateValidators(schemas, tempDir)
	const tempValidatorsFile = new TempFile(tempDir, 'ajv.js',  validatorsFile);

	/** Create Paths */
	const paths: Record<string, any> = {};
	handlerNames.forEach((name) => {
		const {
			route,
			method,
			options,
			middleware: handlerMiddleware,
			schema
		} = handlers[name];

		if (!paths[route]) { paths[route] = {} }
		if (paths[route][method]) {
			throwError(ERRORS.DUPLICATE_HANDLER(`${method.toUpperCase()} ${route}`));
		}

		let validator = '__UNSAFE_VALIDATOR_REF__{';
		for (const key in schema) {
			if (!schemaNames.includes(schema[key])) {
				throwError(ERRORS.CANNOT_FIND_SCHEMA(schema[key]))
			}
			validator += `${key}:validators.${schema[key]},`
		}
		validator += '}__UNSAFE_VALIDATOR_REF__';

		paths[route][method] = {
			handler: `__UNSAFE_HANDLER_REF__${name}`,
			path: route,
			config: options,
			middleware: handlerMiddleware.map(Composer.unsafeMiddlewareDeclaration),
			validator
		};
	})


	/** Compile app */
	const app = new Composer(tempDir);
	app.initialWrite({
		handlerImports: handlersList,
		middlewareImports: middlewareList,
		config,
		globalMiddleware,
		validatorsPath: tempValidatorsFile.path,
		paths,
		logger,
	});

	app.cleanUnsafeRefs(handlerNames, middlewareNames)

	const finalApp = app.read();

	if (finalApp.includes('__UNSAFE_MIDDLEWARE_REF__')) {
		throwError(ERRORS.MISSING_MIDDLEWARE_DECLARATION);
	}

	finalBuild(finalApp, build);
}

