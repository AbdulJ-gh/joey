import type { QueueHandlers } from '../config';
import type { QueueTasks } from '../types';
import { ERRORS, throwBuildError } from '../errors';
import { Composer } from '../io';

export function generateQueueTasks(queueHandlers: QueueHandlers, schemaNames: string[]): QueueTasks {
	const queueTasks: QueueTasks = {};

	Object.entries(queueHandlers).forEach(([name, task]) => {
		queueTasks[name] = {
			processMode: task.processMode,
			handler: Composer.UNSAFE_REF(name),
			deadLetterQueue: task.deadLetterQueue
		};

		const { validator } = task;
		if (validator) {
			if (!schemaNames.includes(validator)) {
				throwBuildError(ERRORS.CANNOT_FIND_SCHEMA(validator));
			}
			queueTasks[name].validator = `validators.${Composer.UNSAFE_REF(validator)}`;
		}
	});

	return queueTasks;
}
