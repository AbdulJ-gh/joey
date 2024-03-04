import { join } from 'path';
import { readdirSync, readFileSync } from 'fs';
import { parse as parseYaml } from 'yaml';
import { ERRORS, throwBuildError } from '../errors';
import type { Worker, WorkerConfig } from './types';
import { validateWorker } from './validateWorker';
import { buildRefs } from './buildRefs';
import { manualChecks } from './manualChecks';
import { joeyLog } from '../io';

export function getWorkerConfig(tempDir: string): WorkerConfig {
	let worker: Worker | undefined;
	const dir = process.cwd();
	const configs = readdirSync(dir).filter(file => file.startsWith('worker.'));
	try {
		if (configs.includes('worker.json')) {
			worker = <Worker>JSON.parse(readFileSync(join(dir, 'worker.json'), 'utf8'));
		} else if (configs.includes('worker.yaml')) {
			worker = <Worker>parseYaml(readFileSync(join(dir, 'worker.yaml'), 'utf8'));
		} else if (configs.includes('worker.yml')) {
			worker = <Worker>parseYaml(readFileSync(join(dir, 'worker.yml'), 'utf8'));
		}
	} catch (err) {
		console.error(err);
		throwBuildError(ERRORS.PARSING_FAILURE);
	}

	if (!worker) {
		throw throwBuildError(ERRORS.NO_FILE);
	}

	joeyLog('Validating worker config');
	validateWorker(worker, tempDir);

	joeyLog('Building refs');
	const handlerRefs = buildRefs(worker.handlers, worker.middleware);

	joeyLog('Performing additional checks');
	manualChecks(worker.handlers, handlerRefs.rawHandlerNames);

	joeyLog('Worker config validated ✅\t');

	return { worker, handlerRefs };
}
