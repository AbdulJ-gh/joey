import type { Message, Queue } from '@cloudflare/workers-types';
import type { BatchTask } from '../types';
import { QueueContext } from '../context';
import { generateToken } from '../../../../Crypto';

export async function handleAggregate(context: QueueContext, task: BatchTask): Promise<void> {
	const { handler, deadLetterQueue } = task;
	try {
		await handler(context);
	} catch (error) {
		if (context.env[deadLetterQueue]) {
			const batchId = generateToken(32);
			const mapFn = (message: Message) => ({
				body: {
					reason: 'Batch message processor threw error',
					attachment: message,
					batchId,
					error
				}
			});
			await (context.env[deadLetterQueue] as Queue).sendBatch(context.batch.messages.map(mapFn));
		}
	}
}
