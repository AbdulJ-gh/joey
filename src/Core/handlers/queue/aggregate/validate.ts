import type { BatchTask } from '../types';
import { validateIsolate } from '../isolate/validate';
import { QueueContext } from '../context';

export async function validateAggregate(context: QueueContext, task: BatchTask): Promise<void> {
	Object.assign(context.batch, {
		messages: context.batch.messages.filter(message => {
			return validateIsolate(message, task, context.env);
		})
	});
}
