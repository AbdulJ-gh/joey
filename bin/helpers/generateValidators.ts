import Ajv, { JSONSchemaType } from 'ajv';
import AjvErrors from 'ajv-errors'
import fg from 'fast-glob';
import * as esbuild from 'esbuild';
import standaloneCode from 'ajv/dist/standalone/index.js';
import TempFile from './tempFile.js';
import { Worker } from '../types';

type ReturnType = {
	validatorsFile: string,
	schemaNames: string[],
}

export default async function generateValidators({ pattern, ignore }: Worker['schemas'], tempDir: string): Promise<ReturnType> {
// Recursively get file paths for all schema files based on `schemas` glob
	const importedSchemas: JSONSchemaType<unknown>[] = [];
	const schemaNames: string[] = [];
	const schemaPaths = fg.sync(pattern, {
		// gitignore: true,
		ignore: ['!node_modules', 'package.json', 'package-lock.json', ...ignore],
		absolute: true,
	});

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
		schemaNames.push(schemaFile.default.$id)
	}

	const ajv = AjvErrors(new Ajv({
		allErrors: true,
		schemas: importedSchemas,
		code: { source: true, esm: true },
		allowUnionTypes: true,
		// formats: // TODO - look in to
	}));

	return {
		validatorsFile: standaloneCode(ajv),
		schemaNames
	}
}
