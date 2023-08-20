import type { Message } from '@cloudflare/workers-types';
import type { BatchTask } from '../types';
import { validateIsolate } from './validate';
import { handleIsolate } from './handle';
import { QueueContext } from '../context';

export async function processIsolate(message: Message, context: QueueContext, task: BatchTask) {
	if (await validateIsolate(message, task, context.env)) {
		await handleIsolate(message, task, context);
	}
	message.ack();
}
