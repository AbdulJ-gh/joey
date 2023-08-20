import type { Scheduled } from './types';
import { ScheduledContext } from './context';

export const scheduled: Scheduled = ({ jobs, logger }) =>
	async (controller, env, ctx): Promise<void> => {
		if (jobs[controller.cron]) {
			const context = new ScheduledContext(ctx, controller, env, logger);
			await jobs[controller.cron](context);
		}
	};


/** Example

interface ENV { someEnv: string; }
interface DEPS { 	someDep: string;}

const Deps: DEPS = { someDep: 'hello dep' };

const handler: ScheduledHandler<ENV, typeof Deps> = async ({
	controller,
	env,
	logger,
	deps = Deps,
	waitUntil,
	passThroughOnException
}) => {
	console.log(
		'--> controller, env, logger, deps, waitUntil, passThroughOnException',
		controller, env, logger, deps, waitUntil, passThroughOnException
	);

	console.log(deps.someDep);
};

 */
