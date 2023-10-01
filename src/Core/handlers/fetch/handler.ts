import type { FetchContext } from './context';
import type { RouteInfo, FetchMiddlewareHandler, ResponseLike, HandlerBodyType } from './types';
import { validationHandler } from './validator';

export async function executeHandlers(
	context: FetchContext,
	routeInfo: RouteInfo,
	globalMiddleware: FetchMiddlewareHandler[],
	reqBodyType: HandlerBodyType
): Promise<ResponseLike> {
	const { handler, middleware, validator } = routeInfo;

	/** Validate inputs */
	const validatorResponse = validationHandler(context, reqBodyType, validator);
	if (validatorResponse) {
		return validatorResponse;
	}

	/** Global middleware */
	for (const handler of globalMiddleware) {
		const response = await handler(context);
		if (response) return response;
	}

	/** Middleware */
	for (const handler of middleware) {
		const response = await handler(context);
		if (response) return response;
	}

	/** Handler */
	return (await handler(context));
}
