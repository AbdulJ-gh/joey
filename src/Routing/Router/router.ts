import { Res } from '../Res';
import { Responder } from '../Responder';
import { ErrorType } from '../Res/types';
import { AuthData, AuthHandler, Context, Handler, Method, Register, Req, ResolvedHandler } from './types';
import { DefaultError } from '../../Utilities/general/statuses';
import { JoeyConfig as Config, baseConfig } from './index';

export class Router {
	private register: Register = { paths: {}, routers: {} };
	private config: Config = baseConfig;
	private authData: AuthData = null;
	private req: Req = new Request('');
	private res: Res = new Res();
	private authHandler: AuthHandler = () => null;

	constructor() {
		// constructor() {
		addEventListener('fetch', (event: FetchEvent): void => {
			this.configure(this.config);
			const { body, status, headers, prettifyJson } = this.config;

			this.req = event.request;
			this.res = new Res().set({ body, status, headers, pretty: prettifyJson });

			// Then find the correct handler and context
			event.respondWith(this.handleResponse(this.resolveHandler(event, this.res)));
		});
	}

	/** Config */
	public configure(config: Partial<Config>): this {
		this.config = { ...baseConfig, ...config };
		return this;
	}

	/** Resolving methods */
	/** Resolver
	 * This method finds the handler, first checking an exact path, then the routers
	 * */
	private resolveHandler(event: FetchEvent, res: Res, reducer = ''): ResolvedHandler {
		const { method, url } = event.request;
		const route = new URL(url).pathname;

		const reducedName = this.getRegisteredName(route.slice(reducer.length));
		const exactPathMatch = this.matchRoute(reducedName);

		/** 1. Look for the exact path and method */
		if (exactPathMatch && this.register.paths[exactPathMatch][method as Method]) {
			return this.register.paths[exactPathMatch][method as Method] as ResolvedHandler;
		}

		/** 2. Check if valid router exists */
		if (reducedName !== '__base_route') {
			let name = reducedName;

			while (name.length > 0) {
				const matchedRouter = this.matchRoute(name, true);

				if (matchedRouter && this.register.routers[matchedRouter]) {
					return this.register.routers[matchedRouter].resolveHandler(event, res, reducer + name);
				}

				const dirs = name.split('/');
				name = name.slice(0, -1 - dirs[dirs.length - 1].length);
			}
		}

		/** 3. Check if path is valid but method not implemented */
		if (exactPathMatch) {
			const methodNotAllowed = this.handleError(this.config.methodNotAllowed);
			if (this.config.emitAllowHeader) {
				methodNotAllowed.headers.set('Allow', Object.keys(this.register.paths[exactPathMatch]).join(', '));
			}
			return { handler: () => methodNotAllowed, authenticate: false, RouterContext: this };
		}

		/** 4. Return the default */
		return {
			handler: () => this.handleError(this.config.notFound),
			authenticate: false,
			RouterContext: this
		};
	}

	private matchRoute(route: string, isRouter = false) {
		return Object.keys(this.register[isRouter ? 'routers' : 'paths']).find(path => {
			const regex = path.replace(/:[^/]+/g, '[^/]+').concat('$');
			return route.match(regex) || null;
		});
	}

	// Handle the request
	// addEventListener cannot have an async handler, therefore this must be encapsulated in an async function and passed to event.respondWith()
	private handleResponse = async (resolvedHandler: ResolvedHandler): Promise<Response> => {
		const { handler, authenticate, RouterContext } = resolvedHandler;
		try {
			// Get context
			const context: Context = { req: this.req, res: this.res };

			// Authenticate
			if (authenticate) {
				const authenticated = await RouterContext.authenticate();
				if (authenticated instanceof Response) return authenticated;
				if (!authenticated) return Responder.handleError(this.handleError(this.config.unauthorized));
			}

			// Handle the request
			const handledResponse: Res | Response | void = await handler(context);
			if (handledResponse === undefined) {
				return this.handleError(this.config.handlerDidNotReturn);
			}

			// Return response to event.respondWith
			if (handledResponse instanceof Res) {
				return handledResponse.isError
					? Responder.handleError(handledResponse)
					: new Responder(handledResponse).respond();
			}
			return handledResponse;
		} catch (error) {
			return Responder.handleError(error);
		}
	};

