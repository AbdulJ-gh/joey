import type { Message, Queue } from '@cloudflare/workers-types';
import type { BatchTask } from '../types';
import type { QueueContext } from '../context';
import type { UnknownRecord } from '../../../types';

export async function handleIsolate(
	message: Message,
	task: BatchTask,
	context: QueueContext<UnknownRecord>
): Promise<void> {
	const { handler, deadLetterQueue } = task;
	context.setMessage(message);
	try {
		await handler(context);
	} catch (error) {
		if (deadLetterQueue && context.env[deadLetterQueue]) {
			await (<Queue>context.env[deadLetterQueue]).send({
				reason: 'Message processor threw error',
				attachment: message,
				error
			});
		}
	}
}
