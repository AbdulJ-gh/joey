import type { BatchTask } from '../types';
import { QueueContext } from '../context';
import { validateAggregate } from './validate';
import { handleAggregate } from './handle';

export async function processAggregate(context: QueueContext, task: BatchTask) {
	await validateAggregate(context, task);
	await handleAggregate(context, task);
	context.batch.ackAll();
}
