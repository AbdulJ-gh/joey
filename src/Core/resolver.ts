import type Register from './register';
import type { Req } from './req';
import type { RegisteredHandler, Config } from './types';

export function resolveHandler(
	req: Req,
	config: Config,
	register: Register<RegisteredHandler>
): RegisteredHandler {
	const [path, method] = [req.url.pathname, req.method];
	const lookup = register.lookup(path, method);

	const baseValues = {
		path: '',
		config: {},
		middleware: []
	};

	if (lookup.item) { return lookup.item; }

	if (lookup.pathFound) {
		const headers = config.methodNotAllowed.headers ?? {};
		if (config.emitAllowHeader) {
			headers.allow = lookup.allowedMethods.join(', ');
		}
		return { handler: () => ({ ...config.methodNotAllowed, headers }), ...baseValues };
	}

	return { handler: () => config.notFound, ...baseValues };
}
