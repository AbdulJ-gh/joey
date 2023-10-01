import type { QueueCoordinator } from './types';
import type { UnknownRecord } from '../../types';
import { QueueContext } from './context';
import { processIsolate } from './isolate';
import { processAggregate } from './aggregate';


export const queue: QueueCoordinator = ({	tasks, logger }) => async (batch, env, ctx): Promise<void> => {
	const task = tasks[batch.queue];
	if (task) {
		const context = new QueueContext<UnknownRecord>(ctx, batch, env as UnknownRecord, logger);

		if (task.processMode === 'aggregate') {
			await processAggregate(context, task);
		}

		if (task.processMode === 'isolate') {
			for (const message of batch.messages) {
				await processIsolate(message, context, task);
			}
		}

		if (task.processMode === 'manual') {
			await task.handler(context);
		}
	}
};
