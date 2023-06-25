import type { MiddlewareHandler, RegisteredHandler, Config } from '../../types';
import type Context from '../../context';
import { Req } from '../../req';

function consolidateConfig(registeredHandler: RegisteredHandler, config: Config) {
	if (!registeredHandler.config) { registeredHandler.config = {}; }
	if (!registeredHandler.config.headers) { registeredHandler.config.headers = {}; }
	const headers = { ...config.headers, ...registeredHandler.config.headers };
	registeredHandler.config = { ...config, ...registeredHandler.config, headers };
}

function consolidateMiddleware(registeredHandler: RegisteredHandler, middleware: MiddlewareHandler[]) {
	if (!registeredHandler.middleware) { registeredHandler.middleware = []; }
	if (middleware.length > 0) {
		registeredHandler.middleware = [...middleware, ...registeredHandler.middleware];
	}
}

/** ---- Providing context ----
 * Combine config, headers(in config) and middleware
 * Parse path params and body
 */
export async function contextualiseHandler(
	registeredHandler: RegisteredHandler,
	globalConfig: Config,
	context: Context,
	middleware: MiddlewareHandler[]
) {
	// Adds base config to handler Config
	consolidateConfig(registeredHandler, globalConfig);
	// Adds base middleware to handler middleware
	consolidateMiddleware(registeredHandler, middleware);

	const { req } = context;
	const { path, config } = registeredHandler as RegisteredHandler<Config>;

	/** Contextualise req object */
	Req.parsePathParams(req, path, config.transformPathParams);
	Req.parseQueryParams(req, config.transformQueryParams);
	await Req.parseBody(req, config);
}
