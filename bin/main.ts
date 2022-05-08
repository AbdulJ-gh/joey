import { readFileSync, mkdtempSync, writeFileSync } from 'fs';
import { join, sep } from 'path';
import { spawn } from 'child_process';
import { parse as yaml } from 'yaml';
import { camelCase } from 'lodash';
import { tmpdir } from 'os';

export default function main() {
	console.log('Executing Joey main');
	// Will need to error handle this whole things. It could just be in a bi

	// Args
	const { argv, cwd } = process;
	const cli = argv[2] === '--esbuild-cli'; // Will this error if there's not even 3 args
	const esbuildArgs = cli ? argv.slice(3) : [join(cwd(), argv[2])]; // build.js arg must be relative to package.json dir


	// Parse yaml
	const { worker } = yaml(readFileSync('./worker.yaml', 'utf8'));

	// Validate object shape and properties // use ajv....

	function validate() {
	}
	validate();

	/* Assume validation is done by now */
	// Create temp file
	const tmpDir = mkdtempSync(tmpdir() + sep)
	const tmpFile = `${tmpDir}/app.js`;

	const handlerRoot = worker.handlerRoot;
	const handlers = worker.handlers;
	// console.log('DOCUMENT IS', worker, '\n--------------------\n');
	// console.log('HANDLER SRC IS', handlerRoot, '\n--------------------\n');
	// console.log('HANDLERS ARE', handlers, '\n--------------------\n');


	const writeToTempFile = (line: string) => {
		writeFileSync(tmpFile, `${line};\n`, { flag: 'a+' })
	}

	const replaceStringInTempFile = (search: string, replace: string) => {
		const file = readFileSync(tmpFile, 'utf8');
		const update = file.replace(search, replace)
		writeFileSync(tmpFile, update, 'utf8')
	}

	writeToTempFile(`import Joey from 'joeycf'`)

	type Handler = {
		path: string;
		method: string;
		src: string;
		options?: Record<string, string>;
		middleware: string[]
	}


	const handlerNames = Object.keys(handlers);

	handlerNames.forEach(handlerName => {
		const handlerFile = `${handlerRoot}/${handlers[handlerName].src}` // TODO - normalise all paths everywhere
		writeToTempFile(`import ${camelCase(handlerName)} from '${handlerFile}'`)
	})

	const paths: Record<string, Handler> = {}

	handlerNames.forEach((handlerName, index) => {
		const { path, method, src, options, middleware } = handlers[handlerName]
		// @ts-ignore
		if (!paths[path]) { paths[path] = {} }

		// @ts-ignore
		paths[path][method] = {
			handler: handlerName,
			path,
			config: options || {},
			middleware: middleware || []
		}

	})

	writeToTempFile(`const paths = ${JSON.stringify(paths)}`)

	handlerNames.forEach(handlerName => {
		replaceStringInTempFile(`"${handlerName}"`, camelCase(handlerName))
	})

	writeToTempFile('export default new Joey(paths)')



	/** AJV */
	// const schemasDirectory = doc.workers.schemas

	// ajv compile -s "./*.json" -o | ....stdout

	// const schemas = spawn('ajv compile -s "./*.json" -o');
	// ... stdout to a temp file or to the const
	// check docs to see how we can use custom formats https://github.com/ajv-validator/ajv-cli#-c---custom-keywordsformats-definitions
	/** AJV */

	// Create a flat object of al paths that can be the input for the app. Might need to parse and define , middleware, configs in advance
	// Need to check a combination of path and method do not occur twice, otherwise throw error
	// How will this all affect testing, will we be able to test easily?

	// Compiled app
	const app = readFileSync(tmpFile, 'utf8');
	// Execute esbuild
	const exec = spawn(cli ? 'esbuild' : 'node', esbuildArgs);

	exec.stdout.pipe(process.stdout);
	exec.stdin.write(app);
	exec.stdin.end();
}

