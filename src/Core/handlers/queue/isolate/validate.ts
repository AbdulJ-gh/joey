import type { Message, Queue } from '@cloudflare/workers-types';
import type { BatchTask } from '../types';
import type { UnknownRecord } from '../../../types';

export async function validateIsolate(message: Message, task: BatchTask, env: UnknownRecord): Promise<boolean> {
	const { validator, deadLetterQueue } = task;
	if (validator && !validator(message.body)) {
		if (deadLetterQueue && env[deadLetterQueue]) {
			await (<Queue>env[deadLetterQueue]).send({
				reason: 'Invalid message',
				attachment: message
			});
		}
		return false;
	}
	return true;
}