	private handleError(defaultError: DefaultError, error?: ErrorType, additionalData?: Record<string, unknown>): Response {
		if (typeof defaultError === 'number') {
			return Responder.handleError(new Res().error(defaultError));
		} else {
			// TODO - unused props
			const { status, body, error, additionalData } = defaultError;
			return Responder.handleError(new Res().error(status, body));
		}
	}


	/** Middleware */
	public logger(logger: (ctx: Context) => void): this {
		const consoleLog = console.log;
		console.log = () => {
			logger({ req: this.req, res: this.res });
			consoleLog();
		};


		return this;
	}

	/** Auth methods */
	public auth(authHandler: AuthHandler): this {
		this.authHandler = authHandler;
		return this;
	}

	private async authenticate(): Promise<Response | boolean> {
		try {
			const authResponse = await this.authHandler({ req: this.req, res: this.res });
			if (authResponse instanceof Res) return new Responder(authResponse).respond();
			if (authResponse instanceof Response) return authResponse;
			this.authData = authResponse;
			if (this.authData) this.req.authData = this.authData;
			return this.authData !== false; // If authData === null, this returns true and allows the request to proceed unauthenticated, as wanted
		} catch (error) {
			return Responder.handleError(this.handleError(400, error as Error)); // TODO - review
		}
	}

	private getRegisteredName(routeName: string): string {
		if (routeName === '' || routeName === '/') return '__base_route';
		let route = routeName;
		if (routeName.endsWith('/')) route = route.slice(0, -1);
		if (!routeName.startsWith('/')) route = '/'.concat(route);
		return route;
	}

	private registerMethod(method: Method, route: string, handler: Handler, authenticate = true) {
		const registeredName = this.getRegisteredName(route);
		if (!this.register.paths[registeredName]) this.register.paths[registeredName] = {};
		this.register.paths[registeredName][method] = { handler, authenticate, RouterContext: this };
	}

	public route(path: string, router: Router): this {
		// No error thrown if route already exists, it is overwritten.
		this.register.routers[path] = router;
		return this;
	}

	/** HTTP Method methods */
	private method(method: Method, ...args: unknown[]): this {
		const [route, arg1, arg2] = args;
		typeof arg1 === 'boolean' ?
			this.registerMethod(method, route as string, arg2 as Handler, arg1) :
			this.registerMethod(method, route as string, arg1 as Handler);
		return this;
	}
	// GET
	public get(route: string, authenticate: boolean, handler: Handler): this;
	public get(route: string, handler: Handler): this;
	public get(...args: unknown[]): this {
		return this.method('GET', ...args);
	}
	// POST
	public post(route: string, authenticate: boolean, handler: Handler): this;
	public post(route: string, handler: Handler): this;
	public post(...args: unknown[]): this {
		return this.method('POST', ...args);
	}
	// PUT
	public put(route: string, authenticate: boolean, handler: Handler): this;
	public put(route: string, handler: Handler): this;
	public put(...args: unknown[]): this {
		return this.method('PUT', ...args);
	}
	// PATCH
	public patch(route: string, authenticate: boolean, handler: Handler): this;
	public patch(route: string, handler: Handler): this;
	public patch(...args: unknown[]): this {
		return this.method('PATCH', ...args);
	}
	// DELETE
	public delete(route: string, authenticate: boolean, handler: Handler): this;
	public delete(route: string, handler: Handler): this;
	public delete(...args: unknown[]): this {
		return this.method('DELETE', ...args);
	}
}

export default () => new Router().configure(baseConfig);
