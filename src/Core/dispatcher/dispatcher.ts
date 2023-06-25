import { contextualiseHandler, validateRequest, executeHandlers, transformResponse } from './helpers';
import type { MiddlewareHandler, RegisteredHandler, Config } from '../types';
import type Context from '../context';

export default class Dispatcher {
	public static async respond(
		context: Context,
		registeredHandler: RegisteredHandler,
		config: Config,
		middleware: MiddlewareHandler[]
	): Promise<Response> {
		// Pre-handler
		await contextualiseHandler(registeredHandler, config, context, middleware);
		validateRequest(registeredHandler, context);
		// During
		const handlerResponse = await executeHandlers(context, registeredHandler);
		// Post-handler
		return transformResponse(handlerResponse, registeredHandler.config as Config);
	}
}
