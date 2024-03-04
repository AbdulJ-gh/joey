import { join } from 'path';
import { fileURLToPath } from 'url';
import _ from 'lodash';
import { TempFile } from '.';
import type { HandlerRefs, Worker } from '../config/types';
import { CronJobs, FetchRoutes, QueueTasks } from '../types';
import { ERRORS, throwBuildError } from '../errors';

type Import = { name: string, path: string };

export type AppData = {
	handlerRefs: HandlerRefs;
	config: Omit<Worker['global'], 'middleware'>
	validatorsPath: string,
	loggerPath?: string,
	handlers: {
		middleware: string[],
		fetch: FetchRoutes,
		cronJobs: CronJobs,
		queueTasks: QueueTasks,
	}
}

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export class Composer {
	private tmpAppFile: TempFile;

	constructor(tmpDir: string, appData: AppData) {
		this.tmpAppFile = new TempFile(tmpDir, 'app.js');
		this.initialWrite(appData);
		this.cleanUp(appData.handlerRefs.rawHandlerNames, appData.handlers.queueTasks);
	}

	/* GENERAL IO */
	private write = (line: string, lineEnding = ';') => {
		this.tmpAppFile.write(`${line}${lineEnding}`);
	};

	public read = () => this.tmpAppFile.read();

	public replace = (search: string, replace: string) => {
		const file = this.tmpAppFile.read();
		const update = file.replaceAll(search, replace);
		this.tmpAppFile.overwrite(update);
	};

	/* UNSAFE DECLARATIONS */
	private static UNSAFE_OO = '__UNSAFE_OBJECT_OPEN__';
	private static UNSAFE_OC = '__UNSAFE_OBJECT_CLOSE__';
	private static UNSAFE = '__UNSAFE_REF__';
	public static UNSAFE_OBJECT_OPEN = `${this.UNSAFE_OO}{`;
	public static UNSAFE_OBJECT_CLOSE = `}${this.UNSAFE_OC}`;
	public static UNSAFE_REF(name: string): string {
		return `${Composer.UNSAFE}${name}`;
	}

	/* CLEANING */
	private replaceUnsafeRef(unsafeRef: string) {
		this.replace(`"${Composer.UNSAFE}${unsafeRef}"`, _.camelCase(unsafeRef));
	}

	private replaceUnsafeObjects = () => {
		this.replace(`"${Composer.UNSAFE_OO}`, '');
		this.replace(`${Composer.UNSAFE_OC}"`, '');
	};

	private cleanUp = (handlerNames: string[], queueTasks: QueueTasks) => {
		handlerNames.forEach(name => {
			this.replaceUnsafeRef(name);
		});

		Object.values(queueTasks).forEach(task => {
			if (task.validator) { this.replaceUnsafeRef(task.validator); }
		});

		this.replaceUnsafeObjects();

		if (this.read().includes(Composer.UNSAFE)) {
			throwBuildError(ERRORS.MISSING_MIDDLEWARE_DECLARATION);
		}
	};

	/* COMPOSE APP */
	private importModule = ({ name, path }: Import) => {
		this.write(`import ${name} from '${path}'`);
	};

	public initialWrite = ({
		handlerRefs,
		config,
		validatorsPath,
		loggerPath,
		handlers
	}: AppData) => {
		this.write('import Joey from \'joeycf\'');
		this.write(`\nimport * as validators from '${validatorsPath}'`);
		handlerRefs.handlerImports.forEach(this.importModule);

		if (loggerPath) {
			this.write('\nimport { Logger } from \'joeycf/Logger\'');
			this.importModule({ name: 'logger', path: loggerPath });
			this.write(
				'const loggerInit = (logger,incomingEvent,ctx,env)=>Logger[\'init\'](logger,incomingEvent,ctx,env)'
			);
		} else {
			this.write('\nlet logger, loggerInit');
		}

		if (Object.keys(handlers.fetch).length > 0) {
			this.write(`import { fetch as fetchModule } from '${join(__dirname, '../src/core/handlers/fetch')}'`);
		} else {
			this.write('const fetchModule = null');
		}

		if (Object.keys(handlers.queueTasks).length > 0) {
			this.write(`import { queue as queueModule } from '${join(__dirname, '../src/core/handlers/queue')}'`);
		} else {
			this.write('const queueModule = null');
		}

		if (Object.keys(handlers.cronJobs).length > 0) {
			this.write(
				`import { scheduled as scheduledModule  } from '${join(__dirname, '../src/core/handlers/scheduled')}'`
			);
		} else {
			this.write('const scheduledModule = null');
		}

		this.write('const modules = { fetch: fetchModule, queue: queueModule, scheduled: scheduledModule, logger }');
		this.write(`\nconst config = ${JSON.stringify(config)}`);
		this.write(`\nconst handlers = ${JSON.stringify(handlers)}`);
		this.write('\nconst { fetch, queue, scheduled } = new Joey({ handlers, config, modules, loggerInit })');
		this.write('\nexport default { fetch, queue, scheduled  }');
	};
}
