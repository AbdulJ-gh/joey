import type { Logger } from '../../Logger';
import { asyncPollResponse, handleSystemError } from '../helpers';
import { Req } from '../Req';
import { Router, type ResolvedHandler, Context } from '../Router';
import type { Config } from '../config';


export class Dispatcher extends Router {
	constructor(routerContext: Router) {
		super();
		Object.assign(this, routerContext);
	}

	// public dispatch(resolvedHandler: ResolvedHandler, context: Context, logger: Logger): Promise<Response> {
	// 	return this.handleResponse(resolvedHandler, context, logger);
	// }

	// addEventListener cannot have an async handler, therefore this must be encapsulated in an async function and passed to event.respondWith()

	public handleResponse = async (
		resolvedHandler: ResolvedHandler,
		context: Context,
		logger: Logger
	): Promise<Response> => {
		const config = this.config as Required<Config>;
		try {
			const { handler, authenticate } = resolvedHandler;
			const handlerConfig = resolvedHandler.config;

			/** Do Middleware stuff - Untested */
			if (this.middleware.length > 0) {
				for (const ware of this.middleware) {
					const response = await asyncPollResponse(
						async () => await ware(context, logger), logger, context.waitUntil
					);
					if (response) return response;
				}
			}

			/** Do Authentication if needed */
			if (authenticate) {
				if (this.authenticator !== undefined) {
					const { authenticator }	= this;
					const authResponse = await asyncPollResponse(
						async () => await authenticator.authenticate(context, logger),
						logger,
						context.waitUntil
					);
					if (authResponse) return authResponse;
				}
			}

			/** Handle the request */
			if (handlerConfig?.extractBody !== false && config.extractBody) {
				if (config.extractBody !== 'content-type') {
					await Req.extractBody(context.req, config.extractBody);
				} else {
					const contentType = context.req.headers.get('content-type');
				}
			}
			const handledResponse = await asyncPollResponse(
				async () => await handler(context, logger), logger, context.waitUntil
			);
			if (handledResponse) return handledResponse;

			/** If handler did not return a response */
			return handleSystemError(
				context.waitUntil,
				config,
				logger,
				new Error('Handler did not return a valid response')
			);
		} catch (err) {
			return handleSystemError(context.waitUntil, config, logger, err);
		}
	};
}
