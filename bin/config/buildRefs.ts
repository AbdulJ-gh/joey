import _ from 'lodash';
import { join } from 'path';
import type { Worker, HandlerRefs } from './types';
import type { Import } from '../types';


type HandlersRecord = Worker['handlers']['fetch'] | Worker['handlers']['scheduled'] | Worker['handlers']['queue']

export function buildRefs(handlers: Worker['handlers'], middleware: Worker['middleware']): HandlerRefs {
	// Instantiate data containers
	const rawHandlerNames: string[] = [];
	const handlerImports: Import[] = [];

	// Add middleware
	for (const [name, path] of Object.entries(middleware.handlers)) {
		rawHandlerNames.push(name);
		handlerImports.push({
			name: _.camelCase(name),
			path: './' + join(middleware.root, path)
		});
	}

	// Iterate function
	function iterateHandlers(handlersRecord: HandlersRecord): void {
		for (const [name, config] of Object.entries(handlersRecord)) {
			rawHandlerNames.push(name);
			handlerImports.push({
				name: _.camelCase(name),
				path: './' + join(handlers.root, config.src)
			});
		}
	}

	// Add handlers
	iterateHandlers(handlers.fetch);
	iterateHandlers(handlers.scheduled);
	iterateHandlers(handlers.queue);

	return { handlerImports, rawHandlerNames };
}
