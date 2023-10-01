import type {	Response as CfResponse } from '@cloudflare/workers-types';
import { contextualiseHandler, validateRequest, executeHandlers, transformResponse } from './helpers';
import type { MiddlewareHandler, RegisteredHandler, Config } from '../types';
import type Context from '../context';

export default class Dispatcher {
	public static async respond(
		context: Context,
		registeredHandler: RegisteredHandler,
		config: Config,
		middleware: MiddlewareHandler[]
	): Promise<CfResponse> {
		// Pre-handler
		await contextualiseHandler(registeredHandler, config, context, middleware);
		validateRequest(registeredHandler, context); // TODO - test, looks like we are not capturing this and returning it
		// During
		const handlerResponse = await executeHandlers(context, registeredHandler);
		// Post-handler
		return transformResponse(handlerResponse, registeredHandler.config as Config) as unknown as CfResponse;
	}
}
