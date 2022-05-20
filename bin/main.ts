import { readFileSync, readdirSync, mkdtempSync } from 'fs';
import { join, sep } from 'path';
import { spawn, spawnSync } from 'child_process';
import { camelCase } from 'lodash';
import getWorkerConfig from './helpers/getWorkerConfig';
import TempFile from './helpers/tempFile';
import { tmpdir } from 'os';
import AppBuilder from './helpers/compileApp'; // Todo - move here, and realign use of config and options words

export default function main() {
	// Args
	const { argv, cwd } = process;
	const cli = argv[2] === '--esbuild-cli'; // Will this error if there's not even 3 args
	const buildArgs = cli ? argv.slice(3) : [join(cwd(), argv[2])]; // build.js arg must be relative to package.json dir

	// Parse yaml
	const config = getWorkerConfig(); // JS object
	const tmpDir = mkdtempSync(tmpdir() + sep)
	const workerFile = new TempFile(tmpDir, 'worker.json', JSON.stringify(config))
	// console.log('SAVED CONFIG TO', workerFile.path);

	const validateWorker = spawnSync('ajv', [
		'validate',
		'-r', join(__dirname, 'schemas/refs/*.json'),
		'-s', join(__dirname, 'schemas/worker.json'),
		'-d', workerFile.path,
		'--allow-matching-properties',
		'--all-errors',
		'--errors=json'
	]);

	// console.log('Validated worker with exit code', validateWorker.status, validateWorker.stdout.toString('utf8'));
	if (validateWorker.status !== 0) {
		console.log('Exited with code', validateWorker.status)
		console.log('Check the worker configuration');
		const message = validateWorker.stderr.toString('utf8')
		if (message.includes('invalid')) {
			console.log(message.split('invalid')[1]);
		}
		process.exit(1)
	}

	const app = new AppBuilder(tmpDir);

	type Handler = {
		route: string;
		method: string;
		src: string;
		options?: Record<string, string>;
		middleware: string[]
	}

	const { src, handlersRoot, logger, schemas, handlers, middleware, baseConfig }: {
		src: string,
		handlersRoot: string,
		logger: string,
		schemas: string,
		middleware: Record<string, string>,
		baseConfig: {
			middleware: string[],
			options: Record<string, unknown>
		}
		handlers: Record<string, Handler>
	} = config;

	app.write(`import Joey from 'joeycf'`)

	const handlerNames = Object.keys(handlers);
	const middlewareNames = Object.keys(middleware || {});

	handlerNames.forEach(handlerName => {
		const handlerFile = './' + join(src, handlersRoot, handlers[handlerName].src)
		app.write(`import ${camelCase(handlerName)} from '${handlerFile}'`)
	})

	middlewareNames.forEach(middlewareName => {
		const middlewareFile = `${src}/${middleware[middlewareName]}`
		app.write(`import ${camelCase(middlewareName)} from '${middlewareFile}'`)
	})

	if (logger) {
		app.write(`import logger from '${'./' + join(src, logger)}'`)
	}

	if (schemas) {
		// AJV
		// check docs to see how we can use custom formats
		// https://github.com/ajv-validator/ajv-cli#-c---custom-keywordsformats-definitions
		const schemasProcess = spawnSync('ajv', [
			'compile',
			'-r', './' + join(src, schemas, 'refs/*.json'),
			'-s', './' + join(src, schemas, '/*.json'),
			'--use-defaults',
			'--all-errors',
			`-o`
		]);
		// Error handle ?
		// if (schemasProcess.status !== 0) {
		// 	console.log('Exited with code', schemasProcess.status)
		// 	console.log(`Check the schema for ${join(schemas, file)}`);
		// 	console.log(validateWorker.stderr.toString('utf8'))
		// 	process.exit(1)
		// }

		const validators = schemasProcess.stdout.toString('utf8')
		const tempSchemasFile = new TempFile(tmpDir, 'schemas.js', validators)
		const schemaFiles = readdirSync('./' + join(src, schemas)).filter(file => file.endsWith('.json'))

		// This will use the $id name first if it exists, if not it will use the file name.
		// Need to make sure top level schemas (non refs) are named appropriately
		if (schemaFiles.length === 1) {
			const schema = JSON.parse(readFileSync('./' + join(src, schemas, schemaFiles[0]), 'utf8'))
			const name = schema['$id'] ? schema['$id'] : schemaFiles[0].replace('.json', '')
			app.write(`import __validator from '${tempSchemasFile.path}'`, ';\n')
			app.write(`const validators = { ${name}: __validator }`)
		} else if (schemaFiles.length > 1) {
			app.write(`import * as validators from '${tempSchemasFile.path}'`, ';\n')
		}
		// ^^ AJV

	} else {
		app.write(`const validators = {}`)
	}



	const globalMiddleware: string[] = [];

	(baseConfig?.middleware || []).forEach(middlewareName => {
		globalMiddleware.push(`__UNSAFE_MIDDLEWARE_NAME__${middlewareName}`)
	})

	const paths: Record<string, any> = {}

	handlerNames.forEach((handlerName, index) => {
		const { route, method, src, options, middleware } = handlers[handlerName]
		if (!paths[route]) { paths[route] = {} }
		paths[route][method] = {
			handler: `__UNSAFE_HANDLER_NAME__${handlerName}`,
			path: route,
			config: options,
			middleware: (middleware || []).map((middlewareName: string) => `__UNSAFE_MIDDLEWARE_NAME__${middlewareName}`),
		}
	})

	app.write(`const middleware = ${JSON.stringify(globalMiddleware)}`, ';\n')
	app.write(`const paths = ${JSON.stringify(paths)}`, ';\n')
	app.write(`const baseConfig = ${JSON.stringify(baseConfig.options)}`, ';\n')



	handlerNames.forEach(handlerName => {
		app.replace(`"__UNSAFE_HANDLER_NAME__${handlerName}"`, camelCase(handlerName))
	})

	middlewareNames.forEach(middlewareName => {
		app.replace(`"__UNSAFE_MIDDLEWARE_NAME__${middlewareName}"`, camelCase(middlewareName))
	})


	app.write('let loggerInit')
	if (logger) {
		app.writeMultiple([
			'loggerInit = (logger, request, ctx, env) => {',
			'  logger[\'event\'](logger, request, ctx, env)',
			'}'
		])
	}

	app.write('\nexport default new Joey(paths,baseConfig,middleware,validators,logger,loggerInit)')

	// Need to check a combination of path and method do not occur twice, otherwise throw error

 	// Compiled app and Execute esbuild
	const build = spawn(cli ? 'esbuild' : 'node', buildArgs);
	build.stdout.pipe(process.stdout); // Pipes child process stdout to process.stdout
	build.stderr.pipe(process.stdout);  // Pipes child process stderr to process.stdout
	build.stdin.write(app.read()); // Streams the `app` file to the stdin on the child process
	build.stdin.end(); // Closes the child process
}
