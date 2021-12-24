import { Res } from '../Res';
import { AuthHandler, Context, Handler, Method, Register, ResolvedHandler } from './types';
import { JoeyConfig as Config, baseConfig } from './index';
import { Dispatcher } from '../Dispatcher';
import { getRegisteredName, handleError } from './helpers';
import { Authorizer } from '../Authorizer';

export class Router {
	protected register: Register = { paths: {}, routers: {} };
	protected config: Config = baseConfig;
	protected context: Context = { req: new Request(''), res: new Res() };
	protected authorizer: Authorizer | null = null;

	constructor() {
		addEventListener('fetch', (event: FetchEvent): void => {
			const { body, status, headers, prettifyJson } = this.config;
			this.context = {
				req: event.request,
				res: new Res().set({ body, status, headers, pretty: prettifyJson })
			};
			const resolvedHandler = this.resolveHandler(event, this.context.res);
			new Dispatcher(this.config, this.context, this.authorizer).dispatch(event, resolvedHandler);
		});
	}

	/** Config */
	public configure(config: Partial<Config>): this {
		this.config = { ...baseConfig, ...config };
		return this;
	}

	/** Resolvers */
	// Regex match request
	private matchRoute(route: string, isRouter = false) {
		return Object.keys(this.register[isRouter ? 'routers' : 'paths']).find(path => {
			const regex = path.replace(/:[^/]+/g, '[^/]+').concat('$');
			return route.match(regex) || null;
		});
	}
	// This method finds the handler, first checking an exact path, then the routers
	protected resolveHandler(event: FetchEvent, res: Res, reducer = ''): ResolvedHandler {
		const { method, url } = event.request;
		const route = new URL(url).pathname;

		const reducedName = getRegisteredName(route.slice(reducer.length));
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
			const methodNotAllowed = handleError(this.config.methodNotAllowed);
			if (this.config.emitAllowHeader) {
				methodNotAllowed.headers.set('Allow', Object.keys(this.register.paths[exactPathMatch]).join(', '));
			}
			return { handler: () => methodNotAllowed, authenticate: false };
		}

		/** 4. Return the default */
		return {
			handler: () => handleError(this.config.notFound),
			authenticate: false
		};
	}


	/** Middleware */
	public route(path: string, router: Router): this {
		// No error thrown if route already exists, it is overwritten.
		this.register.routers[path] = router;
		return this;
	}
	public auth(authHandler: AuthHandler): this {
		this.authorizer = new Authorizer(authHandler, this.context);
		return this;
	}
	public logger(logger: (ctx: Context) => void): this {
		const consoleLog = console.log;
		console.log = () => {
			logger({ req: this.context.req, res: this.context.res });
			consoleLog();
		};
		return this;
	}


	/**HTTP Method methods */
	// REGISTER
	private registerMethod(method: Method, route: string, handler: Handler, authenticate = true) {
		const registeredName = getRegisteredName(route);
		if (!this.register.paths[registeredName]) this.register.paths[registeredName] = {};
		this.register.paths[registeredName][method] = { handler, authenticate };
	}
	// METHOD
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
