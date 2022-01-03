import { Authenticator, type AuthHandler } from '../Authenticator';
import { Register } from '../Register';
import { handleError } from './helpers';
import type { ResolvedHandler, Context, Handler, Method } from './types';
import type { Config } from '../config';


export class Router {
	protected register: Register = new Register;
	protected authenticator: Authenticator | null = null;
	protected config: Partial<Config> = {};

	public configure(config: Partial<Config>): this {
		this.config = config;
		return this;
	}

	// Middleware
	public auth(authHandler: AuthHandler): this {
		this.authenticator = new Authenticator(authHandler);
		return this;
	}
	public logger(logger: (ctx: Context) => void): this {
		// const consoleLog = console.log;
		// console.log = () => {
		// 	// actually need to pass event to the logger in case they want to do anything with it
		// 	logger({ req: this.context.req, res: this.context.res });
		// 	consoleLog();
		// };
		return this;
	}
	public route(path: string, router: Router): this {
		router.config = { ...this.config, ...router.config };
		if (router.authenticator === null) { router.authenticator = this.authenticator; }
		this.register.registerRouter(path, router);
		return this;
	}

	private matchRoute(route: string, isRouter = false): string | undefined {
		return Object.keys(this.register[isRouter ? 'routers' : 'paths']).find(path => {
			const regex = path.replace(/:[^/]+/g, '[^/]+');
			return route.match(`^${regex}$`);
		});
	}
	private getName(url: string, reducer: string): string {
		const registeredName = Register.getRegisteredName(new URL(url).pathname);
		const reducedName = reducer !== '' ? registeredName.slice(reducer.length) : registeredName;
		return reducedName === '__base_route' || reducedName === '' ? '__base_route' : reducedName;
	}
	protected resolveHandler = (request: Request, reducer = ''): ResolvedHandler => {
		const { method, url } = request;
		let name = this.getName(url, reducer);
		const exactPathMatch = this.matchRoute(name);

		/** 1. Look for the exact path and method */
		if (exactPathMatch && this.register.paths[exactPathMatch][method as Method]) {
			return this.register.paths[exactPathMatch][method as Method] as ResolvedHandler;
		}

		/** 2. Check if valid router exists */
		if (name !== '__base_route') {
			while (name.length > 0) {
				const matchedRouter = this.matchRoute(name, true);

				if (matchedRouter) {
					const router = this.register.routers[matchedRouter];
					return router.resolveHandler(request, reducer + name);
				}

				const dirs = name.split('/');
				name = name.slice(0, -1 - dirs[dirs.length - 1].length);
			}
		}

		/** 3. Check for base route router */
		if (this.register.routers.__base_route) {
			const router = this.register.routers.__base_route;
			return router.resolveHandler(request, reducer);
		}


		/** 4. Check if path is valid but method not implemented */
		if (exactPathMatch) {
			// THIS NEEDS TO USE THIS.CONFIG ONLY IF THAT PROP EXISTS LOCALLY, OTHERWISE USE GLOBAL
			// LIMITATION - ONLY TELLS US ABOUT OTHER METHODS AT THE SAME PATH IN THE CURRENT ROUTER/APP
			// SOLUTION - HAVE AN ALLOW PROPERTY, ONLY ON THE APP (THE SERVER), WHICH IS AN OBJECT THAT TRACKS GLOBAL AND
			// REGISTERED NAME LEVEL ALLOW METHODS
			const methodNotAllowed = handleError((this.config as Config).methodNotAllowed);
			if (methodNotAllowed.status === 405 && this.config.emitAllowHeader === true) {
				methodNotAllowed.headers.set('Allow', Object.keys(this.register.paths[exactPathMatch]).join(', '));
			}

			return {
				handler: () => methodNotAllowed,
				authenticate: this.authenticator !== null,
				routerContext: this
			};
		}


		/** Return the default */
		return {
			handler: () => handleError((this.config as Config).notFound), // PLACEHOLDER
			authenticate: this.authenticator !== null,
			routerContext: this
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
	public put(route: string, authenticate: boolean, handler: Handler): this;
	public put(route: string, handler: Handler): this;
	public put(route: string, ...args: unknown[]) {
		return this.method('PUT', route, ...args);
	}
	public options(route: string, authenticate: boolean, handler: Handler): this;
	public options(route: string, handler: Handler): this;
	public options(route: string, ...args: unknown[]) {
		return this.method('OPTIONS', route, ...args);
	}
}
