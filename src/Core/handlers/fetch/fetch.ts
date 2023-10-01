import { Response, BodyInit } from '@cloudflare/workers-types';
import type { FetchCoordinator, Method } from './types';
import type { UnknownRecord } from '../../types';
import type { DefaultError } from '../../config/types';
import { FetchContext } from './context';
import { Req } from './req';
import { ConfigInstance } from '../../config';
import { executeHandlers } from './handler';
import { transformHandlerResponse } from './res';

export const fetch: FetchCoordinator = ({
	register,
	globalMiddleware,
	logger
}) => async (request, env, ctx): Promise<Response> => {
	// TODO - incorporate logger
	try {
		try {
			/** Resolve route */
			const fetchRoute = register.lookup(new URL(request.url).pathname, <Method>(request.method));
			const { item: routeInfo, allowedMethods } = fetchRoute;

			if (routeInfo) {
				/** Generate context */
				const req = new Req(request);
				const context = new FetchContext(ctx, req, env as UnknownRecord, logger);

				/** Parse request */
				Req.parsePathParams(req, routeInfo.route);
				const reqBodyType = await Req.parseBody(req);

				/** Process handler(s) */
				const response = await executeHandlers(context, routeInfo, globalMiddleware, reqBodyType);
				return transformHandlerResponse(response);
			}

			if (allowedMethods) {
				const response: DefaultError = ConfigInstance.defaultErrors.methodNotAllowed;
				if (ConfigInstance.options.emitAllowHeader && !response.headers?.allow) {
					(response.headers ?? {}).allow = allowedMethods.join(', ');
				}
				return transformHandlerResponse(response);
			}

			return transformHandlerResponse(ConfigInstance.defaultErrors.notFound);
			/** Return response after transforming */
		} catch (error) {
			/** Handle 500 case */
			const { status, body, headers } = ConfigInstance.defaultErrors.internalServerError;
			return new Response((body as BodyInit ?? null), { status, headers: headers ?? {} });
		}
	} catch (error) {
		/** Last ditch 500 response */
		console.log(error);
		return new Response('Something went wrong', { status: 500 });
	}
};
