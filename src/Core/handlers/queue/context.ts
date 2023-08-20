import type { ExecutionContext, MessageBatch } from '@cloudflare/workers-types';
import type { Logger } from './types';
import type { UnknownRecord } from '../../types';

interface IQueueContext<
	ENV extends UnknownRecord = UnknownRecord,
	DEPS extends UnknownRecord = UnknownRecord,
	MSG = unknown
> extends ExecutionContext {
	batch: MessageBatch;
	message: MSG;
	env: ENV;
	logger: Logger;
	deps: DEPS;
}

export class QueueContext<
	ENV extends UnknownRecord = UnknownRecord,
	DEPS extends UnknownRecord = UnknownRecord,
	MSG = unknown
> implements IQueueContext {
	public deps = <DEPS>{};
	public message = <MSG>null;
	public waitUntil = () => {};
	public passThroughOnException = () => {};

	constructor(
		ctx: ExecutionContext,
		public batch: MessageBatch,
		public env: ENV,
		public logger: Logger|'' = ''
	) {
		Object.setPrototypeOf(this, ctx);
	}

	public setMessage(message: unknown) {
		this.message = message as MSG;
	}
}

/** Example Aggregate Message Handler

interface Env { someEnv: string; }
interface Deps { 	someDep: string;}
const dependencies: Deps = { someDep: 'hello dep' };

const aggregateHandler: QueueHandler<Env, Deps> = async ({
	batch: { messages },
	env,
	logger,
	deps = dependencies,
	waitUntil,
	passThroughOnException
}) => {
	console.log(
		'--> messages, env, logger, deps, waitUntil, passThroughOnException',
		messages, env, logger, deps, waitUntil, passThroughOnException
	);

	console.log(deps.someDep);
	console.log(messages.map(message => message.body));
};

*/

/** Example Isolate Message Handler

const isolateHandler: QueueHandler<Env, Deps, Message> = async ({
	message,
	env,
	logger,
	deps = dependencies,
	waitUntil,
	passThroughOnException
}) => {
	console.log(
		'--> message, env, logger, deps, waitUntil, passThroughOnException',
		message, env, logger, deps, waitUntil, passThroughOnException
	);

	console.log(deps.someDep);
	console.log(message.body);
};

*/

/** Example Manual Message Handler

const manualHandler: QueueHandler<Env, Deps, Message> = async ({
	batch,
	env,
	logger,
	deps = dependencies,
	waitUntil,
	passThroughOnException
}) => {
	console.log(
		'--> message, env, logger, deps, waitUntil, passThroughOnException',
		batch, env, logger, deps, waitUntil, passThroughOnException
	);

	console.log(deps.someDep);
	console.log(batch.messages.map(message => message.body));
	batch.ackAll();
};

*/
