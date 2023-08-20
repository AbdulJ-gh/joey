import type { ExportedHandlerQueueHandler } from '@cloudflare/workers-types';
import type { QueueContext } from './context';

export type QueueHandler<ENV = unknown, DEPS = unknown, MSG = unknown> = (
	context: QueueContext<ENV, DEPS, MSG>
) => Promise<void>|void;

export type QueueValidator = (body: unknown) => boolean;

export type BatchTask = {
	processMode: 'aggregate' | 'isolate' | 'manual';
	handler: QueueHandler;
	validator?: QueueValidator;
	deadLetterQueue?: string
}

export type MessageQueueTasks = Record<string, BatchTask>;
export type Logger = string;

type QueueProvider = {
	tasks: MessageQueueTasks;
	logger?: Logger;
};

export type QueueConsumer = (provider: QueueProvider) => ExportedHandlerQueueHandler;
