import type { BatchTask } from '../types';
import type { QueueContext } from '../context';
import type { UnknownRecord } from '../../../types';
import { validateIsolate } from '../isolate/validate';

export async function validateAggregate(context: QueueContext<UnknownRecord>, task: BatchTask): Promise<void> {
	Object.assign(context.batch, {
		messages: context.batch.messages.filter(message => {
			return validateIsolate(message, task, context.env);
		})
	});
}
