import type { FetchRoutes } from '../types';
import type { FetchHandlers } from '../config'; //
import { ERRORS, throwBuildError } from '../errors';
import { Composer } from '../io';

export function generateFetchRoutes(fetchHandlers: FetchHandlers, schemaNames: string[]): FetchRoutes {
	const routes: FetchRoutes = {};

	Object.entries(fetchHandlers).forEach(([name, handler]) => {
		const { route, method } = handler;
		if (!routes[route]) { routes[route] = {}; }
		if (routes[route][method]) {
			throwBuildError(ERRORS.DUPLICATE_HANDLER(`${method.toUpperCase()} ${route}`));
			const params: Record<string, true> = {};
			route.split('/').forEach(d => {
				if (d.split(':')) {
					if (d.length === 1) {
						throwBuildError(ERRORS.ROUTE_PARAM_DOES_NOT_HAVE_A_KEY(name));
					}

					if (params[d]) {
						throwBuildError(ERRORS.ROUTE_PARAM_EXIST(name));
					}

					params[d] = true;
				}
			});
		}

		let validator = Composer.UNSAFE_OBJECT_OPEN;
		Object.entries(handler.schema).forEach(([type, schema]) => {
			if (!schemaNames.includes(schema)) {
				throwBuildError(ERRORS.CANNOT_FIND_SCHEMA(schema));
			}
			validator += `${type}: validators.${schema},`;
		});
		validator += Composer.UNSAFE_OBJECT_CLOSE;

		// ADD MIDDLEWARE AND VALIDATOR STUFF HERE
		routes[route][method] = {
			handler: Composer.UNSAFE_REF(name),
			route,
			config: handler.options || {},
			middleware: handler.middleware.map(Composer.UNSAFE_REF),
			validator
		};
	});

	return routes;
}
