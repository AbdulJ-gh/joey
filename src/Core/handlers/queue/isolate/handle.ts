import type { Message, Queue } from '@cloudflare/workers-types';
import type { BatchTask } from '../types';
import { QueueContext } from '../context';

export async function handleIsolate(
	message: Message,
	task: BatchTask,
	context: QueueContext
): Promise<void> {
	const { handler, deadLetterQueue } = task;
	context.setMessage(message);

	try {
		await handler(context);
	} catch (error) {
		if (context.env[deadLetterQueue]) {
			await (context.env[deadLetterQueue] as Queue).send({
				reason: 'Message processor threw error',
				attachment: message,
				error
			});
		}
	}
}
