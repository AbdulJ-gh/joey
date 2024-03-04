import { spawnSync } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';
import _ from 'lodash';
import { ERRORS, throwBuildError } from '../errors';
import { TempFile } from '../io';
import type { Worker } from './types';

type AjvChange = {
	op: string,
	path: string,
	value: unknown
};

export function validateWorker(worker: Worker, tmpDir: string): void {
	const workerFile = new TempFile(tmpDir, 'worker.json', JSON.stringify(worker));
	// __dirname  Gets the dirname of this file within the execution context of the script
	const __dirname = fileURLToPath(new URL('.', import.meta.url));

	const validateWorker = spawnSync('ajv', [
		'validate',
		'-r', join(__dirname, './schemas/refs/*.json'),
		'-s', join(__dirname, './schemas/worker.json'),
		'-d', workerFile.path,
		'--use-defaults',
		'--strict=true',
		'--allow-matching-properties',
		'--all-errors',
		'--errors=json',
		'--allow-union-types',
		'--changes=json'
	]);

	// Uncomment to debug
	// console.log(validateWorker.stderr.toString('utf-8'));

	// This will pick up errors from the validation itself but not errors in the underlying code here
	if (validateWorker.status !== 0) {
		const message = validateWorker.stderr.toString('utf8');
		if (message.includes('invalid')) {
			process.stderr.write(message.split('invalid')[1]);
		}
		throwBuildError(ERRORS.INVALID_WORKER_CONFIG);
	}

	// Updates worker in place with defaults
	const changes: AjvChange[] = JSON.parse(validateWorker.output.toString()
		.split('changes:')[1]
		.slice(0, -1));

	changes.forEach(({ op, path, value }) => {
		if (op === 'add') {
			const paths = path.slice(1).split('/');
			_.set(worker, paths, value);
		}
	});
}
