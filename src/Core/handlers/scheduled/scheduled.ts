import type { Scheduled } from './types';
import { ScheduledContext } from './context';

export const scheduled: Scheduled = ({ jobs, logger }) => async (
	controller,
	env,
	ctx
): Promise<void> => {
	if (jobs[controller.cron]) {
		const context = new ScheduledContext(ctx, controller, env, logger);
		await jobs[controller.cron](context);
	}
};


/** Example

 interface Env { someEnv: string; }
interface Deps { 	someDep: string;}
const dependencies: Deps = { someDep: 'hello dep' };

const handler: ScheduledHandler<Env, Deps> = async ({
	controller,
	env,
	logger,
	deps = dependencies,
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
