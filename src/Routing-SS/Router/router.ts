import { Authenticator, type AuthHandler } from '../Authenticator';
import { handleDefaultError } from '../helpers';
import { RouteMap } from '../Joey/joey';
import { Register } from '../Register';
import { Req } from '../Req';
import type { ResolvedHandler, Handler, Method, Middleware } from './types';
import type { Config } from '../config';

export class Router {
	protected config: Config = {};
	protected register = new Register();
	protected authenticator?: Authenticator;
	protected middleware: Middleware[] = [];
	public path = '/';

	public configure(config: Config): this {
		this.config = config;
		return this;
	}

	public use(middleware: Middleware[]): this;
	public use(middleware: Middleware): this;
	public use(middleware: Middleware | Middleware[]): this {
		Array.isArray(middleware) ? this.middleware.push(...middleware) : this.middleware.push(middleware);
		return this;
	}

	public auth(authHandler: AuthHandler): this {
		this.authenticator = new Authenticator(authHandler);
		return this;
	}

	public route(path: string, router: Router): this {
		this.register.registerRouter(path, router);
		return this;
	}

	// TODO - Refactor and/or abstract
	protected resolveHandler = (
		req: Req,
		config: Required<Config>,
		routeMap: RouteMap,
		reducer = '',
		globalPrefix = ''
	): ResolvedHandler => {
		// Set config
		const localConfig = { ...config, ...this.config };
		const { notFound, methodNotAllowed, prettifyJson } = localConfig;

		const { method, URL } = req as { method: Method, URL: URL };
		let name = Register.getName(URL.pathname, reducer);
		const exactPathMatch = this.register.matchRoute(name);

		/** 1. Look for the exact path and method */
		if (exactPathMatch && this.register.paths[exactPathMatch][method]) {
			const handler = this.register.paths[exactPathMatch][method] as ResolvedHandler;
			// exactPathMatch is the parameterized localPath only
			return {
				...handler,
				absolutePath: globalPrefix + exactPathMatch,
				config: localConfig
			};
		}

		/** 2. Check if valid router exists */
		if (name !== '/') {
			while (name.length > 0) {
				const matchedRouter = this.register.matchRoute(name, true);

				if (matchedRouter) {
					const router = this.register.routers[matchedRouter];
					return router.resolveHandler(
						req,
						localConfig,
						routeMap,
						reducer + name,
						globalPrefix + matchedRouter
					);
				}

				const dirs = name.split('/');
				name = name.slice(0, -1 - dirs[dirs.length - 1].length);
			}
		}

		/** 3. Check for base route router */
		if (this.register.routers['/']) {
			const router = this.register.routers['/'];
			return router.resolveHandler(req, localConfig, routeMap, reducer, globalPrefix);
		}

		/** 4. Check if path is valid but method not implemented */
		if (exactPathMatch) {
			const methodNotImplemented = handleDefaultError(methodNotAllowed, prettifyJson);
			if (methodNotImplemented.get.status === 405 && this.config?.emitAllowHeader === true) {
				const allowedMethods = Array.from(routeMap[globalPrefix + exactPathMatch]).join(', ');
				methodNotImplemented.headers.set('allow', allowedMethods);
			}

			return {
				handler: () => methodNotImplemented,
				authenticate: !!this.authenticator,
				routerContext: this,
				config: this.config // WHYYYY DOES IT NEED THIS IF IT'S OPTIONAL
			};
		}

		/** Return the default */
		return {
			handler: () => handleDefaultError(notFound, prettifyJson),
			authenticate: !!this.authenticator,
			routerContext: this,
			config: this.config
		};
	};

	// HTTP Methods
	private method(method: Method, route: string, ...args: unknown[]): this {
		const [arg1, arg2] = args;
		typeof arg1 === 'boolean'
			? this.register.registerMethod(this, method, route, arg2 as Handler, arg1)
			: this.register.registerMethod(this, method, route, arg1 as Handler);
		return this;
	}

	public get(route: string, authenticate: boolean, handler: Handler): this;
	public get(route: string, handler: Handler): this;
	public get(route: string, ...args: unknown[]) {
		return this.method('GET', route, ...args);
	}

	public post(route: string, authenticate: boolean, handler: Handler): this;
	public post(route: string, handler: Handler): this;
	public post(route: string, ...args: unknown[]) {
		return this.method('POST', route, ...args);
	}

	public put(route: string, authenticate: boolean, handler: Handler): this;
	public put(route: string, handler: Handler): this;
	public put(route: string, ...args: unknown[]) {
		return this.method('PUT', route, ...args);
	}

	public patch(route: string, authenticate: boolean, handler: Handler): this;
	public patch(route: string, handler: Handler): this;
	public patch(route: string, ...args: unknown[]) {
		return this.method('PATCH', route, ...args);
	}

	public delete(route: string, authenticate: boolean, handler: Handler): this;
	public delete(route: string, handler: Handler): this;
	public delete(route: string, ...args: unknown[]) {
		return this.method('DELETE', route, ...args);
	}

	public options(route: string, authenticate: boolean, handler: Handler): this;
	public options(route: string, handler: Handler): this;
	public options(route: string, ...args: unknown[]) {
		return this.method('OPTIONS', route, ...args);
	}
}
