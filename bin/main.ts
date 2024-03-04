import { mkdtempSync } from 'fs';
import { tmpdir } from 'os';
import { getWorkerConfig } from './config';
import { Composer, type AppData, joeyLog } from './io';
import { finalBuild } from './build';
import { generateValidators, generateFetchRoutes, generateScheduledJobs, generateQueueTasks } from './helpers';

async function main() {
	/** Get and validate worker configuration */
	const tempDir = mkdtempSync(tmpdir());
	const { worker, handlerRefs } = getWorkerConfig(tempDir);
	const { global: { options, middleware, defaultErrors }, handlers, schemas, logger, build } = worker;

	/** Generate validators */
	joeyLog('Generating schema validators');
	const { schemaNames, validators } = await generateValidators(schemas, tempDir);

	/** Create routes */
	joeyLog('Creating fetch routes');
	const fetch = generateFetchRoutes(handlers.fetch, schemaNames);

	/** Create scheduledJobs */
	joeyLog('Creating scheduled jobs');
	const cronJobs = generateScheduledJobs(handlers.scheduled);

	/** Create scheduledJobs */
	joeyLog('Creating queue tasks');
	const queueTasks = generateQueueTasks(handlers.queue, schemaNames);

	/** Compile app */
	joeyLog('Composing application');
	const appData: AppData = {
		handlerRefs,
		config: { options, defaultErrors },
		validatorsPath: validators,
		loggerPath: logger,
		handlers: { fetch, cronJobs, queueTasks, middleware: middleware.map(Composer.UNSAFE_REF) }
	};

	const app = new Composer(tempDir, appData);

	/** Final build with esbuild */
	joeyLog('Compiling code...');
	finalBuild(app.read(), build, tempDir);
}

export default main;
