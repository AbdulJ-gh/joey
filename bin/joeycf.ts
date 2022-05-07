#!/usr/bin/env node
import { readFileSync, mkdtempSync, writeFileSync } from 'fs';
import { join, sep } from 'path';
import { spawn } from 'child_process';
import { parse as yaml } from 'yaml';
import { camelCase } from 'lodash';
const { tmpdir } = require('os');

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

// Create a flat object of al paths that can be the input for the app. Might need to parse and define all routers, middleware, configs, auths, in advance
// Will need to loop through routers to help create the full flat object
// Is there a way to avoid having to copy the configs in to every single flat object handler?
//          // Hash table
//          // For every handler, generate the config then make hash from the JSON.parse, and use that hash as the key in a configs object, then reference the object[hash] as the config
// If the hash exists already, no need to add it or make another saved copy

// Need to check a combination of path and method do not occur twice, otherwise throw error

// Need to use JSON.stringify or util.inspect to write in memory object to file
// Will this work for object such as function, i.e. middleware and auth
// How do I deal with referencing specific files. Will I need to import each handler at the top of the file first
// Remember it will be piped to esbuild, so will compile down to a single file
// Will the imports need to be relative to this current working directory, i.e. the root dir. That should be easy to deal with if true, because it's part of the yaml

// How will this all affect testing, will we be able to test easily?

// Placeholder joey compiled app
const app = readFileSync(tmpFile, 'utf8');
// Execute esbuild
const exec = spawn(cli ? 'esbuild' : 'node', esbuildArgs);

// exec.stdout.on('data', () => {
// 	console.log('...Updating data');
// })
//

exec.stdout.pipe(process.stdout);
exec.stdin.write(app);
exec.stdin.end();
