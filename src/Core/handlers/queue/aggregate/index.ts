import type { BatchTask } from '../types';
import type { QueueContext } from '../context';
import type { UnknownRecord } from '../../../types';
import { validateAggregate } from './validate';
import { handleAggregate } from './handle';

export async function processAggregate(context: QueueContext<UnknownRecord>, task: BatchTask): Promise<void> {
	await validateAggregate(context, task);
	await handleAggregate(context, task);
	context.batch.ackAll();
}
