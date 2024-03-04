import _ from 'lodash';
import { ERRORS, throwBuildError } from '../errors';
import type { Worker } from './types';

export function manualChecks(handlers: Worker['handlers'], handlerNames: string[]) {
	// At least one handler included of any type
	const includesHandler = Object
		.values(handlers)
		.some(option => typeof option !== 'string' && Object.keys(option).length > 0);

	if (!includesHandler) {
		throwBuildError(ERRORS.MISSING_HANDLER);
	}

	// Get method fetch handler cannot have a body schema
	const getHandlerHasBody = Object
		.values(handlers.fetch)
		.some(handler => handler.method.toLowerCase() === 'get' && handler.schema.body !== undefined);

	if (getHandlerHasBody) {
		throwBuildError(ERRORS.GET_HANDLER_HAS_BODY);
	}

	// No handler of any kind can have the same name
	const nameSet = new Set();
	const camelCaseNameSet = new Set();

	for (let i = 0; i < handlerNames.length; i++) {
		nameSet.add(handlerNames[i]);
		camelCaseNameSet.add(_.camelCase(handlerNames[i]));

		if (nameSet.size !== i + 1) {
			throwBuildError(ERRORS.DUPLICATE_HANDLER_NAME(handlerNames[i]));
		}

		if (camelCaseNameSet.size !== i + 1) {
			throwBuildError(ERRORS.DUPLICATE_CAMEL_CASE_HANDLER_NAME(handlerNames[i]));
		}
	}
}


/* TODO:
* Could be doing more verifications, such as:
* Ensure no route pattern appears twice even with different param names E.g. /:id and /:name cannot coexist)
* Check no route pattern uses the same param twice E.g. /user/:id/org/:id, it sh/could be /user/:id/org/:orgId)
* */
