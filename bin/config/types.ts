import { Import, ProcessMode } from '../types';

type ValidatorType = 'path' | 'query' | 'body'

type FetchHandler = {
	method: string;
	route: string;
	src: string;
	middleware: string[];
	schema: Record<ValidatorType, string>
	options?: Record<string, unknown>;
}

type ScheduledHandler = {
	cron: string;
	src: string;
}

type QueueHandler = {
	processMode: ProcessMode
	src: string;
	validator?: string;
	deadLetterQueue?: string
}

export type FetchHandlers = Record<string, FetchHandler>
export type ScheduledHandlers = Record<string, ScheduledHandler>
export type QueueHandlers = Record<string, QueueHandler>


export type Worker = {
	version: string
	logger?: string;
	schemas: {
		include: string | string[];
		exclude: string | string[];
	},
	build: {
		outDir: string,
		filename: string,
		sourcemaps: boolean,
		watch: boolean,
		minify: boolean
	};
	middleware: {
		root: string;
		handlers: Record<string, string>;
	}
	global: {
		middleware: string[];
		options: Record<string, unknown>;
		defaultErrors: Record<string, unknown>;
	}
	handlers: {
		root: string;
		fetch: FetchHandlers,
		scheduled: ScheduledHandlers,
		queue: QueueHandlers,
	}
}

export type HandlerRefs = {
	handlerImports: Import[];
	rawHandlerNames: string[];
}

export type WorkerConfig = {
	worker: Worker;
	handlerRefs: HandlerRefs;
}
