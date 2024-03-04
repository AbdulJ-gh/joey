import Ajv, { JSONSchemaType } from 'ajv';
import AjvErrors from 'ajv-errors';
import fg from 'fast-glob';
import * as esbuild from 'esbuild';
import standaloneCode from 'ajv/dist/standalone/index.js';
import { TempFile } from '../io';
import type { Worker } from '../config';

type Validators = {
	validators: string,
	schemaNames: string[]
}

export async function generateValidators(schema: Worker['schemas'], tempDir: string): Promise<Validators> {
	const { include, exclude } = schema;

	// Recursively get file paths for all schema files based on `schemas` glob
	const importedSchemas: JSONSchemaType<unknown>[] = [];
	const schemaNames: string[] = [];
	const schemaPaths = fg.sync(include, {
		// gitignore: true,
		ignore: [
			'node_modules',
			'package.json',
			'package-lock.json',
			...(typeof exclude === 'string' ? [exclude] : exclude)
		],
		absolute: true
	});

	let schemaFiles = 0;
	for (const path of schemaPaths) {
		schemaFiles++;
		const tempSchemasFile = new TempFile(tempDir, `schema[${schemaFiles}].mjs`);

		esbuild.buildSync({
			entryPoints: [path],
			bundle: true,
			format: 'esm',
			target: 'esnext',
			outfile: tempSchemasFile.path
		});

		const schemaFile = await import(tempSchemasFile.path);
		importedSchemas.push(schemaFile.default);
		schemaNames.push(schemaFile.default.$id);
	}

	const validators = new TempFile(
		tempDir,
		'validators.js',
		standaloneCode(AjvErrors(new Ajv({
			allErrors: true,
			schemas: importedSchemas,
			code: { source: true, esm: true },
			allowUnionTypes: true
		})))
	).path;


	return { validators, schemaNames };
}


/* TODO:
* formats: - Add add make opt-in, exclude from final bundle
*	AjvErrors - Make it opt-in
* Allow validator options to be more customisable.
* */
