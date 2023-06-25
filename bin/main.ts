import { mkdtempSync, mkdirSync, readFileSync, existsSync, rmSync  } from 'fs';
import { spawn } from 'child_process';
import { join, sep } from 'path';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';
import fg from 'fast-glob';
import Ajv, { JSONSchemaType } from 'ajv';
import standaloneCode from 'ajv/dist/standalone/index.js';
import * as esbuild from 'esbuild';

import { Composer, TempFile, getWorkerConfig, validateWorker, throwError, ERRORS } from './helpers/index.js';
import type { Worker } from './types.js'

const { cwd, stdout, stderr } = process;

export default async function main() {
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

	const app = new Composer(tempDir);
	app.steps.IMPORT_JOEY();

	handlerNames.forEach(name => {
		app.steps.IMPORT_HANDLER(name, './' + join(handlersRoot, handlers[name].src));
	});

	middlewareNames.forEach(name => {
		app.steps.IMPORT_HANDLER(name, './' + join(middlewareRoot, middleware[name]));
	});

	if (logger) {
		app.steps.IMPORT_LOGGER_INTERFACE();
		app.steps.IMPORT_LOGGER('./' + join(logger));
	}

	app.steps.DECLARE_CONFIG({ ...baseConfig.options, ...baseConfig.defaultResponses });
	app.steps.DECLARE_MIDDLEWARE(baseConfig.middleware.map(middlewareName =>
		`__UNSAFE_MIDDLEWARE_NAME__${middlewareName}`
	));

	// AJV
	// check docs to see how we can use custom formats
	// https://github.com/ajv-validator/ajv-cli#-c---custom-keywordsformats-definitions
	// TODO - Pass any ajv option as per here https://ajv.js.org/options.html
	// Todo - what if !validation or schemas not defined (has to throw error) or no refs (is optional)
	// TODO - Need to be clear that every schema file has to `export default { .... }`
	// Todo - assumes cwd is the root of the project??
	// THE NAMES OF THE SCHEMAS MUST MUST MUST BE VALID KEYS.

	// Recursively get file paths for all schema files based on `schemas` glob
	const importedSchemas: JSONSchemaType<unknown>[] = [];
	const schemaPaths = fg.sync(schemas, {
		// gitignore: true,
		ignore: ['!node_modules', 'package.json', 'package-lock.json'], // Why am I doing this is I am looking for .schema.ts files? I was using .schema.json before?
		absolute: true,
	});

	console.log('schemaPaths', schemaPaths)

	let schemaFiles = 0;
	for (const path of schemaPaths) {
		schemaFiles++;
		const tempSchemasFile = new TempFile(tempDir, `schema[${schemaFiles}].mjs`)

		esbuild.buildSync({
			entryPoints: [path],
			bundle: true,
			format: 'esm',
			target: 'esnext',
			outfile: tempSchemasFile.path,
		})

		const schemaFile = await import(tempSchemasFile.path)
		importedSchemas.push(schemaFile.default)
	}

	// Todo - Passed in from config: - WIP WIP WIP
	const includeFormats = [ 'uuid' ];
		const reduced = includeFormats.reduce((acc: Record<string, string> , cur) => {
		acc[cur] = cur;
		return acc;
	}, {})
		const customFormats = { // TODO, placeholder, this should come from config as files
		custom: () => true
	}
	const opts = {}
	// Options type from ajv package. Warning. Any formats defined here would override the includeFormats and customFormats
	// Note that some options may not work with standaloneCode. Check documentation

	const ajv = new Ajv({
		schemas: importedSchemas,
		code: {
			source: true,
			esm: true
		},
		formats: {
			...includeFormats.reduce((acc: Record<string, string> , cur) => {
				acc[cur] = cur;
				return acc;
			}, {}),
			...customFormats,
		},
		...opts
	});
	const tempValidatorsFile = new TempFile(tempDir, 'ajv.js', standaloneCode(ajv));

	app.steps.IMPORT_VALIDATORS(tempValidatorsFile.path);

	const paths: Record<string, any> = {};
	handlerNames.forEach((name) => {
		const {
			route,
			method,
			options,
			middleware: handlerMiddleware,
			schema
		} = handlers[name];

		if (!paths[route]) {
			paths[route] = {};
		}

		if (paths[route][method]) {
			throwError(ERRORS.DUPLICATE_HANDLER(`${method.toUpperCase()} ${route}`));
		}

		// TODO - here check if the relevant schema exists (path, query, body), else throw a Joey error
		// ^^^ tested, it must be done
		// {
		// 		query:validators.${schema?.query},
		// 		path:validators.${schema?.path},
		// 		body:validators.${schema?.body}
		// }

		let validator = '__UNSAFE_VALIDATOR_REF__{';
		if (schema) { // TODO - Should the schema for `handler.schema` have no default as opposed to "default": {}
			for (const key in schema) {
				validator += `${key}:validators.${schema[key as 'path' | 'query' | 'body']},`
			}
		}
		validator += '}__UNSAFE_VALIDATOR_REF__';

		paths[route][method] = {
			handler: `__UNSAFE_HANDLER_NAME__${name}`,
			path: route,
			config: options,
			middleware: handlerMiddleware.map(middlewareName => `__UNSAFE_MIDDLEWARE_NAME__${middlewareName}`),
			validator
		};
	})

	app.steps.DECLARE_PATHS(paths);
	app.steps.REPLACE_UNSAFE_VALIDATOR_REFS();
	handlerNames.forEach(name => app.steps.REPLACE_UNSAFE_HANDLER_NAME(name));
	middlewareNames.forEach(name => app.steps.REPLACE_UNSAFE_MIDDLEWARE_NAME(name));
	logger ? app.steps.DECLARE_LOGGER_INIT() : app.steps.NO_LOGGER();
	app.steps.EXPORT();

	const finalApp = app.read();
	if (finalApp.includes('__UNSAFE_MIDDLEWARE_NAME__')) {
		// TODO, add for other unsafe types too? or are they not needed? If not make a comment
		throwError(ERRORS.MISSING_MIDDLEWARE_DECLARATION);
	}
	console.log('\n\n\nTHIS IS DONE', finalApp, '\n\n\n');

	/** ES BUILD */
	const tmpBuildDir = join(cwd(), build.outDir, 'tmp');
	mkdirSync(tmpBuildDir, { recursive: true });
	const __dirname = fileURLToPath(new URL('.', import.meta.url));
	const buildJs = new TempFile(tmpBuildDir, 'build.js', readFileSync(join(__dirname, 'buildOptions.js')).toString());

	buildJs.write(`options.outfile = '${join(cwd(), build.outDir, build.filename)}';`);
	buildJs.write(`options.sourcemap = ${build.sourcemaps};`);
	if (build.watch) {
		buildJs.write('options.watch = true')
	}
	if (!build.minify) {
		buildJs.write('options.minify = false')
	}
	buildJs.write(`process.stdin.on('data',async data=>{ runBuild(data) })`);
	/** ES BUILD */


		// Compiled app and Execute esbuild
	const buildProcess = spawn('node', [buildJs.path]);
	buildProcess.stdout.pipe(stdout); // Pipes child process stdout to process.stdout
	buildProcess.stderr.pipe(stderr);  // Pipes child process stderr to process.stderr
	buildProcess.stdin.write(finalApp); // Streams the `app` file to the stdin of the child process
	buildProcess.stdin.end(); // Ends the stdin to child process

	// Todo
	// No dist/index.js file already, Wrangler shows an error to say it couldn't find the file. Could confuse users
	// or maybe search for one and create it if it doesn't exist

	const clearTmpData = () => {
		if (existsSync(tempDir)) {
			rmSync(tempDir, { recursive: true });
		}
		if (existsSync(tmpBuildDir)) {
			rmSync(tmpBuildDir, { recursive: true });
		}
	};

	buildProcess.stdout.on('data', clearTmpData);
	buildProcess.stderr.on('data', () => clearTmpData());
}

