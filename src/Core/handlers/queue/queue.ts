import type { QueueConsumer } from './types';
import { QueueContext } from './context';
import { processIsolate } from './isolate';
import { processAggregate } from './aggregate';

// TODO Queue and CfQueue are very different so will cause confusion, change names

export const queue: QueueConsumer = ({ tasks, logger }) => async (
	batch,
	env,
	ctx
): Promise<void> => {
	const task = tasks[batch.queue];
	if (task) {
		const context = new QueueContext(ctx, batch, env, logger);

		if (task.processMode === 'aggregate') {
			await processAggregate(context, task);
		}

		if (task.processMode === 'isolate') {
			for (const message of batch.messages) {
				await processIsolate(message, context, task);
			}
		}

		await task.handler(context);
	}
};
