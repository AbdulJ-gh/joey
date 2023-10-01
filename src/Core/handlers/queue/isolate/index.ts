import type { Message } from '@cloudflare/workers-types';
import type { BatchTask } from '../types';
import type { QueueContext } from '../context';
import type { UnknownRecord } from '../../../types';
import { validateIsolate } from './validate';
import { handleIsolate } from './handle';

export async function processIsolate(
	message: Message,
	context: QueueContext<UnknownRecord>,
	task: BatchTask
): Promise<void> {
	if (await validateIsolate(message, task, context.env)) {
		await handleIsolate(message, task, context);
	}
	message.ack();
}
