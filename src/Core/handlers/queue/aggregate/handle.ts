import type { Message, Queue } from '@cloudflare/workers-types';
import type { BatchTask } from '../types';
import type { QueueContext } from '../context';
import type { UnknownRecord } from '../../../types';
import { generateToken } from '../../../../Crypto';

export async function handleAggregate(
	context: QueueContext<UnknownRecord>,
	task: BatchTask
): Promise<void> {
	const { handler, deadLetterQueue } = task;
	try {
		await handler(context);
	} catch (error) {
		if (deadLetterQueue && context.env[deadLetterQueue]) {
			const batchId = generateToken(32);
			const mapFn = (message: Message) => ({
				body: {
					reason: 'Aggregate message processor threw error',
					attachment: message,
					batchId,
					error
				}
			});
			await (<Queue>context.env[deadLetterQueue]).sendBatch(context.batch.messages.map(mapFn));
		}
	}
}
