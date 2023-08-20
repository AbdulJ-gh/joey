import type { ExportedHandlerQueueHandler, ExecutionContext } from '@cloudflare/workers-types';


export type QueueTaskBatch = ExportedHandlerQueueHandler
export type QueueTask = (message: unknown, env: unknown, ctx: ExecutionContext) => Promise<void>

export type QueueContext = {
	task: QueueTask
	logger?: string
}

type Queue = (context: QueueContext) => ExportedHandlerQueueHandler;

export const queue: Queue = ({ task, logger }) => async (
	batch,
	env,
	ctx
): Promise<void> => {
	console.log(logger, batch, env, ctx);

	for (const t of batch) {
		await t();
	}

	await task(batch, env, ctx);
};
