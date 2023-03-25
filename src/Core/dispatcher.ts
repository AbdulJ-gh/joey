import type { AsyncHandler, Handler, MiddlewareHandler, ResolvedHandler, ResponseLike, Validator } from './types';
import { sizeLimit, getBodyType, validateHandler, generateResponse } from './helpers';
import type Context from './context';
import { Req } from './req';
import type { Config } from './config';


export default class Dispatcher {
	private static async executeHandlers(
		context: Context,
		handler: Handler,
		middleware: MiddlewareHandler[],
		config: Config,
		validator?: Validator
	): Promise<ResponseLike> {
		const sizeLimitResponse = sizeLimit(context.req.url, config);
		if (sizeLimitResponse) return sizeLimitResponse;
		if (validator) {
			const bodyType = getBodyType(context.req.body || null);
			const response = validateHandler(validator, context, bodyType, config);
			if (response) return response;
		}

		if (middleware.length > 0) {
			for (const ware of middleware) {
				const response = await ware(context);
				if (response) return response;
			}
		}
		return await (<AsyncHandler>handler)(context); // Weird but does no work if not returned awaited? // TODO, verify
	}

	public static async respond(
		resolvedHandler: ResolvedHandler,
		context: Context,
		config: Config,
		middleware: MiddlewareHandler[]
	): Promise<Response> {
		const { handler, path, config: handlerConfig, middleware: handlerMiddleware, validator } = resolvedHandler;

		const combinedHeaders = handlerConfig?.headers
			? { ...config.headers, ...handlerConfig.headers }
			: config.headers;

		const combinedConfig = !handlerConfig
			? config
			: {
				...config,
				...handlerConfig,
				headers: combinedHeaders
			};

		const combinedMiddleware = handlerMiddleware ? [...middleware, ...handlerMiddleware] : middleware;

		Req.parsePathParams(context.req, path);
		combinedConfig.parseBody && (await Req.parseBody(context.req, combinedConfig.parseBody));
		const handlerResponse = await this.executeHandlers(
			context, handler, combinedMiddleware, combinedConfig, validator
		);

		return generateResponse(handlerResponse, combinedConfig);
	}
}
